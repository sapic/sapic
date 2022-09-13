<template>
  <div class="backgrounds_container">
    <template v-if="user.id">
      <p class="hover-button">{{ $t('inventory.inventory') }}</p>
      <div class="inventory-list">
        <template v-for="item in inventory" :key="item.id">
          <div class="inventory-item" @click="setBackground(item)">
            <img
              class="inventory-item-inner"
              :src="`https://community.cloudflare.steamstatic.com/economy/image/${item.icon_url_large}/62fx62f`"
            />
          </div>
        </template>
      </div>
    </template>
    <p class="hover-button">{{ $t('inventory.random') }}</p>
    <div v-if="shouldShowRandomBgs" class="inventory-list">
      <template v-for="item in randomBgs" :key="item.id">
        <div class="inventory-item" @click="setBackgroundItem(item)">
          <img
            class="inventory-item-inner"
            :src="`https://community.cloudflare.steamstatic.com/economy/image/${item.iconUrl}/62fx62f`"
          />
        </div>
      </template>
    </div>
    <p class="inventory-more purple-paradise" @click="addRandomBgs">
      {{ $t('inventory.loadMore') }}
    </p>
    <div class="spacer"></div>
  </div>
</template>

<script lang="ts" setup>
import { useMainStore } from '@/stores'
import { Background } from '@/types/store'
import { computed, ref } from 'vue'
import { mapState } from 'pinia'

const width = window.innerWidth - 250 - 300 - 200 - 9
const itemsIncr = Math.floor(width / 108)
const startRows = 3
const pagination = ref(1)

const shouldShowRandomBgs = ref(false)

const store = useMainStore()

const user = computed(() => store.user)
const inventory = computed(() => store.inventory)

const start = computed(() => {
  if (store.backgrounds.length === 0) {
    return 0
  }
  let start = Math.floor(Math.random() * store.backgrounds.length) - itemsIncr * startRows
  if (start < 0) {
    start = 0
  }

  return start
})

const randomBgs = computed(() => {
  if (store.backgrounds.length === 0) {
    return []
  }

  let end = start.value + itemsIncr * startRows * pagination.value
  if (end > store.backgrounds.length - 1) {
    end = store.backgrounds.length
  }

  return store.backgrounds.slice(start.value, end)
})

function setBackground(item) {
  store.setBackground({
    background: item.actions[0].link,
    info: item,
  })
  window.location.hash = '#' + item.actions[0].link
}

function setBackgroundItem(item) {
  store.setBackground({
    background: getUrl(item.steamUrl),
    info: item,
  })

  window.location.hash = '#' + getUrl(item.steamUrl)
}

function getUrl(url) {
  if (url.indexOf('http://cdn.akamai.steamstatic.com') !== -1) {
    return url.replace('http://cdn.akamai.steamstatic.com', 'https://steamcdn-a.akamaihd.net')
  } else {
    return url
  }
}

function addRandomBgs() {
  pagination.value++
  store.trackClick(['loadMoreRandomBGs'])
  // let i = this.itemsIncr * 3
  // while (i > 0) {
  //   const randomBg = this.$store.state.backgrounds[
  //     Math.floor(this.$store.state.backgrounds.length * Math.random())
  //   ]
  //   for (const bg of this.randomBgs) {
  //     if (bg.url === randomBg.url) {
  //       continue
  //     }
  //   }
  //   this.randomBgs.push(
  //     this.$store.state.backgrounds[
  //       Math.floor(this.$store.state.backgrounds.length * Math.random())
  //     ],
  //   )
  //   i--
  // }
}

setTimeout(() => {
  shouldShowRandomBgs.value = true
}, 256)
</script>

<style lang="stylus" scoped>
@import '../../../assets/css/color'

.spacer
  margin-bottom 8px

.backgrounds_container
  position absolute
  bottom 8px
  right 409px
  width calc(100% - 250px - 300px - 200px - 9px)
  height 140px
  background transparentify($color-main, 0.5)
  transition all 0.25s ease-in-out
  // overflow-y hidden
  // overflow-x hidden
  overflow-y scroll
  display flex
  flex-direction column
  align-items center
  border-radius 20px

  &:hover
    height 350px

  .inventory-list
    position relative
    // opacity 0
    transition all 0.25s ease-in-out
    display flex
    flex-wrap wrap
    justify-content center

    .inventory-item
      margin 3px
      // float left
      width 98px
      height 98px
      cursor pointer
      background-color $color-button
      border-radius 5px
      background-position top
      background-repeat no-repeat
      display flex
      justify-content center
      flex-direction column

      .inventory-item-inner
        width 92px
        margin-top 4px
        margin-left 4px

  .hover-button
    // position fixed
    width 100%
    outline none
    cursor pointer
    height 25px
    // border-radius 10px 0 0 0
    // background $color-main
    border-style none
    display block
    // bottom 9px
    color $color-white
    position relative
    transition all 0.25s ease-in-out
    margin 0 0 7px 0
    text-align center
    margin-top 10px

  .inventory-more
    color $color-white
    padding 10px 20px
    border-radius 3px
    cursor pointer

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

  @keyframes gradient
    0%
      background-position 0%

    100%
      background-position 100%

    // overflow-y scroll
    .inventory-list
      opacity 1

    .hover-button
      p
        // color transparent
</style>
