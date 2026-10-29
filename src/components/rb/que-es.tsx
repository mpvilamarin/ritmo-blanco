import type { ReactNode } from "react";
import { Signo } from "../signos";
import { BoldLight, Guino } from "../sistema";
import { ACTIVIDADES, CANAL, DIAS, PALETA, SHOWS, tipoLindo, velo } from "@/lib/rb";
import { CANALES, TIPOS, programa } from "@/lib/programa";

const plural = (n: number, t: string) => `${n} ${t.toLowerCase()}${n === 1 ? "" : /[aeiou]$/.test(t.toLowerCase()) ? "s" : "es"}`;

/* Color de cada tipo de actividad para la barra proporcional */
/* Fondo de cada bloque: tonos de la paleta muy aclarados */
const FONDOS = [velo(PALETA.crema, 40), velo(PALETA.rosa, 20), velo(PALETA.lila, 20), velo(PALETA.melocoton, 40), velo(PALETA.azulgris, 15)];

const COLOR_TIPO = { TALLER: PALETA.melocoton, CHARLA: PALETA.azulgris, CLASE: PALETA.rosa, EXPERIENCIA: PALETA.vino };

/* Días: cada jornada con su fecha grande y su nombre en bold/light */
function GraficoDias() {
  return (
    <ul className="flex flex-col gap-4">
      {programa.dias.map((d) => (
        <li key={d.numero} className="flex flex-col items-center gap-1">
          <span className="font-display text-2xl leading-none font-black tabular-nums text-lila-oscuro">{d.fecha.slice(8)}.11</span>
          <span className="font-display text-base leading-none uppercase">
            <b className="font-black">{d.nombre[0]}</b> <span className="font-light">{d.nombre[1]}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/* Canales: los tres signos grandes, cada uno con su color y lo que suena */
function GraficoCanales() {
  return (
    <ul className="flex flex-col gap-2">
      {CANALES.map((c) => (
        <li key={c} className="flex flex-col items-center">
          <span className="grid size-9 place-items-center" style={{ background: CANAL[c].color, color: CANAL[c].tinta }}>
            <Signo canal={c} className="size-5" />
          </span>
          <span className="mt-1.5 font-display text-base leading-none font-black uppercase">{CANAL[c].nombre}</span>
          <span className="t-chico">{CANAL[c].que.toLowerCase()}</span>
        </li>
      ))}
    </ul>
  );
}

/* Artistas: un punto por artista, en el color de su canal; los cierres, más grandes y en vino */
function GraficoArtistas() {
  return (
    <div>
      <ul aria-hidden className="flex max-w-[13rem] flex-wrap items-center justify-center gap-1.5">
        {SHOWS.map((s) =>
          s.canal === "todos" ? (
            <li key={s.slug} className="grid size-7 place-items-center rounded-full bg-vino text-rosa">
              <Signo canal="sinte" className="size-3.5" />
            </li>
          ) : (
            <li key={s.slug} className="size-5 rounded-full" style={{ background: CANAL[s.canal].color }} />
          ),
        )}
      </ul>
      <p className="t-chico mt-3">
        {SHOWS.filter((s) => !s.cierre).length} sets, uno por canal, y {SHOWS.filter((s) => s.cierre).length} cierres a las 21:30 con los
        tres canales a la vez.
      </p>
    </div>
  );
}

/* Actividades: barra proporcional por tipo, con su cantidad */
function GraficoActividades() {
  const cuentas = TIPOS.map((t) => ({ t, n: ACTIVIDADES.filter((a) => a.tipo === t).length }));
  return (
    <div>
      <div aria-hidden className="flex h-10 w-full">
        {cuentas.map(({ t, n }) => (
          <span
            key={t}
            className="grid place-items-center font-display text-lg font-black"
            style={{ flex: n, background: COLOR_TIPO[t], color: t === "EXPERIENCIA" || t === "CHARLA" ? PALETA.blanco : PALETA.vino }}
          >
            {n}
          </span>
        ))}
      </div>
      <ul className="t-chico mt-3 grid justify-items-center gap-1">
        {cuentas.map(({ t, n }) => (
          <li key={t} className="flex items-center gap-2">
            <span aria-hidden className="size-2.5 shrink-0" style={{ background: COLOR_TIPO[t] }} />
            {plural(n, tipoLindo(t))}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Parlantes: el volumen máximo que recomienda la OMS frente al que llega al bosque */
function GraficoParlantes() {
  return (
    <div className="flex w-full flex-col gap-3">
      <div>
        <div className="flex justify-between">
          <span className="rotulo">Concierto · máx. OMS</span>
          <span className="rotulo">100 dB</span>
        </div>
        <div className="mt-1.5 h-3 w-full bg-lila-oscuro" />
      </div>
      <div>
        <div className="flex justify-between">
          <span className="rotulo">Afuera del festival</span>
          <span className="rotulo">silencio</span>
        </div>
        <div className="mt-1.5 h-3 w-full border border-dashed border-vino/40">
          <div className="h-full w-[3%] bg-rosa" />
        </div>
      </div>
      <p className="t-chico">La música suena solo en tus auriculares. El bosque sigue en calma.</p>
    </div>
  );
}

/*
  Qué es: rótulo, título bold/light a todo el ancho y bajada a todo el ancho,
  uno debajo del otro. Después las cifras: cada una con índice, número,
  nombre y un gráfico propio hecho con los datos del JSON.
*/
export function QueEs() {
  const cifras: { n: number; t: string; grafico: ReactNode }[] = [
    { n: DIAS.length, t: "Días", grafico: <GraficoDias /> },
    { n: CANALES.length, t: "Canales", grafico: <GraficoCanales /> },
    { n: SHOWS.length, t: "Artistas", grafico: <GraficoArtistas /> },
    { n: ACTIVIDADES.length, t: "Actividades", grafico: <GraficoActividades /> },
    { n: 0, t: "Parlantes", grafico: <GraficoParlantes /> },
  ];

  return (
    <section id="que-es" aria-label="Qué es Ritmo Blanco" className="banda contenido scroll-mt-4">
      <p className="rotulo mb-5">Qué es Ritmo Blanco</p>
      <BoldLight as="h2" fuerte="La música no se escucha," suave={<Guino>se lleva puesta.</Guino>} max={200} />
      <p className="mt-8 font-mono text-[clamp(1.0625rem,1.6vw,1.375rem)] leading-[1.55]">
        Ritmo Blanco es un festival silencioso: cada persona recibe auriculares y elige entre tres canales en vivo. Desde afuera, el bosque está
        en calma; adentro, miles bailan canciones distintas al mismo tiempo. Además de los shows hay talleres, charlas y clases, y la energía la
        genera el propio público.
      </p>

      {/* Cifras: cinco bloques de color pálido separados por aire (sin filetes), contenido centrado */}
      <dl className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {cifras.map((c, i) => (
          <div key={c.t} className="flex flex-col items-center px-5 py-8 text-center" style={{ background: FONDOS[i] }}>
            {/* Orden visual: índice, número + nombre, gráfico (en el DOM, dt antes que dd) */}
            <dt className="order-2 mt-3">
              <span className="t-cifra block text-[clamp(2.75rem,4vw,3.75rem)]">{c.n}</span>
              <span className="rotulo mt-2 block text-[0.75rem] font-semibold">{c.t}</span>
            </dt>
            <span aria-hidden className="rotulo order-1 text-lila-oscuro">
              0{i + 1}
            </span>
            <dd className="order-3 mt-6 flex w-full flex-col items-center">{c.grafico}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
