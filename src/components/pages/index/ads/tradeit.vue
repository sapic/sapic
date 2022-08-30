<template>
  <a
    class="profile_video"
    href="https://tradeit.gg/?aff=steamdesign"
    target="_blank"
    rel="noreferrer noopener"
  >
    <video ref="video" autoplay muted playsinline loop />
  </a>
</template>

<script>
import tradeit from '@/assets/images/tradeit.mp4'

export default {
  mounted () {
    setTimeout(() => {
      this.$nextTick(async () => {
        this.$refs.video.src = tradeit
      })
    }, 128)
  },
}
</script>

<style lang="stylus" scoped>
.profile_video
  width 280px
  height 560px
  display block
  margin 10px 10px 10px 10px
  position relative
  overflow hidden
  border-radius 10px

  video
    width 280px
</style>
