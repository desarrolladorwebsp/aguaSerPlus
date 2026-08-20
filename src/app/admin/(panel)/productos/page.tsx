"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Eye,
  ImagePlus,
  LayoutGrid,
  List,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useAdminStore } from "@/lib/admin/store";
import type {
  AdminProduct,
  AdminProductStatus,
} from "@/lib/admin/types";
import type { ProductColorOption, ProductSpec } from "@/types/product";
import {
  PRODUCT_STATUS_LABELS,
  adminProductHasDiscount,
  adminProductPrice,
  adminProductPrimaryImage,
} from "@/lib/admin/types";
import { formatClp } from "@/types/product";
import {
  AdminModal,
  ConfirmDialog,
  Field,
  fieldClass,
  textareaClass,
} from "@/components/admin/ui";

const PAGE_SIZE = 8;
const MAX_IMAGES = 3;
const FALLBACK_IMAGE = "/products/hero-jug-splash.png";

const COLOR_PALETTE = [
  { name: "Azul", value: "#2563eb" },
  { name: "Turquesa", value: "#14b8a6" },
  { name: "Verde", value: "#16a34a" },
  { name: "Amarillo", value: "#facc15" },
  { name: "Naranja", value: "#f97316" },
  { name: "Rojo", value: "#dc2626" },
  { name: "Rosa", value: "#ec4899" },
  { name: "Morado", value: "#7c3aed" },
  { name: "Negro", value: "#111111" },
  { name: "Blanco", value: "#f8fafc" },
  { name: "Gris", value: "#64748b" },
  { name: "Café", value: "#92400e" },
] as const;

type ColorDraft = {
  id: string;
  swatch: string;
};

type Draft = {
  title: string;
  sku: string;
  priceNormal: string;
  priceSale: string;
  stock: string;
  categoryId: string;
  images: [string, string, string];
  status: AdminProductStatus;
  description: string;
  characteristicsText: string;
  colors: ColorDraft[];
};

function createColorDraft(swatch = "#4f46e5") {
  return {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    swatch,
  } as ColorDraft;
}

const emptyDraft = (categoryId: string): Draft => ({
  title: "",
  sku: "",
  priceNormal: "0",
  priceSale: "0",
  stock: "0",
  categoryId,
  images: ["", "", ""],
  status: "active",
  description: "",
  characteristicsText: "",
  colors: [createColorDraft()],
});

function toImageSlots(images: string[]): [string, string, string] {
  return [images[0] ?? "", images[1] ?? "", images[2] ?? ""];
}

function normalizeImages(images: string[]): string[] {
  const cleaned = images.map((src) => src.trim()).filter(Boolean).slice(0, MAX_IMAGES);
  return cleaned.length > 0 ? cleaned : [FALLBACK_IMAGE];
}

function isBlobMedia(src: string) {
  return src.startsWith("/api/media/");
}

function parseCharacteristics(text: string): ProductSpec[] {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf(":");
      if (separatorIndex <= 0) return null;
      const label = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();
      return label && value ? { label, value } : null;
    })
    .filter((item): item is ProductSpec => Boolean(item));
}

function formatCharacteristics(items?: ProductSpec[]): string {
  return (items ?? []).map((item) => `${item.label}: ${item.value}`).join("\n");
}

export default function AdminProductsPage() {
  const {
    products,
    productsLoading,
    productsError,
    categories,
    refreshProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useAdminStore();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AdminProductStatus>(
    "all",
  );
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [view, setView] = useState<"table" | "grid">("table");
  const [page, setPage] = useState(1);

  const [modal, setModal] = useState<"create" | "edit" | "view" | null>(null);
  const [selected, setSelected] = useState<AdminProduct | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft(categories[0]?.id ?? ""));
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [syncingCatalog, setSyncingCatalog] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? id;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      const matchCat =
        categoryFilter === "all" || p.categoryId === categoryFilter;
      return matchQ && matchStatus && matchCat;
    });
  }, [products, query, statusFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const openCreate = () => {
    setSelected(null);
    setFormError(null);
    setDraft(emptyDraft(categories[0]?.id ?? "recargas"));
    setModal("create");
  };

  const syncCatalog = async () => {
    setSyncingCatalog(true);
    setFormError(null);
    try {
      const res = await fetch("/api/admin/products/sync", {
        method: "POST",
      });
      const json = (await res.json()) as {
        success?: boolean;
        error?: string;
        count?: number;
      };
      if (!res.ok || !json.success) {
        throw new Error(json.error || "No se pudo sincronizar el catálogo.");
      }
      await refreshProducts();
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "No se pudo sincronizar el catálogo.",
      );
    } finally {
      setSyncingCatalog(false);
    }
  };

  const openEdit = (product: AdminProduct) => {
    setSelected(product);
    setFormError(null);
    setDraft({
      title: product.title,
      sku: product.sku,
      priceNormal: String(product.priceNormal),
      priceSale: String(product.priceSale),
      stock: String(product.stock),
      categoryId: product.categoryId,
      images: toImageSlots(product.images),
      status: product.status,
      description: product.description ?? "",
      characteristicsText: formatCharacteristics(product.characteristics),
      colors: (product.colors ?? []).map((color) => ({
        id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
        swatch: color.swatch || "#4f46e5",
      })),
    });
    setModal("edit");
  };

  const openView = (product: AdminProduct) => {
    setSelected(product);
    setModal("view");
  };

  const save = async () => {
    const priceNormal = Math.max(0, Number(draft.priceNormal) || 0);
    let priceSale = Math.max(0, Number(draft.priceSale) || 0);
    if (priceSale > 0 && priceSale >= priceNormal) {
      priceSale = 0;
    }
    const payload = {
      title: draft.title.trim(),
      sku: draft.sku.trim(),
      priceNormal,
      priceSale,
      stock: Math.max(0, Number(draft.stock) || 0),
      categoryId: draft.categoryId,
      images: normalizeImages(draft.images),
      status: draft.status,
      description: draft.description.trim() || undefined,
      characteristics: parseCharacteristics(draft.characteristicsText),
      colors: draft.colors
        .filter((color) => Boolean(color.swatch))
        .map((color, index) => {
          const colorName =
            COLOR_PALETTE.find((paletteColor) => paletteColor.value === color.swatch)?.name ??
            `Color ${index + 1}`;

          return {
            name: colorName,
            codes: color.swatch,
            swatch: color.swatch,
          };
        }),
    };
    if (!payload.title || !payload.sku) return;

    setSaving(true);
    setFormError(null);
    try {
      if (modal === "create") {
        await createProduct(payload);
      } else if (modal === "edit" && selected) {
        await updateProduct(selected.id, payload);
      }
      setModal(null);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el producto.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-brand-accent uppercase">
            Catálogo
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">
            Gestión de productos
          </h1>
          <p className="mt-1 text-sm text-neutral">
            {filtered.length} resultado{filtered.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={syncCatalog}
            disabled={syncingCatalog}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-brand/15 bg-white px-4 text-sm font-bold text-brand transition hover:bg-brand/5 disabled:opacity-60"
          >
            {syncingCatalog ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Sincronizando…
              </>
            ) : (
              "Sincronizar catálogo"
            )}
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-bold text-white transition hover:bg-brand-secondary"
          >
            <Plus className="size-4" aria-hidden />
            Agregar producto
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 ring-1 ring-brand/10 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Buscar</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral"
            aria-hidden
          />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar por título o SKU…"
            className="h-11 w-full rounded-xl border border-brand/10 bg-surface/40 pr-3 pl-10 text-sm outline-none focus:border-brand/25 focus:ring-2 focus:ring-brand/10"
          />
        </label>
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="h-11 rounded-xl border border-brand/10 bg-surface/40 px-3 text-sm"
        >
          <option value="all">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as "all" | AdminProductStatus);
            setPage(1);
          }}
          className="h-11 rounded-xl border border-brand/10 bg-surface/40 px-3 text-sm"
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>
        <div className="inline-flex rounded-xl border border-brand/10 p-1">
          <button
            type="button"
            onClick={() => setView("table")}
            className={`flex size-9 items-center justify-center rounded-lg ${
              view === "table" ? "bg-brand text-white" : "text-neutral"
            }`}
            aria-label="Vista tabla"
          >
            <List className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setView("grid")}
            className={`flex size-9 items-center justify-center rounded-lg ${
              view === "grid" ? "bg-brand text-white" : "text-neutral"
            }`}
            aria-label="Vista grid"
          >
            <LayoutGrid className="size-4" aria-hidden />
          </button>
        </div>
      </div>

      {productsError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {productsError}
        </p>
      ) : null}

      {productsLoading ? (
        <p className="flex items-center gap-2 text-sm text-neutral">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Cargando productos desde la base de datos…
        </p>
      ) : null}

      {view === "table" ? (
        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-brand/10">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-brand/8 bg-surface/60 text-xs font-bold tracking-wide text-neutral uppercase">
                <tr>
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand/6">
                {pageItems.map((p) => (
                  <tr key={p.id} className="hover:bg-surface/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-surface ring-1 ring-brand/10">
                          <Image
                            src={adminProductPrimaryImage(p)}
                            alt=""
                            fill
                            unoptimized={isBlobMedia(adminProductPrimaryImage(p))}
                            className="object-contain p-1"
                            sizes="44px"
                          />
                        </span>
                        <span className="max-w-[220px] font-semibold text-foreground">
                          {p.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-neutral">
                      {p.sku}
                    </td>
                    <td className="px-4 py-3">
                      <PriceCell product={p} />
                    </td>
                    <td className="px-4 py-3">{p.stock}</td>
                    <td className="px-4 py-3 text-neutral">
                      {categoryName(p.categoryId)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={p.status} />
                    </td>
                    <td className="px-4 py-3">
                      <RowActions
                        onView={() => openView(p)}
                        onEdit={() => openEdit(p)}
                        onDelete={() => setDeleteId(p.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pageItems.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-neutral">
              No hay productos con estos filtros.
            </p>
          ) : null}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {pageItems.map((p) => (
            <article
              key={p.id}
              className="overflow-hidden rounded-2xl bg-white ring-1 ring-brand/10"
            >
              <div className="relative aspect-[4/3] bg-surface">
                <Image
                  src={adminProductPrimaryImage(p)}
                  alt={p.title}
                  fill
                  unoptimized={isBlobMedia(adminProductPrimaryImage(p))}
                  className="object-contain p-4"
                  sizes="300px"
                />
              </div>
              <div className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-foreground">
                    {p.title}
                  </h3>
                  <StatusPill status={p.status} />
                </div>
                <p className="text-xs text-neutral">
                  {p.sku} · {categoryName(p.categoryId)}
                </p>
                <PriceCell product={p} />
                <RowActions
                  onView={() => openView(p)}
                  onEdit={() => openEdit(p)}
                  onDelete={() => setDeleteId(p.id)}
                />
              </div>
            </article>
          ))}
        </div>
      )}

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onChange={setPage}
      />

      <AdminModal
        open={modal === "create" || modal === "edit"}
        title={modal === "create" ? "Agregar producto" : "Editar producto"}
        onClose={() => setModal(null)}
        wide
      >
        <ProductForm
          draft={draft}
          categories={categories}
          onChange={setDraft}
          onSubmit={save}
          submitLabel={modal === "create" ? "Crear producto" : "Guardar cambios"}
          saving={saving}
          error={formError}
        />
      </AdminModal>

      <AdminModal
        open={modal === "view" && Boolean(selected)}
        title="Detalle del producto"
        onClose={() => setModal(null)}
      >
        {selected ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {normalizeImages(selected.images).map((src, index) => (
                <div
                  key={`${src}-${index}`}
                  className="relative aspect-square overflow-hidden rounded-xl bg-surface ring-1 ring-brand/10"
                >
                  <Image
                    src={src}
                    alt={`${selected.title} ${index + 1}`}
                    fill
                    unoptimized={isBlobMedia(src)}
                    className="object-contain p-2"
                    sizes="120px"
                  />
                  {index === 0 ? (
                    <span className="absolute top-1.5 left-1.5 rounded-md bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white">
                      Principal
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
            <dl className="space-y-2 text-sm">
              <Detail label="Título" value={selected.title} />
              <Detail label="SKU" value={selected.sku} />
              <Detail
                label="Precio normal"
                value={formatClp(selected.priceNormal)}
              />
              <Detail
                label="Precio con descuento"
                value={
                  selected.priceSale > 0
                    ? formatClp(selected.priceSale)
                    : "Sin descuento"
                }
              />
              <Detail
                label="Precio efectivo"
                value={formatClp(adminProductPrice(selected))}
              />
              <Detail label="Stock" value={String(selected.stock)} />
              <Detail
                label="Categoría"
                value={categoryName(selected.categoryId)}
              />
              <Detail
                label="Estado"
                value={PRODUCT_STATUS_LABELS[selected.status]}
              />
              {selected.description ? (
                <Detail label="Descripción" value={selected.description} />
              ) : null}
              {selected.characteristics?.length ? (
                <Detail
                  label="Características"
                  value={selected.characteristics
                    .map((item) => `${item.label}: ${item.value}`)
                    .join(" · ")}
                />
              ) : null}
              {selected.colors?.length ? (
                <Detail
                  label="Colores"
                  value={selected.colors
                    .map((color) => `${color.name} (${color.codes || color.swatch})`)
                    .join(", ")}
                />
              ) : null}
            </dl>
            <button
              type="button"
              onClick={() => openEdit(selected)}
              className="h-11 w-full rounded-xl bg-brand text-sm font-bold text-white"
            >
              Editar
            </button>
          </div>
        ) : null}
      </AdminModal>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Eliminar producto"
        message="Se eliminará el producto de la base de datos. ¿Continuar?"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (!deleteId) return;
          void deleteProduct(deleteId).finally(() => setDeleteId(null));
        }}
      />
    </div>
  );
}

function StatusPill({ status }: { status: AdminProductStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${
        status === "active"
          ? "bg-green-soft text-green"
          : "bg-surface text-neutral"
      }`}
    >
      {PRODUCT_STATUS_LABELS[status]}
    </span>
  );
}

function PriceCell({ product }: { product: AdminProduct }) {
  const hasDiscount = adminProductHasDiscount(product);
  const effective = adminProductPrice(product);

  return (
    <div className="leading-tight">
      {hasDiscount ? (
        <>
          <p className="text-xs text-neutral line-through">
            {formatClp(product.priceNormal)}
          </p>
          <p className="font-bold text-brand">{formatClp(effective)}</p>
        </>
      ) : (
        <p className="font-semibold text-brand">{formatClp(effective)}</p>
      )}
    </div>
  );
}

function RowActions({
  onView,
  onEdit,
  onDelete,
}: {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex justify-end gap-1">
      <IconBtn label="Ver" onClick={onView}>
        <Eye className="size-4" />
      </IconBtn>
      <IconBtn label="Editar" onClick={onEdit}>
        <Pencil className="size-4" />
      </IconBtn>
      <IconBtn label="Eliminar" onClick={onDelete} danger>
        <Trash2 className="size-4" />
      </IconBtn>
    </div>
  );
}

function IconBtn({
  label,
  onClick,
  children,
  danger,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex size-8 items-center justify-center rounded-lg transition ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-brand hover:bg-brand/8"
      }`}
    >
      {children}
    </button>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-neutral">{label}</dt>
      <dd className="mt-0.5 text-foreground">{value}</dd>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-xs text-neutral">
        Página {page} de {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="h-9 rounded-lg border border-brand/15 px-3 text-sm font-semibold text-brand disabled:opacity-40"
        >
          Anterior
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          className="h-9 rounded-lg border border-brand/15 px-3 text-sm font-semibold text-brand disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

function ProductForm({
  draft,
  categories,
  onChange,
  onSubmit,
  submitLabel,
  saving,
  error,
}: {
  draft: Draft;
  categories: { id: string; name: string }[];
  onChange: (d: Draft) => void;
  onSubmit: () => void;
  submitLabel: string;
  saving?: boolean;
  error?: string | null;
}) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const setImageAt = (index: number, value: string) => {
    const next = [...draft.images] as [string, string, string];
    next[index] = value;
    onChange({ ...draft, images: next });
  };

  const uploadImage = async (index: number, file: File | undefined) => {
    if (!file) return;
    setUploadError(null);
    setUploadingIndex(index);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const json = (await res.json()) as {
        success?: boolean;
        data?: { mediaUrl: string };
        error?: string;
      };
      if (!res.ok || !json.success || !json.data?.mediaUrl) {
        throw new Error(json.error || "No se pudo subir la imagen.");
      }
      setImageAt(index, json.data.mediaUrl);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Error al subir la imagen.",
      );
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="sm:col-span-2">
        <Field label="Título">
          <input
            required
            className={fieldClass}
            value={draft.title}
            onChange={(e) => onChange({ ...draft, title: e.target.value })}
          />
        </Field>
      </div>
      <Field label="SKU">
        <input
          required
          className={fieldClass}
          value={draft.sku}
          onChange={(e) => onChange({ ...draft, sku: e.target.value })}
        />
      </Field>
      <Field label="Stock">
        <input
          type="number"
          min={0}
          className={fieldClass}
          value={draft.stock}
          onChange={(e) => onChange({ ...draft, stock: e.target.value })}
        />
      </Field>
      <Field label="Precio normal (CLP)">
        <input
          type="number"
          min={0}
          required
          className={fieldClass}
          value={draft.priceNormal}
          onChange={(e) => onChange({ ...draft, priceNormal: e.target.value })}
          placeholder="Ej: 100000"
        />
      </Field>
      <Field label="Precio con descuento (CLP)">
        <input
          type="number"
          min={0}
          className={fieldClass}
          value={draft.priceSale}
          onChange={(e) => onChange({ ...draft, priceSale: e.target.value })}
          placeholder="0 = sin descuento"
        />
        <span className="mt-1 block text-xs text-neutral">
          Déjalo en 0 si no hay oferta. Debe ser menor al precio normal.
        </span>
      </Field>
      <Field label="Categoría">
        <select
          className={fieldClass}
          value={draft.categoryId}
          onChange={(e) => onChange({ ...draft, categoryId: e.target.value })}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Estado">
        <select
          className={fieldClass}
          value={draft.status}
          onChange={(e) =>
            onChange({
              ...draft,
              status: e.target.value as AdminProductStatus,
            })
          }
        >
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>
      </Field>
      <div className="sm:col-span-2">
        <div className="mb-2 flex items-end justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">
            Imágenes (hasta 3)
          </span>
          <span className="text-xs text-neutral">
            Se guardan en Vercel Blob · Neon
          </span>
        </div>
        <div className="space-y-3">
          {draft.images.map((src, index) => {
            const busy = uploadingIndex === index;
            return (
              <div key={index} className="flex gap-3">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-surface ring-1 ring-brand/10">
                  {src.trim() ? (
                    <Image
                      src={src.trim()}
                      alt=""
                      fill
                      unoptimized={isBlobMedia(src)}
                      className="object-contain p-1"
                      sizes="64px"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center text-[10px] text-neutral">
                      {index + 1}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-neutral">
                      Imagen {index + 1}
                      {index === 0 ? " · principal" : " · opcional"}
                    </span>
                    {src.trim() ? (
                      <button
                        type="button"
                        onClick={() => setImageAt(index, "")}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
                      >
                        <X className="size-3" aria-hidden />
                        Quitar
                      </button>
                    ) : null}
                  </div>
                  <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-brand/25 bg-surface/50 px-3 text-sm font-semibold text-brand transition hover:border-brand/40 hover:bg-white">
                    {busy ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                        Subiendo…
                      </>
                    ) : (
                      <>
                        <ImagePlus className="size-4" aria-hidden />
                        {src.trim() ? "Reemplazar imagen" : "Subir imagen"}
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="sr-only"
                      disabled={busy || saving}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        e.target.value = "";
                        void uploadImage(index, file);
                      }}
                    />
                  </label>
                  {src.trim() ? (
                    <p className="truncate font-mono text-[10px] text-neutral">
                      {src}
                    </p>
                  ) : index === 0 ? (
                    <p className="text-xs text-neutral">
                      Obligatoria al guardar (o se usa imagen por defecto).
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
        {uploadError ? (
          <p className="mt-2 text-sm text-red-600">{uploadError}</p>
        ) : null}
      </div>
      <div className="sm:col-span-2">
        <Field label="Descripción">
          <textarea
            rows={3}
            className={textareaClass}
            value={draft.description}
            onChange={(e) =>
              onChange({ ...draft, description: e.target.value })
            }
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Características (una por línea: Etiqueta: Valor)">
          <textarea
            rows={4}
            className={textareaClass}
            value={draft.characteristicsText}
            onChange={(e) =>
              onChange({ ...draft, characteristicsText: e.target.value })
            }
            placeholder="Capacidad: 20 L/h"
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">
            Colores
          </span>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...draft,
                colors: [...draft.colors, createColorDraft()],
              })
            }
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
          >
            <Plus className="size-3.5" aria-hidden />
            Agregar color
          </button>
        </div>
        <div className="space-y-3">
          {draft.colors.map((color, index) => (
            <div
              key={color.id}
              className="rounded-xl border border-brand/10 bg-surface/40 p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {`Color ${index + 1}`}
                </span>
                {draft.colors.length > 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...draft,
                        colors: draft.colors.filter((item) => item.id !== color.id),
                      })
                    }
                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
                  >
                    <X className="size-3.5" aria-hidden />
                    Quitar
                  </button>
                ) : null}
              </div>

              <div className="mt-3 rounded-lg border border-brand/10 bg-white p-2.5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral">
                  Selecciona un color
                </p>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PALETTE.map((paletteColor) => {
                    const selected = color.swatch === paletteColor.value;
                    return (
                      <button
                        key={paletteColor.value}
                        type="button"
                        onClick={() => {
                          const nextColors = [...draft.colors];
                          nextColors[index] = {
                            ...nextColors[index],
                            swatch: paletteColor.value,
                          };
                          onChange({ ...draft, colors: nextColors });
                        }}
                        className={`flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-xs font-semibold transition ${
                          selected
                            ? "border-brand bg-brand/8 text-brand"
                            : "border-brand/10 bg-white text-foreground hover:border-brand/25"
                        }`}
                      >
                        <span
                          className="size-4 rounded-full border border-black/10"
                          style={{ backgroundColor: paletteColor.value }}
                          aria-hidden
                        />
                        {paletteColor.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {error ? (
        <p className="sm:col-span-2 text-sm text-red-600">{error}</p>
      ) : null}
      <div className="sm:col-span-2 flex justify-end gap-2 pt-1">
        <button
          type="submit"
          disabled={saving || uploadingIndex !== null}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-white hover:bg-brand-secondary disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Guardando…
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
