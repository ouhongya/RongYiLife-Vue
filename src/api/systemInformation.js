import axios from 'axios'
export function fetchCity() {
  return axios.get(`/server/city/all`)
}
export function addCity(params) {
  return axios.post(`/server/city/add`, params)
}
export function findByCityId(params) {
  return axios.post(`/server/area/all/${params}`,)
}
export function addArea(params) {
  return axios.post(`/server/area/add?${params}`,)
}
export function updateArea(id, params) {
  return axios.put(`/server/city/update/${id}`, params)
}
export function updateCity(params) {
  return axios.put(`/server/area/update`, params)
}
