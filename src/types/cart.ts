export type FulfillmentMethod = "delivery" | "pickup";

export type CartItem = {
  productId: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  color?: string;
};

export type CartCustomer = {
  name: string;
  phone: string;
  email: string;
  /** delivery = envío a domicilio · pickup = retiro en sucursal */
  fulfillment: FulfillmentMethod;
  /** Requerido solo si fulfillment === "delivery" */
  address: string;
  /** Requerido solo si fulfillment === "delivery" */
  commune: string;
  /** Notas opcionales (depto, referencia, horario preferido) */
  notes?: string;
};

export type CheckoutOrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
};

export type CheckoutOrder = {
  id: string;
  items: CheckoutOrderItem[];
  customer: CartCustomer;
  amount: number;
  createdAt: string;
};

export const FULFILLMENT_LABELS: Record<FulfillmentMethod, string> = {
  delivery: "Envío a domicilio",
  pickup: "Retiro en sucursal",
};
