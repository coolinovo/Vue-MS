import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
import './assets/global.css'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


Vue.config.productionTip = false

// 设置请求的 baseURL
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
// 展示进度条
axios.interceptors.request.use(config => {
  NProgress.start()
  // 为请求头对象添加 token 验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
// 把 axios 挂载到 Vue 的原型上，$http 是自定义的方法名
Vue.prototype.$http = axios

Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)

Vue.filter('dateFormat', (origin) => {
  const dt = new Date(origin)
  const y =  dt.getFullYear()
  const m =  (dt.getMonth() + 1 + '').padStart(2 ,'0')
  const d =  (dt.getDate() + '').padStart(2 ,'0')
  const hh =  (dt.getHours() + '').padStart(2 ,'0')
  const mm =  (dt.getMinutes() + '').padStart(2 ,'0')
  const ss =  (dt.getSeconds() + '').padStart(2 ,'0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
