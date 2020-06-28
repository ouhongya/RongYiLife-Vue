import axios from 'axios'
import id from 'element-ui/src/locale/lang/id'
export function finOrderById(endTime,marketId,startTime,) {
  return axios.get(`/server/ordersStatistics/findCountTable?endTime=${endTime}&marketId=${marketId}&startTime=${startTime}`)
}
export function findFarmAll(page,search,size,sortByFiled,sortByOrder) {
  return axios.get(`/server/farm/all?page=${page}&search=${search}&size=${size}&sortByFiled=${sortByFiled}&sortByOrder=${sortByOrder}`)
}
export function findGrangeAll(page,search,size,sortByFiled,sortByOrder) {
  return axios.get(`/server/grange/all?page=${page}&search=${search}&size=${size}&sortByFiled=${sortByFiled}&sortByOrder=${sortByOrder}`)
}
export function findStoreAll(page,search,size,sortByFiled,sortByOrder) {
  return axios.get(`/server/store/all?page=${page}&search=${search}&size=${size}&sortByFiled=${sortByFiled}&sortByOrder=${sortByOrder}`)
}
export function createdInfo() {
  return axios.get(`/server/shop/category/info`)
}
export function OrderDetail(endTime,id,page,size,sortByFiled,sortByOrder,startTime) {
  return axios.get(`/server/ordersStatistics/findOrdersByMarketId?endTime=${endTime}&marketId=${id}&page=${page}&size=${size}&sortByFiled=${sortByFiled}&sortByOrder=${sortByOrder}&startTime=${startTime}`)
}
export function OrderDetailById(id) {
  return axios.get(`/server/ordersStatistics/findItemDetailBySplitId?ordersSplitId=${id}`)
}
export function fetchDataOrderMoneys(startTime,endTime) {
  return axios.get(`/server/ordersStatistics/findSumPrice?endTime=${endTime}&startTime=${startTime}`)
}
