<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)"
    style="height: 919px"
  >
    <div id="tableTitle">
      <el-card class="box-card" style="padding: 5px">
        <FONT><strong style="float: left;color: #5a5e66">历史排行:</strong></FONT>
        <el-button style="float: right" type="primary" size="small" @click="addRanking">新建排行榜</el-button>
        <el-table
          :data="tableList"
          style="width: 100%"
        >
          <el-table-column
            prop="lasted_update_time"
            label="日期"
            align="center"
          >
            <template slot-scope="props">
              {{ props.row.lasted_update_time | dateformat(`YYYY-MM-DD HH:mm`) }}
            </template>
          </el-table-column>
          <el-table-column
            label="宣传图"
            align="center"
          >
            <template slot-scope="props">
              <el-image
                style="width: 150px; height: 72px"
                :src="props.row.url"
                :preview-src-list="props.row.list"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="state"
            label="状态"
            align="center"
          >
            <template slot-scope="props">
              <p v-if="props.row.status===1" style="color: #409EFF">展示中</p>
              <p v-if="props.row.status===0" style="color: #8c939d">已过期</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="operator"
            label="操作人"
            align="center"
          />
          <el-table-column
            label="操作"
            align="center"
          >
            <template slot-scope="props">
              <el-button type="primary" size="small" @click="lookRanking(props.row.id)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page.sync="currentPageTable"
          :page-size="sizeTable"
          layout="total, prev, pager, next"
          :total="totalTable"
          style="text-align: center"
          @size-change="fetchDataAll"
          @current-change="fetchDataAll"
        />
      </el-card>
    </div>
  </div>
</template>
<script>
import { fetchDataPage, fetchDataAll } from '@/api/welfareCompany'
export default {
  components: {},
  data() {
    return {
      tableList: [],
      list: [],
      dialogImageUrl: '',
      dialogVisible: false,
      currentPage: 1,
      size: 6,
      total: 0,
      currentPageTable: 1,
      sizeTable: 4,
      totalTable: 0,
      value: [],
      imageUrl: '',
      input: '',
      loading: false
    }
  },
  created() {
    this.fetchData()
    this.fetchDataAll()
  },
  methods: {
    fetchData(val) {
      let order = 'desc'
      if (val !== undefined) {
        if (val.order === undefined) {
          order = 'desc'
        }
        if (val.order === `descending`) {
          order = 'desc'
        }
        if (val.order === `ascending`) {
          order = 'asc'
        }
      }
      let start = ''
      let end = ''
      if (this.value === null) {
        start = ('2019-1-1 0:0:0')
        end = ('2050-1-1 0:0:0')
      }
      if (this.value.length === 0 && this.value !== null) {
        start = ('2019-1-1 0:0:0')
        end = ('2050-1-1 0:0:0')
      }
      if (this.value.length !== 0 && this.value !== undefined) {
        start = this.$moment(this.value[0]).format(`YYYY-MM-DD HH:mm:ss`)
        end = this.$moment(this.value[1]).format(`YYYY-MM-DD HH:mm:ss`)
      }
      const timeParam = {
        page: this.currentPage,
        size: this.size,
        sortByFiled: 'joinTime',
        sortByOrder: order,
        startTime: start,
        endTime: end
      }
      this.loading = true
      fetchDataPage(timeParam).then(res => {
        this.loading = false
        if (res.data.queryResult.data !== '') {
          const dataList = res.data.queryResult.data
          this.total = dataList.total
          this.list = dataList.list
        }
      })
    },
    close() {
      this.Visible = false
    },
    handleAvatarSuccess(res, file) {
      this.form.url = file.response.queryResult.data
    },
    fetchDataAll() {
      const order = 'desc'
      const name = 'lasted_update_time'
      fetchDataAll(this.currentPageTable, '', this.sizeTable, name, order).then(res => {
        const dataList = res.data.queryResult.data
        const array = []
        dataList.list.forEach(item => {
          if (item.status === 1) {
            array.push(item)
          }
        })
        dataList.list.forEach(item => {
          if (item.status !== 1) {
            array.push(item)
          }
        })
        array.forEach(val => {
          const arr = []
          arr.push(val.url)
          val.list = arr
        })
        console.log(dataList.array)
        this.tableList = array
        this.totalTable = dataList.total
      })
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.status === 1) {
        return 'warning-row'
      }
      return ''
    },
    handleRemove(file, fileList) {
      this.form.url = ''
    },
    handlePictureCardPreview(file) {
      this.dialogVisible = true
      this.url = file.url
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
    OnehandleAvatarSuccess(res, file) {
      this.form.oneUrl = file.response.queryResult.data
    },
    OnebeforeAvatarUpload(file) {
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
    twOhandleAvatarSuccess(res, file) {
      this.form.twoUrl = file.response.queryResult.data
    },
    twObeforeAvatarUpload(file) {
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
    threehandleAvatarSuccess(res, file) {
      this.form.threeUrl = file.response.queryResult.data
    },
    threebeforeAvatarUpload(file) {
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
    lookRanking(id) {
      this.$router.push({ name: 'company', query: { id: id }})
    },
    addRanking() {
      this.$router.push({ path: '/welfare/company' })
    }
  }
}
</script>
<style lang="scss">
  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
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
  .pickerClass{
    margin: 0px 0px 0px 40%;
  }
  #box-card{
    width: 70%;
    margin: 0px 0px 0px 18%;
  }

  .itemInput.el-input__inner {
    cursor: pointer;
    border-color: #C0C4CC;
    width: 200px;
  }
  .classUpload.el-upload-list__item {
    -webkit-transition: all .5s cubic-bezier(.55,0,.1,1);
    transition: all .5s cubic-bezier(.55,0,.1,1);
    font-size: 10px;
    color: #dc2a0c;
    line-height: 1.5;
    margin-top: 5px;
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-radius: 4px;
    width: 50%;
  }
  div.classUpload{
    width: 100%;
    height: 100%;
  }
  img.avatar {
    width: 100px;
    height: 100px;
    display: block;
    float: right;
  }
  .inputDiv.el-input {
    position: relative;
    font-size: 14px;
    display: inline-block;
    width: 35%;
  }
  i.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    float: right;
  }
  div.el-upload--picture-card {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100PX;
    height: 100px;
    margin: 0px 115px 0px 0px;
    line-height: 105px;
    vertical-align: top;
  }

  #tableTitle {
    position: relative;
    margin: 0 auto;
    width: 100%;
    height: 3px;
    background-color: #d4d4d4;
    text-align: center;
    font-size: 16px;
    color: rgba(101, 101, 101, 1);
    margin-top: 10px;
  }
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
