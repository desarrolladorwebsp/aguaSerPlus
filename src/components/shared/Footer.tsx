import {
  Clock,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { company } from "@/lib/company";
import BrandLogo from "@/components/shared/BrandLogo";

const navLinks = [
  { href: "#bidones", label: "Bidones" },
  { href: "#dispensadores", label: "Dispensadores" },
  { href: "#club", label: "Club AguaSer" },
  { href: "#recargas", label: "Recargas" },
  { href: "#ofertas", label: "Ofertas" },
  { href: "#nosotros", label: "Nosotros" },
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
    <footer className="relative overflow-hidden border-t border-brand/10 bg-foreground text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(ellipse 50% 60% at 0% 100%, rgb(0 153 221 / 0.25), transparent 55%),
            radial-gradient(ellipse 40% 50% at 100% 0%, rgb(31 169 122 / 0.18), transparent 50%)
          `,
        }}
      />

      <div className="relative mx-auto w-full px-4 py-14 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <BrandLogo size="lg" onDark />
              <div>
                <p className="text-lg font-extrabold tracking-wide">
                  {company.tradeName}
                </p>
                <p className="text-xs text-white/55">
                  Salud, Economía y Reciclaje
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              Agua pura para tu hogar y empresa. Bidones, dispensadores y Club
              AguaSer con despacho en Santiago.
            </p>
            <a
              href={company.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-green px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#189866]"
            >
              <WhatsAppIcon className="size-4" />
              WhatsApp Business
            </a>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2">
            <h2 className="text-sm font-bold tracking-wide text-yellow uppercase">
              Navegación
            </h2>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/75 transition hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h2 className="text-sm font-bold tracking-wide text-yellow uppercase">
              Contacto
            </h2>
            <ul className="mt-4 space-y-3.5 text-sm">
              <li>
                <a
                  href={company.phone.landlineHref}
                  className="inline-flex items-start gap-2.5 text-white/80 transition hover:text-white"
                >
                  <Phone className="mt-0.5 size-4 shrink-0 text-brand-accent" aria-hidden />
                  <span>
                    <span className="block text-xs text-white/50">Fijo</span>
                    {company.phone.landlineDisplay}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={company.phone.mobileHref}
                  className="inline-flex items-start gap-2.5 text-white/80 transition hover:text-white"
                >
                  <Phone className="mt-0.5 size-4 shrink-0 text-green" aria-hidden />
                  <span>
                    <span className="block text-xs text-white/50">
                      Celular / ventas
                    </span>
                    {company.phone.mobileDisplay}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="inline-flex items-start gap-2.5 text-white/80 transition hover:text-white"
                >
                  <Mail className="mt-0.5 size-4 shrink-0 text-yellow" aria-hidden />
                  <span>
                    <span className="block text-xs text-white/50">Correo</span>
                    {company.email}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={company.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-2.5 text-white/80 transition hover:text-white"
                >
                  <WhatsAppIcon className="mt-0.5 size-4 shrink-0 text-green" />
                  <span>
                    <span className="block text-xs text-white/50">WhatsApp</span>
                    {company.phone.mobileDisplay}
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Location / hours */}
          <div className="lg:col-span-3">
            <h2 className="text-sm font-bold tracking-wide text-yellow uppercase">
              Oficina
            </h2>
            <ul className="mt-4 space-y-3.5 text-sm">
              <li>
                <a
                  href={company.address.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-2.5 text-white/80 transition hover:text-white"
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand-accent" aria-hidden />
                  <span>
                    {company.address.street}
                    <br />
                    {company.address.commune}, {company.address.city}
                  </span>
                </a>
              </li>
              <li className="inline-flex items-start gap-2.5 text-white/80">
                <Clock className="mt-0.5 size-4 shrink-0 text-yellow" aria-hidden />
                <span>
                  <span className="block text-xs text-white/50">
                    Atención presencial
                  </span>
                  {company.hours.label}
                  <br />
                  {company.hours.display}
                </span>
              </li>
              <li>
                <a
                  href={company.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-brand-accent transition hover:text-white"
                >
                  {company.domain}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal / billing strip */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 sm:px-6">
          <p className="text-xs leading-relaxed text-white/55 sm:text-sm">
            <span className="font-semibold text-white/80">Facturación:</span>{" "}
            {company.legalName}
            <span className="mx-2 text-white/25">|</span>
            <span className="font-semibold text-white/80">RUT:</span>{" "}
            {company.rut}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/45">
            © {year} {company.tradeName}. Todos los derechos reservados.
          </p>
          <p className="text-xs text-white/45">
            Nombre comercial: {company.tradeName} · {company.domain}
          </p>
        </div>
      </div>
    </footer>
  );
}
