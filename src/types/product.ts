export type ProductTag = {
  label: string;
  icon:
    | "bolt"
    | "kettle"
    | "snowflake"
    | "table"
    | "metal"
    | "bottles"
    | "map"
    | "truck";
};

export type ProductCategory =
  | "recargas"
  | "combos"
  | "dispensadores"
  | "bombas"
  | "filtracion"
  | "accesorios"
  | "consumibles"
  | "servicios";

export type ProductOffer = {
  id: string;
  name: string;
  description?: string;
  priceBefore: number;
  priceNow: number;
  badge: string;
  badgeTone: "green" | "blue" | "yellow";
  note?: string;
  image: string;
  tint: "blue" | "green" | "yellow";
  tags: ProductTag[];
  featured?: boolean;
  category: ProductCategory;
  inStock?: boolean;
};

/**
 * Formatea montos en estilo CLP con punto de miles (ej: $80.000).
 * Si el monto es 0, muestra "Consultar".
 */
export function formatClp(amount: number): string {
  if (amount <= 0) return "Consultar";
  return `$${amount.toLocaleString("es-CL")}`;
}

export function getDiscountPercent(before: number, now: number): number {
  if (before <= 0) return 0;
  return Math.round(((before - now) / before) * 100);
}

export const PRODUCT_CATEGORIES: {
  id: ProductCategory | "all";
  label: string;
}[] = [
  { id: "all", label: "Todos" },
  { id: "recargas", label: "Recargas y Bidones" },
  { id: "combos", label: "Combos" },
  { id: "dispensadores", label: "Dispensadores" },
  { id: "bombas", label: "Bombas" },
  { id: "filtracion", label: "Filtración / Ósmosis" },
  { id: "accesorios", label: "Accesorios" },
  { id: "consumibles", label: "Consumibles" },
  { id: "servicios", label: "Servicios" },
];
