"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Boxes,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  Tags,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import BrandLogo from "@/components/shared/BrandLogo";
import { useAdminAuth } from "@/lib/admin/auth";

const nav = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard, exact: true },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorías", icon: Tags },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
] as const;

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAdminAuth();
  const [open, setOpen] = useState(false);

  const onLogout = async () => {
    await logout();
    router.replace("/admin/login");
  };

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-1 flex-col gap-1 px-3" aria-label="Admin">
      {nav.map(({ href, label, icon: Icon, ...rest }) => {
        const exact = "exact" in rest && rest.exact;
        const active = exact
          ? pathname === href
          : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              active
                ? "bg-brand text-white shadow-sm"
                : "text-neutral hover:bg-white/70 hover:text-brand"
            }`}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-dvh bg-[#eef4fa] text-foreground">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-brand/8 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <BrandLogo size="sm" />
          <span className="text-sm font-extrabold text-brand">Admin</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex size-10 items-center justify-center rounded-xl border border-brand/10 text-brand"
          aria-label="Abrir menú"
        >
          <Menu className="size-5" aria-hidden />
        </button>
      </div>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#041a2e]/45"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(100%,18rem)] flex-col bg-[#f7fafc] shadow-xl">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-2">
                <BrandLogo size="sm" />
                <span className="text-sm font-extrabold text-brand">
                  Agua Ser Admin
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex size-9 items-center justify-center rounded-lg text-neutral"
                aria-label="Cerrar"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
            <button
              type="button"
              onClick={onLogout}
              className="m-3 mt-auto flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              <LogOut className="size-4" aria-hidden />
              Cerrar sesión
            </button>
          </aside>
        </div>
      ) : null}

      <div className="mx-auto flex min-h-dvh w-full max-w-[1400px]">
        <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-brand/8 bg-[#f7fafc] py-5 lg:flex">
          <div className="mb-6 flex items-center gap-2.5 px-5">
            <BrandLogo size="sm" />
            <div>
              <p className="text-sm font-extrabold text-brand">Agua Ser Plus</p>
              <p className="text-[11px] font-medium text-neutral">
                Panel administrativo
              </p>
            </div>
          </div>
          <NavLinks />
          <div className="mt-auto space-y-2 px-3">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-neutral transition hover:bg-white hover:text-brand"
            >
              <Boxes className="size-4" aria-hidden />
              Ver tienda
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <LogOut className="size-4" aria-hidden />
              Cerrar sesión
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          {children}
        </main>
      </div>
    </div>
  );
}
