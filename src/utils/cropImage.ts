import { getBackendUrl } from './getBackendUrl'

/**
 * Background crops (artwork + avatar) made in the browser. The server used to
 * download the image, crop it and send a zip; now it only passes the image
 * through with CORS headers (/img/<host>/<path>), so the page can draw it on a
 * canvas. Same geometry as the old Go handler (get_zip_from_raw.go):
 *  - repeating backgrounds (512x512 tiles) are tiled to cover 1000x2000 first
 *  - negative x/y count from the right/bottom edge of the original image
 *  - a crop is cut to what is inside the (tiled) image
 */

export interface CropRect {
  name: string
  x: number
  y: number
  w: number
  h: number
}

export interface CropRequest {
  url: string
  repeating: boolean
  images: CropRect[]
}

export const README_EN =
  'To upload the images provided in this .zip, you must follow the guide listed below. Images uploaded without using the guide listed will appear short and squished.\nhttps://steamcommunity.com/sharedfiles/filedetails/?id=748624905\n\nIf this is your first time using long images, then you will need to remove two of the three images on the right. To do so, select the same image for all three boxes and it will remove two of them.\n\nThank you for using from steam.design. If you require support of any kind, bug reporting, or just wish to chat, feel free to join our discord.\nhttps://discord.gg/jnqnHuX'

export const README_RU =
  'Для того, чтобы загрузить файлы из этого архива, воспользуйтесь гайдом по ссылке ниже. Если вы не последуете ему, изображения могут оказаться неправильного размера.\nhttps://steamcommunity.com/sharedfiles/filedetails/?id=1102484221\n\nЕсли вы загружаете длинный Artwork в первый раз, вам нужно удалить 2 лишних маленьких боковых бокса. Для этого выберите для всех маленьких боксов одинаковую картинку.\n\nСпасибо за использование steam.design . Если вам нужна какая-либо помощь, вы нашли баг, или просто хотите пообщаться, заходите в наш дискорд - https://discord.gg/jnqnHuX'

/** URL the browser can read pixels from: Steam images go through our /img/ proxy */
export function readableUrl(url: string): string {
  if (/^(blob:|data:)/i.test(url)) return url
  const u = new URL(url)
  return `${getBackendUrl()}img/${u.hostname}${u.pathname}`
}

/** Size of the image the crops are taken from (tiled for repeating backgrounds) */
export function sourceSize(w: number, h: number, repeating: boolean) {
  if (!repeating) return { w, h }
  // tileImage(img, 0, 0, 1000, 2000) in the Go server
  return { w: w * Math.ceil(1000 / w), h: h * Math.ceil(2000 / h) }
}

/**
 * Pixel rectangle of one crop inside the source, or null when nothing of it is
 * inside. `orig` is the untiled image (negative offsets count from its edges).
 */
export function cropBox(
  r: CropRect,
  orig: { w: number; h: number },
  src: { w: number; h: number }
): { sx: number; sy: number; sw: number; sh: number } | null {
  const x = r.x < 0 ? r.x + orig.w : r.x
  const y = r.y < 0 ? r.y + orig.h : r.y
  // The Go code shortened the height with the raw y; the intersection below
  // gives the same result for every y the site sends (y >= 0)
  const h = r.h + r.y > src.h ? src.h - r.y : r.h
  const x0 = Math.max(0, x)
  const y0 = Math.max(0, y)
  const x1 = Math.min(src.w, x + r.w)
  const y1 = Math.min(src.h, y + h)
  if (x1 <= x0 || y1 <= y0) return null
  return { sx: x0, sy: y0, sw: x1 - x0, sh: y1 - y0 }
}

type AnyCanvas = OffscreenCanvas | HTMLCanvasElement

function makeCanvas(w: number, h: number): AnyCanvas {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h)
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

async function toBlob(c: AnyCanvas, type: string): Promise<Blob> {
  if ('convertToBlob' in c) return c.convertToBlob({ type, quality: 0.92 })
  return new Promise((resolve, reject) =>
    c.toBlob((b) => (b ? resolve(b) : reject(new Error('canvas toBlob failed'))), type, 0.92)
  )
}

async function loadBitmap(url: string, signal?: AbortSignal): Promise<ImageBitmap> {
  const res = await fetch(readableUrl(url), { signal })
  if (!res.ok) throw new Error(`image download failed (${res.status})`)
  // No colour conversion: the files keep the pixel values Steam serves
  return createImageBitmap(await res.blob(), {
    colorSpaceConversion: 'none',
    premultiplyAlpha: 'none',
  })
}

/** Cropped files (PNG, or JPEG for a .jpg name) plus the two read-me files */
export async function cropFiles(
  req: CropRequest,
  signal?: AbortSignal
): Promise<Array<{ name: string; data: Blob | string }>> {
  const bmp = await loadBitmap(req.url, signal)
  try {
    const orig = { w: bmp.width, h: bmp.height }
    const src = sourceSize(orig.w, orig.h, req.repeating)
    const files: Array<{ name: string; data: Blob | string }> = []
    for (const r of req.images) {
      const box = cropBox(r, orig, src)
      if (!box) continue
      const c = makeCanvas(box.sw, box.sh)
      const ctx = c.getContext('2d') as
        | OffscreenCanvasRenderingContext2D
        | CanvasRenderingContext2D
        | null
      if (!ctx) throw new Error('no 2d canvas')
      ctx.imageSmoothingEnabled = false
      // Every tile that overlaps the box (one for a normal background)
      const stepX = req.repeating ? orig.w : src.w
      const stepY = req.repeating ? orig.h : src.h
      for (let ty = Math.floor(box.sy / stepY) * stepY; ty < box.sy + box.sh; ty += stepY) {
        for (let tx = Math.floor(box.sx / stepX) * stepX; tx < box.sx + box.sw; tx += stepX) {
          ctx.drawImage(bmp, tx - box.sx, ty - box.sy)
        }
      }
      const type = /\.jpe?g$/i.test(r.name) ? 'image/jpeg' : 'image/png'
      files.push({ name: r.name, data: await toBlob(c, type) })
    }
    if (files.length === 0) throw new Error('nothing to crop')
    files.push({ name: 'Read_Me.txt', data: README_EN })
    files.push({ name: 'Read_Me_Ru.txt', data: README_RU })
    return files
  } finally {
    bmp.close()
  }
}

/** Short stable id of a request, for the zip name (steam.design_xxxxxx.zip) */
export async function requestId(req: CropRequest): Promise<string> {
  const data = new TextEncoder().encode(JSON.stringify(req))
  const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', data))
  return Array.from(hash.slice(0, 3), (b) => b.toString(16).padStart(2, '0')).join('')
}
