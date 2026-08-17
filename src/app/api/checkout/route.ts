import { NextResponse } from "next/server";
import { createPayment } from "@/lib/payments/adapter";
import {
  createOrderId,
  validateAndPriceItems,
  validateCustomer,
  type CheckoutRequestBody,
} from "@/lib/checkout";
import { createOrderInDb } from "@/lib/admin/orders-db";
import { buildAdminOrderFromCheckout } from "@/lib/admin/order-from-checkout";

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

  const priced = validateAndPriceItems(body.items ?? []);
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

  const orderId = createOrderId();
  const origin = new URL(request.url).origin;

  try {
    const payment = await createPayment({
      orderId,
      amount: priced.amount,
      items: priced.items,
      customer: customerResult.customer,
      origin,
    });

    await createOrderInDb(
      buildAdminOrderFromCheckout({
        orderId,
        amount: priced.amount,
        items: priced.items,
        customer: customerResult.customer,
        paymentProvider: payment.provider,
        externalPaymentId: payment.klapOrderId ?? payment.paymentId,
        // Sandbox “paga” al instante; Klap queda pending hasta webhook
        status: payment.provider === "sandbox" ? "processing" : "pending",
      }),
    );

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
