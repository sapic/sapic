<template>
  <a class="profile_video" href="https://steamlevels.com" target="_blank" rel="noreferrer noopener">
    <video ref="videoRef" autoplay muted playsinline loop />
  </a>
</template>

<script lang="ts" setup>
import SteamLevels from '@/assets/images/steam_levels.mp4'
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
.profile_video
  width 280px
  height 560px
  display block
  margin 10px 10px 10px 15px
  position relative
  overflow hidden
  border-radius 10px

  video
    width 280px
</style>
