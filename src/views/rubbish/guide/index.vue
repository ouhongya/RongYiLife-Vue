<template>
  <div
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)"
    style="height: 919px"
  >
    <el-card class="cardClass">
      <div style="overflow:scroll; width:100%; height:150px">
        <div class="RadioStyle">
          <div v-for="(val,index) in care" class="Block PaddingL">
            <input :id="val.id" type="radio" name="Storage" :value="val.id" @click="fetchData(val.id)">
            <label :id="val.id" v-model="ccccc" :for="val.id">{{ val.cityName }}</label>
          </div>
        </div>
      </div>
    </el-card>
    <el-card v-if="cityId!==''" class="tableCard">
      <el-button type="primary" size="medium" style="margin: 0px 0px 0px 45%;font-size: 15px;" icon="el-icon-plus" @click="formVisible=true;formData.color='#06ff40';color='#06ff40'">添加类别</el-button>
      <el-table
        :data="list"
        style="width: 100%"
        @expand-change="test"
      >
        <el-table-column
          label="创建时间"
          prop="createdTime"
        >
          <template slot-scope="props">
            {{ props.row.createdTime | dateformat('YYYY-MM-DD HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column
          label="类名"
          prop="name"
        />
        <el-table-column
          label="颜色"
        >
          <template slot-scope="props">
            <span :style="{background:props.row.color}">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="数量"
          prop="num"
        />
        <el-table-column
          width="300px"
          label="操作"
        >
          <template slot-scope="props">
            <el-button type="primary" size="medium" @click="edit(props.row.id)">编辑</el-button>
            <el-button v-if="props.row.num===`0`" type="danger" size="medium" @click="strike(props.row.id)">删除</el-button>
            <el-button v-if="props.row.num!==`0`" type="danger" size="medium" disabled @click="strike(props.row.id)">删除</el-button>
            <el-button type="primary" size="medium" @click="toRouter(props.row.id,props.row.name)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      :title="id===``?'添加类别':'编辑类别'"
      :visible.sync="formVisible"
      :close-on-click-modal="false"
      custom-class="customWidth"
      width="35%"
      :close-on-press-escape="false"
      :before-close="close"
      show-clos="false"
      style="text-align: center;"
    >
      <el-form id="shurukaung1" ref="formData" :model="formData" label-width="220px">
        <el-form-item label="类别名:">
          <el-input v-model="formData.name" placeholder="请输入类别名" />
        </el-form-item>
        <el-form-item label="颜色:">
          <el-input v-model="formData.color" placeholder="请输入六位的色号" @change="colorChange" />
        </el-form-item>
        <el-form-item label="预览区:">
          <colorPicker id="colorClass" v-model="color" default-color="#06ff40" @change="colorPicker" />
        </el-form-item>
      </el-form>
      <el-button style="margin-top: 12px;" class="buttontest" @click="close">取消</el-button>
      <el-button style="margin-top: 12px;" class="buttontest" @click="send(`formData`)">确定</el-button>
    </el-dialog>
  </div>
</template>
<script>
import { cityList, fetchData, addCategory, deleteCategory, updateCategory, getCategory, add, garbage, garbageupdate, garbagedelete } from '@/api/rubbish'
export default {
  data() {
    return {
      loading: false,
      id: '',
      categoryId: '',
      care: [],
      model: '',
      cityId: '',
      list: [],
      formVisible: false,
      addformVisible: false,
      formData: {
        id: '',
        name: '',
        color: '#06ff40'
      },
      color: '#06ff40',
      size: 10,
      currentPage: 1,
      total: 0,
      input: '',
      category: {
        name: '',
        categoryName: ''
      },
      createList: '',
      row: '',
      ccccc: ''
    }
  },
  created() {
    this.$message.closeAll()
    this.loading = true
    cityList().then(res => {
      this.loading = false
      this.care = res.data.queryResult.data
      console.log(this.care)
    }).catch(err => {
      this.loading = true
      this.$message({
        type: 'info',
        message: res.data.message
      })
    })
  },
  methods: {
    fetchData(id) {
      this.loading = true
      fetchData(id).then(res => {
        this.loading = false
        this.list = res.data.queryResult.data
      })
      this.loading = false
      this.cityId = id
    },
    info() {

    },
    strike(id) {
      this.$confirm('此操作将永久删除此类别, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteCategory(id).then(res => {
          this.loading = false
          this.fetchData(this.cityId)
          if (res.data.success === true) {
            this.$message({
              type: 'success',
              message: '删除成功'
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
      })
    },
    strikeCategory(id) {
      this.$confirm('此操作将永久删除此类别, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        garbagedelete(id).then(res => {
          this.loading = false
          this.Pagination()
          if (res.data.success === true) {
            this.$message({
              type: 'success',
              message: '删除成功'
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
      })
    },
    categoryStrike(id) {
      this.categoryId = id
      this.addformVisible = true
      this.createList.forEach(item => {
        if (item.id === id) {
          this.category.name = item.name
          this.category.id = item.id
          this.categoryName = this.row.name
        }
      })
    },
    edit(id) {
      this.id = id
      this.formVisible = true
      this.list.forEach(item => {
        if (item.id === id) {
          this.formData.id = item.id
          this.formData.name = item.name
          this.formData.color = item.color
          this.color = item.color
        }
      })
    },
    test(row, expandedRows) {
      if (expandedRows.length !== 0) {
        this.row = row
        this.Pagination()
      }
    },
    Pagination() {
      const sortByFiled = 'lasted_update_time'
      const sortByOrder = 'desc'
      this.loading = true
      getCategory(this.row.id, this.cityId, this.currentPage, this.input, this.size, sortByFiled, sortByOrder).then(res => {
        this.loading = false
        const data = res.data.queryResult.data
        this.total = data.total
        data.list.forEach(item => {
          item.father = this.row.name
        })
        this.createList = data.list
      })
      this.loading = false
    },
    send() {
      if (this.formData.name === '' || this.formData.name === undefined) {
        this.$message({
          type: 'warning',
          message: '请输入类别名'
        })
        return
      }
      if (this.formData.color === '' || this.formData.color === undefined) {
        this.$message({
          type: 'warning',
          message: '请输入色号'
        })
        return
      }
      if (this.id === ``) {
        const arr = {}
        arr.name = this.formData.name
        arr.color = this.formData.color
        arr.cityId = this.cityId
        this.loading = true
        addCategory(arr).then(res => {
          this.loading = false
          this.close()
          if (res.data.success === true) {
            this.fetchData(this.cityId)
            this.close()
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            return
          }
          if (res.data.success !== true) {
            this.loading = false
            this.close()
            this.$message({
              type: 'info',
              message: res.data.message
            })
          }
        }).catch(err => {
          this.loading = false
          this.$message({
            type: 'info',
            message: res.data.message
          })
          return
        })
      }
      if (this.id !== '') {
        const arr = {}
        arr.id = this.formData.id
        arr.name = this.formData.name
        arr.color = this.formData.color
        arr.cityId = this.cityId
        this.loading = true
        updateCategory(arr).then(res => {
          this.loading = false
          if (res.data.success === true) {
            this.fetchData(this.cityId)
            this.close()
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            return
          }
          if (res.data.success !== true) {
            this.loading = false
            this.close()
            this.$message({
              type: 'info',
              message: res.data.message
            })
            return
          }
        }).catch(err => {
          this.loading = false
          this.close()
          this.$message({
            type: 'info',
            message: res.data.message
          })
          return
        })
      }
    },
    categorySend() {
      if (this.category.name === '' || this.category.name === undefined) {
        this.$message({
          type: 'warning',
          message: '请输入名称'
        })
        return
      }
      if (this.categoryId === '') {
        const arr = {}
        arr.name = this.category.name
        arr.cityId = this.cityId
        arr.categoryId = this.row.id
        this.loading = true
        add(arr).then(res => {
          this.loading = false
          if (res.data.success === true) {
            this.loading = false
            this.Pagination()
            this.close()
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            return
          }
          if (res.data.success !== true) {
            this.loading = false
            this.close()
            this.Pagination()
            this.$message({
              type: 'info',
              message: res.data.message
            })
            return
          }
        }).catch(err => {
          this.loading = false
          this.close()
          this.$message({
            type: 'info',
            message: res.data.message
          })
          return
        })
      }
      if (this.categoryId !== '') {
        const arr = {}
        arr.id = this.category.id
        arr.name = this.category.name
        arr.cityId = this.cityId
        arr.categoryId = this.row.id
        this.loading = true
        garbageupdate(arr).then(res => {
          this.loading = false
          if (res.data.success === true) {
            this.loading = false
            this.Pagination()
            this.close()
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            return
          }
          if (res.data.success !== true) {
            this.loading = false
            this.close()
            this.Pagination()
            this.$message({
              type: 'info',
              message: res.data.message
            })
            return
          }
        }).catch(err => {
          this.loading = false
          this.close()
          this.$message({
            type: 'info',
            message: res.data.message
          })
          return
        })
      }
    },
    close() {
      this.id = ''
      this.categoryId = ''
      this.formVisible = false
      this.addformVisible = false
      this.formData.name = ''
      this.formData.color = ''
      this.category.name = ''
    },
    /* // 修改table tr行的背景色 ffffff
      tableRowStyle({ row, rowIndex }) {
        return 'background-color: #e5e5e5;font-size:16px'
      },
      // 修改table header的背景色
      tableHeaderColor({ row, column, rowIndex, columnIndex }) {
        if (rowIndex === 0) {
          return 'background-color: #e5e5e5;color: #333;font-weight: 500;font-size:16px'
        }
      },
      // 修改table tr行的背景色 ffffff
      tableRowStyle1({ row, rowIndex }) {
        return 'background-color: #ffffff;'
      },
      // 修改table header的背景色
      tableHeaderColor1({ row, column, rowIndex, columnIndex }) {
        if (rowIndex === 0) {
          return 'background-color: #ffffff;color: #333;font-weight: 500;'
        }
      },*/
    colorChange() {
      this.color = this.formData.color
    },
    colorPicker() {
      this.formData.color = this.color
    },
    toRouter(id, name) {
      this.$router.push({ name: '垃圾分类引导子节点', query: { id: id, name: name, cityId: this.cityId }})
    }
  }
}
</script>
<style lang="scss">
  #addFrom.el-form {
    width: 300px;
    margin: 0px 200px 0px 0px;
  }
  .cardClass{
    width: 100%;
    height: 150px;
  }
  .tableCard{
    padding: 5px;
  }
  .RadioStyle label {
    border: 1px solid #00a4ff;
    padding: 2px 10px 2px 5px;
    line-height: 28px;
    min-width: 80px;
    text-align: center;
    float: left;
    margin: 15px 0px 15px 20px;
    border-radius: 4px
  }
  .RadioStyle input {
    display: none
  }
  .RadioStyle input:checked + label {
    background: url(yes.svg) no-repeat right bottom;
    background-size: 21px 21px;
    color: #00a4ff
  }
  .el-table__expanded-cell[class*=cell] {
    padding: 0px 0px 30px 50px;
  }
  .buttonClass{
    margin: 8px 0px 0px 10px;
    font-size: 16px;
  }
  #colorClass.m-colorPicker .colorBtn[data-v-11842410] {
    width: 250px;
    height: 35px;
    float: left;
  }
  #colorId {
    width: 180%;
  }
</style>
