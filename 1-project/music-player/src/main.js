import Vue from 'vue'
import App from './App.vue'
// 全局样式
import './assets/index.css'
// Element-UI引入
import ElementUI from 'element-ui'
Vue.use(ElementUI)
import 'element-ui/lib/theme-chalk/index.css'
// 路由引入
import router from './router'


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
