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
 * En producción se usa Klap real. El sandbox queda solo para desarrollo local.
 */
export function getPaymentAdapter(): PaymentAdapter {
  const configured = process.env.PAYMENT_PROVIDER?.trim().toLowerCase();
  const provider =
    configured ??
    (process.env.NODE_ENV === "production" ? "klap" : "sandbox");

  switch (provider) {
    case "klap":
      return klapAdapter;
    case "sandbox":
      return sandboxAdapter;
    case "mercadopago":
    case "webpay":
      throw new Error(
        `Proveedor de pago no soportado en este entorno: ${provider}. Usa "klap" o "sandbox".`,
      );
    default:
      throw new Error(
        `Proveedor de pago no configurado o inválido: ${provider ?? "(vacío)"}.`,
      );
  }
}

export async function createPayment(
  input: CreatePaymentInput,
): Promise<CreatePaymentResult> {
  return getPaymentAdapter().createPayment(input);
}
