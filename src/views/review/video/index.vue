<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)"
    style="height: 950px"
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
      <p style="float: right">
        <el-button type="primary" size="small" @click="operation">一键审核</el-button>
        <el-button type="primary" size="small" @click="History">历史记录</el-button>
      </p>
    </el-card>
    <div class="table-container">
      <el-table
        ref="productTable"
        :data="list"
        style="width: 100%"
        empty-text="暂时还没有需要审核的视频，请稍后再来"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" label="id" />
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.createdTime | dateformat('YYYY-MM-DD HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column prop="title" label="视频标题" align="center" />
        <el-table-column prop="intros" label="简介" align="center" />
        <el-table-column prop="url" width="290px" label="视频连接" align="center" />
        <el-table-column prop="pass" label="点赞数" align="center" />
        <el-table-column prop="defaultSort" label="排序值" align="center" />
        <el-table-column label="状态" align="center">
          <template slot-scope="props">
            <p v-if="props.row.status===0" style="color: #f06a0a">未审核</p>
            <p v-if="props.row.status===1" style="color: #409EFF">已上架</p>
            <p v-if="props.row.status===3" style="color: #8c939d">已下架</p>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="250px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="reviewfarm(scope.row.id)"
            >通过
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)"
            >不通过
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="text-align: center">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="size"
        layout="total, prev, pager, next"
        :total="total"
        @size-change="fetchData"
        @current-change="fetchData"
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
import { fetchData, center, reviewVideo, operation } from '@/api/reviewVideo'
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
      id: ''
    }
  },
  created() {
    this.$message.closeAll()
    this.fetchData()
    if ('WebSocket' in window) {
      this.websocket = new WebSocket(this.GLOBAL.BASE_URL + this.GLOBAL.videoId)
      this.initWebSocket()
    }
  },
  destroyed() {
    this.websocket.close()
  },
  methods: {
    clone() {
      this.centerDialogVisible = false
      this.id = ''
      this.textarea2 = ''
    },
    fetchData() {
      this.loading = true
      fetchData().then(res => {
        this.loading = false
        const dataList = res.data.queryResult.data
        this.list = dataList.list
        this.total = dataList.total
      })
      this.loading = false
    },
    handleAddProduct() {
      this.$router.push({ path: 'farmAdd' })
    },
    handleDelete(id) {
      this.centerDialogVisible = true
      this.id = id
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
      user.passComment = this.textarea2
      user.ids = arr
      this.loading = true
      this.centerDialogVisible = false
      this.textarea2 = ''
      center(user).then(res => {
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
    reviewfarm(id) {
      const user = {}
      const arr = []
      arr.push(id)
      user.comment = ''
      user.ids = arr
      this.loading = true
      reviewVideo(user).then(res => {
        this.fetchData()
        this.loading = false
        if (res.data.success === true) {
          this.$message({
            type: 'success',
            message: res.data.message
          })
          this.fetchData()
        } else {
          this.$message({
            type: 'info',
            message: res.data.message
          })
          this.loading = false
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    operation() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请在左边勾选您要审核的视频,谢谢~'
        })
        return
      }
      this.$confirm('您确定要审核已选中的' + this.multipleSelection.length + '段视频吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const arr = []
        this.multipleSelection.forEach(value => { arr.push(value.id) })
        const user = {}
        user.comment = ''
        user.ids = arr
        this.loading = true
        operation(user).then(res => {
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
      })
    },
    History() {
      this.$router.push({ path: '/review/videoHistory' })
    },
    initWebSocket() {
      this.websocket.onmessage = this.soutMsg
    },
    soutMsg(e) {
      this.$message({
        type: 'success',
        message: '您有一条新消息,请及时处理'
      })
      this.fetchData()
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
