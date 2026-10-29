// Genera public/ritmo-blanco-cronograma.pdf a partir de /cronograma, en una sola hoja A3 apaisada.
// Uso: con `npm run dev` corriendo, `npm run pdf` (opcional: URL=http://localhost:3005).
import { chromium } from "playwright-core";

const URL = process.env.URL ?? "http://localhost:3000";
const CHROME = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
// A3 apaisado a 96 ppp
const ANCHO = 1588;
const ALTO = 1123;

const navegador = await chromium.launch({ executablePath: CHROME });
const pagina = await navegador.newPage({ viewport: { width: ANCHO, height: ALTO } });
await pagina.goto(`${URL}/cronograma`, { waitUntil: "networkidle" });
await pagina.evaluate(() => document.fonts.ready);

// Busca la escala con la que el pliego entra en una hoja: a menor escala, la
// página se diagrama más ancha (y por eso más baja) y después se reduce.
let escala = 1;
for (let i = 0; i < 6; i++) {
  await pagina.setViewportSize({ width: Math.round(ANCHO / escala), height: Math.round(ALTO / escala) });
  await pagina.waitForTimeout(200);
  const alto = await pagina.evaluate(() => document.querySelector("main").scrollHeight);
  const necesaria = ALTO / alto;
  if (Math.abs(necesaria - escala) < 0.005) break;
  escala = Math.min(1, necesaria);
}
await pagina.pdf({ path: "public/ritmo-blanco-cronograma.pdf", width: "420mm", height: "297mm", printBackground: true, scale: escala, pageRanges: "1" });
await navegador.close();
console.log(`Listo: public/ritmo-blanco-cronograma.pdf (escala ${escala.toFixed(2)})`);
