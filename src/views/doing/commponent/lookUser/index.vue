<template>
  <div
    v-loading="loading"
    align="center"
    class="app-container"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)"
    style="height: 919px"
  >
    <el-card class="box-card">
      <el-button type="primary" style="float: left" size="small" @click="retureUser">返回</el-button>
      <el-button type="primary" size="small" @click="operation">一键审核</el-button>
      <el-table
        :data="list"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" label="id" />
        <el-table-column
          label="报名时间"
        >
          <template slot-scope="props">
            {{ props.row.applyTime|dateformat(`YYYY-MM-DD HH:mm`) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
        />
        <el-table-column
          prop="phone"
          label="手机"
        />
        <el-table-column
          prop="doing"
          label="参加的活动"
        />
        <el-table-column
          prop="joined"
          label="状态"
        >
          <template slot-scope="props">
            <div v-if="props.row.joined===1" style="color: #409EFF">已审核</div>
            <div v-if="props.row.joined===0" style="color: #f06a0a">未审核</div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="props">
            <el-button v-if="props.row.joined===0" type="primary" size="medium" @click="confirm(props.row.id)">确认</el-button>
            <el-button v-if="props.row.joined===1" type="primary" disabled size="medium" @click="confirm(props.row.id)">确认</el-button>
            <!--
            <el-button type="danger" size="medium" @click="confirm">删除</el-button>
            -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="size"
        layout="total, prev, pager, next"
        :total="total"
        @size-change="fetchData"
        @current-change="fetchData"
      />
    </el-card>
  </div>
</template>
<script>
import { sign, findById } from '@/api/doingLookUser'
export default {
  data() {
    return {
      loading: false,
      list: [],
      multipleSelection: [],
      currentPage: 1,
      size: 10,
      total: 0,
      id: '',
      name: ''
    }
  },
  created() {
    this.$message.closeAll()
    this.id = this.$route.query.id
    this.name = this.$route.query.name
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      findById(this.id).then(res => {
        this.loading = false
        const dataList = res.data.queryResult.data
        this.total = dataList.total
        this.list = dataList.list
        this.list.forEach(item => {
          item.doing = this.name
        })
      })
      this.loading = false
    },
    confirm(id) {
      this.loading = true
      const ids = []
      ids.push(id)
      sign(ids).then(res => {
        this.loading = false
        this.fetchData()
        if (res.data.success === true) {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        }
        if (res.data.success !== true) {
          this.$message({
            type: 'info',
            message: res.data.message
          })
        }
      })
      this.loading = false
    },
    operation() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请在左边勾选您要审核的用户,谢谢~'
        })
        return
      }
      this.$confirm('您确定要审核已选中的' + this.multipleSelection.length + '位用户吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const arr = []
        this.multipleSelection.forEach(value => { arr.push(value.id) })
        this.loading = true
        const ids = []
        ids.push(arr)
        sign(ids).then(res => {
          this.fetchData()
          this.loading = false
          if (res.data.success === true) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
          } else {
            this.$message({
              type: 'info',
              message: res.data.message
            })
          }
        })
        this.loading = false
      })
    },
    handleSelectionChange(val) {
      val.forEach(item => {
        if (item.joined === 0) {
          this.multipleSelection = val
        }
      })
    },
    retureUser() {
      this.$router.push({ path: '/doing/compilation' })
    }
  }
}
</script>

<style scoped>

</style>
