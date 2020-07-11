<template lang="pug">
.backgrounds_container
  template(v-if="$store.state.user.id")
    p.hover-button Inventory
    .inventory-list
      template(v-for="item in items")
        .inventory-item(:key="item.id" @click="setBackground(item)")
          img.inventory-item-inner(:src="`https://steamcommunity-a.akamaihd.net/economy/image/${item.icon_url_large}/96fx96f`")

  p.hover-button Random backgrounds
  .inventory-list
    template(v-for="item in $store.state.backgrounds.slice(0, 100)")
      .inventory-item(:key="item.id" @click="setBackgroundItem(item)")
        img.inventory-item-inner(:src="item.steamUrl")
  .spacer
</template>

<style lang="stylus" scoped>
@import '../../assets/css/color'

.spacer
  margin-bottom 8px

.backgrounds_container
  position absolute
  bottom -212px
  right 109px
  width calc(100% - 259px - 200px)
  height 350px
  background $color-main
  transition all 0.25s ease-in-out
  // overflow-y hidden
  // overflow-x hidden
  border-radius 10px 10px 0 0
  overflow-y scroll

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
    right 18px
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

  &:hover
    bottom 0

    // overflow-y scroll
    .inventory-list
      opacity 1

    .hover-button
      p
        // color transparent
</style>

<script>
export default {
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
  },

  methods: {
    setBackground (item) {
      this.$store.commit('setBackground', {
        background: item.actions[0].link,
        info: item,
      })
    },

    setBackgroundItem (item) {
      this.$store.commit('setBackground', {
        background: item.steamUrl,
        info: item,
      })
    },
  },
}
</script>
