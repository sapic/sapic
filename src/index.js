import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import App from './App.vue'
import Index from './components/pages/index/index'
import Download from './components/pages/download'
import Converter from './components/pages/converter'
import VueI18n from 'vue-i18n'

import localeRu from '@/assets/locales/ru'
import localeEn from '@/assets/locales/en'

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(VueI18n)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/', component: Index,
    },
    {
      path: '/download', component: Download,
    },
    {
      path: '/converter', component: Converter,
    },
    {
      path: '/converter/:raw', component: Converter,
    },
    {
      path: '*', component: Index,
    },
    {
      path: '/:lang',
      component: {
        render: h => h('router-view'),
      },
      children: [
        {
          path: '', component: Index,
        },
        {
          path: 'download', component: Download,
        },
        {
          path: 'converter', component: Converter,
        },
        {
          path: 'converter/:raw', component: Converter,
        },
        {
          path: '*', component: Index,
        },
      ],
    },
  ],
})

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: (navigator.language || navigator.userLanguage).split('-')[0],
  messages: {
    ru: localeRu,
    en: localeEn,
  },
})

router.beforeEach((to, from, next) => {
  const lang = to.params.lang

  if (!['en', 'ru'].includes(lang)) {
    return next()
  }

  if (i18n.locale !== lang) {
    i18n.locale = lang
  }

  return next()
})

new Vue({
  render: createElement => createElement(App),
  router,
  store,
  i18n,
}).$mount('#app')
