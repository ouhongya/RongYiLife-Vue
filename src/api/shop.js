import axios from 'axios'
/* 农场店铺管理*/
export function findInfo(params) {
  return axios.get(`/server/store/info/${params}`)
}
export function findByIdAndShop(params) {
  return axios.get(`/server/store/store/${params}`)
}
export function updateStoreInfo(params) {
  return axios.put(`/server/store/update`, params)
}
export function createdInfo(params) {
  return axios.get(`/server/store/category/info/${params}`)
}
export function categoryEdit(params) {
  return axios.get(`/server/store/category/${params}`)
}
export function categoryAdd(params) {
  return axios.post(`/server/store/category/add`, params)
}
export function categoryUpdate(tableId, category) {
  return axios.put(`/server/store/category/update/${tableId}/${category}`)
}
export function categoryDelete(params) {
  return axios.delete(`/server/store/category/delete/${params}`)
}
/* 商铺商品列表*/
export function fachData(currentPage, size, name, order, val, itemId) {
  return axios.get(`/server/storeitem/item?page=${currentPage}&size=${size}&sortByFiled=${name}&sortByOrder=${order}&search=${val}&itemId=${itemId}`)
}
export function itemDelete(params) {
  return axios.delete(`/server/storeitem/delete/${params}`)
}
export function addGoods(params, arr) {
  return axios.put(`/server/storeitem/shelf/${params}`, arr)
}
/* 添加商品*/
export function categoryFetchData(params) {
  return axios.get(`/server/store/category/all/${params}`)
}
export function addCategory(params) {
  return axios.post(`/server/storeitem/add`, params)
}
/* 编辑商品*/
export function fetchDataItem(id) {
  return axios.get(`/server/storeitem/item/${id}`)
}
export function itemUpdate(params) {
  return axios.put(`/server/storeitem/update`, params)
}
/* 相册上传*/
export function storeToImg(permissionId, params) {
  return axios.post(`/server/store/album/add/${permissionId}`, params)
}
export function chief(permissionId, params) {
  return axios.put(`/server/store/album/${permissionId}`, params)
}
export function fetchImgList(parmas) {
  return axios.get(`/server/store/album/all/${parmas}`)
}
/* 内部访问*/
export function permissionStore() {
  return axios.get(`/server/store/all`)
}
/* 应用按钮*/
export function applicationstore(params) {
  return axios.put(`/server/store/apply/up/${params}`)
}
/* 图片删除*/
export function deleteUrl(params) {
  return axios.delete(`/server/store/album/delete/${params}`)
}
export function getUrl(params) {
  return axios.get(`/server/store/album/all/${params}`)
}
