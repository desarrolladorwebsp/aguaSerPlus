"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Droplets,
  Leaf,
  Lightbulb,
  Minus,
  Plus,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  Snowflake,
  Zap,
} from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import Container from "@/components/ui/Container";
import { useCart } from "@/lib/cart/store";
import {
  getCategoryLabel,
  getRelatedProducts,
} from "@/lib/products";
import type { ProductOffer } from "@/types/product";
import { formatClp } from "@/types/product";

const tintStyles = {
  blue: "from-[#e8f4ff] via-[#f0f8ff] to-white",
  green: "from-[#e8f8f0] via-[#f3fbf6] to-white",
  yellow: "from-[#fff6db] via-[#fffaf0] to-white",
} as const;

const featureIcons = [
  Snowflake,
  RefreshCcw,
  ShieldCheck,
  Lightbulb,
  Droplets,
  Zap,
  BadgeCheck,
  Leaf,
] as const;

type ProductDetailViewProps = {
  product: ProductOffer;
};

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const gallery = useMemo(() => {
    const list = product.images?.length ? product.images : [product.image];
    return Array.from(new Set(list.filter(Boolean)));
  }, [product.image, product.images]);
  const [activeImage, setActiveImage] = useState(gallery[0] ?? product.image);
  const [activeColor, setActiveColor] = useState(
    product.colors?.find((c) => c.image === product.image)?.name ??
      product.colors?.[0]?.name ??
      null,
  );

  const related = getRelatedProducts(product, 4);
  const hasDiscount =
    product.priceNow > 0 && product.priceBefore > product.priceNow;
  const hasCatalogDetail = Boolean(
    product.characteristics?.length ||
      product.features?.length ||
      product.specs?.length ||
      product.colors?.length,
  );

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      image: activeImage || product.image,
      price: product.priceNow,
      qty,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  const selectColor = (name: string, image?: string) => {
    setActiveColor(name);
    if (image) setActiveImage(image);
  };

  return (
    <section className="relative bg-[#f5faff]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_at_top,_rgb(0_119_200_/_0.12),_transparent_60%)]"
      />

      <Container className="relative py-8 sm:py-10 lg:py-12">
        <Link
          href="/productos"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition hover:text-brand-secondary"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Volver al catálogo
        </Link>

        <div className="mt-6 grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Gallery */}
          <div className="min-w-0">
            <div
              className={`relative aspect-square overflow-hidden rounded-[1.75rem] bg-gradient-to-br ring-1 ring-brand/10 ${tintStyles[product.tint]}`}
            >
              <span
                className={`absolute top-4 left-4 z-10 inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold shadow-sm ${
                  product.badgeTone === "green"
                    ? "bg-green text-white"
                    : product.badgeTone === "yellow"
                      ? "bg-yellow text-foreground"
                      : "bg-brand text-white"
                }`}
              >
                {product.badge}
              </span>
              <Image
                src={activeImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-6 sm:p-10"
              />
            </div>

            {gallery.length > 1 ? (
              <ul className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
                {gallery.map((src) => {
                  const active = src === activeImage;
                  return (
                    <li key={src} className="shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveImage(src)}
                        aria-label="Ver imagen del producto"
                        aria-pressed={active}
                        className={`relative size-16 overflow-hidden rounded-xl bg-white transition sm:size-20 ${
                          active
                            ? "ring-2 ring-brand"
                            : "ring-1 ring-brand/10 hover:ring-brand/25"
                        }`}
                      >
                        <Image
                          src={src}
                          alt=""
                          fill
                          sizes="80px"
                          className="object-contain p-2"
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          {/* Buy info */}
          <div className="min-w-0">
            <p className="text-xs font-bold tracking-[0.16em] text-brand-accent uppercase">
              {product.brand
                ? `${product.brand} · ${getCategoryLabel(product.category)}`
                : getCategoryLabel(product.category)}
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {product.name}
            </h1>
            {product.subtitle ? (
              <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-brand">
                {product.subtitle}
              </p>
            ) : null}
            {product.note ? (
              <p className="mt-2 text-sm font-semibold text-neutral">
                {product.note}
              </p>
            ) : null}

            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              {hasDiscount ? (
                <span className="text-lg text-neutral line-through">
                  {formatClp(product.priceBefore)}
                </span>
              ) : null}
              <span className="text-3xl font-extrabold text-brand">
                {formatClp(product.priceNow)}
              </span>
              {product.inStock === false ? (
                <span className="rounded-full bg-surface px-3 py-1 text-xs font-bold text-neutral">
                  Sin stock
                </span>
              ) : (
                <span className="rounded-full bg-green-soft px-3 py-1 text-xs font-bold text-green">
                  Disponible
                </span>
              )}
            </div>

            {product.tags.length > 0 ? (
              <ul className="mt-5 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <li
                    key={tag.label}
                    className="rounded-full border border-brand/10 bg-white px-3 py-1.5 text-xs font-semibold text-neutral"
                  >
                    {tag.label}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-7 rounded-2xl bg-white p-5 ring-1 ring-brand/10">
              <h2 className="text-sm font-bold text-foreground">Descripción</h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral sm:text-[15px]">
                {product.description?.trim() ||
                  `${product.name}. Producto Agua Ser Plus disponible para compra online con despacho en Santiago.`}
              </p>
            </div>

            {product.colors?.length ? (
              <div className="mt-5">
                <h2 className="text-sm font-bold text-foreground">
                  Colores disponibles
                </h2>
                <ul className="mt-3 grid gap-2.5 sm:grid-cols-3">
                  {product.colors.map((color) => {
                    const selected = activeColor === color.name;
                    return (
                      <li key={color.name}>
                        <button
                          type="button"
                          onClick={() => selectColor(color.name, color.image)}
                          className={`flex w-full flex-col gap-2 rounded-xl bg-white p-3 text-left transition ${
                            selected
                              ? "ring-2 ring-brand"
                              : "ring-1 ring-brand/10 hover:ring-brand/25"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className="size-5 rounded-full ring-1 ring-black/10"
                              style={{ backgroundColor: color.swatch }}
                              aria-hidden
                            />
                            <span className="text-sm font-bold text-foreground">
                              {color.name}
                            </span>
                          </span>
                          <span className="text-[11px] leading-snug text-neutral">
                            {color.codes}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="inline-flex items-center self-start rounded-xl bg-white ring-1 ring-brand/10">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Disminuir cantidad"
                  className="flex size-11 items-center justify-center text-brand transition hover:bg-brand/5 disabled:opacity-40"
                  disabled={qty <= 1}
                >
                  <Minus className="size-4" aria-hidden />
                </button>
                <span className="min-w-8 text-center text-sm font-bold tabular-nums">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(99, q + 1))}
                  aria-label="Aumentar cantidad"
                  className="flex size-11 items-center justify-center text-brand transition hover:bg-brand/5"
                >
                  <Plus className="size-4" aria-hidden />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                disabled={product.inStock === false}
                className={`inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition disabled:opacity-50 ${
                  justAdded
                    ? "bg-green text-white"
                    : "bg-green text-white hover:bg-[#189866]"
                }`}
              >
                <ShoppingBag className="size-4" aria-hidden />
                {justAdded ? "Agregado al carro" : "Agregar al carro"}
              </button>
            </div>
          </div>
        </div>

        {/* Catalog-style detail blocks */}
        {hasCatalogDetail ? (
          <div className="mt-12 grid gap-5 lg:grid-cols-12 lg:gap-6">
            {product.characteristics?.length ? (
              <div className="rounded-[1.5rem] bg-white p-6 ring-1 ring-brand/10 lg:col-span-5">
                <p className="text-xs font-bold tracking-[0.16em] text-brand-accent uppercase">
                  Ficha técnica
                </p>
                <h2 className="mt-1 text-xl font-extrabold text-foreground">
                  Características
                </h2>
                <ul className="mt-5 space-y-3">
                  {product.characteristics.map((item) => (
                    <li
                      key={item.label}
                      className="flex items-start justify-between gap-4 border-b border-brand/8 pb-3 text-sm last:border-0 last:pb-0"
                    >
                      <span className="font-semibold text-foreground">
                        {item.label}
                      </span>
                      <span className="shrink-0 text-right text-neutral">
                        {item.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {product.features?.length ? (
              <div className="rounded-[1.5rem] bg-white p-6 ring-1 ring-brand/10 lg:col-span-7">
                <p className="text-xs font-bold tracking-[0.16em] text-brand-accent uppercase">
                  Beneficios
                </p>
                <h2 className="mt-1 text-xl font-extrabold text-foreground">
                  Destacados del equipo
                </h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {product.features.map((feature, index) => {
                    const Icon = featureIcons[index % featureIcons.length];
                    return (
                      <li
                        key={feature}
                        className="flex items-start gap-3 rounded-xl bg-surface/80 px-3.5 py-3"
                      >
                        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                          <Icon className="size-4" aria-hidden />
                        </span>
                        <span className="text-sm font-semibold leading-snug text-foreground">
                          {feature}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}

            {product.specs?.length ? (
              <div className="overflow-hidden rounded-[1.5rem] bg-[#041a2e] p-6 text-white lg:col-span-12">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-bold tracking-[0.16em] text-brand-accent uppercase">
                      Especificaciones
                    </p>
                    <h2 className="mt-1 text-xl font-extrabold">
                      Datos eléctricos
                    </h2>
                  </div>
                  {product.brand ? (
                    <p className="text-sm font-semibold text-white/55">
                      {product.brand} · Purificadores
                    </p>
                  ) : null}
                </div>
                <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                  {product.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="rounded-2xl bg-white/6 px-4 py-4 ring-1 ring-white/10"
                    >
                      <dt className="text-xs font-semibold tracking-wide text-white/55 uppercase">
                        {spec.label}
                      </dt>
                      <dd className="mt-1.5 text-lg font-extrabold text-white">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </div>
        ) : null}

        {related.length > 0 ? (
          <div className="mt-14 border-t border-brand/10 pt-10 sm:mt-16">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-brand-accent uppercase">
                  También te puede interesar
                </p>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">
                  Productos relacionados
                </h2>
              </div>
              <Link
                href="/productos"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
              >
                Ver catálogo
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>

            <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
              {related.map((item, index) => (
                <div
                  key={item.id}
                  className="w-[min(100%,270px)] shrink-0 snap-start md:w-full"
                >
                  <ProductCard product={item} index={index} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
