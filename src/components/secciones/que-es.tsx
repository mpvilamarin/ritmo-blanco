import { Arena } from "../arena";
import { SelectorCanal } from "../canal";
import { Pisadas } from "../pisadas";
import { Guino } from "../signos";
import { Titulo } from "../titulo";
import { sitio } from "@/lib/programa";

export function QueEs() {
  const t = sitio.que_es;
  return (
    <section id="que-es" aria-labelledby="que-es-titulo" className="reticula gap-y-8 pt-16 md:pt-24">
      <div id="que-es-titulo" className="col-span-4 md:col-span-5 lg:col-span-6">
        <Titulo fuerte={t.titulo[0]} suave={t.titulo[1]} max={150} className="text-6xl" />
      </div>
      <div className="col-span-full space-y-4 text-base md:col-span-6 md:col-start-3 lg:col-span-5 lg:col-start-8 lg:self-end">
        {t.texto.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <div id="canal" className="col-span-full mt-8 scroll-mt-8 filete pt-4 lg:scroll-mt-24">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-display text-2xl font-bold uppercase">{sitio.cta}</h3>
          <p>{t.canales_intro}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-8 lg:grid-cols-12 md:gap-6">
          <div
            className="con-grano aspect-[4/3] overflow-hidden md:col-span-3 md:aspect-auto lg:col-span-4"
            style={{
              background:
                "radial-gradient(90% 80% at 90% 10%, #edcdb8 0%, #e1b0c1 40%, #e1b0c100 80%), linear-gradient(200deg, #b3a5ba, #9195b4 60%, #767498)",
            }}
          >
            <Arena particulas={12000} />
          </div>
          <div className="flex flex-col justify-between gap-6 md:col-span-5 lg:col-span-8">
            <SelectorCanal grande />
            <p className="max-w-[38rem]">
              {t.cierre[0]} <Guino>{t.cierre[1]}</Guino>
            </p>
          </div>
        </div>
      </div>
      <Pisadas className="col-span-full mt-6" pasos={5} />
    </section>
  );
}
