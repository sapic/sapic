import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import App from './App.vue'
import Index from './components/pages/index/index'
import Download from './components/pages/download'

Vue.config.productionTip = false

Vue.use(VueRouter)

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
      path: '*', component: Index,
    },
  ],
})

new Vue({
  render: createElement => createElement(App),
  router,
  store,
}).$mount('#app')
