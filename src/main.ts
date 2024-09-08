import { createApp } from 'vue'
import { createRouter, createWebHistory, RouterView } from 'vue-router'
import InitPiniaPlugin from './stores/init'
import App from './App.vue'
// import Download from './components/pages/download'
import { createI18n } from 'vue-i18n-lite'

import localeRu from '@/assets/locales/ru'
import localeEn from '@/assets/locales/en'
import localeZhCN from '@/assets/locales/zh-CN'
import localeZhHK from '@/assets/locales/zh-HK'
import localeZhTW from '@/assets/locales/zh-TW'

import IndexPage from './components/pages/index/IndexPage.vue'
import Converter from './components/pages/converter/index.vue'
import { createPinia } from 'pinia'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: IndexPage,
    },
    {
      path: '/converter',
      component: Converter,
    },
    {
      path: '/converter/:raw',
      component: Converter,
    },
    {
      path: '/:lang',
      component: RouterView,
      children: [
        {
          path: '',
          component: IndexPage,
        },
        {
          path: 'converter',
          component: Converter,
        },
        {
          path: 'converter/:raw',
          component: Converter,
        },
        {
          path: '*',
          component: IndexPage,
        },
      ],
    },
  ],
})

function getLocale() {
  const allowed = ['en', 'ru', 'zh-CN', 'zh-HK', 'zh-TW']
  const userLocale = navigator.language

  if (allowed.includes(userLocale)) {
    return userLocale
  }

  const userLanguage = userLocale.split('-')[0]

  if (allowed.includes(userLanguage)) {
    return userLanguage
  }

  return 'en'
}

const i18n = createI18n({
  locale: getLocale(),
  fallbackLocale: 'en',

  messages: {
    ru: localeRu,
    en: localeEn,
    'zh-CN': localeZhCN,
    'zh-HK': localeZhHK,
    'zh-TW': localeZhTW,
  },
})

router.beforeEach((to, from, next) => {
  const lang = Array.isArray(to.params.lang) ? to.params.lang[0] : to.params.lang

  if (!['en', 'ru', 'zh-CN', 'zh-HK', 'zh-TW'].includes(lang)) {
    return next()
  }

  if (i18n.current.value !== lang) {
    i18n.changeLocale(lang)
  }

  return next()
})

const pinia = createPinia()
pinia.use(InitPiniaPlugin)

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(i18n)

app.mount('#app')
