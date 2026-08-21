import { getSql } from "@/lib/neon";
import type { CartCustomer, CheckoutOrderItem } from "@/types/cart";

/**
 * Borrador de checkout: se crea al iniciar el pago con Klap y solo se
 * convierte en "pedido" real cuando el pago queda confirmado. Así los
 * intentos rechazados/cancelados nunca llegan a la tabla `orders`.
 */
export type CheckoutDraft = {
  orderId: string;
  amount: number;
  items: CheckoutOrderItem[];
  customer: CartCustomer;
  paymentProvider: string;
  externalPaymentId?: string;
  createdAt: string;
};

type DraftRow = {
  order_id: string;
  amount: number;
  items: CheckoutOrderItem[] | string;
  customer: CartCustomer | string;
  payment_provider: string;
  external_payment_id: string | null;
  created_at: string;
};

function parseJson<T>(value: T | string, fallback: T): T {
  if (typeof value !== "string") return value ?? fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function mapRow(row: DraftRow): CheckoutDraft {
  return {
    orderId: row.order_id,
    amount: Number(row.amount) || 0,
    items: parseJson(row.items, []),
    customer: parseJson(row.customer, {
      name: "",
      phone: "",
      email: "",
      fulfillment: "delivery",
      address: "",
      commune: "",
    }),
    paymentProvider: row.payment_provider,
    externalPaymentId: row.external_payment_id ?? undefined,
    createdAt: row.created_at,
  };
}

let schemaReady: Promise<void> | null = null;

async function ensureCheckoutDraftSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = getSql();
      await sql`
        CREATE TABLE IF NOT EXISTS checkout_drafts (
          order_id TEXT PRIMARY KEY,
          amount INTEGER NOT NULL DEFAULT 0,
          items JSONB NOT NULL DEFAULT '[]'::jsonb,
          customer JSONB NOT NULL DEFAULT '{}'::jsonb,
          payment_provider TEXT NOT NULL,
          external_payment_id TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS checkout_drafts_external_payment_id_idx
        ON checkout_drafts (external_payment_id)
      `;
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  await schemaReady;
}

export async function createCheckoutDraft(
  draft: Omit<CheckoutDraft, "createdAt">,
): Promise<void> {
  await ensureCheckoutDraftSchema();
  const sql = getSql();
  await sql`
    INSERT INTO checkout_drafts (
      order_id, amount, items, customer, payment_provider, external_payment_id
    ) VALUES (
      ${draft.orderId},
      ${draft.amount},
      ${JSON.stringify(draft.items)},
      ${JSON.stringify(draft.customer)},
      ${draft.paymentProvider},
      ${draft.externalPaymentId ?? null}
    )
    ON CONFLICT (order_id) DO UPDATE SET
      amount = EXCLUDED.amount,
      items = EXCLUDED.items,
      customer = EXCLUDED.customer,
      payment_provider = EXCLUDED.payment_provider,
      external_payment_id = EXCLUDED.external_payment_id
  `;
}

export async function getCheckoutDraftById(
  orderId: string,
): Promise<CheckoutDraft | null> {
  await ensureCheckoutDraftSchema();
  const sql = getSql();
  const rows = (await sql`
    SELECT order_id, amount, items, customer, payment_provider, external_payment_id, created_at
    FROM checkout_drafts
    WHERE order_id = ${orderId}
    LIMIT 1
  `) as DraftRow[];
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function getCheckoutDraftByExternalId(
  externalPaymentId: string,
): Promise<CheckoutDraft | null> {
  await ensureCheckoutDraftSchema();
  const sql = getSql();
  const rows = (await sql`
    SELECT order_id, amount, items, customer, payment_provider, external_payment_id, created_at
    FROM checkout_drafts
    WHERE external_payment_id = ${externalPaymentId}
    LIMIT 1
  `) as DraftRow[];
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function deleteCheckoutDraft(orderId: string): Promise<void> {
  await ensureCheckoutDraftSchema();
  const sql = getSql();
  await sql`DELETE FROM checkout_drafts WHERE order_id = ${orderId}`;
}
