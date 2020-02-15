import Vue from 'vue'
import VueRouter from 'vue-router'

// 组件
// import Login from '../components/Login'
// import Home from '../components/Home'
// import Welcome from '../components/Welcome'
const Login = () => import(/* webpackChunkName: "index-router" */ '../components/Login')
const Home = () => import(/* webpackChunkName: "index-router" */ '../components/Home')
const Welcome = () => import(/* webpackChunkName: "index-router" */ '../components/Welcome')

// import Users from '../components/user/Users'
// import Rights from '../components/rights/Rights'
// import Roles from '../components/rights/Roles'
const Users = () => import(/* webpackChunkName: "user-router" */ '../components/user/Users')
const Rights = () => import(/* webpackChunkName: "user-router" */ '../components/rights/Rights')
const Roles = () => import(/* webpackChunkName: "user-router" */ '../components/rights/Roles')

// import Cate from '../components/goods/Cate'
// import Params from '../components/goods/Params'
const Cate = () => import(/* webpackChunkName: "cate-router" */ '../components/goods/Cate')
const Params = () => import(/* webpackChunkName: "cate-router" */ '../components/goods/Params')

// import List from '../components/goods/List'
// import Add from '../components/goods/Add'
const List = () => import(/* webpackChunkName: "list-router" */ '../components/goods/List')
const Add = () => import(/* webpackChunkName: "list-router" */ '../components/goods/Add')

// import Order from '../components/order/Order'
// import Report from '../components/report/Report'
const Order = () => import(/* webpackChunkName: "data-router" */ '../components/order/Order')
const Report = () => import(/* webpackChunkName: "data-router" */ '../components/report/Report')

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
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: List
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/orders',
        component: Order
      },
      {
        path: '/reports',
        component: Report
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 要访问的路径，from 从哪个路径来，next() 放行，next('/') 强制跳转
  if (to.path === '/login' || to.path === '/') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})


export default router
