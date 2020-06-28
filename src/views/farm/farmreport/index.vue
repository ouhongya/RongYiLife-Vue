<template>
  <el-card
    v-loading="loading"
    class="app-container"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)"
  >
    <div class="statistics-layout">
      <div class="layout-title">
        <el-row :gutter="10">
          <el-col :span="7">
            <div>
              <el-divider direction="vertical"/>
              订单信息
            </div>
          </el-col>
          <el-col :span="17">
            <div style="margin-left: 25%">
              {{name}}
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="app-container-col">
        <el-row :gutter="20" style="background: #f5f5f5;padding: 10px;">
          <el-col :span="7">
            <div style="color: #909399;font-size: 18px;letter-spacing: 1px;background: #f5f5f5;">
              <div style="float: left;">
                <a v-text="name"/>最近:
                <ins v-text="day"/>
                天
              </div>
              <br/>
              <div style="float: left">订单数量:&nbsp;&nbsp;<ins v-text="orderNum"/>
                单
              </div>
              <br/>
              <div style="float: left">交易金额:&nbsp;&nbsp;<ins v-text="orderMoney"/>
                元
              </div>
            </div>
          </el-col>
          <el-col :span="10">
            <div align="center" style="padding-top: 14px">
              <el-date-picker
                v-model="userData"
                size="small"
                type="daterange"
                style="text-align: center;width: auto;"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
              />
            </div>
          </el-col>
          <el-col :span="7">
            <div v-if="orderNum!==0" style="padding-top: 18px">
              <el-button v-if="userData!==null" type="text"
                         style="font-size: 18px;height: 20px;padding: 0;float: right" @click="details">
                查看订单
              </el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="app-container-myChart">
        <el-row>
          <el-col :span="24">
            <div id="myChart" :style="{width: (`100%`),height: (`650px`)}"/>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog
      title="订单列表"
      :visible.sync="Visible"
      width="60%"
      :close-on-click-modal="false"
      :before-close="close"
      :close-on-press-escape="false"
      style="text-align: center"
    >
      <el-dialog
        title="订单详情"
        :visible.sync="childVisible"
        width="50%"
        style="text-align: center"
        :close-on-click-modal="false"
        :before-close="childClose"
        :close-on-press-escape="false"
        append-to-body
        class="app-container"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(50, 0, 0, 0.1)"
      >
        <el-table
          ref="deliverOrderTable"
          style="width: 100%;"
          :data="orderDetail"
        >
          <el-table-column label="商品名称" align="center">
            <template slot-scope="scope">{{scope.row.itemName}}</template>
          </el-table-column>
          <el-table-column label="商品图片" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.img" height="120" width="120"/>
            </template>
          </el-table-column>
          <el-table-column label="购买数量" align="center">
            <template slot-scope="scope">
              {{scope.row.quantity}}
            </template>
          </el-table-column>
          <el-table-column label="商品价格" align="center">
            <template slot-scope="scope">{{scope.row.itemPrice}}</template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <el-table
        ref="orderTable"
        :data="orderList"
        empty-text="暂时还没有订单，请稍后再来"
        style="width: 100%"
        @sort-change="fetchData"
      >
        <el-table-column label="订单号" prop="orderNum" sortable width="300" align="center">
          <template slot-scope="scope">{{ scope.row.orderNum}}</template>
        </el-table-column>
        <el-table-column label="支付时间" sortable prop="payTime" align="center">
          <template slot-scope="scope">
            {{scope.row.payTime}}
          </template>
        </el-table-column>
        <el-table-column label="运费" prop="freight" sortable align="center">
          <template slot-scope="scope">
            {{ scope.row.freight }}
          </template>
        </el-table-column>
        <el-table-column label="使用积分" prop="useScore" sortable align="center">
          <template slot-scope="scope">
            {{ scope.row.useScore }}
          </template>
        </el-table-column>
        <el-table-column label="支付金额" prop="ordersPrice" sortable align="center">
          <template slot-scope="scope">
            ￥{{ scope.row.ordersPrice }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="checkOrder(scope.row.id)">查看</el-button>
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
  import {finOrderById,OrderDetailById,pageData,OrderDetail} from '@/api/dataorder'
  export default {
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
        orderList: null,
        currentPage: 1,
        size: 8,
        total: 0,
        timeList: null,
        countList: null,
        countListMoney:null,
        userCount: null,
        day: null,
        loading: false,
        loadingTable: false,
        name: null,
        id:null,
        orderMoney:0,
        orderNum:0,
        endTime:null,
        startTime:null,
        childVisible:null,
        orderDetail:null
      }
    },
    watch: {
      userData: function(time) {
        if(time!==null){
          this.day =null
          this.orderNum=0
          this.orderMoney=0
          this.loading = true
          const start = this.$moment(time[0]).format(`YYYY-MM-DD`)
          const end = this.$moment(time[1]).format(`YYYY-MM-DD`)
          this.endTime=end
          this.startTime=start
          this.day = this.getDays(start, end)
          finOrderById(end, this.id, start).then(res => {
            this.loading = false
            if (res.data.success === true) {
              const data = res.data.queryResult.data.time
              const money = res.data.queryResult.data.money
              const time = []
              const count = []
              this.userCount = null
              data.forEach(item => {
                time.push(item.time)
                this.orderNum += item.count
                count.push(item.count)
                this.userCount += item.count
              })
              this.timeList = time
              this.countList = count
              const countMoney = []
              this.countListMoney = null
              money.forEach(item => {
                this.orderMoney += item.price
                countMoney.push(item.price)
              })
              this.countListMoney=countMoney
              this.drawLine()
            } else {
              this.$message({
                type: 'info',
                message: res.data.message
              })
            }
          })
        }
      }
    },
    created() {
      let name = window.localStorage.getItem('farmName')
      let id = window.localStorage.getItem('farm')
      if (name !== null) {
        this.name=name
      }
      if (id !== null) {
        this.id=id
      }else{
        this.id=window.localStorage.getItem('user').substring(0, window.localStorage.getItem('user').indexOf(','))
      }
      this.userData=[this.getDay(-7),this.getDay(0)]
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
            name: '数量/金额',
            type: 'value'
          },
          series: [
            {
              name: '金额',
              type: 'line',
              stack: '总量',
              data: _this.countListMoney
            },
            {
              name: '订单',
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
      fetchData(val){
        let name = 'orders_price'
        let order = 'asc'
        if (val !== undefined && val.prop === `orderNum`) {
          if (val.order === `descending`) {
            name = 'order_num'
            order = 'desc'
          }
          if (val.order === `ascending`) {
            name = 'order_num'
            order = 'asc'
          }
        }
        if (val !== undefined && val.prop === `payTime`) {
          if (val.order === `descending`) {
            name = 'pay_time'
            order = 'desc'
          }
          if (val.order === `ascending`) {
            name = 'pay_time'
            order = 'asc'
          }
        }
        if (val !== undefined && val.prop === `freight`) {
          if (val.order === `descending`) {
            name = 'freight'
            order = 'desc'
          }
          if (val.order === `ascending`) {
            name = 'freight'
            order = 'asc'
          }
        }
        if (val !== undefined && val.prop === `useScore`) {
          if (val.order === `descending`) {
            name = 'use_score'
            order = 'desc'
          }
          if (val.order === `ascending`) {
            name = 'use_score'
            order = 'asc'
          }
        }
        if (val !== undefined && val.prop === `ordersPrice`) {
          if (val.order === `descending`) {
            name = 'orders_price'
            order = 'desc'
          }
          if (val.order === `ascending`) {
            name = 'orders_price'
            order = 'asc'
          }
        }
        OrderDetail(this.endTime,this.id,this.currentPage,this.size,name,order,this.startTime).then(res=>{
          if(res.data.success===true){
            let data = res.data.queryResult.data
            this.total=data.total
            this.orderList=data.list
          }
        })
      },
      details() {
        this.Visible = true
        this.fetchData()
      },
      close() {
        this.currentPage = 1
        this.Visible = false
      },
      getDay(day) {
        var today = new Date()
        var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
        today.setTime(targetday_milliseconds) // 注意，这行是关键代码
        var tYear = today.getFullYear()
        var tMonth = today.getMonth()
        var tDate = today.getDate()
        tMonth = this.doHandleMonth(tMonth + 1)
        tDate = this.doHandleMonth(tDate)
        return tYear + '-' + tMonth + '-' + tDate
      },
      doHandleMonth(month) {
        var m = month
        if (month.toString().length == 1) {
          m = '0' + month
        }
        return m
      },
      getDays(date1, date2) {
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
      },
      checkOrder(id){
        OrderDetailById(id).then(res=>{
          if(res.data.success===true){
            let data = res.data.queryResult.data
            this.orderDetail=data.list
            this.childVisible=true
          }
        })
      },
      fetchDataUser(){},
      childClose() {
        this.childVisible = false
        this.currentPageUser = 1
      }
    }
  }</script>
<style scoped>
  .app-container-col {
    background: #f5f5f5;
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 10px;
  }
  .app-container-myChart {
    background: #f5f5f5;
    margin-top: 10px;
  }

  .statistics-layout {
    margin-top: 10px;
    border: 1px solid #DCDFE6;
  }

  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }

  .app-container {
    padding: 10px;
  }
</style>
<style>
  .el-drawer__header {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    color: #72767b;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    padding: 0px;
  }
</style>
