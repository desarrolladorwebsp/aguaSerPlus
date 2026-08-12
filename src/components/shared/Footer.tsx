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
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/nuestra-planta", label: "Nuestra Planta" },
  { href: "/#ayuda", label: "Contactos" },
  { href: "/carrito", label: "Carro" },
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
        <Container className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:py-8">
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-brand-accent uppercase">
              Pedido online
            </p>
            <p className="mt-1 text-lg font-extrabold tracking-tight sm:mt-1.5 sm:text-2xl">
              ¿Necesitas agua hoy?
            </p>
            <p className="mt-1 text-sm text-white/65">
              Compra recargas y dispensadores en la tienda. Despacho en
              Santiago.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
            <Link
              href="/productos"
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-2xl bg-green px-3 text-xs font-bold text-white shadow-[0_16px_32px_-16px_rgb(31_169_122_/_0.7)] transition hover:bg-[#189866] sm:h-12 sm:gap-2 sm:px-5 sm:text-sm"
            >
              Ver productos
              <ArrowUpRight className="size-3.5 sm:size-4" aria-hidden />
            </Link>
            <Link
              href="/#ayuda"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-3 text-xs font-semibold text-white transition hover:bg-white/10 sm:h-12 sm:px-5 sm:text-sm"
            >
              Contáctanos
            </Link>
          </div>
        </Container>
      </div>

      <Container className="relative py-8 lg:py-14">
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4">
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

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65 lg:mt-5">
              Bidones, recargas y dispensadores con foco en calidad, precio justo
              y reutilización. Atención cercana desde Maipú.
            </p>

            <ul className="mt-4 flex flex-wrap gap-2 lg:mt-5">
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
            <ul className="mt-3 space-y-0.5 lg:mt-4 lg:space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 py-1 text-sm font-medium text-white/75 transition hover:text-white lg:py-1.5"
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
            <ul className="mt-3 space-y-1 lg:mt-4 lg:space-y-2">
              <li>
                <a
                  href={company.phone.mobileHref}
                  className="flex items-center gap-2 rounded-xl py-1.5 transition hover:bg-white/5 lg:gap-3 lg:px-2 lg:py-2"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-green/15 text-green lg:size-9">
                    <Phone className="size-3.5 lg:size-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] text-white/45 lg:text-[11px]">
                      Ventas / celular
                    </span>
                    <span className="block text-[13px] font-semibold text-white lg:text-sm">
                      {company.phone.mobileDisplay}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={company.phone.landlineHref}
                  className="flex items-center gap-2 rounded-xl py-1.5 transition hover:bg-white/5 lg:gap-3 lg:px-2 lg:py-2"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-accent/15 text-brand-accent lg:size-9">
                    <Phone className="size-3.5 lg:size-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] text-white/45 lg:text-[11px]">Fijo</span>
                    <span className="block text-[13px] font-semibold text-white lg:text-sm">
                      {company.phone.landlineDisplay}
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="flex items-center gap-2 rounded-xl py-1.5 transition hover:bg-white/5 lg:gap-3 lg:px-2 lg:py-2"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-yellow/15 text-yellow lg:size-9">
                    <Mail className="size-3.5 lg:size-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] text-white/45 lg:text-[11px]">Correo</span>
                    <span className="block truncate text-[13px] font-semibold text-white lg:text-sm">
                      {company.email}
                    </span>
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Office */}
          <div className="col-span-2 lg:col-span-3">
            <h2 className="text-[11px] font-bold tracking-[0.18em] text-white/40 uppercase">
              Oficina
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-3 lg:mt-4 lg:grid-cols-1 lg:gap-4">
              <a
                href={company.address.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] p-3 transition hover:border-brand-accent/30 hover:bg-white/[0.07] lg:gap-3 lg:p-4"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-accent/15 text-brand-accent lg:size-9">
                  <MapPin className="size-3.5 lg:size-4" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold text-white lg:text-sm">
                    {company.address.street}
                  </span>
                  <span className="mt-0.5 block text-xs text-white/55 lg:text-sm">
                    {company.address.commune}, {company.address.city}
                  </span>
                  <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-brand-accent transition group-hover:gap-1.5 lg:mt-2">
                    Ver en mapa
                    <ArrowUpRight className="size-3.5" aria-hidden />
                  </span>
                </span>
              </a>

              <div className="flex items-start gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] p-3 lg:gap-3 lg:border-0 lg:bg-transparent lg:p-0 lg:px-1">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-yellow/15 text-yellow lg:size-9">
                  <Clock className="size-3.5 lg:size-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] text-white/45 lg:text-[11px]">
                    Atención presencial
                  </p>
                  <p className="text-[13px] font-semibold text-white lg:text-sm">
                    {company.hours.label}
                  </p>
                  <p className="text-xs text-white/60 lg:text-sm">
                    {company.hours.display}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-5 lg:mt-12 lg:flex-row lg:items-end lg:justify-between lg:gap-5 lg:pt-6">
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

          <div className="grid grid-cols-2 items-center gap-3 sm:flex sm:flex-row sm:gap-6">
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
              className="inline-flex items-center justify-end gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1.5 transition hover:border-white/20 hover:bg-white/[0.08] sm:justify-center sm:gap-2.5 sm:px-3 sm:py-2"
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
