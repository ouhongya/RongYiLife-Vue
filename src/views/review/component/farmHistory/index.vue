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
      <el-button type="primary" size="medium" @click="operation">返回</el-button>
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
            <p style="color: #1482f0">{{ scope.row.passComment | propData('暂无') }}</p>
          </template>
        </el-table-column><!--
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope">
            <img style="height: 80px" :src="scope.row.img">
          </template>
        </el-table-column>-->
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.name }}</p>
          </template>
        </el-table-column>
        <el-table-column label="商品描述" align="center">
          <template slot-scope="scope">
            <el-popover
              placement="top"
              width="400"
              trigger="hover"
              :content=" scope.row.description "
            >
              <el-button slot="reference" type="text" style="color: rgb(90, 94, 102);">{{ scope.row.description.substr(0,15) }}...</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <!--
        <el-table-column label="规格/价格" width="120" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.unit}}/{{scope.row.price}}元</p>
            &lt;!&ndash;价格：￥&ndash;&gt;
          </template>
        </el-table-column>--><!--
        <el-table-column label="分类" width="140" align="center">
          <template slot-scope="props">
            <p>{{props.row.categoryId}}</p>
          </template>
        </el-table-column>-->
        <!--<el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <p>
              <el-button
                size="mini"
                type="primary"
                @click="handleUpdateProduct(scope.row.id,scope.row.pass)">详情
              </el-button>
            </p>
          </template>
        </el-table-column>
        -->
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
    <el-dialog
      title="请输入您的意见"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
      :close-on-click-modal="false"
      :before-close="clone"
      :close-on-press-escape="false"
    >
      <span slot="footer" class="dialog-footer">
        <el-input
          v-model="textarea2"
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          style="padding: 15px 15px"
        />
        <el-button @click="clone">取 消</el-button>
        <el-button type="primary" @click="center()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { fetchDataPage } from '@/api/reviewFarm'
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
          label: '全部商品',
          value: 'publishCom',
          field: 'default'
        },
        {
          label: '审核已通过的商品',
          value: 'publishOn',
          field: 'pass'
        },
        {
          label: '审核未通过的商品',
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
    /* handleSelectionChange(val) {
        this.multipleSelection=val
      },
      operation(){
        if (this.multipleSelection.length===0){
          this.$message({
            type:'warning',
            message:"请在左边勾选您要审核的商品,谢谢~"
          })
          return
        }
        this.$confirm('您确定要审核已选中的'+this.multipleSelection.length+'件商品吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let arr =[]
          this.multipleSelection.forEach(value=>{arr.push(value.id)})
          let user ={}
          user.comment=''
          user.ids=arr
          this.loading=true
          this.$axios.put(`/server/farmitem/check/pass`,user).then(res=>{
            this.fetchData()
            this.loading=false
            if(res.data.success===true){
              this.$message({
                type:'success',
                message:res.data.message
              })
            }else{
              this.$message({
                type:'info',
                message:res.data.message
              })
            }
          })
          this.loading=false
        })
      },*/
    operation() {
      this.$router.push({ path: '/review/reviewfarm' })
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
