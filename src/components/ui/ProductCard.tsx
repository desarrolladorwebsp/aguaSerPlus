"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Clock,
  Cpu,
  CupSoda,
  Eye,
  Layers,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Snowflake,
  Table2,
  Truck,
} from "lucide-react";
import type { ProductOffer, ProductTag } from "@/types/product";
import { formatClp } from "@/types/product";
import { useCart } from "@/lib/cart/store";

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

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const reduce = useReducedMotion();
  const featured = Boolean(product.featured);
  const { addItem } = useCart();
  const detailHref = `/productos/${product.id}`;

  const decrease = () => setQty((q) => Math.max(1, q - 1));
  const increase = () => setQty((q) => Math.min(99, q + 1));

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.priceNow,
      qty,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

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

      <Link
        href={detailHref}
        className={`relative block aspect-[4/3] overflow-hidden bg-gradient-to-br sm:aspect-square ${tintStyles[product.tint]}`}
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
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {product.tags.map((tag) => (
            <TagPill key={tag.label} tag={tag} />
          ))}
        </div>

        <div>
          <Link href={detailHref}>
            <h3 className="text-[15px] font-bold leading-snug text-brand transition hover:text-brand-secondary sm:text-base">
              {product.name}
            </h3>
          </Link>
          {product.note ? (
            <p className="mt-1 text-xs font-semibold text-neutral">
              {product.note}
            </p>
          ) : null}
        </div>

        <div className="flex items-baseline gap-2">
          {product.priceNow > 0 && product.priceBefore > product.priceNow ? (
            <span className="text-sm text-neutral line-through">
              {formatClp(product.priceBefore)}
            </span>
          ) : null}
          <span
            className={`font-extrabold text-brand ${
              product.priceNow > 0 ? "text-xl" : "text-base"
            }`}
          >
            {formatClp(product.priceNow)}
          </span>
        </div>

        <div className="mt-auto space-y-2 pt-1">
          <div className="flex items-center gap-2">
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

            <button
              type="button"
              onClick={handleAdd}
              className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2.5 py-2.5 text-xs font-bold transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] sm:text-[13px] ${
                justAdded
                  ? "bg-green text-white"
                  : featured
                    ? "bg-yellow text-foreground hover:bg-[#e5a820]"
                    : "bg-brand text-white hover:bg-brand-secondary"
              }`}
            >
              <ShoppingBag className="size-4 shrink-0" aria-hidden />
              <span className="truncate">
                {justAdded ? "Agregado" : "Agregar al carro"}
              </span>
            </button>
          </div>

          <Link
            href={detailHref}
            className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-brand/15 bg-white text-xs font-bold text-brand transition hover:bg-brand/5 sm:text-[13px]"
          >
            <Eye className="size-3.5" aria-hidden />
            Ver más información
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
