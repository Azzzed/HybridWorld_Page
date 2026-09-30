/**
 * Recorta el fondo negro de la foto del hero y la deja en WebP con alfa.
 *
 * Relleno por inundación desde los bordes: solo se borra el negro CONECTADO
 * al borde, así los oscuros interiores (neumáticos, lunas) quedan intactos.
 * En el fondo el alfa sigue a la luminancia, de modo que la sombra suave del
 * estudio se conserva como semitransparencia.
 *
 *   node scripts/cutout-hero.mjs
 */

import puppeteer from 'puppeteer-core';
import fs from 'node:fs/promises';

const SRC = 'C:/Users/papip/Desktop/HW_page/assets-src/prius-cliente/prius-negro.jpg';
const OUT = 'C:/Users/papip/Desktop/HW_page/public/img/prius/prius-hero.webp';
const MAX_W = 1800;

const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--no-sandbox'] });
const p = await b.newPage();
await p.goto('about:blank');

const raw = await fs.readFile(SRC);
const res = await p.evaluate(async (data, maxW) => {
  const img = new Image();
  img.src = 'data:image/jpeg;base64,' + data;
  await img.decode();

  const s = Math.min(1, maxW / img.naturalWidth);
  const W = Math.round(img.naturalWidth * s);
  const H = Math.round(img.naturalHeight * s);
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, W, H);

  const im = ctx.getImageData(0, 0, W, H);
  const D = im.data;
  const lum = new Uint8Array(W * H);
  for (let i = 0, j = 0; i < D.length; i += 4, j++) {
    lum[j] = 0.299 * D[i] + 0.587 * D[i + 1] + 0.114 * D[i + 2];
  }

  /* Inundación desde los bordes: solo se toca el negro CONECTADO al borde,
     así los oscuros interiores (neumáticos, lunas) quedan intactos. */
  const FILL = 26;
  const bg = new Uint8Array(W * H);
  const stack = [];
  for (let x = 0; x < W; x++) { stack.push(x, x + (H - 1) * W); }
  for (let y = 0; y < H; y++) { stack.push(y * W, y * W + W - 1); }

  while (stack.length) {
    const i = stack.pop();
    if (bg[i] || lum[i] > FILL) continue;
    bg[i] = 1;
    const x = i % W, y = (i / W) | 0;
    if (x > 0) stack.push(i - 1);
    if (x < W - 1) stack.push(i + 1);
    if (y > 0) stack.push(i - W);
    if (y < H - 1) stack.push(i + W);
  }

  /* En el fondo, el alfa sigue a la luminancia: el negro puro desaparece y
     la sombra suave del estudio se conserva como semitransparencia. */
  const LO = 4, HI = 34;
  let quitados = 0;
  for (let j = 0; j < bg.length; j++) {
    if (!bg[j]) continue;
    const a = Math.max(0, Math.min(1, (lum[j] - LO) / (HI - LO)));
    D[(j << 2) + 3] = Math.round(a * 255);
    if (a < 0.02) quitados++;
  }
  ctx.putImageData(im, 0, 0);

  return {
    d: c.toDataURL('image/webp', 0.9).split(',')[1],
    w: W, h: H,
    transparente: (quitados / (W * H) * 100).toFixed(1),
  };
}, raw.toString('base64'), MAX_W);

const buf = Buffer.from(res.d, 'base64');
await fs.writeFile(OUT, buf);
console.log(`  ${res.w}x${res.h}  ${(buf.length / 1024).toFixed(0)}kb  ·  ${res.transparente}% del lienzo quedó transparente`);
await b.close();
