import axios from 'axios'
export function addVideo(params) {
  return axios.post(`/server/video/add`, params)
}
export function fetchData(page, search, size, sortByFiled, sortByOrder) {
  return axios.get(`/server/video/all?page=${page}&search=${search}&size=${size}&sortByFiled=${sortByFiled}&sortByOrder=${sortByOrder}`)
}
export function editVideo(params) {
  return axios.get(`/server/video/info/${params}`)
}
export function editOnSubmit(params) {
  return axios.put(`/server/video/update`, params)
}
export function deleteVideo(params) {
  return axios.delete(`/server/video/delete/${params}`)
}
export function reviewVideo(option, params) {
  return axios.put(`/server/video/apply/${option}/${params}`)
}
export function sortVideo(obj) {
  return axios.put(`/server/video/sort/${obj.id}/${obj.sort}`)
}
