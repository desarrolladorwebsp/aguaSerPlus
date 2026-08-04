"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Leaf,
  MapPin,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { company } from "@/lib/company";

/**
 * Propuesta Hero v3 — Quiet Premium Commerce
 * Soft Structuralism · VARIANCE 7 · MOTION 5 · DENSITY 2
 * Menos UI chrome, más marca + producto + CTA.
 */

const ease = [0.32, 0.72, 0, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.06 },
  },
};

const categories = [
  { href: "#recargas", label: "Recargas 20L" },
  { href: "#dispensadores", label: "Dispensadores" },
  { href: "#club", label: "Club AguaSer" },
] as const;

const benefits = [
  {
    icon: ShieldCheck,
    title: "Agua controlada",
    text: "Purificación con estándar de calidad.",
  },
  {
    icon: Truck,
    title: "Despacho en Santiago",
    text: "Entrega a domicilio, rápida y simple.",
  },
  {
    icon: Leaf,
    title: "Más sostenible",
    text: "Bidones retornables y reutilizables.",
  },
] as const;

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-white"
    >
      {/* Soft brand wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 100% 0%, rgb(0 153 221 / 0.12), transparent 55%),
            radial-gradient(ellipse 45% 40% at 0% 100%, rgb(31 169 122 / 0.08), transparent 50%),
            linear-gradient(180deg, #f5faff 0%, #ffffff 48%, #ffffff 100%)
          `,
        }}
      />

      <div className="relative mx-auto w-full px-4 pt-10 pb-14 sm:px-6 lg:px-10 lg:pt-14 lg:pb-16 xl:px-14">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* LEFT — marca + mensaje + CTA */}
          <motion.div
            variants={stagger}
            initial={reduce ? false : "hidden"}
            animate="visible"
            className="max-w-xl lg:max-w-none"
          >
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-4"
            >
              <div className="relative size-[4.5rem] overflow-hidden rounded-full bg-white shadow-[0_16px_40px_-20px_rgb(0_86_163_/_0.45)] ring-1 ring-brand/10 sm:size-20">
                <Image
                  src={company.logo.src}
                  alt={company.logo.alt}
                  width={company.logo.width}
                  height={company.logo.height}
                  priority
                  className="h-full w-full object-contain p-1"
                  sizes="80px"
                />
              </div>
              <div>
                <p className="text-sm font-extrabold tracking-wide text-brand">
                  Agua Ser Plus
                </p>
                <p className="mt-0.5 text-xs font-medium text-neutral">
                  Salud · Economía · Reciclaje
                </p>
              </div>
            </motion.div>

            <motion.h1
              id="hero-heading"
              variants={fadeUp}
              className="mt-8 text-[2.8rem] font-extrabold leading-[1.05] tracking-[-0.035em] text-foreground sm:text-5xl lg:text-[3.5rem] xl:text-[3.75rem]"
            >
              El agua más pura,
              <span className="mt-1 block text-brand">
                directo a tu puerta.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-[36ch] text-[1.05rem] leading-relaxed text-neutral"
            >
              Bidones, dispensadores y suscripciones para hogar y empresa en
              Santiago.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <a
                href={company.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-brand px-6 text-[15px] font-bold text-white shadow-[0_20px_44px_-18px_rgb(0_86_163_/_0.55)] transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-brand-secondary active:scale-[0.98]"
              >
                <WhatsAppIcon className="size-5" />
                Pedir por WhatsApp
                <span className="flex size-9 items-center justify-center rounded-xl bg-white/15 transition group-hover:translate-x-0.5">
                  <ArrowRight className="size-4" aria-hidden />
                </span>
              </a>

              <a
                href="#ofertas"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-[15px] font-bold text-brand ring-1 ring-brand/15 transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-surface hover:ring-brand/30 active:scale-[0.98]"
              >
                Ver ofertas
                <ArrowRight className="size-4 opacity-70" aria-hidden />
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-brand/10 pt-6"
            >
              <span className="inline-flex items-center gap-1.5 text-sm text-neutral">
                <MapPin className="size-4 text-brand" aria-hidden />
                Maipú · Santiago
              </span>
              <nav aria-label="Accesos rápidos" className="flex flex-wrap gap-x-4 gap-y-1">
                {categories.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-sm font-semibold text-brand underline-offset-4 transition hover:underline"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </motion.div>
          </motion.div>

          {/* RIGHT — producto en escenario premium */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.15, ease }}
            className="w-full"
          >
            <div className="rounded-[2rem] bg-gradient-to-b from-brand/[0.06] via-green/[0.04] to-yellow/[0.08] p-2 shadow-[0_30px_80px_-40px_rgb(0_86_163_/_0.45)] ring-1 ring-brand/10">
              <div className="relative overflow-hidden rounded-[1.6rem] bg-white">
                <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[5/4]">
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_rgb(0_153_221_/_0.16),_transparent_58%)]"
                  />

                  <motion.div
                    className="absolute inset-0"
                    animate={reduce ? undefined : { y: [0, -8, 0] }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Image
                      src="/products/hero-jug-splash.png"
                      alt="Bidón Agua Ser Plus 20 litros"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain object-center p-4 sm:p-8"
                    />
                  </motion.div>
                </div>

                {/* Info bajo la imagen — sin overlays encima */}
                <div className="flex items-center justify-between gap-4 border-t border-brand/8 px-5 py-4 sm:px-6">
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-green uppercase">
                      Producto estrella
                    </p>
                    <p className="mt-0.5 text-lg font-extrabold text-foreground">
                      Bidón 20L Agua Ser Plus
                    </p>
                  </div>
                  <a
                    href={company.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-secondary"
                  >
                    Pedir
                    <ArrowRight className="size-4" aria-hidden />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Benefits — una sola fila limpia */}
        <motion.ul
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease }}
          className="mt-12 grid grid-cols-1 gap-6 border-t border-brand/10 pt-8 sm:grid-cols-3 sm:gap-8"
        >
          {benefits.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-3">
              <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/8 text-brand">
                <Icon className="size-5" strokeWidth={1.6} aria-hidden />
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-neutral">
                  {text}
                </p>
              </div>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

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
