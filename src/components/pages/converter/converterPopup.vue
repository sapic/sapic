<template>
  <div class="converter__container">
    <div>Images:</div>
    <div class="images__container">
      <div
        v-for="image in images"
        :key="image.name"
        class="item"
      >
        <ConvertRow :info="image" />
        <!-- <div class="item__title">
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
        </div> -->
      </div>
    </div>

    <br>
  </div>
</template>

<script lang="ts">
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import ConvertRow from './convertRow.vue'
// import MyWorker from './worker.js?worker'

interface ImageInfo {
  enabled: boolean
  name: string
  data: Uint8Array
}
// const url = 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/items/1263950/4d466f77edf3265a253fba79d47bc91a37e34920.webm'
export default {
  components: {
    ConvertRow,
  },

  props: {
    save: {
      type: Object,
      required: true,
    },
  },

  data  () {
    const data: {url?: string, images: ImageInfo[], } = {
      url: undefined,
      images: [],
    }
    return data
  },

  async mounted () {  
    if (this.save) {
      this.url = this.save.url

      this.images = this.save.images.map(i => ({
        ...i,
        name: i.name.replace('.png', '.mp4'),
        enabled: true,
      }))
    }
  },

  methods: {

    async downloadClick () {
      const files = await Promise.all(this.images.filter(i => i.enabled).map(info => convertFile(this.url, info)))
      console.log('files', files)

      const zip = new JSZip()

      for (const info of files) {
        zip.file(info.name, info.data)
      }

      const inputString = JSON.stringify(this.images)
      const inputDigest = await digestMessage(inputString)

      const zipName = `steam.design_${inputDigest.slice(0, 6)}.zip`
      zip.generateAsync({ type: 'blob' })
        .then(function (content) {
          saveAs(content, zipName)
        })
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

function convertFile (url, info) {
  // let resolve
  // let reject

  const convertPromise = new Promise<ImageInfo>((resolve, reject) => {
    const myWorker = new Worker(new URL('./worker.ts', import.meta.url))
    myWorker.onmessage = (x) => {
      console.log('worker message', x)
      if (x.data.type === 'done') {
        console.log('type data', x)
        const { type, ...rest } = x.data
        resolve(rest as ImageInfo)
      }
    }
    myWorker.onerror = (x) => {
      console.log('worker error', x)
    }
    // myWorker = myWorker

    myWorker.postMessage({
      type: 'convert',
      // file: this.file,
      url,
      // data: fileData,
      options: JSON.stringify(info),
    })
  })

  return convertPromise
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
