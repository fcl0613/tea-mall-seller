import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/views/login'
import home from '@/views/home'
import { getToken } from '@/utils/token'
import dashboard from '@/views/dashboard'
import goods from '@/views/goods'
import addGoods from '@/views/goods/addGoods'
import updateGoods from '@/views/goods/updateGoods'


Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/home',
      component: home,
      redirect: '/dashboard',
      children: [
        {
          path: '/dashboard',
          component: dashboard
        },
        {
          path: '/goodsList',
          component: goods
        },
        {
          path: '/addGoods',
          component: addGoods
        },
        {
          path: '/updateGoods',
          component: updateGoods
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = getToken
  if (!token) {
    return next('/login')
  }
  next()
})

export default router