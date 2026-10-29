"use client";

import { useState } from "react";
import { Encabezado, boton } from "./base";
import { DIAS, FECHAS } from "@/lib/rb";

/*
  Reserva en un solo paso: el día (o los días) y el DNI, que es lo mismo que
  piden en el acceso para retirar los auriculares. Es una maqueta: el sitio es
  estático, así que no guarda ni envía nada; el código se genera en el
  navegador.
*/
const opcion = (on: boolean) =>
  `cursor-pointer border border-vino transition-colors ${on ? "bg-vino text-blanco" : "bg-transparent text-vino hover:bg-crudo"}`;

export function Reserva() {
  const [dias, setDias] = useState<number[]>([]);
  const [dni, setDni] = useState("");
  const [error, setError] = useState("");
  const [reserva, setReserva] = useState<{ codigo: string; resumen: string } | null>(null);

  const todos = dias.length === DIAS.length;
  const alternar = (n: number) => {
    setError("");
    setDias((d) => (d.includes(n) ? d.filter((x) => x !== n) : [...d, n].sort()));
  };
  const elegidos = DIAS.filter((d) => dias.includes(d.numero));

  const confirmar = () => {
    if (!dias.length) return setError("Elegí al menos un día.");
    if (!/^\d{7,8}$/.test(dni.replace(/\./g, ""))) return setError("Revisá el DNI: son 7 u 8 números.");
    setReserva({
      codigo: `RB-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      resumen: todos ? `Las ${DIAS.length} jornadas · ${FECHAS.lista}` : elegidos.map((d) => `${d.fecha} · ${d.nombre}`).join(" / "),
    });
  };

  return (
    <section id="reserva" aria-labelledby="reserva-titulo" className="banda scroll-mt-4 bg-blanco">
      <div className="contenido">
        <Encabezado
          id="reserva-titulo"
          rotulo="Entrada gratuita · cupo limitado para cuidar el bosque"
          titulo={["Reservá", "tus auriculares"]}
          texto={<p>Elegí el día y dejá tu DNI. Con ese DNI retirás los auriculares en el acceso y los devolvés a la salida.</p>}
        />

        {!reserva ? (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              confirmar();
            }}
            className="mt-12 grid items-end gap-8 border-t border-vino pt-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto]"
          >
            <fieldset>
              <legend className="rotulo mb-3">Día</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {DIAS.map((d) => {
                  const on = dias.includes(d.numero);
                  return (
                    <button
                      key={d.numero}
                      type="button"
                      aria-pressed={on}
                      onClick={() => alternar(d.numero)}
                      className={`${opcion(on)} flex flex-col items-start gap-1 p-3 text-left`}
                    >
                      <span className="t-3">{d.fecha}</span>
                      <span className="t-chico">{d.nombre}</span>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setDias(todos ? [] : DIAS.map((d) => d.numero));
                }}
                className="rotulo mt-3 cursor-pointer underline underline-offset-4"
              >
                {todos ? "Sacar todas" : "Todas las jornadas"}
              </button>
            </fieldset>

            <label className="rotulo flex flex-col gap-2">
              DNI
              <input
                inputMode="numeric"
                autoComplete="off"
                placeholder="Sin puntos"
                value={dni}
                onChange={(e) => {
                  setDni(e.target.value);
                  setError("");
                }}
                className="t-cuerpo min-h-12 border-b border-vino bg-transparent px-0 text-base text-vino outline-offset-4 placeholder:text-vino/50"
              />
            </label>

            <div className="flex flex-col gap-2">
              <button type="submit" className={`${boton("vino")} min-h-12 px-6`}>
                Reservá
              </button>
              {error && (
                <p role="alert" className="t-chico font-semibold">
                  {error}
                </p>
              )}
            </div>
          </form>
        ) : (
          <div role="status" className="mt-12 flex flex-col items-start gap-4 border-t border-vino pt-8">
            <p className="rotulo">Reserva confirmada</p>
            <p className="t-2">Nos vemos en el bosque.</p>
            <p className="t-chico">{reserva.resumen}</p>
            <p className="t-2 bg-vino px-4 py-2 text-blanco">{reserva.codigo}</p>
            <p className="t-chico">Mostrá este código y tu DNI en el acceso.</p>
            <button
              type="button"
              onClick={() => {
                setReserva(null);
                setDias([]);
                setDni("");
              }}
              className="rotulo cursor-pointer underline underline-offset-4"
            >
              Hacé otra reserva
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
