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
  </div>
</template>
