import axios from 'axios'
export function onsubmit(parmas) {
  return axios.post(`/server/participate/addCompanyRanking`, parmas)
}
export function fetchDataPage(parmas, endTimeStr, startTimeStr) {
  return axios.post(`/server/activity/statistics`, parmas, endTimeStr, startTimeStr)
}
export function fetchDataAll(carenPage, search, size, sortByFiled, sortByOrder) {
  return axios.get(`/server/participate/findAllCompanyRanking?page=${carenPage}&search=${search}&size=${size}&sortByFiled=${sortByFiled}&sortByOrder=${sortByOrder}`)
}
export function fetchDataId(parmas) {
  return axios.get(`/server/participate/findCompanyRankingItemById/${parmas}`)
}
