import type { CreatePaymentInput, CreatePaymentResult, PaymentAdapter } from "./types";
import { createKlapOrder } from "./klap";

/**
 * Sandbox adapter: simula una pasarela de pago online.
 */
const sandboxAdapter: PaymentAdapter = {
  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const paymentId = `sandbox_${input.orderId}`;
    const params = new URLSearchParams({
      orderId: input.orderId,
      paymentId,
      amount: String(input.amount),
    });

    return {
      paymentId,
      redirectUrl: `${input.origin}/checkout/exito?${params.toString()}`,
      provider: "sandbox",
    };
  },
};

const klapAdapter: PaymentAdapter = {
  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const order = await createKlapOrder(input);
    return {
      paymentId: order.order_id,
      provider: "klap",
      klapOrderId: order.order_id,
      // Fallback por si Flex no está disponible: URL hosted de Klap
      redirectUrl: order.redirect_url,
    };
  },
};

/**
 * Punto único para elegir la pasarela.
 */
export function getPaymentAdapter(): PaymentAdapter {
  const provider = (process.env.PAYMENT_PROVIDER ?? "sandbox").toLowerCase();

  switch (provider) {
    case "klap":
      return klapAdapter;
    case "mercadopago":
    case "webpay":
      // Aún no implementados — cae a sandbox para no romper el flujo.
      return sandboxAdapter;
    default:
      return sandboxAdapter;
  }
}

export async function createPayment(
  input: CreatePaymentInput,
): Promise<CreatePaymentResult> {
  return getPaymentAdapter().createPayment(input);
}
