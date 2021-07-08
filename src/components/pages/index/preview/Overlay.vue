<template>
  <svg
    width="976"
    :height="svgHeight"
    :viewBox="`0 0 976 ${svgHeight}`"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      :d="path"
      fill="#12151a"
      opacity="0.5"
    />
  </svg>
</template>

<script>
export default {
  props: {
    imageHeight: {
      type: Number,
      required: false,
      default: 1200,
    },
  },

  computed: {
    svgHeight () {
      return this.imageHeight + 90
    },

    path () {
      return [
        `M0 0h976v${this.svgHeight - 5}a5 5 0 01-5 5H5a5 5 0 01-5-5V`,
        `0zm28 256a5 5 0 00-5 5v${this.svgHeight - 366}a5 5 0 005 5h496a5 5 0 005-5V261a5 5 0 00-5-5H`, // big cutout
        `29zm510 5a5 5 0 015-5h90a5 5 0 015 5v${this.svgHeight - 366}a5 5 0 01-5 5h-90a5 5 0 01-5-5V`, // small cutout
        '272zM29 30a5 5 0 00-5 5v154a5 5 0 005 5h154a5 5 0 005-5V35a5 5 0 00-5-5H', // avatar
        '29z',
      ].join(' ')
    },
  },
}
</script>
