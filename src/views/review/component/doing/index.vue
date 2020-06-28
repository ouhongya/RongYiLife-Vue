<template>
  <div>
    <div style="padding-right:5px;text-align: center;">
      <el-card class="operate-container" shadow="never">
        <p style="float: left">
          <el-button type="primary" size="small" @click="reutentest">返回</el-button>
        </p>
        <p style="float: right">
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
        </p>
      </el-card>
    </div>
    <el-card class="cardTable">
      <el-table
        :data="list"
        style="width: 100%"
        empty-text="暂时还没有需要审核的商品，请稍后再来"
      >
        <el-table-column
          label="创建时间"
        >
          <template slot-scope="props">
            {{ props.row.createdTime| dateformat(`YYYY-MM-DD HH:mm`) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="url"
          label="群宣图"
        >
          <template slot-scope="props">
            <el-image
              style="width: 120px; height: 80px"
              :src="props.row.img"
              :preview-src-list="props.row.urlList"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="url"
          label="活动名称"
        >
          <template slot-scope="props">
            {{ props.row.name }}
          </template>
        </el-table-column>
        <el-table-column
          width="120px"
          prop="description"
          label="活动描述"
        >
          <template slot-scope="props">
            <el-tooltip class="item" effect="light" placement="top">
              <div slot="content" style="width: 200px">{{ props.row.description }}<br></div>
              <el-button v-if="props.row.description.length>=15" type="text" style="color: #5a5e66">{{ props.row.description.substr(0,15) }}......</el-button>
              <el-button v-if="props.row.description.length<15" type="text" style="color: #5a5e66">{{ props.row.description }}</el-button>
            </el-tooltip>
            <!--<p>品牌：{{scope.row.brandName}}</p>-->
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="location"
          label="活动地址"
        />
        <el-table-column
          align="center"
          label="活动报名时间"
        >
          <template slot-scope="props">
            <p>开始时间:&nbsp;{{ props.row.applyStartTime|dateformat(`YYYY-MM-DD HH:mm`) }}</p>
            <p>截止时间:&nbsp;{{ props.row.applyEndTime|dateformat(`YYYY-MM-DD HH:mm`) }}</p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="活动结束时间"
        >
          <template slot-scope="props">
            <p>开始时间:&nbsp;{{ props.row.startTime|dateformat(`YYYY-MM-DD HH:mm`) }}</p>
            <p>结束时间:&nbsp;{{ props.row.endTime|dateformat(`YYYY-MM-DD HH:mm`) }}</p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="活动参与人数"
        >
          <template slot-scope="props">
            <p>参与人数比例:&nbsp;{{ props.row.member-props.row.freeMember }}/{{ props.row.member }}</p>
            <!--<el-progress :status="props.row.state===`报名已结束` ? 'success':'exception' " :percentage="props.row.tage"></el-progress>-->
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
      </el-table>
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="size"
        layout="total, prev, pager, next"
        :total="total"
        style="text-align: center"
        @size-change="fetchData(`default`)"
        @current-change="fetchData(`default`)"
      />
    </el-card>
  </div>
</template>
<script>
import { fetchDataPage } from '@/api/reviewDoing'
export default {
  data() {
    return {
      loading: false,
      list: '',
      currentPage: 1,
      size: 7,
      total: 0,
      centerDialogVisible: false,
      operates: [
        {
          label: '全部活动',
          value: 'publishCom',
          field: 'default'
        },
        {
          label: '审核已通过的活动',
          value: 'publishOn',
          field: 'pass'
        },
        {
          label: '审核未通过的活动',
          value: 'publishOff',
          field: 'fail'
        }
      ],
      operateType: ''
    }
  },
  created() {
    this.$message.closeAll()
    this.operateType = 'default'
    this.fetchData('default')
  },
  methods: {
    fetchData(val) {
      this.loading = true
      if (val === undefined) {
        val = this.operateType
      }
      fetchDataPage(this.currentPage, this.size, val).then(res => {
        const newDate = new Date().getTime()
        this.list = res.data.queryResult.data.list
        this.list.forEach(item => {
          const arr = []
          arr.push(item.img)
          item.urlList = arr
        })
        this.list.forEach(item => {
          if (newDate < new Date(item.applyStartTime).getTime() && newDate < new Date(item.applyEndTime).getTime() && newDate < new Date(item.startTime).getTime() && newDate < new Date(item.startTime).getTime()) {
            item.nameState = '报名未开始'
          }
          if (newDate >= new Date(item.applyStartTime).getTime() && newDate <= new Date(item.applyEndTime).getTime() && newDate <= new Date(item.startTime).getTime() && newDate <= new Date(item.startTime).getTime()) {
            item.nameState = '报名进行中'
          }
          if (newDate >= new Date(item.applyStartTime).getTime() && newDate >= new Date(item.startTime).getTime() && newDate <= new Date(item.startTime).getTime() && newDate <= new Date(item.startTime).getTime()) {
            item.nameState = '报名已结束'
          }
          if (newDate > new Date(item.applyStartTime).getTime() && newDate > new Date(item.applyEndTime).getTime() && newDate < new Date(item.startTime).getTime() && newDate < new Date(item.startTime).getTime()) {
            item.nameState = '活动未开始'
          }
          if (newDate > new Date(item.applyStartTime).getTime() && newDate > new Date(item.applyEndTime).getTime() && newDate > new Date(item.startTime).getTime() && newDate < new Date(item.startTime).getTime()) {
            item.nameState = '活动进行中'
          }
          if (newDate > new Date(item.applyStartTime).getTime() && newDate > new Date(item.applyEndTime).getTime() && newDate > new Date(item.startTime).getTime() && newDate > new Date(item.startTime).getTime()) {
            item.nameState = '活动已结束'
          }
        })
        this.total = res.data.queryResult.data.total
      })
    },
    reutentest() {
      this.$router.push({ path: '/review/reviewdoing' })
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
  .cardTable{
    height: 875px;
  }
</style>
