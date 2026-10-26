import { Encabezado } from "../recursos";
import { Guino, Modo } from "../signos";
import { ordenarActividades, programa, sitio } from "@/lib/programa";

/*
  Todo lo que se puede seguir desde casa (virtual e híbrido, del JSON),
  como una lista de nombres grandes con el dato chico al lado.
*/
export function DesdeCasa() {
  const t = sitio.desde_casa;
  const lista = programa.dias.flatMap((d) =>
    ordenarActividades(d.actividades)
      .filter((a) => a.modalidad !== "presencial")
      .map((a) => ({ ...a, dia: d })),
  );

  return (
    <section id="desde-casa" aria-labelledby="casa-titulo" className="reticula gap-y-10 pt-16 md:pt-20">
      <Encabezado id="casa-titulo" rotulo={t.rotulo} titulo={t.titulo} />
      <div className="col-span-full space-y-3 text-base md:col-span-6 lg:col-span-6">
        <p>{t.texto}</p>
        <p>
          {t.cierre} <Guino>{t.guino}</Guino>
        </p>
      </div>

      <ol className="col-span-full border-t border-vino lg:col-span-10 lg:col-start-2">
        {lista.map((a) => (
          <li
            key={`${a.dia.numero}-${a.titulo}`}
            className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1 border-b border-vino py-4 md:grid-cols-[9rem_1fr_auto]"
          >
            <p className="rotulo col-span-2 md:col-span-1">
              <span className="font-semibold">{a.dia.nombre[0]}</span> · {a.inicio}
            </p>
            <p className="font-display text-xl leading-tight font-bold uppercase md:text-3xl">
              {a.titulo}
              <span className="mt-1 block font-mono text-[0.75rem] font-normal tracking-normal normal-case md:mt-0 md:ml-3 md:inline md:align-middle">
                / {a.tipo.toLowerCase()} · {a.zona} · {a.duracion}
              </span>
            </p>
            <Modo modalidad={a.modalidad} conTexto />
          </li>
        ))}
      </ol>
    </section>
  );
}
