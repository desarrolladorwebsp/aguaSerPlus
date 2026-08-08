import { catalogProducts } from "@/lib/products";
import { PRODUCT_CATEGORIES } from "@/types/product";
import type {
  AdminCategory,
  AdminOrder,
  AdminProduct,
} from "@/lib/admin/types";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const seedCategories: AdminCategory[] = PRODUCT_CATEGORIES.filter(
  (c) => c.id !== "all",
).map((c) => ({
  id: c.id,
  name: c.label,
  slug: slugify(c.label),
  description: `Categoría ${c.label.toLowerCase()} de Agua Ser Plus.`,
}));

export const seedProducts: AdminProduct[] = catalogProducts.map((p, index) => ({
  id: p.id,
  title: p.name,
  sku: `ASP-${String(index + 1).padStart(4, "0")}`,
  priceNormal: p.priceBefore > 0 ? p.priceBefore : p.priceNow,
  priceSale:
    p.priceNow > 0 && p.priceBefore > p.priceNow ? p.priceNow : 0,
  stock: p.inStock === false ? 0 : 12 + ((index * 3) % 40),
  categoryId: p.category,
  images: [p.image],
  status: p.inStock === false ? "inactive" : "active",
  description: p.description,
  updatedAt: new Date(Date.now() - index * 36e5).toISOString(),
}));

export const seedOrders: AdminOrder[] = [
  {
    id: "ORD-10041",
    status: "pending",
    createdAt: "2026-08-05T14:22:00.000Z",
    customer: {
      name: "María González",
      email: "maria.gonzalez@email.cl",
      phone: "+56 9 8765 4321",
    },
    shipping: {
      address: "Av. Los Pajaritos 1234, Depto 502",
      commune: "Maipú",
      city: "Santiago",
      notes: "Portería 24 hrs",
    },
    billing: {
      name: "María González",
      rut: "12.345.678-9",
      address: "Av. Los Pajaritos 1234, Maipú",
    },
    paymentMethod: "webpay",
    items: [
      {
        productId: "wc-332",
        title: "Recarga de 20 lt",
        qty: 4,
        unitPrice: 2990,
      },
      {
        productId: "wc-1984",
        title: "Hielo 2 kg",
        qty: 2,
        unitPrice: 1200,
      },
    ],
    total: 14_360,
  },
  {
    id: "ORD-10038",
    status: "processing",
    createdAt: "2026-08-04T10:05:00.000Z",
    customer: {
      name: "Pedro Salazar",
      email: "pedro.salazar@empresa.cl",
      phone: "+56 9 7123 8890",
    },
    shipping: {
      address: "La Farfana 890",
      commune: "Maipú",
      city: "Santiago",
    },
    billing: {
      name: "Comercial Salazar SpA",
      rut: "76.123.456-7",
      address: "La Farfana 890, Maipú",
    },
    paymentMethod: "transferencia",
    items: [
      {
        productId: "wc-2346",
        title: "Dispensador Digital de Té",
        qty: 1,
        unitPrice: 80_000,
      },
    ],
    total: 80_000,
  },
  {
    id: "ORD-10029",
    status: "shipped",
    createdAt: "2026-08-02T16:40:00.000Z",
    customer: {
      name: "Camila Rojas",
      email: "camila.rojas@email.cl",
      phone: "+56 9 6543 2109",
    },
    shipping: {
      address: "Pasaje Los Boldos 221",
      commune: "Cerrillos",
      city: "Santiago",
    },
    billing: {
      name: "Camila Rojas",
      address: "Pasaje Los Boldos 221, Cerrillos",
    },
    paymentMethod: "webpay",
    items: [
      {
        productId: "wc-333",
        title: "Envase + Recarga de 20 lt",
        qty: 2,
        unitPrice: 9990,
      },
      {
        productId: "wc-337",
        title: "Bomba Electrónica USB",
        qty: 1,
        unitPrice: 15_000,
      },
    ],
    total: 34_980,
  },
  {
    id: "ORD-10021",
    status: "cancelled",
    createdAt: "2026-07-30T09:12:00.000Z",
    customer: {
      name: "Jorge Muñoz",
      email: "jorge.munoz@email.cl",
      phone: "+56 9 9988 7766",
    },
    shipping: {
      address: "San Antonio 455",
      commune: "Santiago",
      city: "Santiago",
      notes: "Cliente canceló por cambio de dirección",
    },
    billing: {
      name: "Jorge Muñoz",
      address: "San Antonio 455, Santiago",
    },
    paymentMethod: "efectivo",
    items: [
      {
        productId: "wc-1571",
        title: "Dispensador de Sobremesa frío y caliente",
        qty: 1,
        unitPrice: 45_000,
      },
    ],
    total: 45_000,
  },
];
