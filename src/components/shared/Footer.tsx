import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock,
  Droplets,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Recycle,
} from "lucide-react";
import { company } from "@/lib/company";
import BrandLogo from "@/components/shared/BrandLogo";
import Container from "@/components/ui/Container";

const navLinks = [
  { href: "/productos", label: "Productos" },
  { href: "/nuestra-planta", label: "Nuestra Planta" },
  { href: "/#alcalina", label: "Agua Alcalina" },
  { href: "/carrito", label: "Carro" },
  { href: "/#recargas", label: "Recargas" },
  { href: "/#ofertas", label: "Ofertas" },
  { href: "/#ayuda", label: "Ayuda" },
] as const;

const pillars = [
  { icon: Droplets, label: "Salud" },
  { icon: Leaf, label: "Economía" },
  { icon: Recycle, label: "Reciclaje" },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#071f33] text-white">
      {/* Atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 55% 70% at 0% 100%, rgb(0 153 221 / 0.22), transparent 55%),
            radial-gradient(ellipse 45% 55% at 100% 0%, rgb(31 169 122 / 0.16), transparent 50%),
            linear-gradient(180deg, rgb(12 45 74 / 0.35) 0%, transparent 28%)
          `,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent"
      />

      {/* CTA band */}
      <div className="relative border-b border-white/8">
        <Container className="flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-brand-accent uppercase">
              Pedido online
            </p>
            <p className="mt-1.5 text-xl font-extrabold tracking-tight sm:text-2xl">
              ¿Necesitas agua hoy?
            </p>
            <p className="mt-1 text-sm text-white/65">
              Compra recargas y dispensadores en la tienda. Despacho en
              Santiago.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/productos"
              className="inline-flex h-12 items-center gap-2 rounded-2xl bg-green px-5 text-sm font-bold text-white shadow-[0_16px_32px_-16px_rgb(31_169_122_/_0.7)] transition hover:bg-[#189866]"
            >
              Ver productos
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/#ayuda"
              className="inline-flex h-12 items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Contáctanos
            </Link>
          </div>
        </Container>
      </div>

      <Container className="relative py-12 lg:py-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <BrandLogo size="lg" onDark />
              <div>
                <p className="text-lg font-extrabold tracking-wide">
                  Agua Ser{" "}
                  <span className="font-semibold text-brand-accent">Plus</span>
                </p>
                <p className="text-xs text-white/50">
                  Agua pura para hogar y empresa
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
              Bidones, recargas y dispensadores con foco en calidad, precio justo
              y reutilización. Atención cercana desde Maipú.
            </p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {pillars.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80"
                >
                  <Icon className="size-3.5 text-brand-accent" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Nav */}
          <div className="lg:col-span-2">
            <h2 className="text-[11px] font-bold tracking-[0.18em] text-white/40 uppercase">
              Explorar
            </h2>
            <ul className="mt-4 space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 py-1.5 text-sm font-medium text-white/75 transition hover:text-white"
                  >
                    <span className="h-px w-0 bg-brand-accent transition-all group-hover:w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h2 className="text-[11px] font-bold tracking-[0.18em] text-white/40 uppercase">
              Contacto
            </h2>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href={company.phone.mobileHref}
                  className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-white/5"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-green/15 text-green">
                    <Phone className="size-4" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-[11px] text-white/45">
                      Ventas / celular
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {company.phone.mobileDisplay}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={company.phone.landlineHref}
                  className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-white/5"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-accent/15 text-brand-accent">
                    <Phone className="size-4" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-[11px] text-white/45">Fijo</span>
                    <span className="text-sm font-semibold text-white">
                      {company.phone.landlineDisplay}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-white/5"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-yellow/15 text-yellow">
                    <Mail className="size-4" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-[11px] text-white/45">Correo</span>
                    <span className="text-sm font-semibold text-white">
                      {company.email}
                    </span>
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Office */}
          <div className="lg:col-span-3">
            <h2 className="text-[11px] font-bold tracking-[0.18em] text-white/40 uppercase">
              Oficina
            </h2>
            <div className="mt-4 space-y-4">
              <a
                href={company.address.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-brand-accent/30 hover:bg-white/[0.07]"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-accent/15 text-brand-accent">
                  <MapPin className="size-4" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-white">
                    {company.address.street}
                  </span>
                  <span className="mt-0.5 block text-sm text-white/55">
                    {company.address.commune}, {company.address.city}
                  </span>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-accent transition group-hover:gap-1.5">
                    Ver en mapa
                    <ArrowUpRight className="size-3.5" aria-hidden />
                  </span>
                </span>
              </a>

              <div className="flex items-start gap-3 px-1">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-yellow/15 text-yellow">
                  <Clock className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="text-[11px] text-white/45">
                    Atención presencial
                  </p>
                  <p className="text-sm font-semibold text-white">
                    {company.hours.label}
                  </p>
                  <p className="text-sm text-white/60">
                    {company.hours.display}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1.5">
            <p className="text-xs text-white/45">
              © {year} {company.tradeName}. Todos los derechos reservados.
            </p>
            <p className="max-w-2xl text-[11px] leading-relaxed text-white/35 sm:text-xs">
              Facturación: {company.legalName}
              <span className="mx-1.5 text-white/20">·</span>
              RUT {company.rut}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <a
              href={company.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-brand-accent transition hover:text-white"
            >
              {company.domain}
            </a>
            <a
              href="https://smartpro.cl"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 transition hover:border-white/20 hover:bg-white/[0.08]"
              aria-label="Creado por Smart Pro — smartpro.cl"
            >
              <span className="text-[11px] font-medium tracking-wide text-white/50 uppercase">
                Creado por
              </span>
              <span className="inline-flex items-center rounded-md bg-white px-2 py-1">
                <Image
                  src="/images/logo-smartpro.png"
                  alt="Smart Pro Agencia de Marketing"
                  width={120}
                  height={36}
                  className="h-8 w-auto object-contain"
                />
              </span>
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
