"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Droplets,
  Factory,
  Recycle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  X,
  ZoomIn,
} from "lucide-react";
import Container from "@/components/ui/Container";

const processDiagram = {
  src: "/images/procesos/proceso-envasado.jpg",
  alt: "Diagrama del proceso de purificación y envasado Agua Ser Plus: desde fuentes naturales hasta el envasado final",
} as const;

const processSteps = [
  {
    n: "01",
    title: "Fuentes naturales",
    text: "Napas subterráneas y vertientes seleccionadas para iniciar el ciclo.",
  },
  {
    n: "02",
    title: "Filtro rápido",
    text: "Retiene partículas en suspensión antes de los tratamientos siguientes.",
  },
  {
    n: "03",
    title: "Ablandador",
    text: "Elimina sales perjudiciales y equilibra el perfil mineral del agua.",
  },
  {
    n: "04",
    title: "Filtro de carbón activo",
    text: "Elimina sabores y olores desagradables para un agua limpia.",
  },
  {
    n: "05",
    title: "Ósmosis inversa",
    text: "Remueve sólidos disueltos, sodio y microorganismos como virus y bacterias.",
  },
  {
    n: "06",
    title: "Filtro 20 micras",
    text: "Retiene sólidos, arenas y sedimentos en una primera etapa fina.",
  },
  {
    n: "07",
    title: "Filtro 5 micras",
    text: "Afinamiento adicional: más retención de sedimentos y partículas.",
  },
  {
    n: "08",
    title: "Esterilizador UV",
    text: "Tratamiento ultravioleta para eliminar microorganismos residuales.",
  },
  {
    n: "09",
    title: "Ionizador de plata",
    text: "Asegura un efecto bactericida residual hasta el envasado.",
  },
  {
    n: "10",
    title: "Envasado",
    text: "El agua lista se envasa en nuestros bidones PET listos para tu hogar.",
  },
] as const;

const packagingPoints = [
  {
    icon: ShieldCheck,
    title: "Material PET",
    text: "Todos nuestros envases son de material PET. Producto libre de partículas cancerígenas y BPA.",
  },
  {
    icon: RefreshCw,
    title: "Larga duración",
    text: "Son de larga duración. Como sustituto del vidrio, este envase puede reutilizarse hasta 25 veces conservando todas sus propiedades. Los azules de policarbonato se reutilizan +50 veces.",
  },
  {
    icon: Sparkles,
    title: "Transparentes",
    text: "Completamente transparentes. No utilizamos ningún tipo de teñido o pigmento contaminante.",
  },
  {
    icon: Recycle,
    title: "100% reciclable",
    text: "Una vez reutilizado, vuelve al ciclo productivo como materia prima.",
  },
] as const;

const downloads = [
  {
    title: "Resolución sanitaria",
    href: "/pdfs/RESOLUCION-SANITARIA-AGUA-SER.pdf",
    logo: "/images/certificaciones/logo-minsal.png",
    logoAlt: "Ministerio de Salud, Gobierno de Chile",
  },
  {
    title: "Análisis de aguas y riles",
    href: "/pdfs/DICTUC-AGUA-SER.pdf",
    logo: "/images/certificaciones/logo-dictuc.png",
    logoAlt: "DICTUC — Ingeniería que transforma",
  },
] as const;

export default function NuestraPlantaView() {
  const reduce = useReducedMotion();
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#041a2e] text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 55% 60% at 10% 20%, rgb(0 153 221 / 0.32), transparent 55%),
              radial-gradient(ellipse 45% 50% at 90% 80%, rgb(31 169 122 / 0.2), transparent 50%)
            `,
          }}
        />
        <Container className="relative py-16 sm:py-20 lg:py-24">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            className="max-w-3xl"
          >
            <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-brand-accent uppercase">
              <Factory className="size-3.5" aria-hidden />
              Agua Ser Plus
            </p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
              Nuestra Planta
            </h1>
            <p className="mt-5 max-w-[42ch] text-base leading-relaxed text-white/75 sm:text-lg">
              Así purificamos y envasamos el agua que llega a tu hogar: un
              proceso controlado, etapa por etapa, hasta el bidón.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#procesos"
                className="inline-flex h-12 items-center rounded-2xl bg-brand-accent px-5 text-sm font-bold text-[#041a2e] transition hover:bg-[#33b0e6]"
              >
                Ver procesos
              </a>
              <a
                href="#envases"
                className="inline-flex h-12 items-center rounded-2xl border border-white/20 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Nuestros envases
              </a>
              <a
                href="#certificaciones"
                className="inline-flex h-12 items-center rounded-2xl border border-white/20 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Certificaciones
              </a>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Procesos */}
      <section
        id="procesos"
        aria-labelledby="procesos-heading"
        className="scroll-mt-20 bg-surface sm:scroll-mt-24"
      >
        <Container className="py-14 lg:py-16">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55 }}
            className="max-w-2xl"
          >
            <p className="text-xs font-bold tracking-[0.18em] text-brand-accent uppercase">
              Proceso de envasado
            </p>
            <h2
              id="procesos-heading"
              className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
            >
              Del manantial al bidón
            </h2>
            <p className="mt-3 text-base leading-relaxed text-neutral">
              Diez etapas de filtrado, tratamiento y esterilización aseguran un
              agua pura, lista para envasar.
            </p>
          </motion.div>

          <motion.button
            type="button"
            onClick={() => setLightbox(true)}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="group relative mt-8 block w-full overflow-hidden rounded-3xl bg-white text-left shadow-soft ring-1 ring-brand/10 transition hover:ring-brand/25 focus-visible:outline-none"
          >
            <div className="relative aspect-[4/3] w-full bg-white sm:aspect-[16/9] lg:aspect-[2/1]">
              <Image
                src={processDiagram.src}
                alt={processDiagram.alt}
                fill
                className="object-contain p-3 transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.02] sm:p-6"
                sizes="(max-width: 1400px) 100vw, 1400px"
                priority
              />
            </div>
            <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-brand/90 px-3 py-1.5 text-xs font-bold text-white backdrop-blur transition group-hover:bg-brand sm:right-4 sm:bottom-4">
              <ZoomIn className="size-3.5" aria-hidden />
              Ampliar
            </span>
          </motion.button>

          <ol className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((step, i) => (
              <motion.li
                key={step.n}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: reduce ? 0 : i * 0.04 }}
                className="min-w-0"
              >
                <p className="font-mono text-xs font-bold tracking-wide text-brand-accent">
                  {step.n}
                </p>
                <h3 className="mt-1 text-sm font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-neutral">
                  {step.text}
                </p>
              </motion.li>
            ))}
          </ol>

          {/* Certificaciones / descargas */}
          <motion.div
            id="certificaciones"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5 }}
            className="mt-12 scroll-mt-24"
          >
            <p className="text-xs font-bold tracking-[0.18em] text-brand-accent uppercase">
              Documentación oficial
            </p>
            <h3 className="mt-2 text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
              Resoluciones y análisis
            </h3>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {downloads.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-[104px] items-center justify-between gap-4 bg-white px-5 py-5 shadow-[0_1px_0_rgb(12_45_74_/_0.04)] ring-1 ring-brand/8 transition hover:-translate-y-0.5 hover:shadow-lift hover:ring-brand/20 sm:px-7 sm:py-6"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-extrabold tracking-wide text-brand uppercase sm:text-[15px]">
                      {item.title}
                    </span>
                    <span className="mt-1.5 block text-[11px] font-semibold tracking-[0.08em] text-neutral/80 uppercase transition group-hover:text-brand-accent">
                      Click para descargar
                    </span>
                  </span>
                  <span className="relative h-14 w-[4.25rem] shrink-0 sm:h-16 sm:w-[4.75rem]">
                    <Image
                      src={item.logo}
                      alt={item.logoAlt}
                      fill
                      className="object-contain object-right"
                      sizes="76px"
                    />
                  </span>
                </a>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Envases */}
      <section
        id="envases"
        aria-labelledby="envases-heading"
        className="scroll-mt-20 bg-background sm:scroll-mt-24"
      >
        <Container className="py-14 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-4"
            >
              <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-green uppercase">
                <Droplets className="size-3.5" aria-hidden />
                Sostenibilidad
              </p>
              <h2
                id="envases-heading"
                className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
              >
                Nuestros Envases
              </h2>
              <p className="mt-4 text-base leading-relaxed text-neutral">
                Diseñados para reutilizar, cuidar el producto y reducir el
                impacto: PET de calidad, transparentes y reciclables.
              </p>
              <Link
                href="/productos"
                className="mt-8 inline-flex h-12 items-center gap-2 rounded-2xl bg-brand px-5 text-sm font-bold text-white transition hover:bg-brand-secondary"
              >
                Ver productos
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </motion.div>

            <div className="lg:col-span-8">
              <ul className="divide-y divide-brand/10 border-y border-brand/10">
                {packagingPoints.map((point, i) => {
                  const Icon = point.icon;
                  return (
                    <motion.li
                      key={point.title}
                      initial={reduce ? false : { opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.35 }}
                      transition={{
                        duration: 0.45,
                        delay: reduce ? 0 : i * 0.06,
                      }}
                      className="flex gap-4 py-6 sm:gap-5 sm:py-7"
                    >
                      <span className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-2xl bg-green-soft text-green">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-foreground">
                          {point.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-neutral sm:text-base">
                          {point.text}
                        </p>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {lightbox ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={processDiagram.alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#041a2e]/85 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 flex size-11 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
            aria-label="Cerrar imagen"
          >
            <X className="size-5" aria-hidden />
          </button>
          <div
            className="relative aspect-[4/3] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-white/20 sm:aspect-[16/9]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={processDiagram.src}
              alt={processDiagram.alt}
              fill
              sizes="95vw"
              className="object-contain p-3 sm:p-6"
              priority
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
