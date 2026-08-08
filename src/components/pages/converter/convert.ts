import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { ImageInfo } from '@/types/image'

// Served from public/ffmpeg (custom @ffmpeg/core-mt@0.12 multithreaded build).
// The core includes libdav1d, so AV1 source videos can be decoded.
// Multithreading requires SharedArrayBuffer, i.e. COOP/COEP headers on all
// responses (configured in nginx, vite.config.ts and serve.json).
const CORE_BASE = '/ffmpeg'

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
    coreURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.wasm`, 'application/wasm'),
    workerURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.worker.js`, 'text/javascript'),
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
