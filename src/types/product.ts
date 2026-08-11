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

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductColorOption = {
  name: string;
  codes: string;
  /** Hex or Tailwind-friendly swatch color */
  swatch: string;
  image?: string;
};

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
  /** Galería adicional (la primera puede repetir `image`) */
  images?: string[];
  brand?: string;
  subtitle?: string;
  /** Características técnicas en lista */
  characteristics?: ProductSpec[];
  /** Beneficios / íconos del catálogo */
  features?: string[];
  /** Tabla compacta (voltaje, potencia, etc.) */
  specs?: ProductSpec[];
  colors?: ProductColorOption[];
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
