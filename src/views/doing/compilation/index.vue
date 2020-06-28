<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)"
    style="height: auto"
  >
    <div style="padding-right:5px;text-align: center;">
      <el-input v-model="input" placeholder="请输入搜索内容" style="width: 300px" />
      <el-select
        v-model="operateType"
        style="float: right"
        placeholder="排序 "
        clearable
        @change="fetchData"
      >
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.field"
        />
      </el-select>
    </div>
    <el-card style="height:auto">
      <el-table
        :data="list"
        :default-sort="{prop: 'createdTime', order: 'desc'}"
        empty-text="暂时还没有活动，请稍后再来"
        style="width: 100%"
        @sort-change="fetchData"
      >
        <el-table-column
          width="140px"
          prop="createdTime"
          sortable
          align="center"
          label="创建时间"
        >
          <template slot-scope="props">
            {{ props.row.createdTime| dateformat(`YYYY-MM-DD HH:mm`) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="url"
          align="center"
          label="群宣图"
        >
          <template slot-scope="props">
            <el-image
              style="width: 120px; height: 90px"
              :src="props.row.img"
              :preview-src-list="props.row.urlList"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          sortable
          align="center"
          label="活动名称"
        >
          <template slot-scope="props">
            <el-tooltip class="item" effect="light" placement="top">
              <div slot="content" style="width: 200px">{{ props.row.name }}<br></div>
              <el-button type="text" style="color: #5a5e66">{{ props.row.name.substring(0,4) }}</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="活动描述"
        >
          <template slot-scope="props">
            <el-tooltip v-if="props.row.contents!==''" class="item" effect="light" placement="top">
              <div slot="content" style="width: 200px">{{ props.row.content }}<br></div>
              <el-button type="text" style="color: #5a5e66">{{ props.row.content.substring(0,4) }}</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="240px"
          label="发起单位"
        >
          <template slot-scope="props">
            <p>发起人:&nbsp;{{ props.row.publisher }}</p>
            <p>电话:&nbsp;{{ props.row.contactNum }}</p>
            <p>发起单位:&nbsp;{{ props.row.publisherUnit }}</p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="location"
          label="活动地址"
          width="280px"
        />
        <el-table-column
          align="center"
          width="195px"
          label="活动报名时间"
        >
          <template slot-scope="props">
            <p>开始时间:&nbsp;{{ props.row.applyStartTime|dateformat(`YYYY-MM-DD HH:mm`) }}</p>
            <p>截止时间:&nbsp;{{ props.row.applyEndTime|dateformat(`YYYY-MM-DD HH:mm`) }}</p>
          </template>
        </el-table-column>
        <el-table-column
          width="195px"
          align="center"
          label="活动开始时间"
        >
          <template slot-scope="props">
            <p>开始时间:&nbsp;{{ props.row.startTime|dateformat(`YYYY-MM-DD HH:mm`) }}</p>
            <p>结束时间:&nbsp;{{ props.row.endTime|dateformat(`YYYY-MM-DD HH:mm`) }}</p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="80px"
          label="参与人数"
        >
          <template slot-scope="props">
            <p>{{ props.row.member-props.row.freeMember }}/{{ props.row.member }}</p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="活动状态"
        >
          <template slot-scope="props">
            <p>{{ props.row.nameState }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="289px"
        >
          <template slot-scope="props">
            <el-button
              v-if="props.row.nameState==='报名未开始'"
              type="primary"
              size="medium"
              @click="lookUser(props.row.id,props.row.name)"
            >查看用户
            </el-button>
            <el-button
              v-if="props.row.nameState==='报名进行中'"
              type="primary"
              size="medium"
              @click="lookUser(props.row.id,props.row.name)"
            >查看用户
            </el-button>
            <el-button
              v-if="props.row.nameState==='活动进行中'"
              type="primary"
              size="medium"
              @click="lookUser(props.row.id,props.row.name)"
            >查看用户
            </el-button>
            <el-button
              v-if="props.row.nameState==='活动未开始'"
              type="primary"
              size="medium"
              @click="lookUser(props.row.id,props.row.name)"
            >查看用户
            </el-button>
            <el-button
              v-if="props.row.nameState==='活动已结束'"
              type="primary"
              size="medium"
              @click="lookUser(props.row.id,props.row.name)"
            >查看用户
            </el-button>

            <el-button v-if="props.row.nameState==='报名未开始'" type="primary" size="medium" @click="edit(props.row.id)">
              编辑
            </el-button>
            <el-button
              v-if="props.row.nameState==='报名进行中'"
              type="primary"
              size="medium"
              disabled
              @click="edit(props.row.id)"
            >编辑
            </el-button>
            <el-button
              v-if="props.row.nameState==='活动进行中'"
              type="primary"
              size="medium"
              disabled
              @click="edit(props.row.id)"
            >编辑
            </el-button>
            <el-button
              v-if="props.row.nameState==='活动未开始'"
              type="primary"
              size="medium"
              disabled
              @click="edit(props.row.id)"
            >编辑
            </el-button>
            <el-button
              v-if="props.row.nameState==='活动已结束'"
              type="primary"
              size="medium"
              disabled
              @click="edit(props.row.id)"
            >编辑
            </el-button>

            <el-button v-if="props.row.nameState==='报名未开始'" type="danger" size="medium" @click="test(props.row.id)">删除
            </el-button>
            <el-button
              v-if="props.row.nameState==='报名进行中'"
              type="danger"
              size="medium"
              disabled
              @click="test(props.row.id)"
            >删除
            </el-button>
            <el-button
              v-if="props.row.nameState==='活动未开始'"
              type="danger"
              size="medium"
              disabled
              @click="test(props.row.id)"
            >删除
            </el-button>
            <el-button
              v-if="props.row.nameState==='活动进行中'"
              type="danger"
              size="medium"
              disabled
              @click="test(props.row.id)"
            >删除
            </el-button>
            <el-button v-if="props.row.nameState==='活动已结束'" type="danger" size="medium" @click="test(props.row.id)">删除
            </el-button>
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
  </div>
</template>
<script>
import { updateDong, fetchData, deleteActivity } from '@/api/doingRomulgation'

export default {
  data() {
    return {
      list: [],
      currentPage: 1,
      size: 7,
      total: 0,
      formVisible: false,
      form: {
        id: '',
        name: '',
        description: '',
        img: '',
        startTime: '',
        endTime: '',
        member: '',
        applyStartTime: '',
        applyEndTime: '',
        location: ''
      },
      dialogVisible: false,
      input: '',
      operates: [
        {
          label: '全部活动',
          value: 'complex',
          field: 0
        },
        {
          label: '报名未开始',
          value: 'Sign',
          field: 1
        },
        {
          label: '报名进行中',
          value: 'processing',
          field: 2
        },
        {
          label: '活动未开始',
          value: 'hasnotstarted',
          field: 3
        },
        {
          label: '活动进行中',
          value: 'Activityinprogress',
          field: 4
        },
        {
          label: '活动已结束',
          value: 'Theeventisover',
          field: 5
        }
      ],
      operateType: 0,
      loading: false
    }
  },
  watch: {
    input: function(input) {
      if (input !== '' || input !== undefined) {
        this.fetchData()
      }
    }
  },
  created() {
    this.$message.closeAll()
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
      const newDate = new Date().getTime()
      this.sortByFiled = `name`
      this.sortByOrder = `desc`
      this.loading = true
      fetchData(this.operateType, this.currentPage, this.input, this.size, name, order).then(res => {
        this.loading = false
        const DataList = res.data.queryResult.data
        this.total = DataList.total
        DataList.list.forEach(item => {
          if (newDate < new Date(item.applyStartTime).getTime() && newDate < new Date(item.applyEndTime).getTime() && newDate < new Date(item.startTime).getTime() && newDate < new Date(item.endTime).getTime()) {
            item.nameState = '报名未开始'
          }
          if (newDate >= new Date(item.applyStartTime).getTime() && newDate <= new Date(item.applyEndTime).getTime() && newDate <= new Date(item.startTime).getTime() && newDate <= new Date(item.endTime).getTime()) {
            item.nameState = '报名进行中'
          }
          if (newDate > new Date(item.applyStartTime).getTime() && newDate > new Date(item.applyEndTime).getTime() && newDate < new Date(item.startTime).getTime() && newDate < new Date(item.endTime).getTime()) {
            item.nameState = '活动未开始'
          }
          if (newDate > new Date(item.applyStartTime).getTime() && newDate > new Date(item.applyEndTime).getTime() && newDate > new Date(item.startTime).getTime() && newDate < new Date(item.endTime).getTime()) {
            item.nameState = '活动进行中'
          }
          if (newDate > new Date(item.applyStartTime).getTime() && newDate > new Date(item.applyEndTime).getTime() && newDate > new Date(item.startTime).getTime() && newDate > new Date(item.endTime).getTime()) {
            item.nameState = '活动已结束'
          }
          item.imgs.forEach(val => {
            if (val.location === 0) {
              const arr = []
              item.img = val.url
              arr.push(val.url)
              item.urlList = arr
            }
          })
          let str = ''
          item.contents.forEach(key => {
            str += key.content + '_'
          })
          const arr = []
          arr.push(item.img)
          item.urlList = arr
          item.content = str.substring(0, str.length - 1)
        })
        this.list = DataList.list
      })
      this.loading = false
    },
    test(id) {
      this.$confirm('此操作将永久删除此活动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = false
        deleteActivity(id).then(res => {
          this.loading = true
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
      }).catch(() => {
      })
    },
    lookUser(id, name) {
      this.$router.push({ name: '活动用户查询', query: { id: id, name: name }})
    },
    edit(id) {
      this.$router.push({ name: 'editDoing', query: { id: id }})
    }
  }
}
</script>
<style lang="scss">
  .scaleProgress {
    transform: scaleY(0.75);
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
