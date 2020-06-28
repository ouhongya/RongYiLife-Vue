import axios from 'axios'
export function fetchData(start, end) {
  return axios.get(`/server/statistics/video/dps?startTime=${end}&endTime=${start}`)
}
export function pageData(endTime, page, search, size, sortByFiled, sortByOrder, startTime) {
  return axios.get(`/server/statistics/video/detail?startTime=${startTime}&page=${page}&search=${search}&size=${size}&sortByFiled=${sortByFiled}&sortByOrder=${sortByOrder}&endTime=${endTime}`)
}
