import type { Metadata } from "next";
import CheckoutPageClient from "@/components/cart/CheckoutPageClient";

export const metadata: Metadata = {
  title: "Checkout | Agua Ser Plus",
  description: "Completa tus datos y paga tu pedido Agua Ser Plus online.",
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
