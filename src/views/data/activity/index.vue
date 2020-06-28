<template>
  <el-card
    v-loading="loading"
    class="app-container"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)"
  >
    <div class="statistics-layout">
      <div class="layout-title"><el-divider direction="vertical" />活动信息</div>
      <el-row :gutter="20" style="padding: 10px">
        <el-col :span="8">
          <div style="color: #909399;font-size: 18px;float: left">最近<ins v-text="day"></ins>天共发布:&nbsp;&nbsp;<ins v-text="userCount"></ins>场活动</div>
        </el-col>
        <el-col :span="8">
          <div align="center">
            <el-date-picker
              v-model="userData"
              size="small"
              type="daterange"
              style="text-align: center;width: auto"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <el-button v-if="userData!==null" type="text" style="font-size: 18px;padding: 0px;float: right" @click="details">查看活动</el-button >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div id="myChart" :style="{width: (`100%`),height: (`750px`)}" />
        </el-col>
      </el-row>
    </div>
    <el-dialog
      title="活动列表"
      :visible.sync="Visible"
      width="70%"
      :close-on-click-modal="false"
      :before-close="close"
      :close-on-press-escape="false"
      style="text-align: center">
      <el-dialog
        title="用户列表"
        :visible.sync="childVisible"
        width="60%"
        style="text-align: center"
        :close-on-click-modal="false"
        :before-close="childClose"
        :close-on-press-escape="false"
        append-to-body
        v-loading="loadingUser"
        class="app-container"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(50, 0, 0, 0.1)"
      >
        <el-table
          :data="userList"
          height="540"
          style="width: 100%"
        >
          <el-table-column
            label="报名时间"
            align="center"
          >
            <template slot-scope="props">
              {{ props.row.applyTime|dateformat(`YYYY-MM-DD HH:mm`) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            align="center"
          />
          <el-table-column
            prop="phone"
            label="手机"
            align="center"
          />
          <el-table-column
            prop="activityName"
            label="参加的活动"
            align="center"
          />
        </el-table>
        <el-pagination
          :current-page.sync="currentPageUser"
          :page-size="sizeUser"
          layout="total, prev, pager, next"
          :total="totalUser"
          @size-change="fetchDataUser"
          @current-change="fetchDataUser"
        />
      </el-dialog>
      <el-table
        v-loading="loadingTable"
        :data="list"
        style="width: 100%"
        height="645"
        class="app-container"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(50, 0, 0, 0.1)"
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
              :src="props.row.cover"
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
            {{ props.row.name }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="活动描述"
        >
          <template slot-scope="props">
            <el-popover
              placement="top"
              width="200"
              trigger="hover"
              :content="props.row.description"
            >
              <el-button slot="reference" type="text" style="color: rgb(90, 94, 102);">{{ props.row.description.substring(0,10) }}</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="300px"
          label="发起单位"
        >
          <template slot-scope="props">
            <p>发起人:&nbsp;{{ props.row.publishPerson }}</p>
            <p>电话:&nbsp;{{ props.row.phone }}</p>
            <p>发起单位:&nbsp;{{ props.row.publishUnit }}</p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="参与人数"
        >
          <template slot-scope="props">
            <p>{{ props.row.joinNum }}</p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="props">
            <el-button size="small" type="primary" v-if=" props.row.joinNum===0" disabled @click="view(props.row.id)">查看</el-button>
            <el-button size="small" type="primary" v-if=" props.row.joinNum!==0"  @click="view(props.row.id)">查看</el-button>
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
    </el-dialog>
  </el-card>
</template>
<script>
import { fetchData, pageData,ActivityId} from '@/api/dataactivity'
export default {
  name: 'Index',
  data() {
    return {
      userData: null,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }],
        disabledDate: (time) => {
          const crDate = 24 * 60 * 60 * 1000
          const curDate = ((new Date()).getTime())
          const day = 183 * 24 * 60 * 60 * 1000
          const dateRegion = curDate - day
          return time.getTime() > Date.now() + crDate - 8.64e7 ||
            time.getTime() < dateRegion
        }
      },
      Visible: false,
      list: null,
      userList: null,
      currentPage: 1,
      size: 3,
      total: 0,
      currentPageUser: 1,
      sizeUser: 8,
      totalUser: 0,
      timeList: null,
      countList: null,
      userCount: null,
      day: null,
      loading: false,
      loadingTable: false,
      childVisible: false,
      loadingUser: false,
      userId:null
    }
  },
  watch: {
    userData: function(time) {
      if (time !== null) {
        const start = this.$moment(time[0]).format(`YYYY-MM-DD`)
        const end = this.$moment(time[1]).format(`YYYY-MM-DD`)
        this.fetchDataTime(end, start)
      }
    }
  },
  created() {
    function getDay(day) {
      var today = new Date()
      var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
      today.setTime(targetday_milliseconds) // 注意，这行是关键代码
      var tYear = today.getFullYear()
      var tMonth = today.getMonth()
      var tDate = today.getDate()
      tMonth = doHandleMonth(tMonth + 1)
      tDate = doHandleMonth(tDate)
      return tYear + '-' + tMonth + '-' + tDate
    }
    function doHandleMonth(month) {
      var m = month
      if (month.toString().length == 1) {
        m = '0' + month
      }
      return m
    }
    const start = getDay(0)
    const end = getDay(-30)
    this.userData = [end, start]
  },
  mounted() {
    function getDay(day) {
      var today = new Date()
      var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
      today.setTime(targetday_milliseconds) // 注意，这行是关键代码
      var tYear = today.getFullYear()
      var tMonth = today.getMonth()
      var tDate = today.getDate()
      tMonth = doHandleMonth(tMonth + 1)
      tDate = doHandleMonth(tDate)
      return tYear + '-' + tMonth + '-' + tDate
    }
    function doHandleMonth(month) {
      var m = month
      if (month.toString().length == 1) {
        m = '0' + month
      }
      return m
    }
  },
  methods: {
    drawLine() {
      const _this = this
      const myChart = this.$echarts.init(document.getElementById('myChart'))
      myChart.setOption({
        title: {
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          name: '日期',
          type: 'category',
          boundaryGap: false,
          data: _this.timeList
        },
        yAxis: {
          name: '场次',
          type: 'value'
        },
        series: [
          {
            type: 'line',
            stack: '总量',
            data: _this.countList
          }
        ]
      })
      window.addEventListener('resize', () => { myChart.resize() })
    },
    fetchDataTime(start, end) {
      this.loading = true
      fetchData(start + '', end + '').then(res => {
        this.loading = false
        if (res.data.success === true) {
          const data = res.data.queryResult.data.countList
          const time = []
          const count = []
          this.userCount = null
          data.forEach(item => {
            time.push(item.time)
            count.push(item.count)
            this.userCount += item.count
          })
          this.timeList = time
          this.countList = count
          this.drawLine()
        } else {
          this.$message({
            type: 'info',
            message: res.data.message
          })
        }
      }).catch(() => {
        this.loading = false
      })
      this.day = getDays(start, end)
      function getDays(date1, date2) {
        var date1Str = date1.split('-')
        var date1Obj = new Date(date1Str[0], (date1Str[1] - 1), date1Str[2])
        var date2Str = date2.split('-')
        var date2Obj = new Date(date2Str[0], (date2Str[1] - 1), date2Str[2])
        var t1 = date1Obj.getTime()
        var t2 = date2Obj.getTime()
        var dateTime = 1000 * 60 * 60 * 24
        var minusDays = Math.floor(((t2 - t1) / dateTime))
        var days = Math.abs(minusDays)
        return days
      }
    },
    fetchData(val) {
      let order = 'asc'
      let name = 'name'
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
      const start = this.$moment(this.userData[0]).format(`YYYY-MM-DD`)
      const end = this.$moment(this.userData[1]).format(`YYYY-MM-DD`)
      this.loadingTable = true
      pageData(end, this.currentPage, '', this.size, name, order, start).then(res => {
        this.loadingTable = false
        if (res.data.success === true) {
          const data = res.data.queryResult.data
          this.total = data.total
          this.list = data.list
        } else {
          this.$message({
            type: 'info',
            message: res.data.message
          })
        }
      })
    },
    details() {
      this.Visible = true
      this.fetchData()
    },
    close() {
      this.Visible = false
      this.currentPage=1
    },
    view(id) {
      this.userId = id
      this.currentPage = 1
      this.childVisible = true
      this.fetchDataUser(id)
    },
    fetchDataUser(id){
      let name = 'name'
      let sort = 'asc'
      this.loadingUser=true
      ActivityId(this.userId,this.currentPageUser,'',this.sizeUser,name,sort).then(res=>{
        this.loadingUser=false
        if(res.data.success===true){
          let data = res.data.queryResult.data
          this.userList=data.list
          this.totalUser =data.total
        }else{
          this.$message({
            type:'info',
            message:res.data.message
          })
        }
      })
    },
    childClose() {
      this.childVisible = false
      this.currentPageUser = 1
    }
  }
}</script>
<style scoped>
  .statistics-layout {
  margin-top: 20px;
  border: 1px solid #DCDFE6;
}

.un-handle-layout {
  margin-top: 20px;
  border: 1px solid #DCDFE6;
}

.layout-title {
  color: #606266;
  padding: 15px 20px;
  background: #F2F6FC;
  font-weight: bold;
}

.font-medium {
  font-size: 16px;
  color: #606266;
}
  .el-divider {
    background-color: #409EFF;
    margin: 0px 5px 2.5px 0px;
    width: 5px;
    position: relative;
  }
</style>
