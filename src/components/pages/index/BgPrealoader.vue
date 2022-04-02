<template>
  <div
    class="bgPreloader"
    v-if="shouldRender"
    :style="{
      position: 'absolute',
      opacity: 0,
      left: '-9999px',
      top: '-9999px',
    }"
  >
    <template v-for="background in nextBackgrounds">
      <img
        :src="getUrl(background.steamUrl)"
        v-if="background.steamUrl.indexOf('webm') === -1"
        :key="background.steamUrl"
      />
      <video
        :src="getUrl(background.steamUrl)"
        :key="background.steamUrl"
        v-else
      />
    </template>

    <img
      :src="$store.state.background"
      ref="currentBgImageHolder"
      @load="imageUpdated"
      v-if="
        $store.state.background &&
        $store.state.background.indexOf('webm') === -1
      "
      key="currentBgImageHolder"
    />
    <video
      v-else
      :src="$store.state.background"
      ref="currentBgVideoHolder"
      @loadeddata="videoUpdated"
      key="currentBgVideoHolder"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      shouldRender: false,
    }
  },

  computed: {
    nextBackgrounds () {
      return this.$store.state.nextRandomBackgrounds
    },
  },

  mounted () {
    setTimeout(() => {
      this.shouldRender = true
    }, 256)
  },

  methods: {
    imageUpdated () {
      if (this.$refs.currentBgImageHolder.naturalHeight && this.$refs.currentBgImageHolder.naturalWidth) {
        this.$store.commit('setBgSize', {
          w: this.$refs.currentBgImageHolder.naturalWidth,
          h: this.$refs.currentBgImageHolder.naturalHeight,
        })
      }
    },
    videoUpdated () {
      if (this.$refs.currentBgVideoHolder.videoHeight && this.$refs.currentBgVideoHolder.videoWidth) {
        this.$store.commit('setBgSize', {
          w: this.$refs.currentBgVideoHolder.videoWidth,
          h: this.$refs.currentBgVideoHolder.videoHeight,
        })
      }
    },

    getUrl (url) {
      if (url.indexOf('http://cdn.akamai.steamstatic.com') !== -1) {
        return url.replace('http://cdn.akamai.steamstatic.com', 'https://steamcdn-a.akamaihd.net')
      } else {
        return url
      }
    },
  },
}
</script>
