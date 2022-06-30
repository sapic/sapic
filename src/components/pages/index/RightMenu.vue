<template>
  <div class="right__menu">
    <Ads />

    <div class="right__menu-header">
      <span class="partnerLabel">{{ $t("index.ourOtherProjects") }}</span>
    </div>

    <div class="friends__block">
      <a
        class="friend"
        v-for="friend in projects"
        :href="friend.url"
        target="_blank"
        rel="noopener noreferrer"
        :key="friend.url"
      >
        <div class="friend-avatar"><img :src="friend.img" width="64" /></div>
        <div class="friend-text">
          <div class="title">{{ friend.title }}</div>
          <div class="description">{{ friend.description }}</div>
        </div>
      </a>
    </div>

    <div class="right__menu-header">
      <span class="partnerLabel">{{ $t("index.ourPartners") }}</span>
    </div>

    <div class="friends__block">
      <a
        class="friend"
        v-for="friend in friends"
        :href="friend.url"
        target="_blank"
        rel="noopener noreferrer"
        :key="friend.url"
      >
        <div class="friend-avatar"><img :src="friend.img" width="64" /></div>
        <div class="friend-text">
          <div class="title">{{ friend.title }}</div>
          <div class="description">{{ friend.description }}</div>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import Ads from './Ads.vue'

import TextCenterImage from '@/assets/images/text-center.svg'
import DesignerListImage from '@/assets/images/List.jpg'
import AvatarCropperImage from '@/assets/images/AvatarCropper.jpg'

import SteamLadderImage from '@/assets/images/ladder.jpg'
import ArtworkProfilesImage from '@/assets/images/ap.jpg'
import WithlistImage from '@/assets/images/steamwishlist.png'
import LevelsImage from '@/assets/images/steamlevels.jpg'

export default {
  components: {
    Ads,
  },

  data () {
    return {
      projects: [{
        img: TextCenterImage,
        title: 'Text Center Tool',
        description: 'Site that helps you center text in Steam showcases.',
        url: 'https://center.steam.design/?utm_source=steam.design',
      }, {
        img: DesignerListImage,
        title: 'Safe Designer List',
        description: 'A list of safe, verified artwork designers on Steam.',
        url: 'https://designerlist.guide/',
      }, {
        img: AvatarCropperImage,
        title: 'Quick Avatar Cropper',
        description: 'Site that allows you to crop avatars for many sites.',
        url: 'https://avatarcropper.com/',
      }],

      friends: [{
        img: SteamLadderImage,
        title: 'Steam Ladder',
        description: 'Leaderboard and ranking site for Steam profiles!',
        url: 'https://www.steamladder.com/',
      }, {
        img: ArtworkProfilesImage,
        title: 'Artwork Profiles',
        description: 'Celebrating the beauty of Steam profiles.',
        url: 'https://steamcommunity.com/groups/ArtworkProfiles',
      }, {
        img: WithlistImage,
        title: 'Steam Wishlist Calculator',
        description: 'Calculate the total cost of your Steam wishlist!',
        url: 'https://www.steamwishlistcalculator.com',
      }, {
        img: LevelsImage,
        title: 'SteamLevels',
        description: 'A quick and easy way to level up your profile!',
        url: 'https://steamlevels.com',
      }],
    }
  }
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

  .friends__block
    padding 0 10px

  .friend
    display flex
    margin 10px 0 10px 0
    background $color-button
    border-radius 7px
    cursor pointer
    text-decoration none
    padding 5px
    align-items center

    &:hover
      transition background-color 0.25s ease
      background-color $color-button-hover

    &-avatar
      width 55px
      height 55px
      margin 0 10px 0 0

      img
        width 55px
        height 55px
        border-radius 7px

    &-text
      .title
        color $color-white
        font-size 13px
        text-decoration none
        font-weight 600

      .description
        font-size 13px
        color #8f98a0

  &-header
    background-color $color-button
    color $color-white
    // width 100%
    margin 0 10px
    padding 3px 0
    box-sizing border-box
    border-radius 3px
    text-align center
    display flex
    align-items center
    justify-content center
    text-decoration none
</style>
