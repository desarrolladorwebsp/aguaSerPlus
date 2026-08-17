import type { CreatePaymentInput } from "./types";

export type KlapOrderResponse = {
  order_id: string;
  reference_id?: string;
  redirect_url?: string;
  status?: string;
};

type KlapErrorBody = {
  code?: string | number;
  message?: string;
  error?: string;
  status?: string | number;
};

function requireEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} no está configurada.`);
  }
  return value;
}

function getDefaultKlapOrdersUrl() {
  return process.env.NODE_ENV === "production"
    ? "https://api-pasarela.mcdesaqa.cl/payment-gateway/v1/orders"
    : "https://api-pasarela-sandbox.mcdesaqa.cl/payment-gateway/v1/orders";
}

function isPublicHttpUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return false;
    }
    const host = parsed.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host.endsWith(".local") ||
      /^\d+\.\d+\.\d+\.\d+$/.test(host) // LAN IPs no alcanzables por Klap
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Base pública para webhooks.
 * En local Klap no puede llamar a localhost → omitimos webhooks
 * (igual que el plugin WooCommerce deja webhook_validation en null).
 * En producción usa NEXT_PUBLIC_APP_URL o KLAP_WEBHOOKS_BASE_URL.
 */
function resolveWebhookBase(origin: string) {
  const configured =
    process.env.KLAP_WEBHOOKS_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    origin;
  const base = configured.replace(/\/$/, "");
  return isPublicHttpUrl(base) ? base : null;
}

/**
 * Crea una orden en Klap Checkout (sandbox/producción).
 * Header requerido: Apikey
 * Respuesta esperada: { order_id, ... }
 */
export async function createKlapOrder(
  input: CreatePaymentInput,
): Promise<KlapOrderResponse> {
  if (input.amount < 50) {
    throw new Error("El monto mínimo de pago con Klap es $50.");
  }

  const apiKey = requireEnv("KLAP_API_KEY");
  const ordersUrl =
    process.env.KLAP_ORDERS_URL?.trim() || getDefaultKlapOrdersUrl();

  const origin = input.origin.replace(/\/$/, "");
  const webhookBase = resolveWebhookBase(origin);

  const body: Record<string, unknown> = {
    reference_id: input.orderId,
    description:
      input.items[0]?.name ??
      `Pedido Agua Ser Plus (${input.items.length} ítems)`,
    generate_token: "none",
    amount: {
      currency: "CLP",
      total: Math.round(input.amount),
    },
    methods: ["tarjetas"],
    items: input.items.map((item) => ({
      name: item.name,
      code: item.productId,
      unit_price: item.price,
      quantity: item.qty,
      price: item.price * item.qty,
    })),
    customs: [
      { key: "payments_notify_user", value: "true" },
      { key: "plugin_ecommerce_name", value: "Agua Ser Plus" },
      { key: "plugin_ecommerce_platform", value: "nextjs" },
      { key: "tarjetas_expiration_minutes", value: "60" },
    ],
    urls: {
      return_url: `${origin}/checkout/exito?referenceId=${encodeURIComponent(input.orderId)}`,
      cancel_url: `${origin}/checkout/error?referenceId=${encodeURIComponent(input.orderId)}`,
    },
  };

  // Solo enviamos webhooks si Klap puede alcanzarlos (HTTPS público).
  // Nunca enviamos webhook_validation en local: provoca 500010.
  if (webhookBase) {
    body.webhooks = {
      webhook_confirm: `${webhookBase}/api/payments/klap/webhook?event=confirm`,
      webhook_reject: `${webhookBase}/api/payments/klap/webhook?event=reject`,
    };
  }

  let res: Response;
  try {
    res = await fetch(ordersUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Apikey: apiKey,
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.error("Klap create order network error", {
      ordersUrl,
      apiKeyConfigured: Boolean(apiKey),
      error,
    });
    throw new Error(
      "No se pudo conectar con Klap desde el servidor. Revisa la URL de Klap, la API key y la conectividad de producción.",
    );
  }

  const text = await res.text();
  let json: KlapOrderResponse & KlapErrorBody;
  try {
    json = JSON.parse(text) as KlapOrderResponse & KlapErrorBody;
  } catch {
    console.error("Klap create order non-JSON", res.status, text.slice(0, 500));
    throw new Error("Respuesta inválida de Klap al crear la orden.");
  }

  if (!res.ok || !json.order_id) {
    const message =
      json.message ||
      json.error ||
      `Klap rechazó la orden (HTTP ${res.status}).`;
    console.error("Klap create order error", res.status, json);
    throw new Error(message);
  }

  return json;
}
