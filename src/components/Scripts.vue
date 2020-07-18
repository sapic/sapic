<template>
  <div class="scripts__container">
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <component
      :is="'script'"
      async
      src="https://www.googletagmanager.com/gtag/js?id=UA-98294219-4"
    />
    <component :is="'script'">
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-98294219-4');
    </component>

    <component :is="'script'">
      if (typeof module === 'object') {
      window.module = module;
      module = undefined;
      }

      if (window.module) module = window.module;

      // yandex
      !function(t, e, a) {
      (e[a] = e[a] || []).push(function() {
      try {
      e.yaCounter27350393 = new Ya.Metrika({
      id: 27350393,
      trackHash: !0
      })
      } catch (t) {}
      });
      var n = t.getElementsByTagName("script")[0],
      c = t.createElement("script"),
      r = function() {
      n.parentNode.insertBefore(c, n)
      };
      c.type = "text/javascript", c.async = !0, c.src = ("https:" == t.location.protocol ? "https:" : "http:") +
      "//mc.yandex.ru/metrika/watch.js", "[object Opera]" == e.opera ? t.addEventListener("DOMContentLoaded", r, !1) :
      r()
      }(document, window, "yandex_metrika_callbacks");
    </component>
    <noscript>
      <!-- yandex -->
      <div>
      <img src='//mc.yandex.ru/watch/27350393' style='position:absolute; left:-9999px;' alt=''>
      </div>
    </noscript>
  </div>
</template>

<script>
export default {
  mounted () {
    // setTimeout(() => {
    //   const script = document.createElement('script')
    //   script.onload = function () {
    //     const body = document.getElementById('networknhost')
    //     body.innerHTML = '!function(e,a){if(function(e){"string"==typeof e&&(e=[e]);for(var n=0;n<e.length;n++)a.cookie=e[n]+"=;max-age=-1;domain=."+a.domain+";path=/"}(["euconsent","eupubconsent","googlepersonalization"]),!e.__cmp){e.__cmp=function(){(e.attachEvent||e.addEventListener)("message",function(a){e.__cmp.receiveMessage(a)},!1),function n(){if(!e.frames.__cmpLocator)if(a.body){var o=a.createElement("iframe");o.style.display="none",o.name="__cmpLocator",a.body.appendChild(o)}else setTimeout(n,5)}();var n=[],o=function(a,o,c){"ping"===a?c&&c({gdprAppliesGlobally:!!(e.__cmp&&e.__cmp.config&&e.__cmp.config.storeConsentGlobally),cmpLoaded:!1}):n.push({command:a,parameter:o,callback:c})};return o.commandQueue=n,o.receiveMessage=function(e){var a=e&&e.data&&e.data.__cmpCall;a&&n.push({callId:a.callId,command:a.command,parameter:a.parameter,event:e})},o.config=e.cmpConfig||{globalVendorListLocation:"https://cmp.network-n.com/vendorlist.json"},o}();var n=a.createElement("script");n.async=!0,n.src="https://cmp.network-n.com/js/cmp.complete.bundle.js",a.getElementsByTagName("head")[0].appendChild(n)}}(window,document);'

    //     // body.appendChild()
    //   }
    //   script.src = 'https://steam.design/networkn.min.js'
    //   document.body.appendChild(script) // or something of the likes
    // }, 50)
  },
}
</script>

<style scoped>
.scripts__container {
  position: absolute;
  left: -9999px;
  top: -9999px;
}
</style>
