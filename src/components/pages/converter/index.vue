<template>
  <div class="converter__container">
    <div class="url__container">
      <label for="urlInput"> Image URL:</label>
      <input id="urlInput" v-model="url" type="text" />
    </div>

    <div class="url__container">
      <label for="fileInput">Image Input:</label>
      <input id="fileInput" ref="fileInput" type="file" @change="onUploadFiles" />
    </div>

    <div class="format__container">
      <div>Format:</div>
      <div class="inputs">
        <div class="input__container">
          <label for="formatMp4">MP4</label>
          <input
            id="formatMp4"
            type="radio"
            :checked="outputFormat === 'mp4'"
            name="formatRadio"
            @change="outputFormat = 'mp4'"
          />
        </div>

        <div class="input__container">
          <label for="formatWebm">WEBM</label>
          <input
            id="formatWebm"
            type="radio"
            :checked="outputFormat === 'webm'"
            name="formatRadio"
            @change="outputFormat = 'webm'"
          />
        </div>

        <div class="input__container">
          <label for="formatGif">GIF</label>
          <input
            id="formatGif"
            type="radio"
            :checked="outputFormat === 'gif'"
            name="formatRadio"
            @change="outputFormat = 'gif'"
          />
        </div>
      </div>

      <div>Formats description:</div>
      <div>MP4 - fastest</div>
      <div>WEBM - very slow, but may be better and smaller</div>
      <div>GIF - looks like shit, but maybe you need it, I won't judge</div>

      <br />

      <div>Images:</div>
      <div class="images__container">
        <div v-for="image in images" :key="image.name" class="item">
          <div class="item__title">
            <input v-model="image.enabled" type="checkbox" class="item__checkbox" />
            <div class="item__name">
              {{ image.name }}
            </div>
          </div>

          <div class="item__input">
            <label for="wInput">Width:</label>
            <input v-model="image.w" type="number" />
          </div>

          <div class="item__input">
            <label for="hInput">Height:</label>
            <input v-model="image.h" type="number" />
          </div>

          <div class="item__input">
            <label for="hInput">OffsetX:</label>
            <input v-model="image.x" type="number" />
          </div>

          <div class="item__input">
            <label for="hInput">OffsetY:</label>
            <input v-model="image.y" type="number" />
          </div>

          <!-- <div>Width {{ image.w }}</div> -->
          <!-- <div>Name {{ image }}</div>
        <div>Name {{ image }}</div>
        <div>Name {{ image }}</div> -->
        </div>
      </div>

      <br />

      <button v-if="!ffmpeg" class="download__button" disabled>Loading...</button>
      <button v-else-if="!downloadStarted" class="download__button" @click="downloadClick">
        Download
      </button>

      <div v-else>
        Progress {{ Math.floor(progress * 100) }}%({{ itemsDone }}/{{ itemsTotal }}
        images):
        <div class="progress_container">
          <div class="progress_foreground" :style="{ width: `${200 * progress}px` }" />
        </div>
      </div>

      <div>
        logs:
        <p ref="logsRef" class="logs_container">
          {{ logs }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ImageInfo } from '@/types/image'
import JSZip from 'jszip'
import { nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { saveAs } from 'file-saver'

// import ffmpegUrl from '../../../ffmpeg.st/ffmpeg.min.js?url'
// console.log('ffmpeg url: ' + ffmpegUrl)

const route = useRoute()

const url = ref<string>('')
const images = ref<ImageInfo[]>([])
const logsRef = ref<HTMLDivElement | null>(null)
const logs = ref('')
const outputFormat = ref('mp4')
const inputRef = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)
const downloadStarted = ref(false)
const itemsTotal = ref(0)
const itemsDone = ref(0)
const progress = ref(0)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ffmpeg = ref<any | null>(null)
// props.save.info.images.map((i) => ({
//   ...i,
//   name: i.name.replace('.png', '.mp4'),
//   enabled: true,
// }))

console.log('route raw', route)
if (route.params.raw && typeof route.params.raw === 'string') {
  const decoded64 = atob(route.params.raw)
  const decodedObj = JSON.parse(decoded64)

  if (decodedObj) {
    url.value = decodedObj.url
    images.value = decodedObj.images.map((i) => ({
      ...i,
      name: i.name.replace('.png', '.mp4'),
      enabled: true,
    }))
  }
}

watch(logs, () => {
  nextTick(() => {
    if (logsRef.value) {
      logsRef.value.scrollTop = logsRef.value.scrollHeight
    }
  })
})

watch(outputFormat, (to, from) => {
  images.value = images.value.map((i) => ({
    ...i,
    name: i.name.replace(from, to),
  }))
})

async function onUploadFiles() {
  if (inputRef.value && inputRef.value.files && inputRef.value.files.length > 0) {
    file.value = inputRef.value.files[0]
  } else {
    file.value = null
  }
}

async function addFfmpegScript() {
  if (document.getElementById('ffmpegimport')) return // was already loaded

  // const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
  const scriptTag = document.createElement('script')

  scriptTag.src = '/ffmpeg/ffmpeg.min.js'
  // : 'https://unpkg.com/@ffmpeg/ffmpeg@0.9.5/dist/ffmpeg.min.js'
  scriptTag.id = 'ffmpegimport'
  scriptTag.crossOrigin = 'true'

  scriptTag.onload = async () => {
    console.log('onload')
    if (!window.FFmpeg || !window.FFmpeg.createFFmpeg) {
      return console.log('no ffmpeg')
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: any = {
      log: false,
      logger: (data) => {
        // console.log('info', data)
        console.log('got logs')
        logs.value += data.message + '\n'
      },
      progress: (data) => {
        // console.log('progress', data)
        let ratio = data.ratio
        if (ratio < 0 || ratio > 1) {
          ratio = 0
        }

        if (itemsTotal.value < 2) {
          progress.value = ratio
          return
        }

        const relativeRatio = ratio / itemsTotal.value
        const completedRatio = itemsDone.value / itemsTotal.value
        progress.value = relativeRatio + completedRatio
      },
      mainName: 'main',
    }

    // options.corePath = '/ffmpeg/ffmpeg-core.js'

    // const ffmpeg = window.FFmpeg.createFFmpeg(options)
    const ffmpegInstance = window.FFmpeg.createFFmpeg(options)
    await ffmpegInstance.load()

    ffmpeg.value = ffmpegInstance
    console.log('got ffmpeg', ffmpeg)
  }

  document.body.appendChild(scriptTag)
}
addFfmpegScript()

async function downloadClick() {
  if (!ffmpeg.value) {
    return console.log('no ffmpeg')
  }

  const zip = JSZip()

  if (!ffmpeg.value.isLoaded()) {
    await ffmpeg.value.load()
  }

  downloadStarted.value = true

  let fileData
  try {
    fileData = file.value
      ? await window.FFmpeg.fetchFile(file.value)
      : await window.FFmpeg.fetchFile(url.value)
  } catch (e) {
    logs.value += `
================================
================================
================================
================================
File download error, try uploading it manually
================================
================================
================================
================================
        `
  }

  ffmpeg.value.FS('writeFile', 'inputfile', fileData)

  for (const info of images.value) {
    if (info.enabled) {
      itemsTotal.value++
    }
  }

  for (const info of images.value) {
    if (!info.enabled) {
      console.log('Skip because disabled')
      continue
    }
    const convertString = `crop=${info.w}:min(ih-${info.y}\\,${info.h}):${info.x}:${info.y}`
    const outputName = 'test.' + outputFormat.value

    let convertArgs = [
      '-i',
      'inputfile',
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

    if (outputFormat.value === 'mp4') {
      convertArgs = [
        '-i',
        'inputfile',
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

    await ffmpeg.value.run(...convertArgs)
    const res = ffmpeg.value.FS('readFile', outputName)
    zip.file(info.name, res)

    itemsDone.value++
  }

  const inputString = JSON.stringify(images.value)
  const inputDigest = await digestMessage(inputString)

  const zipName = `steam.design_${inputDigest.slice(0, 6)}.zip`
  zip.generateAsync({ type: 'blob' }).then(function (content) {
    saveAs(content, zipName)
  })
}

async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message) // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8) // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
  return hashHex
}
</script>

<style lang="stylus" scoped>
.converter__container
  width 100%
  max-width 800px
  margin 0 auto
  padding 1rem

.url__container
  margin 10px 0
  display flex

  label
    margin-right 5px
    width 120px

  input
    padding 2px
    width 100%

.images__container
  .item
    display flex
    margin 0
    justify-content space-between

    &__title
      display flex
      width 210px
      flex 0 0 auto

    &__input
      margin 0 10px
      width 130px

      label
        margin-right 5px

      input
        width 50px

.logs_container
  white-space pre-wrap
  max-height 400px
  overflow-y scroll

.progress_container
  width 200px
  height 20px
  background black

.progress_foreground
  width 0px
  height 20px
  background red

.format__container
  .inputs
    display flex
    margin 0 -10px

    .input__container
      margin 0 10px

.download__button
  width 200px
  height 60px
  background #09BC8A
  border none
  color white
  font-weight 600
  font-size 24px
  font-family 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
  border-radius 12px
  cursor pointer

  &:hover
    background #0AD69C

  &:focus
    outline none

  &:disabled
    opacity 0.5
</style>
