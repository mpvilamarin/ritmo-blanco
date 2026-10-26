import { Encabezado } from "./base";
import { TOTALES } from "@/lib/rb";

export function QueEs() {
  const datos = [
    [TOTALES.dias, "días"],
    [TOTALES.canales, "canales"],
    [TOTALES.artistas, "artistas"],
    [TOTALES.actividades, "actividades"],
    [0, "parlantes"],
  ] as const;
  return (
    <section id="que-es" aria-labelledby="que-es-titulo" className="banda contenido scroll-mt-4">
      <Encabezado
        id="que-es-titulo"
        rotulo="Qué es Ritmo Blanco"
        titulo={
          <>
            La música no se escucha, <mark className="bg-rosa px-[0.12em] text-vino">se lleva puesta</mark>
          </>
        }
        texto={
          <p>
            Ritmo Blanco es un festival silencioso: cada persona recibe auriculares y elige entre tres canales en vivo. Desde afuera, el
            bosque está en calma; adentro, miles bailan canciones distintas al mismo tiempo. Además de los shows hay talleres, charlas y
            clases, y la energía la genera el propio público.
          </p>
        }
      />
      {/* Datos en celdas de la grilla, separadas por filetes */}
      <dl className="mt-14 grid grid-cols-2 border-t border-vino sm:grid-cols-5">
        {datos.map(([n, t], i) => (
          <div
            key={t}
            className={`flex flex-col-reverse justify-end gap-2 border-b border-vino py-6 sm:border-b-0 ${i > 0 ? "sm:border-l sm:pl-6" : ""} ${i % 2 ? "pl-4 sm:pl-6" : ""}`}
          >
            <dt className="rotulo">{t}</dt>
            <dd className="t-1">{n}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
