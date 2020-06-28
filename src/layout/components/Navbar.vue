<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar">
          {{ name }}
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="centerDialogVisible=true">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="修改密码"
      :visible.sync="centerDialogVisible"
      width="30%"
      :close-on-click-modal="false"
      :before-close="cancel"
      :close-on-press-escape="false"
      center
    >
      <el-form ref="form" :model="user" label-width="80px">
        <el-form-item label="账号">
          <el-input v-model="username" disabled autocomplete="off" />
        </el-form-item>
        <el-form-item label="旧密码">
          <el-input v-model="user.oldPassword" type="password" placeholder="请输入旧密码" autocomplete="off" />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="user.newPassword" type="password" placeholder="请输入新密码" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="Password" type="password" placeholder="请再次输入密码" autocomplete="off" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="cancel()">取 消</el-button>
        <el-button type="primary" size="medium" @click="send()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { removeToken } from '@/utils/auth'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name',
      'id',
      'username'
    ])
  },
  data() {
    return {
      centerDialogVisible: false,
      user: {
        newPassword: '',
        oldPassword: ''
      },
      Password: ''
    }
  },
  /* 页面销毁就清空*/
  destroyed() {
    window.localStorage.clear()
    this.$axios.get(`/server/account/logout`).then((res) => {
    })
    removeToken()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    logout() {
      this.$axios.get(`/server/account/logout`).then((res) => {
      })
      window.localStorage.clear()
      location.reload()
      removeToken()
      this.$router.push(/`login?redirect=${this.$route.fullPath}`)
    },
    cancel() {
      this.centerDialogVisible = false
      this.user = {}
    },
    send() {
      if (this.user.oldPassword === '' || this.user.oldPassword === undefined) {
        this.$message({
          type: 'warning',
          message: '请输入旧密码'
        })
        return
      }
      if (this.user.newPassword === '' || this.user.newPassword === undefined) {
        this.$message({
          type: 'warning',
          message: '请输入密码'
        })
        return
      }
      if (this.user.newPassword !== this.Password) {
        this.$message({
          type: 'warning',
          message: '两次输入的密码不一致'
        })
        return
      }
      if (this.user.newPassword === undefined || this.Password === undefined) {
        this.$message({
          type: 'warning',
          message: '请输入密码'
        })
        return
      }
      if (this.user.newPassword.length <= 5 || this.Password.length <= 5) {
        this.$message({
          type: 'warning',
          message: '密码长度最低六位'
        })
        return
      }
      this.$axios.put(`/server/account/updatePassword/${this.id}`, this.user).then(res => {
        if (res.data.success === true) {
          this.$message({
            type: 'success',
            message: '修改成功请您重新登录'
          })
          this.centerDialogVisible = false
          removeToken()
          this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        }
        if (res.data.success === false) {
          this.$message({
            type: 'info',
            message: '旧密码输入错误'
          })
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
form.el-form {
  width: 410px;
  margin: 0% 1% 0% 15%;
  align-content: center;
}
</style>
