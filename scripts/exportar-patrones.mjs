import fs from 'node:fs/promises';
import ts from 'typescript';
import { chromium } from 'playwright-core';

const source = await fs.readFile(new URL('../src/lib/chladni.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const api = {};
new Function('exports', compiled)(api);
const output = new URL('../public/patrones/', import.meta.url);
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ignoreDefaultArgs: ['--headless=old'], args: ['--headless=new'] });
try {
  const page = await browser.newPage();
  for (const [name, perfil] of [['01-resonancia', 'todos'], ['02-ondas', 'sinte'], ['03-pulso', 'pulso']]) {
    const grains = api.generarGranos(32000, 1411, perfil, undefined, 1);
    const png = await page.evaluate(grains => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 2400;
      const ctx = canvas.getContext('2d');
      ctx.scale(3, 3);
      const colors = ['#721b35', '#f08faa'];
      const sprites = colors.map(color => {
        const sprite = document.createElement('canvas'); sprite.width = sprite.height = 24;
        const c = sprite.getContext('2d');
        const gradient = c.createRadialGradient(12, 12, 0, 12, 12, 12);
        gradient.addColorStop(0, color); gradient.addColorStop(.3, color); gradient.addColorStop(1, 'transparent');
        c.globalAlpha = .72; c.fillStyle = gradient; c.fillRect(0, 0, 24, 24);
        return sprite;
      });
      for (const grain of grains) {
        const x = 400 + grain.x * 360, y = 400 + grain.y * 360;
        const r = (0.65 + grain.radio * 1.9) * 1.3;
        ctx.drawImage(sprites[Math.min(1, Math.floor(grain.tinta * 2))], x-r, y-r, r*2, r*2);
      }
      // Disolver el pigmento antes de que alcance los bordes del formato.
      ctx.globalCompositeOperation = 'destination-in';
      const mask = ctx.createRadialGradient(400, 400, 265, 400, 400, 390);
      mask.addColorStop(0, '#000'); mask.addColorStop(1, 'transparent');
      ctx.fillStyle = mask; ctx.fillRect(0, 0, 800, 800);
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 800, 800);
      return canvas.toDataURL('image/png').split(',')[1];
    }, grains);
    await fs.writeFile(new URL(`${name}.png`, output), Buffer.from(png, 'base64'));
    console.log(`${name}.png: ${grains.length} granos, 2400 × 2400 px`);
  }
} finally { await browser.close(); }
