<template>
  <div
    v-loading="loading"
    class="detail-container"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)"
  >
    <!--style="height: 919px"-->
    <el-card shadow="never" style=" margin-top: 15px">
      <div class="operate-container">
        <i v-if="DataList.state===1" class="el-icon-warning color-danger" style="margin-left: 20px" />
        <i v-if="DataList.state===2" class="el-icon-warning color-success" style="margin-left: 20px" />
        <i v-if="DataList.state===3" class="el-icon-warning color-success" style="margin-left: 20px" />
        <span v-if="DataList.state===1" class="color-danger">当前订单状态：{{ DataList.name }}</span>
        <span v-if="DataList.state===2" class="color-success">当前订单状态：{{ DataList.name }}</span>
        <span v-if="DataList.state===3" class="color-success">当前订单状态：{{ DataList.name }}</span>
        <div class="operate-button-container">
          <el-button size="small" type="primary" @click="returnOrder">返回</el-button>
        </div>
        <!--<div class="operate-button-container" v-show="order.status===1">
          <el-button size="mini" @click="showUpdateReceiverDialog">修改收货人信息</el-button>
          <el-button size="mini" @click="showMessageDialog">发送站内信</el-button>
          <el-button size="mini">取消订单</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
        <div class="operate-button-container" v-show="order.status===2||order.status===3">
          <el-button size="mini" @click="showLogisticsDialog">订单跟踪</el-button>
          <el-button size="mini" @click="showMessageDialog">发送站内信</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
        <div class="operate-button-container" v-show="order.status===4">
          <el-button size="mini" @click="handleDeleteOrder">删除订单</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>-->
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266" />
        <span class="font-small">基本信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="3" class="table-cell-title">下单时间</el-col>
          <el-col :span="3" class="table-cell-title">订单编号</el-col>
          <el-col :span="3" class="table-cell-title">物流单号</el-col>
          <el-col :span="3" class="table-cell-title">邮政编号</el-col>
          <el-col :span="3" class="table-cell-title">用户账号</el-col>
          <el-col :span="3" class="table-cell-title">支付方式</el-col>
          <el-col :span="3" class="table-cell-title">配送方式</el-col>
          <el-col :span="3" class="table-cell-title">买家留言</el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="table-cell">{{ DataList.sendUser.createdTimeStr | propData(DataList.sendUser.createdTimeStr) }}</el-col>
          <el-col :span="3" class="table-cell">{{ DataList.sendUser.orderNum | propData(DataList.sendUser.orderNum) }}</el-col>
          <el-col :span="3" class="table-cell">{{ DataList.sendUser.courierNum | propData(DataList.sendUser.courierNum) }}</el-col>
          <el-col :span="3" class="table-cell">{{ DataList.sendUser.zipCode | propData(DataList.sendUser.zipCode) }}</el-col>
          <el-col :span="3" class="table-cell">{{ DataList.sendUser.name }}</el-col>
          <el-col :span="3" class="table-cell">{{ DataList.sendUser.payWay===1?'支付宝':'微信' }}</el-col>
          <el-col :span="3" class="table-cell">{{ DataList.sendUser.courier | propData(DataList.sendUser.courier) }}</el-col>
          <el-col :span="3" class="table-cell">暂无</el-col>
        </el-row>
        <!-- <el-row>
        <el-col :span="4" class="table-cell-title">配送方式</el-col>
        <el-col :span="4" class="table-cell-title">物流单号</el-col>
        <el-col :span="4" class="table-cell-title">自动确认收货时间</el-col>
        <el-col :span="4" class="table-cell-title">订单可得优币</el-col>
        <el-col :span="4" class="table-cell-title">订单可得成长值</el-col>
        <el-col :span="4" class="table-cell-title">活动信息</el-col>
      </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">测试</el-col>
          <el-col :span="4" class="table-cell">测试</el-col>
          <el-col :span="4" class="table-cell">测试天</el-col>
          <el-col :span="4" class="table-cell">测试</el-col>
          <el-col :span="4" class="table-cell">测试</el-col>
          &lt;!&ndash;<el-col :span="4" class="table-cell">
            <el-popover
              placement="top-start"
              title="活动信息"
              width="200"
              trigger="hover"
              :content="order.promotionInfo">
              <span slot="reference">{{order.promotionInfo | formatLongText}}</span>
            </el-popover>
          </el-col>&ndash;&gt;
        </el-row>-->
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266" />
        <span class="font-small">收货人信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">收货人</el-col>
          <el-col :span="6" class="table-cell-title">手机号码</el-col>
          <el-col :span="6" class="table-cell-title">物流单号</el-col>
          <el-col :span="6" class="table-cell-title">收货地址</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">{{ DataList.shoppingAddress.name ==='' ? '暂无':DataList.shoppingAddress.name }}</el-col>
          <el-col :span="6" class="table-cell">{{ DataList.shoppingAddress.phone==='' ? '暂无':DataList.shoppingAddress.phone }}</el-col>
          <el-col :span="6" class="table-cell">{{ DataList.shoppingAddress.zipCode=== ''? '暂无':DataList.shoppingAddress.zipCode }}</el-col>
          <el-col :span="6" class="table-cell">{{ DataList.shoppingAddress.address==='' ? '暂无':DataList.shoppingAddress.address }}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266" />
        <span class="font-small">商品信息</span>
      </div>
      <el-table
        ref="orderItemTable"
        :data="DataList.ordersItems"
        border
        style="width: 100%;margin-top: 20px"
      >
        <el-table-column label="商品图片" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.productUrl" style="height: 80px">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.productName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格" align="center">
          <template slot-scope="scope">
            <p>￥{{ scope.row.price }}</p>
          </template>
        </el-table-column>
        <!--<el-table-column label="属性" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.productAttr | formatProductAttr}}
          </template>
        </el-table-column>-->
        <el-table-column label="数量" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.unit }}</p>
          </template>
        </el-table-column>
        <el-table-column label="小计" align="center">
          <template slot-scope="scope">
            <p>￥{{ scope.row.goodsPrice }}</p>
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right;margin: 20px">
        合计：<span class="color-danger">￥{{ DataList.totalMoney.goodsMoney }}</span>
      </div>
      <div style="margin-top: 60px">
        <svg-icon icon-class="marker" style="color: #606266" />
        <span class="font-small">费用信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">商品合计</el-col>
          <el-col :span="6" class="table-cell-title">运费</el-col>
          <el-col :span="6" class="table-cell-title">积分抵扣</el-col>
          <el-col :span="6" class="table-cell-title">应付款金额</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">￥{{ DataList.totalMoney.goodsMoney }}</el-col>
          <el-col :span="6" class="table-cell">￥{{ DataList.totalMoney.freight }}</el-col>
          <el-col :span="6" class="table-cell">￥{{ DataList.totalMoney.scoreMoney }}</el-col>
          <el-col :span="6" class="table-cell" style="color: #F56C6C">￥{{ DataList.totalMoney.realMoney }}</el-col>
        </el-row>
      </div>
      <!--<div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">操作信息</span>
      </div>
      <el-table style="margin-top: 20px;width: 100%"
                ref="orderHistoryTable"
                :data="order.historyList" border>
        <el-table-column label="操作者"  width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.operateMan}}
          </template>
        </el-table-column>
        <el-table-column label="操作时间"  width="160" align="center">
          <template slot-scope="scope">
            {{formatTime(scope.row.createTime)}}
          </template>
        </el-table-column>
        <el-table-column label="订单状态"  width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.orderStatus | formatStatus}}
          </template>
        </el-table-column>
        <el-table-column label="付款状态"  width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.orderStatus | formatPayStatus}}
          </template>
        </el-table-column>
        <el-table-column label="发货状态"  width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.orderStatus | formatDeliverStatus}}
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            {{scope.row.note}}
          </template>
        </el-table-column>
      </el-table>-->
    </el-card>
  </div>
</template>
<script>
import { fetchDataOrderAndId } from '@/api/farmOrder'
export default {
  data() {
    return {
      loading: false,
      DataList: ''
    }
  },
  created() {
    const id = this.$route.query.id
    this.loading = true
    fetchDataOrderAndId(id).then(res => {
      this.loading = false
      this.DataList = res.data.queryResult.data
      if (this.DataList.state === 1) {
        this.DataList.name = '已支付'
      }
      if (this.DataList.state === 2) {
        this.DataList.name = '已发货'
      }
      if (this.DataList.state === 3) {
        this.DataList.name = '交易成功'
      }
      console.log(this.DataList)
    }).catch(err => {
      this.loading = false
      this.$message({
        type: 'info',
        message: res.data.message
      })
    })
  },
  methods: {
    returnOrder() {
      window.history.back()
    }
  }
}
</script>
<style scoped>
  .font-small {
    font-size: 18px;
    color: #606266;
  }
  .color-danger {
    color: #F56C6C;
  }
  .detail-container {
    width: 80%;
    padding: 20px 20px 20px 20px;
    margin: 20px auto;
  }
  .operate-button-container {
    float: right;
    margin-right: 20px
  }
  .detail-container {
    width: 80%;
    padding: 20px 20px 20px 20px;
    margin: 20px auto;
  }

  .operate-container {
    background: #F2F6FC;
    height: 80px;
    margin: -20px -20px 0;
    line-height: 80px;
  }

  .operate-button-container {
    float: right;
    margin-right: 20px
  }

  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }

  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }
  .color-success{
    color: #0ff055;
  }
  .color-warning{
    color: ;
  }
</style>
