/**
 * Prepara la silueta que alimenta el cromo del hero.
 *
 * MetallicPaint usa el canal alfa como forma y pide entre 500 y 1000 px;
 * el logo original son 400, así que se reescala a 1000 y se endurece el
 * borde del alfa para que el contorno no quede lavado al ampliar.
 *
 *   node scripts/logo-chrome-src.mjs
 */

import puppeteer from 'puppeteer-core';
import fs from 'node:fs/promises';
const b = await puppeteer.launch({ executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe', headless:'new', args:['--no-sandbox'] });
const p = await b.newPage(); await p.goto('about:blank');
const raw = await fs.readFile('C:/Users/papip/Desktop/HW_page/public/img/logo.png');
const out = await p.evaluate(async (d) => {
  const img = new Image(); img.src = 'data:image/png;base64,' + d; await img.decode();
  const S = 1000;
  const c = document.createElement('canvas'); c.width = S; c.height = S;
  const ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, S, S);
  /* El shader usa el alfa como silueta: se endurece un poco el borde para
     que el contorno no quede lavado al ampliar. */
  const im = ctx.getImageData(0, 0, S, S); const D = im.data;
  for (let i = 3; i < D.length; i += 4) {
    const a = D[i] / 255;
    D[i] = Math.round(Math.max(0, Math.min(1, (a - 0.35) / 0.3)) * 255);
  }
  ctx.putImageData(im, 0, 0);
  let op = 0; for (let i = 3; i < D.length; i += 4) if (D[i] > 200) op++;
  return { d: c.toDataURL('image/png').split(',')[1], cobertura: (op / (S * S) * 100).toFixed(1) };
}, raw.toString('base64'));
const buf = Buffer.from(out.d, 'base64');
await fs.writeFile('C:/Users/papip/Desktop/HW_page/public/img/logo-chrome-src.png', buf);
console.log(`  logo-chrome-src.png  1000x1000  ${(buf.length/1024).toFixed(0)}kb  ·  ${out.cobertura}% de silueta opaca`);
await b.close();
