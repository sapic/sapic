<script setup lang="ts">
import { ref } from 'vue'
interface ImageInfo {
  enabled: boolean
  name: string
  data: Uint8Array
}    

const progress = ref(0) 
   
const props = defineProps({
  info: {
    type: Object,
    required: true, 
  },
})
   

const x = 2



const y = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"+ 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'+'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'+'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'+'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
</script>

<template>
  <div>ConvertRow</div>
</template>
