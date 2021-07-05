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
    />
  </a>
</template>

<script>
export default {
  mounted () {
    setTimeout(() => {
      this.$nextTick(async () => {
        this.$refs.video.src = require('@/assets/images/steam_levels.mp4')
      })
    }, 128)
  },
}
</script>

<style>
.profile_video {
  width: 300px;
  height: 600px;
  display: block;
  background: #19191d;
}

.profile_video > video {
  width: 300px;
  height: 600px;
}
</style>
