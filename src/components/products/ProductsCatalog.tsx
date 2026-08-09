"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpDown,
  Filter,
  PackageSearch,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import Container from "@/components/ui/Container";
import { catalogProducts } from "@/lib/products";
import {
  PRODUCT_CATEGORIES,
  formatClp,
  type ProductCategory,
} from "@/types/product";

type SortOption = "relevance" | "price-asc" | "price-desc" | "name";

/** 12 productos por página: 4 filas en grid de 3 columnas (rápido y limpio). */
const PAGE_SIZE = 12;

const CATEGORY_IDS = new Set(
  PRODUCT_CATEGORIES.map((c) => c.id).filter((id) => id !== "all"),
);

function parseCategoryParam(
  value: string | null,
): ProductCategory | "all" {
  if (!value) return "all";
  return CATEGORY_IDS.has(value as ProductCategory)
    ? (value as ProductCategory)
    : "all";
}

const sortOptions: { id: SortOption; label: string }[] = [
  { id: "relevance", label: "Relevancia" },
  { id: "price-asc", label: "Precio: menor a mayor" },
  { id: "price-desc", label: "Precio: mayor a menor" },
  { id: "name", label: "Nombre A-Z" },
];

export default function ProductsCatalog() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ProductCategory | "all">(() =>
    parseCategoryParam(searchParams.get("categoria")),
  );
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [onlyStock, setOnlyStock] = useState(true);
  const [maxPrice, setMaxPrice] = useState(() => {
    const prices = catalogProducts
      .map((p) => p.priceNow)
      .filter((p) => p > 0);
    return prices.length > 0 ? Math.max(...prices) : 0;
  });
  const [sort, setSort] = useState<SortOption>("relevance");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const priceBounds = useMemo(() => {
    const prices = catalogProducts
      .map((p) => p.priceNow)
      .filter((p) => p > 0);
    if (prices.length === 0) return { min: 0, max: 0 };
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = catalogProducts.filter((product) => {
      const matchesQuery =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.description?.toLowerCase().includes(q) ||
        product.tags.some((t) => t.label.toLowerCase().includes(q));

      const matchesCategory =
        category === "all" || product.category === category;

      const matchesOffer =
        !onlyOffers ||
        product.featured ||
        product.priceNow < product.priceBefore;

      const matchesStock = !onlyStock || product.inStock !== false;
      const matchesPrice = product.priceNow <= maxPrice;

      return (
        matchesQuery &&
        matchesCategory &&
        matchesOffer &&
        matchesStock &&
        matchesPrice
      );
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.priceNow - b.priceNow;
        case "price-desc":
          return b.priceNow - a.priceNow;
        case "name":
          return a.name.localeCompare(b.name, "es");
        default:
          return Number(b.featured) - Number(a.featured);
      }
    });

    return list;
  }, [query, category, onlyOffers, onlyStock, maxPrice, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const goToPage = (next: number) => {
    setPage(next);
    if (typeof window !== "undefined") {
      document
        .getElementById("catalogo-resultados")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const activeFiltersCount =
    (category !== "all" ? 1 : 0) +
    (onlyOffers ? 1 : 0) +
    (!onlyStock ? 1 : 0) +
    (maxPrice < priceBounds.max ? 1 : 0);

  const clearFilters = () => {
    setCategory("all");
    setOnlyOffers(false);
    setOnlyStock(true);
    setMaxPrice(priceBounds.max);
    setQuery("");
    setSort("relevance");
    setPage(1);
  };

  const FiltersPanel = (
    <div className="space-y-7">
      <div>
        <h3 className="text-sm font-bold text-foreground">Categoría</h3>
        <ul className="mt-3 space-y-1.5">
          {PRODUCT_CATEGORIES.map((item) => {
            const active = category === item.id;
            const count =
              item.id === "all"
                ? catalogProducts.length
                : catalogProducts.filter((p) => p.category === item.id).length;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    setCategory(item.id);
                    setPage(1);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    active
                      ? "bg-brand text-white shadow-sm"
                      : "bg-surface text-foreground hover:bg-brand/8"
                  }`}
                >
                  <span className="font-semibold">{item.label}</span>
                  <span
                    className={`text-xs ${active ? "text-white/80" : "text-neutral"}`}
                  >
                    {count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-foreground">Precio máximo</h3>
          <span className="text-sm font-semibold text-brand">
            {formatClp(maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min={priceBounds.min}
          max={priceBounds.max}
          step={500}
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(Number(e.target.value));
            setPage(1);
          }}
          className="mt-4 w-full accent-brand"
          aria-label="Filtrar por precio máximo"
        />
        <div className="mt-1 flex justify-between text-xs text-neutral">
          <span>{formatClp(priceBounds.min)}</span>
          <span>{formatClp(priceBounds.max)}</span>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-foreground">Opciones</h3>
        <label className="flex cursor-pointer items-center justify-between rounded-xl bg-surface px-3 py-3 text-sm">
          <span className="font-medium text-foreground">Solo ofertas</span>
          <input
            type="checkbox"
            checked={onlyOffers}
            onChange={(e) => {
              setOnlyOffers(e.target.checked);
              setPage(1);
            }}
            className="size-4 accent-brand"
          />
        </label>
        <label className="flex cursor-pointer items-center justify-between rounded-xl bg-surface px-3 py-3 text-sm">
          <span className="font-medium text-foreground">Disponibles</span>
          <input
            type="checkbox"
            checked={onlyStock}
            onChange={(e) => {
              setOnlyStock(e.target.checked);
              setPage(1);
            }}
            className="size-4 accent-brand"
          />
        </label>
      </div>

      {activeFiltersCount > 0 ? (
        <button
          type="button"
          onClick={clearFilters}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-brand/15 bg-white px-4 py-2.5 text-sm font-semibold text-brand transition hover:bg-brand/5"
        >
          <X className="size-4" aria-hidden />
          Limpiar filtros
        </button>
      ) : null}
    </div>
  );

  return (
    <section className="relative bg-[#f5faff]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,_rgb(0_119_200_/_0.12),_transparent_60%)]"
      />

      <Container className="relative py-10 lg:py-12">
        {/* Page header */}
        <div className="mb-8 max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Productos
          </h1>
        </div>

        {/* Search + toolbar */}
        <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Buscar productos</span>
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-neutral"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Buscar: bidón, dispensador, hielo..."
              className="h-13 w-full rounded-2xl border border-brand/10 bg-white pr-4 pl-12 text-sm text-foreground shadow-[0_12px_30px_-20px_rgb(0_86_163_/_0.35)] outline-none transition placeholder:text-neutral focus:border-brand/30 focus:ring-2 focus:ring-brand/15"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="inline-flex h-13 items-center gap-2 rounded-2xl border border-brand/15 bg-white px-4 text-sm font-semibold text-brand lg:hidden"
            >
              <SlidersHorizontal className="size-4" aria-hidden />
              Filtros
              {activeFiltersCount > 0 ? (
                <span className="rounded-full bg-brand px-2 py-0.5 text-xs text-white">
                  {activeFiltersCount}
                </span>
              ) : null}
            </button>

            <label className="inline-flex h-13 items-center gap-2 rounded-2xl border border-brand/15 bg-white px-4 text-sm text-foreground">
              <ArrowUpDown className="size-4 text-brand" aria-hidden />
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as SortOption);
                  setPage(1);
                }}
                className="bg-transparent font-semibold outline-none"
                aria-label="Ordenar productos"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* Category chips */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {PRODUCT_CATEGORIES.map((item) => {
            const active = category === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCategory(item.id);
                  setPage(1);
                }}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-brand text-white"
                    : "bg-white text-brand ring-1 ring-brand/15 hover:bg-brand/5"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Desktop filters */}
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-24 rounded-[1.5rem] bg-white p-5 shadow-[0_16px_40px_-28px_rgb(0_86_163_/_0.35)] ring-1 ring-brand/10">
              <div className="mb-5 flex items-center gap-2">
                <Filter className="size-4 text-brand" aria-hidden />
                <h2 className="text-base font-bold text-foreground">Filtros</h2>
              </div>
              {FiltersPanel}
            </div>
          </aside>

          {/* Results */}
          <div id="catalogo-resultados" className="scroll-mt-24 lg:col-span-9">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-neutral">
                <span className="font-bold text-foreground">
                  {filtered.length}
                </span>{" "}
                {filtered.length === 1 ? "producto" : "productos"}
                {filtered.length > 0 ? (
                  <>
                    {" "}
                    · mostrando{" "}
                    <span className="font-semibold text-foreground">
                      {(currentPage - 1) * PAGE_SIZE + 1}–
                      {Math.min(currentPage * PAGE_SIZE, filtered.length)}
                    </span>
                  </>
                ) : null}
                {query.trim() ? (
                  <>
                    {" "}
                    para{" "}
                    <span className="font-semibold text-brand">
                      “{query.trim()}”
                    </span>
                  </>
                ) : null}
              </p>
              {totalPages > 1 ? (
                <p className="text-xs font-semibold text-neutral">
                  Página {currentPage} de {totalPages}
                </p>
              ) : null}
            </div>

            {filtered.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {pageItems.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                    />
                  ))}
                </div>

                {totalPages > 1 ? (
                  <nav
                    aria-label="Paginación del catálogo"
                    className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-brand/10 pt-6 sm:flex-row"
                  >
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => goToPage(currentPage - 1)}
                      className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-brand/15 bg-white px-4 text-sm font-semibold text-brand transition hover:bg-brand/5 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                    >
                      Anterior
                    </button>

                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => goToPage(n)}
                            aria-label={`Ir a la página ${n}`}
                            aria-current={n === currentPage ? "page" : undefined}
                            className={`flex size-10 items-center justify-center rounded-xl text-sm font-bold transition ${
                              n === currentPage
                                ? "bg-brand text-white"
                                : "bg-white text-brand ring-1 ring-brand/12 hover:bg-brand/5"
                            }`}
                          >
                            {n}
                          </button>
                        ),
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() => goToPage(currentPage + 1)}
                      className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-brand/15 bg-white px-4 text-sm font-semibold text-brand transition hover:bg-brand/5 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                    >
                      Siguiente
                    </button>
                  </nav>
                ) : null}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-[1.75rem] bg-white px-6 py-16 text-center ring-1 ring-brand/10">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-brand/8 text-brand">
                  <PackageSearch className="size-7" aria-hidden />
                </span>
                <h2 className="mt-4 text-lg font-bold text-foreground">
                  {catalogProducts.length === 0
                    ? "Catálogo en preparación"
                    : "No encontramos productos"}
                </h2>
                <p className="mt-2 max-w-sm text-sm text-neutral">
                  {catalogProducts.length === 0
                    ? "Pronto verás aquí las recargas, dispensadores y accesorios Agua Ser Plus."
                    : "Prueba con otra búsqueda o limpia los filtros para ver todo el catálogo."}
                </p>
                {catalogProducts.length > 0 ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-secondary"
                  >
                    Ver todos los productos
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Mobile filters drawer */}
      <AnimatePresence>
        {filtersOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Cerrar filtros"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-[2px] lg:hidden"
              onClick={() => setFiltersOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="fixed inset-y-0 right-0 z-50 w-[min(100%,360px)] overflow-y-auto bg-white p-5 shadow-2xl lg:hidden"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Filtros</h2>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="flex size-10 items-center justify-center rounded-full bg-surface text-brand"
                  aria-label="Cerrar"
                >
                  <X className="size-5" aria-hidden />
                </button>
              </div>
              {FiltersPanel}
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="mt-6 w-full rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white"
              >
                Ver {filtered.length} productos
              </button>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
