import axios from 'axios'
export function addDong(params) {
  return axios.post(`/server/activity/add`, params)
}
/*
export function fetchData(page,search,size,sortByFiled,sortByOrder,operation) {
  return axios.get(`/server/activity/all?page=${page}&search=${search}&size=${size}&sortByFiled=${size}&sortByOrder=${sortByOrder}&operation=${operation}`)
}*/

export function updateDong(params) {
  return axios.put(`/server/activity/update`, params)
}

export function deleteActivity(params) {
  return axios.delete(`/server/activity/delete/${params}`)
}
export function fetchData(page, size, search, sortByFiled, sortByOrder) {
  return axios.get(`/server/activity/uncheck?page=${page}&search=${search}&size=${size}&sortByFiled=${sortByFiled}&sortByOrder=${sortByOrder}`)
}
export function operation(operations, parmas) {
  return axios.post(`/server/activity/check/${operations}`, parmas)
}
export function fetchDataPage(currentPage, size, val) {
  return axios.get(`/server/activity/check/history?page=${currentPage}&size=${size}&sortByFiled=lasted_update_time&sortByOrder=desc&search=${val}`)
}
