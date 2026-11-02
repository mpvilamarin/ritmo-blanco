import fs from 'node:fs/promises';
import ts from 'typescript';
import { chromium } from 'playwright-core';
const source = await fs.readFile(new URL('../src/lib/chladni.ts', import.meta.url), 'utf8');
const prepared = source
 .replace('const espesor = 0.075 + 0.018', 'const espesor = 0.085 + 0.018')
 .replace('azar() < 0.5 ? -0.20 : 0.20', 'azar() < 0.5 ? -0.34 : 0.34');
const compiled = ts.transpileModule(prepared, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const api = {}; new Function('exports', compiled)(api);
const grains = api.generarGranos(72000, 1411, 'todos', undefined, 1);
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
  // Una sola envolvente orgánica, sin rectángulos de protección.
  const envolvente=(x,y)=>{
   const curva=Math.exp(-(((y-330)/235)**2));
   const entrada=smooth(325+150*curva,725+120*curva,x);
   const radial=Math.hypot((x-775)/530,(y-391)/555);
   return entrada*(1-smooth(.74,1.1,radial))*smooth(0,30,y)*(1-smooth(718,783,y));
  };
  for(const g of grains){
   const x=775+g.x*395,y=391+g.y*465;
   const densidad=envolvente(x,y);
   // Afinar la densidad por descarte conserva el color del grano restante.
   if(random()>densidad)continue;
   draw(x,y,.4+g.radio*.78,g.tinta<.5?0:1,.78);
  }
  // La franja hacia la fecha pierde granos a lo largo de toda su aproximación.
  for(let i=0;i<12000;i++){
   const t=random(),u=1-t;
   const x=u*u*u*1030+3*u*u*t*890+3*u*t*t*675+t*t*t*360;
   const centroY=u*u*u*345+3*u*u*t*430+3*u*t*t*434+t*t*t*440;
   const tinta=i%2;
   const ancho=2+4*u;
   const y=centroY+(tinta?6:-6)+normal()*ancho;
   if(random()>(1-smooth(.1,.95,t))*.8)continue;
   draw(x+normal()*2,y,.3+random()**2*.72,tinta,.76);
  }
  // Dos bandas separadas: cada una mantiene su pigmento sin entremezclarse.
  for(let i=0;i<24000;i++){
   const t=random(),u=1-t,tinta=i%2;
   const x=u*u*u*1055+3*u*u*t*790+3*u*t*t*385+t*t*t*36;
   const centroY=u*u*u*195+3*u*u*t*20+3*u*t*t*124+t*t*t*66;
   const y=centroY+(tinta?12:-12)+normal()*(3+2*Math.sin(Math.PI*t));
   const densidad=smooth(30,130,x)*smooth(0,28,y)*(1-smooth(130,175,y));
   if(random()>densidad)continue;
   draw(x+normal()*1.5,y,.35+random()**2*.8,tinta,.8);
  }
  ctx.globalAlpha=1;
  const transparent=canvas.toDataURL('image/png').split(',')[1];
  ctx.globalCompositeOperation='destination-over';ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);
  return {transparent,white:canvas.toDataURL('image/png').split(',')[1]};
 },grains);
 for(const [name,data] of [['pieza-40x30-limpio-transparente',results.transparent],['pieza-40x30-limpio-fondo-blanco',results.white]]){
  await fs.writeFile(new URL(`../public/patrones/${name}.png`,import.meta.url),Buffer.from(data,'base64'));console.log(name+' — 4724 × 3543 px');
 }
}finally{await browser.close()}
