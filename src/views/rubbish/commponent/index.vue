<template>
  <div>
    <div style="padding-right:5px;text-align: center;">
      <el-button type="primary" size="medium" style="height: 38px;float: left"@click="returnTest()">返回</el-button>
      <el-button type="primary" icon="el-icon-plus" size="medium" style="height: 38px;margin: 0px 0px 0px 16%"@click="addformVisible=true;category.categoryName=name">添加名称</el-button>
      <el-input v-model="input" placeholder="请输入搜索名称" style="width: 300px;float: right" @change="Pagination" />
    </div>
    <el-table
      :data="createList"
      style="width: 100%"
    >
      <el-table-column
        label="创建时间"
        prop="lastedUpdateTime"
      >
        <template slot-scope="props">
          {{ props.row.lastedUpdateTime | dateformat('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column
        label="名称"
        prop="name"
      />
      <el-table-column
        label="所属分类"
        prop="father"
      />
      <el-table-column
        label="操作"
      >
        <template slot-scope="props">
          <el-button type="primary" size="medium" @click="categoryStrike(props.row.id)">编辑</el-button>
          <el-button type="danger" size="medium" @click="strikeCategory(props.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="currentPage"
      :page-size="size"
      layout="total, prev, pager, next"
      :total="total"
      style="text-align: center"
      @size-change="Pagination"
      @current-change="Pagination"
    />
    <el-dialog
      :title="categoryId===``?'添加名称':'编辑名称'"
      :visible.sync="addformVisible"
      :close-on-click-modal="false"
      custom-class="customWidth"
      width="35%"
      :close-on-press-escape="false"
      :before-close="close"
      show-clos="false"
      style="text-align: center;"
    >
      <el-form id="addFrom" ref="category" :model="category" label-width="220px">
        <el-form-item label="类别名:">
          <el-input v-model="category.name" placeholder="请输入类别名" />
        </el-form-item>
        <el-form-item label="所属分类:">
          <el-input v-model="category.categoryName" placeholder="请输入类别名" disabled="" />
        </el-form-item>
      </el-form>
      <el-button style="margin-top: 12px;" class="buttontest" @click="close">取消</el-button>
      <el-button style="margin-top: 12px;" class="buttontest" @click="categorySend()">确定</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { getCategory, add, garbageupdate, garbagedelete } from '@/api/rubbish'
export default {
  data() {
    return {
      addformVisible: false,
      currentPage: 1,
      size: 10,
      total: 0,
      category: {
        name: '',
        categoryName: ''
      },
      createList: '',
      id: '',
      cityId: '',
      name: '',
      input: '',
      total: 0,
      categoryId: '',
      thisId: ''
    }
  },
  created() {
    this.$message.closeAll()
    this.id = this.$route.query.id
    this.cityId = this.$route.query.cityId
    this.name = this.$route.query.name
    this.thisId = this.$route.query.categoryId
    this.Pagination()
  },
  methods: {
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
        arr.categoryId = this.id
        add(arr).then(res => {
          if (res.data.success === true) {
            this.Pagination()
            this.close()
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            return
          }
          if (res.data.success !== true) {
            this.close()
            this.Pagination()
            this.$message({
              type: 'info',
              message: res.data.message
            })
            return
          }
        }).catch(err => {
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
        arr.categoryId = this.id
        garbageupdate(arr).then(res => {
          if (res.data.success === true) {
            this.Pagination()
            this.close()
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            return
          }
          if (res.data.success !== true) {
            this.close()
            this.Pagination()
            this.$message({
              type: 'info',
              message: res.data.message
            })
            return
          }
        }).catch(err => {
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
      this.categoryId = ''
      this.addformVisible = false
      this.category.name = ''
    },
    Pagination() {
      const sortByFiled = 'lasted_update_time'
      const sortByOrder = 'desc'
      getCategory(this.id, this.cityId, this.currentPage, this.input, this.size, sortByFiled, sortByOrder).then(res => {
        const data = res.data.queryResult.data
        this.total = data.total
        data.list.forEach(item => {
          item.father = this.name
        })
        this.createList = data.list
      })
    },
    strikeCategory(id) {
      this.$confirm('此操作将永久删除此类别, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        garbagedelete(id).then(res => {
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
      })
    },
    categoryStrike(id) {
      this.categoryId = id
      this.addformVisible = true
      this.createList.forEach(item => {
        if (item.id === id) {
          this.category.name = item.name
          this.category.id = item.id
          this.category.categoryName = this.name
        }
      })
    },
    returnTest() {
      this.$router.push({ path: '/rubbish/guide' })
    }
  }
}
</script>

<style scoped>

</style>
