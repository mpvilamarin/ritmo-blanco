import { Guino } from "../signos";
import { Titulo } from "../titulo";
import { sitio } from "@/lib/programa";

/* Sustentabilidad: cada idea como titular bold/light. Sin cifras inventadas. */
export function Rastro() {
  const t = sitio.rastro;
  return (
    <section id="rastro" aria-labelledby="rastro-titulo" className="reticula gap-y-10 pt-20 md:pt-28">
      <div id="rastro-titulo" className="col-span-3 md:col-span-4 lg:col-span-5">
        <Titulo fuerte={t.titulo[0]} suave={t.titulo[1]} max={130} className="text-6xl" />
      </div>
      <ul className="col-span-full grid gap-10 md:grid-cols-2 md:gap-x-6 lg:grid-cols-4">
        {t.items.map((item) => (
          <li key={item.fuerte} className="filete pt-4">
            <div className="w-3/4 md:w-full">
              <Titulo as="h3" fuerte={item.fuerte} suave={item.suave} max={110} className="text-5xl" />
            </div>
            <p className="mt-4">
              {item.texto} {"guino" in item && <Guino>{item.guino}</Guino>}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
