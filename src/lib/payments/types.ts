import type { CartCustomer, CheckoutOrderItem } from "@/types/cart";

export type CreatePaymentInput = {
  orderId: string;
  amount: number;
  items: CheckoutOrderItem[];
  customer: CartCustomer;
  /** Absolute site origin, e.g. https://example.com */
  origin: string;
};

export type PaymentProvider =
  | "sandbox"
  | "mercadopago"
  | "webpay"
  | "klap";

export type CreatePaymentResult = {
  paymentId: string;
  provider: PaymentProvider;
  /** Redirect hosted (sandbox u orden Klap clásica) */
  redirectUrl?: string;
  /** Checkout Flex: order_id para KLAP_FLEX.init */
  klapOrderId?: string;
};

export type PaymentAdapter = {
  createPayment: (input: CreatePaymentInput) => Promise<CreatePaymentResult>;
};
