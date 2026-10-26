import { Encabezado, Flecha, boton } from "./base";
import { BotonPrograma } from "./boton-programa";
import { Signo } from "../signos";
import { CANAL, TOTALES } from "@/lib/rb";
import { CANALES } from "@/lib/programa";

export function DesdeCasa() {
  return (
    <section id="desde-casa" aria-labelledby="casa-titulo" className="banda scroll-mt-4 bg-lila-oscuro text-blanco">
      <div className="contenido">
        <Encabezado
          id="casa-titulo"
          rotulo="En vivo desde casa"
          titulo="¿No llegás al bosque?"
          texto={
            <p>
              Transmitimos los tres canales en vivo, las charlas de la Pantalla Muda y clases pensadas para bailar en el living. Escuchás lo
              mismo que el público, al mismo tiempo.
            </p>
          }
        />
        <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-blanco/30 pt-6">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {["3 canales en vivo", "Charlas con preguntas", `${TOTALES.soloOnline} actividades solo online`].map((t) => (
              <li key={t} className="t-3">
                {t}
              </li>
            ))}
          </ul>
          <BotonPrograma filtro={{ vista: "actividades", modalidad: "virtual", tipo: null, zona: null }} className={boton("claro")}>
            Ver las actividades online
            <Flecha />
          </BotonPrograma>
        </div>
      </div>
    </section>
  );
}

const PASOS = [
  { t: "Reservá", d: "Elegí un día o el pase completo. El cupo es limitado para que el bosque respire." },
  { t: "Retirá tus auriculares", d: "En el acceso te damos auriculares inalámbricos, con tu DNI. Los devolvés a la salida." },
  { t: "Elegí tu canal", d: "Tumbao, Pulso o Sinte: cambiá cuando quieras. Nadie se ofende." },
  { t: "Movete y generá", d: "Pedaleá en las bicis generadoras o bailá sobre los pisos cinéticos: tu energía alimenta el festival." },
];

/* Cuatro pasos en celdas de la grilla, unidos por una línea punteada ondulada */
export function ComoFunciona() {
  return (
    <section id="como" aria-labelledby="como-titulo" className="banda contenido scroll-mt-4">
      <Encabezado id="como-titulo" rotulo="Cómo funciona · 4 pasos" titulo="Cero ruido, todo ritmo" />
      <div className="relative mt-12">
        <svg viewBox="0 0 1200 24" preserveAspectRatio="none" aria-hidden className="absolute top-[2.4rem] left-0 hidden h-6 w-full lg:block">
          <path
            d="M0,12 Q50,2 100,12 T200,12 T300,12 T400,12 T500,12 T600,12 T700,12 T800,12 T900,12 T1000,12 T1100,12 T1200,12"
            fill="none"
            stroke="#692136"
            strokeWidth="1.5"
            strokeDasharray="4 7"
          />
        </svg>
        <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {PASOS.map((p, i) => (
            <li key={p.t} className="flex flex-col gap-3">
              <span aria-hidden className="t-1 w-fit bg-blanco pr-3 text-rosa">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="t-3 border-t border-vino pt-4">
                <span className="sr-solo">Paso {i + 1}: </span>
                {p.t}
              </h3>
              <p className="t-chico max-w-[18rem]">{p.d}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-vino pt-6">
        <span className="rotulo">Tu auricular, 3 canales</span>
        {CANALES.map((c) => (
          <span key={c} className="inline-flex items-center gap-2">
            <Signo canal={c} className="size-4" />
            <span className="t-3">{CANAL[c].nombre}</span>
            <span className="t-chico">{CANAL[c].que}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
