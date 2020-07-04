<template lang="pug">
.backgrounds_container
    button.hover-button
        p Inventory
    .inventory-list
      template(v-for="item in items")
        .inventory-item(:key="item.id" @click="setBackground(item)")
          img.inventory-item-inner(:src="`https://steamcommunity-a.akamaihd.net/economy/image/${item.icon_url_large}/96fx96f`")
</template>

<style lang="stylus" scoped>
@import '../../assets/css/color'

.backgrounds_container
  position absolute
  bottom -175px
  right 9 px
  width calc(100% - 259px)
  height 200px
  background $color-main
  transition all 0.25s ease-in-out
  overflow-y hidden
  overflow-x hidden

  .inventory-list
    position relative
    top 0px
    opacity 0
    transition all 0.25s ease-in-out

    .inventory-item
      margin 5px
      float left
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
    position fixed
    width calc(100% - 259px)
    outline none
    cursor pointer
    height 25px
    right 18px
    border-radius 10px 0 0 0
    background $color-main
    border-style none

    p
      bottom 9px
      color $color-white
      position relative
      transition all 0.25s ease-in-out

  &:hover
    bottom 0
    overflow-y scroll

    .inventory-list
      opacity 1

    .hover-button
      p
        color transparent
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
  },
}
</script>
