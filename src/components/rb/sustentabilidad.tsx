import { Encabezado, Flecha, Foto, boton } from "./base";
import { BotonPrograma } from "./boton-programa";
import { ACTIVIDADES, DIAS } from "@/lib/rb";
import { NOMBRE_MODALIDAD } from "@/lib/programa";

/*
  Sustentabilidad sin cifras inventadas (BRIEF.md: "No inventes cifras de
  energía ni de residuos"). El único número es el de la OMS, con su fuente.
  Cuatro celdas de la grilla separadas por filetes.
*/
export function Sustentabilidad() {
  const repaso = ACTIVIDADES.find((a) => a.titulo === "¿Cuánta energía hicimos?");
  const bicis = ACTIVIDADES.filter((a) => /bicis generadoras/i.test(a.descripcion));
  const celdas = [
    {
      rotulo: "Bicis generadoras · Usina Bailable",
      titulo: "Pedaleá tu energía",
      texto: "Cada bici generadora carga los auriculares que usa el público. Lo que pedaleás vuelve como música.",
      extra: bicis.map((a) => `${DIAS[a.dia - 1].fecha} · ${a.inicio} · ${a.titulo}`),
    },
    {
      rotulo: "Pisos cinéticos · Usina Bailable",
      titulo: "Cada paso cuenta",
      texto: "Placas que convierten cada pisada en energía para iluminar el predio. Cuanto más bailás, más se prende la pista.",
    },
    {
      rotulo: "Contaminación sonora",
      titulo: "0 parlantes",
      texto:
        "La OMS recomienda que un concierto no supere los 100 decibeles en promedio (Norma mundial para lugares y eventos de escucha segura, 2022). Acá la música suena solo en tus auriculares.",
    },
    {
      rotulo: "Estructuras reutilizables",
      titulo: "Nos vamos como llegamos",
      texto: "Estructuras reutilizables, hidratación libre y compost. La instalación central está hecha con materiales recuperados.",
    },
  ];

  return (
    <section id="sustentabilidad" aria-labelledby="sus-titulo" className="banda contenido scroll-mt-4">
      <Encabezado
        id="sus-titulo"
        rotulo="Un festival sustentable"
        titulo={["La energía", "la ponés vos"]}
        texto={
          <p>
            Ritmo Blanco funciona con lo que hace su público: pedalear, bailar, caminar. Lo que no se genera ahí, se ahorra con un festival
            que no necesita parlantes.
          </p>
        }
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <Foto texto="[FOTO] Instalación con materiales recuperados" className="min-h-[280px]" />
        <ul className="grid border-t border-vino sm:grid-cols-2">
          {celdas.map((c, i) => (
            <li key={c.titulo} className={`flex flex-col gap-3 border-b border-vino py-6 ${i % 2 ? "sm:border-l sm:pl-6" : "sm:pr-6"}`}>
              <p className="rotulo">{c.rotulo}</p>
              <h3 className="t-2">{c.titulo}</h3>
              <p className="t-chico">{c.texto}</p>
              {c.extra?.map((x) => (
                <p key={x} className="rotulo text-lila-oscuro">
                  {x}
                </p>
              ))}
            </li>
          ))}
        </ul>
      </div>

      {repaso && (
        <div className="mt-10 flex flex-wrap items-end justify-between gap-6 bg-crema p-6 md:p-8">
          <div>
            <p className="rotulo">
              {DIAS[repaso.dia - 1].fecha} · {repaso.inicio} · {repaso.zona} · {NOMBRE_MODALIDAD[repaso.modalidad]}
            </p>
            <h3 className="t-2 mt-3">{repaso.titulo}</h3>
            <p className="t-chico mt-2 max-w-[40rem]">{repaso.descripcion}</p>
          </div>
          <BotonPrograma
            filtro={{ dia: repaso.dia, vista: "actividades", tipo: null, modalidad: null, zona: null, abierta: repaso.clave }}
            className={boton("vino")}
          >
            Verlo en el programa
            <Flecha />
          </BotonPrograma>
        </div>
      )}
    </section>
  );
}
