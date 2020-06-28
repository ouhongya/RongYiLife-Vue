import Vue from 'vue'
import Vuex from 'vuex'
import 'normalize.css/normalize.css' // css样式
import 'default-passive-events'// Passive Event Listeners
import ElementUI from 'element-ui' // element-ui的全部组件
import 'element-ui/lib/theme-chalk/index.css'// element-ui的css
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'// 默认是英语,改成中文就好了
import '@/styles/index.scss' // css预处理器
import VueRouter from 'vue-router'
import App from './App'
import store from './store'
import router from './router'
import '@/icons'
import '@/permission'
// import 'element-ui/lib/theme-chalk/display.css';
// 图片预览
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

import axios from 'axios'
import '../config/axios'
Vue.prototype.$axios = axios
/* 轮播图插件*/
import vueSwiper from 'vue-awesome-swiper'
/* 样式的话，我这里有用到分页器，就在全局中引入了样式 */
import 'swiper/dist/css/swiper.css'
Vue.use(vueSwiper)
import qs from 'qs'
Vue.use(qs)
/* 全局时间格式化*/
import moment from 'moment'
Vue.prototype.$moment = moment
Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})
Vue.filter('propData', function(data) {
  if (data === '' || data === null || data === undefined) {
    return '暂无'
  }
  if (data !== '' || data !== null || data !== undefined) {
    return data
  }
})

// Echrts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
// 使用图片预览
Vue.use(Viewer)
Viewer.setDefaults({
  Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }
})
// 颜色选择器
import vcolorpicker from 'vcolorpicker'
Vue.use(vcolorpicker)

// 引入全局变量
import global from '@/GLOBAL.vue'
Vue.prototype.GLOBAL = global

Vue.config.productionTip = false
Vue.use(ElementUI, { zhLocale })
Vue.use(VueRouter)
Vue.use(Vuex)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
