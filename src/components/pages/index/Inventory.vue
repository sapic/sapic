<template lang="pug">
.backgrounds_container
  template(v-if="$store.state.user.id")
    p.hover-button {{ $t('inventory.inventory') }}
    .inventory-list
      template(v-for="item in items")
        .inventory-item(:key="item.id", @click="setBackground(item)")
          img.inventory-item-inner(
            :src="`https://community.cloudflare.steamstatic.com/economy/image/${item.icon_url_large}/62fx62f`"
          )

  p.hover-button {{ $t('inventory.random') }}
  .inventory-list(v-if="shouldShowRandomBgs")
    template(v-for="item in randomBgs")
      .inventory-item(:key="item.id", @click="setBackgroundItem(item)")
        img.inventory-item-inner(
          :src="`https://community.cloudflare.steamstatic.com/economy/image/${item.iconUrl}/62fx62f`"
        )
  p.inventory-more.purple-paradise(@click="addRandomBgs") {{ $t('inventory.loadMore') }}
  .spacer
</template>

<script>
export default {
  data () {
    const width = window.innerWidth - 250 - 300 - 200 - 9
    const itemsIncr = Math.floor(width / 108)
    const startRows = 3
    const pagination = 1

    return {
      width,
      itemsIncr,
      startRows,
      pagination,

      shouldShowRandomBgs: false,
    }
  },

  computed: {
    /* eslint-disable */
    bgURL: {
      set (value) {
        if (value.match(/\.(?:jpeg|jpg|png)$/i)) {
          this.$store.commit('setBackgroundURL', value)
        }
      },
      get () {
      }
    },
    /* eslint-enable */
    items () {
      return this.$store.state.inventory
    },

    randomBgs () {
      if (this.$store.state.backgrounds.length === 0) {
        return []
      }

      let end = this.start + (this.itemsIncr * this.startRows * this.pagination)
      if (end > this.$store.state.backgrounds.length - 1) {
        end = this.$store.state.backgrounds.length
      }

      return this.$store.state.backgrounds.slice(this.start, end)
    },

    start () {
      if (this.$store.state.backgrounds.length === 0) {
        return 0
      }
      let start = Math.floor((Math.random() * this.$store.state.backgrounds.length)) - this.itemsIncr * this.startRows
      if (start < 0) {
        start = 0
      }

      return start
    },
  },

  mounted () {
    setTimeout(() => {
      this.shouldShowRandomBgs = true
    }, 256)
  },

  methods: {
    setBackground (item) {
      this.$store.commit('setBackground', {
        background: item.actions[0].link,
        info: item,
      })
      window.location.hash = '#' + item.actions[0].link
    },

    setBackgroundItem (item) {
      this.$store.commit('setBackground', {
        background: this.getUrl(item.steamUrl),
        info: item,
      })

      window.location.hash = '#' + this.getUrl(item.steamUrl)
    },

    getUrl (url) {
      if (url.indexOf('http://cdn.akamai.steamstatic.com') !== -1) {
        return url.replace('http://cdn.akamai.steamstatic.com', 'https://steamcdn-a.akamaihd.net')
      } else {
        return url
      }
    },

    addRandomBgs () {
      this.pagination++
      this.$store.dispatch('trackClick', ['loadMoreRandomBGs'])
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
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '../../../assets/css/color'

.spacer
  margin-bottom 8px

.backgrounds_container
  position absolute
  bottom -212px
  right 409px
  width calc(100% - 250px - 300px - 200px - 9px)
  height 350px
  background $color-main
  transition all 0.25s ease-in-out
  // overflow-y hidden
  // overflow-x hidden
  border-radius 10px 10px 0 0
  overflow-y scroll
  display flex
  flex-direction column
  align-items center

  .inventory-list
    position relative
    // opacity 0
    transition all 0.25s ease-in-out
    display flex
    flex-wrap wrap
    justify-content center

    .inventory-item
      margin 5px
      // float left
      width 98px
      height 98px
      cursor pointer
      background url('https://steamcommunity-a.akamaihd.net/public/images/economy/trade_itemholder.png')
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
    background $color-main
    border-style none
    display block
    // bottom 9px
    color $color-white
    position relative
    transition all 0.25s ease-in-out
    margin 0
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

      &:hover
        background linear-gradient(45deg, #7a0578, #ab076c)

  &:hover
    bottom 0

    // overflow-y scroll
    .inventory-list
      opacity 1

    .hover-button
      p
        // color transparent
</style>
