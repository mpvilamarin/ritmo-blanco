import { boton } from "./base";
import { Marca } from "../sistema";
import { FECHAS } from "@/lib/rb";
import { sitio } from "@/lib/programa";

/* Logos en public/Sponsors: el archivo lleva la primera palabra del sponsor */
const logo = (s: string) => `/Sponsors/${s.split(" ")[0]}.svg`;

/* Pie: marca, acciones, sponsors en una franja propia (mismo peso, un solo color) y créditos */
export function Pie() {
  return (
    <footer className="overflow-hidden bg-vino text-blanco">
      <div className="contenido">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Marca tinta="blanco" className="w-[clamp(120px,12vw,160px)]" />
            <p className="t-3 mt-3">Ni ruido ni residuo.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="#reserva" className={boton("claro")}>
              Reservá tus auriculares
            </a>
            <a href="#desde-casa" className={boton("bordeClaro")}>
              Mirá desde casa
            </a>
          </div>
        </div>
        <div className="mt-6 grid gap-6 border-t border-blanco/30 pt-4 md:grid-cols-[10rem_1fr]">
          <p className="rotulo">Acompañan</p>
          <ul aria-label="Sponsors" className="grid grid-cols-2 items-center gap-x-6 gap-y-8 sm:grid-cols-4">
            {sitio.sponsors.map((s) => (
              <li key={s}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo(s)} alt={s} loading="lazy" className="h-8 w-auto max-w-[9rem] opacity-90 [filter:brightness(0)_invert(1)]" />
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-5 flex flex-wrap justify-between gap-3 border-t border-blanco/30 pt-4">
          <p className="rotulo">{FECHAS.larga} de 2026 · Festival silencioso y sustentable</p>
          <p className="rotulo text-lila-palido">{sitio.credito}</p>
        </div>
      </div>
    </footer>
  );
}
