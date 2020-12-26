<template>
  <div>
    <input
      v-model="url"
      type="text"
    >

    <div>Images:</div>
    <div>
      <div
        v-for="image in images"
        :key="image.name"
      >
        {{ image }} Image
      </div>
    </div>

    <button @click="downloadClick">
      Download
    </button>

    <div>
      Progress {{ Math.floor(progress * 100) }}%:
      <div class="progress_container">
        <div
          class="progress_foreground"
          :style="{width: `${200 * progress}px`}"
        />
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
    }
  },

  watch: {
    logs () {
      this.$nextTick(() => {
        this.$refs.logsContainer.scrollTop = this.$refs.logsContainer.scrollHeight
      })
    },
  },

  async mounted () {
    this.addFfmpegScript()
    this.addJszipScript()
    this.addFilesaverScript()

    console.log('raw', this.$route.params.raw)
    if (this.$route.params.raw) {
      const decoded64 = atob(this.$route.params.raw)
      const decodedObj = JSON.parse(decoded64)

      console.log('decoded', decoded64, decodedObj)

      if (decodedObj) {
        this.url = decodedObj.url

        // const isWebm = url.indexOf('')

        this.images = decodedObj.images.map(i => ({
          ...i,
          name: i.name.replace('.png', '.webm'),
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
            console.log('progress', data)
            this.progress = data.ratio
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
      console.log('dc')

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

      ffmpeg.FS('writeFile', 'inputfile', await window.FFmpeg.fetchFile(this.url))

      for (const info of this.images) {
        const convertString = `crop=${info.w}:min(ih-${info.y}\\,${info.h}):${info.x}:${info.y}`

        const convertArgs = [
          '-i', 'inputfile',
          // "-i", palette.Name(),
          '-vf', convertString,
          '-b:v', '0',
          '-crf', '30',
          // '-pass', '2',
          // "-lossless", "1",
          '-row-mt', '1',
          '-y', 'test.webm',
        ]

        await ffmpeg.run(...convertArgs)
        // await ffmpeg.run('-i', 'inputfile', 'test.mp4')
        const res = ffmpeg.FS('readFile', 'test.webm')
        console.log('res', res)
        zip.file(info.name, res)
      }

      zip.generateAsync({ type: 'blob' })
        .then(function (content) {
          // see FileSaver.js
          window.saveAs(content, 'example.zip')
        })
      // await fs.promises.writeFile('./test.mp4', ffmpeg.FS('readFile', 'test.mp4'))
      // process.exit(0)
    },
  },
}
</script>

<style>
.logs_container {
  white-space: pre-wrap;
  max-height: 400px;
  overflow-y: scroll;
}

.progress_container {
  width: 200px;
  height: 20px;
  background: black;
}

.progress_foreground {
  width: 0px;
  height: 20px;
  background: red;
}
</style>
