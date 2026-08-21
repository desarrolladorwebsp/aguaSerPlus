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
import { sendOrderConfirmedEmail } from "@/lib/emails/order-emails";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * Consulta pública de un pedido por id interno (referenceId)
 * o por order_id externo de Klap.
 * El id es suficientemente opaco para usarse en el comprobante.
 */
export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const orderId = decodeURIComponent(id).trim();
  if (!orderId) {
    return NextResponse.json(
      { success: false, error: "ID inválido." },
      { status: 400 },
    );
  }

  try {
    let order =
      (await getOrderById(orderId)) ??
      (await getOrderByExternalPaymentId(orderId));

    if (!order) {
      // El cliente volvió a la página de éxito antes de que llegara el
      // webhook: si hay un borrador pendiente, recién ahora se confirma
      // el pedido y se descuenta stock.
      const draft =
        (await getCheckoutDraftById(orderId)) ??
        (await getCheckoutDraftByExternalId(orderId));
      if (draft) {
        const newOrder = buildAdminOrderFromCheckout({
          orderId: draft.orderId,
          amount: draft.amount,
          items: draft.items,
          customer: draft.customer,
          paymentProvider: draft.paymentProvider,
          externalPaymentId: draft.externalPaymentId,
          status: "processing",
        });
        await createOrderInDb(newOrder);
        await decrementStockForItems(newOrder.items);
        await deleteCheckoutDraft(draft.orderId);
        order = newOrder;
        try {
          await sendOrderConfirmedEmail(newOrder);
        } catch (emailError) {
          console.error("[orders/:id] confirm email error", emailError);
        }
      }
    }

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Pedido no encontrado." },
        { status: 404 },
      );
    }

    // Retorno desde pasarela (éxito): si sigue pending, pasa a processing
    if (order.status === "pending") {
      const updated = await updateOrderInDb(order.id, {
        status: "processing",
      });
      if (updated) order = updated;
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("get order error", error);
    return NextResponse.json(
      { success: false, error: "No se pudo cargar el pedido." },
      { status: 500 },
    );
  }
}
