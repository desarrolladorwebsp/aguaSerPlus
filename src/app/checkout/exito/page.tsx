import type { Metadata } from "next";
import { Suspense } from "react";
import CheckoutSuccessClient from "@/components/cart/CheckoutSuccessClient";

export const metadata: Metadata = {
  title: "Pago exitoso | Agua Ser Plus",
  description: "Tu pedido Agua Ser Plus fue pagado correctamente.",
};

export default function CheckoutExitoPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessClient />
    </Suspense>
  );
}
