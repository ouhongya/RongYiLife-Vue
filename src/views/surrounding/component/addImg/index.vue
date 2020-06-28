<template>
  <div align="center">
    <el-card class="box-card" style="width: 50%">
      <el-upload
        id="upload1"
        ref="upload"
        class="avatar-uploader"
        :action="url"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :file-list="fileList"
        :on-success="handleAvatarSuccess"
        :limit="10"
        :before-remove="removeUrl"
        :on-remove="handleRemove"
        :before-upload="handleBeforeUploads"
      >
        <i class="el-icon-plus avatar-uploader-icon" />
      </el-upload>
      <i v-if="dialogImageUrl.length===10">已经有10张图片了,不能再上传了哦</i>
      <el-dialog :visible.sync="dialogVisible" size="tiny">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
      <i class="el-icon-warning" style="font-size: 14px;color: #8c939d">请上传1-10张750*360 分辨率的png、jpg、jpeg图，单张图的容量不超过20MB，作为周边商铺的展示图。（将在手机端周边商铺详情页的顶端滚动展示）
      </i>
    </el-card>
    <el-button type="primary" size="medium" @click="confirm()">返回</el-button>
  </div>
</template>
<script>
import { deleteUrl, getUrl } from '@/api/shop'
export default {
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      urlList: [],
      fileList: [],
      state: true,
      url: '',
      list: []
    }
  },
  created() {
    this.$message.closeAll()
    const id = window.localStorage.getItem('store')
    if (id !== null) {
      this.url = '/server/store/album/banner/add/' + id + '/'
      getUrl(id).then(res => {
        const data = res.data.queryResult.data
        this.list = data
        data.forEach(item => {
          if (item.isCover !== 1) {
            const obj = {}
            obj.url = item.url
            obj.name = item.name
            this.fileList.push(obj)
          }
        })
      })
    } else {
      this.url = '/server/store/album/banner/add/' + window.localStorage.getItem('user').substring(0, window.localStorage.getItem('user').indexOf(',')) + '/'
      getUrl(id).then(res => {
        const data = res.data.queryResult.data
        this.list = data
        data.forEach(item => {
          if (item.isCover !== 1) {
            const obj = {}
            obj.url = item.url
            obj.name = item.name
            this.fileList.push(obj)
          }
        })
      })
    }
  },
  methods: {
    handleRemove(file, fileList) {
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleAvatarSuccess(res, file) {
      if (res.success === true) {
        this.$message({
          type: 'success',
          message: '上传成功'
        })
      } else {
        this.$message({
          type: 'info',
          message: '服务器繁忙'
        })
      }
    },
    confirm() {
      window.history.back()
    },
    onSubmit() {
      if (this.fileList.length === 0) {
        if (this.urlList.length === 0) {
          this.$message({
            type: 'warning',
            message: '最少一张图片才可以保存哦'
          })
          return
        }
        const arr = new Array()
        this.urlList.forEach(item => {
          const obj = {}
          obj.id = null
          obj.isCover = 0
          obj.url = item
          arr.push(obj)
        })
        arr[0].isCover = 1
        addFarmToImg(window.localStorage.getItem('farm'), arr).then(res => {
          if (res.data.success === true) {
            this.$message({
              type: 'success',
              message: '上传成功'
            })
            window.history.back()
          }
          if (res.data.success !== true) {
            this.$message({
              type: 'info',
              message: res.data.message
            })
          }
        })
      }
      if (this.fileList.length !== 0) {
        if (this.fileList.length === 0 || this.fileList === ``) {
          this.$message({
            type: 'warning',
            message: '最少一张图片才可以保存哦'
          })
          return
        }
        const arr = new Array()
        this.fileList.forEach(item => {
          const obj = {}
          obj.id = null
          obj.isCover = item.isCover
          obj.url = item
          arr.push(obj)
        })
        arr.forEach(item => {
          item.url = item.url.url
        })
        chief(window.localStorage.getItem('farm'), arr).then(res => {
          if (res.data.success === true) {
            this.$message({
              type: 'success',
              message: '上传成功'
            })
            window.history.back()
          }
          if (res.data.success !== true) {
            this.$message({
              type: 'info',
              message: res.data.message
            })
          }
        })
      }
    },
    removeUrl(file) {
      const _this = this
      if (file.response !== undefined) {
        deleteUrl(file.response.queryResult.data.id).then(res => {
        })
      } else {
        _this.list.forEach(item => {
          if (item.url === file.url) {
            deleteUrl(item.id).then(res => {
            })
          }
        })
      }
    },
    checkImageWH(file, resolve, reject) {
      const _this = this
      const filereader = new FileReader()
      filereader.onload = e => {
        const src = e.target.result
        const image = new Image()
        image.onload = function() {
          if ((this.width !== _this.GLOBAL.PRODUCT_SHOP_WIDTH) || this.height !== _this.GLOBAL.PRODUCT_SHOP_HEIGHT) {
            _this.$message.warning(`请上传图片高度为750px宽度为360px的图片`)
            reject()
          } else {
            resolve()
          }
        }
        image.onerror = reject
        image.src = src
      }
      filereader.readAsDataURL(file)
    },
    handleBeforeUploads(file) {
      // 限制图片 格式、size、分辨率
      const that = this
      return new Promise(function(resolve, reject) {
        const isJPG = file.type === 'image/jpg'
        const isJPEG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'
        const bigLt2M = file.size < 6990506.667
        // console.log(file);
        if (!(isJPG || isJPEG || isPNG)) {
          that.$message.warning('只能上传JPG 、JPEG 、 PNG格式的图片~',)
          reject()
        } else if (!bigLt2M) {
          that.$message.warning(`图片大小超过20M`)
          reject()
        } else {
          that.checkImageWH(file, resolve, reject)
        }
      })
    }
  }
}
</script>
