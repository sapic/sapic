<template lang="pug">
  .right__menu
    .profile_count_link
      span.partnerLabel Our Other Projects

    .profile_count_link_preview(style='margin-top:25px')

      .profile_group.profile_primary_group
        .profile_group_avatar
          a(href='https://designerlist.guide/' target="_blank" rel="noopener noreferrer")
            img(src='@/assets/images/List.jpg', width='64')
        .profile_group_text
          a.whiteLink(href='https://designerlist.guide/' target="_blank" rel="noopener noreferrer") Safe Designer List
          .profile_group_membercount A list of safe, verified artwork designers on Steam.

      .profile_group.profile_primary_group
        .profile_group_avatar
          a(href='https://avatarcropper.com/' target="_blank" rel="noopener noreferrer")
            img(src='@/assets/images/AvatarCropper.jpg', width='64')
        .profile_group_text
          a.whiteLink(href='https://avatarcropper.com/' target="_blank" rel="noopener noreferrer") Quick Avatar Cropper
          .profile_group_membercount A small webpage that allows you to quickly crop avatars for many sites.

    .profile_count_link.ellipsis(style='margin-top:25px')
      span.partnerLabel Our Partners

    .profile_count_link_preview(style='margin-top:25px')
      .profile_group.profile_primary_group
        .profile_group_avatar
          a(href='https://www.steamladder.com/' target="_blank" rel="noopener noreferrer")
            img(src='@/assets/images/ladder.jpg')
        .profile_group_text
          a.whiteLink(href='https://www.steamladder.com/' target="_blank" rel="noopener noreferrer") Steam Ladder
          .profile_group_membercount Leaderboard and ranking site for Steam profiles!

      .profile_group.profile_primary_group
        .profile_group_avatar
          a(href='https://steamcommunity.com/groups/ArtworkProfiles' target="_blank" rel="noopener noreferrer")
            img(src='@/assets/images/ap.jpg')
        .profile_group_text
          a.whiteLink(href='https://steamcommunity.com/groups/ArtworkProfiles' target="_blank" rel="noopener noreferrer") Artwork Profiles
          .profile_group_membercount Celebrating the beauty of Steam profiles.

      .profile_group.profile_primary_group
        .profile_group_avatar
          a(href='https://steamlevels.com/r/steamdesign' target="_blank" rel="noopener noreferrer")
            img(src='@/assets/images/steamlevels.jpg')
        .profile_group_text
          a.whiteLink(href='https://steamlevels.com/r/steamdesign' target="_blank" rel="noopener noreferrer") SteamLevels
          .profile_group_membercount A fast and extremely easy way to level up your profile!

</template>

<style lang="stylus" scoped>
@import '../../../assets/css/color'

.right__menu
  width 300px
  color $color-white

  .profile_group
    display flex

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
</style>
