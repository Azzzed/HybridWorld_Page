// Exporta un MP4 fotograma a fotograma para el hero, sin ffmpeg: el navegador
// los decodifica con WebCodecs (extract.html) y este servidor los guarda.
//
//   node scripts/video-frames/server.mjs <video.mp4> <carpeta de salida>
//
// y después se abre http://127.0.0.1:5199/?w=1280&q=0.78 en Chrome o Edge.
// Parámetros y pasos completos: docs/hero-video.md.
import { createServer } from 'node:http'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const [video, outDir] = process.argv.slice(2)

if (!video || !outDir) {
  console.error('Uso: node scripts/video-frames/server.mjs <video.mp4> <carpeta de salida>')
  process.exit(1)
}

const out = resolve(outDir)
mkdirSync(out, { recursive: true })

createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')

  if (req.method === 'GET' && url.pathname === '/') {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
    return res.end(readFileSync(join(here, 'extract.html')))
  }

  if (req.method === 'GET' && url.pathname === '/video.mp4') {
    res.writeHead(200, { 'content-type': 'video/mp4' })
    return res.end(readFileSync(video))
  }

  if (req.method === 'POST' && url.pathname === '/frame') {
    const name = url.searchParams.get('name') || ''
    // Solo nombres simples: nada de rutas
    if (!/^[\w.-]+$/.test(name)) {
      res.writeHead(400)
      return res.end('nombre no válido')
    }
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      writeFileSync(join(out, name), Buffer.concat(chunks))
      res.writeHead(200)
      res.end('ok')
    })
    return
  }

  if (url.pathname === '/log') {
    console.log(decodeURIComponent(url.search.slice(1)))
    res.writeHead(200)
    return res.end('ok')
  }

  res.writeHead(404)
  res.end()
}).listen(5199, '127.0.0.1', () => {
  console.log(`Abre http://127.0.0.1:5199/?w=1280&q=0.78 — los fotogramas van a ${out}`)
})
