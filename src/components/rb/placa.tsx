"use client";

import "./placa.css";
import { useEffect, useRef, useState } from "react";
import { Encabezado, Flecha, boton } from "./base";
import { BotonPrograma } from "./boton-programa";
import { Signo } from "../signos";
import { RANGO, RESONANCIAS, iniciarPlaca, sintonia, type Placa as Control } from "@/lib/placa";
import { ACTIVIDADES, CANAL, DIAS } from "@/lib/rb";
import { CANALES, type CanalId } from "@/lib/programa";

/* Cada canal tiene su frecuencia: la misma figura que lo identifica en la web */
const FRECUENCIA: Record<CanalId, number> = { tumbao: 400, pulso: 800, sinte: 1360 };

const taller = ACTIVIDADES.find((a) => a.titulo === "Placa de Chladni casera");

/*
  Creá tu patrón: una placa de Chladni que responde a la frecuencia elegida.
  El sonido es opcional y empieza apagado (la web también es silenciosa).
*/
export function CreaTuPatron() {
  const lienzo = useRef<HTMLCanvasElement>(null);
  const placa = useRef<Control | null>(null);
  const tono = useRef<{ audio: AudioContext; osc: OscillatorNode } | null>(null);
  const [hz, setHz] = useState(FRECUENCIA.pulso);
  const inicial = useRef(hz);
  const [sonido, setSonido] = useState(false);
  const enFigura = sintonia(hz) > 0.5;

  useEffect(() => {
    const css = getComputedStyle(lienzo.current!);
    placa.current = iniciarPlaca(lienzo.current!, {
      hz: inicial.current,
      tinta: css.getPropertyValue("--color-vino").trim(),
      fondo: css.getPropertyValue("--color-blanco").trim(),
    });
    return () => {
      placa.current?.detener();
      tono.current?.audio.close();
    };
  }, []);

  const cambiar = (nuevo: number) => {
    setHz(nuevo);
    placa.current?.frecuencia(nuevo);
    tono.current?.osc.frequency.setTargetAtTime(nuevo, tono.current.audio.currentTime, 0.04);
  };

  const alternarSonido = () => {
    if (sonido) {
      tono.current?.audio.close();
      tono.current = null;
    } else {
      const audio = new AudioContext();
      const osc = audio.createOscillator();
      const volumen = audio.createGain();
      osc.frequency.value = hz;
      volumen.gain.value = 0.06;
      osc.connect(volumen).connect(audio.destination);
      osc.start();
      tono.current = { audio, osc };
    }
    setSonido(!sonido);
  };

  const golpe = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    placa.current?.sacudir(e.clientX - r.left, e.clientY - r.top);
  };

  const pct = (v: number) => `${((v - RANGO[0]) / (RANGO[1] - RANGO[0])) * 100}%`;

  return (
    <section id="placa" aria-labelledby="placa-titulo" className="rb-placa scroll-mt-4">
      <div className="contenido rb-placa-composicion">
        <div className="rb-placa-texto">
          <Encabezado
            id="placa-titulo"
            rotulo="Probalo vos"
            titulo={["Creá tu", "patrón"]}
            apilado
            texto={
              <p>
                En 1787, Ernst Chladni echó arena sobre una placa de metal y la hizo vibrar con el arco de un violín. La arena dibujó el
                sonido. Esas figuras son las que usamos en Ritmo Blanco.
              </p>
            }
          />
        </div>

        <figure className="rb-placa-lienzo">
          <canvas
            ref={lienzo}
            onPointerDown={golpe}
            role="img"
            aria-label={`Placa con arena vibrando a ${hz} hercios. ${enFigura ? "La arena forma una figura." : "La arena está desordenada."}`}
          />
          <figcaption className="t-chico">Tocá la placa para desarmar la arena.</figcaption>
        </figure>

        <div className="rb-placa-controles">
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor="placa-frecuencia" className="rotulo">
              Frecuencia
            </label>
            <output htmlFor="placa-frecuencia" className="rb-placa-hz">
              {hz} Hz
            </output>
          </div>
          <div className="rb-placa-regla">
            <input
              id="placa-frecuencia"
              type="range"
              min={RANGO[0]}
              max={RANGO[1]}
              step={10}
              value={hz}
              onChange={(e) => cambiar(Number(e.target.value))}
              aria-describedby="placa-estado"
            />
            {/* Marcas en las frecuencias donde aparece una figura */}
            <span aria-hidden className="rb-placa-marcas">
              {RESONANCIAS.map((r) => (
                <span key={r.hz} style={{ left: pct(r.hz) }} />
              ))}
            </span>
          </div>
          <p id="placa-estado" className="t-cuerpo" aria-live="polite">
            {enFigura ? "Justo en una resonancia: la arena arma una figura." : "Entre resonancias la arena se desordena. Buscá una marca."}
          </p>

          <div role="group" aria-label="Frecuencia de cada canal" className="flex flex-wrap gap-2">
            {CANALES.map((c) => (
              <button key={c} type="button" aria-pressed={hz === FRECUENCIA[c]} onClick={() => cambiar(FRECUENCIA[c])} className="rb-placa-boton">
                <Signo canal={c} className="size-3.5" />
                {CANAL[c].nombre}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" aria-pressed={sonido} onClick={alternarSonido} className="rb-placa-boton">
              {sonido ? "Apagar sonido" : "Escuchar la frecuencia"}
            </button>
            <button type="button" onClick={() => placa.current?.sacudir()} className="rb-placa-boton">
              Arena nueva
            </button>
            <button
              type="button"
              onClick={() => placa.current?.guardar(`ritmo blanco · ${hz} Hz`, `mi-patron-ritmo-blanco-${hz}hz.png`)}
              className={boton("vino")}
            >
              Guardá tu patrón
            </button>
          </div>
          {sonido && <p className="t-cuerpo">Bajá el volumen o ponete los auriculares: es lo único que suena en esta web.</p>}

          {taller && (
            <p className="t-chico flex flex-wrap items-center gap-x-3 border-t border-vino pt-3">
              <span>
                ¿Querés hacer la tuya? Taller <b>{taller.titulo}</b> · {DIAS[taller.dia - 1].fecha} · {taller.inicio}
              </span>
              <BotonPrograma
                filtro={{ dia: taller.dia, vista: "actividades", tipo: null, modalidad: null, zona: null, abierta: taller.clave }}
                className="rotulo inline-flex min-h-11 cursor-pointer items-center gap-2 underline underline-offset-4"
              >
                Ver en el programa <Flecha />
              </BotonPrograma>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
