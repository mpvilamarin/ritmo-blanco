import fs from 'node:fs/promises';
import ts from 'typescript';
import { chromium } from 'playwright-core';
const source = await fs.readFile(new URL('../src/lib/chladni.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const api = {}; new Function('exports', compiled)(api);
const grains = api.generarGranos(55000, 1411, 'todos', undefined, 1);
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
  const sprites=['#721b35','#f08faa'].map(color=>{const c=document.createElement('canvas');c.width=c.height=24;const p=c.getContext('2d');const g=p.createRadialGradient(12,12,0,12,12,12);g.addColorStop(0,color);g.addColorStop(.3,color);g.addColorStop(1,'transparent');p.fillStyle=g;p.fillRect(0,0,24,24);return c});
  const draw=(x,y,r,tinta,alpha)=>{ctx.globalAlpha=alpha;ctx.drawImage(sprites[tinta],x-r,y-r,r*2,r*2)};
  for(const g of grains){
   const x=775+g.x*395+normal()*1.2,y=391+g.y*465+normal()*1.2;
   const radial=Math.hypot((x-775)/480,(y-391)/535);
   const proteger=(l,t,r,b)=>smooth(0,30,Math.hypot(Math.max(l-x,0,x-r),Math.max(t-y,0,y-b)));
   const texto=proteger(55,142,610,424)*proteger(55,459,610,555)*proteger(60,578,610,615);
   const pie=1-.96*smooth(665,700,y);
   const alpha=(1-smooth(.72,1.12,radial))*smooth(300,405,x)*smooth(0,38,y)*(1-smooth(744,783,y))*texto*pie*.75;
   if(alpha<.006)continue;
   draw(x,y,.25+g.radio*.65,g.tinta<.5?0:1,alpha);
  }
  // Una franja curva sale de la trama y se afina al aproximarse a la fecha.
  for(let i=0;i<13000;i++){
   const t=random(),u=1-t;
   const spread=2+19*u;
   const x=u*u*u*970+3*u*u*t*865+3*u*t*t*560+t*t*t*320+normal()*spread*.55;
   const y=u*u*u*360+3*u*u*t*429+3*u*t*t*434+t*t*t*443+normal()*spread;
   const alpha=(1-smooth(.45,1,t))*(1-smooth(452,466,y))*.55;
   draw(x,y,.22+random()**3*.85,random()<.66?0:1,alpha);
  }
  // Granos aislados: la nube termina por pérdida de densidad, no por recorte.
  for(let i=0;i<2200;i++){
   const x=760+normal()*185,y=391+normal()*240;
   if(x<325||x>1044||y<0||y>783)continue;
   if(x<640&&((y>120&&y<425)||(y>455&&y<625)))continue;
   const a=smooth(325,430,x)*smooth(0,30,y)*(1-smooth(750,783,y))*(y>690?.035:.24);
   draw(x,y,.2+random()*.55,random()<.5?0:1,a);
  }
  ctx.globalAlpha=1;
  const transparent=canvas.toDataURL('image/png').split(',')[1];
  ctx.globalCompositeOperation='destination-over';ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);
  return {transparent,white:canvas.toDataURL('image/png').split(',')[1]};
 },grains);
 for(const [name,data] of [['pieza-40x30-amplio-transparente',results.transparent],['pieza-40x30-amplio-fondo-blanco',results.white]]){
  await fs.writeFile(new URL(`../public/patrones/${name}.png`,import.meta.url),Buffer.from(data,'base64'));console.log(name+' — 4724 × 3543 px');
 }
}finally{await browser.close()}
