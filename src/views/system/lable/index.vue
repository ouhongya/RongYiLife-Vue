<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)"
    style="height:auto "
  >
    <span style="font-size: 18px;color: #8c939d;margin-left: auto">农场&nbsp;农庄&nbsp;自营&nbsp;标签</span>
    <el-card class="box-card">
      <el-button type="primary" size="medium" style="margin: 0px 0px 0px 48%" @click="addTo">添加</el-button>
      <el-table
        :data="list"
        height="303"
        style="width: 100%"
        :default-sort="{prop: 'createdTime', order: 'desc'}"
        @sort-change="fetchData"
      >
        <el-table-column
          prop="createdTime"
          label="日期"
          sortable
          align="center"
        >
          <template slot-scope="props">
            {{ props.row.createdTime | dateformat(`YYYY-MM-DD HH:mm`) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="标签"
        >
          <template slot-scope="props">
            <el-tag
              close-transition
            >{{ props.row.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="count"
          align="center"
          sortable
          label="绑定数"
        />
        <el-table-column
          prop="operator"
          align="center"
          label="操作人"
        />
        <el-table-column
          prop="tag"
          align="center"
          label="操作"
        >
          <template slot-scope="props">
            <el-button v-if="props.row.count===0" type="danger" size="medium" @click="deleteTag(props.row.id)">删除
            </el-button>
            <el-button v-if="props.row.count!==0" disabled type="danger" size="medium" @click="deleteTag(props.row.id)">
              删除
            </el-button>
            <el-button type="primary" size="medium" @click="updateTag(props.row.id)">修改</el-button>
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
    <span style="font-size: 18px;color: #8c939d;margin-left: auto">&nbsp;商铺&nbsp;标签</span>
    <el-card class="box-card">
      <el-button type="primary" size="medium" style="margin: 0px 0px 0px 48%" @click="addToshop">添加</el-button>
      <el-table
        :data="listShop"
        style="width: 100%"
        height="303"
        :default-sort="{prop: 'createdTime', order: 'desc'}"
        @sort-change="fetchDataShop"
      >
        <el-table-column
          prop="createdTime"
          label="日期"
          sortable
          align="center"
        >
          <template slot-scope="props">
            {{ props.row.createdTime | dateformat(`YYYY-MM-DD HH:mm`) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="标签"
        >
          <template slot-scope="props">
            <el-tag
              close-transition
            >{{ props.row.tagName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="bindingCount"
          align="center"
          label="绑定数"
        />
        <el-table-column
          prop="operator"
          align="center"
          sortable
          label="操作人"
        />
        <el-table-column
          prop="tag"
          align="center"
          label="操作"
        >
          <template slot-scope="props">
            <el-button v-if="props.row.bindingCount===0" type="danger" size="medium" @click="deleteTagShop(props.row.id)">删除</el-button>
            <el-button v-if="props.row.bindingCount!==0" disabled type="danger" size="medium" @click="deleteTagShop(props.row.id)">删除</el-button>
            <el-button type="primary" size="medium" @click="updateTagShop(props.row.id)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page.sync="currentPageShop"
        :page-size="sizeShop"
        layout="total, prev, pager, next"
        :total="totalShop"
        style="text-align: center"
        @size-change="fetchDataShop"
        @current-change="fetchDataShop"
      />
    </el-card>
    <el-dialog
    :title="id===1?'添加标签':'编辑标签'"
    :visible.sync="Visible"
    :close-on-click-modal="false"
    custom-class="customWidth"
    width="30%"
    :close-on-press-escape="false"
    :before-close="close"
    show-clos="false"
    style="text-align: center;">
    <el-form :model="tag" label-width="50px" style="width: 60%;margin:auto">
      <el-form-item label="名称:">
        <el-input v-model="tag.name" placeholder="请输入标签名" />
      </el-form-item>
    </el-form>
    <el-button type="primary" size="medium" @click="cancel">取消</el-button>
    <el-button type="primary" size="medium" @click="onSubmit">确认</el-button>
  </el-dialog>
    <el-dialog
      :title="idShop===1?'添加标签':'编辑标签'"
      :visible.sync="VisibleShop"
      :close-on-click-modal="false"
      custom-class="customWidth"
      width="30%"
      :close-on-press-escape="false"
      :before-close="close"
      show-clos="false"
      style="text-align: center;"
    >
      <el-form :model="tagShop" label-width="80px" style="width: 50%;margin: auto">
        <el-form-item label="名称:">
          <el-input v-model="tagShop.tagName" placeholder="请输入标签名" />
        </el-form-item>
      </el-form>
      <el-button type="primary" size="medium" @click="cancelShop">取消</el-button>
      <el-button type="primary" size="medium" @click="onSubmitShop">确认</el-button>
    </el-dialog>
  </div>
</template>
<script>
import * as qs from 'qs'
import { fetchData, addTag, deleteTag, updateTag, shopAddTag, shopDeleteTag, shopUpdateTag, shopFetchData } from '@/api/systemTag'
export default {
  data() {
    return {
      list: [],
      listShop: [],
      tag: {
        id: '',
        name: ''
      },
      tagShop: {
        id: '',
        tagName: ''
      },
      Visible: false,
      VisibleShop: false,
      id: 1,
      idShop: 1,
      currentPage: 1,
      size: 4,
      total: 0,
      currentPageShop: 1,
      sizeShop: 4,
      totalShop: 0,
      loading: false
    }
  },
  created() {
    this.$message.closeAll()
    this.fetchData()
    this.fetchDataShop()
  },
  methods: {
    fetchData(val) {
      let order = 'desc'
      let name = 'count'
      if (val !== undefined && val.prop === `created_time`) {
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
      this.loading = true
      fetchData(this.currentPage, this.size, name, order).then(res => {
        this.loading = false
        const dataList = res.data.queryResult.data
        this.total = dataList.total
        this.list = dataList.list
      })
    },
    addTo() {
      this.id = 1
      this.Visible = true
    },
    cancel() {
      this.Visible = false
      this.id = ``
      this.tag.id = ``
      this.tag.name = ``
    },
    onSubmit() {
      if (this.id === 1 || this.id === undefined) {
        if (this.tag.name === `` || this.tag.name === undefined) {
          this.$message({
            type: 'warning',
            message: '请输入名称'
          })
          return
        }
        this.loading = true
        addTag(this.tag.name).then(res => {
          this.loading = false
          this.close()
          this.fetchData()
          if (res.data.success === true) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
          }
          if (res.data.success !== true) {
            this.$message({
              type: 'info',
              message: res.data.message
            })
          }
        })
      }
      if (this.id !== 1) {
        if (this.tag.name === `` || this.tag.name === undefined) {
          this.$message({
            type: 'warning',
            message: '请输入名称'
          })
          return
        }
        this.loading = true
        updateTag(this.tag).then(res => {
          this.loading = false
          this.close()
          this.fetchData()
          if (res.data.success === true) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          }
          if (res.data.success !== true) {
            this.$message({
              type: 'info',
              message: res.data.message
            })
          }
        })
      }
    },
    updateTag(id) {
      this.id = id
      this.Visible = true
      this.list.forEach(item => {
        if (id === item.id) {
          this.tag.id = item.id
          this.tag.name = item.name
        }
      })
    },
    deleteTag(id) {
      this.$confirm('此操作将永久删除此标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteTag(id).then(res => {
          this.loading = false
          this.fetchData()
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
      }).catch(() => {})
    },
    fetchDataShop(val) {
      let order = 'desc'
      let name = 'name'
      if (val !== undefined && val.prop === `created_time`) {
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
      if (val !== undefined && val.prop === `name`) {
        if (val.order === undefined) {
          name = 'name'
          order = 'desc'
        }
        if (val.order === `descending`) {
          name = 'name'
          order = 'desc'
        }
        if (val.order === `ascending`) {
          name = 'name'
          order = 'asc'
        }
      }
      this.loading = true
      shopFetchData(this.currentPageShop, this.sizeShop, name, order).then(res => {
        this.loading = false
        const dataList = res.data.queryResult.data
        this.totalShop = dataList.total
        this.listShop = dataList.list
      })
    },
    addToshop() {
      this.idShop = 1
      this.VisibleShop = true
    },
    cancelShop() {
      this.VisibleShop = false
      this.idShop = ``
      this.tagShop.id = ``
      this.tagShop.tagName = ``
    },
    onSubmitShop() {
      if (this.idShop === 1 || this.idShop === undefined) {
        if (this.tagShop.tagName === `` || this.tagShop.tagName === undefined) {
          this.$message({
            type: 'warning',
            message: '请输入名称'
          })
          return
        }
        this.loading = true
        const arr = {
          name: this.tagShop.tagName
        }
        shopAddTag(qs.stringify(arr)).then(res => {
          this.loading = false
          this.close()
          this.fetchDataShop()
          if (res.data.success === true) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
          }
          if (res.data.success !== true) {
            this.$message({
              type: 'info',
              message: res.data.message
            })
          }
        })
      }
      if (this.idShop !== 1) {
        if (this.tagShop.tagName === `` || this.tagShop.tagName === undefined) {
          this.$message({
            type: 'warning',
            message: '请输入名称'
          })
          return
        }
        this.loading = true
        const arr = {
          id: this.tagShop.id,
          name: this.tagShop.tagName
        }
        shopUpdateTag(qs.stringify(arr)).then(res => {
          this.loading = false
          this.close()
          this.fetchDataShop()
          if (res.data.success === true) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          }
          if (res.data.success !== true) {
            this.$message({
              type: 'info',
              message: res.data.message
            })
          }
        })
      }
    },
    updateTagShop(id) {
      this.id = id
      this.VisibleShop = true
      this.listShop.forEach(item => {
        if (id === item.id) {
          this.tagShop.id = item.id
          this.tagShop.tagName = item.tagName
        }
      })
    },
    deleteTagShop(id) {
      this.$confirm('此操作将永久删除此标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        shopDeleteTag(id).then(res => {
          this.loading = false
          this.fetchDataShop()
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
      }).catch(() => {})
    },
    close() {
      this.Visible = false
      this.VisibleShop = false
      this.id = ``
      this.tag.id = ``
      this.tag.name = ``
      this.idShop = ``
      this.tagShop.id = ``
      this.tagShop.tagName = ``
    }
  }
}
</script>
<style lang="scss">
  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

</style>
