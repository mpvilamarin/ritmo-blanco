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
| `src/components/pisadas.tsx` | Huellas que aparecen al scrollear |
| `src/components/canal.tsx` | Selector de canal y barra fija |
| `src/components/programa.tsx` | Pestañas por día, line-up, cierre, actividades y filtros |
| `src/components/mapa.tsx` | Mapa del predio |
| `src/lib/estado.ts` | Canal elegido y filtros, compartidos entre secciones |

## Decisiones

**Una sola página.** Casi todos llegan desde el QR o las redes, desde el celular: una página con anclas se recorre con el pulgar y no hace esperar entre secciones. El orden es el de una visita: qué es, cómo funciona, programa, dónde queda cada cosa, cómo participar desde casa, qué cuidamos, info práctica.

**Elegir canal es la interacción central.** La barra fija (abajo en el celular, arriba en escritorio) repite el CTA en todas las pantallas. Elegir un canal hace tres cosas: la arena se sacude y se reacomoda en la figura de ese canal, tu artista pasa adelante y más grande en cada franja del line-up, y la barra dice qué estás escuchando. Tocar el canal elegido lo suelta y los tres vuelven a pesar igual. Se guarda en el navegador. Si es un día del festival entre las 21:30 y las 23:00, la barra avisa que todo el parque escucha lo mismo.

**La arena es calculada, no dibujada.** Cada canal es un modo de vibración de la placa. Los granos se juntan donde la placa no vibra, y una leve deformación del plano da la figura orgánica del afiche. El cierre suma los tres modos: blanco es la suma de los canales. El gesto es vibrar y volver al reposo: cuando la figura se asienta, el cálculo se detiene.

**El degradé acompaña el scroll.** Arriba, frío (lila, azul gris); hacia el final, cálido (rosa, melocotón, crema), como el recorrido continuo del pliego. Las capas de la página son claras a propósito: el vino pasa al menos 7:1 en cualquier punto. La portada usa el degradé profundo del afiche con texto blanco. Para que el texto chico pase 4.5:1 sobre la arena, la zona del texto se oscurece con lila oscuro mezclado con vino, nunca con negro.

**Retícula y jerarquía.** Sin tarjetas, sombras ni esquinas redondeadas. La jerarquía la da la tipografía (Grotesk para nombres y horas, Plex Mono para datos) y las divisiones son filetes de 1 px en vino. El programa repite la columna impresa: hora grande, tipo con contorno y o de modalidad arriba, zona abajo. La destacada lleva foto y fondo rosa.

**Un solo guiño por sección.** El recuadro rosa marca una frase por bloque: *ruidoso*, *todo el parque escucha lo mismo*, *nadie se ofende*, *tus vecinos tampoco se van a enterar*, *solo en tus auriculares*, *(en silencio)*.

**El mapa conecta con el programa.** Tocar una zona (en el mapa o en la leyenda) filtra las actividades y lleva al programa. Si ese día no hay nada en la zona, la web dice en qué otro día sí hay.

## Accesibilidad

- Contraste medido sobre el render real; el texto chico pasa 4.5:1.
- Todo funciona con teclado: enlace para saltar al programa, selector de canal y pestañas con flechas, zonas del mapa con Enter.
- `prefers-reduced-motion`: la arena aparece ya asentada, las huellas no se desplazan, el degradé no se mueve y el scroll es instantáneo.
- Sin desborde horizontal a 320, 375 y 768 px.

## Pendientes

- **Logo:** `public/logo-boceto.png` es un recorte de `LOGOS-03.jpg`, recoloreado con un filtro. Reemplazarlo por el SVG final (en `Logo`, dentro de `signos.tsx`).
- **Tipografía:** Sets Grotesk está solo en Adobe Fonts; por ahora se ve con Space Grotesk. Para usar el kit, ver el comentario en `src/app/layout.tsx`.
- **Fotos:** las de prensa de los artistas y las de las actividades destacadas son placeholders. No se usan imágenes generadas de artistas reales.
- **Sponsors:** van como nombres en vino hasta tener los logos en un solo color.
- **Contraste a revisar:** el blanco sobre Lila oscuro (`#767498`, zona Usina Bailable) da 4.45:1, apenas debajo de 4.5:1, en las etiquetas chicas. Viene del JSON y del brief, así que no se cambió.
