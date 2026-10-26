"use client";

import { useEffect, useRef, useState } from "react";
import { elegirCanal, useCanal } from "@/lib/estado";
import { CANALES, programa, type CanalId } from "@/lib/programa";
import { Logo, Signo } from "./signos";

const NOMBRE: Record<CanalId, string> = { tumbao: "Tumbao", pulso: "Pulso", sinte: "Sinte" };
export const nombreCanal = (c: CanalId) => NOMBRE[c];

/*
  Selector de canal: radio group con flechas. Tocar el canal elegido lo
  suelta y los tres vuelven a pesar lo mismo.
*/
export function SelectorCanal({ grande = false }: { grande?: boolean }) {
  const canal = useCanal();
  const botones = useRef<(HTMLButtonElement | null)[]>([]);
  const activo = canal ? CANALES.indexOf(canal) : 0;

  const teclas = (e: React.KeyboardEvent, i: number) => {
    const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!delta) return;
    e.preventDefault();
    const j = (i + delta + CANALES.length) % CANALES.length;
    elegirCanal(CANALES[j]);
    botones.current[j]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label="Elegí tu canal"
      className={
        grande
          ? "grid divide-y divide-vino border border-vino md:grid-cols-3 md:divide-x md:divide-y-0"
          : "grid grid-cols-3 gap-px bg-vino"
      }
    >
      {CANALES.map((c, i) => {
        const marcado = canal === c;
        return (
          <button
            key={c}
            ref={(b) => {
              botones.current[i] = b;
            }}
            type="button"
            role="radio"
            aria-checked={marcado}
            tabIndex={i === activo ? 0 : -1}
            onClick={() => elegirCanal(marcado ? null : c)}
            onKeyDown={(e) => teclas(e, i)}
            className={`flex items-center text-left transition-colors duration-200 ${
              marcado ? "bg-vino text-blanco" : `${grande ? "bg-transparent" : "bg-blanco"} text-vino hover:bg-rosa`
            } ${grande ? "gap-4 px-4 py-5 md:flex-col md:items-start md:py-6" : "justify-center gap-2 px-2 py-2.5"}`}
          >
            <Signo canal={c} className={grande ? "size-10 md:size-14" : "size-5"} />
            <span className="flex flex-col">
              <span className={grande ? "font-display text-3xl font-bold uppercase leading-none" : "rotulo"}>
                {NOMBRE[c]}
              </span>
              {grande && <span className="mt-1">{programa.canales[c]}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ¿Es la hora del cierre en un día del festival? (hora de Buenos Aires) */
function enElCierre() {
  const ahora = new Date();
  const fecha = ahora.toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" });
  const hora = ahora.toLocaleTimeString("en-GB", {
    timeZone: "America/Argentina/Buenos_Aires",
    hour: "2-digit",
    minute: "2-digit",
  });
  return programa.dias.some((d) => d.fecha === fecha) && hora >= "21:30" && hora < "23:00";
}

const SECCIONES = [
  ["#programa", "Programa"],
  ["#mapa", "Mapa"],
  ["#desde-casa", "Desde casa"],
  ["#rastro", "Sin rastro"],
  ["#info", "Info"],
] as const;

/*
  Barra fija: abajo en el celular (al alcance del pulgar), arriba en escritorio
  con el logo y la navegación.
*/
export function BarraCanal() {
  const canal = useCanal();
  const [cierre, setCierre] = useState(false);

  useEffect(() => {
    const revisar = () => setCierre(enElCierre());
    revisar();
    const t = setInterval(revisar, 60_000);
    return () => clearInterval(t);
  }, []);

  const estado = cierre
    ? "Ahora todo el parque escucha lo mismo"
    : canal
      ? `Escuchás ${NOMBRE[canal]}`
      : "Elegí tu canal";

  return (
    <nav
      aria-label="Canal y secciones"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-vino bg-blanco lg:top-0 lg:bottom-auto lg:border-t-0 lg:border-b"
    >
      <div className="mx-auto flex max-w-[80rem] flex-col gap-1.5 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:flex-row lg:items-center lg:gap-8 lg:px-12 lg:py-2">
        <a href="#inicio" className="hidden shrink-0 lg:block">
          <Logo className="h-9 w-auto" />
        </a>
        <ul className="hidden flex-1 gap-6 lg:flex">
          {SECCIONES.map(([href, texto]) => (
            <li key={href}>
              <a href={href} className="rotulo underline-offset-4 hover:underline">
                {texto}
              </a>
            </li>
          ))}
        </ul>
        <p className="rotulo flex justify-between lg:hidden" aria-live="polite">
          <span>{estado}</span>
          <a href="#programa" className="underline underline-offset-2">
            Programa
          </a>
        </p>
        <span className="rotulo hidden lg:block" aria-live="polite">
          {estado}
        </span>
        <div className="lg:w-[22rem]">
          <SelectorCanal />
        </div>
      </div>
    </nav>
  );
}
