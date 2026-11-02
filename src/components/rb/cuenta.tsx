"use client";

import { useSyncExternalStore } from "react";
import { Encabezado, boton } from "./base";
import { DIAS, FECHAS, INICIO, capital } from "@/lib/rb";
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

/* Archivo .ics para agendar todas las jornadas (14:00 a 23:00 de Buenos Aires) */
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
    `DESCRIPTION:${FECHAS.larga}. Tres canales\\, cero parlantes.`,
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

/*
  Cuenta regresiva, centrada: qué se cuenta (título bold/light y bajada), las
  cuatro cifras en blanco con su unidad en rosa, y "Agendalo" debajo. Las
  cifras tienen ancho fijo, así el segundero no mueve nada.
*/
export function Cuenta() {
  const ahora = useSyncExternalStore(reloj.suscribir, reloj.ahora, reloj.servidor);
  const resto = ahora === null ? null : Math.max(0, new Date(INICIO).getTime() / 1000 - ahora);
  const valores =
    resto === null
      ? ["––", "––", "––", "––"]
      : [Math.floor(resto / 86400), Math.floor((resto % 86400) / 3600), Math.floor((resto % 3600) / 60), Math.floor(resto % 60)].map(dos);

  return (
    <section id="cuenta" aria-labelledby="cuenta-titulo" className="compacta bg-vino text-blanco">
      <div className="contenido rb-cuenta">
        <Encabezado
          id="cuenta-titulo"
          rotulo="Cuenta regresiva"
          titulo={["Nos vemos", "en el bosque"]}
          texto={
            <p>
              Arranca el {DIAS[0].fecha} a las 14 h en los {programa.sede.split(",")[0]}. {capital(FECHAS.dias)}, entrada gratuita.
            </p>
          }
          claro
          apilado
          centrado
        />
        <div role="timer" aria-label={resto === null ? "Cargando cuenta regresiva" : `Faltan ${valores[0]} días, ${valores[1]} horas y ${valores[2]} minutos`}>
          <ol aria-hidden className="rb-cuenta-cifras">
            {valores.map((v, i) => (
              <li key={UNIDADES[i]}>
                <span className="t-cifra">{v}</span>
                <span className="rotulo text-rosa">{UNIDADES[i]}</span>
              </li>
            ))}
          </ol>
        </div>
        <button type="button" onClick={agendar} className={boton("claro")}>
          Agendalo en tu calendario
        </button>
      </div>
    </section>
  );
}
