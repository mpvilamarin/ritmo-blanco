"use client";

import { useSyncExternalStore } from "react";
import { programa, sitio } from "@/lib/programa";

const INICIO = new Date(`${programa.dias[0].fecha}T14:00:00-03:00`).getTime();
const FIN = new Date(`${programa.dias[programa.dias.length - 1].fecha}T23:00:00-03:00`).getTime();

// Reloj compartido: un tic por segundo
const segundos = {
  suscribir(avisar: () => void) {
    const t = setInterval(avisar, 1000);
    return () => clearInterval(t);
  },
  ahora: () => Math.floor(Date.now() / 1000),
  servidor: () => null,
};

const dos = (n: number) => String(n).padStart(2, "0");

/* Cuenta regresiva al primer día, 14:00 en Buenos Aires */
export function Cuenta() {
  const ahora = useSyncExternalStore(segundos.suscribir, segundos.ahora, segundos.servidor);
  const t = sitio.cuenta;

  if (ahora !== null && ahora * 1000 >= FIN) {
    return <p className="font-display text-3xl font-bold uppercase md:text-5xl">{t.despues}</p>;
  }
  if (ahora !== null && ahora * 1000 >= INICIO) {
    return <p className="font-display text-3xl font-bold uppercase md:text-5xl">{t.durante}</p>;
  }

  const resto = ahora === null ? null : Math.max(0, Math.floor(INICIO / 1000) - ahora);
  const valores =
    resto === null
      ? ["––", "––", "––", "––"]
      : [
          String(Math.floor(resto / 86400)),
          dos(Math.floor((resto % 86400) / 3600)),
          dos(Math.floor((resto % 3600) / 60)),
          dos(resto % 60),
        ];

  return (
    <div>
      <p className="rotulo mb-3">{t.rotulo}</p>
      {resto !== null && (
        <p className="sr-solo">
          Faltan {valores[0]} días y {Number(valores[1])} horas para el festival.
        </p>
      )}
      <ol aria-hidden className="flex items-start gap-3 lg:gap-5">
        {valores.map((v, i) => (
          <li key={t.unidades[i]} className="flex items-start gap-3 lg:gap-5">
            {i > 0 && <span className="font-display text-4xl leading-none font-light text-lila lg:text-6xl">:</span>}
            <span className="flex flex-col items-center">
              <span className="font-display text-4xl leading-none font-bold tabular-nums lg:text-6xl">{v}</span>
              <span className="mt-2 h-px w-full bg-vino" />
              <span className="rotulo mt-2">{t.unidades[i]}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
