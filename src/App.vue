<template lang="pug">
  .container Hello {{bundler}}
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      bundler: "Parcel111"
    };
  }
});
</script>

<style scoped>
.container {
  color: green;
}
</style> 