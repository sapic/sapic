<template>
  <div>
    <iframe
      scrolling="no"
      frameBorder="0"
      style="padding:0px; margin:0px; border:0px;border-style:none;border-style:none;"
      :width="item.width"
      :height="item.height"
      :src="item.src"
    />
  </div>
</template>

<script>
const variants = [{
  width: 300,
  height: 250,
  src: 'https://refpakglscpj.best/I?tag=s_705211m_4657c_&site=705211&ad=4657',
}, {
  width: 300,
  height: 250,
  src: 'https://refpakglscpj.best/I?tag=s_705211m_30319c_&site=705211&ad=30319',
}, {
  width: 300,
  height: 500,
  src: 'https://refpakglscpj.best/I?tag=s_705211m_32461c_&site=705211&ad=32461',
}, {
  width: 300,
  height: 300,
  src: 'https://refpakglscpj.best/I?tag=s_705211m_32459c_&site=705211&ad=32459',
}, {
  width: 300,
  height: 500,
  src: 'https://refpakglscpj.best/I?tag=s_705211m_30339c_&site=705211&ad=30339',
}, {
  width: 300,
  height: 300,
  src: 'https://refpakglscpj.best/I?tag=s_705211m_30337c_&site=705211&ad=30337',
}, {
  width: 300,
  height: 250,
  src: 'https://refpakglscpj.best/I?tag=s_705211m_3895c_&site=705211&ad=3895',
}]
export default {
  data () {
    return {
      item: variants[Math.floor(Math.random() * variants.length)],
    }
  },
}
</script>

<style>
</style>
