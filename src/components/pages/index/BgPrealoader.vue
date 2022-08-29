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
    <template v-for="background in nextBackgrounds" :key="background.steamUrl">
      <img v-if="background.steamUrl.indexOf('webm') === -1" :src="getUrl(background.steamUrl)" />
      <video v-else :src="getUrl(background.steamUrl)" />
    </template>

    <img
      v-if="$store.state.background && $store.state.background.indexOf('webm') === -1"
      ref="bgHolderRef"
      key="currentBgImageHolder"
      :src="$store.state.background"
      @load="holderUpdated"
    />
    <video
      v-else
      ref="bgHolderRef"
      key="currentBgVideoHolder"
      :src="$store.state.background"
      @loadeddata="holderUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const shouldRender = ref(false)
const bgHolderRef = ref<HTMLImageElement | HTMLVideoElement | null>(null)

const nextBackgrounds = computed(() => store.state.nextRandomBackgrounds)

setTimeout(() => {
  shouldRender.value = true
}, 256)

function holderUpdated() {
  if (bgHolderRef.value instanceof HTMLImageElement) {
    store.commit('setBgSize', {
      w: bgHolderRef.value.naturalWidth,
      h: bgHolderRef.value.naturalHeight,
    })
  } else if (bgHolderRef.value instanceof HTMLVideoElement) {
    store.commit('setBgSize', {
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
