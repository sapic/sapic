<template>
  <div class="mobile__header">
    <div class="mobile__header-container">
      <img class="mobile__header-image" src="@/assets/images/logo.svg" />
      <h1 class="mobile__header-name">Steam.Design</h1>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="stylus">
@import '../../../assets/css/color'

.mobile__header
  height 63px
  background-color rgb(17, 24, 39)
  border-bottom 1px solid rgb(31, 41, 55)
  box-sizing border-box
  display flex

  &-container
    display flex
    justify-content center
    align-items center
    width 100%

  &-image
    width 48px
    height 48px

  &-name
    color $color-white
    margin 0
    margin-left 12px
    font-size 1.25em
</style>
