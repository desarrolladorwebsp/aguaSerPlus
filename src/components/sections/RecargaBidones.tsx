"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Droplets,
  Heart,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { company } from "@/lib/company";
import Container from "@/components/ui/Container";

const ease = [0.32, 0.72, 0, 1] as const;

const pillars = [
  {
    icon: Droplets,
    label: "100% purificada",
    tone: "bg-brand text-white ring-brand/20",
  },
  {
    icon: ShieldCheck,
    label: "Alta pureza",
    tone: "bg-green text-white ring-green/20",
  },
  {
    icon: BadgeCheck,
    label: "Libre de sodio",
    tone: "bg-yellow text-white ring-yellow/25",
  },
] as const;

function DonationCounter({ target }: { target: number }) {
  const [value, setValue] = useState(0);
  const started = useRef(false);
  const reduce = useReducedMotion();

  const start = () => {
    if (started.current) return;
    started.current = true;
    if (reduce) {
      setValue(target);
      return;
    }
    const duration = 1100;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  return (
    <motion.span onViewportEnter={start} viewport={{ once: true, amount: 0.6 }}>
      {value}%
    </motion.span>
  );
}

export default function RecargaBidones() {
  const reduce = useReducedMotion();

  return (
    <section
      id="recargas"
      aria-labelledby="recargas-heading"
      className="relative scroll-mt-20 overflow-hidden bg-gradient-to-br from-white via-brand-accent/5 to-green-soft sm:scroll-mt-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 55% 60% at 100% 0%, rgb(0 153 221 / 0.16), transparent 55%),
            radial-gradient(ellipse 45% 50% at 0% 100%, rgb(31 169 122 / 0.14), transparent 50%),
            radial-gradient(ellipse 35% 40% at 85% 85%, rgb(240 180 41 / 0.16), transparent 55%)
          `,
        }}
      />

      {!reduce && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-16 top-10 size-56 rounded-full bg-green/15 blur-3xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute right-0 top-1/3 size-64 rounded-full bg-yellow/15 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.85, 0.5] }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -bottom-10 left-1/3 size-52 rounded-full bg-brand-accent/15 blur-3xl"
            animate={{ scale: [1, 1.18, 1], opacity: [0.55, 0.85, 0.55] }}
            transition={{
              duration: 7.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </>
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/20 to-transparent"
      />

      <Container className="relative flex w-full flex-col gap-10 py-16 lg:flex-row lg:items-center lg:gap-12 lg:py-20">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease }}
          className="w-full min-w-0 lg:flex-1"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-green to-brand-accent px-3.5 py-1.5 text-sm font-bold tracking-[0.1em] text-white uppercase shadow-[0_10px_24px_-10px_rgb(31_169_122_/_0.5)]">
            <Sparkles className="size-3.5" aria-hidden />
            Recargas con propósito
          </span>

          <h2
            id="recargas-heading"
            className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
          >
            Recarga tus bidones{" "}
            <span className="text-brand">y ayuda a Chile</span>
          </h2>

          <p className="mt-4 max-w-[38ch] text-base leading-relaxed text-neutral sm:text-lg">
            Cada compra o recarga de bidones también transforma vidas: el{" "}
            <span className="font-bold text-brand">15%</span> se destina a la{" "}
            <span className="font-semibold text-foreground">
              El Vendedor de Sueños
            </span>
            , para ayudar a las familias más necesitadas de Chile.
          </p>

          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.55, ease, delay: 0.1 }}
            className="relative mt-6 flex items-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-brand via-brand-secondary to-green p-4 shadow-[0_20px_45px_-20px_rgb(0_86_163_/_0.45)]"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-white/10"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-8 right-10 size-20 rounded-full bg-white/10"
            />
            <motion.div
              animate={
                reduce ? undefined : { scale: [1, 1.15, 1] }
              }
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white ring-1 ring-white/30"
            >
              <Heart className="size-7 fill-white" strokeWidth={1.5} aria-hidden />
            </motion.div>
            <div className="relative z-10">
              <p className="text-3xl font-extrabold leading-none text-white">
                <DonationCounter target={15} />
              </p>
              <p className="mt-1 text-sm leading-snug text-white/90">
                de tu compra apoya a la{" "}
                <span className="font-semibold text-white">
                  El Vendedor de Sueños
                </span>
              </p>
            </div>
          </motion.div>

          <motion.ul
            initial={reduce ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
            }}
            className="mt-6 flex flex-wrap gap-3"
          >
            {pillars.map(({ icon: Icon, label, tone }) => (
              <motion.li
                key={label}
                variants={{
                  hidden: { opacity: 0, y: 10, scale: 0.9 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.4, ease }}
                whileHover={reduce ? undefined : { scale: 1.06, y: -2 }}
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold ring-1 ${tone}`}
              >
                <Icon className="size-4" strokeWidth={1.75} aria-hidden />
                {label}
              </motion.li>
            ))}
          </motion.ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/productos"
              className="group inline-flex h-13 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-brand to-brand-secondary px-6 text-[15px] font-bold text-white shadow-soft transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-[0_20px_45px_-16px_rgb(0_86_163_/_0.55)] active:scale-[0.98]"
            >
              Ver recargas
              <span className="flex size-8 items-center justify-center rounded-xl bg-white/15 transition group-hover:translate-x-0.5">
                <ArrowRight className="size-4" aria-hidden />
              </span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="relative w-full min-w-0 lg:flex-1"
        >
          <div className="rounded-[2rem] bg-gradient-to-br from-brand-accent/20 via-white to-green/20 p-2 ring-1 ring-brand/10">
            <div className="relative aspect-square overflow-hidden rounded-[1.6rem] bg-white">
              <Image
                src="/products/hero-jug-splash.png"
                alt="Bidón Agua Ser Plus para recarga"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-center"
              />
              <div className="absolute top-4 left-4 overflow-hidden rounded-full bg-white p-1 shadow-md ring-1 ring-brand/10">
                <Image
                  src={company.logo.src}
                  alt={company.logo.alt}
                  width={64}
                  height={64}
                  className="size-14 object-contain sm:size-16"
                />
              </div>
            </div>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.4, ease }}
            className="absolute -right-3 top-6 z-10 sm:right-2"
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-2 rounded-2xl bg-green px-4 py-3 text-white shadow-[0_18px_36px_-16px_rgb(31_169_122_/_0.55)] ring-1 ring-white/30"
            >
              <Heart className="size-4 fill-white" aria-hidden />
              <div className="leading-tight">
                <p className="text-sm font-extrabold">15% donado</p>
                <p className="text-[11px] text-white/85">en cada recarga</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.6, ease }}
            className="absolute -left-3 bottom-8 z-10 sm:bottom-10 sm:left-0"
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, 9, 0] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.8,
              }}
              className="flex items-center gap-2 rounded-2xl bg-yellow px-4 py-3 text-foreground shadow-[0_18px_36px_-16px_rgb(240_180_41_/_0.55)] ring-1 ring-white/40"
            >
              <Sparkles className="size-4" aria-hidden />
              <div className="leading-tight">
                <p className="text-sm font-extrabold">Fundación</p>
                <p className="text-[11px] text-foreground/75">
                  El Vendedor de Sueños
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
