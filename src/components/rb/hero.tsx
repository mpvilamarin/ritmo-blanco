"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { BoldLight, Guino, Marca } from "../sistema";
import { Flecha, boton } from "./base";
import { programa } from "@/lib/programa";
import { FECHAS } from "@/lib/rb";
import { iniciarArenaViva } from "@/lib/arena-viva";
import { generarGranos, ondular } from "@/lib/chladni";
import { alternarMovimiento, estaQuieto, useQuieto } from "@/lib/movimiento";

const MENU = [
  ["#programa", "Programa"],
  ["#lineup", "Artistas"],
  ["#mapa", "Mapa"],
  ["#desde-casa", "Desde casa"],
] as const;

/* "En vivo" solo mientras transmitimos: cada jornada de 14 a 23 (Buenos Aires) */
const JORNADAS = programa.dias.map((d) => [Date.parse(`${d.fecha}T14:00:00-03:00`), Date.parse(`${d.fecha}T23:00:00-03:00`)]);
const vivo = {
  suscribir(avisar: () => void) {
    const t = setInterval(avisar, 60_000);
    return () => clearInterval(t);
  },
  ahora: () => JORNADAS.some(([desde, hasta]) => Date.now() >= desde && Date.now() < hasta),
  servidor: () => false,
};

/*
  Barra fina: logo a la izquierda (vuelve al inicio), menú al centro y
  "Reservá" siempre a mano. Queda pegada arriba: se esconde al bajar y vuelve
  al subir. En el celular el menú se abre a pantalla completa con "Menú".
*/
export function Cabecera() {
  const [abierto, setAbierto] = useState(false);
  const [oculta, setOculta] = useState(false);
  const enVivo = useSyncExternalStore(vivo.suscribir, vivo.ahora, vivo.servidor);
  const botonMenu = useRef<HTMLButtonElement>(null);
  const lista = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let antes = window.scrollY;
    const alScrollear = () => {
      const y = window.scrollY;
      if (Math.abs(y - antes) < 8) return;
      setOculta(y > antes && y > 120);
      antes = y;
    };
    window.addEventListener("scroll", alScrollear, { passive: true });
    return () => window.removeEventListener("scroll", alScrollear);
  }, []);

  // Menú abierto: el foco entra al panel y Escape lo cierra
  useEffect(() => {
    if (!abierto) return;
    lista.current?.querySelector("a")?.focus();
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setAbierto(false);
      botonMenu.current?.focus();
    };
    document.addEventListener("keydown", alTeclear);
    return () => document.removeEventListener("keydown", alTeclear);
  }, [abierto]);

  return (
    <header
      data-oculta={(oculta && !abierto) || undefined}
      className="rb-cabecera sticky top-0 z-40 border-b border-vino/20 bg-blanco text-vino"
    >
      <nav aria-label="Principal" className="grid grid-cols-[1fr_auto] items-center gap-3 px-[var(--margen)] py-3 sm:gap-6 lg:grid-cols-[1fr_auto_1fr]">
        <a href="#top" aria-label="Ritmo Blanco, inicio" className="flex min-h-11 items-center justify-self-start">
          <Marca tinta="vino" className="w-20 lg:w-24" />
        </a>
        <ul
          ref={lista}
          id="menu-links"
          className={`${abierto ? "flex" : "hidden"} absolute inset-x-0 top-full h-[calc(100dvh-100%)] flex-col overflow-y-auto bg-blanco px-[var(--margen)] py-4 lg:static lg:flex lg:h-auto lg:flex-row lg:gap-10 lg:overflow-visible lg:bg-transparent lg:p-0`}
        >
          {MENU.map(([href, t]) => (
            <li key={href}>
              <a
                href={href}
                onClick={() => setAbierto(false)}
                className="tx-rotulo flex min-h-14 items-center border-b border-vino/20 py-3 text-base underline-offset-[6px] hover:underline lg:min-h-11 lg:border-0 lg:py-0 lg:text-[length:var(--tx-rotulo)]"
              >
                {t}
              </a>
            </li>
          ))}
          <li className="mt-6 lg:hidden">
            <a href="#reserva" onClick={() => setAbierto(false)} className={`${boton("vino")} w-full`}>
              Reservá tus auriculares
              <Flecha />
            </a>
          </li>
        </ul>
        <div className="flex items-center gap-3 justify-self-end sm:gap-6">
          {enVivo && (
            <a href="#desde-casa" className="tx-rotulo hidden min-h-11 items-center gap-2 underline-offset-[6px] hover:underline sm:flex">
              <span aria-hidden className="relative flex size-2">
                <span className="rb-pulso absolute inset-0 rounded-full bg-rosa" />
                <span className="relative size-2 rounded-full bg-vino" />
              </span>
              En vivo
            </a>
          )}
          <a href="#reserva" className={`${boton("vino")} max-lg:px-3.5 max-lg:py-2.5`}>
            Reservá
          </a>
          <button
            ref={botonMenu}
            type="button"
            aria-expanded={abierto}
            aria-controls="menu-links"
            onClick={() => setAbierto(!abierto)}
            className="tx-rotulo flex min-h-11 cursor-pointer items-center gap-2 lg:hidden"
          >
            <span aria-hidden className="flex w-4 flex-col gap-[3px]">
              <span className={`h-px bg-current transition-transform ${abierto ? "translate-y-[2px] rotate-45" : ""}`} />
              <span className={`h-px bg-current transition-transform ${abierto ? "-translate-y-[2px] -rotate-45" : ""}`} />
            </span>
            {abierto ? "Cerrar" : "Menú"}
          </button>
        </div>
      </nav>
    </header>
  );
}

/*
  Key visual: el cable entra desde el borde izquierdo y de la punta del plug sale la arena,
  que se asienta en la figura de Chladni y después cambia de canal en canal.
  Con movimiento reducido la figura aparece ya armada.
*/
function KeyVisual() {
  const lienzo = useRef<HTMLCanvasElement>(null);
  const cable = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (!lienzo.current) return;
    return iniciarArenaViva(lienzo.current, {
      perfil: "pulso",
      perfiles: ["pulso", "sinte", "tumbao"],
      semilla: 1411,
      particulas: 32000,
      tintas: ["--color-vino", "--color-magenta", "--color-rosa"],
      centro: [0.55, 0.5],
      pausado: estaQuieto,
      reposo: 5000,
      transicion: 2200,
      generarPatron: (total, semilla, perfil, aspecto) => ondular(generarGranos(total, semilla, perfil, undefined, aspecto * 1.15)),
      entrada: {
        duracion: 3600,
        // La punta del plug, en coordenadas del lienzo. El cable está reflejado:
        // la punta (3 % del ancho en el JPG) queda a la derecha, mirando al patrón
        origen: () => {
          const c = cable.current?.getBoundingClientRect();
          const l = lienzo.current!.getBoundingClientRect();
          if (!c?.width) return null;
          return [c.right - l.left - c.width * 0.032, c.top - l.top + c.height * 0.79];
        },
      },
    });
  }, []);
  return (
    <div aria-hidden className="rb-kv">
      <canvas ref={lienzo} className="rb-kv-arena" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={cable} src="/fotos/kv-cable.jpg" alt="" width={1480} height={400} fetchPriority="high" className="rb-kv-cable" />
    </div>
  );
}

/* Botón de pausa global: frena la arena y el carrusel de toda la página */
export function BotonMovimiento({ className = "" }: { className?: string }) {
  const quieto = useQuieto();
  return (
    <button type="button" aria-pressed={quieto} onClick={alternarMovimiento} className={`cursor-pointer motion-reduce:hidden ${className}`}>
      {quieto ? "Activar movimiento" : "Pausar movimiento"}
    </button>
  );
}

/* La trama entra en el borde tipográfico y se pierde antes de la sección siguiente. */
export function Hero() {
  return (
    <section id="top" aria-label="Portada" className="relative isolate z-[1] flex min-h-[calc(100svh-4.25rem)] flex-col overflow-hidden bg-blanco text-vino">
      <KeyVisual />

      <div className="grilla relative z-10 flex-1 content-center py-8 lg:py-10">
        <div className="col-span-4 lg:col-span-7">
          <p className="rotulo flex items-center gap-3">
            <span aria-hidden className="h-px w-10 bg-vino" />
            Festival silencioso y sustentable · {programa.sede.split(",")[0]}
          </p>

          {/* 1 · Titular bold/light, lo más grande de la portada, con el guiño principal */}
          <div className="mt-6 w-full">
            <BoldLight
              as="h1"
              fuerte={
                <>
                  El festival más <Guino>ruidoso</Guino>
                </>
              }
              suave="que nunca vas a escuchar."
              max={120}
            />
          </div>

          {/* 2 · Fechas y datos: se leen, no compiten con el titular */}
          <p className="mt-[clamp(1.5rem,4svh,2.5rem)] flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="t-3">{FECHAS.lista}</span>
            <span className="rotulo">14 a 23 h · Entrada gratuita</span>
          </p>

          {/* 3 · Una sola acción */}
          <div className="mt-[clamp(1.75rem,4svh,2.5rem)] flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href="#reserva" className={`${boton("vino")} min-h-13 px-6 text-[0.8125rem]`}>
              Reservá tus auriculares
              <Flecha />
            </a>
            <a href="#programa" className="rotulo flex min-h-11 items-center underline underline-offset-[6px] hover:no-underline">
              Mirá el programa
            </a>
          </div>
          <BotonMovimiento className="t-chico mt-4 flex min-h-11 w-fit items-center underline underline-offset-4" />
        </div>
      </div>
    </section>
  );
}
