import axios from 'axios'
export function onSubmit(parmas) {
  return axios.post(`/server/article/add`, parmas)
}
export function fetchData(page, search, size, sortByFiled, sortByOrder) {
  return axios.get(`/server/article/all?page=${page}&search=${search}&size=${size}&sortByFiled=${sortByFiled}&sortByOrder=${sortByOrder}`)
}
export function deleteArticle(id) {
  return axios.delete(`/server/article/delete/${id}`)
}
export function release(application, id) {
  return axios.put(`/server/article/apply/${application}/${id}`)
}
export function getArticleId(id) {
  return axios.get(`/server/article/detail/${id}`)
}

export function update(params) {
  return axios.put(`/server/article/update`, params)
}
export function updateSort(params) {
  return axios.put(`/server/article/queue/${params.id}/${params.sort}`,)
}
