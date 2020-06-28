import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import {getToken,setToken,removeToken} from '@/utils/auth'
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
  if (store.getters.token) {
    //让每个请求携带令牌
    // ['X-Token']是一个自定义标题键
    config.headers['Token'] = getToken()
    //config.headers['X-CSRF-TOKEN'] = "[[${_csrf.token}]]";
    //config.headers['Content-Type']=('application/x-www-form-urlencoded')
  }

  return config
}, function (error) {
  Message({
    message: '拼命加载中'|| 'info',
    type: 'info',
    duration: 5 * 1000
  })
  return Promise.reject(error)
});

// 添加响应拦截器
axios.interceptors.response.use(res=> {
  // 对响应数据做点什么
  removeToken()
  setToken(res.headers.token);
  return res
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
});
