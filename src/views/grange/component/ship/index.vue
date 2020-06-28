<template>
  <div
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)"
    style="height: 919px"
  >
    <div class="table-container">
      <el-table
        ref="deliverOrderTable"
        style="width: 100%;"
        :data="list"
        border
      >
        <el-table-column label="订单流水号" align="center">
          <template slot-scope="scope">{{ scope.row.ordersNum }}</template>
        </el-table-column>
        <el-table-column label="收货人" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="手机号码" align="center">
          <template slot-scope="scope">{{ scope.row.phone }}</template>
        </el-table-column>
        <!--<el-table-column label="邮政编码" width="160" align="center">
        <template slot-scope="scope">{{scope.row.receiverPostCode}}</template>
      </el-table-column>-->
        <el-table-column label="收货地址" align="center">
          <template slot-scope="scope">{{ scope.row.address }}</template>
        </el-table-column>
        <el-table-column label="配送方式" align="center">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.courier"
              placeholder="请选择物流公司"
              size="small"
            >
              <el-option
                v-for="item in companyOptions"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="物流单号" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.courierNum" size="small" />
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 15px;text-align: center">
        <el-button size="small" @click="cancel()">取消</el-button>
        <el-button type="primary" size="small" @click="onSubmit">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { findByIds, updateOrder } from '@/api/grangeOrder'
import * as qs from 'qs'
export default {
  data() {
    return {
      loading: false,
      list: [{ ordersNum: '', name: '', phone: '', address: '', courier: '', courierNum: '', zipCode: '' }],
      companyOptions: [],
      splitId: []
    }
  },
  created() {
    this.$message.closeAll()
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.splitId.push(this.$route.query.id)
      this.loading = true
      findByIds(this.splitId).then(res => {
        this.loading = false
        if (res.data.success === true) {
          const dataList = res.data.queryResult.data
          this.list = dataList.shopAddressResults
          this.companyOptions = dataList.couriers
        } else {
          this.$message({
            type: 'info',
            message: res.data.message
          })
        }
      })
    },
    onSubmit() {
      try {
        let index = 0
        this.list.forEach(item => {
          ++index
          if (item.courier === null) {
            this.$message({
              type: 'warning',
              message: '请选择第' + index + '条的配送方式'
            })
            throw new Error('return')
          }
          if (item.courierNum === null) {
            this.$message({
              type: 'warning',
              message: '请输入第' + index + '条的物流单号'
            })
            throw new Error('return')
          }
        })
      } catch {
        return
      }
      const delivers = []
      this.list.forEach(item => {
        const Delivers = {}
        Delivers.splitId = this.splitId + ''
        Delivers.shopAddressResult = item
        delivers.push(Delivers)
      })
      this.loading = true
      updateOrder(delivers).then(res => {
        this.loading = false
        if (res.data.success === true) {
          window.history.back()
          this.$message({
            type: 'success',
            message: '发货成功'
          })
        }
        if (res.data.success !== true) {
          this.$message({
            type: 'info',
            message: res.data.message
          })
        }
      })
    },
    cancel() {
      window.history.back()
    }
  }
}
</script>

<style scoped>

</style>
