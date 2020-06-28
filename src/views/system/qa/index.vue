<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)"
    style="height: 900px"
  >
    <div style="margin-left: 48%">
      <el-button type="primary" size="small" @click="Visible=true">添加问题</el-button>
    </div>
    <el-card class="box-card">
      <el-table
        :data="list"
        style="width: 100%"
      >
        <el-table-column
          label="时间"
          align="center"
          width="180px"
          height="820px"
        >
          <template slot-scope="props">
            {{ props.row.createdTime|dateformat('YYYY-DD-MM HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="question"
          label="问题"
          align="center"
        >
          <template slot-scope="props">
            {{ props.row.question }}
          </template>
        </el-table-column>
        <el-table-column
          prop="answer"
          label="答案"
          align="center"
        >
          <template slot-scope="props">
            <el-popover
              placement="top"
              width="450"
              trigger="hover"
              :content="props.row.answer"
            >
              <el-button slot="reference" type="text" style="color: rgb(90, 94, 102);">{{ props.row.answer.substring(0,30) }}...</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="defaultSort"
          label="排序"
          width="100px"
          align="center"
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
          width="100px"
          align="center"
        >
          <template slot-scope="props">
            <p v-if="props.row.status===0" style="color: #8c939d">未发布</p>
            <p v-if="props.row.status===1" style="color: #409EFF">已发布</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="操作"
          align="center"
          width="220px"
        >
          <template slot-scope="props">
            <el-button type="primary" size="small" @click="edit(props.row.id)">编辑</el-button>
            <el-button type="danger" size="small" @click="strikeOut(props.row.id)">删除</el-button>
            <el-button type="primary" size="small" @click="Obtained(props.row.id,props.row.status)" v-html="props.row.status===0?'上架':'下架'" />
          </template>
        </el-table-column>
      </el-table>
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
    <el-dialog
      title="添加问题"
      :visible.sync="Visible"
      width="50%"
      :close-on-click-modal="false"
      :before-close="close"
      :close-on-press-escape="false"
      style="text-align: center"
    >
      <el-form ref="form" :model="form" label-width="80px" style="margin: auto;width: 60%">
        <el-form-item label="问题:">
          <el-input v-model="form.question" type="textarea" :rows="3" placeholder="请输入问题" />
        </el-form-item>
        <el-form-item label="答案:">
          <el-input v-model="form.answer" type="textarea" :rows="3" placeholder="请输入答案" />
        </el-form-item>
        <el-form-item label="排序:">
          <el-input v-model="form.defaultSort"type="number"on-keypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入排序值,值越大,手机端展示越靠前" />
        </el-form-item>
        <el-button type="primary" size="small" @click="close">取消</el-button>
        <el-button type="primary" size="small" @click="onSubmit">确定</el-button>
      </el-form>

    </el-dialog>
    <el-dialog
      title="编辑问题"
      :visible.sync="EditVisible"
      width="50%"
      :close-on-click-modal="false"
      :before-close="close"
      :close-on-press-escape="false"
      style="text-align: center"
    >
      <el-form ref="form" :model="form" label-width="80px" style="margin: auto;width: 60%">
        <el-form-item label="问题:">
          <el-input v-model="form.question" type="textarea" :rows="3" placeholder="请输入问题" />
        </el-form-item>
        <el-form-item label="答案:">
          <el-input v-model="form.answer" type="textarea" :rows="3" placeholder="请输入答案" />
        </el-form-item>
        <el-form-item label="排序:">
          <el-input v-model="form.defaultSort" type="number"on-keypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入排序值,值越大,手机端展示越靠前" />
        </el-form-item>
        <el-button type="primary" size="small" @click="close">取消</el-button>
        <el-button type="primary" size="small" @click="editOnSubmit">确定</el-button>
      </el-form>

    </el-dialog>
  </div>
</template>
<script>
import { fetchData, edit, strikeOut, addQa, upAndDown, qaSort } from '@/api/systemQa'
export default {
  data() {
    return {
      list: null,
      currentPage: 1,
      size: 9,
      total: 0,
      Visible: false,
      EditVisible: false,
      form: {
        id: null,
        question: null,
        answer: null,
        defaultSort: null,
        status: null
      },
      loading: false,
      sort: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      const name = 'created_time'
      const order = 'created_time'
      this.loading = true
      fetchData(this.currentPage, '', this.size, name, order).then(res => {
        this.loading = false
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
    edit(id) {
      this.list.forEach(item => {
        if (item.id === id) {
          this.form.id = item.id
          this.form.question = item.question
          this.form.answer = item.answer
          this.form.defaultSort = item.defaultSort
          this.EditVisible = true
        }
      })
    },
    strikeOut(id) {
      this.$confirm('此操作将删除词条问题', '是否继续', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        strikeOut(id).then(res => {
          if (res.data.success === true) {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          } else {
            this.$message({
              type: 'info',
              message: res.data.message
            })
          }
        })
      }).catch(() => {})
    },
    Obtained(id, state) {
      this.list.forEach(item => {
        if (id === item.id) {
          if (item.status === 0) {
            this.$confirm('此操作会将发布此条问题发布到手机端', '是否继续', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              item.status = 1
              this.loading = true
              upAndDown(item).then(res => {
                this.loading = false
                if (res.data.success === true) {
                  this.$message({
                    type: 'success',
                    message: '发布成功'
                  })
                } else {
                  this.$message({
                    type: 'success',
                    message: res.data.message
                  })
                }
              })
            }).catch(() => {})
          } else {
            this.$confirm('此操作会将此条问题从手机端下架', '是否继续', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              item.status = 0
              this.loading = false
              upAndDown(item).then(res => {
                this.loading = true
                if (res.data.success === true) {
                  this.$message({
                    type: 'success',
                    message: '下架成功'
                  })
                } else {
                  this.$message({
                    type: 'success',
                    message: res.data.message
                  })
                }
              })
            }).catch(() => {})
          }
        }
      })
    },
    onSubmit() {
      if (this.form.answer === null || this.form.answer === undefined) {
        this.$message({
          type: 'warning',
          message: '请输入答案'
        })
        return
      }
      if (this.form.question === null || this.form.question === undefined) {
        this.$message({
          type: 'warning',
          message: '请输入问题'
        })
        return
      }
      if (this.form.defaultSort === null || this.form.defaultSort === undefined) {
        this.$message({
          type: 'warning',
          message: '请输入排序值'
        })
        return
      }
      this.loading = true
      addQa(this.form.question, this.form.answer, this.form.defaultSort).then(res => {
        this.loading = false
        if (res.data.success === true) {
          this.close()
          this.fetchData()
          this.$message({
            type: 'success',
            message: '添加成功'
          })
        } else {
          this.$message({
            type: 'info',
            message: res.data.message
          })
        }
      })
    },
    editOnSubmit() {
      if (this.form.answer === null || this.form.answer === undefined) {
        this.$message({
          type: 'warning',
          message: '请输入答案'
        })
        return
      }
      if (this.form.question === null || this.form.question === undefined) {
        this.$message({
          type: 'warning',
          message: '请输入问题'
        })
        return
      }
      if (this.form.defaultSort === null || this.form.defaultSort === undefined) {
        this.$message({
          type: 'warning',
          message: '请输入排序值'
        })
        return
      }
      edit(this.form).then(res => {
        if (res.data.success === true) {
          this.fetchData()
          this.close()
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
    },
    close() {
      this.Visible = false
      this.EditVisible = false
      this.form.id = null
      this.form.question = null
      this.form.defaultSort = null
      this.form.status = null
      this.form.answer = null
    },
    sortSubmit(id) {
      this.loading = false
      this.list.forEach(item => {
        if (item.id === id) {
          const obj = {
            id: id,
            sort: this.sort
          }
          qaSort(obj).then(res => {
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
  #sortInput  .el-input {
    cursor: pointer;
    border-color: #C0C4CC;
    width: 100%;
  }
</style>
