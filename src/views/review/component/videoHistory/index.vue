<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)"
    style="height: 919px"
  >
    <!--<el-card style=" margin-top: 20px;" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="handleSearchList()"
          type="primary"
          size="small">
          查询结果
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品货号：">
            <el-input style="width: 203px" v-model="listQuery.productSn" placeholder="商品货号"></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-cascader
              clearable
              v-model="selectProductCateValue"
              :options="productCateOptions">
            </el-cascader>
          </el-form-item>
          <el-form-item label="商品品牌：">
            <el-select v-model="listQuery.brandId" placeholder="请选择品牌" clearable>
              <el-option
                v-for="item in brandOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上架状态：">
            <el-select v-model="listQuery.publishStatus" placeholder="全部" clearable>
              <el-option
                v-for="item in publishStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select v-model="listQuery.verifyStatus" placeholder="全部" clearable>
              <el-option
                v-for="item in verifyStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>-->
    <el-card class="operate-container" shadow="never">
      <el-button type="primary" size="small" @click="operation">返回</el-button>
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
    </el-card>
    <div class="table-container">
      <el-table
        ref="productTable"
        :data="list"
        style="width: 100%"
      >
        <el-table-column label="审核时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.passTime | dateformat('YYYY-MM-DD HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column label="审核人" align="center">
          <template slot-scope="scope">
            <p style="color: #1482f0;">
              {{ scope.row.passOperator }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="创建人" align="center">
          <template slot-scope="scope">
            <p style="color: #1482f0;">
              {{ scope.row.operator }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- <html>{{scope.row.pass===1?'<i></i>':'审核未通过'}}</html>-->
            <p v-if="scope.row.pass===1" style="font-size: 40px">
              <svg-icon icon-class="pass" />
            </p>
            <p v-if="scope.row.pass===-1" style="font-size: 40px">
              <svg-icon icon-class="Fail" />
            </p>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            <p style="color: #1482f0">{{ scope.row.passComment|propData('暂无') }}</p>
          </template>
        </el-table-column><!--
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope">
            <img style="height: 80px" :src="scope.row.img">
          </template>
        </el-table-column>-->
        <el-table-column label="标题" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.title }}</p>
          </template>
        </el-table-column>
        <el-table-column label="简介" align="center">
          <template slot-scope="scope">
            {{ scope.row.intros }}
          </template>
        </el-table-column>
        <el-table-column label="视频连接" align="center">
          <template slot-scope="scope">
            {{ scope.row.url }}
          </template>
        </el-table-column>
        <el-table-column prop="likedNum" label="点赞数" align="center" />
        <el-table-column prop="defaultSort" label="排序值" align="center" />
      </el-table>
    </div>
    <div style="text-align: center">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="size"
        layout="total, prev, pager, next"
        :total="total"
        @size-change="fetchData()"
        @current-change="fetchData()"
      />
    </div>
  </div>
</template>
<script>
import { fetchDataPage } from '@/api/reviewVideo'
export default {
  data() {
    return {
      list: [],
      listQuery: {},
      loading: false,
      currentPage: 1,
      size: 4,
      total: 0,
      multipleSelection: [],
      idList: [],
      centerDialogVisible: false,
      textarea2: '',
      id: '',
      operates: [
        {
          label: '全部视频',
          value: 'publishCom',
          field: 'default'
        },
        {
          label: '审核已通过的视频',
          value: 'publishOn',
          field: 'pass'
        },
        {
          label: '审核未通过的视频',
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
    clone() {
      this.centerDialogVisible = false
      this.id = ''
      this.textarea2 = ''
    },
    fetchData(val) {
      this.loading = true
      if (val === undefined) {
        val = this.operateType
      }
      fetchDataPage(this.currentPage, this.size, val).then(res => {
        this.loading = false
        const dataList = res.data.queryResult.data
        const data = res.data.queryResult.data.list
        this.total = dataList.total
        this.list = data
      })
      this.loading = false
    },
    handleAddProduct() {
      this.$router.push({ path: 'farmAdd' })
    },
    center() {
      if (this.textarea2 === '' || this.textarea2 === undefined) {
        this.$message({
          type: 'info',
          message: '请输入您宝贵的意见'
        })
        return
      }
      const user = {}
      const arr = []
      arr.push(this.id)
      user.comment = this.textarea2
      user.ids = arr
      this.loading = true
      this.centerDialogVisible = false
      this.textarea2 = ''
      this.$axios.put(`/server/farmitem/check/fail`, user).then(res => {
        this.fetchData()
        this.loading = false
        if (res.data.success === true) {
          this.$message({
            type: 'success',
            message: res.data.message
          })
        } else {
          this.$message({
            type: 'info',
            message: res.data.message
          })
        }
      })
      this.loading = false
    },
    operation() {
      this.$router.push({ path: '/review/reviewvideo' })
    }
  }
}
</script>
<style>
  .el-dialog--center .el-dialog__body {
    text-align: initial;
    padding: 0px;
  }
  div.el-card__body {
    padding: 0px;
  }
</style>

<!--

-->
