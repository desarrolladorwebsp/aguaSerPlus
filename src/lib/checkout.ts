import { catalogProducts } from "@/lib/products";
import { company } from "@/lib/company";
import type {
  CartCustomer,
  CheckoutOrderItem,
  FulfillmentMethod,
} from "@/types/cart";

export type CheckoutRequestBody = {
  items: Array<{ productId: string; qty: number }>;
  customer: CartCustomer;
};

export function validateAndPriceItems(
  rawItems: Array<{ productId: string; qty: number }>,
): { items: CheckoutOrderItem[]; amount: number } | { error: string } {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return { error: "El carro está vacío." };
  }

  const items: CheckoutOrderItem[] = [];
  let amount = 0;

  for (const raw of rawItems) {
    if (!raw?.productId || typeof raw.qty !== "number") {
      return { error: "Ítem inválido en el carro." };
    }

    const qty = Math.floor(raw.qty);
    if (qty < 1 || qty > 99) {
      return { error: "Cantidad inválida." };
    }

    const product = catalogProducts.find((p) => p.id === raw.productId);
    if (!product) {
      return { error: `Producto no encontrado: ${raw.productId}` };
    }
    if (product.inStock === false) {
      return { error: `${product.name} no está disponible.` };
    }

    items.push({
      productId: product.id,
      name: product.name,
      price: product.priceNow,
      qty,
    });
    amount += product.priceNow * qty;
  }

  return { items, amount };
}

export function validateCustomer(
  customer: CartCustomer | undefined,
): { customer: CartCustomer } | { error: string } {
  if (!customer) return { error: "Faltan datos del cliente." };

  const name = customer.name?.trim() ?? "";
  const phone = customer.phone?.trim() ?? "";
  const fulfillment = customer.fulfillment as FulfillmentMethod | undefined;
  const notes = customer.notes?.trim() || undefined;

  if (name.length < 2) return { error: "Ingresa tu nombre." };
  if (phone.length < 8) return { error: "Ingresa un teléfono válido." };
  if (fulfillment !== "delivery" && fulfillment !== "pickup") {
    return { error: "Elige envío a domicilio o retiro en sucursal." };
  }

  if (fulfillment === "delivery") {
    const address = customer.address?.trim() ?? "";
    const commune = customer.commune?.trim() ?? "";
    if (address.length < 4) {
      return { error: "Ingresa la dirección de envío." };
    }
    if (commune.length < 2) {
      return { error: "Ingresa la comuna de envío." };
    }
    return {
      customer: { name, phone, fulfillment, address, commune, notes },
    };
  }

  // Retiro en sucursal: dirección = sucursal Agua Ser Plus
  return {
    customer: {
      name,
      phone,
      fulfillment: "pickup",
      address: company.address.full,
      commune: company.address.commune,
      notes,
    },
  };
}

export function createOrderId(): string {
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `ord_${stamp}_${rand}`;
}
