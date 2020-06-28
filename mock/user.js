
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],//这个就是路由里边能登录的用户名
    introduction: 'I am a super administrator',//我是超级管理员
    //avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',//头像地址
    name: '用户名1'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',//我是编辑者
    //avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: '用户名2'
  }
}
export default [
  // 登录
  {
    url: '/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // 模拟错误
      if (!token) {
        return {
          code: 60204,
          message: '账号或密码错误'
        }
      }
      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/server/account/findNowUser',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]
      console.log("info")
      // mock error
      if (!info) {
        return {
          code: 50008,
          message: '登录失败，无法获取用户详细信息'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
