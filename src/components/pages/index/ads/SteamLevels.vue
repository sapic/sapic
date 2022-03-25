<template>
  <a
    class="profile_video"
    href="https://steamlevels.com"
    target="_blank"
    rel="noreferrer noopener"
  >
    <video ref="video" autoplay muted playsinline loop />
  </a>
</template>

<script>
export default {
  mounted () {
    setTimeout(() => {
      this.$nextTick(async () => {
        this.$refs.video.src = require('@/assets/images/steam_levels.mp4').default
      })
    }, 128)
  },
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/css/color'

.profile_video
  width 280px
  height 560px
  display block
  background #19191d
  margin 10px 10px 30px 10px
  position relative
  border-radius 10px

  video
    width 260px
    height 560px
</style>
