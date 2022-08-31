importScripts('../../../ffmpeg.st/ffmpeg.dev.js')

onmessage = async (event) => {
  if (event.data.type === 'convert') {
    await convert(event.data)
  }
}

async function convert(data) {
  const outputFormat = 'mp4'
  const fileData = await self.FFmpeg.fetchFile(data.url)

  let i = 0
  const info = JSON.parse(data.options)
  if (!info.enabled) {
    console.log('Skip because disabled')
    return
  }
  i++
  const ffmpeg = await createFfmpeg()
  ffmpeg.FS('writeFile', `inputfile${i}`, fileData)
  const convertString = `crop=${info.w}:min(ih-${info.y}\\,${info.h}):${info.x}:${info.y}`
  const outputName = `test${i}.` + outputFormat

  let convertArgs = [
    '-i',
    `inputfile${i}`,
    // "-i", palette.Name(),
    '-vf',
    convertString,
    '-b:v',
    '0',
    '-crf',
    '30',
    // '-pass', '2',
    // "-lossless", "1",
    '-row-mt',
    '1',
    '-y',
    outputName,
  ]

  if (outputFormat === 'mp4') {
    convertArgs = [
      '-i',
      `inputfile${i}`,
      '-vf',
      convertString + ',format=yuv420p',
      // '-b:v', '0',
      // '-crf', '30',
      // '-pass', '2',
      // "-lossless", "1",
      // '-row-mt', '1',
      // '-vf', 'format=yuv420p',
      '-c:v',
      'libx264',
      // '-preset', 'veryslow',
      '-crf',
      '5',
      '-y',
      outputName,
    ]
  }

  await ffmpeg.run(...convertArgs)
  const res: Uint8Array = ffmpeg.FS('readFile', outputName)

  await ffmpeg.exit()
  postMessage({ type: 'done', ...info, data: res })
}

async function createFfmpeg() {
  if (!self.FFmpeg || !self.FFmpeg.createFFmpeg) {
    return console.log('no ffmpeg', self.FFmpeg)
  }

  const options = {
    log: false,

    progress: (data) => {
      postMessage({
        type: 'progress',
        data,
      })
    },
  }

  const ffmpeg = self.FFmpeg.createFFmpeg({
    ...options,
    corePath: 'https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js',
    mainName: 'main',
  })

  await ffmpeg.load()

  return ffmpeg
}
