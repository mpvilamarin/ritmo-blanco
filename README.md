# Ritmo Blanco · web

Web del festival Ritmo Blanco (Diseño Gráfico 3, cátedra Belluccia, TP4). Next.js + Tailwind CSS, exportada como sitio estático: no necesita servidor.

## Correr

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # genera out/, listo para subir a cualquier hosting estático
```

## Contenido

- `data/programa.json`: el programa completo (line-up, cierres, actividades, zonas). Es la fuente única: la web no tiene programa escrito a mano.
- `data/sitio.json`: los textos del brief que no son programa (cómo funciona, sustentabilidad, información práctica, sponsors).
- Lo que falta va entre corchetes y se ve subrayado: `[LÍNEAS]`, `[A DEFINIR]`, `[FOTO]`, `[FOTO DE PRENSA]`.

## Dónde está cada cosa

| Archivo | Qué hace |
|---|---|
| `src/app/globals.css` | **Única fuente de color**, escala tipográfica, retícula. Los componentes usan variables (`var(--color-…)` o clases de Tailwind), nunca hex. Roles: `--color-tinta`, `--color-recuadro`, `--color-zona-*` |
| `src/lib/rb.ts` | Datos derivados del JSON (fechas, totales, shows) y `PALETA` como variables |
| `src/components/rb/` | Las secciones de la página, en orden de aparición |
| `src/components/sistema.tsx` | Marca, recuadro rosa (`Guino`) y bold/light |
| `src/components/signos.tsx` | Signos de canal, modalidad, tipo y zona |
| `src/components/arena.tsx` | Arena de Chladni en canvas |
| `src/components/rio.tsx` | Degradé difuso que atraviesa la portada |
| `src/components/cronograma.tsx` | Pliego A3 imprimible (`/cronograma`, `npm run pdf`) |

**Paleta v3 (propuesta, sin confirmar):** abrir la web con `?paleta=v3` para verla. Está en el bloque `[data-paleta="v3"]` de `globals.css`; si se confirma, sus valores pasan a `@theme`.

**Fechas y cifras:** salen de `programa.json` (`FECHAS` y `TOTALES` en `src/lib/rb.ts`). No escribir "14 al 17" ni cantidades a mano.

## Decisiones

**Fondo claro, recursos de festival.** La web mantiene el degradé claro del impreso (frío arriba, cálido hacia el final) y suma recursos de sitio de evento: franjas en movimiento, cuenta regresiva, carrusel de artistas y listas grandes. Sin negro ni grises: los oscuros son vino.

**Portada.** El nombre ocupa la pantalla en dos líneas del mismo ancho (bold/light) y sangra por los bordes. Lo pisa una foto en collage con arena de Chladni adentro y lo cruza un trazo de Lissajous 3:2, otro recurso del sistema. Debajo van el titular con el guiño y la cuenta regresiva al 14.11 a las 14:00, hora de Buenos Aires, que durante y después del festival cambia de mensaje.

**Los canales como tres círculos.** "Qué es" muestra los tres canales como círculos que se cruzan. Donde se superponen los tres está el blanco: la suma de los canales, que es el concepto del festival. Tocar un círculo elige el canal (con teclado: flechas y Enter). Alrededor de cada círculo corren sus artistas, tomados del JSON.

**Carrusel de artistas.** Están todos los del JSON, incluidos los cierres, en círculos de dos tamaños con ritmo grande / par / par, sobre una banda crema. Cada círculo lleva el color de su canal y el placeholder `[FOTO DE PRENSA]`. Elegir un canal trae a sus artistas adelante. La barra de progreso y las flechas reemplazan la barra de scroll.

**Retícula a la vista.** Las columnas se marcan con filetes muy suaves que atraviesan toda la página. Los bloques se apoyan en ellas pero las rompen (el nombre de la portada, los círculos, las bandas), para que se vea una grilla y no una plantilla.

**Separaciones con ondas de Chladni.** Los bordes de las bandas y los separadores son curvas nodales calculadas con la misma fórmula que la arena: cada separación es un modo distinto, con una línea de granos encima.

**Programa, mapa y "desde casa".** El programa conserva la columna impresa, el mapa filtra el programa y "Desde casa" es una lista de nombres grandes con el dato chico al lado.

**Un solo guiño por sección** en recuadro rosa.

## Accesibilidad

- Contraste medido sobre el render real; el texto chico pasa 4.5:1.
- Todo funciona con teclado: enlace para saltar al programa, selector de canal y pestañas con flechas, zonas del mapa con Enter.
- `prefers-reduced-motion`: la arena aparece ya asentada, las franjas quedan quietas, las huellas no se desplazan, el degradé no se mueve y el scroll es instantáneo.
- Sin desborde horizontal a 320, 375 y 768 px.

## Pendientes

Lo marcado como **propuesta** está en la web pero no está confirmado:

- **Paleta v3** (propuesta): se ve con `?paleta=v3`. Se cierra con el afiche.
- **CTA "Reservá tus auriculares"** (propuesta): en portada, menú y reserva. La reserva en un paso (DNI y día) todavía no está hecha: hoy son tres pasos.
- **Gesto "la arena se ordena"** (propuesta): `Arena` en `src/components/arena.tsx`. La duración está en `DURACION_GESTO`; con movimiento reducido se ve la figura quieta.
- **Portada** provisoria hasta que esté el KV nuevo.
- **Logo:** `public/marca/logo-*.png` (versión con cola). Cuando se elija la B, reemplazar por el SVG en `Marca` (`src/components/sistema.tsx`).
- **Favicon:** hoy es el de Next (`src/app/favicon.ico`). Cuando exista la versión reducida del logo, borrar ese archivo y poner `src/app/icon.svg`.
- **Tipografía:** Sets Grotesk está solo en Adobe Fonts; por ahora se ve con Schibsted Grotesk, que no tiene light (la línea light sale en 400). Para usar el kit, ver el comentario en `src/app/layout.tsx`.
- **Fotos:** las de prensa de los artistas y las de las actividades destacadas son placeholders. No se usan imágenes generadas de artistas reales.
- **Sponsors:** van como nombres en vino hasta tener los logos en un solo color.
- **Contraste:** el blanco sobre lila oscuro (`#767498`) da 4.45:1 en texto chico. La v3 lo corrige (violeta, 5.2:1).
- **PDF del programa:** `public/ritmo-blanco-cronograma.pdf` sale del pliego A3 de la web. Cuando esté el programa A2, reemplazarlo por ese.
