<template lang="pug">
.responsive_page_frame.with_header.main-container
  .responsive_page_content
    .responsive_page_template_content
      .no_header.profile_page.has_profile_background
        .profile__bg__absolute
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
        .profile_header_bg
          .profile_header_bg_texture
            .profile_header
              .profile_header_content
                .profile_header_centered_persona
                  .persona_name(style='font-size: 24px;')
                    span.actual_persona_name {{ $store.state.user.screenName }}
                .playerAvatar.profile_header_size.online
                  .playerAvatarAutoSizeInner
                    img.sapicAva(:src='$store.state.user.avatar')
                .profile_header_badgeinfo
                  .profile_header_badgeinfo_badge_area
                  .profile_header_actions
                .profile_header_summary
        .profile_content.has_profile_background
          .profile_background_holder_content
            .profile_background_overlay_content
          .profile_content_inner
            .profile_leftcol
              .profile_customization_area
                .profile_customization
                  .profile_customization_header
                  .profile_customization_block
                    .screenshot_showcase
                      .screenshot_showcase_primary.showcase_slot
                        .screenshot_showcase_screenshot
                          .profile_main_artbox(:style="{ \
                            overflow: 'hidden',\
                            position: 'relative',\
                            width: `506px`,\
                            height: `${$store.state.bgSize.h - 272}px`\
                          }")
                            video(
                              :src="$store.state.background"
                              muted
                              autoplay
                              loop
                              :style="{ \
                                position: 'absolute',\
                                width: `${$store.state.bgSize.w}px`,\
                                height: `${$store.state.bgSize.h}px`,\
                                \
                                left: `-${$store.state.bgSize.w/2 - 410}px`,\
                                top: `-${272}px`\
                              }"
                            )
                        .screenshot_showcase_itemname
                      .screenshot_showcase_rightcol
                        .screenshot_showcase_smallscreenshot.showcase_slot
                          .screenshot_showcase_screenshot
                            .profile_main_artbox_side1(:style="{ \
                              position: 'relative',\
                              overflow: 'hidden',\
                              width: `102px`,\
                              height: `${$store.state.bgSize.h - 272}px`\
                            }")
                              video(
                                :src="$store.state.background"
                                muted
                                autoplay
                                loop
                                :style="{ \
                                  position: 'absolute',\
                                  width: `${$store.state.bgSize.w}px`,\
                                  height: `${$store.state.bgSize.h}px`,\
                                  \
                                  left: `-${$store.state.bgSize.w/2 + 100}px`,\
                                  top: `-${272}px`\
                                }"
                              )
                        .screenshot_showcase_smallscreenshot.screenshot_count
                          .screenshot_showcase_screenshot

</template>

<script>
export default {

}
</script>

<style scoped lang="stylus">
@import '../../assets/css/color'

.profile_main_artbox
  width 100%
  height 850px
  background-position -508px -271px

.profile_header_bg
  background $color-main-transparent
  position relative
  max-width 1018px
  min-height 224px
  padding-bottom 16px
  margin 0 auto
  background-repeat no-repeat
  background-position center bottom

.profile_background_overlay_content
  background-color $color-main-transparent
  position absolute
  top 0
  right 0
  bottom 0
  left 0
  z-index 1

.profile_main_artbox_side1
  width 100%
  height 850px
  background-position -1022px -271px

.profile_customization
  background-color transparent
  position relative
  background-position top left
  background-repeat no-repeat
  border-radius 3px
  padding 0 10px 11px 10px
  margin-bottom 12px
  font-size 13px
  overflow hidden

.sapicAva
  border-radius 5px

.main-container
  flex 0 1 auto
  user-select none
  cursor default
  border-radius 0 0 10px 10px

div
  box-sizing content-box

  &.profile_page
    position relative
    min-width 950px
    background-image url('https://steamcommunity-a.akamaihd.net/public/images/profile/profile_bg.jpg')
    background-repeat repeat-x
    background-color #262627

    &.has_profile_background
      background-color $color-black
      background-position center top
      background-repeat no-repeat

.responsive_page_frame
  color #8f98a0

.playerAvatar
  &.online
    background-color #57cbde
    background linear-gradient(to bottom, rgba(83, 164, 196, 1) 5%, rgba(69, 128, 151, 1) 95%)
    filter none

    img
      background linear-gradient(to bottom, #41778f 5%, #3d697b 95%)

  &.profile_header_size
    position relative
    width 166px
    height 166px
    border-radius 5px

    .playerAvatarAutoSizeInner
      position absolute
      top 2px
      right 2px
      bottom 2px
      left 2px

      img
        background none
        filter none
        display block
        padding 0
        width 100%
        height 100%

@media screen and (-webkit-min-device-pixel-ratio: 0)
  div
    &.profile_page
      &.has_profile_background
        background-position 49.999% 0

.profile_header_bg_texture
  max-width 976px
  min-height 224px
  margin 0 auto
  background-repeat no-repeat
  background-position center

.profile_header
  position relative
  max-width 926px
  margin 0 auto
  padding-top 24px

  .playerAvatar
    &.profile_header_size
      float left
      margin-right 18px

  .persona_name
    line-height 40px
    font-size 24px
    color $color-white
    text-overflow ellipsis
    white-space nowrap
    overflow hidden
    font-family 'Motiva Sans', Sans-serif
    font-weight 200

  .profile_header_centered_persona
    position absolute
    left 186px
    right 268px
    white-space nowrap

.profile_header_content
  position relative
  padding-top 8px
  color #898989
  font-size 13px

.profile_header_summary
  overflow hidden
  padding-right 18px

.profile_header_badgeinfo
  float right

.profile_header_badgeinfo_badge_area
  width 268px

.profile_header_actions
  white-space nowrap

.profile_content
  position relative
  background-image url('https://steamcommunity-a.akamaihd.net/public/images/profile/profile_content_bg.png')
  background-position center
  background-repeat repeat-y
  padding 30px 12px 64px 12px
  width 926px
  margin 0 auto
  font-size 13px

  &.has_profile_background
    background none
    overflow hidden

.profile_content_inner
  position relative

.profile_leftcol
  width 636px
  float left
  box-sizing initial

.profile_customization_header
  font-family 'Motiva Sans', Sans-serif
  font-weight 200
  color #5491cf
  font-size 20px
  line-height 30px
  overflow hidden
  white-space nowrap
  text-overflow ellipsis

.showcase_slot
  display block
  float left
  position relative

.screenshot_showcase_primary
  width 508px
  max-width 83%
  float left

  .screenshot_showcase_screenshot
    margin-bottom 4px

.screenshot_showcase_screenshot
  border 1px solid $color-black
  display block
  white-space nowrap
  overflow hidden

.screenshot_showcase_itemname
  word-wrap break-word

.screenshot_showcase_rightcol
  float right
  max-width 17%
  width 102px
  text-align center

.screenshot_showcase_smallscreenshot
  float none
  margin-bottom 11px

  &.screenshot_count
    display block
    height 57px
    line-height 57px
    background-color #222223
    color $color-white

.profile_background_holder_content
  position absolute
  top 0
  right 0
  bottom 0
  left 0
  z-index 0

.profile__bg__absolute
  position absolute
  left 0
  top 0
  // left 50%
  // transform translateX(-50%)
  width 100%
  // background red
  display flex
  justify-content center
</style>
<style scoped src="@/assets/css/motiva_sans.css"></style>
