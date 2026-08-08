import { NextResponse } from "next/server";
import {
  getOrderByExternalPaymentId,
  getOrderById,
  updateOrderInDb,
} from "@/lib/admin/orders-db";

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
