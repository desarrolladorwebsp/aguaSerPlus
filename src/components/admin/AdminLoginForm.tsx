"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
import BrandLogo from "@/components/shared/BrandLogo";
import { useAdminAuth } from "@/lib/admin/auth";

export default function AdminLoginForm() {
  const router = useRouter();
  const { ready, isAuthenticated, login } = useAdminAuth();
  const [email, setEmail] = useState("admin@aguaser.cl");
  const [password, setPassword] = useState("••••••••");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && isAuthenticated) {
      router.replace("/admin");
    }
  }, [ready, isAuthenticated, router]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    // Mock: cualquier credencial entra al panel (setea cookie para APIs)
    try {
      await login();
      router.replace("/admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#041a2e] px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 50% 45% at 15% 20%, rgb(0 153 221 / 0.28), transparent 55%),
            radial-gradient(ellipse 45% 40% at 90% 80%, rgb(31 169 122 / 0.18), transparent 50%)
          `,
        }}
      />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg">
            <BrandLogo size="md" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Agua Ser <span className="text-brand-accent">Plus</span>
          </h1>
          <p className="mt-1.5 text-sm text-white/65">
            Acceso al panel administrativo
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-[1.5rem] bg-white p-6 shadow-[0_30px_60px_-28px_rgb(0_0_0_/_0.55)] ring-1 ring-white/30 sm:p-7"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-brand/8 px-3 py-1 text-xs font-bold text-brand">
            <ShieldCheck className="size-3.5" aria-hidden />
            Sesión simulada (mock)
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-foreground">
              Correo
            </span>
            <span className="relative block">
              <Mail
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral"
                aria-hidden
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full rounded-xl border border-brand/12 bg-surface/60 pr-3 pl-10 text-sm outline-none transition focus:border-brand/30 focus:bg-white focus:ring-2 focus:ring-brand/15"
                autoComplete="username"
              />
            </span>
          </label>

          <label className="mt-4 block">
            <span className="mb-1.5 block text-sm font-semibold text-foreground">
              Contraseña
            </span>
            <span className="relative block">
              <Lock
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral"
                aria-hidden
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full rounded-xl border border-brand/12 bg-surface/60 pr-3 pl-10 text-sm outline-none transition focus:border-brand/30 focus:bg-white focus:ring-2 focus:ring-brand/15"
                autoComplete="current-password"
              />
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-bold text-white transition hover:bg-brand-secondary disabled:opacity-70"
          >
            {loading ? "Entrando…" : "Iniciar sesión"}
            <ArrowRight className="size-4" aria-hidden />
          </button>

          <p className="mt-4 text-center text-xs leading-relaxed text-neutral">
            Demo: no valida credenciales. Al enviar entras directo al dashboard.
          </p>
        </form>
      </div>
    </div>
  );
}
