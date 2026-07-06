<script setup lang="ts">
import { ImageInfo } from '@/types/image'
import { PropType, ref } from 'vue'
import { convertVideo } from './convert'

const progress = ref(0)

const emit = defineEmits(['converted', 'canceled'])

const props = defineProps({
  info: {
    type: Object as PropType<ImageInfo>,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
})

async function convertFile(url: string, info: ImageInfo): Promise<ImageInfo> {
  const data = await convertVideo(url, info, 'mp4', {
    onProgress: (ratio) => {
      progress.value = ratio
    },
  })

  return { ...info, data }
}

convertFile(props.url, props.info)
  .then((result) => {
    emit('converted', result)
  })
  .catch((e) => {
    console.log('convert error', e)
  })

function cancel() {
  emit('canceled', props.info)
}
</script>

<template>
  <div class="row-container">
    <div class="row-header">
      <div class="row-name">{{ info.name }}</div>
      <div class="row-cancel" @click="cancel">✖</div>
    </div>

    <div class="progress-container">
      <div
        class="progress-indicator"
        :style="{
          width: progress * 100 + '%',
        }"
      ></div>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
@import '../../../assets/css/color'

.row-container
  margin 6px auto

  .row-header
    display flex
    justify-content space-between
    cursor default

.row-cancel
  cursor pointer

.progress-container
  width 256px
  height 6px
  border-radius 3px
  padding 1px
  background $color-main
  margin 5px 0 0 0

.progress-indicator
  height: 100%;
  background-size 100px 100%
  border-radius 3px
  background linear-gradient(45deg, $color-button-gradient-1, $color-button-gradient-2)
  transition width 0.25s ease
</style>
