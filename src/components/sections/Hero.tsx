"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  Droplets,
  MapPin,
  ShieldCheck,
  Star,
  Wrench,
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
  { href: "/productos?categoria=filtracion", label: "Filtros" },
  { href: "/productos?categoria=dispensadores", label: "Dispensadores" },
  { href: "/#alcalina", label: "Agua Alcalina" },
] as const;

const benefits = [
  {
    icon: Wrench,
    title: "Equipos y maquinaria",
    text: "Filtros, purificadores y sistemas para hogar y empresa.",
  },
  {
    icon: Droplets,
    title: "Agua de calidad",
    text: "Nuestros equipos trabajan el agua para un resultado premium.",
  },
  {
    icon: ShieldCheck,
    title: "Tecnología confiable",
    text: "Soluciones con ozono, filtración y agua ilimitada a la red.",
  },
] as const;

const showcaseProducts = [
  {
    id: "purificador-01",
    name: "Purificador de agua",
    tag: "Modelo 01",
    image: "/products/purificador-de-agua/purificado-de-agua-01.png",
  },
  {
    id: "purificador-02",
    name: "Purificador de agua",
    tag: "Modelo 02",
    image: "/products/purificador-de-agua/purificado-de-agua-02.png",
  },
  {
    id: "purificador-03",
    name: "Purificador de agua",
    tag: "Modelo 03",
    image: "/products/purificador-de-agua/purificado-de-agua-03.png",
  },
  {
    id: "purificador-04",
    name: "Purificador de agua",
    tag: "Modelo 04",
    image: "/products/purificador-de-agua/purificado-de-agua-04.png",
  },
] as const;

export default function Hero() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % showcaseProducts.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [reduce]);

  const activeProduct = showcaseProducts[active];

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-[#041a2e] py-16 sm:py-20 lg:flex lg:min-h-[min(88dvh,820px)] lg:flex-col lg:justify-center lg:py-16"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image
          src="/images/hero-kitchen-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 55% 65% at 8% 15%, rgb(0 153 221 / 0.32), transparent 55%),
            radial-gradient(ellipse 50% 55% at 100% 90%, rgb(31 169 122 / 0.2), transparent 50%),
            linear-gradient(105deg, rgb(4 26 46 / 0.94) 0%, rgb(4 26 46 / 0.86) 38%, rgb(4 26 46 / 0.62) 68%, rgb(0 86 163 / 0.55) 100%),
            linear-gradient(180deg, rgb(4 26 46 / 0.55) 0%, rgb(4 26 46 / 0.25) 35%, rgb(4 26 46 / 0.6) 100%)
          `,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent"
      />

      <Container className="relative grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-10">
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
                Tecnología · Salud · Agua pura
              </p>
            </div>
          </motion.div>

          <motion.h1
            id="hero-heading"
            variants={fadeUp}
            className="mt-7 text-[2.65rem] font-extrabold leading-[1.05] tracking-[-0.035em] text-white sm:mt-8 sm:text-5xl lg:text-[3.5rem]"
          >
            Tecnologías de
            <span className="mt-1 block text-brand-accent">
              agua alcalina.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-[38ch] text-[1.05rem] leading-relaxed text-white/75"
          >
            Filtros, purificadores y sistemas de agua ilimitada. El agua sigue
            siendo el centro: nuestras máquinas la tratan, alcalinizan y
            protegen tu hogar.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link
              href="/productos?categoria=filtracion"
              className="group inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-green px-6 text-[15px] font-bold text-white shadow-[0_20px_44px_-18px_rgb(31_169_122_/_0.55)] transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#189866] active:scale-[0.98]"
            >
              Ver equipos
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

          <motion.ul
            variants={fadeUp}
            className="mt-10 grid grid-cols-1 gap-5 border-t border-white/15 pt-8 sm:grid-cols-3 sm:gap-6 lg:hidden"
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
        </motion.div>

        {/* Showcase de productos reales */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className="relative mx-auto flex h-[400px] w-full max-w-md flex-col gap-4 sm:h-[460px] lg:h-[560px] lg:max-w-none"
        >
          <div className="relative flex-1 overflow-hidden rounded-[1.75rem] bg-white/95 shadow-[0_28px_60px_-24px_rgb(0_0_0_/_0.5)] ring-1 ring-white/40 sm:rounded-[2rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProduct.id}
                initial={reduce ? false : { opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, ease }}
                className="absolute inset-0 p-6 sm:p-8 lg:p-10"
              >
                <div className="relative h-full w-full">
                  <Image
                    src={activeProduct.image}
                    alt={activeProduct.name}
                    fill
                    sizes="(max-width: 1024px) 420px, 480px"
                    className="object-contain"
                    priority
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            <span className="absolute left-4 top-4 z-10 inline-flex items-center rounded-full bg-brand/90 px-3 py-1 text-xs font-bold text-white backdrop-blur sm:left-5 sm:top-5">
              {activeProduct.tag}
            </span>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease }}
              className="absolute bottom-4 left-4 z-10 sm:bottom-5 sm:left-5"
            >
              <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-[0_14px_32px_-14px_rgb(0_0_0_/_0.4)] ring-1 ring-black/5 sm:px-4 sm:py-3">
                <div className="flex text-yellow">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className="size-3 fill-yellow sm:size-3.5"
                      aria-hidden
                    />
                  ))}
                </div>
                <div className="hidden leading-tight sm:block">
                  <p className="text-sm font-extrabold text-foreground">
                    4.9/5
                  </p>
                  <p className="text-[11px] text-neutral">Reseñas Google</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div
            role="tablist"
            aria-label="Seleccionar producto destacado"
            className="flex items-center justify-center gap-3"
          >
            {showcaseProducts.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-label={item.name}
                onClick={() => setActive(index)}
                className={`relative shrink-0 overflow-hidden rounded-xl bg-white/95 p-2 shadow-[0_10px_24px_-12px_rgb(0_0_0_/_0.45)] transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  index === active
                    ? "size-16 ring-2 ring-brand-accent sm:size-[4.5rem]"
                    : "size-14 opacity-70 ring-1 ring-white/30 hover:opacity-100 sm:size-16"
                }`}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="72px"
                    className="object-contain"
                  />
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </Container>

      <Container className="relative mt-14 hidden lg:mt-20 lg:block">
        <motion.ul
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease }}
          className="grid grid-cols-3 gap-8 border-t border-white/15 pt-8"
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
