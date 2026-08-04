"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Clock,
  Cpu,
  CupSoda,
  Layers,
  MapPin,
  Minus,
  Plus,
  Snowflake,
  Table2,
  Truck,
} from "lucide-react";
import type { ProductOffer, ProductTag } from "@/types/product";
import { formatClp } from "@/types/product";

const WHATSAPP_BASE = "https://wa.me/56900000000";

const tintStyles = {
  blue: "from-[#e8f4ff] via-[#f0f8ff] to-white",
  green: "from-[#e8f8f0] via-[#f3fbf6] to-white",
  yellow: "from-[#fff6db] via-[#fffaf0] to-white",
} as const;

const badgeStyles = {
  green: "bg-green text-white",
  blue: "bg-brand text-white",
  yellow: "bg-yellow text-foreground",
} as const;

const tagIcons = {
  bolt: Cpu,
  kettle: CupSoda,
  snowflake: Snowflake,
  table: Table2,
  metal: Layers,
  bottles: Layers,
  map: MapPin,
  truck: Truck,
} as const;

type ProductCardProps = {
  product: ProductOffer;
  index?: number;
};

function TagPill({ tag }: { tag: ProductTag }) {
  const Icon = tagIcons[tag.icon];
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-brand/10 bg-background px-2 py-1 text-[10px] font-semibold text-neutral">
      <Icon className="size-3 text-brand" strokeWidth={2} aria-hidden />
      {tag.label}
    </span>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [qty, setQty] = useState(1);
  const reduce = useReducedMotion();
  const featured = Boolean(product.featured);

  const decrease = () => setQty((q) => Math.max(1, q - 1));
  const increase = () => setQty((q) => Math.min(99, q + 1));

  const whatsappHref = `${WHATSAPP_BASE}?text=${encodeURIComponent(
    `Hola AguaSer, quiero pedir: ${product.name} (x${qty}). Precio oferta: ${formatClp(product.priceNow)} c/u.`,
  )}`;

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.5,
        delay: index * 0.07,
        ease: [0.32, 0.72, 0, 1],
      }}
      whileHover={reduce ? undefined : { y: -4 }}
      className={`group flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-background shadow-[0_16px_40px_-24px_rgb(0_86_163_/_0.35)] transition duration-500 ${
        featured
          ? "ring-2 ring-yellow shadow-[0_18px_48px_-18px_rgb(240_180_41_/_0.55)]"
          : "ring-1 ring-brand/8"
      }`}
    >
      {featured ? (
        <div className="flex items-center justify-center gap-1.5 bg-yellow px-3 py-2 text-xs font-extrabold text-foreground">
          <Clock className="size-3.5" aria-hidden />
          Oferta limitada
        </div>
      ) : null}

      <div
        className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br sm:aspect-square ${tintStyles[product.tint]}`}
      >
        <span
          className={`absolute top-3 left-3 z-10 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-extrabold shadow-sm ${badgeStyles[product.badgeTone]}`}
        >
          {product.badge}
        </span>

        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 80vw, 25vw"
          className="object-contain p-4 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 sm:p-5"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {product.tags.map((tag) => (
            <TagPill key={tag.label} tag={tag} />
          ))}
        </div>

        <div>
          <h3 className="text-[15px] font-bold leading-snug text-brand sm:text-base">
            {product.name}
          </h3>
          {product.note ? (
            <p className="mt-1 text-xs font-semibold text-neutral">
              {product.note}
            </p>
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

        <div className="mt-auto flex items-center gap-2 pt-1">
          <div className="inline-flex items-center rounded-xl bg-surface">
            <button
              type="button"
              onClick={decrease}
              aria-label="Disminuir cantidad"
              className="flex size-8 items-center justify-center text-brand transition hover:bg-brand/5 disabled:opacity-40"
              disabled={qty <= 1}
            >
              <Minus className="size-3.5" aria-hidden />
            </button>
            <span
              className="min-w-6 text-center text-sm font-bold tabular-nums text-foreground"
              aria-live="polite"
            >
              {qty}
            </span>
            <button
              type="button"
              onClick={increase}
              aria-label="Aumentar cantidad"
              className="flex size-8 items-center justify-center text-brand transition hover:bg-brand/5"
            >
              <Plus className="size-3.5" aria-hidden />
            </button>
          </div>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2.5 py-2.5 text-xs font-bold transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] sm:text-[13px] ${
              featured
                ? "bg-yellow text-foreground hover:bg-[#e5a820]"
                : "bg-brand text-white hover:bg-brand-secondary"
            }`}
          >
            <WhatsAppIcon className="size-4 shrink-0" />
            <span className="truncate">Pedir por WhatsApp</span>
          </a>
        </div>
      </div>
    </motion.article>
  );
}
