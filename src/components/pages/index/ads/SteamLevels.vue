<template>
  <a
    class="profile_video"
    href="https://steamlevels.com"
    target="_blank"
    rel="noreferrer noopener"
  >
    <video
      ref="profile_video"
      muted
      autoplay
      playsinline
      loop
    />
  </a>
</template>

<script>
export default {
  mounted () {
    this.$nextTick(() => {
      this.$refs.profile_video.src = require('@/assets/images/steam_levels.mp4')
    })
  },
}
</script>

<style>
</style>
