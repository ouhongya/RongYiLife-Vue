<template>
  <div
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)"
    style="height: 919px"
  >
    <div style="padding-right:5px;text-align: center;">
      <el-card class="operate-container" shadow="never">
        <p style="float: right">
          <el-button type="primary" size="small" @click="operation">一键审核</el-button>
          <el-button type="primary" size="small" @click="History">历史记录</el-button>
        </p>
      </el-card>
    </div>
    <el-card class="cardTable">
      <el-table
        :data="list"
        style="width: 100%"
        empty-text="暂时还没有需要审核的活动，请稍后再来"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" label="id" />
        <el-table-column
          width="140px"
          prop="createdTime"
          label="创建时间"
          align="center"
        >
          <template slot-scope="props">
            {{ props.row.createdTime| dateformat(`YYYY-MM-DD HH:mm`) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="url"
          label="群宣图"
          align="center"
        >
          <template slot-scope="props">
            <el-image
              style="width: 120px; height: 80px"
              :src="props.row.url"
              :preview-src-list="props.row.urlList"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="活动名称"
          align="center"
        >
          <template slot-scope="props">
            {{ props.row.name }}
          </template>
        </el-table-column>
        <el-table-column
          prop="url"
          label="活动描述"
          align="center"
        >
          <template slot-scope="props">
            <el-popover
              placement="top"
              width="400"
              trigger="hover"
              :content=" props.row.contents"
            >
              <el-button slot="reference" type="text" style="color: rgb(90, 94, 102);">{{ props.row.contents }}...</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="location"
          label="活动地址"
        />
        <el-table-column
          align="center"
          width="200px"
          label="活动报名时间"
        >
          <template slot-scope="props">
            <p>开始时间:&nbsp;{{ props.row.applyStartTime | dateformat(`YYYY-MM-DD HH:mm`) }}</p>
            <p>截止时间:&nbsp;{{ props.row.applyEndTime | dateformat(`YYYY-MM-DD HH:mm`) }}</p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="200px"
          label="活动结束时间"
        >
          <template slot-scope="props">
            <p>开始时间:&nbsp;{{ props.row.startTime|dateformat(`YYYY-MM-DD HH:mm`) }}</p>
            <p>结束时间:&nbsp;{{ props.row.endTime|dateformat(`YYYY-MM-DD HH:mm`) }}</p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="活动参与人数"
        >
          <template slot-scope="props">
            <p>参与人数比例:&nbsp;{{ props.row.freeMember-props.row.member }}/{{ props.row.member }}</p>
            <!--<el-progress :status="props.row.state===`报名已结束` ? 'success':'exception' " :percentage="props.row.tage"></el-progress>-->
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="活动状态"
        >
          <template slot-scope="props">
            <p>{{ props.row.nameState }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="250px"
          align="center"
        >
          <template slot-scope="props">
            <el-button type="primary" size="small" @click="eidt(props.row.id)">通过</el-button>
            <el-button type="danger" size="small" @click="test(props.row.id)">不通过</el-button>
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
    </el-card>
    <el-dialog
      title="请输入您的意见"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
      :close-on-click-modal="false"
      :before-close="close"
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
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="center()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { updateDong, fetchData, operation } from '@/api/reviewDoing'
export default {
  data() {
    return {
      loading: false,
      textarea2: '',
      list: [],
      multipleSelection: [],
      currentPage: 1,
      size: 10,
      total: 0,
      formVisible: false,
      form: {
        id: '',
        name: '',
        description: '',
        img: '',
        startTime: '',
        endTime: '',
        member: '',
        applyStartTime: '',
        applyEndTime: '',
        location: ''
      },
      centerDialogVisible: false,
      input: '',
      id: '',
      loading: false
    }
  },
  created() {
    this.$message.closeAll()
    this.fetchData()
    if ('WebSocket' in window) {
      this.websocket = new WebSocket(this.GLOBAL.BASE_URL + this.GLOBAL.welfareId)
      this.initWebSocket()
    }
  },
  destroyed() {
    this.websocket.close()
  },
  methods: {
    fetchData() {
      const sortByFiled = 'created_time'
      const sortByOrder = 'desc'
      this.loading = true
      fetchData(this.currentPage, this.size, this.input, sortByFiled, sortByOrder).then(res => {
        this.loading = false
        const newDate = new Date().getTime()
        const data = res.data.queryResult.data
        this.list = data.list
        this.list.forEach(item => {
          const arr = []
          arr.push(item.img)
          item.urlList = arr
        })
        data.list.forEach(item => {
          if (newDate < new Date(item.applyStartTime).getTime()) {
            item.nameState = '报名未开始'
          }
          if (newDate >= new Date(item.applyStartTime).getTime() && newDate <= new Date(item.applyEndTime).getTime()) {
            item.nameState = '报名进行中'
          }
          if (newDate >= new Date(item.applyStartTime).getTime() && newDate <= new Date(item.startTime).getTime()) {
            item.nameState = '报名已结束'
          }
          if (newDate <= new Date(item.startTime).getTime()) {
            item.nameState = '活动未开始'
          }
          if (newDate >= new Date(item.startTime).getTime() && newDate <= new Date(item.endTime).getTime()) {
            item.nameState = '活动进行中'
          }
          if (newDate > new Date(item.endTime).getTime()) {
            item.nameState = '活动已结束'
          }
          const arr = []
          arr.push(item.url)
          item.urlList = arr
        })
        this.total = data.total
      })
      this.loading = false
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
        this.multipleSelection.forEach(value => {
          arr.push(value.id)
        })
        const user = {}
        user.comment = ''
        user.ids = arr
        this.loading = true
        const operations = 'pass'
        this.loading = true
        operation(operations, user).then(res => {
          this.loading = false
          this.fetchData()
          this.loading = false
          if (res.data.success === true) {
            this.$message({
              type: 'success',
              message: '审核成功'
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
    eidt(id) {
      const arr = []
      arr.push(id)
      const user = {}
      user.ids = arr
      const operations = 'pass'
      this.loading = true
      operation(operations, user).then(res => {
        this.fetchData()
        this.loading = false
        if (res.data.success === true) {
          this.$message({
            type: 'success',
            message: '审核成功'
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
      user.ids = arr
      user.comment = this.textarea2
      const operations = 'fail'
      this.centerDialogVisible = false
      this.loading = true
      operation(operations, user).then(res => {
        this.loading = false
        this.fetchData()
        if (res.data.success === true) {
          this.$message({
            type: 'success',
            message: '操作成功'
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
    onSubmit() {
      this.loading = true
      updateDong(this.form).then(res => {
        this.fetchData()
        this.loading = false
        this.formVisible = false
        this.close()
        if (res.data.success === true) {
          this.$message({
            type: 'success',
            message: '更改成功'
          })
        }
        if (res.data.success !== true) {
          this.formVisible = false
          this.close()
          this.$message({
            type: 'info',
            message: res.data.message
          })
        }
      })
    },
    test(id) {
      this.id = id
      this.centerDialogVisible = true
    },
    handleAvatarSuccess(res, file) {
      this.form.img = res.queryResult.data
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    close() {
      this.centerDialogVisible = false
    },
    History() {
      this.$router.push({ path: '/review/reviewHistory' })
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
<style lang="scss">
  .scaleProgress {
    transform: scaleY(0.75);
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .cardTable{
    height: 875px;
  }
</style>
