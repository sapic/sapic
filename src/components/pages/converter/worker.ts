// postMessage('I\'m working before postMessage(\'ali\').')
// export const x = 1
// eslint-disable-next-line no-undef
importScripts('../../../ffmpeg.st/ffmpeg.dev.js')
// import vue from 'vue'
// import FFmpeg from '../../../ffmpeg.st/ffmpeg.min.js'

onmessage = async (event) => {
  postMessage(`Hi, ${event.data}`)
  // await addFfmpegScript()
  console.log('got message', event)
  console.log('event??', event.data.type)
  if (event.data.type === 'convert') {
    await convert(event.data)
  }
}

async function convert(data) {
  console.log('start convert')

  const outputFormat = 'mp4'
  const fileData = await self.FFmpeg.fetchFile(data.url)

  console.log('filedata', fileData)

  // for (const info of JSON.parse(data.options)) {
  //   if (info.enabled) {
  //     data.itemsTotal++
  //   }
  // }

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

  console.log('converting', info)
  await ffmpeg.run(...convertArgs)
  const res: Uint8Array = ffmpeg.FS('readFile', outputName)
  console.log('res type', typeof res, res)
  await ffmpeg.exit()
  postMessage({ type: 'done', ...info, data: res })
  console.log('done', info)
}

async function createFfmpeg() {
  // if (self.ffmpegInit) {
  //   return
  // }
  // if (document.getElementById('ffmpegimport')) return // was already loaded

  // const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
  // var scriptTag = document.createElement('script')

  // scriptTag.src = '/ffmpeg.st/ffmpeg.min.js'
  // // : 'https://unpkg.com/@ffmpeg/ffmpeg@0.9.5/dist/ffmpeg.min.js'
  // scriptTag.id = 'ffmpegimport'
  // scriptTag.crossOrigin = 'true'

  // scriptTag.onload = async () => {

  if (!self.FFmpeg || !self.FFmpeg.createFFmpeg) {
    return console.log('no ffmpeg', self.FFmpeg)
  }

  // self.ffmpegInit = true

  const options = {
    log: false,
    logger: (data) => {
      // console.log('info', data)
      // this.logs += data.message + '\n'
    },
    progress: (data) => {
      console.log('progress', data)
      postMessage({
        type: 'progress',
        data,
      })
      // let ratio = data.ratio
      // if (ratio < 0 || ratio > 1) {
      //   ratio = 0
      // }

      // if (this.itemsTotal < 2) {
      //   this.progress = ratio
      //   return
      // }

      // const relativeRatio = ratio / this.itemsTotal
      // const completedRatio = this.itemsDone / this.itemsTotal
      // this.progress = relativeRatio + completedRatio
    },
  }

  // options.corePath = '/ffmpeg.st/ffmpeg-core.js'
  // console.log('popup create', {
  //   ...options,
  //   mainName: 'main'
  // })
  const ffmpeg = self.FFmpeg.createFFmpeg({
    ...options,
    corePath: 'https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js',
    mainName: 'main',
    // log: true,
  })
  // self.ffmpeg = ffmpeg
  await ffmpeg.load()

  postMessage('got ffmpeg')
  return ffmpeg

  // document.body.appendChild(scriptTag)
}
