"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart/store";
import { formatClp } from "@/types/product";
import CartLineItem from "@/components/cart/CartLineItem";

export default function CartDrawer() {
  const { items, isOpen, closeCart, subtotal, totalItems } = useCart();

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Cerrar carro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-[2px]"
            onClick={closeCart}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="fixed inset-y-0 right-0 z-[70] flex w-[min(100%,420px)] flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-brand/8 px-5 py-4">
              <div>
                <h2
                  id="cart-drawer-title"
                  className="text-lg font-extrabold text-foreground"
                >
                  Tu carro
                </h2>
                <p className="text-xs text-neutral">
                  {totalItems === 0
                    ? "Vacío"
                    : `${totalItems} ${totalItems === 1 ? "producto" : "productos"}`}
                </p>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="flex size-10 items-center justify-center rounded-full bg-surface text-brand transition hover:bg-brand/10"
                aria-label="Cerrar"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-brand/8 text-brand">
                  <ShoppingBag className="size-7" aria-hidden />
                </span>
                <p className="mt-4 text-base font-bold text-foreground">
                  Tu carro está vacío
                </p>
                <p className="mt-1 max-w-xs text-sm text-neutral">
                  Agrega recargas o dispensadores para continuar con tu pedido.
                </p>
                <Link
                  href="/productos"
                  onClick={closeCart}
                  className="mt-6 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-secondary"
                >
                  Ver productos
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 space-y-1 overflow-y-auto px-5 py-2 divide-y divide-brand/8">
                  {items.map((item) => (
                    <CartLineItem key={item.productId} item={item} compact />
                  ))}
                </ul>

                <div className="border-t border-brand/8 bg-surface/50 px-5 py-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-neutral">Subtotal</span>
                    <span className="text-lg font-extrabold text-foreground">
                      {formatClp(subtotal)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="inline-flex h-12 items-center justify-center rounded-xl bg-green px-4 text-sm font-bold text-white transition hover:bg-[#189866]"
                    >
                      Ir a pagar
                    </Link>
                    <Link
                      href="/carrito"
                      onClick={closeCart}
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-brand/15 bg-white px-4 text-sm font-semibold text-brand transition hover:bg-brand/5"
                    >
                      Ver carro completo
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
