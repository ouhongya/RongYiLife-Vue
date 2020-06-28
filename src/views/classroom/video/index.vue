<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)"
    style="height: 1020px"
  >
    <el-card class="box-card" align="center">
      <el-button type="primary" size="small" @click="Visible=true">添加视频</el-button>
      <el-table
        :data="list"
        style="width: 100%"
        @sort-change="fetchData"
      >
        <el-table-column
          prop="createdTime"
          sortable
          label="时间"
          align="center"
          width="150px"
        >
          <template slot-scope="props">
            {{ props.row.createdTime|dateformat('YYYY-MM-DD HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          sortable
          label="标题"
          align="center"
        />
        <el-table-column
          prop="intros"
          sortable
          label="简介"
          align="center"
        />
        <el-table-column
          prop="url"
          width="290px"
          label="视频连接"
          align="center"
        />
        <el-table-column
          prop="likedNum"
          sortable
          align="center"
          label="点赞数"
          width="100px"
        />
        <el-table-column
          prop="defaultSort"
          sortable
          align="center"
          label="排序值"
          width="100px"
        >
          <template slot-scope="props">
            <el-popover
              id="popover2"
              v-model="props.row.visible2"
              placement="bottom"
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
          label="状态"
          align="center"
          width="100px"
        >
          <template slot-scope="props">
            <p v-if="props.row.status===0&&props.row.pass===1" style="color: #8c939d">已下架</p>
            <p v-if="props.row.status===1&&props.row.pass===1" style="color: #409EFF">已上架</p>
            <p v-if="props.row.pass===0&&props.row.status===0" style="color:#f06a0a">未审核</p>
            <p v-if="props.row.pass===-1" style="color: #F56C6C">
              <span>审核未通过</span>
              <br>
              <el-tooltip class="item" effect="light" :content="props.row.passComment" placement="top">
                <el-button type="text" style="color: #f01214">详情</el-button>
              </el-tooltip>
            </p>

          </template>
        </el-table-column>
        <el-table-column
          width="250px"
          align="center"
          label="操作"
        >
          <template slot-scope="props">
            <el-button type="primary" size="small" @click="edit(props.row.id)">编辑</el-button>
            <el-button type="danger" size="small" @click="strikeout(props.row.id)">删除</el-button>
            <el-button v-if="props.row.status===0&&props.row.pass===1" type="primary" size="small" @click="shelf(props.row.id)">上架</el-button>
            <el-button v-if="props.row.status===1&&props.row.pass===1" type="primary" size="small" @click="shelf(props.row.id)">下架</el-button>
            <el-button v-if="props.row.pass===0&&props.row.status===0" type="primary" size="small" disabled @click="shelf(props.row.id)">上架</el-button>
            <el-button v-if="props.row.pass===-1" type="primary" size="small" disabled @click="shelf(props.row.id)">上架</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="添加视频"
        :visible.sync="Visible"
        width="50%"
        :close-on-click-modal="false"
        :before-close="close"
        :close-on-press-escape="false"
        style="text-align: center"
      >
        <el-form ref="form" :model="form" style="width: 50%;margin: auto" label-width="80px">
          <el-form-item label="视频标题:">
            <el-input v-model="form.title" placeholder="请输入视频标题" class="inputVideo" />
          </el-form-item>
          <el-form-item label="简介:">
            <el-input v-model="form.intros" type="textarea" style="width: 100%" maxlength="30" :rows="2" placeholder="请输入视频简介30个字" />
          </el-form-item>
          <el-form-item label="排序值:">
            <el-input v-model="form.defaultSort" class="inputVideo" placeholder="请输入排序值,数值越大越靠前" type="number" on-keypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" />
          </el-form-item>
          <el-form-item label="视频连接:">
            <el-input v-model="form.url" class="inputVideo" placeholder="请填入视频连接" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="close">取消</el-button>
            <el-button type="primary" size="small" @click="onSubmit">确定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog
        title="编辑视频"
        :visible.sync="editVisible"
        width="50%"
        :close-on-click-modal="false"
        :before-close="close"
        :close-on-press-escape="false"
        style="text-align: center"
      >
        <el-form ref="form" :model="form" style="width: 50%;margin: auto" label-width="80px">
          <el-form-item label="视频标题:">
            <el-input v-model="form.title" placeholder="请输入视频标题" class="inputVideo" />
          </el-form-item>
          <el-form-item label="简介:">
            <el-input v-model="form.intros" type="textarea" style="width: 100%" maxlength="30" :rows="2" placeholder="请输入视频简介30个字" />
          </el-form-item>
          <el-form-item label="排序值:">
            <el-input v-model="form.defaultSort" class="inputVideo" placeholder="请输入排序值,数值越大越靠前" type="number" on-keypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" />
          </el-form-item>
          <el-form-item label="视频连接:">
            <el-input v-model="form.url" class="inputVideo" placeholder="请填入视频连接" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="close">取消</el-button>
            <el-button type="primary" size="small" @click="editSubmit">确定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="size"
        layout="total, prev, pager, next"
        :total="total"
        style="text-align: center"
        @size-change="fetchData"
        @current-change="fetchData"
      />
    </el-card>
  </div>
</template>
<script>
import { addVideo, fetchData, editVideo, editOnSubmit, deleteVideo, reviewVideo, sortVideo } from '@/api/videl'
export default {
  data() {
    return {
      list: null,
      Visible: false,
      editVisible: false,
      form: {
        id: null,
        title: null,
        intros: null,
        url: null,
        defaultSort: null
      },
      currentPage: 1,
      size: 12,
      total: 0,
      loading: false,
      sort: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData(val) {
      let order = 'desc'
      let name = 'created_time'
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
      if (val !== undefined && val.prop === `intros`) {
        if (val.order === undefined) {
          name = 'intros'
          order = 'desc'
        }
        if (val.order === `descending`) {
          name = 'intros'
          order = 'desc'
        }
        if (val.order === `ascending`) {
          name = 'intros'
          order = 'asc'
        }
      }
      if (val !== undefined && val.prop === `url`) {
        if (val.order === undefined) {
          name = 'url'
          order = 'desc'
        }
        if (val.order === `descending`) {
          name = 'url'
          order = 'desc'
        }
        if (val.order === `ascending`) {
          name = 'url'
          order = 'asc'
        }
      }
      if (val !== undefined && val.prop === `pass`) {
        if (val.order === undefined) {
          name = 'url'
          order = 'desc'
        }
        if (val.order === `descending`) {
          name = 'url'
          order = 'desc'
        }
        if (val.order === `ascending`) {
          name = 'url'
          order = 'asc'
        }
      }
      fetchData(this.currentPage, '', this.size, name, order).then(res => {
        if (res.data.success === true) {
          const data = res.data.queryResult.data
          this.list = data.list
          this.list.forEach(item => {
            item.visible2 = false
          })
          this.total = data.total
        }
      })
    },
    close() {
      this.Visible = false
      this.editVisible = false
      this.form.title = null
      this.form.intros = null
      this.form.url = null
      this.form.defaultSort = null
    },
    onSubmit() {
      if (this.form.title === null || this.form.title === undefined) {
        this.$message({
          type: 'info',
          message: '请输入视频标题'
        })
        return
      }
      if (this.form.intros === null || this.form.intros === undefined) {
        this.$message({
          type: 'info',
          message: '请输入视频简介'
        })
        return
      }
      if (this.form.defaultSort === null || this.form.defaultSort === undefined) {
        this.$message({
          type: 'info',
          message: '请输入排序值'
        })
        return
      }
      if (this.form.intros.length > 30) {
        this.$message({
          type: 'info',
          message: '视频简介最长是30个字'
        })
        return
      }
      if (this.form.url === null || this.form.url === undefined) {
        this.$message({
          type: 'info',
          message: '请填入视频连接'
        })
        return
      }
      addVideo(this.form).then(res => {
        if (res.data.success === true) {
          this.fetchData()
          this.close()
          this.$message({
            type: 'success',
            message: '添加成功,请等待管理员审核...'
          })
          this.Visible = false
        } else {
          this.$message({
            type: 'info',
            message: '添加失败'
          })
        }
      })
    },
    editSubmit() {
      if (this.form.title === null || this.form.title === undefined) {
        this.$message({
          type: 'info',
          message: '请输入视频标题'
        })
        return
      }
      if (this.form.intros === null || this.form.intros === undefined) {
        this.$message({
          type: 'info',
          message: '请输入视频简介'
        })
        return
      }
      if (this.form.defaultSort === null || this.form.defaultSort === undefined) {
        this.$message({
          type: 'info',
          message: '请输入排序值'
        })
        return
      }
      if (this.form.intros.length > 30) {
        this.$message({
          type: 'info',
          message: '视频简介最长是30个字'
        })
        return
      }
      if (this.form.url === null || this.form.url === undefined) {
        this.$message({
          type: 'info',
          message: '请填入视频连接'
        })
        return
      }
      editOnSubmit(this.form).then(res => {
        if (res.data.success === true) {
          this.close()
          this.$message({
            type: 'success',
            message: '更新成功,请等待管理员审核...'
          })
          this.fetchData()
          this.editVisible = false
        } else {
          this.$message({
            type: 'info',
            message: '更新失败'
          })
        }
      })
    },
    shelf(id) {
      this.list.forEach(item => {
        if (item.id === id) {
          if (item.status === 0) {
            this.$confirm('此操作将上架此视频, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              reviewVideo('up', id).then(res => {
                if (res.data.success === true) {
                  this.fetchData()
                  this.$message({
                    type: 'success',
                    message: '上架成功'
                  })
                }
              })
            }).catch(() => {
            })
          } else {
            this.$confirm('此操作将下架此视频, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              reviewVideo('down', id).then(res => {
                if (res.data.success === true) {
                  this.fetchData()
                  this.$message({
                    type: 'success',
                    message: '下架成功'
                  })
                }
              })
            }).catch(() => {
            })
          }
        }
      })
    },
    edit(id) {
      editVideo(id).then(res => {
        if (res.data.success === true) {
          this.form = res.data.queryResult.data
          this.editVisible = true
        }
      })
    },
    strikeout(id) {
      this.$confirm('此操作将永久删除此视频, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteVideo(id).then(res => {
          if (res.data.success === true) {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          }
        })
      }).catch(() => {
      })
    },
    sortSubmit(id) {
      this.loading = false
      this.list.forEach(item => {
        if (item.id === id) {
          const obj = {
            id: id,
            sort: this.sort
          }
          sortVideo(obj).then(res => {
            if (res.data.success === true) {
              this.loading = false
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
          this.loading = false
        }
      })
    }
  }
}
</script>
<style>
  .inputVideo input.el-input__inner {
    cursor: pointer;
    border-color: #C0C4CC;
    width: 100%;
    float: left;
  }
</style>
