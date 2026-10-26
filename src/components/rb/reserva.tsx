"use client";

import { useState } from "react";
import { Encabezado, boton } from "./base";
import { DIAS, TOTALES } from "@/lib/rb";

/*
  Reserva, tal como está en el diseño. Es una maqueta: el sitio es estático,
  así que no guarda ni envía nada; el código de confirmación se genera en el
  navegador.
*/
const COMPLETO = "Pase completo";
const LLEGADAS = {
  Bici: "Hay bicicleteros en el acceso y junto a la Usina Bailable.",
  "Transporte público": "Te mandamos el recorrido recomendado con la confirmación.",
  "Auto compartido": "Sumá gente a tu auto: menos autos, menos emisiones.",
  "A pie": "El acceso peatonal está señalizado desde la entrada del bosque.",
} as const;
type Llegada = keyof typeof LLEGADAS;

const PASES = [
  ...DIAS.map((d) => ({ v: `Día ${d.numero}`, kicker: d.etiqueta, fecha: d.fecha, nombre: d.nombre, sub: `Cierre: ${d.cierre}` })),
  { v: COMPLETO, kicker: "Los 3 días", fecha: "14—16", nombre: COMPLETO, sub: `${TOTALES.artistas} artistas · ${TOTALES.actividades} actividades` },
];

/* Cada paso es una fila de la grilla: número y título a la izquierda, campos a la derecha */
function Paso({ n, titulo, children }: { n: string; titulo: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-4 border-t border-vino py-6 md:grid-cols-[12rem_1fr] md:gap-6">
      <legend className="sr-solo">
        Paso {n}: {titulo}
      </legend>
      <p aria-hidden>
        <span className="t-2 block">{n}</span>
        <span className="t-3 mt-1 block">{titulo}</span>
      </p>
      <div>{children}</div>
    </fieldset>
  );
}

const opcion = (on: boolean) =>
  `cursor-pointer border border-vino transition-colors ${on ? "bg-vino text-blanco" : "bg-transparent text-vino hover:bg-blanco/50"}`;

export function Reserva() {
  const [pase, setPase] = useState(COMPLETO);
  const [personas, setPersonas] = useState(2);
  const [llegada, setLlegada] = useState<Llegada>("Bici");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [reserva, setReserva] = useState<{ nombre: string; email: string; codigo: string; resumen: string } | null>(null);

  const elegido = PASES.find((p) => p.v === pase)!;
  const campo = "t-cuerpo min-h-12 border-b border-vino bg-transparent px-0 text-vino outline-offset-4 placeholder:text-vino/50";

  const confirmar = () => {
    if (!nombre.trim()) return setError("Completá tu nombre en el paso 03.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Revisá el email en el paso 03.");
    setReserva({
      nombre: nombre.trim().split(" ")[0],
      email,
      codigo: `RB-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      resumen: `${pase} · ${personas} ${personas === 1 ? "persona" : "personas"} · llegás en ${llegada.toLowerCase()}.`,
    });
  };

  return (
    <section id="reserva" aria-labelledby="reserva-titulo" className="banda scroll-mt-4 bg-rosa">
      <div className="contenido">
        <Encabezado
          id="reserva-titulo"
          rotulo="Cupo limitado para cuidar el bosque"
          titulo="Reservá tu lugar"
          texto={<p>Tres pasos y listo. Tu reserva incluye los auriculares, que devolvés a la salida.</p>}
        />

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="border-b border-vino">
            <Paso n="01" titulo="Elegí tu pase">
              <div role="radiogroup" aria-label="Pase" className="grid grid-cols-2 gap-2 xl:grid-cols-4">
                {PASES.map((p) => (
                  <button
                    key={p.v}
                    type="button"
                    role="radio"
                    aria-checked={pase === p.v}
                    onClick={() => setPase(p.v)}
                    className={`${opcion(pase === p.v)} flex flex-col items-start gap-1 p-3 text-left`}
                  >
                    <span className="rotulo">{p.kicker}</span>
                    <span className="t-3">{p.fecha}</span>
                    <span className="t-chico">{p.nombre}</span>
                  </button>
                ))}
              </div>
            </Paso>

            <Paso n="02" titulo="Personas y llegada">
              <div className="flex flex-wrap items-start gap-6">
                <div className="flex items-center border border-vino">
                  <button
                    type="button"
                    aria-label="Una persona menos"
                    onClick={() => setPersonas((n) => Math.max(1, n - 1))}
                    className="t-3 size-11 cursor-pointer hover:bg-blanco/50"
                  >
                    −
                  </button>
                  <span aria-live="polite" className="t-3 min-w-10 text-center">
                    {personas}
                    <span className="sr-solo"> personas</span>
                  </span>
                  <button
                    type="button"
                    aria-label="Una persona más"
                    onClick={() => setPersonas((n) => Math.min(6, n + 1))}
                    className="t-3 size-11 cursor-pointer hover:bg-blanco/50"
                  >
                    +
                  </button>
                </div>
                <div className="flex min-w-[240px] flex-1 flex-col gap-3">
                  <div role="radiogroup" aria-label="Cómo llegan" className="flex flex-wrap gap-1.5">
                    {(Object.keys(LLEGADAS) as Llegada[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        role="radio"
                        aria-checked={llegada === m}
                        onClick={() => setLlegada(m)}
                        className={`${opcion(llegada === m)} rotulo px-3 py-2`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                  <p className="t-chico">{LLEGADAS[llegada]}</p>
                </div>
              </div>
            </Paso>

            <Paso n="03" titulo="Tus datos">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="rotulo flex flex-col gap-1">
                  Nombre
                  <input
                    placeholder="Tu nombre"
                    autoComplete="name"
                    value={nombre}
                    onChange={(e) => {
                      setNombre(e.target.value);
                      setError("");
                    }}
                    className={campo}
                  />
                </label>
                <label className="rotulo flex flex-col gap-1">
                  Email
                  <input
                    type="email"
                    placeholder="vos@mail.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className={campo}
                  />
                </label>
              </div>
            </Paso>
          </div>

          <aside aria-label="Tu reserva" className="flex flex-col gap-5 bg-vino p-6 text-blanco md:p-8 lg:sticky lg:top-6">
            {!reserva ? (
              <>
                <p className="rotulo text-rosa">Tu reserva</p>
                <p className="t-2">{elegido.nombre}</p>
                <dl className="t-chico">
                  {[
                    ["Fechas", pase === COMPLETO ? "14, 15 y 16.11" : `${elegido.fecha} · ${elegido.nombre}`],
                    ["Personas", personas],
                    ["Llegada", llegada],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3 border-t border-blanco/25 py-2.5 last:border-b">
                      <dt>{k}</dt>
                      <dd className="text-right font-semibold">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div>
                  <p className="rotulo text-rosa">Incluye</p>
                  <ul className="t-chico mt-2 flex flex-col gap-1">
                    <li>Auriculares con los 3 canales</li>
                    <li>Talleres, charlas y clases</li>
                    <li>Bicis y pisos cinéticos</li>
                  </ul>
                </div>
                {error && (
                  <p role="alert" className="t-chico bg-blanco px-3 py-2 font-semibold text-vino">
                    {error}
                  </p>
                )}
                <button type="button" onClick={confirmar} className={`${boton("rosa")} w-full py-4`}>
                  Confirmar reserva
                </button>
                <p className="rotulo text-center text-lila">Te llega la confirmación por email</p>
              </>
            ) : (
              <div role="status" className="flex flex-col items-start gap-4">
                <p className="rotulo text-rosa">Reserva confirmada</p>
                <p className="t-2">Nos vemos en el bosque, {reserva.nombre}.</p>
                <p className="t-chico">{reserva.resumen}</p>
                <p className="t-2 bg-blanco px-4 py-2 text-vino">{reserva.codigo}</p>
                <p className="t-chico text-lila">Confirmación enviada a {reserva.email}</p>
                <button
                  type="button"
                  onClick={() => {
                    setReserva(null);
                    setNombre("");
                    setEmail("");
                  }}
                  className="rotulo cursor-pointer text-rosa underline underline-offset-4"
                >
                  Hacer otra reserva
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
