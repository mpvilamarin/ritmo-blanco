import { Foto } from "./rb/base";
import { Modo, Signo, TipoEtiqueta, ZonaEtiqueta } from "./signos";
import { CANAL } from "@/lib/rb";
import { CANALES, diaSemana, fechaCorta, ordenarActividades, partirHorario, programa, sitio, type Dia } from "@/lib/programa";

/*
  Cronograma con la diagramación del programa impreso: una columna por día,
  separadas por filetes vino. Cada día: cabecera con el nombre bold/light y
  "DÍA n" gigante en rosa detrás, line-up por canal, cierre (foto + bloque
  crudo) y las actividades en dos columnas. Todo sale de programa.json.
  Lo usan la vista "Cuadrícula" del programa y la página /cronograma (PDF).
*/
function Jornada({ dia }: { dia: Dia }) {
  const cierre = dia.lineup.cierre;
  const [desdeCierre, hastaCierre] = partirHorario(cierre.horario);
  const actividades = ordenarActividades(dia.actividades);

  return (
    <article className="flex flex-col gap-4">
      {/* Cabecera */}
      <header className="relative grid grid-cols-[auto_1fr] items-end gap-5">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-3 left-[28%] font-display text-[7.5rem] leading-none font-black tracking-[-0.04em] whitespace-nowrap text-rosa/55 uppercase select-none"
        >
          Día {dia.numero}
        </span>
        <div className="relative">
          <p className="font-mono text-[0.8125rem] font-semibold tracking-[0.04em]">
            {fechaCorta(dia.fecha)} · {dia.horario.replace("–", " a ")}
          </p>
          <h3 className="mt-1 font-display text-[3.25rem] leading-[0.86] uppercase">
            <span className="block font-black tracking-[-0.03em]">{dia.nombre[0]}</span>
            <span className="block font-light tracking-[-0.02em]">{dia.nombre[1]}</span>
          </h3>
        </div>
        <div className="relative border-t border-vino pt-2 pb-1">
          <p className="font-mono text-[0.875rem] leading-tight font-semibold">{dia.generos}</p>
          <p className="mt-1.5 font-mono text-[0.75rem] leading-snug">{dia.frase}</p>
          <p className="sr-solo">{diaSemana(dia.fecha)}</p>
        </div>
      </header>

      {/* Line-up */}
      <section aria-label={`Line-up del día ${dia.numero}`}>
        <h4 className="flex items-center gap-4 font-display text-xl uppercase">
          <span className="shrink-0">Line-up · {dia.lineup.escenario}</span>
          <span className="h-px flex-1 bg-vino" />
        </h4>
        <div className="mt-3 grid grid-cols-2 gap-4">
          {dia.lineup.sets.map((set) => {
            const [desde, hasta] = partirHorario(set.horario);
            return (
              <div key={set.horario} className="flex gap-2.5">
                <p
                  className="shrink-0 rotate-180 font-display text-[1.75rem] leading-none font-black [writing-mode:vertical-rl]"
                  aria-label={`De ${desde} a ${hasta}`}
                >
                  {desde}
                </p>
                <ul className="flex flex-col gap-1.5">
                  {CANALES.map((c) => (
                    <li key={c} className="flex gap-1.5">
                      <Signo canal={c} className="mt-0.5 size-3.5 text-vino" />
                      <span>
                        <span className="block font-mono text-[0.8125rem] leading-tight font-semibold">{set.canales[c].artista}</span>
                        <span className="block font-mono text-[0.6875rem] leading-tight">{set.canales[c].descripcion}</span>
                        <span className="sr-solo"> · Canal {CANAL[c].nombre}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <ul aria-hidden className="mt-3 flex justify-around">
          {CANALES.map((c) => (
            <li key={c} className="flex items-center gap-1.5 font-mono text-[0.75rem] uppercase">
              <Signo canal={c} className="size-3.5" /> Canal {CANAL[c].nombre}
            </li>
          ))}
        </ul>
      </section>

      {/* Cierre */}
      <section aria-label="Cierre" className="bg-crudo">
        <Foto texto="[FOTO DE PRENSA]" className="aspect-[4/1.1]" />
        <div className="grid grid-cols-[1fr_auto_1.1fr] gap-3 px-3 py-3">
          <div>
            <p className="font-mono text-[0.6875rem] uppercase">
              Cierre · {desdeCierre} a {hastaCierre}
            </p>
            <p className="mt-1 font-display text-[1.625rem] leading-none font-black uppercase">{cierre.artista}</p>
            <p className="mt-1.5 font-mono text-[0.625rem] uppercase">Los tres canales transmiten el mismo show</p>
          </div>
          <span aria-hidden className="w-px bg-vino/40" />
          <div className="flex flex-col justify-between gap-2">
            <p className="font-mono text-[0.6875rem] leading-snug">{cierre.descripcion}.</p>
            <p className="font-mono text-[0.75rem] uppercase">{sitio.programa.cierre_rotulo}</p>
          </div>
        </div>
      </section>

      {/* Actividades */}
      <section aria-label={`Actividades del día ${dia.numero}`}>
        <h4 className="flex items-center gap-4 font-display text-xl uppercase">
          <span className="shrink-0">Actividades</span>
          <span className="h-px flex-1 bg-vino" />
        </h4>
        <ul className="mt-3 columns-2 gap-4 [column-rule:1px_solid_color-mix(in_srgb,var(--color-vino)_50%,transparent)]">
          {actividades.map((a) => (
            <li key={a.titulo} className={`mb-2.5 break-inside-avoid border-b border-vino/40 pb-2.5 ${a.destacado ? "border-0 bg-crudo pb-0" : ""}`}>
              {a.destacado && <Foto texto="[FOTO]" className="aspect-[2/1]" />}
              <div className={a.destacado ? "p-2" : ""}>
                <div className="flex items-start justify-between gap-2">
                  <span className="font-display text-[1.625rem] leading-none font-medium">{a.inicio}</span>
                  <span className="flex items-center gap-1.5 [&_span]:text-[0.5625rem]">
                    <TipoEtiqueta tipo={a.tipo} />
                    <Modo modalidad={a.modalidad} />
                  </span>
                </div>
                <p className="mt-1 font-display text-[0.9375rem] leading-tight font-bold">{a.titulo}</p>
                <p className="mt-1 font-mono text-[0.625rem] leading-snug">{a.descripcion}</p>
                <p className="mt-1.5 [&_span]:text-[0.5625rem]">
                  <ZonaEtiqueta nombre={a.zona} zona={programa.zonas[a.zona]} />
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

export function Cronograma() {
  return (
    <div className="grid gap-12 lg:grid-cols-[repeat(var(--dias),minmax(0,1fr))] lg:gap-0" style={{ ["--dias" as string]: programa.dias.length }}>
      {programa.dias.map((d, i) => (
        <div key={d.numero} className={`lg:px-6 ${i > 0 ? "lg:border-l lg:border-vino" : "lg:pl-0"} ${i === 2 ? "lg:pr-0" : ""}`}>
          <Jornada dia={d} />
        </div>
      ))}
    </div>
  );
}
