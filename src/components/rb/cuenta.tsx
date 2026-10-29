"use client";

import { useSyncExternalStore } from "react";
import { Flecha, boton } from "./base";
import { INICIO } from "@/lib/rb";
import { programa } from "@/lib/programa";

const reloj = {
  suscribir(avisar: () => void) {
    const t = setInterval(avisar, 1000);
    return () => clearInterval(t);
  },
  ahora: () => Math.floor(Date.now() / 1000),
  servidor: () => null,
};

const dos = (n: number) => String(n).padStart(2, "0");
const UNIDADES = ["días", "horas", "minutos", "segundos"];

/* Archivo .ics para agendar los tres días (14:00 a 23:00 de Buenos Aires) */
function agendar() {
  const primero = programa.dias[0].fecha.replaceAll("-", "");
  const ultimo = programa.dias[programa.dias.length - 1].fecha;
  const fin = new Date(`${ultimo}T23:00:00-03:00`).toISOString().replace(/[-:]|\.\d{3}/g, "");
  const cuerpo = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ritmo Blanco//ES",
    "BEGIN:VEVENT",
    "UID:ritmoblanco-2026",
    `DTSTART:${primero}T170000Z`,
    `DTEND:${fin}`,
    "SUMMARY:Ritmo Blanco · Festival silencioso",
    `LOCATION:${programa.sede}`,
    "DESCRIPTION:14 al 16 de noviembre. Tres canales\\, cero parlantes.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([cuerpo], { type: "text/calendar" }));
  a.download = "ritmo-blanco.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/* Cuenta regresiva: solo las cifras, sin contenedores, separadas por dos puntos */
export function Cuenta() {
  const ahora = useSyncExternalStore(reloj.suscribir, reloj.ahora, reloj.servidor);
  const resto = ahora === null ? null : Math.max(0, new Date(INICIO).getTime() / 1000 - ahora);
  const valores =
    resto === null
      ? ["––", "––", "––", "––"]
      : [Math.floor(resto / 86400), Math.floor((resto % 86400) / 3600), Math.floor((resto % 3600) / 60), Math.floor(resto % 60)].map(dos);

  return (
    // Sin fondo propio: el río (components/rio.tsx) pasa por detrás
    <section id="cuenta" aria-labelledby="cuenta-titulo" className="relative text-center">
      <div className="contenido py-[clamp(4rem,7vw,6.5rem)]">
        <p className="rotulo">Festival silencioso · {programa.sede.split(",")[0]}</p>
        <h2 id="cuenta-titulo" className="t-1 mx-auto mt-5 max-w-[17ch]">
          El bosque se pone los auriculares
        </h2>
        {resto !== null && (
          <p className="sr-solo">
            Faltan {Number(valores[0])} días, {Number(valores[1])} horas y {Number(valores[2])} minutos.
          </p>
        )}
        <ol aria-hidden className="mx-auto mt-[clamp(2.5rem,5vw,4rem)] grid max-w-[60rem] grid-cols-4">
          {valores.map((v, i) => (
            <li key={UNIDADES[i]} className={`relative flex flex-col items-center ${i > 0 ? "before:absolute before:top-[8%] before:left-0 before:h-[62%] before:w-px before:bg-rosa" : ""}`}>
              <span className="t-cifra">{v}</span>
              <span className="rotulo mt-4 text-[0.625rem] sm:text-[0.75rem]">{UNIDADES[i]}</span>
            </li>
          ))}
        </ol>
        <div className="mt-[clamp(2.5rem,5vw,4rem)] flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <span className="t-3">14 nov · 14:00 h</span>
          <button type="button" onClick={agendar} className={boton("vino")}>
            Agregar al calendario
            <Flecha />
          </button>
        </div>
      </div>
    </section>
  );
}
