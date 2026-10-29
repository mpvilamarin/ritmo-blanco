"use client";

import { useSyncExternalStore } from "react";
import { boton } from "./base";
import { Logo } from "../signos";
import { FECHAS, INICIO } from "@/lib/rb";
import { sitio } from "@/lib/programa";

/* Pie: sponsors en una franja propia (mismo peso, un solo color) y el nombre gigante cortado */
export function Pie() {
  return (
    <footer className="overflow-hidden bg-vino text-blanco">
      <div className="contenido pt-16">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Logo tinta="blanco" className="h-auto w-[clamp(180px,20vw,260px)]" />
          <div className="flex flex-wrap gap-2">
            <a href="#reserva" className={boton("rosa")}>
              Reservá tu lugar
            </a>
            <a href="#desde-casa" className="rotulo inline-flex items-center justify-center border border-blanco px-5 py-3.5 text-[0.75rem] text-blanco transition-colors hover:bg-blanco hover:text-vino">
              Mirá desde casa
            </a>
          </div>
        </div>
        <div className="mt-12 grid gap-6 border-t border-blanco/30 pt-6 md:grid-cols-[10rem_1fr]">
          <p className="rotulo">Acompañan</p>
          <ul aria-label="Sponsors" className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {sitio.sponsors.map((s) => (
              <li key={s} className="t-3">
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-blanco/30 pt-6">
          <p className="rotulo">{FECHAS.larga} de 2026 · Festival silencioso y sustentable</p>
          <p className="rotulo text-lila">{sitio.credito}</p>
        </div>
      </div>
      <p aria-hidden className="mt-8 -mb-[0.22em] text-center font-display text-[17.5vw] leading-[0.8] font-black tracking-[-0.04em] whitespace-nowrap text-blanco/[0.08] uppercase">
        Ritmo Blanco
      </p>
    </footer>
  );
}

/* Barra fija abajo, aparece después de la portada. La lectura devuelve los
   días que faltan, o -1 mientras se ve la portada. */
const scroll = {
  suscribir(avisar: () => void) {
    window.addEventListener("scroll", avisar, { passive: true });
    return () => window.removeEventListener("scroll", avisar);
  },
  leer: () =>
    window.scrollY > window.innerHeight * 0.85 ? Math.max(0, Math.ceil((new Date(INICIO).getTime() - Date.now()) / 86400000)) : -1,
  servidor: () => -1,
};

export function BarraFlotante() {
  const dias = useSyncExternalStore(scroll.suscribir, scroll.leer, scroll.servidor);
  if (dias < 0) return null;
  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 bg-vino p-1 pl-4 whitespace-nowrap text-blanco">
      <span className="rotulo pr-2">{dias > 0 ? `Faltan ${dias} días` : "Ya empezó"}</span>
      <a href="#desde-casa" className="rotulo px-3 py-2.5 hover:bg-vino-oscuro">
        En vivo
      </a>
      <a href="#reserva" className={`${boton("rosa")} py-2.5`}>
        Reservá
      </a>
    </div>
  );
}
