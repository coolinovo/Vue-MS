import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
import './assets/global.css'

Vue.config.productionTip = false

// 设置请求的 baseURL
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
// 把 axios 挂载到 Vue 的原型上，$http 是自定义的方法名
Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
