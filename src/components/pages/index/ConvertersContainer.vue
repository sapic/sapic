<script setup lang="ts">
import { useMainStore } from '@/stores'
import { computed } from 'vue'

import ConverterPopup from '../converter/converterPopup.vue'

const store = useMainStore()

const converters = computed(() => store.converters?.filter((x) => x))
</script>

<template>
  <div class="container">
    <ConverterPopup v-for="converter in converters" :key="converter.id" :save="converter" />
  </div>
</template>

<style lang="stylus" scoped>
@import '../../../assets/css/color'

.container
  background none
  color white
  border-radius 3px
  width 320px
  position absolute
  top 32px
  left 32px
  z-index 1
  // padding 1rem


  iframe
    width 100%
    height 100%
</style>
