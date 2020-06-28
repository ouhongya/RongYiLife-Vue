<template>
  <div
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)"
    style="height: auto"
  >
    <el-card class="box-card" style="height: auto">
      <el-button type="primary" size="small" style="margin: 0px 0px 0px 47%" @click="addAnswer">新建文章</el-button>
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
          sortable
          width="100px"
          label="排序值"
        >
          <template slot-scope="props">
            <el-popover
              id="popover2"
              v-model="props.row.visible2"
              placement="right"
              trigger="click"
            >
              <div style="text-align: right; margin: 0">
                <el-input v-model="sort" class="popover" on-keypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" type="number" />
                <el-button size="mini" type="text" @click="props.row.visible2 = false;sort=null">取消</el-button>
                <el-button type="primary" size="mini" @click="sortSubmit(props.row.id)">确定</el-button>
              </div>
            </el-popover>
            {{ props.row.defaultSort }}
            <el-button v-if="props.row.status===0" size="small" style="color: #8c939d" type="text" class="el-icon-edit" @click="props.row.visible2 = true;sort=props.row.defaultSort" />
            <el-button v-if="props.row.status===1" size="small" style="color: #409EFF" type="text" class="el-icon-edit" @click="props.row.visible2 = true;sort=props.row.defaultSort" />
          </template>
        </el-table-column>
        <el-table-column
          prop="liked"
          sortable
          width="100px"
          align="center"
          label="点赞"
        >
          <template slot-scope="props">
            {{ props.row.liked }}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          width="100px"
          align="center"
          label="状态"
        >
          <template slot-scope="props">
            <p v-if="props.row.status===0" style="color: #8c939d">未发布</p>
            <p v-if="props.row.status===1" style="color: #409EFF">已发布</p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="250"
          label="操作"
        >
          <template slot-scope="props">
            <el-button size="small" type="primary" @click="view(props.row.id)">编辑/查看</el-button>
            <el-button size="small" type="primary" @click="releaseUpAndDown(props.row.id)" v-html="props.row.status===0?'发布':'下架'" />
            <el-button size="small" type="danger" @click="test(props.row.id)">删除</el-button>
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
import { fetchData, deleteArticle, release, updateSort } from '@/api/answer'
export default {
  data() {
    return {
      list: null,
      currentPage: 1,
      size: 7,
      total: 0,
      operates: [
        {
          label: '全部文章',
          value: 'publishCom',
          field: 'default'
        },
        {
          label: '已发布',
          value: 'publishOn',
          field: 'up'
        },
        {
          label: '未发布',
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
      let order = 'desc'
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
        this.loading = false
        const data = res.data.queryResult.data
        this.total = data.total
        data.list.forEach(item => {
          const arr = []
          arr.push(item.cover)
          item.list = arr
          item.visible2 = false
        })
        this.list = data.list
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
      this.$router.push({ path: '/classroom/addNews' })
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
