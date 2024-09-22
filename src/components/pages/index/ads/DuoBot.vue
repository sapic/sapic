<template>
  <a
    class="video"
    href="https://duobot.com/c/steamdesign"
    target="_blank"
    rel="noreferrer noopener"
  >
    <video ref="videoRef" autoplay muted playsinline loop />
  </a>
</template>

<script lang="ts" setup>
import SteamLevels from '@/assets/images/video-duobot.webm'
import { nextTick, ref } from 'vue'

const videoRef = ref<HTMLVideoElement | null>(null)
setTimeout(() => {
  nextTick(async () => {
    if (videoRef.value) {
      videoRef.value.src = SteamLevels
    }
  })
}, 128)
</script>

<style lang="stylus" scoped>
.video
  width 280px
  height 560px
  display block
  margin 10px auto
  position relative
  overflow hidden
  border-radius 10px

  video
    width 280px
</style>
