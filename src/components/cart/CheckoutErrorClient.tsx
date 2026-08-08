"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Container from "@/components/ui/Container";
import { formatClp } from "@/types/product";

export default function CheckoutErrorClient() {
  const params = useSearchParams();
  const orderId = params.get("orderId") ?? params.get("referenceId");
  const reason = params.get("reason") ?? "El pago no pudo completarse.";
  const amountRaw = params.get("amount");
  const amount = amountRaw ? Number(amountRaw) : null;

  return (
    <>
      <Header />
      <main className="w-full flex-1 bg-[#f5faff]">
        <Container className="flex flex-col items-center py-16 text-center lg:py-20">
          <span className="flex size-16 items-center justify-center rounded-full bg-red-50 text-red-600">
            <XCircle className="size-9" aria-hidden />
          </span>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground">
            Pago no completado
          </h1>
          <p className="mt-2 max-w-md text-sm text-neutral sm:text-base">
            {reason} Tu carro se mantiene intacto para que puedas reintentar.
          </p>

          <dl className="mt-8 w-full max-w-md space-y-2 rounded-[1.5rem] bg-white p-5 text-left text-sm ring-1 ring-brand/10">
            {orderId ? (
              <div className="flex justify-between gap-3">
                <dt className="text-neutral">Orden</dt>
                <dd className="font-mono text-xs font-semibold text-foreground sm:text-sm">
                  {orderId}
                </dd>
              </div>
            ) : null}
            {amount != null && !Number.isNaN(amount) ? (
              <div className="flex justify-between gap-3">
                <dt className="text-neutral">Monto</dt>
                <dd className="font-semibold text-foreground">
                  {formatClp(amount)}
                </dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/checkout"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-green px-5 text-sm font-bold text-white transition hover:bg-[#189866]"
            >
              Reintentar pago
            </Link>
            <Link
              href="/carrito"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-brand/15 bg-white px-5 text-sm font-semibold text-brand transition hover:bg-brand/5"
            >
              Volver al carro
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
