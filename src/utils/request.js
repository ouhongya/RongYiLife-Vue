import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, setToken, removeToken } from '@/utils/auth'
// 创建一个axios实例
export const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // 在跨域请求时发送cookie
  timeout: 3000 // 请求超时5000毫秒
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做一些事情
    if (store.getters.token) {
      // 让每个请求携带令牌
      // ['X-Token']是一个自定义标题键
      config.headers['Token'] = getToken()
    }
    return config
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
       *如果您想获取标题或状态等http信息
       *请返回响应=>响应
        */

  /**
             *通过自定义代码确定请求状态
             *这只是一个例子
             *您还可以通过HTTP状态代码判断状态
             getHeader('Token')
              */
  response => {
    const res = response.data
    removeToken()
    setToken(res.headers.token)
    // 如果自定义代码不是20000，则判断为错误。
    if (res.code === 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008：非法令牌; 50012：其他客户登录; 50014：令牌已过期;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('您已退出，可以取消此页面，或者重新登录', '确认注销', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
