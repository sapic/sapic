<template>
  <a
    class="profile_video"
    href="https://steamlevels.com"
    target="_blank"
    rel="noreferrer noopener"
  >
    <video
      ref="video"
      autoplay
      muted
      playsinline
      loop
      src="../../../../assets/images/steam_levels.mp4"
    />
  </a>
</template>

<style lang="stylus" scoped>
@import '../../../../assets/css/color'

.profile_video
  width 280px
  height 560px
  display block
  margin 10px 10px 30px 10px
  position relative
  overflow hidden
  border-radius 10px

  video
    width 280px
</style>
