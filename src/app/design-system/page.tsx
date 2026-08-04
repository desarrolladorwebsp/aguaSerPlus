const palette = [
  {
    name: "brand",
    label: "Azul Principal",
    role: "Cultura / Fiabilidad",
    hex: "#0056A3",
    className: "bg-brand",
    textOn: "text-white",
  },
  {
    name: "brand-secondary",
    label: "Azul Secundario",
    role: "Agua Clara / Salud",
    hex: "#0077C8",
    className: "bg-brand-secondary",
    textOn: "text-white",
  },
  {
    name: "brand-accent",
    label: "Azul Acento",
    role: "Innovación",
    hex: "#0099DD",
    className: "bg-brand-accent",
    textOn: "text-white",
  },
  {
    name: "neutral",
    label: "Gris Neutral",
    role: "Estructura / Soporte",
    hex: "#A0AAB4",
    className: "bg-neutral",
    textOn: "text-brand",
  },
  {
    name: "background",
    label: "Blanco Fondo",
    role: "Limpieza",
    hex: "#FFFFFF",
    className: "bg-background border border-neutral/40",
    textOn: "text-brand",
  },
] as const;

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground md:px-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-14">
          <p className="mb-3 text-sm font-medium tracking-wide text-brand-secondary uppercase">
            AguaSer Plus · Identidad visual
          </p>
          <h1 className="mb-3 text-3xl font-semibold tracking-tight text-brand md:text-4xl">
            Propuesta 1: Equilibrio Corporal y Confianza
          </h1>
          <p className="max-w-2xl text-neutral">
            Paleta semántica integrada en Tailwind. Usa las clases{" "}
            <code className="rounded bg-neutral/20 px-1.5 py-0.5 font-mono text-sm text-brand">
              bg-brand
            </code>
            ,{" "}
            <code className="rounded bg-neutral/20 px-1.5 py-0.5 font-mono text-sm text-brand">
              text-brand-secondary
            </code>
            ,{" "}
            <code className="rounded bg-neutral/20 px-1.5 py-0.5 font-mono text-sm text-brand">
              border-brand-accent
            </code>
            , etc.
          </p>
        </header>

        <section className="mb-16">
          <h2 className="mb-6 text-lg font-semibold text-brand">
            Muestras de color
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {palette.map((color) => (
              <article
                key={color.name}
                className="overflow-hidden rounded-xl border border-neutral/30"
              >
                <div
                  className={`flex h-36 items-end p-4 ${color.className} ${color.textOn}`}
                >
                  <span className="font-mono text-sm opacity-90">
                    {color.hex}
                  </span>
                </div>
                <div className="bg-background p-4">
                  <p className="font-semibold text-brand">{color.label}</p>
                  <p className="text-sm text-neutral">{color.role}</p>
                  <p className="mt-2 font-mono text-xs text-brand-secondary">
                    {color.name}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-6 text-lg font-semibold text-brand">
            Combinaciones de texto
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-brand p-6 text-white">
              <p className="text-sm opacity-80">bg-brand + text-white</p>
              <p className="mt-2 text-xl font-semibold">
                Confianza y fiabilidad
              </p>
            </div>
            <div className="rounded-xl bg-brand-secondary p-6 text-white">
              <p className="text-sm opacity-80">
                bg-brand-secondary + text-white
              </p>
              <p className="mt-2 text-xl font-semibold">Agua clara y salud</p>
            </div>
            <div className="rounded-xl bg-brand-accent p-6 text-white">
              <p className="text-sm opacity-80">bg-brand-accent + text-white</p>
              <p className="mt-2 text-xl font-semibold">Innovación activa</p>
            </div>
            <div className="rounded-xl border border-neutral/40 bg-background p-6">
              <p className="text-sm text-neutral">
                bg-background + text-brand / text-neutral
              </p>
              <p className="mt-2 text-xl font-semibold text-brand">
                Limpieza y claridad
              </p>
              <p className="mt-1 text-neutral">
                Soporte estructural con gris neutral
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-lg font-semibold text-brand">
            Componentes de referencia
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-secondary"
            >
              Primario
            </button>
            <button
              type="button"
              className="rounded-lg bg-brand-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-secondary"
            >
              Acento
            </button>
            <button
              type="button"
              className="rounded-lg border border-neutral px-5 py-2.5 text-sm font-medium text-brand transition-colors hover:border-brand hover:bg-brand/5"
            >
              Secundario
            </button>
            <span className="rounded-full bg-brand-secondary/15 px-3 py-1 text-xs font-medium text-brand-secondary">
              Badge · brand-secondary
            </span>
            <a
              href="/"
              className="text-sm font-medium text-brand-accent underline-offset-4 hover:underline"
            >
              Volver al inicio
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
