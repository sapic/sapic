<template>
  <div class="converter__container">
    <!-- <div>Images:</div> -->
    <div class="images__container">
      <div v-for="image in images" :key="image.name" class="item">
        <ConvertRow
          :info="image"
          :url="url"
          @converted="handleConverted"
          @canceled="handleRowCancel"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import store from '@/store'
import { ImageInfo } from '@/types/image'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { PropType, ref } from 'vue'
import ConvertRow from './convertRow.vue'

interface ConverterProp {
  id: string
  info: {
    url: string
    images: ImageInfo[]
  }
}

const props = defineProps({
  save: {
    type: Object as PropType<ConverterProp>,
    required: true,
  },
})

const url = ref<string>(props.save.info.url || '')
const images = ref<ImageInfo[]>(
  props.save.info.images.map((i) => ({
    ...i,
    name: i.name.replace('.png', '.mp4'),
    enabled: true,
  }))
)

async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message) // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8) // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
  return hashHex
}

const zip = new JSZip()

const totalConverted = ref(0)
async function handleConverted(info) {
  console.log('handleConverted', info)
  zip.file(info.name, info.data)
  totalConverted.value++
  if (totalConverted.value === images.value.length) {
    finalzeZip()
  }
}

function handleRowCancel(info) {
  images.value = images.value.filter((img) => img.name !== info.name)

  if (totalConverted.value === images.value.length) {
    finalzeZip()
  }
}

async function finalzeZip() {
  const inputString = JSON.stringify(images.value)
  const inputDigest = await digestMessage(inputString)

  const zipName = `steam.design_${inputDigest.slice(0, 6)}.zip`
  zip.generateAsync({ type: 'blob' }).then(function (content) {
    saveAs(content, zipName)
    store.commit('removeConvertItem', props.save.id)
  })
}
</script>

<style lang="stylus" scoped>
@import '../../../assets/css/color'

.converter__container
  margin 0 auto
  padding 1rem
  background $color-button
  border-radius 3px
  margin 1rem

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
