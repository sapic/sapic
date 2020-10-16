<template lang="pug">
.right__menu
  a.profile_video(
    href="https://steamlevels.com/r/steamdesign",
    target="_blank",
    rel="noreferrer noopener"
  )
    video(muted, autoplay, playsinline, loop, ref="profile_video")

  .profile_count_link
    span.partnerLabel Our Other Projects

  .profile_count_link_preview
    .profile_group.profile_primary_group
      .profile_group_avatar
        a(
          href="https://center.steam.design/",
          target="_blank",
          rel="noopener noreferrer"
        )
          img(src="@/assets/images/text-center.svg", width="64")
      .profile_group_text
        a.whiteLink(
          href="https://center.steam.design/",
          target="_blank",
          rel="noopener noreferrer"
        ) Text Center Tool
        .profile_group_membercount Website that helps you center text in steam showcases.

    .profile_group.profile_primary_group
      .profile_group_avatar
        a(
          href="https://designerlist.guide/",
          target="_blank",
          rel="noopener noreferrer"
        )
          img(src="@/assets/images/List.jpg", width="64")
      .profile_group_text
        a.whiteLink(
          href="https://designerlist.guide/",
          target="_blank",
          rel="noopener noreferrer"
        ) Safe Designer List
        .profile_group_membercount A list of safe, verified artwork designers on Steam.

    .profile_group.profile_primary_group
      .profile_group_avatar
        a(
          href="https://avatarcropper.com/",
          target="_blank",
          rel="noopener noreferrer"
        )
          img(src="@/assets/images/AvatarCropper.jpg", width="64")
      .profile_group_text
        a.whiteLink(
          href="https://avatarcropper.com/",
          target="_blank",
          rel="noopener noreferrer"
        ) Quick Avatar Cropper
        .profile_group_membercount Webpage that allows you to crop avatars for many sites.

  .profile_count_link.ellipsis
    span.partnerLabel Our Partners

  .profile_count_link_preview
    .profile_group.profile_primary_group
      .profile_group_avatar
        a(
          href="https://www.steamladder.com/",
          target="_blank",
          rel="noopener noreferrer"
        )
          img(src="@/assets/images/ladder.jpg")
      .profile_group_text
        a.whiteLink(
          href="https://www.steamladder.com/",
          target="_blank",
          rel="noopener noreferrer"
        ) Steam Ladder
        .profile_group_membercount Leaderboard and ranking site for Steam profiles!

    .profile_group.profile_primary_group
      .profile_group_avatar
        a(
          href="https://steamcommunity.com/groups/ArtworkProfiles",
          target="_blank",
          rel="noopener noreferrer"
        )
          img(src="@/assets/images/ap.jpg")
      .profile_group_text
        a.whiteLink(
          href="https://steamcommunity.com/groups/ArtworkProfiles",
          target="_blank",
          rel="noopener noreferrer"
        ) Artwork Profiles
        .profile_group_membercount Celebrating the beauty of Steam profiles.

    .profile_group.profile_primary_group
      .profile_group_avatar
        a(
          href="https://www.steamwishlistcalculator.com/",
          target="_blank",
          rel="noopener noreferrer"
        )
          img(src="@/assets/images/steamwishlist.png")
      .profile_group_text
        a.whiteLink(
          href="https://www.steamwishlistcalculator.com/",
          target="_blank",
          rel="noopener noreferrer"
        ) Steam Wishlist Calculator
        .profile_group_membercount Calculate the total cost of your Steam wishlist!

    .profile_group.profile_primary_group
      .profile_group_avatar
        a(
          href="https://steamlevels.com/r/steamdesign",
          target="_blank",
          rel="noopener noreferrer"
        )
          img(src="@/assets/images/steamlevels.jpg")
      .profile_group_text
        a.whiteLink(
          href="https://steamlevels.com/r/steamdesign",
          target="_blank",
          rel="noopener noreferrer"
        ) SteamLevels
        .profile_group_membercount A fast and extremely easy way to level up your profile!
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

<style lang="stylus" scoped>
@import '../../../assets/css/color'

.right__menu
  width 309px
  color $color-white
  height 100%
  display flex
  flex-direction column
  overflow-y scroll
  scrollbar-width thin

  .profile_video
    width 300px
    height 600px
    display block
    margin-bottom 30px
    position relative

  .partnerLabel
    margin-left 10px

  .profile_count_link_preview
    padding 0 10px
    margin-bottom 20px

  .profile_count_link
    margin-bottom 20px

  .profile_group_avatar
    img
      border-radius 4px

  .profile_group
    display flex
    margin-bottom 10px

    &_avatar
      width 60px
      height 60px
      margin auto 10px auto 0

      img
        width 60px
        height 60px
        // border-radius 100%

    &_text
      a
        color $color-white
        font-size 13px
        text-decoration none
        font-weight 600

      .profile_group_membercount
        font-size 13px
        color #8f98a0
</style>
