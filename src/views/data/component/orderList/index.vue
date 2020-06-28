<template>
  <div>
    <div class="statistics-layout">
      <div class="layout-title" align="center">
        <el-row :gutter="10">
         <el-col :span="7">
           <div  style="float: left">
             <el-divider direction="vertical" />
             订单列表
           </div>
           </el-col>
         <el-col :span="10">当前位于:&nbsp;<ins v-text="name"/></el-col>
         <el-col :span="7">
           <el-button type="primary" size="mini" style="float: right" @click="returnOrder">返回</el-button>
         </el-col>
        </el-row>
      </div>
      <el-table
        ref="orderTable"
        :data="list"
        empty-text="暂时还没有订单，请稍后再来"
        style="width: 100%"
        @sort-change="fetchData"
      >
        <el-table-column label="订单号" prop="ordersNum" sortable width="300" align="center">
          <template slot-scope="scope">{{ scope.row.orderNum }}</template>
        </el-table-column>
        <el-table-column label="支付时间" sortable align="center">
          <template slot-scope="scope">
            {{scope.row.payTime}}
          </template>
        </el-table-column>
        <el-table-column label="运费" prop="freight" sortable align="center">
          <template slot-scope="scope">
            {{ scope.row.freight }}
          </template>
        </el-table-column>
        <el-table-column label="使用积分" prop="usedSorce" sortable align="center">
          <template slot-scope="scope">
            {{ scope.row.useScore }}
          </template>
        </el-table-column>
        <el-table-column label="支付金额" prop="realPlay" sortable align="center">
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
      title="订单详情"
      :visible.sync="centerDialogVisible"
      width="70%"
      :close-on-click-modal="false"
      :before-close="colse"
      :close-on-press-escape="false"
      center
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
  </div>
</template>

<script>
  import {OrderDetail,OrderDetailById} from '@/api/dataorder'
  export default {
    name: 'index',
    data(){
      return{
        startTime:null,
        endTime:null,
        id:null,
        name:null,
        orderNum:null,
        orderMoney:null,
        flag:null,
        currentPage:1,
        size:10,
        total:null,
        list:null,
        centerDialogVisible:null,
        orderDetail:null
      }
    },
    created() {
      this.getUrl()
    },
    methods:{
      getUrl(){
        this.startTime=this.$route.query.startTime
        this.endTime=this.$route.query.endTime
        this.id=this.$route.query.id
        this.name=this.$route.query.name
        this.orderNum=this.$route.query.orderNum
        this.orderMoney=this.$route.query.orderMoney
        this.flag=this.$route.query.flag
        this.fetchData()
      },
      fetchData(val){
        let name = 'orders_price'
        let order = 'asc'
        if (val !== undefined && val.prop === `orderNum`) {
          if (val.order === undefined) {
            name = 'order_num'
            order = 'desc'
          }
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
          if (val.order === undefined) {
            name = 'pay_time'
            order = 'desc'
          }
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
          if (val.order === undefined) {
            name = 'freight'
            order = 'desc'
          }
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
          if (val.order === undefined) {
            name = 'use_score'
            order = 'desc'
          }
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
          if (val.order === undefined) {
            name = 'orders_price'
            order = 'desc'
          }
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
            this.list=data.list
          }
        })
      },
      colse(){
        this.centerDialogVisible=false
        this.orderDetail=null
      },
      checkOrder(id){
        OrderDetailById(id).then(res=>{
          if(res.data.success===true){
            let data = res.data.queryResult.data
            this.orderDetail=data.list
            this.centerDialogVisible=true
          }
        })
      },
      returnOrder(){
        this.$router.push(
          {
            name: 'dataorder',
            query: {
              id: this.id,
              startTime: this.startTime,
              endTime: this.endTime,
              name:this.name,
              orderNum:this.orderNum,
              orderMoney:this.orderMoney,
              flag:this.flag
            }
          }
        )
      }
    }
  }
</script>

<style scoped>
  .statistics-layout {
    margin: 20px;
    border: 1px solid #DCDFE6;
  }
  .layout-title {
    color: #606266;
    padding: 15px 15px;
    font-size: 18px;
    background: #F2F6FC;
    font-weight: bold;
    border-radius: 10px 10px 0px 0px;
  }
</style>
