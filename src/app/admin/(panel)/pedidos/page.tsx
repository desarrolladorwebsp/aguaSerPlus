"use client";

import { useMemo, useState } from "react";
import { Eye, Pencil } from "lucide-react";
import { useAdminStore } from "@/lib/admin/store";
import type { AdminOrder, OrderStatus } from "@/lib/admin/types";
import { ORDER_STATUS_LABELS } from "@/lib/admin/types";
import { formatClp } from "@/types/product";
import {
  AdminModal,
  Field,
  fieldClass,
  textareaClass,
} from "@/components/admin/ui";

const statuses: Array<OrderStatus | "all"> = [
  "all",
  "pending",
  "processing",
  "shipped",
  "cancelled",
];

export default function AdminOrdersPage() {
  const {
    orders,
    ordersLoading,
    ordersError,
    updateOrder,
    setOrderStatus,
  } = useAdminStore();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const [mode, setMode] = useState<"view" | "edit" | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const list =
      statusFilter === "all"
        ? orders
        : orders.filter((o) => o.status === statusFilter);
    return [...list].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [orders, statusFilter]);

  const openView = (order: AdminOrder) => {
    setSelected(order);
    setMode("view");
  };

  const openEdit = (order: AdminOrder) => {
    setSelected(structuredClone(order));
    setMode("edit");
  };

  const save = async () => {
    if (!selected) return;
    const total = selected.items.reduce(
      (sum, item) => sum + item.qty * item.unitPrice,
      0,
    );
    setSaving(true);
    setSaveError(null);
    try {
      await updateOrder(selected.id, { ...selected, total });
      setMode(null);
      setSelected(null);
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el pedido.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs font-bold tracking-[0.16em] text-brand-accent uppercase">
          Ventas
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">
          Gestión de pedidos
        </h1>
        <p className="mt-1 text-sm text-neutral">
          {ordersLoading
            ? "Cargando pedidos…"
            : `${filtered.length} pedido${filtered.length === 1 ? "" : "s"}`}
        </p>
        {ordersError ? (
          <p className="mt-2 text-sm text-red-600">{ordersError}</p>
        ) : null}
      </header>

      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => {
          const active = statusFilter === status;
          const label =
            status === "all" ? "Todos" : ORDER_STATUS_LABELS[status];
          return (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                active
                  ? "bg-brand text-white"
                  : "bg-white text-neutral ring-1 ring-brand/10 hover:text-brand"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-brand/10">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-brand/8 bg-surface/60 text-xs font-bold tracking-wide text-neutral uppercase">
              <tr>
                <th className="px-4 py-3">Pedido</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Pago</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand/6">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-surface/40">
                  <td className="px-4 py-3 font-bold text-foreground">
                    {order.id}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-foreground">
                      {order.customer.name}
                    </p>
                    <p className="text-xs text-neutral">
                      {order.customer.email}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-neutral">
                    {new Date(order.createdAt).toLocaleDateString("es-CL", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 font-bold text-brand">
                    {formatClp(order.total)}
                  </td>
                  <td className="px-4 py-3 capitalize text-neutral">
                    {order.paymentMethod}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusPill status={order.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        aria-label="Ver pedido"
                        onClick={() => openView(order)}
                        className="flex size-8 items-center justify-center rounded-lg text-brand hover:bg-brand/8"
                      >
                        <Eye className="size-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Editar pedido"
                        onClick={() => openEdit(order)}
                        className="flex size-8 items-center justify-center rounded-lg text-brand hover:bg-brand/8"
                      >
                        <Pencil className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-neutral">
            No hay pedidos en este estado.
          </p>
        ) : null}
      </div>

      <AdminModal
        open={mode === "view" && Boolean(selected)}
        title={selected ? `Pedido ${selected.id}` : "Pedido"}
        onClose={() => {
          setMode(null);
          setSelected(null);
        }}
        wide
      >
        {selected ? (
          <OrderDetail
            order={selected}
            onEdit={() => openEdit(selected)}
            onStatus={(status) => {
              void setOrderStatus(selected.id, status).then(() => {
                setSelected((prev) =>
                  prev ? { ...prev, status } : prev,
                );
              });
            }}
          />
        ) : null}
      </AdminModal>

      <AdminModal
        open={mode === "edit" && Boolean(selected)}
        title={selected ? `Editar ${selected.id}` : "Editar pedido"}
        onClose={() => {
          setMode(null);
          setSelected(null);
          setSaveError(null);
        }}
        wide
      >
        {selected ? (
          <OrderEditForm
            order={selected}
            onChange={setSelected}
            onSave={save}
            saving={saving}
            error={saveError}
          />
        ) : null}
      </AdminModal>
    </div>
  );
}

function OrderStatusPill({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    pending: "bg-yellow-soft text-[#8a6a00]",
    processing: "bg-brand/10 text-brand",
    shipped: "bg-green-soft text-green",
    cancelled: "bg-red-50 text-red-700",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${styles[status]}`}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}

function OrderDetail({
  order,
  onEdit,
  onStatus,
}: {
  order: AdminOrder;
  onEdit: () => void;
  onStatus: (status: OrderStatus) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <OrderStatusPill status={order.status} />
        <select
          className={fieldClass + " w-auto"}
          value={order.status}
          onChange={(e) => onStatus(e.target.value as OrderStatus)}
        >
          {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <InfoBlock title="Cliente">
          <p className="font-semibold">{order.customer.name}</p>
          <p>{order.customer.email}</p>
          <p>{order.customer.phone}</p>
        </InfoBlock>
        <InfoBlock title="Pago">
          <p className="capitalize">{order.paymentMethod}</p>
          {order.paymentProvider ? (
            <p className="text-neutral">
              Proveedor:{" "}
              <span className="font-semibold text-foreground">
                {order.paymentProvider}
              </span>
            </p>
          ) : null}
          {order.externalPaymentId ? (
            <p className="text-neutral">
              ID Klap:{" "}
              <span className="font-mono text-xs font-semibold text-foreground">
                {order.externalPaymentId}
              </span>
            </p>
          ) : null}
          <p className="text-neutral">
            Creado: {new Date(order.createdAt).toLocaleString("es-CL")}
          </p>
          {order.updatedAt ? (
            <p className="text-neutral">
              Actualizado: {new Date(order.updatedAt).toLocaleString("es-CL")}
            </p>
          ) : null}
          <p className="text-lg font-extrabold text-brand">
            {formatClp(order.total)}
          </p>
        </InfoBlock>
        <InfoBlock title="Envío">
          <p>{order.shipping.address}</p>
          <p>
            {order.shipping.commune}, {order.shipping.city}
          </p>
          {order.shipping.notes ? (
            <p className="text-neutral">{order.shipping.notes}</p>
          ) : null}
        </InfoBlock>
        <InfoBlock title="Facturación">
          <p className="font-semibold">{order.billing.name}</p>
          {order.billing.rut ? <p>RUT {order.billing.rut}</p> : null}
          <p>{order.billing.address}</p>
        </InfoBlock>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-bold text-foreground">Productos</h3>
        <ul className="divide-y divide-brand/8 rounded-xl ring-1 ring-brand/10">
          {order.items.map((item) => (
            <li
              key={`${item.productId}-${item.title}`}
              className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm"
            >
              <span>
                <span className="font-semibold text-foreground">
                  {item.title}
                </span>
                <span className="ml-2 text-neutral">× {item.qty}</span>
              </span>
              <span className="font-bold text-brand">
                {formatClp(item.qty * item.unitPrice)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={onEdit}
        className="h-11 w-full rounded-xl bg-brand text-sm font-bold text-white hover:bg-brand-secondary"
      >
        Editar datos
      </button>
    </div>
  );
}

function InfoBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-surface/60 p-3 text-sm">
      <p className="mb-1.5 text-xs font-bold tracking-wide text-neutral uppercase">
        {title}
      </p>
      <div className="space-y-0.5 text-foreground">{children}</div>
    </div>
  );
}

function OrderEditForm({
  order,
  onChange,
  onSave,
  saving,
  error,
}: {
  order: AdminOrder;
  onChange: (order: AdminOrder) => void;
  onSave: () => void;
  saving?: boolean;
  error?: string | null;
}) {
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
    >
      <Field label="Estado">
        <select
          className={fieldClass}
          value={order.status}
          onChange={(e) =>
            onChange({ ...order, status: e.target.value as OrderStatus })
          }
        >
          {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre cliente">
          <input
            className={fieldClass}
            value={order.customer.name}
            onChange={(e) =>
              onChange({
                ...order,
                customer: { ...order.customer, name: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Teléfono">
          <input
            className={fieldClass}
            value={order.customer.phone}
            onChange={(e) =>
              onChange({
                ...order,
                customer: { ...order.customer, phone: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            className={fieldClass}
            value={order.customer.email}
            onChange={(e) =>
              onChange({
                ...order,
                customer: { ...order.customer, email: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Método de pago">
          <select
            className={fieldClass}
            value={order.paymentMethod}
            onChange={(e) =>
              onChange({
                ...order,
                paymentMethod: e.target.value as AdminOrder["paymentMethod"],
              })
            }
          >
            <option value="webpay">Webpay</option>
            <option value="klap">Klap</option>
            <option value="sandbox">Sandbox</option>
            <option value="transferencia">Transferencia</option>
            <option value="efectivo">Efectivo</option>
          </select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Dirección de envío">
          <input
            className={fieldClass}
            value={order.shipping.address}
            onChange={(e) =>
              onChange({
                ...order,
                shipping: { ...order.shipping, address: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Comuna">
          <input
            className={fieldClass}
            value={order.shipping.commune}
            onChange={(e) =>
              onChange({
                ...order,
                shipping: { ...order.shipping, commune: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Ciudad">
          <input
            className={fieldClass}
            value={order.shipping.city}
            onChange={(e) =>
              onChange({
                ...order,
                shipping: { ...order.shipping, city: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Notas de envío">
          <input
            className={fieldClass}
            value={order.shipping.notes ?? ""}
            onChange={(e) =>
              onChange({
                ...order,
                shipping: { ...order.shipping, notes: e.target.value },
              })
            }
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre facturación">
          <input
            className={fieldClass}
            value={order.billing.name}
            onChange={(e) =>
              onChange({
                ...order,
                billing: { ...order.billing, name: e.target.value },
              })
            }
          />
        </Field>
        <Field label="RUT">
          <input
            className={fieldClass}
            value={order.billing.rut ?? ""}
            onChange={(e) =>
              onChange({
                ...order,
                billing: { ...order.billing, rut: e.target.value },
              })
            }
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Dirección facturación">
            <textarea
              rows={2}
              className={textareaClass}
              value={order.billing.address}
              onChange={(e) =>
                onChange({
                  ...order,
                  billing: { ...order.billing, address: e.target.value },
                })
              }
            />
          </Field>
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={saving}
        className="h-11 w-full rounded-xl bg-brand text-sm font-bold text-white hover:bg-brand-secondary disabled:opacity-60"
      >
        {saving ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}
