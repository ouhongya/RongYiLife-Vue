import axios from 'axios'
export function onsubmit(parmas) {
  return axios.post(`/server/activity/rank/add`, parmas)
}
export function fetchDataPage(parmas, endTimeStr, startTimeStr) {
  return axios.post(`/server/activity/statistics`, parmas, endTimeStr, startTimeStr)
}
export function fetchDataAll(carenPage, size, sortByFiled, sortByOrder) {
  return axios.get(`/server/activity/rank/all?page=${carenPage}&size=${size}&sortByFiled=${sortByFiled}&sortByOrder=${sortByOrder}`)
}
export function fetchDataId(parmas) {
  return axios.get(`/server/activity/rank/${parmas}`)
}
