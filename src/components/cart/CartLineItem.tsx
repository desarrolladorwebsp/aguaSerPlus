"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatClp } from "@/types/product";
import type { CartItem } from "@/types/cart";
import { useCart } from "@/lib/cart/store";

type CartLineItemProps = {
  item: CartItem;
  compact?: boolean;
};

export default function CartLineItem({ item, compact = false }: CartLineItemProps) {
  const { setQty, removeItem } = useCart();

  return (
    <li
      className={`flex gap-3 ${compact ? "py-3" : "rounded-2xl bg-surface/70 p-3 ring-1 ring-brand/8"}`}
    >
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-brand/10 sm:size-[4.5rem]">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="72px"
          className="object-contain p-1.5"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">{item.name}</p>
            <p className="mt-0.5 text-sm font-semibold text-brand">
              {formatClp(item.price)}
            </p>
            {item.color ? (
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-neutral">
                Color: {item.color}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.productId, item.color)}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-neutral transition hover:bg-white hover:text-brand"
            aria-label={`Quitar ${item.name}`}
          >
            <Trash2 className="size-4" aria-hidden />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="inline-flex items-center rounded-xl bg-white ring-1 ring-brand/10">
            <button
              type="button"
              onClick={() => setQty(item.productId, item.qty - 1, item.color)}
              aria-label="Disminuir cantidad"
              className="flex size-8 items-center justify-center text-brand transition hover:bg-brand/5 disabled:opacity-40"
              disabled={item.qty <= 1}
            >
              <Minus className="size-3.5" aria-hidden />
            </button>
            <span className="min-w-7 text-center text-sm font-bold tabular-nums text-foreground">
              {item.qty}
            </span>
            <button
              type="button"
              onClick={() => setQty(item.productId, item.qty + 1, item.color)}
              aria-label="Aumentar cantidad"
              className="flex size-8 items-center justify-center text-brand transition hover:bg-brand/5 disabled:opacity-40"
              disabled={item.qty >= 99}
            >
              <Plus className="size-3.5" aria-hidden />
            </button>
          </div>
          <p className="text-sm font-extrabold tabular-nums text-foreground">
            {formatClp(item.price * item.qty)}
          </p>
        </div>
      </div>
    </li>
  );
}
