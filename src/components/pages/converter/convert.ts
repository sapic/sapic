import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { ImageInfo } from '@/types/image'

// Served from public/ffmpeg (copied from @ffmpeg/core@0.12, single-thread build).
// The core includes libaom, so AV1 source videos can be decoded.
const CORE_BASE = '/ffmpeg'

export interface ConvertCallbacks {
  onProgress?: (ratio: number) => void
  onLog?: (message: string) => void
}

// The core is 42 MB. Every conversion runs in its own ffmpeg worker, but they all share one
// download: four rows fetching the same file at the same moment made Chromium fail three of
// them with net::ERR_CACHE_WRITE_FAILURE (seen on steam.design), leaving those rows at 0%.
// A failed load is not cached, so the next attempt fetches again.
let coreUrls: Promise<{ coreURL: string; wasmURL: string }> | null = null

function loadCore() {
  if (!coreUrls) {
    coreUrls = Promise.all([
      toBlobURL(`${CORE_BASE}/ffmpeg-core.js`, 'text/javascript'),
      toBlobURL(`${CORE_BASE}/ffmpeg-core.wasm`, 'application/wasm'),
    ]).then(([coreURL, wasmURL]) => ({ coreURL, wasmURL }))
    coreUrls.catch(() => {
      coreUrls = null
    })
  }
  return coreUrls
}

// The source video is the same for every crop: fetch it once and give each worker a copy
// (writeFile transfers the buffer to the worker, so a shared one would be emptied by the first).
// Only the latest url is kept, so at most one video stays in memory.
let lastSource: { url: string; data: Promise<Uint8Array> } | null = null

function loadSource(source: string | File): Promise<Uint8Array> {
  if (typeof source !== 'string') return fetchFile(source)
  if (!lastSource || lastSource.url !== source) {
    const entry = { url: source, data: fetchFile(source) }
    entry.data.catch(() => {
      if (lastSource === entry) lastSource = null // a failed fetch is retried next time
    })
    lastSource = entry
  }
  return lastSource.data.then((data) => data.slice())
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

  await ffmpeg.load(await loadCore())

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

    await ffmpeg.writeFile(inputName, await loadSource(source))
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
