/* 系统设置*/
import account from '@/views/system/account'
import character from '@/views/system/character'
import unitfarm from '@/views/system/farm'
import unitgrange from '@/views/system/grange'
import unitcommunity from '@/views/system/community'
import unitshop from '@/views/system/shop'
import systemInformation from '@/views/system/information'
import lable from '@/views/system/lable'
import qa from '@/views/system/qa'
/* 便民社区*/
import surrounding from '@/views/rubbish/surrounding'
import guide from '@/views/classroom/guide'
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
import storeOrder from '@/views/surrounding/order'
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
/* 社群定制*/
import madeRelease from '@/views/customMade/release'
import madeLable from '@/views/customMade/lable'
import madeEdit from '@/views/customMade/edit'
/* 审核中心*/
import reviewfarm from '@/views/review/farm'
import reviewgrange from '@/views/review/grange'
import reviewsurrounding from '@/views/review/surrounding'
import reviewdoing from '@/views/review/doing'
import reviewself from '@/views/review/self'
import reviewvideo from '@/views/review/video'
import reviewMade from '@/views/review/made'
/* 活动中心*/
import farmactivity from '@/views/activity/farmactivity'
import grangeactivity from '@/views/activity/grangeactivity'
import operateactivity from '@/views/activity/operateactivity'
/* 数据中心*/
import datauser from '@/views/data/user'
import dataactivity from '@/views/data/activity'
import dataclassroom from '@/views/data/dataclassroom'
import datacommodity from '@/views/data/datacommodity'
import dataintegral from '@/views/data/dataintegral'
import datavideo from '@/views/data/video'
import dataorder from  '@/views/data/order'
import Layout from '@/layout'
/*社群定制*/
import farmadd from '@/views/farm/component/add'
import farmedit from '@/views/farm/component/edit'
import farmreview from '@/views/review/component/farm'
import farmhistory from '@/views/review/component/farmHistory'
export function map() {
  const map = new Map()
  map.set('account', account)
  map.set('character', character)
  map.set('unitfarm', unitfarm)
  map.set('unitgrange', unitgrange)
  map.set('unitcommunity', unitcommunity)
  map.set('systemInformation', systemInformation)
  map.set('lable', lable)
  map.set('qa', qa)
  map.set('unitshop', unitshop)
  map.set('maderelease', madeRelease)
  map.set('madelable', madeLable)
  map.set('madeedit', madeEdit)
  map.set('guide', guide)
  map.set('volunteershop', volunteershop)
  map.set('volunteeractivity', volunteeractivity)
  map.set('romulgation', romulgation)
  map.set('compilation', compilation)
  map.set('storage', storage)
  map.set('surroundingreport', surroundingreport)
  map.set('information', information)
  map.set('storeorder', storeOrder)
  map.set('farmshop', farmshop)
  map.set('farmorder', farmorder)
  map.set('farmreport', farmreport)
  map.set('farminformation', farminformation)
  map.set('grangeshop', grangeshop)
  map.set('grangeorder', grangeorder)
  map.set('grangereport', grangereport)
  map.set('grangeinformation', grangeinformation)
  map.set('shelf', shelf)
  map.set('selfshop', selfshop)
  map.set('selforder', selforder)
  map.set('selfreport', selfreport)
  map.set('video', video)
  map.set('answer', answer)
  map.set('participate', participate)
  map.set('hold', hold)
  map.set('reviewfarm', reviewfarm)
  map.set('reviewgrange', reviewgrange)
  map.set('reviewsurrounding', reviewsurrounding)
  map.set('reviewdoing', reviewdoing)
  map.set('reviewself', reviewself)
  map.set('reviewvideo', reviewvideo)
  map.set('reviewmade', reviewMade)
  map.set('farmactivity', farmactivity)
  map.set('grangeactivity', grangeactivity)
  map.set('operateactivity', operateactivity)
  map.set('datauser', datauser)
  map.set('dataactivity', dataactivity)
  map.set('dataclassroom', datavideo)
  map.set('datacommodity', datacommodity)
  map.set('dataintegral', dataintegral)
  map.set('dataorder', dataorder)
  return map
}

export function iconMap() {
  const arr = new map()
  arr.set('/system', 'system')
  arr.set('/madeRelease', 'madeRelease')
  arr.set('/made', 'made')
  arr.set('/rubbish', 'rubbish')
  arr.set('/volunteer', 'volunteer')
  arr.set('/doing', 'doing')
  arr.set('/surrounding', 'surrounding')
  arr.set('/farm', 'farm')
  arr.set('/grange', 'grange')
  arr.set('/self', 'self')
  arr.set('/classroom', 'classroom')
  arr.set('/welfare', 'welfare')
  arr.set('/review', 'review')
  arr.set('/activity', 'activity')
  arr.set('/data', 'data')
  return arr
}
/**
 * 生成路由
 * @param {Array} routerlist 格式化路由
 * @returns
 */
export function addRouter(list) {
  /*
  const routerList = [
    {
      path: '/system',
      component: Layout,
      redirect: '',
      name: '系统设置',
      alwaysShow: true,
      meta: { title: '系统设置', icon: 'system' },
      children: [
        {
          path: 'account',
          name: '账户设置',
          component: account,
          meta: { title: '账户设置' }
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
      name: '社区便民',
      alwaysShow: true,
      meta: { title: '社区便民', icon: 'rubbish' },
      children: [
        {
          path: 'surrounding',
          component: guide,
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
          path: 'information',
          component: information,
          name: '商铺商品列表',
          meta: { title: '商品列表' }
        },
        {
          path: 'surroundingreport',
          component: surroundingreport,
          name: '销售报表',
          meta: { title: '销售报表' }
        },

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
          path: 'farminformation',
          component: farminformation,
          name: '农场商品列表',
          meta: { title: '商品列表' }
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
      ]
    },
    {
      path: '/grange',
      component: Layout,
      redirect: '',
      alwaysShow: true,
      name: '青蛙农庄',
      meta: { title: '青蛙农庄', icon: 'grange'},
      children: [
        {
          path: 'grangeshop',
          component: grangeshop,
          name: 'grangeshop',
          meta: { title: '店铺管理' }
        },
        {
          path: 'grangeinformation',
          component: grangeinformation,
          name: 'grangeinformation',
          meta: { title: '商品列表' }
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

      ]
    },
    {
      path: '/self',
      component: Layout,
      redirect: '',
      alwaysShow: true,
      name: 'self',
      meta: { title: '自营平台', icon: 'self' },
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
      meta: { title: '公益排名', icon: 'welfare'},
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
          name: '农庄审核',
          meta: { title: '农庄审核' }
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
          path: 'video',
          component: video,
          name: 'video',
          meta: { title: '垃圾分类统计' }
        },
        {
          path: 'activity',
          component: activity,
          name: 'activity',
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
  }*/
  const farmAdd = {
    path: 'farmAdd',
    component: farmadd,
    name: '农场添加商品',
    meta: { title: '农场添加商品' },
    hidden: true
  }
  const farmEdit = {
    path: 'farmEdit',
    component: farmedit,
    name: '农场编辑商品',
    meta: { title: '农场编辑商品' },
    hidden: true
  }
  const farmShip = {
    path: 'farmShip',
    component: () => import(`@/views/farm/component/ship`),
    name: '农场订单发货',
    meta: { title: '农场订单发货' },
    hidden: true
  }
  const grangeShip = {
    path: 'grangeShip',
    component: () => import(`@/views/grange/component/ship`),
    name: '农庄订单发货',
    meta: { title: '农庄订单发货' },
    hidden: true
  }
  const surroundingShip = {
    path: 'surroundingShip',
    component: () => import(`@/views/surrounding/component/ship`),
    name: '商铺订单发货',
    meta: { title: '商铺订单发货' },
    hidden: true
  }
  const selfShip = {
    path: 'selfShip',
    component: () => import(`@/views/self/component/ship`),
    name: '自营订单发货',
    meta: { title: '自营订单发货' },
    hidden: true
  }
  const surroundingAdd = {
    path: 'surroundingAdd',
    component: () => import('@/views/surrounding/component/add'),
    name: '商铺商品添加',
    meta: { title: '商铺商品添加' },
    hidden: true
  }
  const surroundingEdit = {
    path: 'surroundingEdit',
    component: () => import('@/views/surrounding/component/edit'),
    name: '商铺编辑商品',
    meta: { title: '商铺编辑商品' },
    hidden: true
  }
  const grangeAdd = {
    path: 'grangeAdd',
    component: () => import('@/views/grange/component/add'),
    name: '农庄添加商品',
    meta: { title: '农庄添加商品' },
    hidden: true
  }
  const grangeEdit = {
    path: 'grangeEdit',
    component: () => import('@/views/grange/component/edit'),
    name: '农庄编辑商品',
    meta: { title: '农庄编辑商品' },
    hidden: true
  }
  const selfAdd = {
    path: 'selfAdd',
    component: () => import('@/views/self/component/add'),
    name: '自营商品添加',
    meta: { title: '自营商品添加' },
    hidden: true
  }
  const selfEdit = {
    path: 'selfEdit',
    component: () => import('@/views/self/component/edit'),
    name: '自营商品编辑',
    meta: { title: '自营商品编辑' },
    hidden: true
  }
  const farm = {
    path: 'reviewfarmGoods',
    component: farmreview,
    name: '农场商品详情',
    meta: { title: '农场商品详情' },
    hidden: true
  }
  const grange = {
    path: 'reviewGrangeGoods',
    component: () => import(`@/views/review/component/grange`),
    name: '农庄商品详情',
    meta: { title: '农庄商品详情' },
    hidden: true
  }
  const farmHistory = {
    path: 'farmHistory',
    component: farmhistory,
    name: '农场审核历史',
    meta: { title: '农场审核历史' },
    hidden: true
  }
  const grangeHistory = {
    path: 'grangeHistory',
    component: () => import(`@/views/review/component/grangeHistory`),
    name: '农庄审核历史纪录',
    meta: { title: '农庄审核历史纪录' },
    hidden: true
  }
  const shop = {
    path: 'reviewShopGoods',
    component: () => import(`@/views/review/component/shop`),
    name: '商铺商品详情',
    meta: { title: '商铺商品详情' },
    hidden: true
  }
  const shopHistory = {
    path: 'shopHistory',
    component: () => import(`@/views/review/component/shopHistory`),
    name: '商铺审核历史',
    meta: { title: '商铺审核历史' },
    hidden: true
  }
  const self = {
    path: 'reviewSelfGoods',
    component: () => import(`@/views/review/component/self`),
    name: '自营商城商品详情',
    meta: { title: '自营商城商品详情' },
    hidden: true
  }
  const selfHistory = {
    path: 'selfHistory',
    component: () => import(`@/views/review/component/selfHistory`),
    name: '自营商城审核历史',
    meta: { title: '自营商城审核历史' },
    hidden: true
  }
  const rubbish = {
    path: 'rubbishDetails',
    component: () => import(`@/views/classroom/component/LookGuide`),
    name: '垃圾分类引导子节点',
    meta: { title: '垃圾分类引导子节点' },
    hidden: true
  }
  const farmAndOrder = {
    path: 'order',
    component: () => import(`@/views/order`),
    name: '农场订单详情',
    meta: { title: '农场订单详情' },
    hidden: true
  }
  const grangeAndOrder = {
    path: 'order',
    component: () => import(`@/views/order`),
    name: '农庄订单详情',
    meta: { title: '农庄订单详情' },
    hidden: true
  }
  const selfAndOrder = {
    path: 'order',
    component: () => import(`@/views/order`),
    name: '自营订单详情',
    meta: { title: '自营订单详情' },
    hidden: true
  }
  const storeAndOrder = {
    path: 'order',
    component: () => import(`@/views/order`),
    name: '商铺订单详情',
    meta: { title: '商铺订单详情' },
    hidden: true
  }
  const reviewHistory = {
    path: 'reviewHistory',
    component: () => import(`@/views/review/component/doing`),
    name: '活动审核历史记录',
    meta: { title: '活动审核历史记录' },
    hidden: true
  }
  const lookUser = {
    path: 'lookUser',
    component: () => import(`@/views/doing/commponent/lookUser`),
    name: '活动用户查询',
    meta: { title: '活动用户查询' },
    hidden: true
  }
  const ranking = {
    path: 'ranking',
    component: () => import(`@/views/welfare/commponent/ranking`),
    name: 'ranking',
    meta: { title: '家庭之星排行榜' },
    hidden: true
  }
  const farmAddToImg = {
    path: 'farmAddToImg',
    component: () => import(`@/views/farm/component/addImg`),
    name: '农场图片上传',
    meta: { title: '农场图片上传' },
    hidden: true
  }
  const grangeAddToImg = {
    path: 'grangeAddToImg',
    component: () => import(`@/views/grange/component/addImg`),
    name: '农庄图片上传',
    meta: { title: '农庄图片上传' },
    hidden: true
  }
  const addNews = {
    path: 'addNews',
    component: () => import(`@/views/classroom/component/addNews`),
    name: '添加文章',
    meta: { title: '添加文章' },
    hidden: true
  }
  const lookNews = {
    path: 'lookNews',
    component: () => import(`@/views/classroom/component/LookNews`),
    name: '编辑文章',
    meta: { title: '编辑文章' },
    hidden: true
  }
  const addGrangeToImage = {
    path: 'addGrangeToImage',
    component: () => import(`@/views/surrounding/component/addImg`),
    name: '商铺图片上传',
    meta: { title: '商铺图片上传' },
    hidden: true
  }
  const addDoing = {
    path: 'addDoing',
    component: () => import(`@/views/doing/commponent/addDoing`),
    name: '活动上传',
    meta: { title: '活动上传' },
    hidden: true
  }
  const editDoing = {
    path: 'editDoing',
    component: () => import(`@/views/doing/commponent/editDoing`),
    name: 'editDoing',
    meta: { title: '活动编辑' },
    hidden: true
  }
  const videoHistory = {
    path: 'videoHistory',
    component: () => import(`@/views/review/component/videoHistory`),
    name: 'videoHistory',
    meta: { title: '视频审核历史记录' },
    hidden: true
  }
  const company = {
    path: 'company',
    component: () => import(`@/views/welfare/commponent/company`),
    name: 'company',
    meta: { title: '公益之星排行榜' },
    hidden: true
  }
  const addMade = {
    path: 'addMade',
    component: () => import(`@/views/customMade/component/addMade`),
    name: 'addMade',
    meta: { title: '添加产品' },
    hidden: true
  }
  const editMade = {
    path: 'editMade',
    component: () => import(`@/views/customMade/component/editMade`),
    name: 'editMade',
    meta: { title: '编辑产品' },
    hidden: true
  }
  const madeHistory = {
    path: 'madeHistory',
    component: () => import(`@/views/review/component/madeHistory`),
    name: 'madeHistory',
    meta: { title: '定制审核历史记录' },
    hidden: true
  }
  const madereview = {
    path: 'madereview',
    component: () => import(`@/views/review/component/made`),
    name: 'madereview',
    meta: { title: '定制审核历史详情' },
    hidden: true
  }
  const orderList = {
    path: 'orderList',
    component: () => import(`@/views/data/component/orderList`),
    name: 'orderList',
    meta: { title: '订单列表'},
    hidden: true
  }
  // 处理后的路由结果
  const arr = []
  for (let x = 0; x < list.length; x++) {
    const obj = {}
    obj.name = list[x].name
    obj.component = Layout
    obj.redirect = ''
    obj.path = list[x].path
    obj.alwaysShow = true
    const metaObj = {}
    metaObj.title = list[x].meta.title
    for (const [key, val] of iconMap()) {
      if (list[x].path === key) {
        metaObj.icon = val
      }
    }
    obj.meta = metaObj
    obj.children = new Array()
    for (let i = 0; i < list[x].children.length; i++) {
      const childrenObj = {}
      childrenObj.path = list[x].children[i].path
      childrenObj.name = list[x].children[i].name
      const parse = JSON.parse(JSON.stringify(list[x].children[i].component))
      for (const [key, val] of map()) {
        if (parse === key) {
          childrenObj.component = val
        }
      }
      const childrenMeta = {}
      childrenMeta.title = list[x].children[i].meta.title
      childrenMeta.icon = list[x].children[i].meta.icon
      childrenObj.meta = childrenMeta
      obj.children.push(childrenObj)
    }
    arr.push(obj)
  }
  for (let x = 0; x < arr.length; x++) {
    if (arr[x].name === 'farm') {
      arr[x].children.push(farmAdd)
      arr[x].children.push(farmEdit)
      arr[x].children.push(farmShip)
      arr[x].children.push(farmAndOrder)
      arr[x].children.push(farmAddToImg)
    }
    if (arr[x].name === 'review') {
      arr[x].children.push(farm)
      arr[x].children.push(farmHistory)
      arr[x].children.push(grange)
      arr[x].children.push(grangeHistory)
      arr[x].children.push(shop)
      arr[x].children.push(shopHistory)
      arr[x].children.push(self)
      arr[x].children.push(selfHistory)
      arr[x].children.push(reviewHistory)
      arr[x].children.push(videoHistory)
      arr[x].children.push(madeHistory)
      arr[x].children.push(madereview)
    }
    if (arr[x].name === 'surrounding') {
      arr[x].children.push(surroundingAdd)
      arr[x].children.push(surroundingEdit)
      arr[x].children.push(addGrangeToImage)
      arr[x].children.push(surroundingShip)
      arr[x].children.push(storeAndOrder)
    }
    if (arr[x].name === 'grange') {
      arr[x].children.push(grangeAdd)
      arr[x].children.push(grangeEdit)
      arr[x].children.push(grangeAndOrder)
      arr[x].children.push(grangeAddToImg)
      arr[x].children.push(grangeShip)
    }
    if (arr[x].name === 'self') {
      arr[x].children.push(selfAdd)
      arr[x].children.push(selfEdit)
      arr[x].children.push(selfAndOrder)
      arr[x].children.push(selfShip)
    }
    if (arr[x].name === 'welfare') {
      arr[x].children.push(lookUser)
      arr[x].children.push(ranking)
      arr[x].children.push(company)
    }
    if (arr[x].name === 'classroom') {
      arr[x].children.push(addNews)
      arr[x].children.push(lookNews)
      arr[x].children.push(rubbish)
    }
    if (arr[x].name === 'doing') {
      arr[x].children.push(addDoing)
      arr[x].children.push(editDoing)
    }
    if (arr[x].name === 'made') {
      arr[x].children.push(addMade)
      arr[x].children.push(editMade)
    }
    if (arr[x].name === 'data') {
      arr[x].children.push(orderList)
    }
  }
  return arr
}
