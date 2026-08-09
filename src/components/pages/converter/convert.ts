import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { ImageInfo } from '@/types/image'

// Custom @ffmpeg/core-mt@0.12 multithreaded build, including libdav1d so AV1
// source videos can be decoded.
//
// Imported as Vite assets (rather than served from public/) so the emitted
// files get a content hash in their name. That lets them be cached
// indefinitely, which matters a lot for the ~33MB wasm binary.
//
// Multithreading requires SharedArrayBuffer, so pages using this must be
// cross-origin isolated. COOP/COEP are sent site-wide (nginx.conf,
// vite.config.ts, serve.json) because the index page converts inline too.
// The two JS files carry a .asset suffix so Vite treats them as opaque assets.
// Named .js they would be transformed as source modules in dev, which injects
// an ESM import into the worker - illegal in a classic worker, and the core
// then hangs on load. The real MIME type is set by toBlobURL below, so the
// extension on disk does not matter to the browser.
import coreURL from '@/assets/ffmpeg/ffmpeg-core.js.asset?url'
import wasmURL from '@/assets/ffmpeg/ffmpeg-core.wasm?url'
import workerURL from '@/assets/ffmpeg/ffmpeg-core.worker.js.asset?url'

export interface ConvertCallbacks {
  onProgress?: (ratio: number) => void
  onLog?: (message: string) => void
}

export async function createFfmpeg(callbacks: ConvertCallbacks = {}): Promise<FFmpeg> {
  const ffmpeg = new FFmpeg()

  ffmpeg.on('progress', ({ progress }) => {
    if (callbacks.onProgress) {
      callbacks.onProgress(progress >= 0 && progress <= 1 ? progress : 0)
    }
  })
  ffmpeg.on('log', ({ message }) => {
    if (callbacks.onLog) {
      callbacks.onLog(message)
    }
  })

  await ffmpeg.load({
    coreURL: await toBlobURL(coreURL, 'text/javascript'),
    wasmURL: await toBlobURL(wasmURL, 'application/wasm'),
    workerURL: await toBlobURL(workerURL, 'text/javascript'),
  })

  return ffmpeg
}

export function buildConvertArgs(
  info: ImageInfo,
  inputName: string,
  outputName: string,
  outputFormat: string
): string[] {
  // Crop values assume a 1920x1080 source. If the video is larger (e.g. 4K 3840x2160),
  // downscale it to 1920 width first, then crop.
  const downscaleString = `scale='min(iw\\,1920)':-2`
  const convertString = `${downscaleString},crop=${info.w}:min(ih-${info.y}\\,${info.h}):${info.x}:${info.y}`

  if (outputFormat === 'mp4') {
    return [
      '-i',
      inputName,
      '-vf',
      convertString + ',format=yuv420p',
      '-c:v',
      'libx264',
      '-crf',
      '5',
      '-an',
      '-y',
      outputName,
    ]
  }

  return [
    '-i',
    inputName,
    '-vf',
    convertString,
    '-b:v',
    '0',
    '-crf',
    '30',
    '-row-mt',
    '1',
    '-an',
    '-y',
    outputName,
  ]
}

export async function convertVideo(
  source: string | File,
  info: ImageInfo,
  outputFormat: string,
  callbacks: ConvertCallbacks = {}
): Promise<Uint8Array> {
  const ffmpeg = await createFfmpeg(callbacks)

  try {
    const inputName = 'inputfile'
    const outputName = 'output.' + outputFormat

    await ffmpeg.writeFile(inputName, await fetchFile(source))
    await ffmpeg.exec(buildConvertArgs(info, inputName, outputName, outputFormat))

    const data = await ffmpeg.readFile(outputName)
    if (typeof data === 'string') {
      throw new Error('Unexpected string output from ffmpeg')
    }
    return data
  } finally {
    ffmpeg.terminate()
  }
}
