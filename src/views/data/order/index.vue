<template>
  <div v-loading="loading"
       class="app-container"
       element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(50, 0, 0, 0.1)">
    <div class="app-container" align="center">
      <div class="address-layout">
        <el-row :gutter="20" >
          <el-col :span="6" class="col-div">
            <el-button class="layout-button" @click="self">
              <div class="out-border">
                <div class="layout-title">农夫集市</div>
                <div class="color-main address-content" :style="{background: (selfColor)}">
                  <div class="font-a">最近一周销售额:&nbsp;<ins v-text="selfMoney"/>&nbsp;元</div>
                </div>
              </div>
            </el-button>
          </el-col>
          <el-col :span="6" class="col-div">
            <el-button class="layout-button" @click="store" :style="{background: (storeColor)}">
              <div class="out-border">
                <div class="layout-title">周边商铺</div>
                <div class="color-main address-content">
                  <div class="font-a">最近一周销售额:&nbsp;<ins v-text="storeMoney"/>元</div>
                </div>
              </div>
            </el-button>
          </el-col>
          <el-col :span="6" class="col-div">
            <el-button class="layout-button" @click="grange" :style="{background: (grangeColor)}">
              <div class="out-border">
                <div class="layout-title">休闲农庄</div>
                <div class="color-main address-content">
                  <div class="font-a">最近一周销售额:&nbsp;<ins v-text="grangeMoney"/>元</div>
                </div>
              </div>
            </el-button>
          </el-col>
          <el-col :span="6" class="col-div">
            <el-button class="layout-button" @click="farm" :style="{background: (farmColor)}">
              <div class="out-border">
                <div class="layout-title">青蛙农场</div>
                <div class="color-main address-content">
                  <div class="font-a">最近一周销售额:&nbsp;<ins v-text="farmMoney"/>元</div>
                </div>
              </div>
            </el-button>
          </el-col>
        </el-row>
      </div>
      <el-drawer
        :title="title"
        style="font-size: 18px;font-weight: bolder;"
        :visible.sync="drawer"
        :before-close="drawerClose"
        :close-on-press-escape='false'
        direction="rtl"
        size="30%">
        <hr/>
        <el-row :gutter="10">
          <el-col :span="24" v-if="flag !== 4">
            <div class="drawer-div">
              <el-input
                placeholder="请输入内容"
                class="layout-input"
                v-model="search">
              </el-input>
            </div>
          </el-col>
          <el-col :span="24" style="min-height: 600px;padding-left: 20px;padding-right: 20px">
            <div class="RadioStyle">
              <div v-for="(val) in care">
                <input :id="val.id" :type="type" name="Storage" :value="val.id" @click="onsubmit(val.id,val.name)">
                <label :id="val.id" :for="val.id">{{ val.name }}</label>
              </div>
            </div>
          </el-col>
          <el-col :span="24" v-if="flag !== 4">
            <div class="drawer-pagination" align="center">
              <el-pagination

                :current-page.sync="currentPage"
                :page-size="size"
                layout="total, prev, pager, next"
                :total="total"
                style="text-align: center"
                @size-change="fetchData"
                @current-change="fetchData"
              />
            </div>
          </el-col>
        </el-row>
      </el-drawer>
    </div>
    <div class="app-container-col" v-if="id!==null">
      <el-row :gutter="20" style="background: #f5f5f5;padding: 10px;">
        <el-col :span="7">
          <div style="color: #909399;font-size: 18px;letter-spacing: 1px;background: #f5f5f5;padding-left: 100px">
            <div style="float: left">
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
        <el-col :span="10" style="padding-top: 16px">
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
        <el-col :span="7">
          <div v-if="orderNum!==0" style="padding-top: 16px">
            <el-button v-if="userData!==null" type="text"
                       style="font-size: 18px;height: 20px;padding: 0;margin-left:50%;margin-right: 30%" @click="details">
              查看订单
            </el-button>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div id="myChart" :style="{width: (`100%`),height: (`550px`)}"/>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import { findFarmAll, findGrangeAll, findStoreAll, finOrderById,createdInfo,fetchDataOrderMoneys} from '@/api/dataorder'

  export default {
    name: 'index',
    data() {
      return {
        drawer: false,
        title: null,
        care: null,
        search: null,
        currentPage: 1,
        size: 30,
        total: 0,
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
        flag: null,
        timeList: null,
        userCount: null,
        countListMoney: null,
        loading: false,
        id: null,
        day: null,
        orderNum: 0,
        orderMoney: 0,
        name: null,
        type:null,
        selfMoney:0,
        storeMoney:0,
        grangeMoney:0,
        farmMoney:0,
        focusCtrl:0,
        selfColor:null,
        storeColor:null,
        grangeColor:null,
        farmColor:null
      }
    },
    watch: {
      search: function(search) {
        if (search !== null) {
          if (this.flag === 1) {
            this.storeSearch()
          } else if (this.flag === 2) {
            this.farmSearch()
          } else if (this.flag === 3) {
            this.grangeSearch()
          } else if (this.flag === 4) {
            this.selfSearch()
          }
        }
      },
      userData: function(userData) {
        if (userData !== null) {
          this.day =null
          this.orderNum=0
          this.orderMoney=0
          this.loading = true
          const start = this.$moment(userData[0]).format(`YYYY-MM-DD`)
          const end = this.$moment(userData[1]).format(`YYYY-MM-DD`)
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
      if(this.$route.query.startTime!==undefined ){
        let startTime=this.$route.query.startTime
        let endTime=this.$route.query.endTime
        this.id=this.$route.query.id
        this.name=this.$route.query.name
        this.orderNum=this.$route.query.orderNum
        this.orderMoney=this.$route.query.orderMoney
        this.flag=this.$route.query.flag
        if (this.flag === 1) {
          this.storeColor=`#ecf5ff`
        } else if (this.flag === 2) {
          this.farmColor=`#ecf5ff`
        } else if (this.flag === 3) {
          this.grangeColor=`#ecf5ff`
        } else if (this.flag === 4) {
          this.selfColor=`#ecf5ff`
        }
        this.userData = [startTime,endTime ]
      }
      fetchDataOrderMoneys(this.getDay(-7),this.getDay(0)).then(res=>{
        if(res.data.success===true){
          let data = res.data.queryResult.data
            data.forEach(item=>{
              if(item.belongType===1){
                this.storeMoney=item.price
              }
              if(item.belongType===2){
                this.farmMoney=item.price
              }
              if(item.belongType===3){
                this.grangeMoney=item.price
              }
              if(item.belongType===4){
                this.selfMoney=item.price
              }
            })
        }
      })
    },
    methods: {
      self() {
        this.storeColor=null
        this.farmColor=null
        this.grangeColor=null
        this.selfColor=`#ecf5ff`
        this.selfSearch()
      },
      store() {
        this.storeColor=`#ecf5ff`
        this.grangeColor=null
        this.selfColor=null
        this.farmColor=null
        this.storeSearch()
      },
      grange() {
        this.storeColor=null
        this.grangeColor=`#ecf5ff`
        this.selfColor=null
        this.farmColor=null
        this.grangeSearch()
      },
      farm() {
        this.storeColor=null
        this.grangeColor=null
        this.selfColor=null
        this.farmColor=`#ecf5ff`
        this.farmSearch()
      },
      farmSearch() {
        let name = 'created_time'
        let order = 'asc'
        if (this.search === null) {
          this.search = ''
        }
        findFarmAll(this.currentPage, this.search, this.size, name, order).then(res => {
          if (res.data.success === true) {
            let data = res.data.queryResult.data
            this.total = data.total
            this.care = data.list
            this.flag = 2
            this.type='radio'
            this.drawer = true
            this.title = `农场列表`
          }
        })
      },
      grangeSearch() {
        let name = 'created_time'
        let order = 'asc'
        if (this.search === null) {
          this.search = ''
        }
        findGrangeAll(this.currentPage, this.search, this.size, name, order).then(res => {
          if (res.data.success === true) {
            let data = res.data.queryResult.data
            this.total = data.total
            this.care = data.list
            this.flag = 3
            this.drawer = true
            this.title = `农庄列表`
          }
        })
      },
      storeSearch() {
        let name = 'created_time'
        let order = 'asc'
        if (this.search === null) {
          this.search = ''
        }
        findStoreAll(this.currentPage, this.search, this.size, name, order).then(res => {
          if (res.data.success === true) {
            let data = res.data.queryResult.data
            this.total = data.total
            this.care = data.list
            this.flag = 1
            this.drawer = true
            this.title = `商铺列表`
          }
        })
      },
      selfSearch() {
        if (this.search === null) {
          this.search = ''
        }
        createdInfo().then(res => {
          if (res.data.success === true) {
            let data = res.data.queryResult.data
            let arr =[]
            data.forEach(item=>{
              let obj = {}
              obj.id=item.id
              obj.name=item.categoryName
              arr.push(obj)
            })
            this.care=arr
            this.flag = 4
            this.drawer = true
            this.title = `分类列表`
          }
        })
      },
      drawerClose() {
        this.title = null
        this.id=null
        this.currentPage=1
        this.total=0
        this.flag=null
        this.search=null
        this.drawer = false
        this.type=null
        this.care=[]
      },
      onsubmit(id, name) {
        this.day =null
        this.orderNum=0
        this.orderMoney=0
        this.id = id
        this.name = name
        const start = this.getDay(0)
        const end = this.getDay(-30)
        this.day = this.getDays(start, end)
        this.drawer = false
        this.type=null
        this.userData = [end, start]
      },
      fetchData() {
        if (this.flag === 1) {
          this.storeSearch()
        } else if (this.flag === 2) {
          this.farmSearch()
        } else if (this.flag === 3) {
          this.grangeSearch()
        } else if (this.flag === 4) {

        }
      },
      details() {
        this.$router.push(
          {
            name: 'orderList',
            query: {
              id: this.id,
              startTime: this.$moment(this.userData[0]).format(`YYYY-MM-DD`),
              endTime: this.$moment(this.userData[1]).format(`YYYY-MM-DD`),
              name:this.name,
              orderNum:this.orderNum,
              orderMoney:this.orderMoney,
              flag:this.flag
            }
          }
        )
      },
      getDay(day) {
        let today = new Date()
        let targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
        today.setTime(targetday_milliseconds) // 注意，这行是关键代码
        let tYear = today.getFullYear()
        let tMonth = today.getMonth()
        let tDate = today.getDate()
        tMonth = this.doHandleMonth(tMonth + 1)
        tDate = this.doHandleMonth(tDate)
        return tYear + '-' + tMonth + '-' + tDate
      },
      doHandleMonth(month) {
        let m = month
        if (month.toString().length == 1) {
          m = '0' + month
        }
        return m
      },
      getDays(date1, date2) {
        let date1Str = date1.split('-')// 将日期字符串分隔为数组,数组元素分别为年.月.日
        // 根据年 . 月 . 日的值创建Date对象
        let date1Obj = new Date(date1Str[0], (date1Str[1] - 1), date1Str[2])
        let date2Str = date2.split('-')
        let date2Obj = new Date(date2Str[0], (date2Str[1] - 1), date2Str[2])
        let t1 = date1Obj.getTime()
        let t2 = date2Obj.getTime()
        let dateTime = 1000 * 60 * 60 * 24 // 每一天的毫秒数
        let minusDays = Math.floor(((t2 - t1) / dateTime))// 计算出两个日期的天数差
        let days = Math.abs(minusDays)// 取绝对值
        return days
      },
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
                name: '订单',
                type: 'line',
                stack: '总量',
                data: _this.countList
              },
              {
                name: '金额',
                type: 'line',
                stack: '总量',
                data: _this.countListMoney
              }
            ]
          })
          window.addEventListener('resize', () => {
            myChart.resize()
          })
        }
    }
  }
</script>

<style scoped>
  .app-container {
    background: #eaeaea;
    margin-top: 10px;
    margin-left: 20px;
    margin-right: 20px;
  }

  .app-container-col {
    background: #eaeaea;
    margin-top: 10px;
    margin-left: 20px;
    margin-right: 20px;
  }

  .out-border {
    border-radius: 10px
  }

  .layout-title {
    color: #606266;
    padding: 15px 20px;
    font-size: 18px;
    background: #F2F6FC;
    font-weight: bold;
    border-radius: 10px 10px 0px 0px;
  }

  .color-main {
    color: #97a8be;
  }

  .address-content {
    border-radius: 10px;
    padding: 20px;
    font-size: 18px
  }

  .layout-button {
    padding: 0px;
    border-radius: 10px
  }

  .RadioStyle label {
    border: 1px solid #00a4ff;
    padding: 2px 10px 2px 5px;
    line-height: 28px;
    min-width: 80px;
    text-align: center;
    float: left;
    font-size: 14px;
    color: #999999;
    margin: 15px 0px 15px 20px;
    border-radius: 4px;
  }
  .RadioStyle input:checked + label {
    background: url(yes.svg) no-repeat right bottom;
    background-size: 21px 21px;
    color: #00a4ff
  }
  .drawer-div {
    padding: 10px;
  }

  .drawer-pagination {
    width: 100%;
  }

  .font-a {
    font-size: 16px;
  }

  .address-layout {

    height: 120px;
  }

  .col-div.el-col-6 {
    padding: 7px;
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
    margin-bottom: 10px;
    padding: 20px 20px 0;
  }

  .layout-input .el-input__inner {
    -webkit-appearance: none;
    background-color: #FFF;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 32px;
    line-height: 40px;
    outline: 0;
    padding: 0 15px;
    -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    width: 40%;
    margin-left: 30%;
    margin-right: 50%;
  }
</style>
