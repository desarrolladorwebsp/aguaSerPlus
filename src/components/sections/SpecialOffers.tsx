"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
} from "lucide-react";
import Link from "next/link";
import ProductStripCard from "@/components/ui/ProductStripCard";
import { specialOfferProducts } from "@/lib/products";
import Container from "@/components/ui/Container";

const arrowBtnClass =
  "flex size-11 items-center justify-center rounded-full border border-brand/15 bg-white/95 text-brand shadow-[0_12px_28px_-14px_rgb(12_45_74_/_0.45)] backdrop-blur-sm transition hover:bg-brand hover:text-white hover:border-brand";

export default function SpecialOffers() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  if (specialOfferProducts.length === 0) return null;

  const scrollByCard = (direction: "prev" | "next") => {
    const node = scrollerRef.current;
    if (!node) return;
    const amount = Math.min(240, node.clientWidth * 0.8);
    node.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="ofertas"
      aria-labelledby="offers-heading"
      className="relative scroll-mt-20 overflow-x-clip overflow-y-visible bg-white py-10 sm:scroll-mt-24 sm:py-12"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 45% 50% at 100% 0%, rgb(240 180 41 / 0.1), transparent 55%),
            radial-gradient(ellipse 40% 40% at 0% 100%, rgb(0 153 221 / 0.06), transparent 50%)
          `,
        }}
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
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-yellow px-3 py-1 text-xs font-bold text-foreground">
              <Flame className="size-3.5" aria-hidden />
              Descuentos exclusivos
            </span>
            <h2
              id="offers-heading"
              className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl"
            >
              Ofertas especiales
            </h2>
            <p className="mt-1.5 max-w-lg text-sm text-neutral">
              Precios por tiempo limitado. Agrégalos al carro y completa tu
              pedido online.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => scrollByCard("prev")}
                aria-label="Ver ofertas anteriores"
                className={arrowBtnClass}
              >
                <ChevronLeft className="size-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard("next")}
                aria-label="Ver más ofertas"
                className={arrowBtnClass}
              >
                <ChevronRight className="size-5" aria-hidden />
              </button>
            </div>
            <Link
              href="/productos"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_36px_-16px_rgb(0_86_163_/_0.45)] transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-[0_20px_44px_-14px_rgb(0_86_163_/_0.55)]"
            >
              Ver todos los productos
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
            aria-label="Ver ofertas anteriores"
            className={`absolute top-1/2 left-0 z-20 hidden -translate-x-1/2 -translate-y-1/2 lg:flex ${arrowBtnClass}`}
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard("next")}
            aria-label="Ver más ofertas"
            className={`absolute top-1/2 right-0 z-20 hidden translate-x-1/2 -translate-y-1/2 lg:flex ${arrowBtnClass}`}
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>

          <div
            ref={scrollerRef}
            className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-visible py-3 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {specialOfferProducts.map((product, index) => (
              <div key={product.id} className="snap-start">
                <ProductStripCard product={product} index={index} />
              </div>
            ))}
          </div>
        </div>

        <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-neutral">
          <Clock className="size-3.5 shrink-0" aria-hidden />
          Ofertas válidas por tiempo limitado o hasta agotar stock.
        </p>
      </Container>
    </section>
  );
}
