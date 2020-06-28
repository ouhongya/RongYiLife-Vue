import axios from 'axios'
/* 农场店铺管理*/
export function findInfo(params) {
  return axios.get(`/server/grange/info/${params}`)
}
export function findByIdAndShop(params) {
  return axios.get(`/server/grange/grange/${params}`)
}
export function updateFarmInfo(params) {
  return axios.put(`/server/grange/info/update`, params)
}
export function createdInfo(params) {
  return axios.get(`/server/grange/category/info/${params}`)
}
export function categoryEdit(params) {
  return axios.get(`/server/grange/category/${params}`)
}
export function categoryAdd(permissionId, params) {
  return axios.post(`/server/grange/category/add/${permissionId}`, params)
}
export function categoryUpdate(tableId, category) {
  return axios.put(`/server/grange/category/update/${tableId}/${category}`)
}
export function categoryDelete(params) {
  return axios.delete(`/server/grange/category/delete/${params}`)
}
/* 农场商品列表*/
export function fachData(currentPage, size, name, order, val, itemId) {
  return axios.get(`/server/grangeitem/item?page=${currentPage}&size=${size}&sortByFiled=${name}&sortByOrder=${order}&search=${val}&itemId=${itemId}`)
}
export function itemDelete(params) {
  return axios.delete(`/server/grangeitem/delete/${params}`)
}
export function addGoods(params, arr) {
  return axios.put(`/server/grangeitem/shelf/${params}`, arr)
}
/* 添加商品*/
export function categoryFetchData(permissionId) {
  return axios.get(`/server/grange/category/all/${permissionId}`)
}
export function addCategory(params) {
  return axios.post(`/server/grangeitem/add`, params)
}
/* 编辑商品*/
export function fetchDataItem(id) {
  return axios.get(`/server/grangeitem/item/${id}`)
}
export function itemUpdate(params) {
  return axios.put(`/server/grangeitem/update`, params)
}
/* 相册上传*/
/* export function addFarmToImg(permissionId,params) {
  return axios.post(`/server/grange/album/add/${permissionId}`,params)
}*/
export function addGrangeToImg(params) {
  return axios.post(`/server/grange/album/banner/add/${params}`)
}
export function getUrl(params) {
  return axios.get(`/server/grange/album/all/${params}`)
}
export function deleteUrl(params) {
  return axios.delete(`/server/grange/album/delete/${params}`)
}
export function chief(permissionId, params) {
  return axios.put(`/server/grange/album/${permissionId}`, params)
}
export function fetchImgList(params) {
  return axios.get(`/server/grange/album/all/${params}`)
}
/* 内部访问*/
export function permissionFarm() {
  return axios.get(`/server/grange/all`)
}
/* 应用按钮*/
export function applicationGrange(parmas) {
  return axios.put(`/server/grange/apply/up/${parmas}`)
}
