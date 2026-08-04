export type ProductOffer = {
  id: string;
  name: string;
  description?: string;
  priceBefore: number;
  priceNow: number;
  badge: string;
  note?: string;
  image: string;
  tint: "blue" | "green" | "yellow";
};

/**
 * Formatea montos en estilo CLP con punto de miles (ej: $80.000).
 */
export function formatClp(amount: number): string {
  return `$${amount.toLocaleString("es-CL")}`;
}

export function getDiscountPercent(before: number, now: number): number {
  if (before <= 0) return 0;
  return Math.round(((before - now) / before) * 100);
}
