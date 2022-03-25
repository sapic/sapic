<template lang="pug">
.right__menu
  ads

  .right__menu-header
    span.partnerLabel {{ $t('index.ourOtherProjects') }}

  .profile_count_link_preview
    .profile_group.profile_primary_group(
      onclick="window.open('https://center.steam.design/?utm_source=steam.design')"
    )
      .profile_group_avatar
        img(src="@/assets/images/text-center.svg", width="64")
      .profile_group_text
        a.whiteLink Text Center Tool
        .profile_group_membercount Website that helps you center text in steam showcases.

    .profile_group.profile_primary_group(
      onclick="window.open('https://designerlist.guide/')"
    )
      .profile_group_avatar
        img(src="@/assets/images/List.jpg", width="64")
      .profile_group_text
        a.whiteLink Safe Designer List
        .profile_group_membercount A list of safe, verified artwork designers on Steam.

    .profile_group.profile_primary_group(
      onclick="window.open('https://avatarcropper.com/')"
    )
      .profile_group_avatar
        img(src="@/assets/images/AvatarCropper.jpg", width="64")
      .profile_group_text
        a.whiteLink Quick Avatar Cropper
        .profile_group_membercount Webpage that allows you to crop avatars for many sites.

  .right__menu-header
    span.partnerLabel {{ $t('index.ourPartners') }}

  .profile_count_link_preview
    .profile_group.profile_primary_group(
      onclick="window.open('https://www.steamladder.com/')"
    )
      .profile_group_avatar
        img(src="@/assets/images/ladder.jpg")
      .profile_group_text
        a.whiteLink Steam Ladder
        .profile_group_membercount Leaderboard and ranking site for Steam profiles!

    .profile_group.profile_primary_group(
      onclick="window.open('https://steamcommunity.com/groups/ArtworkProfiles')"
    )
      .profile_group_avatar
        img(src="@/assets/images/ap.jpg")
      .profile_group_text
        a.whiteLink Artwork Profiles
        .profile_group_membercount Celebrating the beauty of Steam profiles.

    .profile_group.profile_primary_group(
      onclick="window.open('https://www.steamwishlistcalculator.com')"
    )
      .profile_group_avatar
        img(src="@/assets/images/steamwishlist.png")
      .profile_group_text
        a.whiteLink Steam Wishlist Calculator
        .profile_group_membercount Calculate the total cost of your Steam wishlist!

    .profile_group.profile_primary_group(
      onclick="window.open('https://steamlevels.com')"
    )
      .profile_group_avatar
        img(src="@/assets/images/steamlevels.jpg")
      .profile_group_text
        a.whiteLink SteamLevels
        .profile_group_membercount A fast and extremely easy way to level up your profile!
</template>

<script>
import Ads from './Ads'

export default {
  components: {
    Ads,
  },
}
</script>

<style lang="stylus" scoped>
@import '../../../assets/css/color'

.right__menu
  width 309px
  background $color-main
  height 100%
  display flex
  flex-direction column
  overflow-y scroll
  scrollbar-width thin
  flex 0 0 auto
  text-align center

  .profile_video
    width 280px
    height 560px
    display block
    margin 10px 10px 30px 10px
    position relative
    overflow hidden

    video
      border-radius 10px

  .profile_count_link_preview
    padding 0 10px
    margin-bottom 10px

  .profile_group_avatar
    img
      border-radius 4px

  .profile_group
    display flex
    margin 10px 0 10px 0
    background $color-button
    border-radius 7px
    cursor pointer

    &:hover
      transition background-color 0.25s ease
      background-color $color-button-hover

    &_avatar
      width 65px
      height 65px
      margin auto 10px auto 0

      img
        position relative
        top 5px
        left 5px
        width 55px
        height 55px
        border-radius 7px

    &_text
      a
        color $color-white
        font-size 13px
        text-decoration none
        font-weight 600

      .profile_group_membercount
        font-size 13px
        color #8f98a0

  &-header
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
</style>
