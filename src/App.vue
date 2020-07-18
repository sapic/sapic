<template lang="pug">
  div
    //- index
    <router-view></router-view>
</template>

<script>
// import Index from './components/Index'
import Vue from 'vue'

export default Vue.extend({
  components: {
    // Index,
  },
})
</script>

<style scoped>
.container {
  color: green;
}
</style>
