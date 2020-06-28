<template>
  <div>
    <el-card class="box-card">
      <el-button type="primary" size="small" style="margin: 0px 0px 0px 48%" @click="Visible=true">添加分类</el-button>
      <el-table
        :data="list"
        style="width: 100%"
        @sort-change="fetchData"
      >
        <!--:default-sort="{prop: 'createdTime', order: 'desc'}"
          @sort-change="fetchData"-->
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
          prop="tag"
          align="center"
          label="操作"
        >
          <template slot-scope="props">
            <el-button type="primary" size="medium" @click="updateTag(props.row.id)">修改</el-button>
            <el-button v-if="props.row.count===0" type="danger" size="medium" @click="deleteTag(props.row.id)">删除</el-button>
            <el-button v-if="props.row.count!==0" type="danger" disabled size="medium" @click="deleteTag(props.row.id)">删除</el-button>
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
      title="添加标签"
      :visible.sync="Visible"
      :close-on-click-modal="false"
      custom-class="customWidth"
      width="30%"
      :close-on-press-escape="false"
      :before-close="close"
      show-clos="false"
      style="text-align: center;"
    >
      <el-form :model="tag" label-width="80px" style="width: 50%">
        <el-form-item label="名称:">
          <el-input v-model="tag.name" placeholder="请输入标签名" />
        </el-form-item>
      </el-form>
      <el-button type="primary" size="small" @click="Visible=false;tag.name=null">取消</el-button>
      <el-button type="primary" size="small" @click="onSubmit">确认</el-button>
    </el-dialog>
    <el-dialog
      title="编辑标签"
      :visible.sync="editVisible"
      :close-on-click-modal="false"
      custom-class="customWidth"
      width="30%"
      :close-on-press-escape="false"
      :before-close="close"
      show-clos="false"
      style="text-align: center;"
    >
      <el-form :model="tag" label-width="80px" style="width: 50%">
        <el-form-item label="名称:">
          <el-input v-model="tag.name" placeholder="请输入标签名" />
        </el-form-item>
      </el-form>
      <el-button type="primary" size="small" @click="editVisible=false;tag.name=null">取消</el-button>
      <el-button type="primary" size="small" @click="editSubmit">确认</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { fetchDataLadle, addMadeAndLabel, updateMadeAndLadle, deleteMadeAndLadle } from '@/api/made.js'
export default {
  data() {
    return {
      list: null,
      currentPage: 1,
      size: 10,
      total: 0,
      Visible: false,
      editVisible: false,
      tag: {
        id: null,
        name: null
      }
    }
  },
  created() {
    this.$message.closeAll()
    this.fetchData()
  },
  methods: {
    fetchData(val) {
      let name = `created_time`
      let order = `desc`
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
      if (val !== undefined && val.prop === `address`) {
        if (val.order === undefined) {
          name = 'address'
          order = 'desc'
        }
        if (val.order === `descending`) {
          name = 'address'
          order = 'desc'
        }
        if (val.order === `ascending`) {
          name = 'address'
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
      fetchDataLadle(this.currentPage, null, this.size, name, order).then(res => {
        if (res.data.success === true) {
          const data = res.data.queryResult.data
          this.list = data.list
          this.total = data.total
        }
      })
    },
    onSubmit() {
      if (this.tag.name === null || this.tag.name === '') {
        this.$message({
          type: 'warning',
          message: '请输入名称'
        })
        return
      }
      addMadeAndLabel(this.tag).then(res => {
        if (res.data.success === true) {
          this.fetchData()
          this.close()
          this.$message({
            type: 'success',
            message: '添加成功'
          })
        } else {
          this.$message({
            type: 'success',
            message: res.data.message
          })
        }
      })
    },
    editSubmit() {
      if (this.tag.name === null || this.tag.name === '') {
        this.$message({
          type: 'warning',
          message: '请输入名称'
        })
        return
      }
      updateMadeAndLadle(this.tag).then(res => {
        if (res.data.success === true) {
          this.fetchData()
          this.close()
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        } else {
          this.$message({
            type: 'success',
            message: res.data.message
          })
        }
      })
    },
    updateTag(id) {
      this.editVisible = true
      this.list.forEach(item => {
        if (item.id === id) {
          this.tag.name = item.name
          this.tag.id = item.id
        }
      })
    },
    deleteTag(id) {
      this.$confirm('您确定要删除此标签的吗', '是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMadeAndLadle(id).then(res => {
          if (res.data.success === true) {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          } else {
            this.$message({
              type: 'success',
              message: res.data.message
            })
          }
        })
      }).catch(() => {})
    },
    close() {
      this.Visible = false
      this.editVisible = false
      this.tag.id = null
      this.tag.name = null
    }
  }
}
</script>

<style scoped>

</style>
