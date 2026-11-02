"use client";

import type { CSSProperties, ReactNode } from "react";
import { LOGO_PUNTO, LOGO_TRAZOS, LOGO_VIEWBOX } from "@/lib/logo";

/*
  Piezas del sistema (BRIEF.md §6), compartidas por todas las secciones.
*/

/* Recuadro rosa sólido: marca la frase del guiño. Uno solo por pantalla. */
export function Guino({ children }: { children: ReactNode }) {
  return <mark className="inline-block bg-rosa px-[0.12em] pt-[0.04em] text-vino [box-decoration-break:clone]">{children}</mark>;
}

/* Dos pesos reales, un solo cuerpo y cortes naturales sin mediciones de JS. */
export function BoldLight({
  id,
  fuerte,
  suave,
  as: Tag = "h2",
  max = 200,
  className = "",
}: {
  id?: string;
  fuerte: ReactNode;
  suave: ReactNode;
  as?: "h1" | "h2" | "h3" | "p";
  /** Cuerpo máximo en px de cualquiera de las dos líneas */
  max?: number;
  className?: string;
}) {
  return (
    <Tag id={id} style={{ "--titulo-max": `${max}px` } as CSSProperties} className={`rb-titulo font-display uppercase ${className}`}>
      <span className="block font-black tracking-[-0.03em]">{fuerte}</span>
      <span className="sr-solo"> </span>
      <span className="mt-[0.06em] block font-normal tracking-[-0.02em]">{suave}</span>
    </Tag>
  );
}

/* Logo vectorial (public/marca/logo.svg). Vino sobre claro, blanco sobre foto u oscuro. */
export function Marca({ tinta = "vino", className = "" }: { tinta?: "vino" | "blanco"; className?: string }) {
  return (
    <svg viewBox={LOGO_VIEWBOX} role="img" aria-label="Ritmo Blanco" fill="currentColor" className={`block h-auto ${tinta === "vino" ? "text-vino" : "text-blanco"} ${className}`}>
      {LOGO_TRAZOS.map((d) => (
        <path key={d.slice(0, 16)} d={d} />
      ))}
      <ellipse {...LOGO_PUNTO} />
    </svg>
  );
}
