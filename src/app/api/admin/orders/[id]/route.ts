import { NextResponse } from "next/server";
import { updateOrderInDb } from "@/lib/admin/orders-db";
import { isAdminAuthenticated, unauthorized } from "@/lib/admin/session";
import type { AdminOrder, OrderStatus } from "@/lib/admin/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const STATUSES = new Set<OrderStatus>([
  "pending",
  "processing",
  "shipped",
  "cancelled",
]);

export async function PUT(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) return unauthorized();
  const { id } = await context.params;

  let body: Partial<AdminOrder>;
  try {
    body = (await request.json()) as Partial<AdminOrder>;
  } catch {
    return NextResponse.json(
      { success: false, error: "JSON inválido." },
      { status: 400 },
    );
  }

  try {
    const patch: Partial<Omit<AdminOrder, "id" | "createdAt">> = {};

    if (body.status && STATUSES.has(body.status)) patch.status = body.status;
    if (body.customer) patch.customer = body.customer;
    if (body.shipping) patch.shipping = body.shipping;
    if (body.billing) patch.billing = body.billing;
    if (body.paymentMethod) patch.paymentMethod = body.paymentMethod;
    if (body.paymentProvider !== undefined) {
      patch.paymentProvider = body.paymentProvider;
    }
    if (body.externalPaymentId !== undefined) {
      patch.externalPaymentId = body.externalPaymentId;
    }
    if (body.fulfillment) patch.fulfillment = body.fulfillment;
    if (Array.isArray(body.items)) {
      patch.items = body.items;
      patch.total = body.items.reduce(
        (sum, item) => sum + item.qty * item.unitPrice,
        0,
      );
    } else if (typeof body.total === "number") {
      patch.total = Math.max(0, body.total);
    }

    const updated = await updateOrderInDb(id, patch);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Pedido no encontrado." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("update order error", error);
    return NextResponse.json(
      { success: false, error: "No se pudo actualizar el pedido." },
      { status: 500 },
    );
  }
}
