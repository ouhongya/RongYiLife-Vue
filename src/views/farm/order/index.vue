<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)"
    style="height: auto"
  >
    <div>
      <el-card class="filter-container" shadow="never">
        <div style="margin-top: 20px;">
          <el-form :inline="true" :model="listQuery" style="float: left;width: auto;margin: 0px" size="small" label-width="27%">
            <el-form-item label="订单编号:" label-width="80px">
              <el-input v-model="listQuery.search" style="width: 250px;margin: auto" placeholder="订单信息" />
              <el-button
                type="primary"
                size="small"
                @click="fetchDataSearch(undefined,listQuery.search,'',1);currentPage=1"
              >搜索
              </el-button>
            </el-form-item>
            <br>
            <el-form-item label="用户手机:" label-width="80px">
              <el-input v-model="listQuery.receiverKeyword" style="width: 250px;margin: auto" placeholder="请输入用户手机号码" />
              <el-button
                type="primary"
                size="small"
                @click="fetchDataReceiverKeyword(undefined,listQuery.receiverKeyword,'',2);currentPage=1"
              >搜索
              </el-button>
            </el-form-item>
          </el-form>
          <el-form :inline="true":model="listQuery" style="float: left;width: 650px;margin: 0px" size="small" label-width="27%">
            <el-form-item label="下单时间:" label-width="80px">
              <el-date-picker
                v-model="time"
                style="width: auto;margin: auto;"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions01"
              />
              <el-button
                type="primary"
                size="small"
                @click="fetchDataTime(undefined,date,'',3);currentPage=1;"
              >搜索
              </el-button>
            </el-form-item>
            <el-form-item label="支付时间:" label-width="80px">
              <el-date-picker
                v-model="PayTime"
                style="width: auto;margin: auto"
                disabled
                type="daterange"
                align="right"

                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions02"
              />
              <el-button
                type="primary"
                size="small"
                @click="fetchData(undefined,PayTimeDate,'',3)"
              >搜索
              </el-button>
            </el-form-item>
            <el-button
              style="margin-right: 10px"
              size="small"
              @click="handleResetSearch()"
            >
              重置
            </el-button>
          </el-form>
          <el-select v-model="status" class="input-width" placeholder="全部" style="width: auto;margin: auto;float: right" clearable>
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <!--<FONT style="color: #606266;font-size: 16px"><strong>排序规则：</strong></FONT>-->
        </div>
      </el-card>
      <div class="table-container">
        <el-table
          ref="orderTable"
          :data="list"
          empty-text="暂时还没有订单，请稍后再来"
          style="width: 100%;"
          @selection-change="handleSelectionChange"
        >
          <!--
                  <el-table-column type="selection"align="center"></el-table-column>
          -->
          <el-table-column label="订单号" prop="ordersNum" sortable width="300" align="center">
            <template slot-scope="scope">{{ scope.row.ordersNum }}</template>
          </el-table-column>
          <el-table-column label="下单时间" prop="createdTime" sortable align="center">
            <template slot-scope="scope">
              {{ scope.row.createdTime | dateformat('YYYY-MM-DD HH:mm') }}
            </template>
          </el-table-column>
          <el-table-column label="支付时间" sortable align="center">
            <template slot-scope="scope">
              {{scope.row.payTime|dateformat('YYYY-MM-DD HH:mm')}}
            </template>
          </el-table-column>
          <el-table-column label="运费" prop="freight" sortable align="center">
            <template slot-scope="scope">
              {{ scope.row.freight }}
            </template>
          </el-table-column>
          <el-table-column label="使用积分" prop="usedSorce" sortable align="center">
            <template slot-scope="scope">
              {{ scope.row.usedSorce }}
            </template>
          </el-table-column>
          <el-table-column label="积分兑换比例" prop="discountRate" sortable align="center">
            <template slot-scope="scope">
              {{ scope.row.discountRate }}
            </template>
          </el-table-column>
          <el-table-column label="支付金额" prop="realPlay" sortable align="center">
            <template slot-scope="scope">
              ￥{{ scope.row.realPlay }}
            </template>
          </el-table-column>
          <el-table-column label="订单状态" prop="stateName" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.state===1">已支付</p>
              <p v-if="scope.row.state===2">已发货</p>
              <p v-if="scope.row.state===3">交易完成</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300px" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleViewOrder(scope.row.id)"
              >查看订单</el-button>
              <el-button
                v-show="scope.row.state===3"
                size="mini"
                @click="handleCloseOrder(scope.$index, scope.row)"
              >关闭订单</el-button>
              <el-button
                v-show="scope.row.state===1"
                size="mini"
                @click="handleDeliveryOrder(scope.row.id)"
              >订单发货</el-button>
              <el-button
                v-show="scope.row.state===2"
                size="mini"
                @click="handleViewLogistics(scope.$index, scope.row)"
              >订单跟踪</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <el-dialog
          title="订单跟踪"
          :visible.sync="visible"
          :before-close="handleClose"
          width="40%"
        />
        <el-dialog
          title="订单跟踪"
          :visible.sync="centerDialogVisible"
          width="40%"
          :close-on-click-modal="false"
          :before-close="cancel"
          :close-on-press-escape="false"
          center
        >
          <el-steps
            direction="vertical"
            style="padding: 0px 0px 0px 120px"
            :active="6"
            finish-status="success"
            space="50px"
          >
            <el-step
              v-for="item in logisticsList"
              :key="item.name"
              :title="item.name"
              :description="item.time"
            />
          </el-steps>
          <span slot="footer" class="dialog-footer">
            <el-button size="medium" @click="centerDialogVisible=false">取 消</el-button>
            <el-button type="primary" size="medium" @click="centerDialogVisible=false">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <div style="text-align: center">
        <el-pagination
          :current-page.sync="currentPage"
          :page-size="size"
          layout="total, prev, pager, next"
          :total="total"
          type="primary"
          @size-change="fetchData()"
          @current-change="fetchData()"
        />
      </div>
    </div>
    <el-dialog
      title="请选择您要查看的农场订单"
      :visible.sync="permissionVisble"
      :close-on-click-modal="false"
      custom-class="customWidth"
      width="65%"
      :close-on-press-escape="false"
      :before-close="permissionClose"
      :show-close="false"
      style="text-align: center;"
    >
      <div style="overflow:scroll; width:100%; height:500px">
        <div class="RadioStyle">
          <div v-for="(val,index) in care" class="Block PaddingL">
            <input :id="val.id" type="radio" name="Storage" :value="val.id">
            <label :id="val.id" :for="val.id" @click="clickOnSubmit(id)">{{ val.name }}</label>
          </div>
        </div>
      </div>
      <div>
        <el-button type="primary" size="medium" @click="permissionClose()">取消</el-button>
        <el-button type="primary" size="medium" @click="permissionOnSubmit()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { fetchData, permissionFarm } from '@/api/farmOrder'
export default {
  data() {
    return {
      loading: false,
      visible: false,
      list: [],
      listQuery: {
        search: '',
        receiverKeyword: '',
        createTime: '',

        orderType: '',
        pageNum: ''
      },
      statusOptions: [
        { value: '0', label: '全部' },
        { value: '1', label: '已支付' },
        { value: '2', label: '已发货' },
        { value: '3', label: '交易成功' }
      ],
      currentPage: 1,
      size: 10,
      total: 0,
      logisticsList: '',
      centerDialogVisible: false,
      isInsider: ``,
      permissionVisble: false,
      care: [],
      permissionId: ``,
      fefresh: ``,
      time: '',
      PayTime: '',
      pickerOptions01: {
        shortcuts: [
          {
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
          }
        ]
      },
      pickerOptions02: {
        shortcuts: [
          {
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
          }
        ]
      },
      status: '1',
      date: '',
      PayTimeDate: '',
      flag: ''
    }
  },
  watch: {
    status: function(status) {
      this.currentPage = 1
      this.size = 10
      this.fetchDataState(undefined, undefined, status, 0)
    },
    time: function(time) {
      if (time !== null) {
        const dateOne = this.$moment(time[0]).format('YYYY-MM-DD')
        const dateTwo = this.$moment(time[1]).format('YYYY-MM-DD')
        this.date = dateOne + '/' + dateTwo
      }
    },
    PayTime: function(PayTime) {
      if (PayTime !== null) {
        const dateOne = this.$moment(PayTime[0]).format('YYYY-MM-DD')
        const dateTwo = this.$moment(PayTime[1]).format('YYYY-MM-DD')
        this.PayTimeDate = dateOne + '/' + dateTwo
      }
    }
  },
  created() {
    this.fetchDataState(undefined, null, '1', '0')
    if ('WebSocket' in window) {
      const user = window.localStorage.getItem('user')
      let companyId = ''
      if (window.localStorage.getItem('farm') !== null) {
        companyId = window.localStorage.getItem('farm')
      } else {
        companyId = user.substring(0, user.indexOf(','))
      }
      this.websocket = new WebSocket(this.GLOBAL.BASE_URL + companyId)
      this.initWebSocket()
    }
  },
  destroyed() {
    this.websocket.close()
  },
  methods: {
    /* permission(){
        let user = window.localStorage.getItem("user")
        let companyId = user.substring(0,user.indexOf(","))
        this.isInsider = user.substring(user.indexOf(",")+1,user.length)
        if(this.isInsider!==`0`){
          this.fetchData()
        }
        if(this.isInsider===`0`){
          permissionFarm().then(res=>{
            this.care=res.data.queryResult.data.list
          })
          this.permissionVisble=true;
        }
      },
      permissionOnSubmit(){
        this.loading=true
        findInfo(this.permissionId).then(res => {
          this.fefresh=1
          this.loading=false
          if(res.data.success===true) {
            this.user = res.data.queryResult.data
            let dataList = res.data.queryResult.data.account
            this.user.companyId = res.data.queryResult.data.account[0].companyId
            let name = ''
            for (let x = 0; x < dataList.length; x++) {
              name += (dataList[x].username + '_' + dataList[x].trueName + ',')
            }
            this.user.username = name.substring(name.length - 1, 0)
            this.user.shopId=dataList[0].companyId
          }else{
            this.$message({
              type:'info',
              message:res.data.message
            })
          }
        })
      },
      clickOnSubmit(id){
        this.permissionId=id
      },*/
    permissionClose() {
      this.permissionVisble = false
    },
    cancel() {},
    fetchData() {
      const order = 'desc'
      const name = 'created_time'
      const user = window.localStorage.getItem('user')
      let companyId = ''
      if (window.localStorage.getItem('farm') !== null) {
        companyId = window.localStorage.getItem('farm')
      } else {
        companyId = user.substring(0, user.indexOf(','))
      }
      if (this.flag === 'a') {
        fetchData(companyId, this.currentPage, '', this.size, name, order, this.status, 0).then(res => {
          this.loading = false
          const dataList = res.data.queryResult.data
          this.list = dataList.list
          this.total = dataList.total
        }).catch(err => {
          this.loading = false
          this.$message({
            type: 'info',
            message: '系统繁忙请稍后再试...'
          })
        })
      }
      if (this.flag === 'b') {
        fetchData(companyId, this.currentPage, this.listQuery.search, this.size, name, order, '', 1).then(res => {
          this.loading = false
          const dataList = res.data.queryResult.data
          this.list = dataList.list
          this.total = dataList.total
        }).catch(err => {
          this.loading = false
          this.$message({
            type: 'info',
            message: '系统繁忙请稍后再试...'
          })
        })
      }
      if (this.flag === 'c') {
        fetchData(companyId, this.currentPage, this.listQuery.receiverKeyword, this.size, name, order, '', 2).then(res => {
          this.loading = false
          const dataList = res.data.queryResult.data
          this.list = dataList.list
          this.total = dataList.total
        }).catch(err => {
          this.loading = false
          this.$message({
            type: 'info',
            message: '系统繁忙请稍后再试...'
          })
        })
      }
      if (this.flag === 'd') {
        fetchData(companyId, this.currentPage, this.date, this.size, name, order, '', 3).then(res => {
          this.loading = false
          const dataList = res.data.queryResult.data
          this.list = dataList.list
          this.total = dataList.total
        }).catch(err => {
          this.loading = false
          this.$message({
            type: 'info',
            message: '系统繁忙请稍后再试...'
          })
        })
      }
    },
    fetchDataState(val, search, status, num) {
      this.flag = 'a'
      const order = 'asc'
      const name = 'created_time'
      const user = window.localStorage.getItem('user')
      let companyId = ''
      if (window.localStorage.getItem('farm') !== null) {
        companyId = window.localStorage.getItem('farm')
      } else {
        companyId = user.substring(0, user.indexOf(','))
      }
      fetchData(companyId, this.currentPage, search, this.size, '', '', status, num).then(res => {
        this.loading = false
        const dataList = res.data.queryResult.data
        this.list = dataList.list
        this.list.forEach(item => {
          console.log(this.$moment(item.createdTime).format('YYYY-MM-DD hh:mm'), '时间')
        })
        this.total = dataList.total
      }).catch(err => {
        this.loading = false
        this.$message({
          type: 'info',
          message: '系统繁忙请稍后再试...'
        })
      })
    },
    fetchDataSearch(val, search, status, num) {
      this.flag = 'b'
      const order = 'desc'
      const name = 'created_time'
      const user = window.localStorage.getItem('user')
      let companyId = ''
      if (window.localStorage.getItem('farm') !== null) {
        companyId = window.localStorage.getItem('farm')
      } else {
        companyId = user.substring(0, user.indexOf(','))
      }
      fetchData(companyId, this.currentPage, search, this.size, name, order, status, num).then(res => {
        this.loading = false
        const dataList = res.data.queryResult.data
        this.list = dataList.list
        this.total = dataList.total
      }).catch(err => {
        this.loading = false
        this.$message({
          type: 'info',
          message: '系统繁忙请稍后再试...'
        })
      })
    },
    fetchDataReceiverKeyword(val, search, status, num) {
      this.flag = 'c'
      const order = 'desc'
      const name = 'created_time'
      const user = window.localStorage.getItem('user')
      let companyId = ''
      if (window.localStorage.getItem('farm') !== null) {
        companyId = window.localStorage.getItem('farm')
      } else {
        companyId = user.substring(0, user.indexOf(','))
      }
      fetchData(companyId, this.currentPage, search, this.size, name, order, status, num).then(res => {
        this.loading = false
        const dataList = res.data.queryResult.data
        this.list = dataList.list
        this.total = dataList.total
      }).catch(err => {
        this.loading = false
        this.$message({
          type: 'info',
          message: '系统繁忙请稍后再试...'
        })
      })
    },
    fetchDataTime(val, search, status, num) {
      this.flag = 'd'
      const order = 'desc'
      const name = 'created_time'
      const user = window.localStorage.getItem('user')
      let companyId = ''
      if (window.localStorage.getItem('farm') !== null) {
        companyId = window.localStorage.getItem('farm')
      } else {
        companyId = user.substring(0, user.indexOf(','))
      }
      fetchData(companyId, this.currentPage, search, this.size, name, order, status, num).then(res => {
        this.loading = false
        const dataList = res.data.queryResult.data
        this.list = dataList.list
        this.total = dataList.total
      }).catch(err => {
        this.loading = false
        this.$message({
          type: 'info',
          message: '系统繁忙请稍后再试...'
        })
      })
    },
    handleSelectionChange() {},
    handleSearchList() {},
    handleResetSearch() {
      this.listQuery = {}
      this.time = ''
    },
    handleViewLogistics() {
      this.centerDialogVisible = true
    },
    handleDeliveryOrder(id) {
      this.$router.push({ name: '农场订单发货', query: { id: id }})
    },
    handleViewOrder(id) {
      this.$router.push({ name: '农场订单详情', query: { id: id }})
    },
    handleClose() {},
    initWebSocket() {
      this.websocket.onmessage = this.soutMsg
    },
    soutMsg(e) {
      const data = JSON.parse(e.data)
      this.$message({
        type: 'success',
        message: '您有一条新订单,请及时处理'
      })
      this.fetchData()
    }
  }
}
</script>
<style  scoped>
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 18px;
    width: auto;
  }
  .el-range-editor--small.el-input__inner {
    height: 36px;
  }
</style>
