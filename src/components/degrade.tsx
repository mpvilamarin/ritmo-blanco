"use client";

import { useEffect } from "react";

/*
  Degradé difuso con grano: el fondo de toda la página.
  En el impreso es un recorrido continuo que atraviesa los paneles; acá
  acompaña el scroll. Arriba domina el frío (lila, azul gris) y hacia el
  final, el cálido (rosa, melocotón, crema). Las capas son claras a propósito:
  el texto vino tiene que pasar 4.5:1 sobre cualquier punto.
*/
export function Degrade() {
  useEffect(() => {
    const raiz = document.documentElement;
    let pendiente = false;
    const actualizar = () => {
      pendiente = false;
      const total = raiz.scrollHeight - window.innerHeight;
      raiz.style.setProperty("--p", total > 0 ? (window.scrollY / total).toFixed(4) : "0");
    };
    const alScrollear = () => {
      if (!pendiente) {
        pendiente = true;
        requestAnimationFrame(actualizar);
      }
    };
    actualizar();
    window.addEventListener("scroll", alScrollear, { passive: true });
    window.addEventListener("resize", alScrollear);
    return () => {
      window.removeEventListener("scroll", alScrollear);
      window.removeEventListener("resize", alScrollear);
    };
  }, []);

  return (
    <div aria-hidden className="degrade pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="capa capa-frio" />
      <div className="capa capa-lila" />
      <div className="capa capa-rosa" />
      <div className="capa capa-durazno" />
      <div className="capa capa-crema" />
      <div className="grano" />
    </div>
  );
}
