"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Container from "@/components/ui/Container";
import CartLineItem from "@/components/cart/CartLineItem";
import { useCart } from "@/lib/cart/store";
import { formatClp } from "@/types/product";

export default function CartPageClient() {
  const { items, subtotal, totalItems, clear } = useCart();

  return (
    <>
      <Header />
      <main className="w-full flex-1 bg-[#f5faff]">
        <Container className="py-10 lg:py-12">
          <div className="mb-8">
            <p className="text-sm font-semibold tracking-[0.16em] text-brand-accent uppercase">
              Pedido
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Carro de compra
            </h1>
            <p className="mt-2 text-sm text-neutral">
              {totalItems === 0
                ? "Aún no has agregado productos."
                : `${totalItems} ${totalItems === 1 ? "producto" : "productos"} en tu carro.`}
            </p>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[1.75rem] bg-white px-6 py-16 text-center ring-1 ring-brand/10">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-brand/8 text-brand">
                <ShoppingBag className="size-7" aria-hidden />
              </span>
              <h2 className="mt-4 text-lg font-bold text-foreground">
                Tu carro está vacío
              </h2>
              <p className="mt-2 max-w-sm text-sm text-neutral">
                Explora el catálogo y agrega recargas, dispensadores o
                accesorios.
              </p>
              <Link
                href="/productos"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-secondary"
              >
                Ver productos
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-foreground">
                    Productos
                  </h2>
                  <button
                    type="button"
                    onClick={clear}
                    className="text-xs font-semibold text-neutral transition hover:text-brand"
                  >
                    Vaciar carro
                  </button>
                </div>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <CartLineItem key={item.productId} item={item} />
                  ))}
                </ul>
              </div>

              <aside className="lg:col-span-4">
                <div className="sticky top-24 rounded-[1.5rem] bg-white p-5 shadow-[0_16px_40px_-28px_rgb(0_86_163_/_0.35)] ring-1 ring-brand/10">
                  <h2 className="text-base font-bold text-foreground">
                    Resumen
                  </h2>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div className="flex justify-between gap-3">
                      <dt className="text-neutral">Subtotal</dt>
                      <dd className="font-semibold text-foreground">
                        {formatClp(subtotal)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-neutral">Entrega</dt>
                      <dd className="text-right font-semibold text-foreground">
                        Envío o retiro
                        <span className="mt-0.5 block text-xs font-normal text-neutral">
                          Se elige en el checkout
                        </span>
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-neutral">Despacho</dt>
                      <dd className="font-semibold text-foreground">
                        Según modalidad
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3 border-t border-brand/10 pt-3">
                      <dt className="font-bold text-foreground">Total</dt>
                      <dd className="text-lg font-extrabold text-brand">
                        {formatClp(subtotal)}
                      </dd>
                    </div>
                  </dl>
                  <Link
                    href="/checkout"
                    className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green px-4 text-sm font-bold text-white transition hover:bg-[#189866]"
                  >
                    Ir a pagar
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                  <Link
                    href="/productos"
                    className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl border border-brand/15 text-sm font-semibold text-brand transition hover:bg-brand/5"
                  >
                    Seguir comprando
                  </Link>
                </div>
              </aside>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
