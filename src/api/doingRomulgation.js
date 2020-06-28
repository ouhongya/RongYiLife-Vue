import axios from 'axios'
export function addDong(params) {
  return axios.post(`/server/activity/add`, params)
}

export function fetchData(option, page, search, size, sortByFiled, sortByOrder) {
  if (search === '') {
    return axios.get(`/server/activity/all?option=${option}&page=${page}&size=${size}&sortByFiled=${sortByFiled}&sortByOrder=${sortByOrder}`)
  } else {
    return axios.get(`/server/activity/all?option=${option}&page=${page}&search=${search}&size=${size}&sortByFiled=${sortByFiled}&sortByOrder=${sortByOrder}`)
  }
}
export function updateDong(params) {
  return axios.put(`/server/activity/update`, params)
}

export function getDoing(params) {
  return axios.get(`/server/activity/info/${params}`,)
}
export function deleteActivity(params) {
  return axios.delete(`/server/activity/delete/${params}`)
}
