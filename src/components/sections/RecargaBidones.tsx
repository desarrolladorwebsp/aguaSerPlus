"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BadgeCheck, Droplets, ShieldCheck } from "lucide-react";
import { company } from "@/lib/company";
import Container from "@/components/ui/Container";

const pillars = [
  {
    icon: Droplets,
    label: "100% purificada",
  },
  {
    icon: ShieldCheck,
    label: "Alta pureza",
  },
  {
    icon: BadgeCheck,
    label: "Libre de sodio",
  },
] as const;

export default function RecargaBidones() {
  const reduce = useReducedMotion();

  return (
    <section
      id="recargas"
      aria-labelledby="recargas-heading"
      className="relative scroll-mt-20 overflow-hidden bg-brand sm:scroll-mt-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 55% 70% at 100% 20%, rgb(0 153 221 / 0.35), transparent 55%),
            radial-gradient(ellipse 45% 55% at 0% 90%, rgb(31 169 122 / 0.28), transparent 50%)
          `,
        }}
      />

      <Container className="relative flex w-full flex-col gap-10 py-16 lg:flex-row lg:items-center lg:gap-12 lg:py-20">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: [0.32, 0.72, 0, 1] }}
          className="w-full min-w-0 lg:flex-1"
        >
          <p className="text-sm font-semibold tracking-[0.18em] text-yellow uppercase">
            Recargas
          </p>

          <h2
            id="recargas-heading"
            className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
          >
            Recarga tus bidones
          </h2>

          <p className="mt-4 max-w-[34ch] text-base leading-relaxed text-white/80 sm:text-lg">
            Elige agua 100% purificada, de alta pureza, libre de sodio y de
            calidad certificada.
          </p>

          <ul className="mt-8 flex flex-wrap gap-3">
            {pillars.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-sm font-semibold text-white ring-1 ring-white/15"
              >
                <Icon className="size-4 text-yellow" strokeWidth={1.75} aria-hidden />
                {label}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={company.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-13 items-center justify-center gap-2.5 rounded-2xl bg-green px-6 text-[15px] font-bold text-white shadow-[0_18px_40px_-16px_rgb(0_0_0_/_0.35)] transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#189866] active:scale-[0.98]"
            >
              Recargar por WhatsApp
              <span className="flex size-8 items-center justify-center rounded-xl bg-white/15 transition group-hover:translate-x-0.5">
                <ArrowRight className="size-4" aria-hidden />
              </span>
            </a>
            <a
              href="#ofertas"
              className="inline-flex h-13 items-center justify-center gap-2 rounded-2xl bg-white/10 px-6 text-[15px] font-bold text-white ring-1 ring-white/20 transition hover:bg-white/15"
            >
              Ver ofertas
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
          className="relative w-full min-w-0 lg:flex-1"
        >
          <div className="rounded-[2rem] bg-white/10 p-2 ring-1 ring-white/15">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem] bg-white sm:aspect-square lg:aspect-[5/4]">
              <Image
                src="/products/hero-jug-splash.png"
                alt="Bidón Agua Ser Plus para recarga"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-contain object-center p-6 sm:p-10"
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
        </motion.div>
      </Container>
    </section>
  );
}
