<template>
  <div 
    class="profile__preview" 
    :style="previewStyle"
  >
    <div class="profile__preview-bg">
      <video
        :src="background || ''"
        muted
        autoplay
        loop
        :style="{
          width: `${bgSize.w}px`,
          height: `${bgSize.h}px`,
        }"
      ></video>
    </div>
    <div class="profile__preview-container">
      <Overlay :image-height="shouldRepeatBackground ? 950 : bgSize.h" />
    </div>
  </div>
</template>

<script>
import { useMainStore } from '@/stores'
import { mapState } from 'pinia'
import Overlay from './preview/Overlay.vue'

// Only an absolute URL is worth asking the browser for: a missing or "undefined"
// value used to become url('undefined'), i.e. a request to /undefined (404).
// Only an absolute URL is worth asking the browser for: a missing or "undefined"
// value used to become url('undefined'), i.e. a request to /undefined (404).
const isLoadableUrl = (value) => typeof value === 'string' && /^(https?:|blob:|data:)/i.test(value)

export default {
  components: {
    Overlay,
  },

  computed: {
    ...mapState(useMainStore, ['bgSize', 'background']),

    previewStyle() {
      return {
        backgroundImage: isLoadableUrl(this.background) ? `url('${this.background}')` : 'none',
        backgroundRepeat: this.shouldRepeatBackground ? 'repeat' : 'no-repeat',
        backgroundPosition: '49.999% 0',
      }
    },
    
    shouldRepeatBackground() {
      // Check if the background is a square image smaller than 700x700 pixels
      return this.bgSize.w > 0 && 
             this.bgSize.h > 0 && 
             this.bgSize.w === this.bgSize.h && 
             this.bgSize.w < 700 && 
             this.bgSize.h < 700
    },
  },
}
</script>

<style lang="stylus" scoped>
.profile__preview
  width 100%
  // Never narrower than Steam's content column: when the window is narrower than
  // 976 px at this zoom, the background must stay centred on the column (and the
  // window scrolls), not on the visible part
  min-width 976px
  // The video layer (.profile__preview-bg, absolute) is sized and centred
  // against this box, so animated backgrounds line up with the frame too
  position relative
  z-index 0
  display flex
  flex-direction column

  &-container
    // background-color rgba(18, 21, 26, 0.5)
    width 976px
    margin 0 auto
    min-height 1080px

  &-header
    max-width 976px
    min-height 240px
    width 100%
    margin 0 auto
    padding 32px 26px
    box-sizing border-box

    // border-radius 0 0 5px 5px
    &__avatar
      width 162px
      height 162px
      background-color #57cbde
      background linear-gradient(to bottom, #53a4c4 5%, #458097 95%)
      border-radius 5px

  &-body
    width 976px
    padding 30px 23px 87px 23px
    margin 0 auto
    box-sizing border-box
    display flex
    border-radius 0 0 5px 5px

  &-bg
    position absolute
    left 0
    top 0
    width 100%
    display flex
    justify-content center
    z-index -1
</style>
