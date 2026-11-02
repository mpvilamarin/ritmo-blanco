"use client";

import { useEffect, useRef, useState } from "react";
import { Encabezado, Flecha, boton } from "./base";
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
  const [errores, setErrores] = useState<{ dias?: string; dni?: string }>({});
  const [reserva, setReserva] = useState<{ codigo: string; resumen: string } | null>(null);
  const confirmacion = useRef<HTMLParagraphElement>(null);
  const campoDni = useRef<HTMLInputElement>(null);
  const primerDia = useRef<HTMLButtonElement>(null);

  // Con la reserva hecha, el foco va a la confirmación para que se anuncie
  useEffect(() => {
    if (reserva) confirmacion.current?.focus();
  }, [reserva]);

  const todos = dias.length === DIAS.length;
  const alternar = (n: number) => {
    setErrores((e) => ({ ...e, dias: undefined }));
    setDias((d) => (d.includes(n) ? d.filter((x) => x !== n) : [...d, n].sort()));
  };
  const elegidos = DIAS.filter((d) => dias.includes(d.numero));

  const confirmar = () => {
    const nuevos = {
      dias: dias.length ? undefined : "Elegí al menos un día.",
      dni: /^\d{7,8}$/.test(dni) ? undefined : "Revisá el DNI: son 7 u 8 números.",
    };
    setErrores(nuevos);
    if (nuevos.dias) return primerDia.current?.focus();
    if (nuevos.dni) return campoDni.current?.focus();
    setReserva({
      codigo: `RB-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      resumen: todos ? `Las ${DIAS.length} jornadas · ${FECHAS.lista}` : elegidos.map((d) => `${d.fecha} · ${d.nombre}`).join(" / "),
    });
  };

  return (
    <section id="reserva" aria-labelledby="reserva-titulo" className="compacta scroll-mt-4 bg-blanco">
      <div className="contenido">
        <Encabezado
          id="reserva-titulo"
          rotulo="Entrada gratuita · cupo limitado para cuidar el bosque"
          titulo={["Reservá", "tus auriculares"]}
          texto={<p>Elegí el día y dejá tu DNI. Con ese DNI retirás los auriculares en el acceso y los devolvés a la salida.</p>}
          centrado
        />

        {!reserva ? (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              confirmar();
            }}
            className="mx-auto grid max-w-[60rem] items-end gap-x-8 gap-y-6 border-t border-vino pt-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto]"
          >
            <fieldset aria-describedby="reserva-error-dias">
              <legend className="rotulo mb-3">Día</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {DIAS.map((d, i) => {
                  const on = dias.includes(d.numero);
                  return (
                    <button
                      key={d.numero}
                      ref={i === 0 ? primerDia : undefined}
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
                  setErrores((e) => ({ ...e, dias: undefined }));
                  setDias(todos ? [] : DIAS.map((d) => d.numero));
                }}
                className="rotulo mt-2 flex min-h-11 cursor-pointer items-center underline underline-offset-4"
              >
                {todos ? "Sacar todas" : "Todas las jornadas"}
              </button>
              <ErrorCampo id="reserva-error-dias" texto={errores.dias} />
            </fieldset>

            <div className="flex flex-col gap-2">
              <label htmlFor="reserva-dni" className="rotulo">
                DNI
              </label>
              <p id="reserva-dni-ayuda" className="t-chico">
                7 u 8 números, sin puntos
              </p>
              <input
                ref={campoDni}
                id="reserva-dni"
                name="dni"
                inputMode="numeric"
                autoComplete="off"
                spellCheck={false}
                placeholder="Ej.: 30123456"
                value={dni}
                aria-invalid={errores.dni ? true : undefined}
                aria-describedby="reserva-dni-ayuda reserva-error-dni"
                onChange={(e) => {
                  // Puntos y espacios se limpian al escribir: queda solo el número
                  setDni(e.target.value.replace(/\D/g, "").slice(0, 8));
                  setErrores((er) => ({ ...er, dni: undefined }));
                }}
                className="t-cuerpo min-h-12 border-b border-vino bg-transparent px-0 text-vino outline-offset-4 placeholder:text-vino/75 aria-invalid:border-b-2"
              />
              <ErrorCampo id="reserva-error-dni" texto={errores.dni} />
            </div>

            <div className="flex flex-col gap-2">
              <button type="submit" className={`${boton("vino")} min-h-12 px-6`}>
                Probá la reserva
              </button>
              {/* Mismo alto que los errores: el botón no salta */}
              <span aria-hidden className="min-h-6" />
            </div>
          </form>
        ) : (
          <div role="status" className="mx-auto flex max-w-[60rem] flex-col items-start gap-4 border-t border-vino pt-5">
            <p className="rotulo">Demostración completada</p>
            <p ref={confirmacion} tabIndex={-1} className="t-2">
              Así se vería tu reserva.
            </p>
            <p className="t-cuerpo">{reserva.resumen}</p>
            <p className="t-2 bg-vino px-4 py-2 text-blanco">{reserva.codigo}</p>
            <p className="t-chico">Código de ejemplo, sin validez para ingresar.</p>
            <ul className="t-cuerpo flex max-w-[62ch] flex-col gap-1 border-l-2 border-vino pl-4">
              <li>Traé tu DNI: es lo único que te pedimos.</li>
              <li>Retirá los auriculares en el puesto D del mapa, desde las 13:30.</li>
              <li>Devolvelos a la salida, hasta las 23:30.</li>
            </ul>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <a href="#mapa" className={boton("borde")}>
                Ver el mapa <Flecha />
              </a>
              <button
                type="button"
                onClick={() => {
                  setReserva(null);
                  setDias([]);
                  setDni("");
                }}
                className="rotulo flex min-h-11 cursor-pointer items-center underline underline-offset-4"
              >
                Probá otra reserva
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* Error junto a su campo, con el alto reservado para que nada salte */
function ErrorCampo({ id, texto }: { id: string; texto?: string }) {
  return (
    <p id={id} aria-live="polite" className="t-chico mt-1 min-h-6 font-semibold">
      {texto}
    </p>
  );
}
