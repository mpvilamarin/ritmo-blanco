import type { CSSProperties, ReactNode } from "react";
import { PALETA } from "@/lib/rb";
import { BoldLight } from "../sistema";

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
      style={{ background: `linear-gradient(140deg, ${PALETA.violeta} 0%, ${PALETA.lila} 38%, ${PALETA.rosa} 70%, ${PALETA.melocoton} 100%)`, ...style }}
    >
      <span className="rotulo bg-blanco/85 px-2 py-1 text-center text-vino">{texto}</span>
    </div>
  );
}

/* Encabezado compartido con ancho de lectura limitado. */
export function Encabezado({
  id,
  rotulo,
  titulo,
  texto,
  centrado = false,
  claro = false,
  apilado = false,
}: {
  id: string;
  rotulo: string;
  titulo: [ReactNode, ReactNode];
  texto?: ReactNode;
  centrado?: boolean;
  claro?: boolean;
  /** En una sola columna, para cuando el encabezado comparte la fila con una imagen */
  apilado?: boolean;
}) {
  return (
    <header className={`encabezado ${apilado || centrado ? "encabezado-apilado" : ""} ${centrado ? "encabezado-centrado" : ""}`}>
      <p className={`rotulo ${claro ? "text-lila-palido" : ""}`}>{rotulo}</p>
      <BoldLight id={id} fuerte={titulo[0]} suave={titulo[1]} className={centrado ? "[&>span]:mx-auto" : ""} />
      {texto && <div className="bajada">{texto}</div>}
    </header>
  );
}

const BOTON = {
  vino: "bg-vino text-blanco hover:bg-vino-oscuro",
  claro: "bg-blanco text-vino hover:bg-crudo",
  borde: "border border-vino text-vino hover:bg-vino hover:text-blanco",
  bordeClaro: "border border-blanco text-blanco hover:bg-blanco hover:text-vino",
};
export const boton = (tono: keyof typeof BOTON = "vino") =>
  `rotulo inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 px-5 py-3 transition-colors ${BOTON[tono]}`;

export function Flecha({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" aria-hidden className={className}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

/* Íconos de trazo (mapa y sustentabilidad); sin ondas ni hojas: fuera del sistema */
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
  auriculares: "M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3",
  pisadas:
    "M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0zM20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0zM16 17h4M4 13h4",
};

export function Icono({ d, className = "size-5", grosor = 2.25 }: { d: string; className?: string; grosor?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d={d} />
    </svg>
  );
}
