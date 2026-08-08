"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Download, FileText, Loader2, Printer } from "lucide-react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Container from "@/components/ui/Container";
import { useCart } from "@/lib/cart/store";
import { formatClp } from "@/types/product";
import type { AdminOrder } from "@/lib/admin/types";
import { ORDER_STATUS_LABELS } from "@/lib/admin/types";
import { FULFILLMENT_LABELS } from "@/types/cart";

export default function CheckoutSuccessClient() {
  const params = useSearchParams();
  const { clear } = useCart();

  // Klap envía referenceId = nuestro id; orderId = id de Klap
  const referenceId = params.get("referenceId");
  const klapOrderId = params.get("orderId") ?? params.get("order_id");
  const paymentId = params.get("paymentId") ?? klapOrderId;
  const lookupId = referenceId || params.get("orderId") || "";

  const amountRaw = params.get("amount");
  const amountFromQuery = amountRaw ? Number(amountRaw) : null;

  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(Boolean(lookupId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    clear();
  }, [clear]);

  useEffect(() => {
    if (!lookupId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/orders/${encodeURIComponent(lookupId)}`);
        const json = (await res.json()) as {
          success?: boolean;
          data?: AdminOrder;
          error?: string;
        };
        if (!res.ok || !json.success || !json.data) {
          throw new Error(json.error || "No se encontró el pedido.");
        }
        if (!cancelled) setOrder(json.data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "No se pudo cargar el pedido.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [lookupId]);

  const displayOrderId = order?.id ?? referenceId ?? "—";
  const displayPaymentId = order?.externalPaymentId ?? paymentId;
  const total =
    order?.total ??
    (amountFromQuery != null && !Number.isNaN(amountFromQuery)
      ? amountFromQuery
      : null);

  const comprobanteHref = order
    ? `/api/orders/${encodeURIComponent(order.id)}/comprobante`
    : lookupId
      ? `/api/orders/${encodeURIComponent(lookupId)}/comprobante`
      : null;

  return (
    <>
      <Header />
      <main className="w-full flex-1 bg-[#f5faff]">
        <Container className="flex flex-col items-center py-16 text-center lg:py-20">
          <span className="flex size-16 items-center justify-center rounded-full bg-green/15 text-green">
            <CheckCircle2 className="size-9" aria-hidden />
          </span>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground">
            Pago exitoso
          </h1>
          <p className="mt-2 max-w-md text-sm text-neutral sm:text-base">
            Recibimos tu pedido. Te contactaremos para confirmar el despacho.
          </p>

          {loading ? (
            <p className="mt-8 inline-flex items-center gap-2 text-sm text-neutral">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Cargando detalle del pedido…
            </p>
          ) : null}

          {error && !order ? (
            <p className="mt-6 max-w-md rounded-xl bg-yellow-soft/70 px-4 py-3 text-sm text-foreground ring-1 ring-yellow/30">
              {error} Aun así puedes guardar el número de orden.
            </p>
          ) : null}

          <dl className="mt-8 w-full max-w-lg space-y-2 rounded-[1.5rem] bg-white p-5 text-left text-sm ring-1 ring-brand/10">
            <div className="flex justify-between gap-3">
              <dt className="text-neutral">Orden</dt>
              <dd className="font-mono text-xs font-semibold text-foreground sm:text-sm">
                {displayOrderId}
              </dd>
            </div>
            {displayPaymentId ? (
              <div className="flex justify-between gap-3">
                <dt className="text-neutral">Pago</dt>
                <dd className="max-w-[60%] truncate font-mono text-xs font-semibold text-foreground sm:text-sm">
                  {displayPaymentId}
                </dd>
              </div>
            ) : null}
            {order ? (
              <>
                <div className="flex justify-between gap-3">
                  <dt className="text-neutral">Cliente</dt>
                  <dd className="font-semibold text-foreground">
                    {order.customer.name}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-neutral">Teléfono</dt>
                  <dd className="font-semibold text-foreground">
                    {order.customer.phone}
                  </dd>
                </div>
                {order.fulfillment ? (
                  <div className="flex justify-between gap-3">
                    <dt className="text-neutral">Entrega</dt>
                    <dd className="font-semibold text-foreground">
                      {FULFILLMENT_LABELS[order.fulfillment]}
                    </dd>
                  </div>
                ) : null}
                <div className="flex justify-between gap-3">
                  <dt className="text-neutral">Estado</dt>
                  <dd className="font-semibold text-foreground">
                    {ORDER_STATUS_LABELS[order.status]}
                  </dd>
                </div>
                <div className="border-t border-brand/10 pt-2">
                  <p className="mb-2 text-xs font-bold tracking-wide text-neutral uppercase">
                    Productos
                  </p>
                  <ul className="space-y-1.5">
                    {order.items.map((item) => (
                      <li
                        key={`${item.productId}-${item.title}`}
                        className="flex justify-between gap-3"
                      >
                        <span className="text-foreground">
                          {item.title}{" "}
                          <span className="text-neutral">×{item.qty}</span>
                        </span>
                        <span className="shrink-0 font-semibold tabular-nums">
                          {formatClp(item.unitPrice * item.qty)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : null}
            {total != null ? (
              <div className="flex justify-between gap-3 border-t border-brand/10 pt-2">
                <dt className="font-bold text-foreground">Total</dt>
                <dd className="text-lg font-extrabold text-brand">
                  {formatClp(total)}
                </dd>
              </div>
            ) : null}
          </dl>

          {comprobanteHref ? (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`${comprobanteHref}?download=1`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-white transition hover:bg-brand-secondary"
              >
                <Download className="size-4" aria-hidden />
                Descargar comprobante
              </a>
              <a
                href={comprobanteHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-brand/15 bg-white px-5 text-sm font-semibold text-brand transition hover:bg-brand/5"
              >
                <Printer className="size-4" aria-hidden />
                Ver / imprimir
              </a>
            </div>
          ) : (
            <p className="mt-5 inline-flex items-center gap-2 text-sm text-neutral">
              <FileText className="size-4" aria-hidden />
              El comprobante estará disponible cuando se confirme el pedido.
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/productos"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-brand/15 bg-white px-5 text-sm font-semibold text-brand transition hover:bg-brand/5"
            >
              Seguir comprando
            </Link>
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-brand/15 bg-white px-5 text-sm font-semibold text-brand transition hover:bg-brand/5"
            >
              Ir al inicio
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
