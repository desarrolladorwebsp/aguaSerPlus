"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Atom,
  HeartPulse,
  Droplets,
  Shield,
  Zap,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import Container from "@/components/ui/Container";

const ease = [0.32, 0.72, 0, 1] as const;

const benefits = [
  {
    icon: Droplets,
    title: "pH Equilibrado",
    description: "Un pH alcalino de 8-9 ayuda a neutralizar la acidez del cuerpo y mantener el equilibrio natural.",
  },
  {
    icon: Zap,
    title: "Antioxidantes Naturales",
    description: "Contiene iones negativos que actúan como antioxidantes, protegiendo tus células del estrés oxidativo.",
  },
  {
    icon: HeartPulse,
    title: "Mejora la Hidratación",
    description: "Moléculas de agua más pequeñas que se absorben más fácilmente en tu cuerpo.",
  },
  {
    icon: Shield,
    title: "Desinfección con Ozono",
    description: "Proceso de purificación avanzado que elimina bacterias y microorganismos dañinos.",
  },
  {
    icon: BarChart3,
    title: "Energía y Vitalidad",
    description: "Mejora los niveles de energía y reduce la fatiga gracias a una mejor oxigenación celular.",
  },
  {
    icon: Atom,
    title: "Digestión Mejorada",
    description: "Ayuda a regular el pH del tracto digestivo, facilitando una mejor absorción de nutrientes.",
  },
];

export default function AguaAlcalinaPromo() {
  const reduce = useReducedMotion();

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#041a2e] py-16 sm:py-20 lg:flex lg:min-h-[min(88dvh,820px)] lg:flex-col lg:justify-center lg:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 55% 65% at 8% 15%, rgb(31 169 122 / 0.35), transparent 55%),
              radial-gradient(ellipse 50% 55% at 100% 90%, rgb(0 153 221 / 0.25), transparent 50%),
              linear-gradient(105deg, rgb(10 42 60 / 0.95) 0%, rgb(10 42 60 / 0.88) 38%, rgb(31 169 122 / 0.65) 68%, rgb(31 169 122 / 0.55) 100%),
              linear-gradient(180deg, rgb(10 42 60 / 0.65) 0%, rgb(31 169 122 / 0.35) 35%, rgb(31 169 122 / 0.7) 100%)
            `,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green/50 to-transparent"
        />

        <Container>
          <div className="relative grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-10">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-6 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green px-3 py-1 text-xs font-bold text-white">
                  🇨🇱 Únicos en Chile
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
                Agua Alcalina <span className="text-green">Pura</span>
              </h1>
              <p className="text-lg text-white/80 mb-10 leading-relaxed max-w-xl">
                Somos los <span className="font-semibold text-white">únicos en Chile</span> que ofrecemos agua alcalina ionizada con tecnología de punta, desinfección con ozono y un pH científicamente equilibrado para tu salud.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link
                  href="/productos?buscar=alcalina"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green to-brand-accent px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_-16px_rgb(31_169_122_/_0.45)] transition duration-500 hover:shadow-[0_20px_44px_-14px_rgb(31_169_122_/_0.55)]"
                >
                  Ver Dispensadores
                  <ArrowRight
                    className="size-4 transition group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
                <Link
                  href="/#ayuda"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
                >
                  Consultar
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative mx-auto flex w-full max-w-md flex-col lg:max-w-none"
            >
              <div className="relative overflow-hidden rounded-3xl bg-white/10 shadow-[0_28px_60px_-24px_rgb(0_0_0_/_0.5)] ring-1 ring-white/20 backdrop-blur-sm p-4">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-white/5">
                  <Image
                    src="/products/hero-jug-splash.png"
                    alt="Agua Alcalina Agua Ser Plus"
                    fill
                    className="object-cover object-center"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Beneficios */}
      <section className="relative scroll-mt-20 overflow-y-visible bg-white py-16 sm:scroll-mt-24 sm:py-20 lg:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 45% 50% at 100% 0%, rgb(31 169 122 / 0.08), transparent 55%),
              radial-gradient(ellipse 40% 40% at 0% 100%, rgb(0 153 221 / 0.06), transparent 50%)
            `,
          }}
        />

        <Container>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45, ease }}
            className="mb-12 flex flex-col gap-3 sm:mb-14"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green/15 px-3 py-1 text-xs font-bold text-green w-fit">
              ✨ Ventajas Científicas
            </span>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Beneficios del Agua Alcalina
              </h2>
              <p className="mt-3 max-w-2xl text-base text-neutral">
                Descubre cómo el agua alcalina ionizada de Agua Ser Plus transforma tu salud desde adentro.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 border border-brand/8 shadow-[0_4px_16px_-4px_rgb(12_45_74_/_0.1)] hover:shadow-[0_16px_40px_-8px_rgb(31_169_122_/_0.15)] transition-all duration-300"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-green/20 to-brand-accent/10 group-hover:from-green/30 group-hover:to-brand-accent/20 transition-all">
                  <benefit.icon className="size-6 text-green group-hover:text-brand-accent transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-green transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-sm text-neutral leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Comparativa */}
      <section className="relative scroll-mt-20 overflow-y-visible bg-gradient-to-b from-foreground/2 to-white py-16 sm:scroll-mt-24 sm:py-20 lg:py-28">
        <Container>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45, ease }}
            className="mb-12 flex flex-col gap-3 sm:mb-14"
          >
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Comparativa
              </h2>
              <p className="mt-3 max-w-2xl text-base text-neutral">
                Entiende las diferencias clave entre agua normal y agua alcalina.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="overflow-x-auto"
          >
            <table className="w-full bg-white rounded-2xl shadow-[0_4px_16px_-4px_rgb(12_45_74_/_0.1)] overflow-hidden border border-brand/8">
              <thead className="bg-foreground text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold">Característica</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Agua de la Llave</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Agua Alcalina Ser Plus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand/8">
                <tr className="hover:bg-green/5 transition">
                  <td className="px-6 py-4 font-semibold text-foreground text-sm">Nivel de pH</td>
                  <td className="px-6 py-4 text-neutral text-sm">6.5 - 7 (Neutra)</td>
                  <td className="px-6 py-4 text-green font-semibold text-sm">8.5 - 9.5 (Alcalina)</td>
                </tr>
                <tr className="hover:bg-green/5 transition">
                  <td className="px-6 py-4 font-semibold text-foreground text-sm">Filtración</td>
                  <td className="px-6 py-4 text-neutral text-sm">Básica o inexistente</td>
                  <td className="px-6 py-4 text-green font-semibold text-sm">Avanzada con Ozono</td>
                </tr>
                <tr className="hover:bg-green/5 transition">
                  <td className="px-6 py-4 font-semibold text-foreground text-sm">Antioxidantes</td>
                  <td className="px-6 py-4 text-neutral text-sm">Ninguno</td>
                  <td className="px-6 py-4 text-green font-semibold text-sm">Iones negativos</td>
                </tr>
                <tr className="hover:bg-green/5 transition">
                  <td className="px-6 py-4 font-semibold text-foreground text-sm">Absorción</td>
                  <td className="px-6 py-4 text-neutral text-sm">Menor</td>
                  <td className="px-6 py-4 text-green font-semibold text-sm">Superior</td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        </Container>
      </section>

      {/* CTA Final */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-brand via-brand-secondary to-green py-16 sm:py-20 lg:py-28">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        <Container>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative text-center max-w-2xl mx-auto"
          >
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6">
              ¿Listo para cambiar tu agua?
            </h2>
            <p className="text-lg text-white/90 mb-10">
              Únete a miles de chilenos que ya disfrutan de los beneficios del agua alcalina pura de Agua Ser Plus.
            </p>
            <div className="flex gap-3 flex-wrap justify-center">
              <Link
                href="/productos?buscar=alcalina"
                className="group inline-flex items-center gap-2 rounded-full bg-white text-brand px-5 py-3 font-semibold shadow-[0_16px_36px_-16px_rgb(12_45_74_/_0.45)] hover:shadow-[0_20px_44px_-14px_rgb(12_45_74_/_0.55)] transition"
              >
                Comprar Ahora
                <ArrowRight
                  className="size-4 transition group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
              <Link
                href="/#ayuda"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
              >
                Obtener Asesoría
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </>
  );
}
