<template>
  <div class="profile__preview-body">
    <div
      class="profile__preview-body__artbox"
      :style="{ height: `${$store.state.bgSize.h - 272}px` }"
    >
      <video
        :src="$store.state.background"
        muted
        autoplay
        loop
        :style="{
          position: 'absolute',
          width: `${$store.state.bgSize.w}px`,
          height: `${$store.state.bgSize.h}px`,
          left: `-${$store.state.bgSize.w / 2 - 410}px`,
          top: `-${272}px`,
        }"
      />
    </div>
    <div
      class="profile__preview-body__side"
      :style="{ height: `${$store.state.bgSize.h - 272}px` }"
    >
      <video
        :src="$store.state.background"
        muted
        autoplay
        loop
        :style="{
          position: 'absolute',
          width: `${$store.state.bgSize.w}px`,
          height: `${$store.state.bgSize.h}px`,
          left: `-${$store.state.bgSize.w / 2 + 100}px`,
          top: `-${272}px`,
        }"
      />
    </div>
  </div>
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
