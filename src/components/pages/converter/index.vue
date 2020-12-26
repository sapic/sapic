<template>
  <div class="converter__container">
    <div class="url__container">
      <label for="urlInput"> Image URL:</label>
      <input
        id="urlInput"
        v-model="url"
        type="text"
      >
    </div>

    <div class="format__container">
      <div>Format:</div>
      <div class="inputs">
        <div class="input__container">
          <label for="formatWebm">MP4</label>
          <input
            v-model="outputFormat"
            type="radio"
            value="mp4"
          >
        </div>

        <div class="input__container">
          <label for="formatWebm">WEBM</label>
          <input
            v-model="outputFormat"
            type="radio"
            value="webm"
          >
        </div>

        <div class="input__container">
          <label for="formatWebm">GIF</label>
          <input
            v-model="outputFormat"
            type="radio"
            value="gif"
          >
        </div>
      </div>

      <div>Formats description:</div>
      <div> MP4 - fastest </div>
      <div> WEBM - very slow, but may be better and smaller </div>
      <div> GIF - looks like shit, but maybe you need it, I won't judge </div>

      <br>

      <div>Images:</div>
      <div class="images__container">
        <div
          v-for="image in images"
          :key="image.name"
          class="item"
        >
          <div class="item__title">
            <input
              v-model="image.enabled"
              type="checkbox"
              class="item__checkbox"
            >
            <div class="item__name">
              {{ image.name }}
            </div>
          </div>

          <div class="item__input">
            <label for="wInput">Width:</label>
            <input
              v-model="image.w"
              type="number"
            >
          </div>

          <div class="item__input">
            <label for="hInput">Height:</label>
            <input
              v-model="image.h"
              type="number"
            >
          </div>

          <div class="item__input">
            <label for="hInput">OffsetX:</label>
            <input
              v-model="image.x"
              type="number"
            >
          </div>

          <div class="item__input">
            <label for="hInput">OffsetY:</label>
            <input
              v-model="image.y"
              type="number"
            >
          </div>

        <!-- <div>Width {{ image.w }}</div> -->
        <!-- <div>Name {{ image }}</div>
        <div>Name {{ image }}</div>
        <div>Name {{ image }}</div> -->
        </div>
      </div>

      <br>

      <button
        v-if="!downloadStarted"
        @click="downloadClick"
      >
        Download
      </button>

      <div v-else>
        Progress {{ Math.floor(progress * 100) }}%({{ itemsDone }}/{{ itemsTotal }} images):
        <div class="progress_container">
          <div
            class="progress_foreground"
            :style="{width: `${200 * progress}px`}"
          />
        </div>
      </div>

      <div>
        logs:
        <p
          ref="logsContainer"
          class="logs_container"
        >
          {{ logs }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>

// const url = 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/items/1263950/4d466f77edf3265a253fba79d47bc91a37e34920.webm'
export default {
  data () {
    return {
      url: null,
      images: [],

      ffmpeg: null,
      logs: '',
      progress: 0,
      itemsDone: 0,
      itemsTotal: 0,

      downloadStarted: false,
      outputFormat: 'mp4',
    }
  },

  watch: {
    logs () {
      this.$nextTick(() => {
        this.$refs.logsContainer.scrollTop = this.$refs.logsContainer.scrollHeight
      })
    },

    outputFormat (to, from) {
      this.images = this.images.map(i => ({
        ...i,
        name: i.name.replace(from, to),
      }))
    },
  },

  async mounted () {
    this.addFfmpegScript()
    this.addJszipScript()
    this.addFilesaverScript()

    // console.log('raw', this.$route.params.raw)
    if (this.$route.params.raw) {
      const decoded64 = atob(this.$route.params.raw)
      const decodedObj = JSON.parse(decoded64)

      // console.log('decoded', decoded64, decodedObj)

      if (decodedObj) {
        this.url = decodedObj.url

        // const isWebm = url.indexOf('')

        this.images = decodedObj.images.map(i => ({
          ...i,
          name: i.name.replace('.png', '.mp4'),
          enabled: true,
        }))
      }
    }
  },

  methods: {
    async addFfmpegScript () {
      if (document.getElementById('ffmpegimport')) return // was already loaded
      var scriptTag = document.createElement('script')
      scriptTag.src = 'https://unpkg.com/@ffmpeg/ffmpeg@0.9.5/dist/ffmpeg.min.js'
      scriptTag.id = 'ffmpegimport'

      scriptTag.onload = async () => {
        if (!window.FFmpeg || !window.FFmpeg.createFFmpeg) {
          return console.log('no ffmpeg')
        }
        const ffmpeg = window.FFmpeg.createFFmpeg({
          log: false,
          logger: (data) => {
            // console.log('info', data)
            this.logs += data.message + '\n'
          },
          progress: (data) => {
            // console.log('progress', data)
            let ratio = data.ratio
            if (ratio < 0 || ratio > 1) {
              ratio = 0
            }

            if (this.itemsTotal < 2) {
              this.progress = ratio
              return
            }

            const relativeRatio = ratio / this.itemsTotal
            const completedRatio = this.itemsDone / this.itemsTotal
            this.progress = relativeRatio + completedRatio
          },
        })
        await ffmpeg.load()

        this.ffmpeg = ffmpeg
      }

      document.body.appendChild(scriptTag)
    },

    async addJszipScript () {
      if (document.getElementById('jszipimport')) return // was already loaded
      var scriptTag = document.createElement('script')
      scriptTag.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip.min.js'
      scriptTag.id = 'jszipimport'

      scriptTag.onload = async () => {

      }

      document.body.appendChild(scriptTag)
    },

    async addFilesaverScript () {
      if (document.getElementById('filesaver')) return // was already loaded
      var scriptTag = document.createElement('script')
      scriptTag.src = 'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.min.js'
      scriptTag.id = 'filesaver'

      scriptTag.onload = async () => {

      }

      document.body.appendChild(scriptTag)
    },

    async downloadClick () {
      // console.log('dc')

      if (!this.ffmpeg) {
        return console.log('no ffmpeg')
      }

      const zip = new window.JSZip()
      const ffmpeg = this.ffmpeg

      // const ffmpeg = window.FFmpeg.createFFmpeg({ log: true })
      // const ffm

      if (!ffmpeg.isLoaded()) {
        await ffmpeg.load()
      }

      this.downloadStarted = true

      ffmpeg.FS('writeFile', 'inputfile', await window.FFmpeg.fetchFile(this.url))

      for (const info of this.images) {
        if (info.enabled) {
          this.itemsTotal++
        }
      }

      for (const info of this.images) {
        if (!info.enabled) {
          console.log('Skip because disabled')
          continue
        }
        const convertString = `crop=${info.w}:min(ih-${info.y}\\,${info.h}):${info.x}:${info.y}`
        const outputName = 'test.' + this.outputFormat

        const convertArgs = [
          '-i', 'inputfile',
          // "-i", palette.Name(),
          '-vf', convertString,
          '-b:v', '0',
          '-crf', '30',
          // '-pass', '2',
          // "-lossless", "1",
          '-row-mt', '1',
          '-y', outputName,
        ]

        await ffmpeg.run(...convertArgs)
        // await ffmpeg.run('-i', 'inputfile', 'test.mp4')
        const res = ffmpeg.FS('readFile', outputName)
        // console.log('res', res)
        zip.file(info.name, res)

        this.itemsDone++
      }

      const inputString = JSON.stringify(this.images)
      const inputDigest = await digestMessage(inputString)
      // console.log('hex', inputDigest)

      const zipName = `steam.design_${inputDigest.slice(0, 6)}.zip`
      zip.generateAsync({ type: 'blob' })
        .then(function (content) {
          // see FileSaver.js
          window.saveAs(content, zipName)
        })
      // await fs.promises.writeFile('./test.mp4', ffmpeg.FS('readFile', 'test.mp4'))
      // process.exit(0)
    },
  },
}

async function digestMessage (message) {
  const msgUint8 = new TextEncoder().encode(message) // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8) // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
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
</style>
