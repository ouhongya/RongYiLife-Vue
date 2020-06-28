import axios from 'axios'
/* 农场店铺管理*/
export function findInfo(params) {
  return axios.get(`/server/farm/info/${params}`)
}
export function findByIdAndShop(params) {
  return axios.get(`/server/farm/farm/${params}`)
}
export function updateFarmInfo(params) {
  return axios.put(`/server/farm/info/update`, params)
}
export function createdInfo(params) {
  return axios.get(`/server/farm/category/info/${params}`)
}
export function categoryEdit(params) {
  return axios.get(`/server/farm/category/${params}`)
}
export function categoryAdd(permissionId, params) {
  return axios.post(`/server/farm/category/add/${permissionId}`, params)
}
export function categoryUpdate(tableId, category) {
  return axios.put(`/server/farm/category/update/${tableId}/${category}`)
}
export function categoryDelete(permissionId, params) {
  return axios.delete(`/server/farm/category/delete/${permissionId}/${params}`)
}
/* 农场商品列表*/
export function fachData(currentPage, size, name, order, val, itemId) {
  return axios.get(`/server/farmitem/item?page=${currentPage}&size=${size}&sortByFiled=${name}&sortByOrder=${order}&search=${val}&itemId=${itemId}`)
}
export function itemDelete(params) {
  return axios.delete(`/server/farmitem/delete/${params}`)
}
export function addGoods(params, arr) {
  return axios.put(`/server/farmitem/shelf/${params}`, arr)
}
/* 添加商品*/
export function categoryFetchData(params) {
  return axios.get(`/server/farm/category/all/${params}`)
}
export function addCategory(params) {
  return axios.post(`/server/farmitem/add`, params)
}
/* 编辑商品*/
export function fetchDataItem(id) {
  return axios.get(`/server/farmitem/item/${id}`)
}
export function itemUpdate(params) {
  return axios.put(`/server/farmitem/update`, params)
}
/* 相册上传*//*
export function addFarmToImg(permissionId,params) {
  return axios.post(`/server/farm/album/add/${permissionId}`,params)
}*/
export function addFarmToImg(params) {
  return axios.post(`/server/farm/album/banner/add/${params}`)
}
export function getUrl(params) {
  return axios.get(`/server/farm/album/all/${params}`)
}
export function deleteUrl(params) {
  return axios.delete(`/server/farm/album/delete/${params}`)
}
export function chief(permissionId, params) {
  return axios.put(`/server/farm/album/${permissionId}`, params)
}
export function fetchImgList(parmas) {
  return axios.get(`/server/farm/album/all/${parmas}`)
}
/* 内部访问*/
export function permissionFarm() {
  return axios.get(`/server/farm/all`)
}
/* 应用按钮*/
export function applicationFarm(parmas) {
  return axios.put(`/server/farm/apply/up/${parmas}`)
}
