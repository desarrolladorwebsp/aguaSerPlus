"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import type { ProductOffer } from "@/types/product";
import { formatClp } from "@/types/product";

const WHATSAPP_BASE = "https://wa.me/56900000000";

const tintStyles = {
  blue: {
    shell: "bg-brand/5 ring-brand/10",
    badge: "bg-brand text-white",
    imageBg: "from-brand/10 via-brand-accent/10 to-surface",
  },
  green: {
    shell: "bg-green/5 ring-green/15",
    badge: "bg-green text-white",
    imageBg: "from-green-soft via-green/10 to-surface",
  },
  yellow: {
    shell: "bg-yellow/10 ring-yellow/25",
    badge: "bg-yellow text-foreground",
    imageBg: "from-yellow-soft via-yellow/15 to-surface",
  },
} as const;

type ProductCardProps = {
  product: ProductOffer;
  index?: number;
};

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [qty, setQty] = useState(1);
  const reduce = useReducedMotion();
  const tint = tintStyles[product.tint];

  const decrease = () => setQty((q) => Math.max(1, q - 1));
  const increase = () => setQty((q) => Math.min(99, q + 1));

  const whatsappHref = `${WHATSAPP_BASE}?text=${encodeURIComponent(
    `Hola AguaSer, quiero pedir: ${product.name} (x${qty}). Precio oferta: ${formatClp(product.priceNow)} c/u.`,
  )}`;

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.55,
        delay: index * 0.07,
        ease: [0.32, 0.72, 0, 1],
      }}
      whileHover={reduce ? undefined : { y: -6 }}
      className={`rounded-[1.75rem] p-1.5 ring-1 shadow-soft ${tint.shell}`}
    >
      <article className="group flex h-full flex-col overflow-hidden rounded-[calc(1.75rem-0.375rem)] bg-background shadow-[inset_0_1px_1px_rgba(255,255,255,0.65)]">
        <div
          className={`relative aspect-square overflow-hidden bg-gradient-to-br ${tint.imageBg}`}
        >
          <span
            className={`absolute top-3 left-3 z-10 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-extrabold tracking-wide shadow-soft ${tint.badge}`}
          >
            {product.badge}
          </span>

          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 80vw, 25vw"
            className="object-contain p-5 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5">
          <div>
            <h3 className="text-base font-bold leading-snug text-foreground sm:text-[1.05rem]">
              {product.name}
            </h3>
            {product.note ? (
              <p className="mt-1 text-xs font-bold text-yellow">{product.note}</p>
            ) : null}
            {product.description ? (
              <p className="mt-1 text-sm text-neutral">{product.description}</p>
            ) : null}
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-sm text-neutral line-through">
              {formatClp(product.priceBefore)}
            </span>
            <span className="text-xl font-extrabold text-brand">
              {formatClp(product.priceNow)}
            </span>
          </div>

          <div className="mt-auto flex items-center gap-2.5">
            <div className="inline-flex items-center rounded-full border border-brand/12 bg-surface">
              <button
                type="button"
                onClick={decrease}
                aria-label="Disminuir cantidad"
                className="flex size-9 items-center justify-center text-brand transition hover:bg-brand/5 disabled:opacity-40"
                disabled={qty <= 1}
              >
                <Minus className="size-4" aria-hidden />
              </button>
              <span
                className="min-w-7 text-center text-sm font-bold tabular-nums text-foreground"
                aria-live="polite"
              >
                {qty}
              </span>
              <button
                type="button"
                onClick={increase}
                aria-label="Aumentar cantidad"
                className="flex size-9 items-center justify-center text-brand transition hover:bg-brand/5"
              >
                <Plus className="size-4" aria-hidden />
              </button>
            </div>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand px-3 py-2.5 text-sm font-bold text-white transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-green active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-yellow focus-visible:outline-none"
            >
              <ShoppingBag className="size-4 shrink-0" aria-hidden />
              <span className="truncate">Pedir</span>
            </a>
          </div>
        </div>
      </article>
    </motion.div>
  );
}
