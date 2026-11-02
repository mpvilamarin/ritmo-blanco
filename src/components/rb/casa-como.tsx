import "./como.css";
import { Encabezado, Flecha, boton } from "./base";
import { BotonPrograma } from "./boton-programa";
import { BoldLight } from "../sistema";
import { FECHAS, TOTALES } from "@/lib/rb";

/*
  Desde casa: el encabezado a la izquierda (con el punto de "en vivo") y, a la
  derecha, qué se puede seguir contado desde el programa y el botón a lo ancho.
*/
export function DesdeCasa() {
  const datos = [
    { cifra: TOTALES.canales, dato: "Canales en vivo, los mismos que suenan en el bosque" },
    { cifra: TOTALES.hibridas, dato: "Actividades híbridas: en el predio y en tu pantalla a la vez" },
    { cifra: TOTALES.soloOnline, dato: "Actividades solo online, para hacer desde el living" },
  ];
  return (
    <section id="desde-casa" aria-labelledby="casa-titulo" className="compacta scroll-mt-4 bg-violeta text-blanco">
      <div className="contenido rb-casa">
        <header className="encabezado encabezado-apilado">
          <p className="rotulo flex items-center gap-2.5">
            <span aria-hidden className="relative flex size-2">
              <span className="rb-pulso absolute inset-0 rounded-full bg-rosa" />
              <span className="relative size-2 rounded-full bg-blanco" />
            </span>
            En vivo desde casa · {FECHAS.larga} desde las 14 h
          </p>
          <BoldLight id="casa-titulo" fuerte="¿No llegás" suave="al bosque?" />
          <div className="bajada">
            <p>Transmitimos los tres canales, las charlas de la Pantalla Muda y clases para bailar en el living. Escuchás lo mismo que el público, al mismo tiempo.</p>
          </div>
        </header>

        <div className="flex flex-col">
          <ul className="rb-casa-datos">
            {datos.map((d) => (
              <li key={d.dato}>
                <span className="t-2">{d.cifra}</span>
                <span className="t-cuerpo">{d.dato}</span>
              </li>
            ))}
          </ul>
          <BotonPrograma
            filtro={{ vista: "actividades", modalidad: "virtual", tipo: null, zona: null }}
            className={`${boton("claro")} mt-6 w-full justify-between`}
          >
            Mirá la programación online
            <Flecha />
          </BotonPrograma>
        </div>
      </div>
    </section>
  );
}

const PASOS = [
  { t: "Reservá", detalle: "tus auriculares", d: "Elegí el día y dejá tu DNI. El cupo es limitado para que el bosque respire." },
  { t: "Retirá", detalle: "en el acceso", d: "Con tu DNI te damos los auriculares inalámbricos. Los devolvés a la salida." },
  { t: "Elegí", detalle: "qué escuchar", d: "Pasá de un canal a otro desde el auricular, cuando quieras." },
  { t: "Generá", detalle: "con tu movimiento", d: "Pedaleá en las bicis generadoras o bailá sobre los pisos cinéticos. Tu energía alimenta el festival." },
];

export function ComoFunciona() {
  return (
    <section id="como" aria-labelledby="como-titulo" className="scroll-mt-4 bg-blanco">
      <div className="contenido">
        <Encabezado
          id="como-titulo"
          rotulo={`En ${PASOS.length} pasos`}
          titulo={["Cómo", "funciona"]}
          texto={<p>Antes de ir, al llegar y adentro del bosque.</p>}
        />
        <ol className="rb-como-pasos">
          {PASOS.map((p, i) => (
            <li key={p.t} className="rb-como-paso">
              <span aria-hidden className="rotulo">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="rb-titulo font-display uppercase">
                <span className="sr-solo">Paso {i + 1}: </span>
                <span className="block font-black tracking-[-0.03em]">{p.t}</span>
                <span className="mt-[0.06em] block font-normal tracking-[-0.02em]">{p.detalle}</span>
              </h3>
              <p className="t-cuerpo">{p.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
