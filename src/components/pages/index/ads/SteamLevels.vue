<template>
  <a
    class="profile_video"
    href="https://steamlevels.com"
    target="_blank"
    rel="noreferrer noopener"
  >
    <div ref="lottie" />
  </a>
</template>

<script>
export default {
  data () {
    return {
      lottie: null,
    }
  },

  mounted () {
    // setTimeout(() => {
    this.$nextTick(async () => {
      this.lottie = await import(/* webpackChunkName: "stlvl" */'lottie-web/build/player/lottie_light.min.js')
      const animation = this.lottie.loadAnimation({
        container: this.$refs.lottie, // the dom element that will contain the animation
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: await import(/* webpackChunkName: "stlvl" */'../../../../assets/steam_levels.json'),
      })

      animation.addEventListener('data_failed', (e) => {
        console.log('lottie fail', e)
      })
    })
  },
}
</script>

<style>
.profile_video {
  width: 300px;
  height: 600px;
  display: block;
}
</style>
