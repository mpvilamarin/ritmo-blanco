"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

/*
  Piezas del sistema (BRIEF.md §6), compartidas por todas las secciones.
*/

/* Recuadro rosa sólido: marca la frase del guiño. Uno solo por pantalla. */
export function Guino({ children }: { children: ReactNode }) {
  return <mark className="inline-block bg-rosa px-[0.12em] pt-[0.04em] text-vino [box-decoration-break:clone]">{children}</mark>;
}

/*
  Título bold/light: dos líneas del mismo ancho óptico, la primera en bold y
  la segunda en light. Mide las dos líneas y les da a cada una el cuerpo que
  la lleva al ancho del contenedor (con un tope). Sin JS se ven con el cuerpo
  de la clase que reciba.
*/
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
  const caja = useRef<HTMLHeadingElement>(null);
  const a = useRef<HTMLSpanElement>(null);
  const b = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = caja.current;
    const l1 = a.current;
    const l2 = b.current;
    if (!el || !l1 || !l2) return;
    const ajustar = () => {
      const ancho = el.clientWidth;
      if (!ancho) return;
      l1.style.fontSize = l2.style.fontSize = "100px";
      const w1 = l1.getBoundingClientRect().width;
      const w2 = l2.getBoundingClientRect().width;
      // Las dos líneas al mismo ancho; si alguna pasa el tope, achica las dos
      const k = Math.min(1, max / Math.max((ancho / w1) * 100, (ancho / w2) * 100));
      l1.style.fontSize = `${(ancho / w1) * 100 * k}px`;
      l2.style.fontSize = `${(ancho / w2) * 100 * k}px`;
    };
    ajustar();
    document.fonts?.ready.then(ajustar);
    const ro = new ResizeObserver(ajustar);
    ro.observe(el);
    return () => ro.disconnect();
  }, [max]);

  return (
    <Tag ref={caja} id={id} className={`font-display leading-[var(--lh-apretado)] uppercase ${className}`}>
      <span ref={a} className="block w-fit font-black tracking-[-0.03em] whitespace-nowrap">
        {fuerte}
      </span>
      <span className="sr-solo"> </span>
      <span ref={b} className="mt-[0.06em] block w-fit font-light tracking-[-0.02em] whitespace-nowrap">
        {suave}
      </span>
    </Tag>
  );
}

/* Logo real (public/marca). Vino sobre claro, blanco sobre foto u oscuro. */
export function Marca({ tinta = "vino", className = "" }: { tinta?: "vino" | "blanco"; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/marca/logo-${tinta}.png`} alt="Ritmo Blanco" width={498} height={235} className={`block h-auto ${className}`} />
  );
}
