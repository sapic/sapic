<template lang="pug">
.profile__preview-body
  .profile__preview-body__artbox(
    :style="{ \ backgroundImage: `url('${$store.state.background}')`,\ height: `${$store.state.bgSize.h - 272}px`,\ backgroundPosition: `${($store.state.bgSize.w / 2) + 451}px -272px` \ }"
  )

  .profile__preview-body__side(
    :style="{ \ backgroundImage: `url('${$store.state.background}')`,\ height: `${$store.state.bgSize.h - 272}px`,\ backgroundPosition: `${($store.state.bgSize.w / 2) - 63}px -272px` \ }"
  )
</template>

<style lang="stylus" scoped>
.profile__preview-body
  &__artbox
    border-radius 5px
    overflow hidden
    position relative
    width 506px

  &__side
    margin-left 10px
    border-radius 5px
    overflow hidden
    position relative
    width 100px
</style>
