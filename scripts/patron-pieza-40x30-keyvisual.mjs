import fs from 'node:fs/promises';
import ts from 'typescript';
import { chromium } from 'playwright-core';
const source = await fs.readFile(new URL('../src/lib/chladni.ts', import.meta.url), 'utf8');
const prepared = source
 .replace('todos: [5, 7]', 'todos: [7, 9]')
 .replace('const espesor = 0.075 + 0.018', 'const espesor = 0.095 + 0.018')
 .replace('azar() < 0.5 ? -0.20 : 0.20', 'azar() < 0.5 ? -0.34 : 0.34');
const compiled = ts.transpileModule(prepared, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const api = {}; new Function('exports', compiled)(api);
const grains = api.generarGranos(155000, 1411, 'todos', undefined, 1.5);
const browser = await chromium.launch({ executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ignoreDefaultArgs:['--headless=old'], args:['--headless=new'] });
try {
 const page = await browser.newPage();
 const results = await page.evaluate(grains => {
  const width=4724,height=3543,W=1044,H=783;
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
  const ctx=canvas.getContext('2d');ctx.scale(width/W,height/H);
  let seed=1411;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
  const normal=()=>Math.sqrt(-2*Math.log(Math.max(.00001,random())))*Math.cos(2*Math.PI*random());
  const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
  const sprites=['#721b35','#f08faa'].map(color=>{const c=document.createElement('canvas');c.width=c.height=24;const p=c.getContext('2d');const g=p.createRadialGradient(12,12,0,12,12,12);g.addColorStop(0,color);g.addColorStop(.52,color);g.addColorStop(1,'transparent');p.fillStyle=g;p.fillRect(0,0,24,24);return c});
  const draw=(x,y,r,tinta,alpha)=>{ctx.globalAlpha=alpha;ctx.drawImage(sprites[tinta],x-r,y-r,r*2,r*2)};
  // Un único campo nodal: todas las curvas y ramificaciones pertenecen al patrón.
  const envolvente=(x,y)=>{
   const logo=Math.exp(-(((y-310)/220)**2));
   const arriba=Math.exp(-(((y-50)/100)**2));
   const inicio=290+210*logo-470*arriba;
   const fin=725+95*logo-545*arriba;
   const entrada=smooth(inicio,fin,x);
   return entrada*smooth(-12,20,y)*(1-smooth(665,795,y));
  };
  for(const g of grains){
   // Una deformación suave evita una repetición de celdas demasiado regular.
   const x=735+g.x*420+23*Math.sin(g.y*3.2);
   const y=380+g.y*440+26*Math.sin(g.x*3.7);
   if(x<0||x>W||y<0||y>H)continue;
   const densidad=envolvente(x,y);
   if(random()>densidad)continue;
   draw(x,y,.42+g.radio*.80,g.tinta<.5?0:1,.80);
  }
  ctx.globalAlpha=1;
  const transparent=canvas.toDataURL('image/png').split(',')[1];
  ctx.globalCompositeOperation='destination-over';ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);
  return {transparent,white:canvas.toDataURL('image/png').split(',')[1]};
 },grains);
 for(const [name,data] of [['pieza-40x30-keyvisual-transparente',results.transparent],['pieza-40x30-keyvisual-fondo-blanco',results.white]]){
  await fs.writeFile(new URL(`../public/patrones/${name}.png`,import.meta.url),Buffer.from(data,'base64'));console.log(name+' — 4724 × 3543 px');
 }
}finally{await browser.close()}
