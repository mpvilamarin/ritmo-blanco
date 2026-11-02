import "./que-es.css";
import { Encabezado } from "./base";
import { CanalesArena } from "./canales-arena";
import { CANALES, partirHorario, programa, sitio } from "@/lib/programa";

/* Tres datos que resumen el concepto, sacados del programa */
const DATOS = [
  { cifra: String(CANALES.length), dato: "Canales que suenan a la vez" },
  { cifra: "0", dato: "Parlantes en el bosque" },
  { cifra: partirHorario(programa.dias[0].lineup.cierre.horario)[0], dato: "Los tres canales transmiten al mismo artista" },
];

export function QueEs() {
  return (
    <section id="que-es" aria-labelledby="que-es-titulo" className="rb-concepto scroll-mt-4 bg-blanco">
      <div className="contenido rb-concepto-composicion">
        <div className="rb-concepto-intro">
          <Encabezado
            id="que-es-titulo"
            rotulo="Qué es Ritmo Blanco"
            titulo={[sitio.que_es.titulo[0], sitio.que_es.titulo[1]]}
            apilado
            texto={
              <>
                <p>Un festival silencioso en los Bosques de Palermo. Te ponés los auriculares, elegís un canal en vivo y bailás a tu ritmo.</p>
                <p className="mt-4">{sitio.que_es.canales_intro} Afuera, el bosque sigue en calma.</p>
              </>
            }
          />
        </div>
        <CanalesArena />
      </div>
      <div className="contenido">
        <ul className="rb-concepto-datos">
          {DATOS.map((d) => (
            <li key={d.dato}>
              <span className="rb-concepto-cifra">{d.cifra}</span>
              <span className="rb-concepto-dato">{d.dato}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
