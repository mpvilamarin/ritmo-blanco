import fs from 'node:fs/promises';
import zlib from 'node:zlib';
import sharp from 'sharp';
const profile='/Library/Application Support/Adobe/Color/Profiles/Recommended/UncoatedFOGRA29.icc';
const icc=await fs.readFile(profile);
const bytes=s=>Buffer.from(s,'binary');
const stream=(dictionary,data)=>Buffer.concat([bytes(`<< ${dictionary} /Length ${data.length} >>\nstream\n`),data,bytes('\nendstream')]);
for(const variant of (process.argv[2] ? [process.argv[2]] : ['duo','lila','lila-claro'])){
 const base=process.argv[2] ? `public/patrones/${variant}` : `public/patrones/pieza-40x30-contraste-${variant}`;
 const {data,info}=await sharp(`${base}-fondo-blanco.png`).withIccProfile(profile).toColourspace('cmyk').removeAlpha().raw().toBuffer({resolveWithObject:true});
 if(info.channels!==4)throw new Error('Se requieren cuatro canales CMYK');
 const w=400/25.4*72,h=300/25.4*72;
 const content=bytes(`q ${w} 0 0 ${h} 0 0 cm /Im0 Do Q`);
 const objs=[
 bytes('<< /Type /Catalog /Pages 2 0 R /OutputIntents [7 0 R] >>'),
 bytes('<< /Type /Pages /Count 1 /Kids [3 0 R] >>'),
 bytes(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>`),
 stream('',content),
 stream(`/Type /XObject /Subtype /Image /Width ${info.width} /Height ${info.height} /ColorSpace [/ICCBased 6 0 R] /BitsPerComponent 8 /Filter /FlateDecode`,zlib.deflateSync(data)),
 stream('/N 4 /Alternate /DeviceCMYK',icc),
 bytes('<< /Type /OutputIntent /S /GTS_PDFX /OutputConditionIdentifier (FOGRA29) /Info (Uncoated FOGRA29 - provisional, confirm with printer) /DestOutputProfile 6 0 R >>'),
 ];
 const parts=[bytes('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')];let offset=parts[0].length;const offsets=[0];
 objs.forEach((obj,i)=>{offsets.push(offset);const part=Buffer.concat([bytes(`${i+1} 0 obj\n`),obj,bytes('\nendobj\n')]);parts.push(part);offset+=part.length;});
 const xref=offset;
 parts.push(bytes(`xref\n0 ${objs.length+1}\n0000000000 65535 f \n`+offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n \n').join('')+`trailer\n<< /Size ${objs.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`));
 await fs.writeFile(`${base}-CMYK-FOGRA29.pdf`,Buffer.concat(parts));console.log(variant,info.channels+' canales CMYK, 400 × 300 mm, FOGRA29');
}
