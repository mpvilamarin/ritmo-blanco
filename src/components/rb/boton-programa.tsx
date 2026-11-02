"use client";

import type { ReactNode } from "react";
import { irAlPrograma, type EstadoPrograma } from "@/lib/estado-programa";

/* Link al programa: deja los filtros puestos y baja hasta él. Sin JS, igual llega por el ancla. */
export function BotonPrograma({
  filtro,
  className,
  children,
}: {
  filtro: Partial<EstadoPrograma>;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href="#programa"
      onClick={(e) => {
        e.preventDefault();
        irAlPrograma(filtro);
      }}
      className={className}
    >
      {children}
    </a>
  );
}
