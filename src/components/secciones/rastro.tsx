import { Encabezado } from "../recursos";
import { Guino } from "../signos";
import { Titulo } from "../titulo";
import { sitio } from "@/lib/programa";

/* Sustentabilidad: cada idea como titular bold/light. Sin cifras inventadas. */
export function Rastro() {
  const t = sitio.rastro;
  return (
    <div className="reticula gap-y-12">
      <Encabezado id="rastro-titulo" rotulo={t.rotulo} titulo={t.titulo} />
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
    </div>
  );
}
