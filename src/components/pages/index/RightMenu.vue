<template>
  <div class="right__menu">
    <Ads />

    <div class="right__menu-header">
      <span class="partnerLabel">{{ $t('index.ourOtherProjects') }}</span>
    </div>

    <div class="friends__block">
      <a
        v-for="friend in projects"
        :key="friend.url"
        class="friend"
        :href="friend.url"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div class="friend-avatar"><img :src="friend.img" width="64" /></div>
        <div class="friend-text">
          <div class="title">{{ friend.title }}</div>
          <div class="description">{{ friend.description }}</div>
        </div>
      </a>
    </div>

    <div class="right__menu-header">
      <span class="partnerLabel">{{ $t('index.ourPartners') }}</span>
    </div>

    <div class="friends__block">
      <a
        v-for="friend in friends"
        :key="friend.url"
        class="friend"
        :href="friend.url"
        target="_blank"
        rel="noopener noreferrer"
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
import AvatarCropperImage from '@/assets/images/AvatarCropper.png'

import SteamLadderImage from '@/assets/images/ladder.jpg'
import ArtworkProfilesImage from '@/assets/images/ap.jpg'
import WithlistImage from '@/assets/images/steamwishlist.png'
import DuoBotImage from '@/assets/images/logo-duobot.svg'
// import LevelsImage from '@/assets/images/steamlevels.jpg'
// import LevelUImage from '@/assets/images/steam_level_u.svg'

export default {
  components: {
    Ads,
  },

  data() {
    return {
      projects: [
        {
          img: TextCenterImage,
          title: 'Text Center Tool',
          description: 'Website that helps you center text in steam showcases.',
          url: 'https://center.steam.design/?utm_source=steam.design',
        },
        {
          img: DesignerListImage,
          title: 'Safe Designer List',
          description: 'A list of safe, verified artwork designers on Steam.',
          url: 'https://designerlist.guide/',
        },
        {
          img: AvatarCropperImage,
          title: 'Quick Avatar Cropper',
          description: 'Webpage that allows you to crop avatars for many sites.',
          url: 'https://avatarcropper.com/',
        },
      ],

      friends: [
        // {
        //   img: LevelsImage,
        //   title: 'SteamLevels',
        //   description: 'A quick and easy way to level up your profile!',
        //   url: 'https://steamlevels.com',
        // },
        // {
        //   img: LevelUImage,
        //   title: 'SteamLevelU',
        //   description: 'A fast and easy way to take your Steam profile level to the max!',
        //   url: 'https://steamlevelu.com/p/420745379',
        // },
        // {
        // img: SteamLadderImage,
        // title: 'Steam Ladder',
        // description: 'Leaderboard and ranking for Steam accounts!',
        // url: 'https://www.steamladder.com/',
        // },
        {
          img: DuoBotImage,
          title: 'Duobot',
          description:
            'Duobot is the fastest and most affordable way to level up your Steam profile.',
          url: 'https://duobot.com/c/steamdesign',
        },
        {
          img: ArtworkProfilesImage,
          title: 'Artwork Profiles',
          description: 'Celebrating the beauty of Steam profiles.',
          url: 'https://steamcommunity.com/groups/ArtworkProfiles',
        },
        {
          img: WithlistImage,
          title: 'Steam Wishlist Calculator',
          description: 'Calculate the total cost of your Steam wishlist!',
          url: 'https://www.steamwishlistcalculator.com',
        },
      ],
    }
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

    &:first-of-type
      margin-top 20px
</style>
