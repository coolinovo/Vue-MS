import Vue from 'vue'
import VueRouter from 'vue-router'

// 组件
import Login from '../components/Login'
import Home from '../components/Home'

Vue.use(VueRouter)

// 路由映射表
const routes = [
  {
    path: '/',
    redirect: '/login'  // 路由重新向到 /login
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from ,next) => {
  // to 要访问的路径，from 从哪个路径来，next() 放行，next('/') 强制跳转
  if (to.path === '/login' || to.path === '/') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})



export default router
