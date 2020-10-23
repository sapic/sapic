<template>
  <div class="ads__container">
    <Xbet v-if="isRu" />
    <SteamLevels v-else />
  </div>
</template>

<script>
import SteamLevels from './ads/SteamLevels'
import Xbet from './ads/Xbet'

export default {
  components: {
    SteamLevels,
    Xbet,
  },

  computed: {
    isRu () {
      if (!navigator || !navigator.languages) {
        return false
      }

      for (const l of navigator.languages) {
        if (l.indexOf('ru') !== -1) {
          return true
        }
      }

      return false
    },
  },
}
</script>

<style>
</style>
