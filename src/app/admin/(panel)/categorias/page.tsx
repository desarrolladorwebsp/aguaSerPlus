"use client";

import { useMemo, useState } from "react";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useAdminStore } from "@/lib/admin/store";
import type { AdminCategory } from "@/lib/admin/types";
import {
  AdminModal,
  ConfirmDialog,
  Field,
  fieldClass,
  textareaClass,
} from "@/components/admin/ui";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type Draft = {
  name: string;
  slug: string;
  description: string;
};

const emptyDraft: Draft = { name: "", slug: "", description: "" };

export default function AdminCategoriesPage() {
  const {
    categories,
    productCountByCategory,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useAdminStore();

  const [modal, setModal] = useState<"create" | "edit" | "view" | null>(null);
  const [selected, setSelected] = useState<AdminCategory | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      [...categories].sort((a, b) => a.name.localeCompare(b.name, "es")),
    [categories],
  );

  const openCreate = () => {
    setSelected(null);
    setDraft(emptyDraft);
    setError(null);
    setModal("create");
  };

  const openEdit = (cat: AdminCategory) => {
    setSelected(cat);
    setDraft({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
    });
    setError(null);
    setModal("edit");
  };

  const openView = (cat: AdminCategory) => {
    setSelected(cat);
    setModal("view");
  };

  const save = () => {
    const name = draft.name.trim();
    const slug = (draft.slug.trim() || slugify(name)).trim();
    if (!name || !slug) {
      setError("Nombre y slug son obligatorios.");
      return;
    }
    const payload = {
      name,
      slug,
      description: draft.description.trim(),
    };
    if (modal === "create") {
      createCategory(payload);
    } else if (modal === "edit" && selected) {
      updateCategory(selected.id, payload);
    }
    setModal(null);
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-brand-accent uppercase">
            Catálogo
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">
            Gestión de categorías
          </h1>
          <p className="mt-1 text-sm text-neutral">
            {categories.length} categorí
            {categories.length === 1 ? "a" : "as"}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-bold text-white transition hover:bg-brand-secondary"
        >
          <Plus className="size-4" aria-hidden />
          Nueva categoría
        </button>
      </header>

      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-brand/10">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-brand/8 bg-surface/60 text-xs font-bold tracking-wide text-neutral uppercase">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Descripción</th>
                <th className="px-4 py-3">Productos</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand/6">
              {rows.map((cat) => (
                <tr key={cat.id} className="hover:bg-surface/40">
                  <td className="px-4 py-3 font-semibold text-foreground">
                    {cat.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-neutral">
                    {cat.slug}
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-neutral">
                    {cat.description || "—"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-brand">
                    {productCountByCategory[cat.id] ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        aria-label="Ver"
                        onClick={() => openView(cat)}
                        className="flex size-8 items-center justify-center rounded-lg text-brand hover:bg-brand/8"
                      >
                        <Eye className="size-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Editar"
                        onClick={() => openEdit(cat)}
                        className="flex size-8 items-center justify-center rounded-lg text-brand hover:bg-brand/8"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Eliminar"
                        onClick={() => setDeleteId(cat.id)}
                        className="flex size-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdminModal
        open={modal === "create" || modal === "edit"}
        title={modal === "create" ? "Nueva categoría" : "Editar categoría"}
        onClose={() => setModal(null)}
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <Field label="Nombre">
            <input
              required
              className={fieldClass}
              value={draft.name}
              onChange={(e) => {
                const name = e.target.value;
                setDraft((d) => ({
                  ...d,
                  name,
                  slug:
                    modal === "create" || !d.slug
                      ? slugify(name)
                      : d.slug,
                }));
              }}
            />
          </Field>
          <Field label="Slug">
            <input
              required
              className={fieldClass}
              value={draft.slug}
              onChange={(e) =>
                setDraft((d) => ({ ...d, slug: slugify(e.target.value) }))
              }
            />
          </Field>
          <Field label="Descripción">
            <textarea
              rows={3}
              className={textareaClass}
              value={draft.description}
              onChange={(e) =>
                setDraft((d) => ({ ...d, description: e.target.value }))
              }
            />
          </Field>
          {error ? (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="h-11 w-full rounded-xl bg-brand text-sm font-bold text-white hover:bg-brand-secondary"
          >
            {modal === "create" ? "Crear categoría" : "Guardar cambios"}
          </button>
        </form>
      </AdminModal>

      <AdminModal
        open={modal === "view" && Boolean(selected)}
        title="Detalle de categoría"
        onClose={() => setModal(null)}
      >
        {selected ? (
          <div className="space-y-3 text-sm">
            <p>
              <span className="block text-xs font-semibold text-neutral">
                Nombre
              </span>
              <span className="font-bold text-foreground">{selected.name}</span>
            </p>
            <p>
              <span className="block text-xs font-semibold text-neutral">
                Slug
              </span>
              <span className="font-mono text-foreground">{selected.slug}</span>
            </p>
            <p>
              <span className="block text-xs font-semibold text-neutral">
                Descripción
              </span>
              <span className="text-foreground">
                {selected.description || "Sin descripción"}
              </span>
            </p>
            <p>
              <span className="block text-xs font-semibold text-neutral">
                Productos asociados
              </span>
              <span className="text-lg font-extrabold text-brand">
                {productCountByCategory[selected.id] ?? 0}
              </span>
            </p>
          </div>
        ) : null}
      </AdminModal>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Eliminar categoría"
        message={
          deleteId && (productCountByCategory[deleteId] ?? 0) > 0
            ? "No se puede eliminar: hay productos asociados. Reasigna o elimina esos productos primero."
            : "¿Eliminar esta categoría de la sesión?"
        }
        confirmLabel={
          deleteId && (productCountByCategory[deleteId] ?? 0) > 0
            ? "Entendido"
            : "Eliminar"
        }
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (!deleteId) return;
          if ((productCountByCategory[deleteId] ?? 0) > 0) {
            setDeleteId(null);
            return;
          }
          deleteCategory(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}
