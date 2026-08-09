"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Headphones,
  Loader2,
  MapPin,
  Send,
  X,
} from "lucide-react";
import { company } from "@/lib/company";
import Container from "@/components/ui/Container";

type FormState = {
  name: string;
  phone: string;
  email: string;
  message: string;
  consent: boolean;
};

const initialForm: FormState = {
  name: "",
  phone: "",
  email: "",
  message: "",
  consent: false,
};

const sucursalPhoto = {
  src: "/images/sucursal/sucursal.png",
  alt: "Sucursal Agua Ser Plus en Maipú",
} as const;

export default function ContactHelp() {
  const reduce = useReducedMotion();
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.consent) {
      setError(
        "Debes autorizar el tratamiento de tus datos personales para continuar.",
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = (await res.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!res.ok || !json.success) {
        setError(
          json.error ??
            "No pudimos enviar tu mensaje. Intenta de nuevo o llámanos.",
        );
        return;
      }

      setSent(true);
      setForm(initialForm);
    } catch {
      setError("Error de red. Revisa tu conexión e intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="ayuda"
      aria-labelledby="ayuda-heading"
      className="relative scroll-mt-20 overflow-hidden sm:scroll-mt-24"
    >
      <Image
        src="/images/contact-support-team.jpg"
        alt=""
        fill
        priority={false}
        sizes="100vw"
        className="object-cover object-[center_35%]"
        aria-hidden
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(105deg, rgb(4 26 46 / 0.92) 0%, rgb(4 26 46 / 0.82) 42%, rgb(0 86 163 / 0.55) 100%),
            linear-gradient(180deg, rgb(4 26 46 / 0.35) 0%, transparent 28%, rgb(4 26 46 / 0.55) 100%)
          `,
        }}
      />

      <Container className="relative py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
            className="lg:col-span-5"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold tracking-wide text-brand-accent uppercase backdrop-blur-sm">
              <Headphones className="size-3.5" aria-hidden />
              Atención cercana
            </div>

            <h2
              id="ayuda-heading"
              className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
            >
              ¿Necesitas ayuda?
              <span className="mt-1 block text-brand-accent">Contáctanos</span>
            </h2>

            <p className="mt-4 max-w-md text-base leading-relaxed text-white/75 sm:text-lg">
              Escríbenos y te respondemos a la brevedad. También puedes llamarnos
              al {company.phone.mobileDisplay}.
            </p>

            <a
              href={company.phone.mobileHref}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/90 transition hover:text-white"
            >
              <span className="h-px w-6 bg-brand-accent" aria-hidden />
              Llamar · {company.phone.mobileDisplay}
            </a>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: reduce ? 0 : 0.08, ease: [0.32, 0.72, 0, 1] }}
            className="lg:col-span-7"
          >
            <div className="rounded-[1.75rem] bg-white/95 p-5 shadow-[0_28px_60px_-28px_rgb(0_0_0_/_0.55)] ring-1 ring-white/40 backdrop-blur-md sm:p-7">
              {sent ? (
                <div
                  role="status"
                  className="flex flex-col items-start gap-3 py-6 sm:py-10"
                >
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-green-soft text-green">
                    <CheckCircle2 className="size-6" aria-hidden />
                  </span>
                  <h3 className="text-xl font-extrabold tracking-tight text-foreground">
                    Mensaje enviado
                  </h3>
                  <p className="max-w-md text-sm leading-relaxed text-neutral">
                    Gracias por escribirnos. Revisaremos tu consulta y te
                    contactaremos pronto al correo o teléfono que indicaste.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-2 text-sm font-semibold text-brand transition hover:text-brand-secondary"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4" noValidate>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block sm:col-span-1">
                      <span className="mb-1.5 block text-sm font-semibold text-foreground">
                        Nombre
                      </span>
                      <input
                        required
                        name="name"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        autoComplete="name"
                        placeholder="Ej: María González"
                        className="h-12 w-full rounded-xl border border-brand/12 bg-surface/60 px-4 text-sm text-foreground outline-none transition placeholder:text-neutral/70 focus:border-brand/30 focus:bg-white focus:ring-2 focus:ring-brand/15"
                      />
                    </label>

                    <label className="block sm:col-span-1">
                      <span className="mb-1.5 block text-sm font-semibold text-foreground">
                        Teléfono
                      </span>
                      <input
                        required
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        autoComplete="tel"
                        placeholder="+56 9 1234 5678"
                        className="h-12 w-full rounded-xl border border-brand/12 bg-surface/60 px-4 text-sm text-foreground outline-none transition placeholder:text-neutral/70 focus:border-brand/30 focus:bg-white focus:ring-2 focus:ring-brand/15"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-foreground">
                      Email
                    </span>
                    <input
                      required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      autoComplete="email"
                      placeholder="tu@correo.cl"
                      className="h-12 w-full rounded-xl border border-brand/12 bg-surface/60 px-4 text-sm text-foreground outline-none transition placeholder:text-neutral/70 focus:border-brand/30 focus:bg-white focus:ring-2 focus:ring-brand/15"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-foreground">
                      Mensaje
                    </span>
                    <textarea
                      required
                      name="message"
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      rows={4}
                      placeholder="Cuéntanos en qué te podemos ayudar…"
                      className="w-full resize-y rounded-xl border border-brand/12 bg-surface/60 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-neutral/70 focus:border-brand/30 focus:bg-white focus:ring-2 focus:ring-brand/15"
                    />
                  </label>

                  <label className="flex cursor-pointer gap-3 rounded-xl bg-surface/80 px-3.5 py-3 ring-1 ring-brand/10">
                    <input
                      type="checkbox"
                      required
                      checked={form.consent}
                      onChange={(e) => update("consent", e.target.checked)}
                      className="mt-0.5 size-4 shrink-0 accent-brand"
                    />
                    <span className="text-xs leading-relaxed text-neutral sm:text-[13px]">
                      Autorizo el tratamiento de mis datos personales por{" "}
                      <span className="font-semibold text-foreground">
                        {company.tradeName}
                      </span>{" "}
                      para atender esta solicitud, conforme a la{" "}
                      <span className="font-semibold text-foreground">
                        Ley N° 19.628
                      </span>{" "}
                      y la{" "}
                      <span className="font-semibold text-foreground">
                        Ley N° 21.719
                      </span>{" "}
                      sobre protección de datos personales. Puedo ejercer mis
                      derechos de acceso, rectificación, cancelación y oposición
                      escribiendo a{" "}
                      <a
                        href={`mailto:${company.email}`}
                        className="font-semibold text-brand underline-offset-2 hover:underline"
                      >
                        {company.email}
                      </a>
                      .
                    </span>
                  </label>

                  {error ? (
                    <p
                      role="alert"
                      className="rounded-xl bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700 ring-1 ring-red-200"
                    >
                      {error}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-bold text-white transition hover:bg-brand-secondary disabled:opacity-60 sm:w-auto sm:min-w-[12rem]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                        Enviando…
                      </>
                    ) : (
                      <>
                        <Send className="size-4" aria-hidden />
                        Enviar mensaje
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        {/* Sucursal: mapa + galería */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
          className="mt-14 rounded-[1.75rem] bg-white/95 p-5 shadow-[0_28px_60px_-28px_rgb(0_0_0_/_0.45)] ring-1 ring-white/40 backdrop-blur-md sm:mt-16 sm:p-7 lg:p-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-brand-accent uppercase">
                Visítanos
              </p>
              <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-[1.75rem]">
                Nuestra sucursal
              </h3>
              <p className="mt-2 flex items-start gap-2 text-sm text-neutral">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-brand"
                  aria-hidden
                />
                <span>
                  {company.address.street}, {company.address.commune},{" "}
                  {company.address.city}
                </span>
              </p>
              <p className="mt-1.5 flex items-center gap-2 text-sm text-neutral">
                <Clock className="size-4 shrink-0 text-brand" aria-hidden />
                {company.hours.label}: {company.hours.display}
              </p>
            </div>

            <a
              href={company.address.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-brand px-4 text-sm font-bold text-white transition hover:bg-brand-secondary sm:self-auto"
            >
              Abrir en Maps
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-5">
              <button
                type="button"
                onClick={() => setLightbox(true)}
                className="group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl bg-surface text-left ring-1 ring-brand/10 transition hover:ring-brand/25 focus-visible:outline-none sm:aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[480px]"
              >
                <Image
                  src={sucursalPhoto.src}
                  alt={sucursalPhoto.alt}
                  fill
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="object-cover object-center transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
                />
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl ring-1 ring-brand/10 lg:col-span-7">
              <iframe
                title={`Mapa de ${company.tradeName} — ${company.address.full}`}
                src={company.address.mapsEmbedUrl}
                className="h-[320px] w-full border-0 sm:h-[400px] lg:h-full lg:min-h-[480px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </motion.div>
      </Container>

      {lightbox ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={sucursalPhoto.alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#041a2e]/80 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 flex size-11 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
            aria-label="Cerrar imagen"
          >
            <X className="size-5" aria-hidden />
          </button>
          <div
            className="relative aspect-[3/4] w-full max-w-3xl overflow-hidden rounded-2xl bg-black/40 shadow-2xl ring-1 ring-white/20 sm:aspect-[4/5] sm:max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={sucursalPhoto.src}
              alt={sucursalPhoto.alt}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
