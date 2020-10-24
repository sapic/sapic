<template lang="pug">
.menu__window
  .menu__window-buttons
    .menu__window-button.menu__window-button-download(@click="getZipClick")
      cloud-download.menu__window-icon
      .menu__window-button-text Download ZIP

    .menu__window-shadow

    .menu__window-button(@click="randomBGClick")
      .menu__window-button-text Random BG

    .menu__window-button(@click="getCurrentBGClick")
      .menu__window-button-text Get this BG

    input#urltextbox.menu__window-button.textbox.noclick(
      placeholder="Paste a background URL here",
      v-model="bgURL"
    )

    //- .menu__window-section-container
    //-   .menu__window-button.noclick.small
    //-     .menu__window-button-text Image Height

    //-   input.menu__window-button.length__slider(type="range")
    //-   input.menu__window-button.textbox.px(placeholder="px")

    .menu__window-section-container
      .menu__window-button.noclick.small
        .menu__window-button-text Zoom Scale

      .menu__window-scale__container
        input#scale50.menu__window-scale__input(
          name="scale",
          type="radio",
          value="50",
          v-model="previewScale"
        )
        label.menu__window-scale__label(for="scale50")
          .menu__window-scale__button 50%

        input#scale75.menu__window-scale__input(
          name="scale",
          type="radio",
          value="75",
          v-model="previewScale"
        )
        label.menu__window-scale__label(for="scale75")
          .menu__window-scale__button 75%

        input#scale100.menu__window-scale__input(
          name="scale",
          type="radio",
          value="100",
          v-model="previewScale"
        )
        label.menu__window-scale__label(for="scale100")
          .menu__window-scale__button 100%

        input#scale125.menu__window-scale__input(
          name="scale",
          type="radio",
          value="125",
          v-model="previewScale"
        )
        label.menu__window-scale__label(for="scale125")
          .menu__window-scale__button 125%

      a.menu__window-button(:href="loginUrl", v-if="!$store.state.user.id")
        .menu__window-button-text Login with Steam
      .menu__window-button(@click="logout", v-else)
        .menu__window-button-text Logout

  .menu__window-credits
    .menu__window-button.noclick.small
      .menu__window-button-text Our:
    .menu__window-multi-container
      a.menu__window-multi-label(
        href="https://github.com/sapic/sapic",
        target="_blank"
      )
        .menu__window-multi-button GitHub
      a.menu__window-multi-label(
        href="https://steamcommunity.com/groups/sapic",
        target="_blank"
      )
        .menu__window-multi-button Group
      a.menu__window-multi-label(
        href="https://old.steam.design",
        target="_blank",
        rel="noopener noreferrer"
      )
        .menu__window-multi-button Old Site

      a.menu__window-multi-label(
        :href="extensionLink",
        target="_blank",
        v-if="extensionLink"
      )
        .menu__window-multi-button Extension

    img.menu__window-discord-image(
      src="https://discordapp.com/api/guilds/304986224467378177/widget.png?style=banner2",
      @click="$store.dispatch('openDiscord')"
    )
    .menu__window-credits-text Made with ❤️ by TrueCarry and The Oddball
</template>

<script>
import CloudDownload from './CloudDownload'

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
        if (value.match(/\.(?:jpeg|jpg|png|webm)$/i)) {
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

    randomBGClick () {
      this.$store.dispatch('randomBackground')
      this.$store.dispatch('trackClick', ['randomBGButton'])
    },

    getZipClick () {
      this.$store.dispatch('downloadZip')
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
  position relative
  z-index 2
  opacity 0.8
  transition opacity 0.25s ease

  &:hover
    opacity 1
    transition opacity 0.25s ease

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
</style>
