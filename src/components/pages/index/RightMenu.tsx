import { For } from 'solid-js'
import { t } from '@/i18n'
import Ads from './Ads'
import './RightMenu.css'

import TextCenterImage from '@/assets/images/text-center.svg'
import DesignerListImage from '@/assets/images/List.jpg'
import AvatarCropperImage from '@/assets/images/AvatarCropper.png'

// oxlint-disable-next-line no-unused-vars -- unused as on master: kept for the commented-out Steam Ladder entry below
import SteamLadderImage from '@/assets/images/ladder.jpg'
import ArtworkProfilesImage from '@/assets/images/ap.jpg'
import WithlistImage from '@/assets/images/steamwishlist.png'
import DuoBotImage from '@/assets/images/logo-duobot.svg'
// import LevelsImage from '@/assets/images/steamlevels.jpg'
// import LevelUImage from '@/assets/images/steam_level_u.svg'

interface Friend {
  img: string
  title: string
  description: string
  url: string
}

const projects: Friend[] = [
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
]

const friends: Friend[] = [
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
    description: 'Duobot is the fastest and most affordable way to level up your Steam profile.',
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
]

function FriendLink(props: { friend: Friend }) {
  return (
    <a class="friend" href={props.friend.url} target="_blank" rel="noopener noreferrer">
      <div class="friend-avatar">
        <img src={props.friend.img} width="64" />
      </div>
      <div class="friend-text">
        <div class="title">{props.friend.title}</div>
        <div class="description">{props.friend.description}</div>
      </div>
    </a>
  )
}

export default function RightMenu() {
  return (
    <div class="right__menu">
      <Ads />

      <div class="right__menu-header">
        <span class="partnerLabel">{t('index.ourOtherProjects')}</span>
      </div>

      <div class="friends__block">
        <For each={projects}>{(friend) => <FriendLink friend={friend} />}</For>
      </div>

      <div class="right__menu-header">
        <span class="partnerLabel">{t('index.ourPartners')}</span>
      </div>

      <div class="friends__block">
        <For each={friends}>{(friend) => <FriendLink friend={friend} />}</For>
      </div>
    </div>
  )
}
