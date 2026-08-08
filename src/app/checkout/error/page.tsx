import type { Metadata } from "next";
import { Suspense } from "react";
import CheckoutErrorClient from "@/components/cart/CheckoutErrorClient";

export const metadata: Metadata = {
  title: "Pago no completado | Agua Ser Plus",
  description: "No se pudo completar el pago. Puedes reintentar desde el checkout.",
};

export default function CheckoutErrorPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutErrorClient />
    </Suspense>
  );
}
