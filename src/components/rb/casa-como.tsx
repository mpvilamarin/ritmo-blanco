import { Encabezado, Flecha, boton } from "./base";
import { BoldLight, Guino } from "../sistema";
import { Rio, type Punto } from "../rio";
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

/*
  Recorrido del río en "Cómo funciona": entra por la izquierda, serpentea por
  detrás de los cuatro números y sale por la derecha. Es el mismo gusano de
  degradé de la portada; une los pasos en lugar de la línea punteada.
*/
const RIO_PASOS_ESCRITORIO: Punto[] = [
  [-0.2, 0, 0.56],
  [0.06, 0, 0.52],
  [0.3, 0, 0.58],
  [0.55, 0, 0.5],
  [0.8, 0, 0.58],
  [1.0, 0, 0.52],
  [1.25, 0, 0.55],
];
// Celular: los pasos van apilados; el río zigzaguea por la izquierda detrás de cada número
const RIO_PASOS_CELULAR: Punto[] = [
  [-0.35, 0, 0.12],
  [0.14, 0, 0.19],
  [-0.08, 0, 0.27],
  [0.14, 0, 0.35],
  [-0.08, 0, 0.44],
  [0.14, 0, 0.52],
  [-0.08, 0, 0.6],
  [0.14, 0, 0.66],
  [-0.4, 0, 0.74],
];

/* Cuatro pasos en celdas de la grilla, unidos por el río */
export function ComoFunciona() {
  return (
    <div className="relative isolate overflow-hidden">
      <Rio secciones={RIO_PASOS} escritorio={RIO_PASOS_ESCRITORIO} celular={RIO_PASOS_CELULAR} ancho={0.05} anchoCelular={0.09} />
      <section id="como" aria-label="Cómo funciona" className="banda contenido scroll-mt-4">
        <p className="rotulo mb-5">Cómo funciona · {PASOS.length} pasos</p>
        <BoldLight as="h2" fuerte="Cero ruido," suave={<Guino>todo ritmo.</Guino>} max={200} />
        <ol className="mt-16 grid gap-12 lg:grid-cols-4 lg:gap-0">
          {PASOS.map((p, i) => (
            <li key={p.t} className={`flex flex-col ${i > 0 ? "lg:border-l lg:border-vino/25 lg:pl-6" : ""} lg:pr-6`}>
              <span aria-hidden className="t-cifra text-[clamp(4rem,8vw,7.5rem)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="t-3 mt-6 border-t border-vino pt-4">
                <span className="sr-solo">Paso {i + 1}: </span>
                {p.t}
              </h3>
              <p className="t-cuerpo mt-2">{p.d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-vino pt-6">
          <span className="rotulo">Tu auricular, 3 canales</span>
          {CANALES.map((c) => (
            <span key={c} className="inline-flex items-center gap-3">
              <span className="grid size-10 place-items-center" style={{ background: CANAL[c].color, color: CANAL[c].tinta }}>
                <Signo canal={c} className="size-5" />
              </span>
              <span>
                <span className="t-3 block">{CANAL[c].nombre}</span>
                <span className="t-chico">{CANAL[c].que}</span>
              </span>
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

const RIO_PASOS = ["como"];
