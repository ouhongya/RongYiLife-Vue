import axios from 'axios'
export function fetchData(start, end) {
  return axios.get(`/server/statistics/user/dur/${end}/${start}`)
}
export function pageData(endTime, page, search, size, sortByFiled, sortByOrder, startTime) {
  return axios.get(`/server/statistics/user/durdetail?startTime=${startTime}&page=${page}&search=${search}&size=${size}&sortByFiled=${sortByFiled}&sortByOrder=${sortByOrder}&endTime=${endTime}`)
}
