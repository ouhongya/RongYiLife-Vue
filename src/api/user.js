import request from '@/utils/request'
import axios from 'axios'
import * as qs from 'qs'
export function login(data) {
  return axios.post('/server/login', qs.stringify(data))
}

export function getInfo() {
  return axios.get('/server/account/findNowUser')
}

export function logout() {
  return axios.get('/server/logout')
}
export function getRouter() {
  return axios.get('/server/account/findNowUser')
}
export function getUser() {
  return axios.get('/server/account/findNowUserData')
}
export function geturl() {
  return request({
    url: '/user/logout',
    method: 'get'
  })
}
