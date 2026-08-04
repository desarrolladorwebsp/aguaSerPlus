"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Droplet,
  Heart,
  Leaf,
  Recycle,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Users,
} from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/56900000000?text=Hola%20AguaSer%2C%20quiero%20pedir%20agua%20pura";

const ease = [0.32, 0.72, 0, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

const features = [
  {
    icon: ShieldCheck,
    title: "Calidad certificada",
    description: "Agua controlada",
  },
  {
    icon: Recycle,
    title: "Reciclable",
    description: "Bidones reutilizables",
  },
  {
    icon: Truck,
    title: "Despacho rápido",
    description: "En Santiago",
  },
  {
    icon: Users,
    title: "Club AguaSer",
    description: "Más beneficios",
  },
] as const;

const quickOptions = [
  {
    href: "#recargas",
    label: "Recargas 20L",
    className: "bg-brand/10 text-brand ring-brand/15 hover:bg-brand/15",
  },
  {
    href: "#dispensadores",
    label: "Dispensadores",
    className: "bg-green-soft text-green ring-green/20 hover:bg-green/15",
  },
  {
    href: "#club",
    label: "Club AguaSer",
    className: "bg-yellow-soft text-foreground ring-yellow/35 hover:bg-yellow/35",
  },
] as const;

const valueProps = [
  {
    icon: ShieldCheck,
    title: "Segura para tu familia",
    description: "Purificación confiable para el día a día.",
    iconClass: "bg-brand/10 text-brand",
  },
  {
    icon: Leaf,
    title: "Amigable con el planeta",
    description: "Menos plástico descartable, más reuso.",
    iconClass: "bg-green-soft text-green",
  },
  {
    icon: Star,
    title: "Ahorra más",
    description: "Mejores precios con el Club AguaSer.",
    iconClass: "bg-yellow-soft text-yellow",
  },
] as const;

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-[calc(100dvh-4.5rem)] flex-col overflow-hidden bg-[#f7fbff]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 55% 50% at 85% 35%, rgb(0 153 221 / 0.16), transparent 60%),
            radial-gradient(ellipse 40% 35% at 10% 80%, rgb(31 169 122 / 0.08), transparent 55%),
            linear-gradient(180deg, #f7fbff 0%, #ffffff 70%)
          `,
        }}
      />

      <div className="relative mx-auto flex w-full flex-1 flex-col justify-center px-4 py-10 sm:px-6 lg:px-8 lg:py-12 xl:px-12">
        <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-6 xl:gap-10">
          {/* Left copy */}
          <motion.div
            className="w-full lg:col-span-5 xl:col-span-5"
            variants={stagger}
            initial={reduce ? false : "hidden"}
            animate="visible"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1.5 text-[11px] font-bold tracking-[0.14em] text-brand uppercase"
            >
              <Droplet className="size-3.5 fill-brand" aria-hidden />
              Agua purificada
            </motion.span>

            <motion.h1
              id="hero-heading"
              variants={fadeUp}
              className="mt-5 w-full max-w-[16ch] text-[2.6rem] font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]"
            >
              Agua pura,{" "}
              <span className="text-brand">lista en tu puerta</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-4 w-full max-w-[42ch] text-[15px] leading-relaxed text-neutral sm:text-base"
            >
              Bidones, dispensadores y el Club AguaSer. Saludable, económico y
              con despacho en Santiago.
            </motion.p>

            {/* Feature boxes 2x2 / 4 col */}
            <motion.ul
              variants={fadeUp}
              className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4"
            >
              {features.map(({ icon: Icon, title, description }) => (
                <li
                  key={title}
                  className="rounded-2xl bg-background px-3 py-3.5 shadow-[0_8px_24px_-16px_rgb(0_86_163_/_0.35)] ring-1 ring-brand/8"
                >
                  <Icon
                    className="size-5 text-brand"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <p className="mt-2 text-xs font-bold leading-snug text-foreground sm:text-[13px]">
                    {title}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-neutral">
                    {description}
                  </p>
                </li>
              ))}
            </motion.ul>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-brand px-6 text-sm font-bold text-white shadow-[0_14px_32px_-12px_rgb(0_86_163_/_0.55)] transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-brand-secondary active:scale-[0.98]"
              >
                <WhatsAppIcon className="size-5" />
                Pedir por WhatsApp
                <ArrowRight
                  className="size-4 transition group-hover:translate-x-0.5"
                  aria-hidden
                />
              </a>

              <a
                href="#ofertas"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-brand/20 bg-background px-6 text-sm font-bold text-brand transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-brand/40 hover:bg-brand/5 active:scale-[0.98]"
              >
                Ver ofertas
                <ArrowRight
                  className="size-4 transition group-hover:translate-x-0.5"
                  aria-hidden
                />
              </a>
            </motion.div>

            {/* Quick options */}
            <motion.div variants={fadeUp} className="mt-6">
              <p className="text-sm text-neutral">
                O elige una opción rápida:
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {quickOptions.map((option) => (
                  <a
                    key={option.label}
                    href={option.href}
                    className={`inline-flex items-center rounded-full px-3.5 py-2 text-xs font-bold ring-1 transition ${option.className}`}
                  >
                    {option.label === "Club AguaSer" ? (
                      <Sparkles className="mr-1.5 size-3.5" aria-hidden />
                    ) : null}
                    {option.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right visual */}
          <motion.div
            className="relative w-full lg:col-span-7 xl:col-span-7"
            initial={reduce ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.12, ease }}
          >
            <div className="relative mx-auto aspect-[5/4] w-full sm:aspect-[4/3] lg:aspect-[5/4] lg:min-h-[480px]">
              {/* Soft blue circle behind */}
              <div
                aria-hidden
                className="absolute top-[6%] left-1/2 size-[70%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgb(0_153_221_/_0.22)_0%,_rgb(0_119_200_/_0.08)_45%,_transparent_70%)]"
              />

              <motion.div
                className="absolute inset-0"
                animate={reduce ? undefined : { y: [0, -8, 0] }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src="/products/hero-jug-splash.png"
                  alt="Bidón AguaSer 20 litros con agua fresca"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-contain object-center drop-shadow-[0_30px_50px_rgb(0_86_163_/_0.18)]"
                />
              </motion.div>

              {/* Circular badge - hydration */}
              <motion.aside
                initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45, duration: 0.55, ease }}
                className="absolute top-[4%] right-[4%] z-10 flex size-[7.5rem] flex-col items-center justify-center rounded-full bg-background text-center shadow-[0_16px_40px_-18px_rgb(0_86_163_/_0.45)] ring-1 ring-brand/10 sm:size-32 sm:right-[6%]"
              >
                <Heart
                  className="mb-1 size-4 fill-brand text-brand sm:size-5"
                  aria-hidden
                />
                <p className="px-3 text-[10px] leading-tight font-bold tracking-wide text-brand uppercase sm:text-[11px]">
                  Hidratación que te hace{" "}
                  <span className="text-brand-accent">bien</span>
                </p>
              </motion.aside>
            </div>
          </motion.div>
        </div>

        {/* Value proposition bar */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease }}
          className="mt-8 w-full rounded-[1.75rem] bg-background p-5 shadow-[0_20px_50px_-28px_rgb(12_45_74_/_0.28)] ring-1 ring-brand/8 sm:mt-10 sm:p-6 lg:mt-8"
        >
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
            {valueProps.map(({ icon: Icon, title, description, iconClass }) => (
              <li key={title} className="flex items-start gap-3.5">
                <span
                  className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}
                >
                  <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-bold text-foreground sm:text-[15px]">
                    {title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-neutral sm:text-sm">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
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
