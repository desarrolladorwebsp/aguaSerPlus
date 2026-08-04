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
  { href: "/#recargas", label: "Recargas" },
  { href: "/#ofertas", label: "Ofertas" },
] as const;

const pillars = [
  { icon: Droplets, label: "Salud" },
  { icon: Leaf, label: "Economía" },
  { icon: Recycle, label: "Reciclaje" },
] as const;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

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
              Pedido rápido
            </p>
            <p className="mt-1.5 text-xl font-extrabold tracking-tight sm:text-2xl">
              ¿Necesitas agua hoy?
            </p>
            <p className="mt-1 text-sm text-white/65">
              Cotiza o pide recargas y dispensadores por WhatsApp. Despacho en
              Santiago.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={company.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2.5 rounded-2xl bg-green px-5 text-sm font-bold text-white shadow-[0_16px_32px_-16px_rgb(31_169_122_/_0.7)] transition hover:bg-[#189866]"
            >
              <WhatsAppIcon className="size-4" />
              Pedir por WhatsApp
            </a>
            <Link
              href="/productos"
              className="inline-flex h-12 items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Ver productos
              <ArrowUpRight className="size-4" aria-hidden />
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
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 lg:flex-row lg:items-end lg:justify-between">
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
          <a
            href={company.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-brand-accent transition hover:text-white"
          >
            {company.domain}
          </a>
        </div>
      </Container>
    </footer>
  );
}
