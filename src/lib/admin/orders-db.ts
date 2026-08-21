import { getSql } from "@/lib/neon";
import type {
  AdminOrder,
  OrderItem,
  OrderStatus,
} from "@/lib/admin/types";
import { seedOrders } from "@/lib/admin/mock-data";

type OrderRow = {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
  customer: AdminOrder["customer"] | string;
  shipping: AdminOrder["shipping"] | string;
  billing: AdminOrder["billing"] | string;
  payment_method: string;
  payment_provider: string | null;
  external_payment_id: string | null;
  fulfillment: string | null;
  items: OrderItem[] | string;
  total: number;
};

function parseJson<T>(value: T | string, fallback: T): T {
  if (typeof value !== "string") return value ?? fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function mapRow(row: OrderRow): AdminOrder {
  const status = (
    ["pending", "processing", "shipped", "cancelled"].includes(row.status)
      ? row.status
      : "pending"
  ) as OrderStatus;

  const paymentMethod = (
    ["transferencia", "webpay", "efectivo", "klap", "sandbox"].includes(
      row.payment_method,
    )
      ? row.payment_method
      : "webpay"
  ) as AdminOrder["paymentMethod"];

  return {
    id: row.id,
    status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    customer: parseJson(row.customer, {
      name: "",
      email: "",
      phone: "",
    }),
    shipping: parseJson(row.shipping, {
      address: "",
      commune: "",
      city: "Santiago",
    }),
    billing: parseJson(row.billing, {
      name: "",
      address: "",
    }),
    paymentMethod,
    paymentProvider: row.payment_provider ?? undefined,
    externalPaymentId: row.external_payment_id ?? undefined,
    fulfillment:
      row.fulfillment === "pickup" || row.fulfillment === "delivery"
        ? row.fulfillment
        : undefined,
    items: parseJson(row.items, []),
    total: Number(row.total) || 0,
  };
}

let schemaReady: Promise<void> | null = null;

export async function ensureOrderSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = getSql();
      await sql`
        CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY,
          status TEXT NOT NULL DEFAULT 'pending',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          customer JSONB NOT NULL DEFAULT '{}'::jsonb,
          shipping JSONB NOT NULL DEFAULT '{}'::jsonb,
          billing JSONB NOT NULL DEFAULT '{}'::jsonb,
          payment_method TEXT NOT NULL DEFAULT 'webpay',
          payment_provider TEXT,
          external_payment_id TEXT,
          fulfillment TEXT,
          items JSONB NOT NULL DEFAULT '[]'::jsonb,
          total INTEGER NOT NULL DEFAULT 0
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS orders_created_at_idx
        ON orders (created_at DESC)
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS orders_external_payment_id_idx
        ON orders (external_payment_id)
      `;
      await sql`
        CREATE SEQUENCE IF NOT EXISTS order_number_seq START 10001
      `;
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  await schemaReady;
}

/** Genera un correlativo legible tipo ORD-10001 (arranca en 10001). */
export async function getNextOrderId(): Promise<string> {
  await ensureOrderSchema();
  const sql = getSql();
  const rows = (await sql`
    SELECT nextval('order_number_seq') AS n
  `) as Array<{ n: number | string }>;
  return `ORD-${rows[0]?.n ?? 10001}`;
}

export async function listOrdersFromDb(): Promise<AdminOrder[]> {
  await ensureOrderSchema();
  const sql = getSql();
  const rows = (await sql`
    SELECT
      id, status, created_at, updated_at, customer, shipping, billing,
      payment_method, payment_provider, external_payment_id, fulfillment,
      items, total
    FROM orders
    ORDER BY created_at DESC
  `) as OrderRow[];
  return rows.map(mapRow);
}

export async function seedOrdersIfEmpty() {
  await ensureOrderSchema();
  const sql = getSql();
  const countRows = (await sql`SELECT COUNT(*)::int AS count FROM orders`) as Array<{
    count: number;
  }>;
  if ((countRows[0]?.count ?? 0) > 0) return;

  for (const order of seedOrders) {
    await createOrderInDb(order);
  }
}

export async function getOrderById(id: string): Promise<AdminOrder | null> {
  await ensureOrderSchema();
  const sql = getSql();
  const rows = (await sql`
    SELECT
      id, status, created_at, updated_at, customer, shipping, billing,
      payment_method, payment_provider, external_payment_id, fulfillment,
      items, total
    FROM orders
    WHERE id = ${id}
    LIMIT 1
  `) as OrderRow[];
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function getOrderByExternalPaymentId(
  externalPaymentId: string,
): Promise<AdminOrder | null> {
  await ensureOrderSchema();
  const sql = getSql();
  const rows = (await sql`
    SELECT
      id, status, created_at, updated_at, customer, shipping, billing,
      payment_method, payment_provider, external_payment_id, fulfillment,
      items, total
    FROM orders
    WHERE external_payment_id = ${externalPaymentId}
    LIMIT 1
  `) as OrderRow[];
  return rows[0] ? mapRow(rows[0]) : null;
}

/** Descuenta stock una sola vez, cuando el pedido ya quedó confirmado/pagado. */
export async function decrementStockForItems(
  items: Pick<OrderItem, "productId" | "qty">[],
): Promise<void> {
  const sql = getSql();
  for (const item of items) {
    const productRows = (await sql`
      SELECT id, stock
      FROM products
      WHERE id = ${item.productId}
      LIMIT 1
    `) as Array<{ id: string; stock: number }>;
    const current = productRows[0];
    if (!current) continue;
    const nextStock = Math.max(0, Number(current.stock) - item.qty);
    await sql`
      UPDATE products
      SET stock = ${nextStock}, updated_at = NOW()
      WHERE id = ${item.productId}
    `;
  }
}

export async function createOrderInDb(order: AdminOrder): Promise<AdminOrder> {
  await ensureOrderSchema();
  const sql = getSql();
  const updatedAt = order.updatedAt ?? new Date().toISOString();
  const rows = (await sql`
    INSERT INTO orders (
      id, status, created_at, updated_at, customer, shipping, billing,
      payment_method, payment_provider, external_payment_id, fulfillment,
      items, total
    ) VALUES (
      ${order.id},
      ${order.status},
      ${order.createdAt},
      ${updatedAt},
      ${JSON.stringify(order.customer)},
      ${JSON.stringify(order.shipping)},
      ${JSON.stringify(order.billing)},
      ${order.paymentMethod},
      ${order.paymentProvider ?? null},
      ${order.externalPaymentId ?? null},
      ${order.fulfillment ?? null},
      ${JSON.stringify(order.items)},
      ${order.total}
    )
    ON CONFLICT (id) DO UPDATE SET
      status = EXCLUDED.status,
      updated_at = EXCLUDED.updated_at,
      customer = EXCLUDED.customer,
      shipping = EXCLUDED.shipping,
      billing = EXCLUDED.billing,
      payment_method = EXCLUDED.payment_method,
      payment_provider = EXCLUDED.payment_provider,
      external_payment_id = EXCLUDED.external_payment_id,
      fulfillment = EXCLUDED.fulfillment,
      items = EXCLUDED.items,
      total = EXCLUDED.total
    RETURNING
      id, status, created_at, updated_at, customer, shipping, billing,
      payment_method, payment_provider, external_payment_id, fulfillment,
      items, total
  `) as OrderRow[];
  return mapRow(rows[0]);
}

export async function updateOrderInDb(
  id: string,
  patch: Partial<Omit<AdminOrder, "id" | "createdAt">>,
): Promise<AdminOrder | null> {
  await ensureOrderSchema();
  const existing = await getOrderById(id);
  if (!existing) return null;

  const next: AdminOrder = {
    ...existing,
    ...patch,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
    customer: patch.customer ?? existing.customer,
    shipping: patch.shipping ?? existing.shipping,
    billing: patch.billing ?? existing.billing,
    items: patch.items ?? existing.items,
  };

  const sql = getSql();
  const rows = (await sql`
    UPDATE orders SET
      status = ${next.status},
      updated_at = ${next.updatedAt},
      customer = ${JSON.stringify(next.customer)},
      shipping = ${JSON.stringify(next.shipping)},
      billing = ${JSON.stringify(next.billing)},
      payment_method = ${next.paymentMethod},
      payment_provider = ${next.paymentProvider ?? null},
      external_payment_id = ${next.externalPaymentId ?? null},
      fulfillment = ${next.fulfillment ?? null},
      items = ${JSON.stringify(next.items)},
      total = ${next.total}
    WHERE id = ${id}
    RETURNING
      id, status, created_at, updated_at, customer, shipping, billing,
      payment_method, payment_provider, external_payment_id, fulfillment,
      items, total
  `) as OrderRow[];

  return rows[0] ? mapRow(rows[0]) : null;
}
