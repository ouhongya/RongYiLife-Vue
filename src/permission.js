import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken, removeToken } from '@/utils/auth' // 从cookie获取令牌
import { getRouter } from './api/user'
import { addRouter } from './utils/addRouter'
NProgress.configure({ showSpinner: false })
const whiteList = ['/login']
let data = false
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path !== '/login') {
      if (data) {
        next()
      } else {
        gotoRouter(to, next)
      }
    } else {
      next({ path: '/' })
      Message({ message: '您已经登录', type: 'info' })
      next('/')
    }
  } else {
    data = false
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      if (to.path !== '/login') {
        next('/login')
      } else {
        next()
      }
    }
  }
})
router.afterEach(() => {
  NProgress.done()
})
function gotoRouter(to, next) {
  getRouter()
    .then(res => {
      const asyncRouter = addRouter(res.data.queryResult.data) // 进行递归解析
      getUsername(to, next)
      asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
      return asyncRouter
    })
    .then(asyncRouter => {
      router.addRoutes(asyncRouter)
      data = true
      store.dispatch('setRouterList', asyncRouter)
      next({ ...to, replace: true })
    })
    .catch(e => {
      removeToken()
    })
}
function getUsername(to, next) {
  store.dispatch('getUsername').then(res => {
    const { data } = res
    if (data) {
      next()
    }
  })
}
