import axios from 'axios'
export function fetchData(start, end) {
  return axios.get(`/server/statistics/activity/das?startTime=${end}&endTime=${start}`)
}
export function pageData(endTime, page, search, size, sortByFiled, sortByOrder, startTime) {
  return axios.get(`/server/statistics/activity/dasdetail?startTime=${startTime}&page=${page}&search=${search}&size=${size}&sortByFiled=${sortByFiled}&sortByOrder=${sortByOrder}&endTime=${endTime}`)
}
export function ActivityId(id,page,search,size,sortByFiled,sortByOrder) {
  return axios.get(`/server/statistics/activity/joinuser?id=${id}&page=${page}&search=${search}&size=${size}&sortByFiled=${sortByFiled}&sortByOrder=${sortByOrder}`)
}
