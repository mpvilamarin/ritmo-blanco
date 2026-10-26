"use client";

import { useSyncExternalStore } from "react";
import { boton } from "./base";
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
    <section aria-labelledby="cuenta-titulo" className="banda contenido text-center">
      <p className="rotulo mb-4">Cuenta regresiva</p>
      <h2 id="cuenta-titulo" className="t-2">
        El bosque se pone los auriculares en
      </h2>
      {resto !== null && (
        <p className="sr-solo">
          Faltan {Number(valores[0])} días, {Number(valores[1])} horas y {Number(valores[2])} minutos.
        </p>
      )}
      <ol aria-hidden className="mt-10 flex items-start justify-center">
        {valores.map((v, i) => (
          <li key={UNIDADES[i]} className="flex items-start">
            {i > 0 && <span className="t-cifra px-[0.05em] text-rosa sm:px-[0.12em]">:</span>}
            <span className="flex flex-col items-center">
              <span className="t-cifra">{v}</span>
              <span className="rotulo mt-3 text-[0.5625rem] sm:text-[0.6875rem]">{UNIDADES[i]}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-vino/20 pt-8">
        <span className="t-3">Abre el 14.11 · 14:00 h</span>
        <button type="button" onClick={agendar} className={boton("borde")}>
          Agregar al calendario
        </button>
      </div>
    </section>
  );
}
