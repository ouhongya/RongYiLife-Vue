import axios from 'axios'
export function sign(params) {
  return axios.put(`/server/activity/sign`, params)
}
export function findById(params) {
  return axios.get(`/server/activity/unconfirmed/${params}`,)
}
