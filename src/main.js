import { createApp } from 'vue'
import { createRouter, createWebHistory, RouterView } from 'vue-router'
import store from './store'
import App from './App.vue'
// import Download from './components/pages/download'
import { createI18n } from 'vue-i18n-lite'

import localeRu from '@/assets/locales/ru'
import localeEn from '@/assets/locales/en'

import Index from './components/pages/index/index.vue'
import Converter from './components/pages/converter/index.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/', component: Index,
    },
    {
      path: '/converter', component: Converter,
    },
    {
      path: '/converter/:raw', component: Converter,
    },
    {
      path: '/:lang',
      component: RouterView,
      children: [
        {
          path: '', component: Index,
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

function getLocale () {
  const allowed = ['en', 'ru']
  const userLocale = (navigator.language || navigator.userLanguage).split('-')[0]

  if (allowed.indexOf(userLocale) > 0) {
    return userLocale
  }

  return 'en'
}

const i18n = createI18n({
  locale: getLocale(),
  fallbackLocale: 'en',

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
    i18n.changeLocale(lang)
  }

  return next()
})

const app = createApp(App)

app.use(store)
app.use(router)
app.use(i18n)

app.mount('#app')
