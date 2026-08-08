import { NextResponse } from "next/server";
import {
  getOrderByExternalPaymentId,
  getOrderById,
  updateOrderInDb,
} from "@/lib/admin/orders-db";

type KlapWebhookPayload = {
  order_id?: string;
  reference_id?: string;
  status?: string;
  [key: string]: unknown;
};

/**
 * Webhook de notificación Klap (confirm / reject / validation).
 * Actualiza el pedido en Neon según el evento.
 */
export async function POST(request: Request) {
  const url = new URL(request.url);
  const event = url.searchParams.get("event") ?? "unknown";

  let payload: KlapWebhookPayload = {};
  try {
    payload = (await request.json()) as KlapWebhookPayload;
  } catch {
    payload = {};
  }

  console.info("[klap webhook]", event, payload);

  const referenceId =
    typeof payload.reference_id === "string" ? payload.reference_id : null;
  const externalId =
    typeof payload.order_id === "string" ? payload.order_id : null;

  try {
    const order =
      (referenceId ? await getOrderById(referenceId) : null) ??
      (externalId ? await getOrderByExternalPaymentId(externalId) : null);

    if (order) {
      if (event === "confirm") {
        await updateOrderInDb(order.id, {
          status: "processing",
          externalPaymentId: externalId ?? order.externalPaymentId,
          paymentProvider: "klap",
          paymentMethod: "klap",
        });
      } else if (event === "reject") {
        await updateOrderInDb(order.id, {
          status: "cancelled",
          externalPaymentId: externalId ?? order.externalPaymentId,
          paymentProvider: "klap",
          paymentMethod: "klap",
        });
      }
    }
  } catch (error) {
    console.error("[klap webhook] persist error", error);
  }

  return NextResponse.json({ received: true, event });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  return NextResponse.json({
    ok: true,
    event: url.searchParams.get("event"),
    hint: "Klap debe notificar por POST.",
  });
}
