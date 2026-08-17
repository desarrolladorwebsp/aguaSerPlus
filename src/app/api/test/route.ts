import { NextResponse } from "next/server";

async function checkUrlReachable(url: string, headers?: Record<string, string>) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(url, {
      method: "HEAD",
      headers,
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeout);

    return {
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      url,
    };
  } catch (error) {
    return {
      ok: false,
      status: null,
      statusText: error instanceof Error ? error.message : "Unknown error",
      url,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function GET() {
  const paymentProvider = process.env.PAYMENT_PROVIDER?.trim().toLowerCase();
  const klapOrdersUrl =
    process.env.KLAP_ORDERS_URL?.trim() ||
    "https://api-pasarela.mcdesaqa.cl/payment-gateway/v1/orders";
  const klapFlexScriptUrl =
    process.env.NEXT_PUBLIC_KLAP_FLEX_SCRIPT_URL?.trim() ||
    "https://mcdesaqa.cl/pagos/checkout-flex/v1/main.min.js";

  const [ordersCheck, flexCheck] = await Promise.all([
    checkUrlReachable(klapOrdersUrl, {
      Apikey: process.env.KLAP_API_KEY?.trim() ?? "",
    }),
    checkUrlReachable(klapFlexScriptUrl),
  ]);

  const envStatus = {
    PAYMENT_PROVIDER: paymentProvider ?? "not_set",
    KLAP_API_KEY: Boolean(process.env.KLAP_API_KEY?.trim()),
    KLAP_ORDERS_URL: klapOrdersUrl,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL?.trim() ?? "not_set",
    KLAP_WEBHOOKS_BASE_URL:
      process.env.KLAP_WEBHOOKS_BASE_URL?.trim() ?? "not_set",
    NEXT_PUBLIC_KLAP_FLEX_SCRIPT_URL: klapFlexScriptUrl,
  };

  const isReady = Boolean(
    paymentProvider === "klap" &&
      process.env.KLAP_API_KEY?.trim() &&
      ordersCheck.ok,
  );

  return NextResponse.json(
    {
      ok: isReady,
      message:
        isReady
          ? "Producción configurada para Klap y el endpoint responde."
          : "La configuración de producción no está lista o Klap no responde.",
      env: envStatus,
      checks: {
        klapOrders: ordersCheck,
        klapFlexScript: flexCheck,
      },
    },
    {
      status: isReady ? 200 : 500,
    },
  );
}
