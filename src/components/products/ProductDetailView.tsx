"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
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

type ProductDetailViewProps = {
  product: ProductOffer;
};

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const related = getRelatedProducts(product, 4);
  const hasDiscount =
    product.priceNow > 0 && product.priceBefore > product.priceNow;

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.priceNow,
      qty,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
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
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-8 sm:p-12"
            />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold tracking-[0.16em] text-brand-accent uppercase">
              {getCategoryLabel(product.category)}
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {product.name}
            </h1>
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
                    : "bg-brand text-white hover:bg-brand-secondary"
                }`}
              >
                <ShoppingBag className="size-4" aria-hidden />
                {justAdded ? "Agregado al carro" : "Agregar al carro"}
              </button>
            </div>
          </div>
        </div>

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
