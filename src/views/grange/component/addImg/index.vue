<template>
  <div align="center">
    <el-card class="box-card" style="width: 50%">
      <el-upload
        class="avatar-uploader"
        :action="url"
        multiple
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :file-list="fileList"
        :on-success="handleAvatarSuccess"
        :before-remove="removeUrl"
        :limit="10"
        :on-remove="handleRemove"
        :before-upload="handleBeforeUploads"
      >
        <img v-if="urlList.length===9" :src="dialogImageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon" />
      </el-upload>
      <el-dialog :visible.sync="dialogVisible" size="tiny">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
      <i class="el-icon-warning" style="font-size: 14px;color: #8c939d">请上传1-10张750*360 分辨率的png、jpg、jpeg图，单张图的容量不超过20MB，作为休闲农庄的展示图。（将在手机端休闲农庄详情页的顶端滚动展示）</i>
    </el-card>
    <el-button type="primary" size="medium" @click="confirm()">返回</el-button>
  </div>
</template>
<script>
import { getUrl, deleteUrl } from '@/api/grange'
export default {
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      urlList: [],
      fileList: [],
      url: ''
    }
  },
  created() {
    this.$message.closeAll()
    const id = window.localStorage.getItem('grange')
    if (id !== null) {
      this.url = '/server/grange/album/banner/add/' + id + '/'
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
      this.url = '/server/grange/album/banner/add/' + window.localStorage.getItem('user').substring(0, window.localStorage.getItem('user').indexOf(',')) + '/'
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
    checkImageWH(file, resolve, reject) {
      const _this = this
      const filereader = new FileReader()
      filereader.onload = e => {
        const src = e.target.result
        const image = new Image()
        image.onload = function() {
          if ((this.width !== 750) || this.height !== 360) {
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
      const that = this
      return new Promise(function(resolve, reject) {
        const isJPG = file.type === 'image/jpg'
        const isJPEG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'
        const bigLt2M = file.size < 6990506.667
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
    },
    removeUrl(file) {
      const _this = this
      if (file.response !== undefined) {
        deleteUrl(file.response.queryResult.data.id).then(res => {
          if (res.success === true) {
          } else {
          }
        })
      } else {
        _this.list.forEach(item => {
          if (item.url === file.url) {
            deleteUrl(item.id).then(res => {
            })
          }
        })
      }
    }
  }
}
</script>
<style>

</style>
