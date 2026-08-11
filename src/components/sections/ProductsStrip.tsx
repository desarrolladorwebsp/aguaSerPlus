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
  tone?: "blue" | "green" | "yellow";
};

const toneStyles = {
  blue: {
    badge: "bg-gradient-to-r from-brand to-brand-accent text-white",
    cta: "from-brand to-brand-secondary shadow-[0_16px_36px_-16px_rgb(0_86_163_/_0.45)] hover:shadow-[0_20px_44px_-14px_rgb(0_86_163_/_0.55)]",
    arrowHover: "hover:bg-brand hover:text-white hover:border-brand",
    glow: "radial-gradient(ellipse 45% 55% at 100% 0%, rgb(0 153 221 / 0.1), transparent 55%), radial-gradient(ellipse 40% 40% at 0% 100%, rgb(0 86 163 / 0.06), transparent 50%)",
  },
  green: {
    badge: "bg-gradient-to-r from-green to-brand-accent text-white",
    cta: "from-green to-[#189866] shadow-[0_16px_36px_-16px_rgb(31_169_122_/_0.45)] hover:shadow-[0_20px_44px_-14px_rgb(31_169_122_/_0.55)]",
    arrowHover: "hover:bg-green hover:text-white hover:border-green",
    glow: "radial-gradient(ellipse 45% 55% at 100% 0%, rgb(31 169 122 / 0.12), transparent 55%), radial-gradient(ellipse 40% 40% at 0% 100%, rgb(0 153 221 / 0.06), transparent 50%)",
  },
  yellow: {
    badge: "bg-gradient-to-r from-yellow to-[#f0b429] text-foreground",
    cta: "from-brand to-brand-secondary shadow-[0_16px_36px_-16px_rgb(0_86_163_/_0.45)] hover:shadow-[0_20px_44px_-14px_rgb(0_86_163_/_0.55)]",
    arrowHover: "hover:bg-yellow hover:text-foreground hover:border-yellow",
    glow: "radial-gradient(ellipse 45% 55% at 100% 0%, rgb(240 180 41 / 0.14), transparent 55%), radial-gradient(ellipse 40% 40% at 0% 100%, rgb(31 169 122 / 0.06), transparent 50%)",
  },
} as const;

export default function ProductsStrip({
  id = "productos-destacados",
  headingId = "products-strip-heading",
  eyebrow = "Catálogo",
  title = "Nuestros productos",
  description = "Desliza para ver el catálogo. Encuentra recargas, dispensadores y más.",
  ctaLabel = "Ver todos los productos",
  ctaHref = "/productos",
  category,
  tone = "blue",
}: ProductsStripProps) {
  const t = toneStyles[tone];
  const arrowBtnClass = `flex size-11 items-center justify-center rounded-full border border-brand/15 bg-white/95 text-brand shadow-[0_12px_28px_-14px_rgb(12_45_74_/_0.45)] backdrop-blur-sm transition ${t.arrowHover}`;
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
      className="relative scroll-mt-20 overflow-x-clip overflow-y-visible bg-surface py-10 sm:scroll-mt-24 sm:py-12"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: t.glow }}
      />

      <Container className="relative">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
          className="mb-5 flex w-full flex-col gap-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-[0.1em] uppercase shadow-sm ${t.badge}`}
            >
              <Package className="size-3.5" aria-hidden />
              {eyebrow}
            </span>
            <h2
              id={headingId}
              className="mt-2.5 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl"
            >
              {title}
            </h2>
            <p className="mt-1.5 max-w-lg text-sm text-neutral">{description}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => scrollByCard("prev")}
                aria-label="Productos anteriores"
                className={arrowBtnClass}
              >
                <ChevronLeft className="size-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard("next")}
                aria-label="Más productos"
                className={arrowBtnClass}
              >
                <ChevronRight className="size-5" aria-hidden />
              </button>
            </div>
            <Link
              href={ctaHref}
              className={`group inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-4 py-2.5 text-sm font-semibold text-white transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${t.cta}`}
            >
              {ctaLabel}
              <ArrowRight
                className="size-4 transition group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </div>
        </motion.div>

        <div className="relative">
          <button
            type="button"
            onClick={() => scrollByCard("prev")}
            aria-label="Productos anteriores"
            className={`absolute top-1/2 left-0 z-20 hidden -translate-x-1/2 -translate-y-1/2 lg:flex ${arrowBtnClass}`}
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard("next")}
            aria-label="Más productos"
            className={`absolute top-1/2 right-0 z-20 hidden translate-x-1/2 -translate-y-1/2 lg:flex ${arrowBtnClass}`}
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>

          <div
            ref={scrollerRef}
            className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-visible py-3 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {products.map((product, index) => (
              <div key={product.id} className="snap-start">
                <ProductStripCard product={product} index={index} />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
