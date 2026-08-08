"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Atom,
  Droplets,
  Gem,
  HeartPulse,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Container from "@/components/ui/Container";
import { useCart } from "@/lib/cart/store";
import { catalogProducts } from "@/lib/products";
import { formatClp } from "@/types/product";

const benefits = [
  {
    icon: Atom,
    title: "pH alcalino equilibrado",
    text: "Agua con pH elevado, pensada para quienes buscan una hidratación más limpia y moderna.",
  },
  {
    icon: Droplets,
    title: "Sabor suave y puro",
    text: "Perfil limpio, sin residuales. Ideal para beber a diario en casa u oficina.",
  },
  {
    icon: HeartPulse,
    title: "Hidratación premium",
    text: "Una alternativa superior al agua convencional, con foco en calidad y bienestar.",
  },
  {
    icon: ShieldCheck,
    title: "Proceso controlado",
    text: "Seleccionada y distribuida por Agua Ser Plus con el mismo estándar de confianza de siempre.",
  },
] as const;

const alkalineProduct = catalogProducts.find((p) => p.id === "agua-alcalina-20l");

export default function AguaAlcalina() {
  const reduce = useReducedMotion();
  const { addItem } = useCart();

  const handleAdd = () => {
    if (!alkalineProduct) return;
    addItem({
      productId: alkalineProduct.id,
      name: alkalineProduct.name,
      image: alkalineProduct.image,
      price: alkalineProduct.priceNow,
      qty: 1,
    });
  };

  return (
    <section
      id="alcalina"
      aria-labelledby="alcalina-heading"
      className="relative scroll-mt-20 overflow-hidden bg-[#041a2e] text-white sm:scroll-mt-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 70% at 0% 20%, rgb(0 153 221 / 0.28), transparent 55%),
            radial-gradient(ellipse 50% 55% at 100% 80%, rgb(31 169 122 / 0.22), transparent 50%),
            linear-gradient(180deg, rgb(12 45 74 / 0.4) 0%, transparent 35%)
          `,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-accent/60 to-transparent"
      />

      <Container className="relative py-16 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-14">
          {/* Copy */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, ease: [0.32, 0.72, 0, 1] }}
            className="min-w-0"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-yellow/35 bg-yellow/10 px-3.5 py-1.5 text-xs font-bold tracking-wide text-yellow uppercase">
              <Gem className="size-3.5" aria-hidden />
              Exclusivo en Chile
            </div>

            <h2
              id="alcalina-heading"
              className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[2.85rem] lg:leading-[1.08]"
            >
              Agua Alcalina
              <span className="mt-1 block text-brand-accent">
                solo con Agua Ser Plus
              </span>
            </h2>

            <p className="mt-4 max-w-[40ch] text-base leading-relaxed text-white/75 sm:text-lg">
              Estamos trayendo un producto que casi nadie ofrece en el país:
              <span className="font-semibold text-white">
                {" "}
                agua alcalina premium
              </span>
              . En Chile, esta línea la traemos nosotros — los dueños de Agua
              Ser Plus — para que puedas acceder a una hidratación distinta,
              exclusiva y de alto estándar.
            </p>

            <ul className="mt-6 flex flex-wrap gap-2.5">
              <li className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/90 ring-1 ring-white/12">
                <Sparkles className="size-3.5 text-yellow" aria-hidden />
                Lanzamiento exclusivo
              </li>
              <li className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/90 ring-1 ring-white/12">
                Distribución propia
              </li>
              <li className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1.5 text-xs font-semibold text-white/90 ring-1 ring-white/12">
                Stock limitado
              </li>
            </ul>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              {alkalineProduct ? (
                <button
                  type="button"
                  onClick={handleAdd}
                  className="group inline-flex h-13 items-center justify-center gap-2.5 rounded-2xl bg-green px-6 text-[15px] font-bold text-white shadow-[0_18px_40px_-16px_rgb(31_169_122_/_0.55)] transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#189866] active:scale-[0.98]"
                >
                  Agregar al carro · {formatClp(alkalineProduct.priceNow)}
                  <span className="flex size-8 items-center justify-center rounded-xl bg-white/15 transition group-hover:translate-x-0.5">
                    <ArrowRight className="size-4" aria-hidden />
                  </span>
                </button>
              ) : null}
              <Link
                href="/productos"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-2xl bg-white/8 px-6 text-[15px] font-bold text-white ring-1 ring-white/18 transition hover:bg-white/12"
              >
                Ver catálogo
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>

            <p className="mt-5 text-xs leading-relaxed text-white/45">
              Exclusividad de importación y distribución Agua Ser Plus en Chile.
              Disponibilidad sujeta a stock del lanzamiento.
            </p>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, delay: 0.08, ease: [0.32, 0.72, 0, 1] }}
            className="relative min-w-0"
          >
            <div className="rounded-[2rem] bg-gradient-to-b from-brand-accent/20 via-white/5 to-green/15 p-2 ring-1 ring-white/15">
              <div className="relative overflow-hidden rounded-[1.6rem] bg-[#0a2740]">
                <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[5/4]">
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,_rgb(0_153_221_/_0.35),_transparent_58%)]"
                  />
                  <motion.div
                    className="absolute inset-0"
                    animate={reduce ? undefined : { y: [0, -7, 0] }}
                    transition={{
                      duration: 6.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Image
                      src="/products/hero-jug-splash.png"
                      alt="Bidón Agua Alcalina Agua Ser Plus"
                      fill
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-contain object-center p-6 sm:p-10"
                    />
                  </motion.div>
                </div>

                <div className="border-t border-white/10 px-5 py-4 sm:px-6">
                  <p className="text-xs font-semibold tracking-wide text-yellow uppercase">
                    Producto exclusivo
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-white">
                    Agua Alcalina 20L
                  </p>
                  <p className="mt-1 text-sm text-white/60">
                    Solo disponible a través de Agua Ser Plus
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Benefits */}
        <motion.ul
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.32, 0.72, 0, 1] }}
          className="mt-14 grid grid-cols-1 gap-6 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
        >
          {benefits.map(({ icon: Icon, title, text }) => (
            <li key={title} className="min-w-0">
              <span className="flex size-10 items-center justify-center rounded-xl bg-white/8 text-brand-accent ring-1 ring-white/10">
                <Icon className="size-5" strokeWidth={1.7} aria-hidden />
              </span>
              <p className="mt-3 text-sm font-bold text-white">{title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                {text}
              </p>
            </li>
          ))}
        </motion.ul>
      </Container>
    </section>
  );
}
