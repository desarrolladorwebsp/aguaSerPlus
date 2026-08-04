"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Flame, Tag } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import type { ProductOffer } from "@/types/product";
import { getDiscountPercent } from "@/types/product";

const offers: ProductOffer[] = [
  {
    id: "dispensador-te-digital",
    name: "Dispensador Digital de Té",
    description: "Incluye tetera y hervidor",
    priceBefore: 100_000,
    priceNow: 80_000,
    badge: `-${getDiscountPercent(100_000, 80_000)}%`,
    image: "/products/product-tea-dispenser.png",
    tint: "green",
  },
  {
    id: "dispensador-sobremesa",
    name: "Dispensador Sobremesa Frío y Caliente",
    priceBefore: 50_000,
    priceNow: 45_000,
    badge: `-${getDiscountPercent(50_000, 45_000)}%`,
    image: "/products/product-countertop-dispenser.png",
    tint: "blue",
  },
  {
    id: "rack-3-bidones",
    name: "Rack para 3 Bidones 20 Litros",
    priceBefore: 30_000,
    priceNow: 18_000,
    badge: "Oferta Limitada",
    image: "/products/product-rack-bidones.png",
    tint: "yellow",
  },
  {
    id: "hielo-2kg",
    name: "Hielo 2 KG",
    note: "Solo Maipú",
    priceBefore: 1_500,
    priceNow: 1_200,
    badge: `-${getDiscountPercent(1_500, 1_200)}%`,
    image: "/products/product-ice-2kg.png",
    tint: "blue",
  },
];

export default function SpecialOffers() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const scrollByCard = (direction: "prev" | "next") => {
    const node = scrollerRef.current;
    if (!node) return;
    const amount = Math.min(320, node.clientWidth * 0.85);
    node.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="ofertas"
      aria-labelledby="offers-heading"
      className="relative overflow-hidden bg-background py-20 sm:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,_rgb(240_180_41_/_0.18),_transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-green/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
          className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-yellow-soft px-3 py-1 text-xs font-extrabold tracking-wide text-foreground ring-1 ring-yellow/40">
              <Flame className="size-3.5 text-yellow" aria-hidden />
              Descuentos exclusivos
            </span>
            <h2
              id="offers-heading"
              className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
            >
              Ofertas{" "}
              <span className="text-brand">especiales</span>
            </h2>
            <p className="mt-2 max-w-md text-sm text-neutral sm:text-base">
              Precios por tiempo limitado. Pedí al instante por WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByCard("prev")}
              aria-label="Ver ofertas anteriores"
              className="flex size-10 items-center justify-center rounded-full border border-brand/12 bg-surface text-brand transition hover:bg-green-soft hover:text-green focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none md:hidden"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard("next")}
              aria-label="Ver más ofertas"
              className="flex size-10 items-center justify-center rounded-full border border-brand/12 bg-surface text-brand transition hover:bg-yellow-soft focus-visible:ring-2 focus-visible:ring-yellow focus-visible:outline-none md:hidden"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
            <a
              href="#catalogo"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-secondary"
            >
              <Tag className="size-4 text-yellow" aria-hidden />
              Ver todo
            </a>
          </div>
        </motion.div>

        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden"
        >
          {offers.map((product, index) => (
            <div
              key={product.id}
              className="w-[min(100%,280px)] shrink-0 snap-start sm:w-[min(100%,300px)] md:w-auto md:shrink"
            >
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
