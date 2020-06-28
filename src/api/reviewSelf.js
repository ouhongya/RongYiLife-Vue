import axios from 'axios'
/* 审核*/
export function fetchData() {
  return axios.get(`/server/shopitem/uncheck`)
}
export function center(parmas) {
  return axios.put(`/server/shopitem/check/fail`, parmas)
}
export function reviewfarm(parmas) {
  return axios.put(`/server/shopitem/check/pass`, parmas)
}
export function operation(parmas) {
  return axios.put(`/server/shopitem/check/pass`, parmas)
}
/* 详情*/
export function fetchDataId(parmas) {
  return axios.get(`/server/shopitem/uncheck/${parmas}`)
}
/* 历史纪录*/
export function fetchDataPage(currentPage, size, val) {
  return axios.get(`/server/shopitem/check/history?page=${currentPage}&size=${size}&sortByFiled=lasted_update_time&sortByOrder=desc&search=${val}`)
}
