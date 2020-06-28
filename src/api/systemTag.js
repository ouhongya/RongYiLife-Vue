import axios from 'axios'
export function fetchData(page, size, sortByFiled, sortByOrder) {
  return axios.get(`/server/tag/all?page=${page}&size=${size}&sortByFiled=${sortByFiled}&sortByOrder=${sortByOrder}`)
}
export function addTag(params) {
  return axios.post(`/server/tag/add/${params}`)
}
export function updateTag(params) {
  return axios.put(`/server/tag/update`, params)
}
export function deleteTag(params) {
  return axios.delete(`/server/tag/delete/${params}`)
}
export function shopAddTag(params) {
  return axios.post(`/server/storetag/add`, params)
}
export function shopDeleteTag(params) {
  return axios.delete(`/server/storetag/delete/${params}`)
}
export function shopUpdateTag(params) {
  return axios.put(`/server/storetag/update`, params)
}
export function shopFetchData(page, size, sortByFiled, sortByOrder) {
  return axios.get(`/server/storetag/all?page=${page}&size=${size}&sortByFiled=${sortByFiled}&sortByOrder=${sortByOrder}`)
}
