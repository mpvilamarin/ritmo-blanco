import { Encabezado, ICONOS, Icono } from "./base";
import { ACTIVIDADES, DIAS } from "@/lib/rb";

/*
  Sustentabilidad sin cifras inventadas (BRIEF.md: "No inventes cifras de
  energía ni de residuos"). El único número es el de la OMS.
  Baja y compacta: el encabezado en una fila y las cuatro celdas, con su
  ícono de línea, en otra, separadas por filetes.
*/
export function Sustentabilidad() {
  const bicis = ACTIVIDADES.filter((a) => /bicis generadoras/i.test(a.descripcion));
  const celdas = [
    {
      icono: ICONOS.bici,
      rotulo: "Bicis generadoras",
      titulo: "Pedaleá tu energía",
      texto: "Cada bici generadora carga los auriculares que usa el público.",
      extra: bicis.map((a) => `${DIAS[a.dia - 1].fecha} · ${a.inicio} · ${a.titulo}`),
    },
    {
      icono: ICONOS.pisadas,
      rotulo: "Pisos cinéticos",
      titulo: "Cada paso cuenta",
      texto: "Placas que convierten cada pisada en energía para iluminar el predio.",
    },
    {
      icono: ICONOS.auriculares,
      rotulo: "Contaminación sonora",
      titulo: "0 parlantes",
      texto: "La OMS recomienda que un concierto no supere los 100 decibeles. Acá la música suena solo en tus auriculares.",
    },
    {
      icono: ICONOS.reciclar,
      rotulo: "Estructuras reutilizables",
      titulo: "Nos vamos como llegamos",
      texto: "Hidratación libre y compost. La instalación central está hecha con materiales recuperados.",
    },
  ];

  return (
    <section id="sustentabilidad" aria-labelledby="sus-titulo" className="compacta scroll-mt-4 bg-vino text-blanco">
      <div className="contenido">
        <Encabezado
          id="sus-titulo"
          rotulo="Un festival sustentable"
          titulo={["La energía", "la ponés vos"]}
          texto={<p>Ritmo Blanco funciona con lo que hace su público: pedalear, bailar y caminar. Lo que nos mueve también genera energía.</p>}
          claro
        />
        <ul className="grid border-t border-blanco/35 sm:grid-cols-2 lg:grid-cols-4">
          {celdas.map((c, i) => (
            <li
              key={c.titulo}
              className={`flex flex-col gap-2 border-b border-blanco/35 py-5 sm:px-5 lg:border-b-0 ${i % 2 ? "sm:border-l sm:border-blanco/35" : ""} ${
                i > 0 ? "lg:border-l lg:border-blanco/35" : ""
              } ${i % 2 === 0 ? "sm:pl-0" : ""} ${i === 2 ? "lg:pl-5" : ""}`}
            >
              <Icono d={c.icono} grosor={1.5} className="size-8 text-rosa" />
              <p className="rotulo mt-2">{c.rotulo}</p>
              <h3 className="t-3">{c.titulo}</h3>
              <p className="t-cuerpo">{c.texto}</p>
              {c.extra?.map((x) => (
                <p key={x} className="rotulo text-lila-palido">
                  {x}
                </p>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
