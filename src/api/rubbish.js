import axios from 'axios'
export function fetchData(params) {
  return axios.get(`/server/garbageCategory/all/${params}`,)
}
export function addCategory(params) {
  return axios.post(`/server/garbageCategory/add`, params)
}
export function deleteCategory(params) {
  return axios.delete(`/server/garbageCategory/delete/${params}`,)
}
export function updateCategory(params) {
  return axios.put(`/server/garbageCategory/update`, params)
}
export function cityList() {
  return axios.get(`/server/city/all`)
}
export function getCategory(id, cityId, currentPage, input, size, sortByFiled, sortByOrder) {
  return axios.get(`/server/garbage/all?category=${id}&city=${cityId}&page=${currentPage}&search=${input}&size=${size}&sortByFiled=${sortByFiled}&sortByOrder=${sortByOrder}`)
}
export function add(parmas) {
  return axios.post(`/server/garbage/add`, parmas)
}
export function garbage(parmas) {
  return axios.delete(`/server/garbage/delete/${parmas}`,)
}
export function garbageupdate(parmas) {
  return axios.put(`/server/garbage/update`, parmas)
}
export function garbagedelete(parmas) {
  return axios.delete(`/server/garbage/delete/${parmas}`)
}
