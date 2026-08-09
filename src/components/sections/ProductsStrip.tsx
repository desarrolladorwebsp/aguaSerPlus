"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Package } from "lucide-react";
import Link from "next/link";
import ProductStripCard from "@/components/ui/ProductStripCard";
import { catalogProducts } from "@/lib/products";
import Container from "@/components/ui/Container";
import type { ProductCategory } from "@/types/product";

type ProductsStripProps = {
  id?: string;
  headingId?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  category?: ProductCategory;
};

export default function ProductsStrip({
  id = "productos-destacados",
  headingId = "products-strip-heading",
  eyebrow = "Catálogo",
  title = "Nuestros productos",
  description = "Desliza para ver el catálogo. Encuentra recargas, dispensadores y más.",
  ctaLabel = "Ver todos los productos",
  ctaHref = "/productos",
  category,
}: ProductsStripProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const products = catalogProducts.filter((p) => {
    if (p.inStock === false) return false;
    if (category && p.category !== category) return false;
    return true;
  });

  const scrollByCard = (direction: "prev" | "next") => {
    const node = scrollerRef.current;
    if (!node) return;
    const amount = Math.min(240, node.clientWidth * 0.8);
    node.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="relative scroll-mt-20 overflow-hidden bg-surface py-10 sm:scroll-mt-24 sm:py-12"
    >
      <Container className="relative">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
          className="mb-5 flex w-full flex-col gap-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.16em] text-brand-accent uppercase">
              <Package className="size-3.5" aria-hidden />
              {eyebrow}
            </p>
            <h2
              id={headingId}
              className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl"
            >
              {title}
            </h2>
            <p className="mt-1.5 max-w-lg text-sm text-neutral">{description}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByCard("prev")}
              aria-label="Productos anteriores"
              className="flex size-10 items-center justify-center rounded-full border border-brand/15 bg-white text-brand transition hover:bg-brand/5"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard("next")}
              aria-label="Más productos"
              className="flex size-10 items-center justify-center rounded-full border border-brand/15 bg-white text-brand transition hover:bg-brand/5"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-secondary"
            >
              {ctaLabel}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </motion.div>

        <div
          ref={scrollerRef}
          className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <div key={product.id} className="snap-start">
              <ProductStripCard product={product} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
