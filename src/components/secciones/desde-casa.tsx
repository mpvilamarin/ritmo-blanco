import { Pisadas } from "../pisadas";
import { Guino, Modo, TipoEtiqueta, ZonaEtiqueta } from "../signos";
import { Titulo } from "../titulo";
import { diaSemana, fechaCorta, ordenarActividades, programa, sitio } from "@/lib/programa";

/* Todo lo que se puede seguir desde casa: actividades virtuales e híbridas del JSON */
export function DesdeCasa() {
  const t = sitio.desde_casa;
  return (
    <section id="desde-casa" aria-labelledby="casa-titulo" className="reticula gap-y-8 pt-12 md:pt-16">
      <Pisadas className="col-span-full mb-4" pasos={4} />
      <div id="casa-titulo" className="col-span-3 md:col-span-4 lg:col-span-5">
        <Titulo fuerte={t.titulo[0]} suave={t.titulo[1]} max={130} className="text-6xl" />
      </div>
      <div className="col-span-full space-y-3 self-end md:col-span-4 lg:col-span-5 lg:col-start-8">
        <p>{t.texto}</p>
        <p>
          {t.cierre} <Guino>{t.guino}</Guino>
        </p>
      </div>

      <div className="col-span-full grid gap-10 lg:grid-cols-3 lg:gap-6">
        {programa.dias.map((d) => {
          const lista = ordenarActividades(d.actividades).filter((a) => a.modalidad !== "presencial");
          return (
            <div key={d.numero}>
              <h3 className="flex items-baseline justify-between gap-3 border-b border-vino pb-2">
                <span className="font-display text-2xl uppercase">
                  <b>{d.nombre[0]}</b> <span className="font-light">{d.nombre[1]}</span>
                </span>
                <span className="rotulo">
                  {diaSemana(d.fecha)} {fechaCorta(d.fecha)}
                </span>
              </h3>
              <ul>
                {lista.map((a) => (
                  <li key={a.titulo} className="grid grid-cols-[3.5rem_1fr] gap-x-3 border-b border-vino/40 py-3">
                    <time className="font-display text-xl leading-none font-bold">{a.inicio}</time>
                    <div>
                      <p className="font-display text-lg leading-tight font-medium">{a.titulo}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Modo modalidad={a.modalidad} conTexto />
                        <TipoEtiqueta tipo={a.tipo} />
                        <ZonaEtiqueta nombre={a.zona} zona={programa.zonas[a.zona]} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
