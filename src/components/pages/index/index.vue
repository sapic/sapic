<template lang="pug">
.wrapper
  section.body__wrapper
    MenuWindow
    .preview__window
      .zoom_out(
        :style='{\ transform: `scale(${scalePercent})`,\ width: `calc(100% / ${scalePercent}) !important`,\ height: `calc(100% * ${scalePercent}) !important`,\ }'
      )
        Preview

        BgPreloader
    template(v-if="!isMobile")
      RightMenu
      Inventory
    MobileHeader(v-else)
    Scripts
    #nn_lb2
</template>

<script>
import Preview from './Preview.vue'
import Inventory from './Inventory.vue'
import TitleBar from './TitleBar.vue'
import MenuWindow from './MenuWindow.vue'
import BgPreloader from './BgPrealoader.vue'
import Scripts from '../../Scripts.vue'
import RightMenu from './RightMenu.vue'
import MobileHeader from './MobileHeader.vue'

const easeOutQuad = t => t * (2 - t)

export default {
  components: {
    Scripts,

    Preview,
    TitleBar,
    MenuWindow,
    Inventory,
    BgPreloader,
    RightMenu,
    MobileHeader,
  },
  data () {
    return {
      animatedScale: this.$store.state.previewScale,
    }
  },
  computed: {
    scalePercent () {
      return this.animatedScale / 100
    },
    previewScale () {
      return this.$store.state.previewScale
    },

    isMobile () {
      return window.screen.width < 560
    },
  },
  watch: {
    previewScale (newValue) {
      const start = Date.now()
      const end = start + 375
      let shouldEnd = false
      const fromValue = this.animatedScale
      const valueDiff = newValue - this.animatedScale

      const animate = () => {
        const progress = easeOutQuad(Math.min((Date.now() - start) / 375, 1))
        const change = valueDiff * progress
        this.animatedScale = fromValue + change

        if (!shouldEnd) {
          requestAnimationFrame(animate)
        }

        if (Date.now() > end) {
          shouldEnd = true
        }
      }

      animate()
    },
  },
}
</script>

<style scoped lang="stylus">
@import '../../../assets/css/color'

.body__wrapper
  height 100%
  display flex
  flex-direction row
  background-color $color-main

.preview__window
  height 100%
  flex 1 1 auto
  overflow-x hidden
  border-radius 20px
  background $color-black

  &::-webkit-scrollbar
    width 0
    height 0

.wrapper
  display flex
  flex-direction column

.hidden
  display none

.zoom_out
  margin 0
  transform-origin 0 0

@media screen and (max-width 560px)
  .body__wrapper
    flex-direction column-reverse
</style>

<style>
button,
a {
  -webkit-app-region: no-drag;
}

html,
body {
  height: 100%;
}

body {
  margin: 0;
  overflow: hidden;
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
}

#app {
  height: 100%;
}

.layout_wrapper,
.wrapper {
  height: 100%;
}

::-webkit-scrollbar {
  width: 9px;
  height: 9px;
}
::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}
::-webkit-scrollbar-thumb {
  background: #666666;
  transition: background-color 0.25s ease;
  border-radius: 20px;
}
::-webkit-scrollbar-thumb:hover {
  transition: background-color 0.25s ease;
  background-color: #8c8c8c;
}
::-webkit-scrollbar-thumb:active {
  background: #333333;
}
::-webkit-scrollbar-track {
  background: #12151a;
  border-radius: 0 20px 0 0;
}
::-webkit-scrollbar-track:hover {
  background: #1c2129;
}
::-webkit-scrollbar-track:active {
  background: #272d38;
}
::-webkit-scrollbar-corner {
  background: transparent;
}
</style>
