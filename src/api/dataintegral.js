import axios from 'axios'
export function fetchData(start, end) {
  return axios.get(`/server/statistics/article/dps?startTime=${end}&endTime=${start}`)
}
export function pageData(endTime, page, search, size, sortByFiled, sortByOrder, startTime) {
  return axios.get(`/server/statistics/article/detail?startTime=${startTime}&page=${page}&search=${search}&size=${size}&sortByFiled=${sortByFiled}&sortByOrder=${sortByOrder}&endTime=${endTime}`)
}
export function getArticleId(id) {
  return axios.get(`/server/article/detail/${id}`)
}

