"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
};

export function AdminModal({
  open,
  title,
  onClose,
  children,
  wide,
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#041a2e]/55 p-3 backdrop-blur-[2px] sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className={`max-h-[92dvh] w-full overflow-y-auto rounded-2xl bg-white shadow-2xl ring-1 ring-brand/10 ${
          wide ? "max-w-3xl" : "max-w-lg"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-brand/8 bg-white px-5 py-4">
          <h2 className="text-base font-bold text-foreground">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-lg text-neutral transition hover:bg-surface hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

type ConfirmProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Eliminar",
  onConfirm,
  onCancel,
}: ConfirmProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#041a2e]/60 p-4"
      role="alertdialog"
      aria-modal="true"
      aria-label={title}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-brand/10"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 rounded-xl px-4 text-sm font-semibold text-neutral transition hover:bg-surface"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-10 rounded-xl bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

export const fieldClass =
  "h-11 w-full rounded-xl border border-brand/12 bg-surface/50 px-3 text-sm text-foreground outline-none transition placeholder:text-neutral/60 focus:border-brand/30 focus:bg-white focus:ring-2 focus:ring-brand/15";

export const textareaClass =
  "w-full rounded-xl border border-brand/12 bg-surface/50 px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-neutral/60 focus:border-brand/30 focus:bg-white focus:ring-2 focus:ring-brand/15";
