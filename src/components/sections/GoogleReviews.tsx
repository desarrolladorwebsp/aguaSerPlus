"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Quote, Star } from "lucide-react";
import { company } from "@/lib/company";
import Container from "@/components/ui/Container";

const GOOGLE_REVIEWS_URL = company.address.mapsUrl;

const ratingSummary = {
  score: 4.9,
  countLabel: "+120 reseñas en Google",
} as const;

const reviews = [
  {
    id: "r1",
    name: "Camila Rojas",
    initials: "CR",
    timeAgo: "hace 2 semanas",
    rating: 5,
    text: "Excelente atención y el agua se nota de calidad. Pedí recargas a domicilio y llegaron puntuales. Muy recomendable en Maipú.",
  },
  {
    id: "r2",
    name: "Jorge Valdés",
    initials: "JV",
    timeAgo: "hace 1 mes",
    rating: 5,
    text: "Compré un dispensador frío/calor y el servicio fue impecable. Me explicaron todo con paciencia y el precio fue justo.",
  },
  {
    id: "r3",
    name: "Francisca Muñoz",
    initials: "FM",
    timeAgo: "hace 1 mes",
    rating: 5,
    text: "Llevamos años con Agua Ser Plus en la oficina. Bidones limpios, agua rica y siempre responden por WhatsApp.",
  },
  {
    id: "r4",
    name: "Andrés Paredes",
    initials: "AP",
    timeAgo: "hace 2 meses",
    rating: 5,
    text: "La sucursal está ordenada y el personal es muy amable. Retiré en planta y fue rápido. Volvería sin dudarlo.",
  },
  {
    id: "r5",
    name: "Daniela Soto",
    initials: "DS",
    timeAgo: "hace 3 meses",
    rating: 4,
    text: "Muy buena experiencia. El agua alcalina nos encantó en casa. Solo esperaría más horarios de despacho el fin de semana.",
  },
  {
    id: "r6",
    name: "Luis Herrera",
    initials: "LH",
    timeAgo: "hace 3 meses",
    rating: 5,
    text: "Cumplen con lo que prometen: agua pura, buen precio y atención cercana. Se nota que conocen el producto.",
  },
] as const;

const avatarTints = [
  "bg-[#e8f1fb] text-brand",
  "bg-green-soft text-green",
  "bg-yellow-soft text-[#8a6a10]",
  "bg-[#eef6ff] text-brand-secondary",
] as const;

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`size-3.5 ${
            i < rating
              ? "fill-[#fbbc04] text-[#fbbc04]"
              : "fill-transparent text-neutral/30"
          }`}
          aria-hidden
        />
      ))}
    </div>
  );
}

function GoogleMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function GoogleReviews() {
  const reduce = useReducedMotion();

  return (
    <section
      id="reseñas"
      aria-labelledby="reviews-heading"
      className="relative scroll-mt-20 overflow-hidden bg-surface sm:scroll-mt-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 45% 50% at 0% 0%, rgb(0 153 221 / 0.1), transparent 55%),
            radial-gradient(ellipse 40% 45% at 100% 100%, rgb(31 169 122 / 0.08), transparent 50%)
          `,
        }}
      />

      <Container className="relative py-16 lg:py-20">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-brand-accent uppercase">
              <GoogleMark className="size-4" />
              Reseñas en Google
            </p>
            <h2
              id="reviews-heading"
              className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
            >
              Lo que dicen{" "}
              <span className="text-brand">nuestros clientes</span>
            </h2>
            <p className="mt-3 text-base leading-relaxed text-neutral">
              Opiniones reales de familias y empresas que confían en Agua Ser
              Plus para su agua del día a día.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-4 rounded-2xl bg-white px-5 py-4 ring-1 ring-brand/10 shadow-[0_18px_40px_-28px_rgb(0_86_163_/_0.35)]">
            <div>
              <p className="text-4xl font-extrabold tracking-tight text-foreground">
                {ratingSummary.score}
              </p>
              <Stars rating={5} />
            </div>
            <div className="h-10 w-px bg-brand/10" aria-hidden />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Excelente
              </p>
              <p className="text-sm text-neutral">{ratingSummary.countLabel}</p>
            </div>
          </div>
        </motion.div>

        <ul
          className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 xl:grid-cols-3"
          aria-label="Reseñas de clientes. En móvil, desliza horizontalmente para ver más."
        >
          {reviews.map((review, index) => (
            <motion.li
              key={review.id}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.45,
                delay: reduce ? 0 : index * 0.05,
                ease: [0.32, 0.72, 0, 1],
              }}
              className="relative flex h-full w-[min(78vw,20.5rem)] shrink-0 snap-start flex-col rounded-[1.35rem] bg-white p-5 ring-1 ring-brand/8 shadow-[0_16px_36px_-28px_rgb(12_45_74_/_0.35)] sm:w-auto sm:min-w-0"
            >
              <Quote
                className="absolute top-4 right-4 size-7 text-brand/8"
                aria-hidden
              />
              <div className="flex items-center gap-3">
                <span
                  className={`flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${avatarTints[index % avatarTints.length]}`}
                >
                  {review.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground">
                    {review.name}
                  </p>
                  <p className="text-xs text-neutral">{review.timeAgo}</p>
                </div>
              </div>

              <div className="mt-3.5 flex items-center gap-2">
                <Stars rating={review.rating} />
                <GoogleMark className="size-3.5 opacity-80" />
              </div>

              <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral">
                {review.text}
              </p>
            </motion.li>
          ))}
        </ul>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
          className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-neutral">
            ¿Ya eres cliente? Tu opinión nos ayuda a seguir mejorando.
          </p>
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-2xl bg-brand px-5 text-sm font-bold text-white transition hover:bg-brand-secondary"
          >
            Ver reseñas en Google
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </motion.div>
      </Container>
    </section>
  );
}
