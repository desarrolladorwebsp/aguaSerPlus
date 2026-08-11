"use client";

import { Check, ShoppingBag } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { ProductOffer } from "@/types/product";
import { formatClp } from "@/types/product";
import { useCart } from "@/lib/cart/store";

type ProductStripCardProps = {
  product: ProductOffer;
  index?: number;
};

/**
 * Tarjeta compacta para cintas horizontales (ofertas / catálogo en home).
 */
export default function ProductStripCard({
  product,
  index = 0,
}: ProductStripCardProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const reduce = useReducedMotion();
  const detailHref = `/productos/${product.id}`;

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.priceNow,
      qty: 1,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 28, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.45,
        delay: reduce ? 0 : Math.min(index, 8) * 0.05,
        ease: [0.32, 0.72, 0, 1],
      }}
      whileHover={
        reduce
          ? undefined
          : {
              y: -8,
              scale: 1.04,
              transition: { type: "spring", stiffness: 380, damping: 22 },
            }
      }
      className="group flex w-[200px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-brand/10 shadow-[0_10px_28px_-22px_rgb(12_45_74_/_0.35)] transition-[box-shadow] duration-300 hover:z-10 hover:shadow-[0_22px_44px_-18px_rgb(0_86_163_/_0.4)] hover:ring-brand/25 sm:w-[220px]"
    >
      <Link
        href={detailHref}
        className="relative block aspect-[5/4] overflow-hidden bg-surface"
      >
        {product.badge ? (
          <motion.span
            initial={reduce ? false : { scale: 0.85, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 + Math.min(index, 8) * 0.04, type: "spring" }}
            className="absolute top-2 left-2 z-10 rounded-full bg-green px-2 py-0.5 text-[10px] font-extrabold text-white shadow-sm"
          >
            {product.badge}
          </motion.span>
        ) : null}
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="220px"
          className="object-contain p-3 transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand/8 via-transparent to-transparent opacity-0 transition duration-400 group-hover:opacity-100"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link href={detailHref}>
          <h3 className="line-clamp-2 min-h-[2.5rem] text-[13px] font-bold leading-snug text-foreground transition group-hover:text-brand">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-1.5">
          {product.priceNow > 0 && product.priceBefore > product.priceNow ? (
            <span className="text-[11px] text-neutral line-through">
              {formatClp(product.priceBefore)}
            </span>
          ) : null}
          <span className="text-sm font-extrabold text-brand transition group-hover:scale-105 origin-left">
            {formatClp(product.priceNow)}
          </span>
        </div>

        <motion.button
          type="button"
          onClick={handleAdd}
          aria-live="polite"
          whileTap={reduce ? undefined : { scale: 0.96 }}
          className={`mt-auto inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-bold transition ${
            justAdded
              ? "animate-[cart-added_0.45s_ease] bg-green text-white"
              : "bg-green text-white hover:bg-[#189866] hover:shadow-[0_10px_20px_-10px_rgb(31_169_122_/_0.7)]"
          }`}
        >
          {justAdded ? (
            <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
          ) : (
            <ShoppingBag className="size-3.5" aria-hidden />
          )}
          {justAdded ? "Agregado" : "Agregar"}
        </motion.button>
      </div>
    </motion.article>
  );
}
