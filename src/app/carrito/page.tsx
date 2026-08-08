import type { Metadata } from "next";
import CartPageClient from "@/components/cart/CartPageClient";

export const metadata: Metadata = {
  title: "Carro de compra | Agua Ser Plus",
  description: "Revisa tu pedido de Agua Ser Plus y continúa al pago online.",
};

export default function CarritoPage() {
  return <CartPageClient />;
}
