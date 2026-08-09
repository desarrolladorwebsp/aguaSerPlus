"use client";

import { ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart/store";

export default function CartButton() {
  const { totalItems, openCart, hydrated } = useCart();
  const count = hydrated ? totalItems : 0;
  const prevCount = useRef(count);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    if (count > prevCount.current) {
      setBump(true);
      const timer = window.setTimeout(() => setBump(false), 700);
      prevCount.current = count;
      return () => window.clearTimeout(timer);
    }
    prevCount.current = count;
  }, [count]);

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={count > 0 ? `Abrir carro, ${count} productos` : "Abrir carro"}
      className={`relative flex size-10 items-center justify-center rounded-full border border-brand/15 text-brand transition hover:bg-surface ${
        bump ? "animate-[cart-bump_0.55s_ease]" : ""
      }`}
    >
      <ShoppingBag className="size-5" strokeWidth={1.75} aria-hidden />
      {count > 0 ? (
        <span
          className={`absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-green px-1 text-[10px] font-extrabold text-white ${
            bump ? "animate-[cart-badge-pop_0.55s_ease]" : ""
          }`}
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </button>
  );
}
