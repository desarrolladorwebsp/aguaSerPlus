import { NextResponse } from "next/server";
import {
  getOrderByExternalPaymentId,
  getOrderById,
} from "@/lib/admin/orders-db";
import { company } from "@/lib/company";
import { ORDER_STATUS_LABELS, type AdminOrder } from "@/lib/admin/types";
import { FULFILLMENT_LABELS } from "@/types/cart";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function formatClp(value: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("es-CL", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "America/Santiago",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function paymentLabel(order: AdminOrder) {
  switch (order.paymentMethod) {
    case "klap":
      return "Klap (tarjeta)";
    case "sandbox":
      return "Sandbox (prueba)";
    case "webpay":
      return "Webpay";
    case "transferencia":
      return "Transferencia";
    case "efectivo":
      return "Efectivo";
    default:
      return order.paymentMethod;
  }
}

function buildComprobanteHtml(order: AdminOrder) {
  const fulfillment =
    order.fulfillment && order.fulfillment in FULFILLMENT_LABELS
      ? FULFILLMENT_LABELS[order.fulfillment]
      : "—";

  const rows = order.items
    .map(
      (item) => `
      <tr>
        <td>${escapeHtml(item.title)}</td>
        <td class="num">${item.qty}</td>
        <td class="num">${formatClp(item.unitPrice)}</td>
        <td class="num">${formatClp(item.unitPrice * item.qty)}</td>
      </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Comprobante ${escapeHtml(order.id)} · ${escapeHtml(company.tradeName)}</title>
  <style>
    :root {
      --brand: #0056a3;
      --ink: #0c2d4a;
      --muted: #5b6b7a;
      --line: #d7e3ef;
      --bg: #f4f8fb;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
      color: var(--ink);
      background: var(--bg);
      line-height: 1.45;
    }
    .sheet {
      max-width: 780px;
      margin: 24px auto;
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 18px 40px -28px rgba(12,45,74,.35);
    }
    .actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-bottom: 20px;
    }
    .btn {
      appearance: none;
      border: 0;
      border-radius: 10px;
      padding: 10px 16px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
    }
    .btn-primary { background: var(--brand); color: #fff; }
    .btn-ghost { background: #eef4fa; color: var(--brand); }
    .head {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      border-bottom: 2px solid var(--brand);
      padding-bottom: 20px;
    }
    .brand h1 {
      margin: 0;
      font-size: 24px;
      letter-spacing: -0.02em;
    }
    .brand p { margin: 4px 0 0; color: var(--muted); font-size: 13px; }
    .meta {
      text-align: right;
      font-size: 13px;
      color: var(--muted);
    }
    .meta strong {
      display: block;
      color: var(--brand);
      font-size: 18px;
      margin-bottom: 4px;
    }
    .badge {
      display: inline-block;
      margin-top: 8px;
      padding: 4px 10px;
      border-radius: 999px;
      background: #e6f7f0;
      color: #1fa97a;
      font-size: 12px;
      font-weight: 700;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
      margin: 24px 0;
    }
    .card {
      background: #f8fbfe;
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 14px 16px;
    }
    .card h2 {
      margin: 0 0 8px;
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--muted);
    }
    .card p { margin: 0 0 4px; font-size: 14px; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
    }
    th, td {
      padding: 10px 8px;
      border-bottom: 1px solid var(--line);
      font-size: 14px;
      text-align: left;
    }
    th {
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--muted);
    }
    td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
    .totals {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
    }
    .totals-box {
      min-width: 240px;
      background: #041a2e;
      color: #fff;
      border-radius: 12px;
      padding: 14px 16px;
    }
    .totals-box .label { font-size: 12px; opacity: .7; }
    .totals-box .value {
      font-size: 28px;
      font-weight: 800;
      margin-top: 2px;
    }
    .foot {
      margin-top: 28px;
      padding-top: 16px;
      border-top: 1px dashed var(--line);
      font-size: 12px;
      color: var(--muted);
    }
    @media print {
      body { background: #fff; }
      .sheet {
        margin: 0;
        border: 0;
        border-radius: 0;
        box-shadow: none;
        max-width: none;
        padding: 0;
      }
      .actions { display: none !important; }
    }
    @media (max-width: 640px) {
      .sheet { margin: 0; border-radius: 0; border: 0; }
      .grid { grid-template-columns: 1fr; }
      .head { flex-direction: column; }
      .meta { text-align: left; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="actions">
      <button class="btn btn-ghost" type="button" onclick="window.print()">Imprimir / Guardar PDF</button>
    </div>

    <div class="head">
      <div class="brand">
        <h1>${escapeHtml(company.tradeName)}</h1>
        <p>${escapeHtml(company.legalName)}</p>
        <p>RUT ${escapeHtml(company.rut)}</p>
        <p>${escapeHtml(company.address.full)}</p>
        <p>${escapeHtml(company.phone.mobileDisplay)} · ${escapeHtml(company.email)}</p>
      </div>
      <div class="meta">
        <strong>Comprobante de compra</strong>
        <div>Nº pedido: <b>${escapeHtml(order.id)}</b></div>
        ${
          order.externalPaymentId
            ? `<div>Pago: <b>${escapeHtml(order.externalPaymentId)}</b></div>`
            : ""
        }
        <div>Fecha: ${escapeHtml(formatDate(order.createdAt))}</div>
        <span class="badge">${escapeHtml(ORDER_STATUS_LABELS[order.status])}</span>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h2>Cliente</h2>
        <p><strong>${escapeHtml(order.customer.name)}</strong></p>
        <p>Tel: ${escapeHtml(order.customer.phone || "—")}</p>
        ${
          order.customer.email
            ? `<p>Email: ${escapeHtml(order.customer.email)}</p>`
            : ""
        }
      </div>
      <div class="card">
        <h2>Entrega</h2>
        <p><strong>${escapeHtml(fulfillment)}</strong></p>
        <p>${escapeHtml(order.shipping.address)}</p>
        <p>${escapeHtml(order.shipping.commune)}, ${escapeHtml(order.shipping.city)}</p>
        ${
          order.shipping.notes
            ? `<p>Notas: ${escapeHtml(order.shipping.notes)}</p>`
            : ""
        }
      </div>
    </div>

    <div class="card" style="margin-bottom: 18px;">
      <h2>Pago</h2>
      <p>Medio: <strong>${escapeHtml(paymentLabel(order))}</strong></p>
      ${
        order.paymentProvider
          ? `<p>Pasarela: ${escapeHtml(order.paymentProvider)}</p>`
          : ""
      }
    </div>

    <table>
      <thead>
        <tr>
          <th>Producto</th>
          <th class="num">Cant.</th>
          <th class="num">Precio</th>
          <th class="num">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-box">
        <div class="label">Total pagado</div>
        <div class="value">${formatClp(order.total)}</div>
      </div>
    </div>

    <div class="foot">
      Documento de respaldo de compra emitido por ${escapeHtml(company.tradeName)}.
      Conserva este comprobante para seguimiento de tu pedido.
      ${escapeHtml(company.domain)}
    </div>
  </div>
</body>
</html>`;
}

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const orderId = decodeURIComponent(id).trim();
  if (!orderId) {
    return NextResponse.json(
      { success: false, error: "ID inválido." },
      { status: 400 },
    );
  }

  try {
    const order =
      (await getOrderById(orderId)) ??
      (await getOrderByExternalPaymentId(orderId));

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Pedido no encontrado." },
        { status: 404 },
      );
    }

    const html = buildComprobanteHtml(order);
    const download =
      new URL(request.url).searchParams.get("download") === "1";
    const filename = `comprobante-${order.id}.html`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": download
          ? `attachment; filename="${filename}"`
          : `inline; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("comprobante error", error);
    return NextResponse.json(
      { success: false, error: "No se pudo generar el comprobante." },
      { status: 500 },
    );
  }
}
