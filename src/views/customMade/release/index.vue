<template>
  <div
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)"
    style="height: auto"
  >
    <el-card class="box-card" style="height: auto">
      <el-button type="primary" size="small" style="margin: 0px 0px 0px 47%" @click="addAnswer">添加产品</el-button>
      <el-select
        v-model="operateType"
        size="medium"
        style="float: right"
        placeholder="排序 "
        @change="fetchData"
      >
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.field"
        />
      </el-select>
      <el-table
        :data="list"
        :default-sort="{prop: 'createdTimeStr', order: 'desc'}"
        @sort-change="fetchData"
      >
        <el-table-column
          prop="createdTime"
          align="center"
          sortable
          label="时间"
        >
          <template slot-scope="props">
            {{ props.row.createdTime | dateformat(`YYYY-MM-DD HH:mm`) }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="title"
          sortable
          label="标题"
        >
          <template slot-scope="props">
            <el-popover
              placement="top"
              width="290"
              trigger="hover"
              :content="props.row.title "
            >
              <el-button slot="reference" type="text" style="color: rgb(90, 94, 102);">{{ props.row.title.substr(0,25) }}......</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="cover"
          align="center"
          label="封面"
        >
          <template slot-scope="props">
            <el-image
              style="width: 120px; height: 80px"
              :src="props.row.cover"
              :preview-src-list="props.row.list"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="defaultSort"
          label="排序值"
        >
          <template slot-scope="props">
            {{ props.row.defaultSort }}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          width="100px"
          align="center"
          label="所属分类"
        >
          <template slot-scope="props">
            <p>{{ props.row.name }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="count"
          width="100px"
          sortable
          align="center"
          label="留言数"
        >
          <template slot-scope="props">
            <p>{{ props.row.count }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          width="100px"
          align="center"
          label="状态"
        >
          <template slot-scope="props">
            <p v-if="props.row.pass==='已下架'" style="color: #8c939d">
              {{ props.row.pass }}
            </p>
            <p v-if="props.row.pass==='已上架'" style="color: #409EFF">
              {{ props.row.pass }}
            </p>
            <p v-if="props.row.pass==='未审核'" style="color: #f06a0a">
              {{ props.row.pass }}
            </p>
            <p v-if="props.row.pass==='审核未通过'" style="color: #f01214">
              {{ props.row.pass }}
            </p>
            <p v-if="props.row.pass==='审核未通过'">
              <el-tooltip class="item" effect="light" :content="props.row.passComment" placement="top">
                <el-button type="text" style="color: #f01214">详情</el-button>
              </el-tooltip>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div style="text-align: center">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="size"
        layout="total, prev, pager, next"
        :total="total"
        @size-change="fetchData('default')"
        @current-change="fetchData('default')"
      />
    </div>
  </div>
</template>
<script>
import { fetchData, deleteArticle, release, updateSort } from '@/api/made'
export default {
  data() {
    return {
      list: null,
      currentPage: 1,
      size: 6,
      total: 0,
      operates: [
        {
          label: '全部产品',
          value: 'publishCom',
          field: 'default'
        },
        {
          label: '已上架',
          value: 'publishOn',
          field: 'up'
        },
        {
          label: '未上架',
          value: 'x',
          field: 'down'
        }
      ],
      operateType: 'default',
      loading: false,
      sort: null,
      visible2: false
    }
  },
  created() {
    this.$message.closeAll()
    this.operateType = 'default'
    this.fetchData('default')
  },
  methods: {
    fetchData(val) {
      let order = 'asc'
      let name = 'default_sort'
      if (val !== undefined && val.prop === `createdTime`) {
        if (val.order === undefined) {
          name = 'created_time'
          order = 'desc'
        }
        if (val.order === `descending`) {
          name = 'created_time'
          order = 'desc'
        }
        if (val.order === `ascending`) {
          name = 'created_time'
          order = 'asc'
        }
      }
      if (val !== undefined && val.prop === `count`) {
        if (val.order === undefined) {
          name = 'count'
          order = 'desc'
        }
        if (val.order === `descending`) {
          name = 'count'
          order = 'desc'
        }
        if (val.order === `ascending`) {
          name = 'count'
          order = 'asc'
        }
      }
      if (val !== undefined && val.prop === `defaultSort`) {
        if (val.order === undefined) {
          name = 'default_sort'
          order = 'desc'
        }
        if (val.order === `descending`) {
          name = 'default_sort'
          order = 'desc'
        }
        if (val.order === `ascending`) {
          name = 'default_sort'
          order = 'asc'
        }
      }
      if (val !== undefined && val.prop === `liked`) {
        if (val.order === undefined) {
          name = 'liked'
          order = 'desc'
        }
        if (val.order === `descending`) {
          name = 'liked'
          order = 'desc'
        }
        if (val.order === `ascending`) {
          name = 'liked'
          order = 'asc'
        }
      }
      if (val !== undefined && val.prop === `title`) {
        if (val.order === undefined) {
          name = 'title'
          order = 'desc'
        }
        if (val.order === `descending`) {
          name = 'title'
          order = 'desc'
        }
        if (val.order === `ascending`) {
          name = 'title'
          order = 'asc'
        }
      }
      val = this.operateType
      this.loading = true
      fetchData(this.currentPage, val, this.size, name, order).then(res => {
        if (res.data.success === true) {
          this.loading = false
          const data = res.data.queryResult.data
          this.total = data.total
          data.list.forEach(item => {
            const arr = []
            arr.push(item.cover)
            item.list = arr
            item.name = item.productCustomizedCategory.name
            item.visible2 = false
          })
          this.list = data.list
          for (let x = 0; x < this.list.length; x++) {
            if (this.list[x].status === 0 && this.list[x].pass === 0) {
              this.list[x].pass = '未审核'
            }
            if (this.list[x].status === 0 && this.list[x].pass === -1) {
              this.list[x].pass = '审核未通过'
            }
            if (this.list[x].status === 1 && this.list[x].pass === 1) {
              this.list[x].pass = '已上架'
            }
            if (this.list[x].status === 0 && this.list[x].pass === 1) {
              this.list[x].pass = '已下架'
            }
          }
        } else {
          this.$message({
            info: 'info',
            message: res.data.message
          })
        }
      })
    },
    view(id) {
      this.$router.push({ name: '编辑文章', query: { id: id }})
    },
    test(id) {
      this.$confirm('此操作将永久删除此文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteArticle(id).then(res => {
          this.loading = false
          if (res.data.success === true) {
            this.fetchData()
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
    releaseUpAndDown(id) {
      this.list.forEach(item => {
        if (item.id === id) {
          if (item.status === 0) {
            this.$confirm('此操作会将此篇文章发布到手机端, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.loading = true
              release(`up`, id).then(res => {
                this.loading = false
                if (res.data.success === true) {
                  this.fetchData()
                  this.$message({
                    type: 'success',
                    message: '发布成功'
                  })
                }
                if (res.data.success !== true) {
                  this.$message({
                    type: 'info',
                    message: res.data.message
                  })
                }
              })
              return
            })
          }
          if (item.status === 1) {
            this.$confirm('此操作会将此篇文章从手机端下架, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.loading = true
              release(`down`, id).then(res => {
                this.loading = false
                if (res.data.success === true) {
                  this.fetchData()
                  this.$message({
                    type: 'success',
                    message: '下架成功'
                  })
                }
                if (res.data.success !== true) {
                  this.$message({
                    type: 'info',
                    message: res.data.message
                  })
                }
              })
              return
            })
          }
        }
      })
    },
    addAnswer() {
      this.$router.push({ path: '/made/addMade' })
    },
    sortSubmit(id) {
      this.list.forEach(item => {
        if (item.id === id) {
          const obj = {
            id: id,
            sort: this.sort
          }
          updateSort(obj).then(res => {
            if (res.data.success === true) {
              this.fetchData()
              item.visible2 = false
              this.$message({
                type: 'success',
                message: '修改成功'
              })
            } else {
              this.$message({
                type: 'info',
                message: res.data.message
              })
            }
          })
        }
      })
    }
  }
}
</script>
<style>
  .popover  input.el-input__inner {
    cursor: pointer;
    border-color: #C0C4CC;
    width: 100px;
    margin: 5px;
  }
  #popover2 .el-popover {
    position: absolute;
    background: #FFF;
    min-width: 100px;
    border: 1px solid #EBEEF5;
    padding: 12px;
    z-index: 2000;
    color: #606266;
    line-height: 1.4;
    text-align: justify;
    font-size: 14px;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    word-break: break-all;
  }
</style>
