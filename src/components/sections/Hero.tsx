"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Droplet,
  Leaf,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/56900000000?text=Hola%20AguaSer%2C%20quiero%20pedir%20agua%20pura";

const ease = [0.32, 0.72, 0, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const categories = [
  {
    href: "#ofertas",
    icon: RefreshCw,
    label: "Recargas 20L",
    tone: "text-brand bg-brand/8 hover:bg-brand/12",
  },
  {
    href: "#ofertas",
    icon: Droplet,
    label: "Dispensadores",
    tone: "text-green bg-green-soft hover:bg-green/15",
  },
  {
    href: "#ofertas",
    icon: Sparkles,
    label: "Club AguaSer",
    tone: "text-foreground bg-yellow-soft hover:bg-yellow/30",
  },
] as const;

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-background"
    >
      {/* Atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 100% 0%, rgb(0 153 221 / 0.18), transparent 55%),
            radial-gradient(ellipse 50% 45% at 0% 100%, rgb(31 169 122 / 0.14), transparent 50%),
            radial-gradient(ellipse 40% 30% at 70% 90%, rgb(240 180 41 / 0.12), transparent 45%),
            linear-gradient(180deg, #f4f8fb 0%, #ffffff 55%, #ffffff 100%)
          `,
        }}
      />

      {/* Soft water ring decoration */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/4 size-[28rem] rounded-full border border-brand/8 opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 top-[28%] size-[20rem] rounded-full border border-green/15 opacity-50"
      />

      <div className="relative mx-auto grid min-h-[min(100dvh,920px)] max-w-7xl grid-cols-1 items-center gap-8 px-4 pt-14 pb-10 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:pt-16 lg:pb-12">
        {/* Copy column */}
        <motion.div
          className="relative z-10 flex flex-col justify-center lg:col-span-6 lg:pr-4"
          variants={stagger}
          initial={reduce ? false : "hidden"}
          animate="visible"
        >
          <motion.p
            variants={fadeUp}
            className="text-sm font-extrabold tracking-[0.22em] text-brand uppercase"
          >
            AguaSer
          </motion.p>

          <motion.h1
            id="hero-heading"
            variants={fadeUp}
            className="mt-3 max-w-[14ch] text-[2.5rem] font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]"
          >
            Agua pura, lista en tu puerta
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-4 max-w-[34ch] text-base leading-relaxed text-neutral sm:text-lg"
          >
            Bidones, dispensadores y el Club AguaSer. Saludable, económico y con
            despacho en Santiago.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-13 items-center justify-center gap-2.5 rounded-2xl bg-brand px-6 text-[15px] font-bold text-white shadow-[0_16px_40px_-16px_rgb(0_86_163_/_0.55)] transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-brand-secondary hover:shadow-[0_18px_44px_-14px_rgb(0_119_200_/_0.5)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <WhatsAppIcon className="size-5" />
              Pedir por WhatsApp
              <span className="ml-0.5 flex size-8 items-center justify-center rounded-xl bg-white/15 transition duration-500 group-hover:translate-x-0.5 group-hover:bg-white/20">
                <ArrowRight className="size-4" aria-hidden />
              </span>
            </a>

            <a
              href="#ofertas"
              className="inline-flex h-13 items-center justify-center gap-2 rounded-2xl bg-yellow-soft px-6 text-[15px] font-bold text-foreground ring-1 ring-yellow/40 transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-yellow hover:ring-yellow active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
            >
              Ver ofertas
              <ArrowRight className="size-4 opacity-70" aria-hidden />
            </a>
          </motion.div>

          <motion.nav
            variants={fadeUp}
            aria-label="Categorías rápidas"
            className="mt-8 flex flex-wrap gap-2"
          >
            {categories.map(({ href, icon: Icon, label, tone }) => (
              <a
                key={label}
                href={href}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] ${tone}`}
              >
                <Icon className="size-4" strokeWidth={2} aria-hidden />
                {label}
              </a>
            ))}
          </motion.nav>
        </motion.div>

        {/* Visual column */}
        <motion.div
          className="relative lg:col-span-6"
          initial={reduce ? false : { opacity: 0, x: 28, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.12, ease }}
        >
          <div className="relative mx-auto max-w-lg lg:max-w-none">
            {/* Outer double-bezel shell */}
            <div className="rounded-[2.25rem] bg-gradient-to-br from-brand/10 via-green/5 to-yellow/15 p-2 shadow-[0_30px_80px_-36px_rgb(0_86_163_/_0.45)] ring-1 ring-brand/10">
              <div className="relative overflow-hidden rounded-[1.85rem] bg-background">
                {/* Product stage */}
                <div className="relative aspect-[5/6] sm:aspect-[4/5] lg:aspect-[5/6]">
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,_rgb(0_153_221_/_0.18),_transparent_55%),linear-gradient(180deg,_#eef7fc_0%,_#e8f8f1_55%,_#fff6db_100%)]"
                  />

                  {/* Soft floating orb behind product */}
                  <motion.div
                    aria-hidden
                    className="absolute top-[18%] left-1/2 size-56 -translate-x-1/2 rounded-full bg-brand-accent/25 blur-3xl sm:size-64"
                    animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  <motion.div
                    className="absolute inset-0"
                    animate={reduce ? undefined : { y: [0, -12, 0] }}
                    transition={{
                      duration: 5.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Image
                      src="/products/hero-bidon-20l.png"
                      alt="Bidón de agua pura AguaSer 20 litros"
                      fill
                      priority
                      sizes="(max-width: 1024px) 90vw, 44vw"
                      className="object-contain object-center p-6 sm:p-10"
                    />
                  </motion.div>
                </div>

                {/* Product info bar - not overlaid on image */}
                <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-t border-brand/8 bg-background px-5 py-4 sm:px-6 sm:py-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-yellow-soft px-2 py-0.5 text-[11px] font-extrabold text-foreground ring-1 ring-yellow/35">
                        <Truck className="size-3" aria-hidden />
                        Entrega rápida
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-lg bg-green-soft px-2 py-0.5 text-[11px] font-extrabold text-green ring-1 ring-green/20">
                        <Leaf className="size-3" aria-hidden />
                        Reciclable
                      </span>
                    </div>
                    <h2 className="mt-2 text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
                      Bidón 20L AguaSer
                    </h2>
                    <p className="text-sm text-neutral">
                      Producto estrella · Agua pura
                    </p>
                  </div>

                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex shrink-0 flex-col items-center justify-center rounded-2xl bg-brand px-4 py-3 text-white transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-green active:scale-[0.98] sm:px-5"
                  >
                    <span className="text-[11px] font-semibold text-white/75">
                      Desde
                    </span>
                    <span className="flex items-center gap-1 text-base font-extrabold sm:text-lg">
                      Pedir
                      <ArrowRight
                        className="size-4 transition group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Floating social proof chip */}
            <motion.aside
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6, ease }}
              className="absolute -bottom-3 left-4 z-10 hidden max-w-[220px] rounded-2xl bg-background/95 p-3.5 shadow-[0_18px_40px_-20px_rgb(12_45_74_/_0.35)] ring-1 ring-brand/10 backdrop-blur-sm sm:left-0 sm:block lg:-left-6"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-green-soft text-green">
                  <ShieldCheck className="size-5" strokeWidth={2} aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    Calidad certificada
                  </p>
                  <p className="mt-0.5 text-xs leading-snug text-neutral">
                    Purificación controlada para tu hogar y empresa
                  </p>
                </div>
              </div>
            </motion.aside>
          </div>
        </motion.div>
      </div>

      {/* Trust strip under hero composition */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.55, ease }}
        className="relative border-t border-brand/8 bg-background/80"
      >
        <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-4 sm:justify-start sm:px-6 lg:px-8">
          {[
            { icon: Truck, label: "Despacho express en Santiago", color: "text-brand" },
            { icon: ShieldCheck, label: "Garantía de calidad", color: "text-green" },
            { icon: Leaf, label: "Sostenible y reciclable", color: "text-green" },
          ].map(({ icon: Icon, label, color }) => (
            <li
              key={label}
              className={`inline-flex items-center gap-2 text-sm font-semibold ${color}`}
            >
              <Icon className="size-4 shrink-0" strokeWidth={2} aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </motion.div>
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
