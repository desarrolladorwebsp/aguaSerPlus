"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import type { ProductOffer } from "@/types/product";
import { formatClp } from "@/types/product";
import { useCart } from "@/lib/cart/store";
import { useState } from "react";

type ProductStripCardProps = {
  product: ProductOffer;
};

/**
 * Tarjeta compacta para cintas horizontales (ofertas / catálogo en home).
 */
export default function ProductStripCard({ product }: ProductStripCardProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
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
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article className="flex w-[200px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-brand/10 sm:w-[220px]">
      <Link
        href={detailHref}
        className="relative block aspect-[5/4] bg-surface"
      >
        {product.badge ? (
          <span className="absolute top-2 left-2 z-10 rounded-full bg-brand px-2 py-0.5 text-[10px] font-extrabold text-white">
            {product.badge}
          </span>
        ) : null}
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="220px"
          className="object-contain p-3"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link href={detailHref}>
          <h3 className="line-clamp-2 min-h-[2.5rem] text-[13px] font-bold leading-snug text-foreground transition hover:text-brand">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-1.5">
          {product.priceNow > 0 && product.priceBefore > product.priceNow ? (
            <span className="text-[11px] text-neutral line-through">
              {formatClp(product.priceBefore)}
            </span>
          ) : null}
          <span className="text-sm font-extrabold text-brand">
            {formatClp(product.priceNow)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={`mt-auto inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-bold transition active:scale-[0.98] ${
            justAdded
              ? "bg-green text-white"
              : "bg-brand text-white hover:bg-brand-secondary"
          }`}
        >
          <ShoppingBag className="size-3.5" aria-hidden />
          {justAdded ? "Agregado" : "Agregar"}
        </button>
      </div>
    </article>
  );
}
