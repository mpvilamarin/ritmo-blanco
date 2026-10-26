"use client";

import { useSyncExternalStore } from "react";
import { programa, sitio } from "@/lib/programa";

const INICIO = new Date(`${programa.dias[0].fecha}T14:00:00-03:00`).getTime();
const FIN = new Date(`${programa.dias[programa.dias.length - 1].fecha}T23:00:00-03:00`).getTime();

const reloj = {
  suscribir(avisar: () => void) {
    const t = setInterval(avisar, 1000);
    return () => clearInterval(t);
  },
  ahora: () => Math.floor(Date.now() / 1000),
  servidor: () => null,
};

const dos = (n: number) => String(n).padStart(2, "0");

/* Cuenta regresiva grande y centrada, sobre vino noche */
export function CuentaGrande() {
  const ahora = useSyncExternalStore(reloj.suscribir, reloj.ahora, reloj.servidor);
  const t = sitio.cuenta;

  if (ahora !== null && ahora * 1000 >= INICIO) {
    return (
      <p className="font-display text-3xl font-bold uppercase md:text-5xl">
        {ahora * 1000 >= FIN ? t.despues : t.durante}
      </p>
    );
  }

  const resto = ahora === null ? null : Math.max(0, Math.floor(INICIO / 1000) - ahora);
  const valores =
    resto === null
      ? ["––", "––", "––", "––"]
      : [
          dos(Math.floor(resto / 86400)),
          dos(Math.floor((resto % 86400) / 3600)),
          dos(Math.floor((resto % 3600) / 60)),
          dos(resto % 60),
        ];

  return (
    <div>
      {resto !== null && (
        <p className="sr-solo">
          Faltan {Number(valores[0])} días y {Number(valores[1])} horas para el festival.
        </p>
      )}
      <ol aria-hidden className="flex items-start justify-center">
        {valores.map((v, i) => (
          <li key={t.unidades[i]} className="flex items-start">
            {i > 0 && (
              <span className="px-2 font-display text-4xl leading-none text-rosa md:px-5 md:text-7xl">:</span>
            )}
            <span className="flex min-w-[3.6rem] flex-col items-center md:min-w-[7rem]">
              <span className="font-display text-5xl leading-none font-bold tabular-nums md:text-8xl">{v}</span>
              <span className="mt-3 h-px w-8 bg-blanco/30" />
              <span className="rotulo mt-2 text-lila">{t.unidades[i]}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
