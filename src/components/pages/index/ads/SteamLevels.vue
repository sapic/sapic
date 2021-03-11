<template>
  <a
    class="profile_video"
    href="https://steamlevels.com"
    target="_blank"
    rel="noreferrer noopener"
  >
    <div ref="lottie" />
    <!-- <video
      ref="profile_video"
      muted
      autoplay
      playsinline
      loop
    /> -->
  </a>
</template>

<script>
import lottie from 'lottie-web'

export default {
  mounted () {
    this.$nextTick(() => {
      // const lottie = require('lottie-web')
      // require('lottie-web/build/player/lottie_light.min.js')
      // this.$refs.profile_video.src = require('@/assets/images/steam_levels.mp4')
      console.log('requiing animaion')
      const animation = lottie.loadAnimation({
        container: this.$refs.lottie, // the dom element that will contain the animation
        renderer: 'svg',
        loop: true,
        autoplay: true,
        // path: require('../../../../assets/steam_levels.lottie'), // the path to the animation json
        animationData: require('../../../../assets/steam_levels.json'),
      })

      animation.addEventListener('data_failed', (e) => {
        console.log('lottie fail', e)
      })
      // lottie.pause()
    })

    window.addEventListener('keydown', () => {
      console.log('pause')
      lottie.pause()
    })
  },
}
</script>

<style>
</style>
