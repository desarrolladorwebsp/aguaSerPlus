import type { CartCustomer, CheckoutOrderItem } from "@/types/cart";
import type { AdminOrder } from "@/lib/admin/types";
import { company } from "@/lib/company";

export function buildAdminOrderFromCheckout(input: {
  orderId: string;
  amount: number;
  items: CheckoutOrderItem[];
  customer: CartCustomer;
  paymentProvider: string;
  externalPaymentId?: string;
  status?: AdminOrder["status"];
}): AdminOrder {
  const now = new Date().toISOString();
  const paymentMethod: AdminOrder["paymentMethod"] =
    input.paymentProvider === "klap"
      ? "klap"
      : input.paymentProvider === "sandbox"
        ? "sandbox"
        : "webpay";

  const shippingAddress =
    input.customer.fulfillment === "pickup"
      ? company.address.full
      : input.customer.address;
  const shippingCommune =
    input.customer.fulfillment === "pickup"
      ? company.address.commune
      : input.customer.commune;

  return {
    id: input.orderId,
    status: input.status ?? "pending",
    createdAt: now,
    updatedAt: now,
    customer: {
      name: input.customer.name,
      email: input.customer.email,
      phone: input.customer.phone,
    },
    shipping: {
      address: shippingAddress,
      commune: shippingCommune,
      city: company.address.city,
      notes: input.customer.notes,
    },
    billing: {
      name: input.customer.name,
      address: `${shippingAddress}, ${shippingCommune}`,
    },
    paymentMethod,
    paymentProvider: input.paymentProvider,
    externalPaymentId: input.externalPaymentId,
    fulfillment: input.customer.fulfillment,
    items: input.items.map((item) => ({
      productId: item.productId,
      title: item.name,
      qty: item.qty,
      unitPrice: item.price,
    })),
    total: input.amount,
  };
}
