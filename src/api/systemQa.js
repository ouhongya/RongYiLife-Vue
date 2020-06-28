import axios from 'axios'
import * as qs from 'qs'
export function fetchData(page, search, size, sortByFiled, sortByOrder) {
  return axios.get(`/server/qa/findCustomerQa?page=${page}&search=${search}&size=${size}&sortByFiled=${sortByFiled}&sortByOrder=${sortByOrder}`)
}
export function edit(params) {
  return axios.post(`/server/qa/updateCustomerQa`, params)
}
export function strikeOut(params) {
  return axios.delete(`/server/qa/deleteCustomerQa/${params}`,)
}
export function addQa(question, answer, sort) {
  return axios.post(`/server/qa/addCustomerQa?answer=${answer}&defaultSort=${sort}&question=${question}`)
}
export function upAndDown(params) {
  return axios.post(`/server/qa/UpperLower`, params)
}

export function qaSort(obj) {
  return axios.put(`/server/qa/sort/${obj.id}/${obj.sort}`)
}
