"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Loader2,
  Lock,
  MapPin,
  Store,
  Truck,
} from "lucide-react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Container from "@/components/ui/Container";
import { useCart } from "@/lib/cart/store";
import { company } from "@/lib/company";
import { formatClp } from "@/types/product";
import type { FulfillmentMethod } from "@/types/cart";
import { FULFILLMENT_LABELS } from "@/types/cart";

type FieldErrors = Partial<
  Record<"name" | "phone" | "email" | "address" | "commune" | "fulfillment" | "form", string>
>;

export default function CheckoutPageClient() {
  const router = useRouter();
  const { items, subtotal, totalItems, hydrated } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [fulfillment, setFulfillment] =
    useState<FulfillmentMethod>("delivery");
  const [address, setAddress] = useState("");
  const [commune, setCommune] = useState("Maipú");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (items.length === 0) {
      router.replace("/carrito");
    }
  }, [hydrated, items.length, router]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            qty: item.qty,
          })),
          customer: {
            name,
            phone,
            email,
            fulfillment,
            address: fulfillment === "delivery" ? address : company.address.full,
            commune:
              fulfillment === "delivery" ? commune : company.address.commune,
            notes: notes.trim() || undefined,
          },
        }),
      });

      const json = (await res.json()) as {
        success: boolean;
        error?: string;
        data?: {
          redirectUrl?: string;
          klapOrderId?: string;
          provider?: string;
          orderId?: string;
          paymentId?: string;
        };
      };

      if (!res.ok || !json.success || !json.data) {
        setErrors({ form: json.error ?? "No se pudo iniciar el pago." });
        setSubmitting(false);
        return;
      }

      // Klap Checkout Flex: carga script e inicia modal
      if (json.data.provider === "klap" && json.data.klapOrderId) {
        const { openKlapCheckoutFlex } = await import(
          "@/lib/payments/klap-flex"
        );
        await openKlapCheckoutFlex(json.data.klapOrderId);
        setSubmitting(false);
        return;
      }

      if (!json.data.redirectUrl) {
        setErrors({ form: "No se recibió URL de pago." });
        setSubmitting(false);
        return;
      }

      window.location.href = json.data.redirectUrl;
    } catch {
      setErrors({ form: "Error de red. Intenta de nuevo." });
      setSubmitting(false);
    }
  };

  if (!hydrated || items.length === 0) {
    return (
      <>
        <Header />
        <main className="flex w-full flex-1 items-center justify-center bg-[#f5faff] py-20">
          <Loader2 className="size-8 animate-spin text-brand" aria-hidden />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="w-full flex-1 bg-[#f5faff]">
        <Container className="py-10 lg:py-12">
          <Link
            href="/carrito"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition hover:underline"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Volver al carro
          </Link>

          <div className="mt-4 mb-8">
            <p className="text-sm font-semibold tracking-[0.16em] text-brand-accent uppercase">
              Checkout
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Pago online
            </h1>
            <p className="mt-2 max-w-xl text-sm text-neutral">
              Elige envío a domicilio o retiro en sucursal y completa tus datos.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <form
              onSubmit={onSubmit}
              className="space-y-5 rounded-[1.5rem] bg-white p-5 ring-1 ring-brand/10 sm:p-6 lg:col-span-7"
            >
              <div>
                <h2 className="text-base font-bold text-foreground">
                  ¿Cómo quieres recibir tu pedido?
                </h2>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setFulfillment("delivery")}
                    className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition ${
                      fulfillment === "delivery"
                        ? "border-brand bg-brand/5 ring-2 ring-brand/20"
                        : "border-brand/12 bg-surface/40 hover:border-brand/25"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl ${
                        fulfillment === "delivery"
                          ? "bg-brand text-white"
                          : "bg-white text-brand ring-1 ring-brand/10"
                      }`}
                    >
                      <Truck className="size-4" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-foreground">
                        Envío a domicilio
                      </span>
                      <span className="mt-0.5 block text-xs text-neutral">
                        Ingresa la dirección de entrega
                      </span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfillment("pickup")}
                    className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition ${
                      fulfillment === "pickup"
                        ? "border-brand bg-brand/5 ring-2 ring-brand/20"
                        : "border-brand/12 bg-surface/40 hover:border-brand/25"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl ${
                        fulfillment === "pickup"
                          ? "bg-brand text-white"
                          : "bg-white text-brand ring-1 ring-brand/10"
                      }`}
                    >
                      <Store className="size-4" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-foreground">
                        Retiro en sucursal
                      </span>
                      <span className="mt-0.5 block text-xs text-neutral">
                        Retiras en {company.address.commune}
                      </span>
                    </span>
                  </button>
                </div>
              </div>

              <h2 className="text-base font-bold text-foreground">
                Datos de contacto
              </h2>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-foreground">
                  Nombre completo
                </span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 w-full rounded-xl border border-brand/15 bg-surface/40 px-4 text-sm outline-none transition focus:border-brand/30 focus:ring-2 focus:ring-brand/15"
                  placeholder="Ej: María González"
                  autoComplete="name"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-foreground">
                  Teléfono
                </span>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12 w-full rounded-xl border border-brand/15 bg-surface/40 px-4 text-sm outline-none transition focus:border-brand/30 focus:ring-2 focus:ring-brand/15"
                  placeholder="+56 9 1234 5678"
                  autoComplete="tel"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-foreground">
                  Correo electrónico
                </span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full rounded-xl border border-brand/15 bg-surface/40 px-4 text-sm outline-none transition focus:border-brand/30 focus:ring-2 focus:ring-brand/15"
                  placeholder="tucorreo@ejemplo.com"
                  autoComplete="email"
                />
                <span className="mt-1.5 block text-xs text-neutral">
                  Te enviaremos la confirmación de tu compra a este correo.
                </span>
              </label>

              {fulfillment === "delivery" ? (
                <div className="space-y-5 rounded-2xl bg-surface/50 p-4 ring-1 ring-brand/8">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-brand" aria-hidden />
                    <h3 className="text-sm font-bold text-foreground">
                      Dirección de envío
                    </h3>
                  </div>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-foreground">
                      Calle y número
                    </span>
                    <input
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="h-12 w-full rounded-xl border border-brand/15 bg-white px-4 text-sm outline-none transition focus:border-brand/30 focus:ring-2 focus:ring-brand/15"
                      placeholder="Ej: Av. Los Pajaritos 1234"
                      autoComplete="street-address"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-foreground">
                      Comuna
                    </span>
                    <input
                      required
                      value={commune}
                      onChange={(e) => setCommune(e.target.value)}
                      className="h-12 w-full rounded-xl border border-brand/15 bg-white px-4 text-sm outline-none transition focus:border-brand/30 focus:ring-2 focus:ring-brand/15"
                      placeholder="Maipú"
                      autoComplete="address-level2"
                    />
                  </label>
                </div>
              ) : (
                <div className="rounded-2xl bg-surface/50 p-4 ring-1 ring-brand/8">
                  <div className="flex items-center gap-2">
                    <Store className="size-4 text-brand" aria-hidden />
                    <h3 className="text-sm font-bold text-foreground">
                      Sucursal de retiro
                    </h3>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    {company.tradeName}
                  </p>
                  <p className="mt-1 text-sm text-neutral">
                    {company.address.street}
                    <br />
                    {company.address.commune}, {company.address.city}
                  </p>
                  <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-neutral">
                    <Clock className="size-3.5" aria-hidden />
                    {company.hours.label}: {company.hours.display}
                  </p>
                  <a
                    href={company.address.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex text-xs font-semibold text-brand hover:underline"
                  >
                    Ver en Google Maps
                  </a>
                </div>
              )}

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-foreground">
                  Notas{" "}
                  <span className="font-normal text-neutral">(opcional)</span>
                </span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full resize-none rounded-xl border border-brand/15 bg-surface/40 px-4 py-3 text-sm outline-none transition focus:border-brand/30 focus:ring-2 focus:ring-brand/15"
                  placeholder={
                    fulfillment === "delivery"
                      ? "Depto, block, referencia o horario preferido"
                      : "Horario aproximado de retiro u otra indicación"
                  }
                />
              </label>

              {errors.form ? (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700 ring-1 ring-red-200">
                  {errors.form}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green px-4 text-sm font-bold text-white transition hover:bg-[#189866] disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Procesando…
                  </>
                ) : (
                  <>
                    <Lock className="size-4" aria-hidden />
                    Pagar {formatClp(subtotal)}
                  </>
                )}
              </button>
            </form>

            <aside className="lg:col-span-5">
              <div className="sticky top-24 rounded-[1.5rem] bg-white p-5 ring-1 ring-brand/10">
                <h2 className="text-base font-bold text-foreground">
                  Resumen ({totalItems})
                </h2>
                <ul className="mt-4 space-y-3">
                  {items.map((item) => (
                    <li
                      key={item.productId}
                      className="flex items-start justify-between gap-3 text-sm"
                    >
                      <span className="text-foreground">
                        {item.name}{" "}
                        <span className="text-neutral">×{item.qty}</span>
                      </span>
                      <span className="shrink-0 font-semibold tabular-nums text-foreground">
                        {formatClp(item.price * item.qty)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 rounded-xl bg-surface/70 px-3 py-2.5 text-sm">
                  <p className="text-xs font-semibold tracking-wide text-neutral uppercase">
                    Entrega
                  </p>
                  <p className="mt-0.5 font-semibold text-foreground">
                    {FULFILLMENT_LABELS[fulfillment]}
                  </p>
                  {fulfillment === "pickup" ? (
                    <p className="mt-1 text-xs text-neutral">
                      {company.address.full}
                    </p>
                  ) : null}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-brand/10 pt-4">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="text-xl font-extrabold text-brand">
                    {formatClp(subtotal)}
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-neutral">
                  {fulfillment === "delivery"
                    ? "El costo de despacho se confirma según zona."
                    : "Sin costo de despacho. Retiras en nuestra sucursal."}
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
