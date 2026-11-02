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
  // Campo topográfico continuo: los núcleos se conectan por bandas concéntricas.
  const envolvente=(x,y)=>{
   const logo=Math.exp(-(((y-310)/220)**2));
   const arriba=Math.exp(-(((y-40)/110)**2));
   return smooth(260+205*logo-450*arriba,710+95*logo-540*arriba,x)
    *smooth(-10,18,y)*(1-smooth(680,795,y));
  };
  const centros=[
   [967,65,145,120,1.95],
   [765,325,115,128,1.85],
   [1005,510,130,122,1.9],
   [725,700,150,102,1.85],
   [355,-65,215,150,1.65],
   [665,70,95,100,1.35],
  ];
  const campo=(x,y)=>{
   const u=x+22*Math.sin(y*.012)+12*Math.sin(y*.026+x*.005);
   const v=y+18*Math.sin(x*.011)-8*Math.cos(y*.017);
   let z=.09*Math.sin(x*.008+y*.004);
   for(const[cx,cy,rx,ry,a]of centros)z+=a*Math.exp(-.5*(((u-cx)/rx)**2+((v-cy)/ry)**2));
   return z;
  };
  let aceptados=0;
  for(let i=0;i<5000000&&aceptados<260000;i++){
   const x=random()*W,y=random()*H;
   const z=campo(x,y);
   const nivel=Math.round(z/.19);
   const d=Math.abs(z-nivel*.19);
   const anchura=.022+.006*Math.sin(x*.02+y*.012);
   const densidad=Math.exp(-.5*(d/anchura)**2)*envolvente(x,y);
   if(random()>densidad)continue;
   // Un nivel por pigmento: las bandas son densas, pero no mezclan tintas.
   const tinta=((nivel%2)+2)%2;
   draw(x,y,.22+random()**2*.72,tinta,.78);
   aceptados++;
  }
  ctx.globalAlpha=1;
  const transparent=canvas.toDataURL('image/png').split(',')[1];
  ctx.globalCompositeOperation='destination-over';ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);
  return {transparent,white:canvas.toDataURL('image/png').split(',')[1]};
 },grains);
 for(const [name,data] of [['pieza-40x30-resonancias-transparente',results.transparent],['pieza-40x30-resonancias-fondo-blanco',results.white]]){
  await fs.writeFile(new URL(`../public/patrones/${name}.png`,import.meta.url),Buffer.from(data,'base64'));console.log(name+' — 4724 × 3543 px');
 }
}finally{await browser.close()}
