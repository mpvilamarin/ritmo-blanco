import type { CSSProperties, ReactNode } from "react";
import { PALETA } from "@/lib/rb";

/*
  Piezas comunes: lugar para foto, encabezado de sección y botón.
  Contenedores rectos: el único redondo es el círculo de las fotos de artistas.
*/

export function Foto({
  circulo = false,
  texto = "[FOTO]",
  className = "",
  style,
}: {
  circulo?: boolean;
  texto?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      role="img"
      aria-label={`Foto pendiente: ${texto}`}
      className={`con-grano relative flex items-center justify-center overflow-hidden ${circulo ? "rounded-full" : ""} ${className}`}
      style={{ background: `linear-gradient(140deg, ${PALETA.lilaOscuro} 0%, ${PALETA.lila} 38%, ${PALETA.rosa} 70%, ${PALETA.melocoton} 100%)`, ...style }}
    >
      <span className="rotulo bg-blanco/85 px-2 py-1 text-center text-[0.625rem] text-vino">{texto}</span>
    </div>
  );
}

/*
  Encabezado de sección, siempre en una sola columna: rótulo chico, título y
  debajo la bajada. Nunca título y texto lado a lado.
*/
export function Encabezado({
  id,
  rotulo,
  titulo,
  texto,
  centrado = false,
  claro = false,
}: {
  id: string;
  rotulo: string;
  titulo: ReactNode;
  texto?: ReactNode;
  centrado?: boolean;
  claro?: boolean;
}) {
  return (
    <header className={`flex flex-col ${centrado ? "items-center text-center" : ""}`}>
      <p className={`rotulo mb-4 ${claro ? "text-rosa" : ""}`}>{rotulo}</p>
      <h2 id={id} className="t-1">
        {titulo}
      </h2>
      {texto && <div className="mt-6 font-mono text-[clamp(1.0625rem,1.6vw,1.375rem)] leading-[1.55]">{texto}</div>}
    </header>
  );
}

const BOTON = {
  vino: "bg-vino text-blanco hover:bg-vino-oscuro",
  claro: "bg-blanco text-vino hover:bg-crema",
  rosa: "bg-rosa text-vino hover:bg-blanco",
  borde: "border border-vino text-vino hover:bg-vino hover:text-blanco",
};
export const boton = (tono: keyof typeof BOTON = "vino") =>
  `rotulo inline-flex cursor-pointer items-center justify-center gap-2 px-5 py-3.5 text-[0.75rem] transition-colors ${BOTON[tono]}`;

export function Flecha({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" aria-hidden className={className}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

/* Íconos de trazo para el mapa (sin auriculares, ondas ni hojas: fuera del sistema) */
export const ICONOS = {
  carpa: "M3.5 21 14 3M20.5 21 10 3M15.5 21 12 15l-3.5 6M2 21h20",
  rayo: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
  pantalla: "M4 3h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8 21h8M12 17v4",
  reciclar:
    "M7 19H4.8a1.8 1.8 0 0 1-1.6-.9 1.8 1.8 0 0 1 0-1.8L7.2 9.5M11 19h8.2a1.8 1.8 0 0 0 1.6-.9 1.8 1.8 0 0 0 0-1.8l-1.2-2.1M14 16l-3 3 3 3M8.3 13.6 7.2 9.5 3.1 10.6M9.3 5.8l1.1-1.9A1.8 1.8 0 0 1 12 3a1.8 1.8 0 0 1 1.5.9l3.9 6.8M13.4 9.6l4.1 1.1 1.1-4.1",
  acceso: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3",
  bici: "M5.5 14a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zM18.5 14a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zM15 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM12 17.5V14l-3-3 4-3 2 3h2",
  gota: "M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z",
  compost: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z",
  mas: "M12 5v14M5 12h14",
  punto: "M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16zM12 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4z",
};

export function Icono({ d, className = "size-5", grosor = 2.25 }: { d: string; className?: string; grosor?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d={d} />
    </svg>
  );
}
