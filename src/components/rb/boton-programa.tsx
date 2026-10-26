"use client";

import type { ReactNode } from "react";
import { irAlPrograma, type EstadoPrograma } from "@/lib/estado-programa";

/* Botón que deja el programa filtrado y baja hasta él */
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
    <button type="button" onClick={() => irAlPrograma(filtro)} className={className}>
      {children}
    </button>
  );
}
