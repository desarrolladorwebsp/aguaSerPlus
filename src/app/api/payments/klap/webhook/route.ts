import { NextResponse } from "next/server";
import {
  decrementStockForItems,
  getOrderByExternalPaymentId,
  getOrderById,
  createOrderInDb,
  updateOrderInDb,
} from "@/lib/admin/orders-db";
import { buildAdminOrderFromCheckout } from "@/lib/admin/order-from-checkout";
import {
  deleteCheckoutDraft,
  getCheckoutDraftByExternalId,
  getCheckoutDraftById,
} from "@/lib/admin/checkout-drafts";
import {
  sendOrderConfirmedEmail,
  sendOrderReceivedNotificationEmail,
  sendOrderRejectedEmail,
} from "@/lib/emails/order-emails";

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

    if (event === "confirm") {
      if (order) {
        await updateOrderInDb(order.id, {
          status: "processing",
          externalPaymentId: externalId ?? order.externalPaymentId,
          paymentProvider: "klap",
          paymentMethod: "klap",
        });
      } else {
        // Pago confirmado por primera vez: recién ahora se crea el
        // "pedido" real y se descuenta stock.
        const draft =
          (referenceId ? await getCheckoutDraftById(referenceId) : null) ??
          (externalId ? await getCheckoutDraftByExternalId(externalId) : null);
        if (draft) {
          const newOrder = buildAdminOrderFromCheckout({
            orderId: draft.orderId,
            amount: draft.amount,
            items: draft.items,
            customer: draft.customer,
            paymentProvider: "klap",
            externalPaymentId: externalId ?? draft.externalPaymentId,
            status: "processing",
          });
          await createOrderInDb(newOrder);
          await decrementStockForItems(newOrder.items);
          await deleteCheckoutDraft(draft.orderId);
          try {
            await sendOrderConfirmedEmail(newOrder);
            await sendOrderReceivedNotificationEmail(newOrder);
          } catch (emailError) {
            console.error("[klap webhook] confirm email error", emailError);
          }
        }
      }
    } else if (event === "reject") {
      if (order) {
        // El pedido ya existía (ej. confirmado y luego revertido): se
        // marca cancelado para trazabilidad, pero no se crea uno nuevo.
        await updateOrderInDb(order.id, {
          status: "cancelled",
          externalPaymentId: externalId ?? order.externalPaymentId,
          paymentProvider: "klap",
          paymentMethod: "klap",
        });
      } else {
        // Pago rechazado/cancelado sin llegar a confirmarse: se descarta
        // el borrador y nunca se registra como pedido.
        const draft =
          (referenceId ? await getCheckoutDraftById(referenceId) : null) ??
          (externalId ? await getCheckoutDraftByExternalId(externalId) : null);
        if (draft) {
          await deleteCheckoutDraft(draft.orderId);
          try {
            await sendOrderRejectedEmail({
              orderId: draft.orderId,
              customerName: draft.customer.name,
              customerEmail: draft.customer.email,
            });
          } catch (emailError) {
            console.error("[klap webhook] reject email error", emailError);
          }
        }
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
