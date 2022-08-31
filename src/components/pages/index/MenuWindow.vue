<template>
  <div class="menu__window">
    <div class="menu__window-buttons">
      <div
        class="menu__window-button menu__window-button-download"
        @click="getZipClick"
      >
        <CloudDownload class="menu__window-icon" />
        <div class="menu__window-button-text">{{ $t("index.download") }}</div>
      </div>
      <a
        class="menu__window-button purple-paradise"
        v-if="!isMobile"
        href="https://backgrounds.gallery/?utm_source=steam.design"
        target="_blank"
      >
        <div class="menu__window-button-text">
          {{ $t("index.backgrounds") }}
        </div>
      </a>

      <div class="menu__window-button" @click="getCurrentBGClick">
        <div class="menu__window-button-text">{{ $t("index.getThisBg") }}</div>
      </div>

      <input
        class="menu__window-button textbox noclick"
        id="urltextbox"
        :placeholder="$t('index.pasteUrlPlaceholder')"
        v-model="bgURL"
      />

      <div class="menu__window-section-container">
        <div class="menu__window-title">
          <div class="menu__window-button-text">
            {{ $t("index.zoomScale") }}:
          </div>
        </div>
        <div class="menu__window-scale__container">
          <template v-if="!isMobile">
            <input
              class="menu__window-scale__input"
              id="scale50"
              name="scale"
              type="radio"
              value="50"
              v-model="previewScale"
            />
            <label class="menu__window-scale__label" for="scale50">
              <div class="menu__window-scale__button">50%</div>
            </label>
            <input
              class="menu__window-scale__input"
              id="scale75"
              name="scale"
              type="radio"
              value="75"
              v-model="previewScale"
            />
            <label class="menu__window-scale__label" for="scale75">
              <div class="menu__window-scale__button">75%</div>
            </label>
            <input
              class="menu__window-scale__input"
              id="scale100"
              name="scale"
              type="radio"
              value="100"
              v-model="previewScale"
            />
            <label class="menu__window-scale__label" for="scale100">
              <div class="menu__window-scale__button">100%</div>
            </label>
            <input
              class="menu__window-scale__input"
              id="scale125"
              name="scale"
              type="radio"
              value="125"
              v-model="previewScale"
            />
            <label class="menu__window-scale__label" for="scale125">
              <div class="menu__window-scale__button">125%</div>
            </label>
          </template>

          <template v-else>
            <input
              class="menu__window-scale__input"
              id="scale50"
              name="scale"
              type="radio"
              value="15"
              v-model="previewScale"
            />
            <label class="menu__window-scale__label" for="scale50">
              <div class="menu__window-scale__button">15%</div>
            </label>
            <input
              class="menu__window-scale__input"
              id="scale75"
              name="scale"
              type="radio"
              value="20"
              v-model="previewScale"
            />
            <label class="menu__window-scale__label" for="scale75">
              <div class="menu__window-scale__button">20%</div>
            </label>
            <input
              class="menu__window-scale__input"
              id="scale100"
              name="scale"
              type="radio"
              value="25"
              v-model="previewScale"
            />
            <label class="menu__window-scale__label" for="scale100">
              <div class="menu__window-scale__button">25%</div>
            </label>
          </template>
        </div>
      </div>
      <a
        class="menu__window-button steam"
        :href="loginUrl"
        v-if="!$store.state.user.id"
      >
        <div class="menu__window-button-text">{{ $t("index.login") }}</div></a
      >
      <div class="menu__window-button" @click="logout" v-else>
        <div class="menu__window-button-text">{{ $t("index.logout") }}</div>
      </div>
    </div>
    <div class="menu__window-credits">
      <div class="menu__window-title">
        <div class="menu__window-button-text">{{ $t("index.our") }}:</div>
      </div>
      <a
        class="menu__window-button"
        href="https://patreon.com/steamdesign"
        rel="noopener noreferrer"
        target="_blank"
      >
        <div class="menu__window-button-text">Patreon</div>
      </a>
      <div class="menu__window-multi-container">
        <a
          class="menu__window-multi-label"
          href="https://github.com/sapic/sapic"
          target="_blank"
        >
          <div class="menu__window-multi-button">GitHub</div>
        </a>
        <a
          class="menu__window-multi-label"
          href="https://steamcommunity.com/groups/sapic"
          target="_blank"
        >
          <div class="menu__window-multi-button">
            {{ $t("index.ourGroup") }}
          </div>
        </a>
        <a
          class="menu__window-multi-label"
          href="https://old.steam.design/?utm_source=steam.design"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="menu__window-multi-button">
            {{ $t("index.ourOldSite") }}
          </div>
        </a>
        <a
          class="menu__window-multi-label"
          :href="extensionLink"
          target="_blank"
          v-if="extensionLink"
        >
          <div class="menu__window-multi-button">
            {{ $t("index.ourExtension") }}
          </div>
        </a>
      </div>
      <a
        class="menu__window-discord"
        href="https://discord.com/invite/jnqnHuX"
        rel="noopener noreferrer"
        target="_blank"
      >
        <img
          class="menu__window-discord-image"
          src="https://discordapp.com/api/guilds/304986224467378177/widget.png?style=banner2"
        />
      </a>
      <div class="menu__window-credits-text">
        Made with ❤️ by TrueCarry and The Oddball
      </div>
    </div>
  </div>
</template>

<script>
import CloudDownload from './CloudDownload.vue'

export default {
  components: {
    CloudDownload,
  },

  computed: {
    previewScale: {
      get () {
        return this.$store.state.previewScale
      },
      set (value) {
        this.$store.commit('setPreviewScale', value)
        this.$store.dispatch('trackClick', ['setPreviewScale', value])
      },
    },
    /* eslint-disable */
    bgURL: {
      set (value) {
        if (value.match(/\.(?:jpeg|jpg|png|webm|mp4)$/i)) {
          this.$store.commit('setBackgroundURL', value)
        }
      },
      get () {
      }
    },
    /* eslint-enable */

    loginUrl () {
      const returnUrl = encodeURIComponent(
        process.env.NODE_ENV === 'production'
          ? 'https://steam.design'
          : 'http://localhost:3000',
      )
      const realm = encodeURIComponent(
        process.env.NODE_ENV === 'production'
          ? 'https://steam.design'
          : 'http://localhost:3000',
      )
      return `https://steamcommunity.com/openid/login?openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.mode=checkid_setup&openid.return_to=${returnUrl}&openid.realm=${realm}&openid.ns.sreg=http%3A%2F%2Fopenid.net%2Fextensions%2Fsreg%2F1.1&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select`
    },

    isMobile () {
      return window.screen.width < 560
    },

    extensionLink () {
      if (navigator.userAgent.indexOf('Chrome') !== -1) {
        return 'https://chrome.google.com/webstore/detail/steam-profile-assistant/mjmabgdoainclinjecbkdancpamdiaih'
      } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
        return 'https://addons.mozilla.org/en-US/firefox/addon/steam-design-buttons/'
      }

      return null
    },
  },

  methods: {
    logout () {
      this.$store.commit('logout')
    },

    getZipClick (e) {
      this.$store.dispatch('downloadZip', { ctrl: e.ctrlKey, alt: e.altKey })
      this.$store.dispatch('trackClick', ['getZIPButton'])
    },

    getCurrentBGClick () {
      this.$store.dispatch('getCurrentBg')
      this.$store.dispatch('trackClick', ['getBGButton'])
    },
  },
}
</script>

<style scoped lang="stylus">
@import '../../../assets/css/color'

.menu__window
  height 100%
  width 250px
  background $color-main
  flex-shrink 0
  user-select none
  display flex
  flex-direction column
  align-items center

  &-hint
    padding 0px 20px
    margin 5px 0 20px 0
    text-align center

    &__text
      text-align center
      font-size 12px
      color white

  &-title
    background-color $color-button
    // width 100%
    margin 0 10px
    box-sizing border-box
    border-radius 3px
    text-align center
    display flex
    align-items center
    justify-content center
    text-decoration none
    height 27px

.menu__window-section-container
  margin-top 10px

.menu__window-discord-image
  margin 10px 10px 0 10px
  transition filter 0.25s ease
  text-align center
  display flex
  cursor pointer
  height 55px
  border-radius 3px

  &:hover
    filter drop-shadow(0px 3px 10px $color-black)
    transition filter 0.25s ease

.menu__window-button
  background-color $color-button
  transition background-color 0.25s ease
  border-radius 3px
  cursor pointer
  margin 10px 10px 0 10px
  text-align center
  display flex
  align-items center
  justify-content center
  text-decoration none

  &.purple-paradise
    // opacity 0.8
    background #AA076B /* fallback for old browsers */
    background -webkit-linear-gradient(45deg, #61045F, #AA076B)
    background linear-gradient(45deg, #61045F, #AA076B)
    transition background 0.25s ease
    animation gradient 3s ease infinite
    background-size 200% 100%
    animation-direction alternate

    &:hover
      background linear-gradient(45deg, #7a0578, #ab076c)

  &:hover
    transition background-color 0.25s ease
    background-color $color-button-hover

  &.noclick
    cursor default
    filter initial
    background-color $color-button

  &.textbox
    cursor text
    width 232px
    height 30px
    border none
    outline none
    transition box-shadow 0.25s ease-in-out

    &:focus
      box-shadow 0 0 40px rgba(0, 0, 0, 0.4)

    &.px
      width 55px

  &.length__slider
    margin 22px 10px 10px 0
    -webkit-appearance none
    width 164px
    height 6px
    background $color-button-hover
    outline none
    margin-left 5%
    float left

    &::-webkit-slider-thumb
      -webkit-appearance none
      appearance none
      width 15px
      height 15px
      background linear-gradient(45deg, $color-button-gradient-1 0%, $color-button-gradient-2 100%)
      box-shadow 0 0 20px rgba(78, 115, 238, 0.5)
      cursor pointer
      border-radius 50%

  &.small
    .menu__window-button-text
      margin 4px
      font-size 14px

.menu__window-button-text
  bottom 11px
  font-size 17px
  font-weight 300
  color $color-white
  margin 15px 0
  text-decoration none

.menu__window-button-download
  background linear-gradient(45deg, $color-button-gradient-1 0%, $color-button-gradient-2 100%)
  animation gradient 3s ease infinite
  background-size 200% 100%
  animation-direction alternate
  position relative
  z-index 2
  opacity 0.8
  transition opacity 0.25s ease

  &:hover
    opacity 1
    transition opacity 0.25s ease

@keyframes gradient
  0%
    background-position 0%

  100%
    background-position 100%

.menu__window-shadow
  background linear-gradient(45deg, $color-button-gradient-1 0%, $color-button-gradient-2 100%)
  filter blur(12px)
  position relative
  height 53px
  top -63px
  margin 10px 10px -63px 10px
  width 232px
  opacity 0.5

.menu__window-item
  transition background-color 0.25s ease
  cursor pointer
  margin 10px 10px 0 10px
  text-align center
  transition filter 0.25s ease
  display flex
  align-items center
  justify-content center

  &:hover
    transition filter 0.25s ease
    filter drop-shadow(0px 3px 10px $color-black)
    transition background-color 0.25s ease
    background-color $color-button-hover

.menu__window-item-text
  bottom 11px
  color $color-white
  margin 0

#urltextbox
  color $color-white

.menu__window-scale__container
  display flex
  flex-direction row
  flex-wrap wrap
  justify-content space-between
  padding 0 10px

.menu__window-scale__input
  display none

  &:checked
    +label
      background #272d38
      cursor default

.menu__window-scale__label
  transition all 0.25s ease
  background-color $color-button
  border-radius 3px
  cursor pointer
  margin-top 5px
  text-align center
  width 49%
  flex 0 0 auto
  padding 12px

  &:hover
    background $color-button-hover

.menu__window-scale__button
  bottom 11px
  text-shadow 0px 4px 10px $color-black
  color $color-white

.menu__window-credits
  position absolute
  bottom 0

.menu__window-credits-text
  color $color-white
  font-size 11px
  margin-bottom 5px
  margin-top 5px
  text-align center

.menu__window-icon
  color $color-white
  margin-right 6px
  width 20px
  height 20px
  color white
  fill currentColor

.menu__window-multi-container
  display flex
  flex-direction row
  flex-wrap wrap
  justify-content space-between
  padding 0 10px
  max-width 250px

.menu__window-multi-label
  transition all 0.25s ease
  background-color $color-button
  border-radius 3px
  cursor pointer
  margin-top 5px
  text-align center
  width 49%
  flex 0 0 auto
  padding 12px
  text-decoration none

  &:hover
    background $color-button-hover

.menu__window-multi-button
  bottom 11px
  text-shadow 0px 4px 10px $color-black
  color $color-white

*
  box-sizing border-box

@media screen and (max-width 560px)
  .menu__window
    height auto
    flex-direction column
    width 100%

    &-buttons
      display flex
      flex-direction row
      flex-wrap wrap
      align-items flex-start

    &-button
      width 48%
      // height 20px
      margin 5px 1%

      &.textbox
        width 48%
        height 53px

      &.steam
        height 59px

    &-title
      background-color $color-button
      width 100%
      margin 0
      box-sizing border-box
      border-radius 3px
      text-align center
      display flex
      align-items center
      justify-content center
      text-decoration none
      height 27px

    &-section-container
      width 48%
      margin 5px 1%

    &-scale
      &__container
        padding 0

      &__label
        width 32%
        height 27px
        padding 0
        display flex
        align-items center
        justify-content center

    &-multi-container
      max-width none
      padding 0

    &-multi-label
      width 32%

    &-credits
      position relative
      width 100%
      margin-top 10px
      padding 0 1%

    &-discord
      display flex
      margin 10px 0 0 0

      img
        margin 0 auto
</style>
