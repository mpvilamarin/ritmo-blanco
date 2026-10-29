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
| `src/app/globals.css` | Paleta, retícula (4/8/12 columnas), rótulos, degradé y grano |
| `src/components/titulo.tsx` | Regla bold/light: dos líneas del mismo ancho |
| `src/components/signos.tsx` | Signos de canal, modalidad, tipo, zona, recuadro rosa, logo y placeholders |
| `src/components/arena.tsx` | Arena de Chladni en canvas |
| `src/components/recursos.tsx` | Franjas, bandas y separadores con curvas nodales, encabezados, retícula visible |
| `src/components/cuenta.tsx` | Cuenta regresiva |
| `src/components/artistas.tsx` | Carrusel de artistas |
| `src/components/pisadas.tsx` | Huellas que aparecen al scrollear |
| `src/components/canal.tsx` | Selector de canal y barra fija |
| `src/components/programa.tsx` | Pestañas por día, line-up, cierre, actividades y filtros |
| `src/components/mapa.tsx` | Mapa del predio |
| `src/lib/estado.ts` | Canal elegido y filtros, compartidos entre secciones |

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

- **Logo:** `public/logo-boceto.png` es un recorte de `LOGOS-03.jpg`, recoloreado con un filtro. Reemplazarlo por el SVG final (en `Logo`, dentro de `signos.tsx`).
- **Tipografía:** Sets Grotesk está solo en Adobe Fonts; por ahora se ve con Space Grotesk. Para usar el kit, ver el comentario en `src/app/layout.tsx`.
- **Fotos:** las de prensa de los artistas y las de las actividades destacadas son placeholders. No se usan imágenes generadas de artistas reales.
- **Sponsors:** van como nombres en vino hasta tener los logos en un solo color.
- **Contraste a revisar:** el blanco sobre Lila oscuro (`#767498`, zona Usina Bailable) da 4.45:1, apenas debajo de 4.5:1, en las etiquetas chicas. Viene del JSON y del brief, así que no se cambió.
# ritmo-blanco
