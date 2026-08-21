import { NextResponse } from "next/server";
import { createPayment } from "@/lib/payments/adapter";
import {
  createOrderId,
  validateAndPriceItems,
  validateCustomer,
  type CheckoutRequestBody,
} from "@/lib/checkout";
import { createOrderInDb, decrementStockForItems } from "@/lib/admin/orders-db";
import { buildAdminOrderFromCheckout } from "@/lib/admin/order-from-checkout";
import { createCheckoutDraft } from "@/lib/admin/checkout-drafts";

export async function POST(request: Request) {
  let body: CheckoutRequestBody;

  try {
    body = (await request.json()) as CheckoutRequestBody;
  } catch {
    return NextResponse.json(
      { success: false, error: "JSON inválido." },
      { status: 400 },
    );
  }

  const priced = await validateAndPriceItems(body.items ?? []);
  if ("error" in priced) {
    return NextResponse.json(
      { success: false, error: priced.error },
      { status: 400 },
    );
  }

  const customerResult = validateCustomer(body.customer);
  if ("error" in customerResult) {
    return NextResponse.json(
      { success: false, error: customerResult.error },
      { status: 400 },
    );
  }

  const orderId = await createOrderId();
  const origin = new URL(request.url).origin;

  try {
    const payment = await createPayment({
      orderId,
      amount: priced.amount,
      items: priced.items,
      customer: customerResult.customer,
      origin,
    });

    if (payment.provider === "sandbox") {
      // Sandbox "paga" al instante: se registra el pedido de una vez.
      const order = buildAdminOrderFromCheckout({
        orderId,
        amount: priced.amount,
        items: priced.items,
        customer: customerResult.customer,
        paymentProvider: payment.provider,
        externalPaymentId: payment.klapOrderId ?? payment.paymentId,
        status: "processing",
      });
      await createOrderInDb(order);
      await decrementStockForItems(order.items);
    } else {
      // Klap: el pago aún no se confirma. No se crea el pedido ni se
      // descuenta stock hasta que el webhook confirme el pago (o el
      // cliente vuelva a la página de éxito). Así los pagos rechazados
      // o cancelados nunca quedan registrados como "pedidos".
      await createCheckoutDraft({
        orderId,
        amount: priced.amount,
        items: priced.items,
        customer: customerResult.customer,
        paymentProvider: payment.provider,
        externalPaymentId: payment.klapOrderId ?? payment.paymentId,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId,
        amount: priced.amount,
        paymentId: payment.paymentId,
        redirectUrl: payment.redirectUrl,
        klapOrderId: payment.klapOrderId,
        provider: payment.provider,
      },
    });
  } catch (error) {
    console.error("checkout payment error", error);
    const message =
      error instanceof Error && error.message
        ? error.message
        : "No se pudo iniciar el pago. Intenta de nuevo.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
