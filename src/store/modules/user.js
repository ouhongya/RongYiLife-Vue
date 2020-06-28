import { login, logout, getInfo, getUser } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { constantRoutes } from '../../router/index'
import { Message } from 'element-ui'

const user = {
  state: {
    token: getToken(),
    name: '',
    username: '',
    id: '',
    avatar: '',
    roles: [],
    RouterList: [], // 动态路由
    companyId: ''// 店铺id
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    set_router: (state, RouterList) => {
      state.RouterList = RouterList
    },
    set_companyId: (state, companyId) => {
      state.companyId = companyId
    }
  },

  actions: {
    // user login
    login({ commit }, userInfo) {
      const { username, password } = userInfo
      return new Promise((resolve, reject) => {
        login({ username: username.trim(), password: password }).then(response => {
          if (response.data !== 1) {
            Message({
              message: '用户名或密码错误,请重试!' || 'Error',
              type: 'error'
            })
          }
          // this.getUsername()
          commit('SET_TOKEN', response.headers.token)
          setToken(response.headers.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    getInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const { data } = response
          if (!data) {
            reject('错误的提交请重新登录!')
          }
          const { name, avatar } = data
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // get user info
    getUsername({ commit }) {
      return new Promise((resolve, reject) => {
        getUser().then(response => {
          const { data } = response
          if (!data) {
            reject('错误的提交请重新登录!')
          }
          commit('SET_NAME', data.queryResult.data.trueName)
          window.localStorage.setItem('name', data.queryResult.data.trueName)
          commit('SET_ID', data.queryResult.data.id)
          // avatar  图片
          commit('SET_USERNAME', data.queryResult.data.username)
          commit('set_companyId', data.queryResult.data.companyId + ',' + data.queryResult.data.isInsider)
          window.localStorage.setItem('user', data.queryResult.data.companyId + ',' + data.queryResult.data.isInsider)
          resolve(data.queryResult.data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 动态设置路由 此为设置设置途径
    setRouterList({ commit }, routerList) {
      commit('set_router', constantRoutes.concat(routerList)) // 进行路由拼接并存储
    },
    // 存储颗粒话权限
    setroles({ commit }, roleList) {
      commit('SET_ROLES', roleList)
    },

    // user logout
    logout({ commit }) {
      removeToken()
      resetRouter()
      return new Promise((resolve, reject) => {
        logout().then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // remove token
    resetToken({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}
/*
export default new Vuex.Store( {
  namespaced: true,
  state,
  mutations,
  actions
})*/
export default user
