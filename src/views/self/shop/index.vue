<template>
  <div
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)"
    style="height: 919px"
  >
    <div style="width: 100%;float: left">
      <div class="divTable">
        <el-card>
          <el-button size="small" style="margin: 0px 0px 0px 50%" type="primary" @click="centerDialogVisible=true">新增商品分类</el-button>
          <el-table
            :data="tableData"
            border
            style="width: 100%;"
          >
            <el-table-column
              prop="date"
              label="日期"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.createdTime | dateformat('YYYY-MM-DD') }}
              </template>
            </el-table-column>
            <el-table-column
              label="类型名称"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.categoryName }}
              </template>
            </el-table-column>
            <el-table-column
              label="商品数量"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.itemNum }}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
            >
              <template slot-scope="scope">
                <el-button size="small" type="primary" @click="edit(scope.row.id)">编辑</el-button>
                <el-button v-if="scope.row.itemNum===0" size="small" type="danger" @click="strike(scope.row.id)">删除</el-button>
                <el-button v-if="scope.row.itemNum!==0" size="small" type="danger" disabled @click="strike(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>
    <el-dialog
      :title="id===''?'添加商品类别':'编辑商品类别'"
      :visible.sync="centerDialogVisible"
      width="30%"
      :close-on-click-modal="false"
      :before-close="cancel"
      :close-on-press-escape="false"
      center
    >
      <el-form id="shurukaung1" label-width="60%">
        <el-form-item label="类别名:">
          <el-input v-model="category" placeholder="请输入类别名" />
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
import { findInfo, createdInfo, categoryEdit, categoryAdd, categoryUpdate, categoryDelete } from '@/api/self'
export default {
  data() {
    return {
      user: {
        name: '',
        address: '',
        score: '',
        trueName: '',
        username: ''
      },
      tableData: [],
      centerDialogVisible: false,
      tableId: '',
      category: '',
      form: '',
      loading: false,
      id: ''
    }
  },
  created() {
    this.$message.closeAll()
    // this.fetchData()
    this.fetchTable()
  },
  methods: {
    fetchData() {
      this.loading = true
      findInfo().then(res => {
        this.loading = false
        if (res.data.success === true) {
          this.user = res.data.queryResult.data
          const dataList = res.data.queryResult.data.account
          let name = ''
          for (let x = 0; x < dataList.length; x++) {
            name += (dataList[x].username + '_' + dataList[x].trueName + ',')
          }
          this.user.username = name.substring(name.length - 1, 0)
        } else {
          this.$message({
            type: 'info',
            message: res.data.message
          })
        }
      })
      this.loading = false
    },
    fetchTable() {
      this.loading = true
      createdInfo().then(res => {
        this.loading = false
        if (res.data.success === true) {
          this.tableData = res.data.queryResult.data
        } else {
          this.$message({
            type: 'info',
            message: res.data.message
          })
        }
      })
      this.loading = false
    },
    modify() {
      alert('预留')
    },
    edit(id) {
      this.id = id
      this.loading = true
      this.centerDialogVisible = true
      categoryEdit(id).then(res => {
        this.fetchTable()
        this.loading = false
        if (res.data.success === true) {
          const data = res.data.queryResult.data
          this.category = data.name
          this.tableId = data.id
        } else {
          this.$message({
            type: 'info',
            message: res.data.message
          })
        }
      })
      this.loading = false
      this.fetchTable()
    },
    send() {
      this.id = ''
      if (this.tableId === '') {
        if (this.category === '' || this.category === undefined) {
          this.$message({
            type: 'warning',
            message: '请输入商品类型名称'
          })
          return
        }
        const goods = {}
        goods.name = this.category
        this.centerDialogVisible = false
        this.tableId = ''
        this.category = ''
        this.loading = true
        categoryAdd(goods).then(res => {
          this.fetchTable()
          this.loading = false
          if (res.data.success === true) {
            this.$message({
              type: 'success',
              message: res.data.message
            })
          } else {
            this.$message({
              type: 'info',
              message: res.data.message
            })
            this.loading = false
          }
        })
        this.loading = false
      }
      if (this.tableId !== '') {
        if (this.category === '' || this.category === undefined) {
          this.$message({
            type: 'warning',
            message: '请输入商品类型名称'
          })
          return
        }
        const goods = {}
        goods.id = this.tableId
        goods.name = this.category
        this.centerDialogVisible = false
        this.loading = false
        categoryUpdate(this.tableId, this.category).then(res => {
          this.tableId = ''
          this.category = ''
          this.fetchTable()
          this.loading = false
          if (res.data.success === true) {
            this.$message({
              type: 'success',
              message: res.data.message
            })
          } else {
            this.$message({
              type: 'info',
              message: res.data.message
            })
          }
        })
        this.loading = false
        this.tableId = ''
        this.category = ''
      }
    },
    cancel() {
      this.centerDialogVisible = false
      this.tableId = ''
      this.id = ''
      this.category = ''
    },
    strike(id) {
      this.$confirm('您确定要删除当前的商品分类吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        categoryDelete(id).then(res => {
          this.fetchTable()
          this.loading = false
          if (res.data.success === true) {
            this.$message({
              type: 'success',
              message: res.data.message
            })
          } else {
            this.$message({
              type: 'info',
              message: res.data.message
            })
            this.loading = false
          }
        })
      })
      this.loading = false
    }
  }
}
</script>
<style scoped>
  .el-dialog__title {
    line-height: 24px;
    font-size: 25px;
    color: #676767;
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
  }

  .divUser {
    font-size: 16px;
    padding: 10px;
    color: #676767;
  }

  .tableTitle {
    position: relative;
    margin: 0 auto;
    width: 600px;
    height: 1px;
    background-color: #d4d4d4;
    text-align: center;
    font-size: 16px;
    color: rgba(101, 101, 101, 1);
    margin-top: 5px;
  }

  .spanUser {
    margin: 0px 0px 0px 40px;
  }

  .spanName {

  }

  .divfather {
    padding: 5px;
    width: 35%;
  }

  .divTable {
    clear: both;
    padding: 5px;
    width: 100%;
    float: left;
  }

  .el-dialog--center .el-dialog__body {
    text-align: initial;
    padding: 20px;
  }

  .input_category{
    margin: 0px 0px 0px 100px;
  }
  .inputtest {
    cursor: pointer;
    border-color: #C0C4CC;
    width: 250px;
    margin: 0px 0px 0px 150px;
  }
  .el-form-item__content {
    line-height: 40px;
    position: relative;
    font-size: 14px;
  }
</style>
