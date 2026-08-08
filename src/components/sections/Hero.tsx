"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Leaf,
  MapPin,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { company } from "@/lib/company";
import Container from "@/components/ui/Container";

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
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

const categories = [
  { href: "/#alcalina", label: "Agua Alcalina" },
  { href: "/#recargas", label: "Recargas 20L" },
  { href: "/productos", label: "Productos" },
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
      className="relative isolate min-h-[min(92dvh,880px)] overflow-hidden"
    >
      <Image
        src="/images/hero-delivery-bidon.jpg"
        alt="Repartidor Agua Ser Plus cargando un bidón de agua 20 litros"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[68%_center] sm:object-[72%_center]"
      />

      {/* Lectura a la izquierda; foto protagonista a la derecha */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              105deg,
              rgb(4 26 46 / 0.92) 0%,
              rgb(4 26 46 / 0.78) 34%,
              rgb(4 26 46 / 0.42) 58%,
              rgb(4 26 46 / 0.18) 78%,
              rgb(4 26 46 / 0.28) 100%
            ),
            linear-gradient(
              180deg,
              rgb(4 26 46 / 0.25) 0%,
              transparent 28%,
              rgb(4 26 46 / 0.55) 100%
            )
          `,
        }}
      />

      <Container className="relative flex min-h-[min(92dvh,880px)] flex-col justify-end pt-16 pb-10 sm:justify-center sm:pt-20 sm:pb-14 lg:pb-16">
        <motion.div
          variants={stagger}
          initial={reduce ? false : "hidden"}
          animate="visible"
          className="w-full max-w-xl"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-4">
            <div className="relative size-[4.25rem] overflow-hidden rounded-full bg-white/95 shadow-[0_16px_40px_-18px_rgb(0_0_0_/_0.45)] ring-1 ring-white/40 sm:size-[4.75rem]">
              <Image
                src={company.logo.src}
                alt={company.logo.alt}
                width={company.logo.width}
                height={company.logo.height}
                priority
                className="h-full w-full object-contain p-1"
                sizes="76px"
              />
            </div>
            <div>
              <p className="text-base font-extrabold tracking-wide text-white sm:text-lg">
                Agua Ser{" "}
                <span className="font-semibold text-brand-accent">Plus</span>
              </p>
              <p className="mt-0.5 text-xs font-medium text-white/65 sm:text-sm">
                Salud · Economía · Reciclaje
              </p>
            </div>
          </motion.div>

          <motion.h1
            id="hero-heading"
            variants={fadeUp}
            className="mt-7 text-[2.65rem] font-extrabold leading-[1.05] tracking-[-0.035em] text-white sm:mt-8 sm:text-5xl lg:text-[3.5rem]"
          >
            El agua más pura,
            <span className="mt-1 block text-brand-accent">
              directo a tu puerta.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-[36ch] text-[1.05rem] leading-relaxed text-white/75"
          >
            Bidones, dispensadores y suscripciones para hogar y empresa en
            Santiago.
          </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link
                href="/productos"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-green px-6 text-[15px] font-bold text-white shadow-[0_20px_44px_-18px_rgb(31_169_122_/_0.55)] transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#189866] active:scale-[0.98]"
              >
                Ver productos
                <span className="flex size-9 items-center justify-center rounded-xl bg-white/15 transition group-hover:translate-x-0.5">
                  <ArrowRight className="size-4" aria-hidden />
                </span>
              </Link>
            </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/15 pt-6"
          >
            <span className="inline-flex items-center gap-1.5 text-sm text-white/70">
              <MapPin className="size-4 text-brand-accent" aria-hidden />
              Maipú · Santiago
            </span>
            <nav
              aria-label="Accesos rápidos"
              className="flex flex-wrap gap-x-4 gap-y-1"
            >
              {categories.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-semibold text-white underline-offset-4 transition hover:text-brand-accent hover:underline"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </motion.div>
        </motion.div>

        <motion.ul
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease }}
          className="mt-12 grid grid-cols-1 gap-5 border-t border-white/15 pt-8 sm:mt-14 sm:grid-cols-3 sm:gap-8"
        >
          {benefits.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-3">
              <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-accent ring-1 ring-white/15">
                <Icon className="size-5" strokeWidth={1.6} aria-hidden />
              </span>
              <div>
                <p className="text-sm font-bold text-white">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/65">
                  {text}
                </p>
              </div>
            </li>
          ))}
        </motion.ul>
      </Container>
    </section>
  );
}
