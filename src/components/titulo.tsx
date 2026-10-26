"use client";

import { useLayoutEffect, useRef } from "react";

type Props = {
  fuerte: React.ReactNode;
  suave: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "p";
  /** Cuerpo máximo en px, para que no crezca sin límite en pantallas anchas */
  max?: number;
  className?: string;
};

/*
  Regla bold/light: dos líneas del mismo ancho, la primera en bold y la
  segunda en light. Mide las dos líneas y ajusta el cuerpo de cada una.
  Sin JS (o antes de medir) se ve con el cuerpo de la clase que reciba.
*/
export function Titulo({ fuerte, suave, as: Tag = "h2", max = 140, className = "" }: Props) {
  const caja = useRef<HTMLHeadingElement>(null);
  const linea1 = useRef<HTMLSpanElement>(null);
  const linea2 = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = caja.current;
    const a = linea1.current;
    const b = linea2.current;
    if (!el || !a || !b) return;

    const ajustar = () => {
      const ancho = el.clientWidth;
      if (!ancho) return;
      a.style.fontSize = b.style.fontSize = "100px";
      const wa = a.getBoundingClientRect().width;
      const wb = b.getBoundingClientRect().width;
      let objetivo = ancho;
      const mayor = Math.max((objetivo / wa) * 100, (objetivo / wb) * 100);
      if (mayor > max) objetivo *= max / mayor;
      a.style.fontSize = `${(objetivo / wa) * 100}px`;
      b.style.fontSize = `${(objetivo / wb) * 100}px`;
    };

    ajustar();
    document.fonts?.ready.then(ajustar);
    const observador = new ResizeObserver(ajustar);
    observador.observe(el);
    return () => observador.disconnect();
  }, [fuerte, suave, max]);

  return (
    <Tag ref={caja} className={`font-display uppercase leading-[0.88] ${className}`}>
      <span ref={linea1} className="block w-fit whitespace-nowrap font-bold tracking-[-0.02em]">
        {fuerte}
      </span>
      <span className="sr-solo"> </span>
      <span ref={linea2} className="block w-fit whitespace-nowrap font-light tracking-[-0.01em]">
        {suave}
      </span>
    </Tag>
  );
}
