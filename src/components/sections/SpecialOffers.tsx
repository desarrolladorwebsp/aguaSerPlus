"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Droplet,
  Flame,
} from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import { specialOfferProducts } from "@/lib/products";
import Container from "@/components/ui/Container";

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
      className="relative scroll-mt-20 overflow-hidden bg-[#f3f8fd] py-16 sm:scroll-mt-24 sm:py-20"
    >
      {/* Soft atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 50% 40% at 90% 10%, rgb(0 153 221 / 0.1), transparent 55%),
            radial-gradient(ellipse 40% 35% at 5% 90%, rgb(240 180 41 / 0.1), transparent 50%)
          `,
        }}
      />

      {/* Decorative droplets */}
      <Droplet
        aria-hidden
        className="pointer-events-none absolute bottom-8 left-6 size-16 text-brand/10 sm:size-24"
        fill="currentColor"
      />
      <Droplet
        aria-hidden
        className="pointer-events-none absolute right-8 bottom-16 size-12 text-brand-accent/15 sm:size-20"
        fill="currentColor"
      />

      <Container className="relative">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className="mb-10 flex w-full flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-yellow px-3 py-1 text-xs font-bold text-foreground">
              <Flame className="size-3.5" aria-hidden />
              Descuentos exclusivos
            </span>
            <h2
              id="offers-heading"
              className="text-3xl font-extrabold tracking-tight text-brand sm:text-4xl"
            >
              Ofertas especiales
            </h2>
            <p className="mt-2 max-w-lg text-sm text-neutral sm:text-base">
              Precios por tiempo limitado. Pedí al instante por{" "}
              <span className="font-semibold text-brand">WhatsApp</span>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByCard("prev")}
              aria-label="Ver ofertas anteriores"
              className="flex size-10 items-center justify-center rounded-full border border-brand/15 bg-background text-brand transition hover:bg-brand/5 md:hidden"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard("next")}
              aria-label="Ver más ofertas"
              className="flex size-10 items-center justify-center rounded-full border border-brand/15 bg-background text-brand transition hover:bg-brand/5 md:hidden"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-background px-4 py-2.5 text-sm font-semibold text-brand transition hover:border-brand/40 hover:bg-brand/5"
            >
              Ver todos los productos
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </motion.div>

        <div
          ref={scrollerRef}
          className="flex w-full snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden"
        >
          {specialOfferProducts.map((product, index) => (
            <div
              key={product.id}
              className="w-[min(100%,270px)] shrink-0 snap-start sm:w-[min(100%,290px)] md:w-full md:min-w-0 md:shrink"
            >
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>

        <p className="mt-10 flex items-center justify-center gap-2 text-center text-xs text-neutral sm:text-sm">
          <Clock className="size-3.5 shrink-0" aria-hidden />
          Ofertas válidas por tiempo limitado o hasta agotar stock.
        </p>
      </Container>
    </section>
  );
}
