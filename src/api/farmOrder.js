import axios from 'axios'
export function fetchData(companyId, page, search, size, sortByFiled, sortByOrder, state, totalState) {
  return axios.get(`/server/farmorder/findOrdersByCompanyId/${companyId}?page=${page}&search=${search}&size=${size}&sortByFiled=${sortByFiled}&sortByOrder=${sortByOrder}&state=${state}&totalState=${totalState}`)
}
export function fetchDataOrderAndId(parmas) {
  return axios.get(`/server/farmorder/findOrdersSplitById/${parmas}`)
}
export function cc(companyId, state, isInsider, page, size, search) {
  return axios.get(`/server/farmorder/findOrdersByCompanyId/${companyId}?&state=${state}&isInsider=${isInsider}&page=${page}&size=${size}&search=${search}`)
}
export function findByIds(parmas) {
  return axios.post(`/server/farmorder/findShopAddressBySplitId`, parmas)
}
export function updateOrder(parmas) {
  return axios.post(`/server/farmorder/ordersDeliver`, parmas)
}
/* 内部访问*/
export function permissionFarm() {
  return axios.get(`/server/farm/all`)
}
