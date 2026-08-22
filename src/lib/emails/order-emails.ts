import { getResend } from "@/lib/resend";
import { company } from "@/lib/company";
import { formatClp } from "@/types/product";
import type { AdminOrder } from "@/lib/admin/types";

function getFromAddress() {
  return (
    process.env.ORDER_FROM_EMAIL ||
    process.env.CONTACT_FROM_EMAIL ||
    "Agua Ser Plus <onboarding@resend.dev>"
  );
}

function getLogoUrl() {
  return new URL(company.logo.src, company.websiteUrl).toString();
}

function layout(title: string, bodyHtml: string) {
  const logoUrl = getLogoUrl();

  return `
  <div style="background:#f5faff;padding:32px 16px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid rgba(12,45,74,0.08);">
      <tr>
        <td style="background:#0c2d4a;padding:20px 32px;">
          <table role="presentation" width="100%" style="border-collapse:collapse;">
            <tr>
              <td style="width:42px;padding:0 12px 0 0;vertical-align:middle;">
                <img
                  src="${logoUrl}"
                  alt="${company.logo.alt}"
                  width="42"
                  style="display:block;width:42px;height:42px;border-radius:12px;border:0;"
                />
              </td>
              <td style="vertical-align:middle;">
                <span style="display:inline-block;color:#ffffff;font-size:18px;font-weight:800;letter-spacing:0.02em;line-height:1.2;">${company.tradeName}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:32px;">
          <h1 style="margin:0 0 16px;font-size:20px;color:#0c2d4a;">${title}</h1>
          ${bodyHtml}
        </td>
      </tr>
      <tr>
        <td style="padding:20px 32px;background:#f5faff;border-top:1px solid rgba(12,45,74,0.08);">
          <p style="margin:0;font-size:12px;color:#7a8794;">
            ${company.tradeName} · ${company.address.full}<br />
            ${company.phone.mobileDisplay} · ${company.email}
          </p>
        </td>
      </tr>
    </table>
  </div>`;
}

function itemsHtml(order: AdminOrder) {
  const rows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;color:#0c2d4a;font-size:14px;">${item.title} <span style="color:#7a8794;">× ${item.qty}</span></td>
        <td style="padding:8px 0;text-align:right;font-size:14px;font-weight:700;color:#0c2d4a;">${formatClp(item.qty * item.unitPrice)}</td>
      </tr>`,
    )
    .join("");

  return `
    <table role="presentation" width="100%" style="margin:16px 0;border-top:1px solid rgba(12,45,74,0.08);border-bottom:1px solid rgba(12,45,74,0.08);">
      ${rows}
      <tr>
        <td style="padding:10px 0 0;font-size:14px;font-weight:800;color:#0c2d4a;">Total</td>
        <td style="padding:10px 0 0;text-align:right;font-size:16px;font-weight:800;color:#0c2d4a;">${formatClp(order.total)}</td>
      </tr>
    </table>`;
}

/**
 * Correo de confirmación: se envía cuando Klap confirma el pago.
 */
export async function sendOrderConfirmedEmail(order: AdminOrder) {
  const to = order.customer.email?.trim();
  if (!to) return;

  const deliveryLine =
    order.fulfillment === "pickup"
      ? `Retirarás tu pedido en nuestra sucursal: ${company.address.full}.`
      : `Despacharemos tu pedido a: ${order.shipping.address}, ${order.shipping.commune}.`;

  const html = layout(
    "¡Tu compra fue confirmada! ✅",
    `
      <p style="margin:0 0 12px;font-size:14px;color:#0c2d4a;">Hola ${order.customer.name},</p>
      <p style="margin:0 0 12px;font-size:14px;color:#0c2d4a;">
        Confirmamos que tu pago fue <strong>aceptado</strong> y tu pedido
        <strong>${order.id}</strong> quedó registrado correctamente.
      </p>
      <p style="margin:0 0 12px;font-size:14px;color:#0c2d4a;">
        Nos estaremos poniendo en contacto contigo a la brevedad para coordinar
        el despacho de tu pedido. ${deliveryLine}
      </p>
      ${itemsHtml(order)}
      <p style="margin:16px 0 0;font-size:13px;color:#7a8794;">
        Si tienes cualquier duda, respóndenos a este correo o escríbenos al
        ${company.phone.mobileDisplay}.
      </p>
    `,
  );

  const resend = getResend();
  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: [to],
    replyTo: company.email,
    subject: `Confirmamos tu compra — Pedido ${order.id}`,
    html,
    text: [
      `Hola ${order.customer.name},`,
      "",
      `Confirmamos que tu pago fue aceptado y tu pedido ${order.id} quedó registrado correctamente.`,
      `Nos estaremos poniendo en contacto contigo a la brevedad para coordinar el despacho de tu pedido.`,
      deliveryLine,
      "",
      `Total: ${formatClp(order.total)}`,
    ].join("\n"),
  });

  if (error) {
    console.error("[order email] confirm send error", error);
  }
}

/**
 * Correo de rechazo/cancelación: se envía cuando Klap rechaza o el
 * cliente cancela el pago antes de completarlo.
 */
export async function sendOrderReceivedNotificationEmail(order: AdminOrder) {
  const to = (
    process.env.COMMERCIAL_TO_EMAIL ||
    process.env.CONTACT_TO_EMAIL ||
    "comercial@aguaser.cl"
  )
    .trim()
    .toLowerCase();

  if (!to) return;

  const deliveryLine =
    order.fulfillment === "pickup"
      ? `Retiro en sucursal: ${company.address.full}.`
      : `Despacho a: ${order.shipping.address}, ${order.shipping.commune}.`;

  const html = layout(
    "Nuevo pedido recibido",
    `
      <p style="margin:0 0 12px;font-size:14px;color:#0c2d4a;">Hola equipo de comercial,</p>
      <p style="margin:0 0 12px;font-size:14px;color:#0c2d4a;">
        Se ha registrado un nuevo pedido en <strong>${company.tradeName}</strong> y
        ya queda pendiente de atención.
      </p>
      <p style="margin:0 0 12px;font-size:14px;color:#0c2d4a;">
        <strong>Pedido:</strong> ${order.id}<br />
        <strong>Cliente:</strong> ${order.customer.name}<br />
        <strong>Email:</strong> ${order.customer.email}<br />
        <strong>Teléfono:</strong> ${order.customer.phone || "-"}<br />
        <strong>Monto total:</strong> ${formatClp(order.total)}<br />
        <strong>Entrega:</strong> ${deliveryLine}
      </p>
      ${itemsHtml(order)}
      <p style="margin:16px 0 0;font-size:13px;color:#7a8794;">
        Este correo es una notificación interna para informar que se recibió una compra.
      </p>
    `,
  );

  const resend = getResend();
  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: [to],
    replyTo: company.email,
    subject: `Nuevo pedido recibido — Pedido ${order.id}`,
    html,
    text: [
      "Nuevo pedido recibido en Agua Ser Plus.",
      "",
      `Pedido: ${order.id}`,
      `Cliente: ${order.customer.name}`,
      `Email: ${order.customer.email}`,
      `Teléfono: ${order.customer.phone || "-"}`,
      `Monto total: ${formatClp(order.total)}`,
      `Entrega: ${deliveryLine}`,
    ].join("\n"),
  });

  if (error) {
    console.error("[order email] internal notification send error", error);
  }
}

export async function sendOrderRejectedEmail(input: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  reason?: string;
}) {
  const to = input.customerEmail?.trim();
  if (!to) return;

  const html = layout(
    "No pudimos procesar tu pago",
    `
      <p style="margin:0 0 12px;font-size:14px;color:#0c2d4a;">Hola ${input.customerName},</p>
      <p style="margin:0 0 12px;font-size:14px;color:#0c2d4a;">
        Tu pago para el pedido <strong>${input.orderId}</strong> fue
        <strong>rechazado o no se completó</strong>${input.reason ? ` (${input.reason})` : ""}.
      </p>
      <p style="margin:0 0 12px;font-size:14px;color:#0c2d4a;">
        No te preocupes, tu carro sigue disponible: puedes volver a intentar el
        pago desde nuestro sitio cuando quieras.
      </p>
      <p style="margin:16px 0 0;font-size:13px;color:#7a8794;">
        Si el problema persiste, respóndenos a este correo o escríbenos al
        ${company.phone.mobileDisplay} y te ayudamos a completar tu compra.
      </p>
    `,
  );

  const resend = getResend();
  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: [to],
    replyTo: company.email,
    subject: `No pudimos procesar tu pago — Pedido ${input.orderId}`,
    html,
    text: [
      `Hola ${input.customerName},`,
      "",
      `Tu pago para el pedido ${input.orderId} fue rechazado o no se completó${input.reason ? ` (${input.reason})` : ""}.`,
      "No te preocupes, tu carro sigue disponible: puedes volver a intentar el pago desde nuestro sitio cuando quieras.",
    ].join("\n"),
  });

  if (error) {
    console.error("[order email] reject send error", error);
  }
}
