<template lang="pug">
.main__container
  //- index
  router-view
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

.main__container {
  height: 100%;
}
</style>
