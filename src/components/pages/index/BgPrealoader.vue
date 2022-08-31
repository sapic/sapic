<template>
  <div
    v-if="shouldRender"
    class="bgPreloader"
    :style="{
      position: 'absolute',
      opacity: 0,
      left: '-9999px',
      top: '-9999px',
    }"
  >
    <template v-for="nextBg in nextBackgrounds" :key="nextBg.steamUrl">
      <img v-if="nextBg.steamUrl.indexOf('webm') === -1" :src="getUrl(nextBg.steamUrl)" />
      <video v-else :src="getUrl(nextBg.steamUrl)" />
    </template>

    <img
      v-if="background && background.indexOf('webm') === -1"
      ref="bgHolderRef"
      key="currentBgImageHolder"
      :src="background"
      @load="holderUpdated"
    />
    <video
      v-else
      ref="bgHolderRef"
      key="currentBgVideoHolder"
      :src="background"
      @loadeddata="holderUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores'
import { computed, ref } from 'vue'

const store = useMainStore()

const shouldRender = ref(false)
const bgHolderRef = ref<HTMLImageElement | HTMLVideoElement | null>(null)
const background = computed(() => store.background)

const nextBackgrounds = computed(() => store.nextRandomBackgrounds)

setTimeout(() => {
  shouldRender.value = true
}, 256)

function holderUpdated() {
  if (bgHolderRef.value instanceof HTMLImageElement) {
    store.setBgSize({
      w: bgHolderRef.value.naturalWidth,
      h: bgHolderRef.value.naturalHeight,
    })
  } else if (bgHolderRef.value instanceof HTMLVideoElement) {
    store.setBgSize({
      w: bgHolderRef.value.videoWidth,
      h: bgHolderRef.value.videoHeight,
    })
  }
}

function getUrl(url) {
  if (url.indexOf('http://cdn.akamai.steamstatic.com') !== -1) {
    return url.replace('http://cdn.akamai.steamstatic.com', 'https://steamcdn-a.akamaihd.net')
  } else {
    return url
  }
}
</script>
