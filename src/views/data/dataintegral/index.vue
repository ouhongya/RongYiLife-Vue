<template>
  <el-card
    v-loading="loading"
    class="app-container"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)">
    <div class="statistics-layout">
      <div class="layout-title"> <el-divider direction="vertical" />文章信息</div>
      <el-row :gutter="20" style="padding: 10px">
        <el-col :span="8">
          <div style="color: #909399;font-size: 18px;float: left">最近<ins v-text="day"/>天共发布:&nbsp;&nbsp;<ins v-text="userCount"/>篇文章</div>
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
          <el-button v-if="userData!==null" type="text" style="font-size: 18px;padding: 0px;float: right" @click="details">查看文章</el-button >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div id="myChart" :style="{width: (`100%`),height: (`750px`)}" />
        </el-col>
      </el-row>
    </div>
    <el-dialog
      title="文章列表"
      :visible.sync="Visible"
      width="60%"
      :close-on-click-modal="false"
      :before-close="close"
      :close-on-press-escape="false"
      style="text-align: center"
    >
      <el-dialog
        title="文章详情"
        :visible.sync="childVisible"
        width="20%"
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
        <FONT><strong style="line-height: 20px;font-size: 15px;color: #676767;margin-top: 20px;letter-spacing: 1px"> {{
          form.title }}</strong></FONT>
        <br style="margin: 10px">
        <div style="font-size: 15px;color: #606266;background-image: none;border-radius: 4px;">{{ new Date()
          |dateformat('YYYY-MM-DD HH:mm') }}
        </div>
        <br>
        <div>
          <el-image
            style="width: 100%; height: 170px"
            :src="form.url"
          />
        </div>
        <div v-for="(item,index) in counter" :ket="index">
          <div style="font-size: inherit;color: #606266;background-image: none;border-radius: 4px;letter-spacing:2px">
            &nbsp;&nbsp;&nbsp;&nbsp;{{ item.count }}
          </div>
          <div v-if="item.fileList!==null">
            <el-image
              style="width: 100%; height: 170px"
              :src="item.fileList[0].url"
            />
          </div>
        </div>
      </el-dialog>
      <el-table
        v-loading="loadingTable"
        class="app-container"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(50, 0, 0, 0.1)"
        :data="list"
        height="530"
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
              trigger="click"
              :content="props.row.title ">
              <el-button slot="reference" type="text" style="color: rgb(90, 94, 102);">{{ props.row.title.substr(0,15)}}......
              </el-button>
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
          prop="sort"
          sortable
          label="排序值"
        >
          <template slot-scope="props">
            {{ props.row.sort }}
          </template>
        </el-table-column>
        <el-table-column
          prop="liked"
          align="center"
          label="点赞"
        >
          <template slot-scope="props">
            {{ props.row.liked }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="props">
            <el-button size="small" type="primary" @click="view(props.row.id)">查看</el-button>
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
  import {fetchData,pageData,getArticleId}from'@/api/dataintegral'
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
        childVisible: false,
        list: null,
        currentPage: 1,
        size: 4,
        total: 0,
        timeList: null,
        countList: null,
        userCount: null,
        day: null,
        loading: false,
        loadingUser: null,
        form: {
          title:null,
          url:null,
          fileList:[]
        },
        counter:[],
        loadingTable:false
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
          title: {},
          tooltip: {
            trigger: 'axis'
          },
          legend: {},
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
            name: '人数',
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
        window.addEventListener('resize', () => {
          myChart.resize()
        })
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
          var date1Str = date1.split('-')// 将日期字符串分隔为数组,数组元素分别为年.月.日
          // 根据年 . 月 . 日的值创建Date对象
          var date1Obj = new Date(date1Str[0], (date1Str[1] - 1), date1Str[2])
          var date2Str = date2.split('-')
          var date2Obj = new Date(date2Str[0], (date2Str[1] - 1), date2Str[2])
          var t1 = date1Obj.getTime()
          var t2 = date2Obj.getTime()
          var dateTime = 1000 * 60 * 60 * 24 // 每一天的毫秒数
          var minusDays = Math.floor(((t2 - t1) / dateTime))// 计算出两个日期的天数差
          var days = Math.abs(minusDays)// 取绝对值
          return days
        }
      },
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
        if (val !== undefined && val.prop === `sort`) {
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
      childClose() {
        this.childVisible = false
      },
      view(id) {
        this.childVisible = true
        getArticleId(id).then(res => {
          this.loading = false
          if (res.data.success === true) {
            function compare(property) {
              return function(a, b) {
                var value1 = a[property]
                var value2 = b[property]
                return value1 - value2// 升序,降序为value2 - value1
              }
            }
            const dataList = res.data.queryResult.data[0]
            this.form.title = dataList.title
            this.form.url = dataList.cover
            const obj = {}
            obj.url = dataList.cover
            obj.name = dataList.cover.substring(dataList.cover.indexOf('s/') + 2, dataList.cover.length)
            this.form.fileList.push(obj)
            const contents = dataList.contents.sort(compare('queue'))
            const arr = []
            contents.forEach((item, index) => {
              const obj = {}
              if (item.type === 1) {
                obj.count = item.content
                obj.fileList = null
              }
              if (item.type === 0) {
                obj.count = null
                const c = {}
                c.name = item.content.substring(item.content.indexOf('s/') + 2, item.content.length)
                c.url = item.content
                obj.fileList = []
                obj.fileList.push(c)
              }
              arr.push(obj)
            })

            for (let x = 0; x < arr.length; x++) {
              if (arr[x].fileList !== null) {
                const a = x - 1
                arr[a].count = arr[a].count
                arr[a].fileList = arr[x].fileList
              }
            }
            for (let i = 0; i < arr.length; ++i) {
              if (arr[i].count === null) {
                arr.splice(i--, 1)
              }
            }
            this.counter = arr
          }
        })
      }
    }
  }</script>
<style scoped>  .statistics-layout {
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
  background-color:#409EFF;
  margin: 0px 5px 2.5px 0px;
  width: 5px;
  position: relative;
}
</style>
<style></style>
