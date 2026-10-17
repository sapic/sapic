<template>
  <div class="wrapper">
    <section class="body__wrapper">
      <MenuWindow />
      <!-- The converter popups sit on this wrapper, not on the scrolled window,
           so they stay in the visible corner when the zoomed preview scrolls -->
      <div class="preview__frame">
        <ConvertersContainer />
        <div
          ref="previewWindow"
          class="preview__window"
          :style="{ overflowX: scalePercent > 1 ? 'auto' : 'hidden' }"
        >
        <div
          class="zoom_out"
          :style="{
            transform: `scale(${scalePercent})`,
            width: `calc(100% / ${scalePercent}) !important`,
            height: `calc(100% * ${scalePercent}) !important`,
          }"
        >
          <ImagePreview />
          <BgPreloader />
        </div>
        </div>
      </div>
      <template v-if="!isMobile">
        <RightMenu />
        <Inventory />
      </template>
      <MobileHeader v-else />
      <Scripts />
    </section>
  </div>
</template>

<script>
import ImagePreview from './ImagePreview.vue'
import Inventory from './InventoryContainer.vue'
import MenuWindow from './MenuWindow.vue'
import BgPreloader from './BgPrealoader.vue'
import Scripts from '../../Scripts.vue'
import RightMenu from './RightMenu.vue'
import MobileHeader from './MobileHeader.vue'
import ConvertersContainer from './ConvertersContainer.vue'

import { useMainStore } from '@/stores'
import { mapState } from 'pinia'

const easeOutQuad = (t) => t * (2 - t)

export default {
  components: {
    Scripts,

    ImagePreview,
    MenuWindow,
    Inventory,
    BgPreloader,
    RightMenu,
    MobileHeader,
    ConvertersContainer,
  },
  data() {
    const store = useMainStore()
    return {
      animatedScale: store.previewScale,
    }
  },
  computed: {
    ...mapState(useMainStore, ['previewScale']),

    scalePercent() {
      return this.animatedScale / 100
    },

    isMobile() {
      return window.screen.width < 560
    },
  },
  mounted() {
    this.centerPreview()
    // The midpoint depends on the window width: re-centre when it changes
    this.resizeObserver = new ResizeObserver(() => this.centerPreview())
    this.resizeObserver.observe(this.$refs.previewWindow)
  },
  beforeUnmount() {
    this.resizeObserver?.disconnect()
  },
  methods: {
    // When the zoomed profile is wider than the window, keep the profile column
    // in the middle of the view (the window scrolls sideways from there)
    centerPreview() {
      this.$nextTick(() => {
        const el = this.$refs.previewWindow
        if (!el) return
        // At 100% or less nothing scrolls (overflow-x hidden): a leftover offset
        // would shift the whole preview sideways
        el.scrollLeft = this.scalePercent > 1 ? (el.scrollWidth - el.clientWidth) / 2 : 0
      })
    },
  },
  watch: {
    previewScale(newValue) {
      const start = Date.now()
      const end = start + 375
      let shouldEnd = false
      const fromValue = this.animatedScale
      const valueDiff = newValue - this.animatedScale

      const animate = () => {
        const progress = easeOutQuad(Math.min((Date.now() - start) / 375, 1))
        const change = valueDiff * progress
        this.animatedScale = fromValue + change
        this.centerPreview()

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

.preview__frame
  height 100%
  flex 1 1 auto
  min-width 0
  position relative

.preview__window
  height 100%
  // overflow-x is set inline: it scrolls sideways only above 100% zoom, where
  // the profile can be wider than the window (below 100% the zoom box's
  // unscaled width would add a scrollbar into empty space)
  overflow-x hidden
  min-width 0
  border-radius 20px
  background $color-black
  position relative

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
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
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
