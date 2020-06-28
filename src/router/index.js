import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
/* 系统设置*/
import account from '@/views/system/account'
import character from '@/views/system/character'
import unitfarm from '@/views/system/farm'
import unitgrange from '@/views/system/grange'
import unitcommunity from '@/views/system/community'
import unitshop from '@/views/system/shop'
/* 便民社区*/
import surrounding from '@/views/rubbish/surrounding'
import guide from '@/views/rubbish/guide'
/* 青蛙公益*/
import volunteershop from '@/views/volunteer/test01'
import volunteeractivity from '@/views/volunteer/test02'
/* 活动设置*/
import romulgation from '@/views/doing/romulgation'
import compilation from '@/views/doing/compilation'
/* 周边商铺*/
import storage from '@/views/surrounding/storage'
import surroundingreport from '@/views/surrounding/report'
import information from '@/views/surrounding/information'
/* 青蛙农场*/
import farmshop from '@/views/farm/shop'
import farmorder from '@/views/farm/order'
import farmreport from '@/views/farm/farmreport'
import farminformation from '@/views/farm/farminformation'
/* 青蛙农庄*/
import grangeshop from '@/views/grange/shop'
import grangeorder from '@/views/grange/order'
import grangereport from '@/views/grange/report'
import grangeinformation from '@/views/grange/information'
/* 自营平台*/
import shelf from '@/views/self/shelf'
import selfshop from '@/views/self/shop'
import selforder from '@/views/self/selforder'
import selfreport from '@/views/self/report'
/* 青蛙课堂*/
import video from '@/views/classroom/video'
import answer from '@/views/classroom/answer'
/* 公益排名*/
import participate from '@/views/welfare/participate'
import hold from '@/views/welfare/hold'
/* 审核中心*/
import reviewfarm from '@/views/review/farm'
import reviewgrange from '@/views/review/grange'
import reviewsurrounding from '@/views/review/surrounding'
import reviewdoing from '@/views/review/doing'
/* 活动中心*/
import farmactivity from '@/views/activity/farmactivity'
import grangeactivity from '@/views/activity/grangeactivity'
import operateactivity from '@/views/activity/operateactivity'
/* 数据中心*/
import datarubbish from '@/views/data/video'
import dataactivity from '@/views/data/activity'
import datauser from '@/views/data/datauser'
import dataintegral from '@/views/data/dataintegral'
import dataclassroom from '@/views/data/dataclassroom'
import datacommodity from '@/views/data/datacommodity'
/* 样式 */
import Layout from '@/layout'

/**
 *
 * hidden: true :默认是false显示菜单栏;而true不显示菜单栏
 * alwaysShow: true 默认是false就是不隐藏导航栏数据；true隐藏数据
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [{
      path: 'index',
      name: '首页',
      component: () => import('@/views/index/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }
]

export const routerList = [
  {
    path: '/system',
    component: Layout,
    redirect: '',
    name: '系统设置',
    alwaysShow: true,
    meta: { title: '系统设置', icon: 'setting' },
    children: [
      {
        path: 'account',
        name: '账号设置',
        component: account,
        meta: { title: '账号设置' }
      },
      {
        path: 'character',
        name: '角色设置',
        component: character,
        meta: { title: '角色设置' }
      },
      {
        path: 'unitfarm',
        name: '农场设置',
        component: unitfarm,
        meta: { title: '农场设置' }
      },
      {
        path: 'unitgrange',
        name: '农庄设置',
        component: unitgrange,
        meta: { title: '农庄设置' }
      },
      {
        path: 'unitcommunity',
        name: '小区设置',
        component: unitcommunity,
        meta: { title: '小区设置' }
      },
      {
        path: 'unitshop',
        name: '商铺设置',
        component: unitshop,
        meta: { title: '商铺设置' }
      }
    ]
  },
  {
    path: '/rubbish',
    component: Layout,
    redirect: '',
    name: '社区便民',
    alwaysShow: true,
    meta: { title: '社区便民', icon: 'guide' },
    children: [
      {
        path: 'surrounding',
        component: surrounding,
        name: '社区周边商铺',
        meta: { title: '社区周边商铺' }
      },
      {
        path: 'guide',
        component: guide,
        name: '垃圾分类编辑',
        meta: { title: '垃圾分类编辑' }
      }
    ]
  },
  {
    path: '/volunteer',
    component: Layout,
    redirect: '',
    name: '青蛙公益',
    alwaysShow: true,
    meta: { title: '青蛙公益', icon: 'volunteer' },
    children: [
      {
        path: 'volunteershop',
        component: volunteershop,
        name: '周边商铺',
        meta: { title: '周边商铺' }
      },
      {
        path: 'volunteeractivity',
        component: volunteeractivity,
        name: '活动列表设置',
        meta: { title: '活动列表设置  ' }
      }
    ]
  },
  {
    path: '/doing',
    component: Layout,
    redirect: '',
    name: '活动设置',
    alwaysShow: true,
    meta: { title: '活动设置', icon: 'doing' },
    children: [
      {
        path: 'romulgation',
        component: romulgation,
        name: '活动发布',
        meta: { title: '活动发布' }
      },
      {
        path: 'compilation',
        component: compilation,
        name: '活动编辑',
        meta: { title: '活动编辑' }
      }
    ]
  },
  {
    path: '/surrounding',
    component: Layout,
    redirect: '',
    alwaysShow: true,
    name: '周边商铺',
    meta: { title: '周边商铺', icon: 'surrounding' },
    children: [{
      path: 'storage',
      component: storage,
      name: '商铺管理',
      meta: { title: '商铺管理  ' }
    },
    {
      path: 'surroundingreport',
      component: surroundingreport,
      name: '销售报表',
      meta: { title: '销售报表' }
    },
    {
      path: 'information',
      component: information,
      name: '商铺信息',
      meta: { title: '商铺信息' }
    }
    ]
  },
  {
    path: '/farm',
    component: Layout,
    redirect: '',
    alwaysShow: true,
    name: '青蛙农场',
    meta: { title: '青蛙农场', icon: 'farm' },
    children: [
      {
        path: 'farmshop',
        component: farmshop,
        name: 'farmshop',
        meta: { title: '店铺管理' }
      },
      {
        path: 'farmorder',
        component: farmorder,
        name: 'farmorder',
        meta: { title: '订单管理' }
      },
      {
        path: 'farmreport',
        component: farmreport,
        name: 'farmreport',
        meta: { title: '销售报表' }
      },
      {
        path: 'farminformation',
        component: farminformation,
        name: '青蛙农场信息',
        meta: { title: '青蛙农场信息' }
      }
    ]
  },
  {
    path: '/grange',
    component: Layout,
    redirect: '',
    alwaysShow: true,
    name: '青蛙农庄',
    meta: { title: '青蛙农庄', icon: 'grange' },
    children: [
      {
        path: 'grangeshop',
        component: grangeshop,
        name: 'grangeshop',
        meta: { title: '店铺管理' }
      },
      {
        path: 'grangeorder',
        component: grangeorder,
        name: 'grangeorder',
        meta: { title: '订单管理' }
      },
      {
        path: 'grangereport',
        component: grangereport,
        name: 'grangereport',
        meta: { title: '销售报表' }
      },
      {
        path: 'grangeinformation',
        component: grangeinformation,
        name: 'grangeinformation',
        meta: { title: '青蛙农庄信息' }
      }
    ]
  },
  {
    path: '/self',
    component: Layout,
    redirect: '',
    alwaysShow: true,
    name: 'self',
    meta: { title: '自营平台', icon: 'Self' },
    children: [
      {
        path: 'shelf',
        component: shelf,
        name: 'shelf',
        meta: { title: '商品上架' }
      },
      {
        path: 'selfshop',
        component: selfshop,
        name: 'selfshop',
        meta: { title: '店铺管理' }
      },
      {
        path: 'selforder',
        component: selforder,
        name: 'selforder',
        meta: { title: '订单管理' }
      },
      {
        path: 'selfreport',
        component: selfreport,
        name: 'selfreport',
        meta: { title: '销售报表' }
      }]
  },
  {
    path: '/classroom',
    component: Layout,
    redirect: '',
    alwaysShow: true,
    name: 'classroom',
    meta: { title: '青蛙课堂', icon: 'classroom' },
    children: [
      {
        path: 'video',
        component: video,
        name: 'video',
        meta: { title: '视频编辑' }
      },
      {
        path: 'answer',
        component: answer,
        name: 'answer',
        meta: { title: '问答编辑' }
      }
    ]
  },
  {
    path: '/welfare',
    component: Layout,
    redirect: '',
    alwaysShow: true,
    name: '公益排名',
    meta: { title: '公益排名', icon: 'ranking' },
    children: [
      {
        path: 'participate',
        component: participate,
        name: '公益活动',
        meta: { title: '公益活动' }
      },
      {
        path: 'hold',
        component: hold,
        name: '公益明星',
        meta: { title: '公益明星' }
      }
    ]
  },
  {
    path: '/review',
    component: Layout,
    redirect: '',
    alwaysShow: true,
    name: '审核中心',
    meta: { title: '审核中心', icon: 'review' },
    children: [
      {
        path: 'reviewfarm',
        component: reviewfarm,
        name: '农场审核',
        meta: { title: '农场审核' }
      },
      {
        path: 'reviewgrange',
        component: reviewgrange,
        name: '农装审核',
        meta: { title: '农装审核' }
      },
      {
        path: 'reviewsurrounding',
        component: reviewsurrounding,
        name: '周边商铺审核',
        meta: { title: '周边商铺审核' }
      },
      {
        path: 'reviewdoing',
        component: reviewdoing,
        name: '公益活动审核',
        meta: { title: '公益活动审核' }
      }
    ]
  },
  {
    path: '/activity',
    component: Layout,
    redirect: '',
    alwaysShow: true,
    name: '活动中心',
    meta: { title: '活动中心', icon: 'activity' },
    children: [
      {
        path: 'farmactivity',
        component: farmactivity,
        name: 'farmactivity',
        meta: { title: '农场活动' }
      },
      {
        path: 'grangeactivity',
        component: grangeactivity,
        name: 'grangeactivity',
        meta: { title: '农庄活动' }
      },
      {
        path: 'operateactivity',
        component: operateactivity,
        name: 'operateactivity',
        meta: { title: '自营活动' }
      }
    ]
  },
  {
    path: '/data',
    component: Layout,
    redirect: '',
    alwaysShow: true,
    name: '数据中心',
    meta: { title: '数据中心', icon: 'data' },
    children: [
      {
        path: 'datarubbish',
        component: datarubbish,
        name: 'datarubbish',
        meta: { title: '垃圾分类统计' }
      },
      {
        path: 'dataactivity',
        component: dataactivity,
        name: 'dataactivity',
        meta: { title: '活动统计' }
      },
      {
        path: 'datauser',
        component: datauser,
        name: 'datauser',
        meta: { title: '用户统计' }
      },
      {
        path: 'dataintegral',
        component: dataintegral,
        name: 'dataintegral',
        meta: { title: '积分统计' }
      },
      {
        path: 'dataclassroom',
        component: dataclassroom,
        name: 'dataclassroom',
        meta: { title: '课堂统计' }
      },
      {
        path: 'datacommodity',
        component: datacommodity,
        name: 'datacommodity',
        meta: { title: '商品统计' }
      }
    ]
  }
]

const createRouter = () => new Router({
  // scrollBehavior: () => ({ y: 0 }), 地址上有#
  mode: 'history', // 地址上没有#号
  routes: constantRoutes
})
// 路由合并
const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
router.$addRoutes = (params) => {
  router.matcher = new Router({ mode: 'history' }).matcher
  router.addRoutes(params)
}

export default
router
