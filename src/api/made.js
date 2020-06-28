import axios from 'axios'
export function fetchDataLadle(page, search, size, sortByFiled, sortByOrder) {
  return axios.get(`/server/customizeCategory/all?page=${page}&search=${search}&size=${size}&sortByFiled=${sortByFiled}&sortByOrder=${sortByOrder}`)
}
export function addMadeAndLabel(params) {
  return axios.post(`/server/customizeCategory/add?name=${params.name}`,)
}
export function updateMadeAndLadle(params) {
  return axios.put(`/server/customizeCategory/update/${params.id}/${params.name}`,)
}
export function deleteMadeAndLadle(params) {
  return axios.delete(`/server/customizeCategory/delete/${params}`,)
}
