import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Contenedor centrado: ancho completo hasta el tope,
 * con márgenes iguales a izquierda y derecha.
 */
export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div
      className={`mx-auto box-border w-full max-w-[var(--aguaser-page-max)] px-4 sm:px-6 lg:px-10 xl:px-14 ${className}`.trim()}
    >
      {children}
    </div>
  );
}
