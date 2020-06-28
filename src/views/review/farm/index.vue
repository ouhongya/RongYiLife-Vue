<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)"
    style="height: 919px"
  >
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
        empty-text="暂时还没有需要审核的商品，请稍后再来"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" label="id" />
        <el-table-column label="创建时间" porp="createdTime" align="center">
          <template slot-scope="scope" align="center">
            {{ scope.row.createdTime | dateformat('YYYY-MM-DD HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column label="商品图片" align="center">
          <template slot-scope="scope">
            <el-image
              style="width: 120px; height: 120px"
              :src="scope.row.img"
              :preview-src-list="scope.row.url"
            />
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="name" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.name }}</p>
            <!--<p>品牌：{{scope.row.brandName}}</p>-->
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
        <el-table-column label="规格/价格" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.price }}/{{ scope.row.unit }}</p>
            <!--价格：￥-->
          </template>
        </el-table-column>
        <el-table-column label="分类" align="center">
          <template slot-scope="props">
            <p>{{ props.row.categoryId }}</p>
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
              type="primary"
              @click="handleUpdateProduct(scope.row.id,scope.row.pass)"
            >详情
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
    <!-- <div style="text-align: center">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="size"
        layout="total, prev, pager, next"
        :total="total"
        @size-change="fetchData"
        @current-change="fetchData"
      />
    </div>-->
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
import { fetchData, center, reviewfarm, operation } from '@/api/reviewFarm'
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
    this.fetchData()
    if ('WebSocket' in window) {
      console.log(this.GLOBAL.BASE_URL + this.GLOBAL.farmId, 'this.GLOBAL.BASE_URL +this.GLOBAL.farmId')
      this.websocket = new WebSocket(this.GLOBAL.BASE_URL + this.GLOBAL.farmId)
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
        dataList.forEach(item => {
          const arr = []
          item.img = item.imgUrls[0].url
          arr.push(item.imgUrls[0].url)
          item.url = arr
          item.price = item.spec.price
          item.unit = item.spec.unit
        })
        this.list = dataList
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
      user.comment = this.textarea2
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
    handleUpdateProduct(id, pass) {
      this.$router.push({ name: '农场商品详情', query: { id: id, state: pass }})
    },
    reviewfarm(id) {
      const user = {}
      const arr = []
      arr.push(id)
      user.comment = ''
      user.ids = arr
      this.loading = true
      reviewfarm(user).then(res => {
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
          message: '请在左边勾选您要审核的商品,谢谢~'
        })
        return
      }
      this.$confirm('您确定要审核已选中的' + this.multipleSelection.length + '件商品吗?', '提示', {
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
      this.$router.push({ path: '/review/farmHistory' })
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
