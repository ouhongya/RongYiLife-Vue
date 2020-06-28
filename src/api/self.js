import axios from 'axios'
/* 农场店铺管理*/
export function findInfo() {
  return axios.get(`/server/shop/info`)
}
export function createdInfo() {
  return axios.get(`/server/shop/category/info`)
}
export function categoryEdit(params) {
  return axios.get(`/server/shop/category/${params}`)
}
export function categoryAdd(params) {
  return axios.post(`/server/shop/category/add`, params)
}
export function categoryUpdate(tableId, category) {
  return axios.put(`/server/shop/category/update/${tableId}/${category}`)
}
export function categoryDelete(params) {
  return axios.delete(`/server/shop/category/delete/${params}`)
}
/* 农场商品列表*/
export function fachData(category, currentPage, size, val) {
  return axios.get(`/server/shopitem/item?category=${category}&page=${currentPage}&size=${size}&sortByFiled=lasted_update_time&sortByOrder=desc&search=${val}`)
}
export function itemDelete(params) {
  return axios.delete(`/server/shopitem/delete/${params}`)
}
export function addGoods(params, arr) {
  return axios.put(`/server/shopitem/shelf/${params}`, arr)
}
/* 添加商品*/
export function categoryFetchData() {
  return axios.get(`/server/shop/category/all`)
}
export function addCategory(params) {
  return axios.post(`/server/shopitem/add`, params)
}
/* 编辑商品*/
export function fetchDataItem(id) {
  return axios.get(`/server/shopitem/item/${id}`)
}
export function itemUpdate(params) {
  return axios.put(`/server/shopitem/update`, params)
}
export function updateSort(id, params) {
  return axios.put(`/server/shopitem/sort/${id}/${params}`)
}
