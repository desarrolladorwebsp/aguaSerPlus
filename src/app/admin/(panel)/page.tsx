"use client";

import Link from "next/link";
import {
  ArrowRight,
  Package,
  ShoppingBag,
  Tags,
  TrendingUp,
} from "lucide-react";
import { useAdminStore } from "@/lib/admin/store";
import { formatClp } from "@/types/product";
import { ORDER_STATUS_LABELS } from "@/lib/admin/types";

export default function AdminHomePage() {
  const { products, categories, orders } = useAdminStore();
  const active = products.filter((p) => p.status === "active").length;
  const pending = orders.filter((o) => o.status === "pending").length;
  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const cards = [
    {
      label: "Productos activos",
      value: String(active),
      hint: `${products.length} en total`,
      icon: Package,
      href: "/admin/productos",
    },
    {
      label: "Categorías",
      value: String(categories.length),
      hint: "Catálogo organizado",
      icon: Tags,
      href: "/admin/categorias",
    },
    {
      label: "Pedidos pendientes",
      value: String(pending),
      hint: `${orders.length} pedidos en Neon`,
      icon: ShoppingBag,
      href: "/admin/pedidos",
    },
    {
      label: "Ventas",
      value: formatClp(revenue),
      hint: "Sin cancelados",
      icon: TrendingUp,
      href: "/admin/pedidos",
    },
  ] as const;

  return (
    <div className="space-y-7">
      <header>
        <p className="text-xs font-bold tracking-[0.16em] text-brand-accent uppercase">
          Dashboard
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Resumen operativo
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral">
          Productos y pedidos se guardan en Neon. Categorías siguen en sesión
          local.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, hint, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-2xl bg-white p-5 ring-1 ring-brand/10 transition hover:ring-brand/25"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-neutral">{label}</p>
                <p className="mt-2 text-2xl font-extrabold text-foreground">
                  {value}
                </p>
                <p className="mt-1 text-xs text-neutral">{hint}</p>
              </div>
              <span className="flex size-10 items-center justify-center rounded-xl bg-brand/8 text-brand">
                <Icon className="size-5" aria-hidden />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <section className="rounded-2xl bg-white p-5 ring-1 ring-brand/10 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-base font-bold text-foreground">
            Últimos pedidos
          </h2>
          <Link
            href="/admin/pedidos"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
          >
            Ver todos
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
        <ul className="divide-y divide-brand/8">
          {orders.slice(0, 4).map((order) => (
            <li
              key={order.id}
              className="flex flex-wrap items-center justify-between gap-2 py-3"
            >
              <div>
                <p className="text-sm font-bold text-foreground">{order.id}</p>
                <p className="text-xs text-neutral">{order.customer.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-brand">
                  {formatClp(order.total)}
                </p>
                <p className="text-xs text-neutral">
                  {ORDER_STATUS_LABELS[order.status]}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
