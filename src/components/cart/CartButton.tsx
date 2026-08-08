"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart/store";

export default function CartButton() {
  const { totalItems, openCart, hydrated } = useCart();
  const count = hydrated ? totalItems : 0;

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={count > 0 ? `Abrir carro, ${count} productos` : "Abrir carro"}
      className="relative flex size-10 items-center justify-center rounded-full border border-brand/15 text-brand transition hover:bg-surface"
    >
      <ShoppingBag className="size-5" strokeWidth={1.75} aria-hidden />
      {count > 0 ? (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-green px-1 text-[10px] font-extrabold text-white">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </button>
  );
}
