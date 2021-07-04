<template lang="pug">
.profile__preview(
  :style="{ backgroundImage: `url('${$store.state.background}')` }"
)
  .profile__preview-bg
    video(
      :src="$store.state.background"
      muted
      autoplay
      loop
      :style="{ \
        width: `${$store.state.bgSize.w}px`,\
        height: `${$store.state.bgSize.h}px`\
      }"
    )

  .profile__preview-container
    .profile__preview-header
      .profile__preview-header__avatar

    WebmBody.profile__preview-body(v-if="$store.getters.isVideo")
    StaticBody.profile__preview-body(v-else)
</template>

<script>
import WebmBody from './preview/WebmBody'
import StaticBody from './preview/StaticBody'

export default {
  components: {
    WebmBody,
    StaticBody,
  },
}
</script>

<style lang="stylus" scoped>
.profile__preview
  width 100%
  display flex
  flex-direction column
  background-position 49.999% 0
  background-repeat no-repeat

  &-container
    background-color rgba(18, 21, 26, 0.5)
    width 976px
    margin 0 auto

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
