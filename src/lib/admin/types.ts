export type AdminProductStatus = "active" | "inactive";

export type AdminProduct = {
  id: string;
  title: string;
  sku: string;
  /** Precio normal (lista) */
  priceNormal: number;
  /** Precio con descuento; 0 = sin oferta */
  priceSale: number;
  stock: number;
  categoryId: string;
  /** Hasta 3 imágenes (la primera es la principal) */
  images: string[];
  status: AdminProductStatus;
  description?: string;
  updatedAt: string;
};

const FALLBACK_IMAGE = "/products/hero-jug-splash.png";

export function adminProductPrimaryImage(
  product: Pick<AdminProduct, "images">,
) {
  return product.images.find((src) => src.trim()) || FALLBACK_IMAGE;
}

/** Precio efectivo a mostrar / cobrar */
export function adminProductPrice(product: Pick<AdminProduct, "priceNormal" | "priceSale">) {
  if (product.priceSale > 0 && product.priceSale < product.priceNormal) {
    return product.priceSale;
  }
  return product.priceNormal;
}

export function adminProductHasDiscount(
  product: Pick<AdminProduct, "priceNormal" | "priceSale">,
) {
  return product.priceSale > 0 && product.priceSale < product.priceNormal;
}

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "cancelled";

export type OrderItem = {
  productId: string;
  title: string;
  qty: number;
  unitPrice: number;
};

export type AdminOrder = {
  id: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping: {
    address: string;
    commune: string;
    city: string;
    notes?: string;
  };
  billing: {
    name: string;
    rut?: string;
    address: string;
  };
  paymentMethod: "transferencia" | "webpay" | "efectivo" | "klap" | "sandbox";
  /** Pasarela usada (klap, sandbox, …) */
  paymentProvider?: string;
  /** ID externo de la pasarela (ej. order_id de Klap) */
  externalPaymentId?: string;
  fulfillment?: "delivery" | "pickup";
  items: OrderItem[];
  total: number;
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendiente",
  processing: "Procesando",
  shipped: "Enviado",
  cancelled: "Cancelado",
};

export const PRODUCT_STATUS_LABELS: Record<AdminProductStatus, string> = {
  active: "Activo",
  inactive: "Inactivo",
};
