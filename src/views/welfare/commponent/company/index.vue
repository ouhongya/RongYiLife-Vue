<template>
  <div>
    <div style="width: 50%;float: left;padding: 10px" align="center">
      <el-card class="box-card">
        <el-form v-if="id===undefined" ref="form" style="width: 100%" :model="form" label-width="80px">
          <el-form-item label="封面图：">
            <el-upload
              id="coverUpload"
              class="avatar-uploader"
              action="/server/farmitemimg/upload"
              :show-file-list="false"
              style="margin-right:25%"
              :on-success="handleAvatarSuccess"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
            >
              <img v-if="form.url" :src="form.url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
            <i class="el-icon-warning" style="font-size: 10px;color: #8c939d;float: left">提示：请上传1张750*360 分辨率的png、jpg、jpeg图，单张图的容量不超过20MB，作为该排行的展示图</i>
          </el-form-item>
          <el-form-item label="第一名:">
            <el-input v-model="form.oneName" class="inputDiv" style="float: left" placeholder="请输入姓名" />
            <el-upload
              class="avatar-uploader"
              action="/server/farmitemimg/upload"
              :show-file-list="false"
              :on-success="OnehandleAvatarSuccess"
              :before-upload="OnebeforeAvatarUpload"
            >
              <img v-if="form.oneUrl" :src="form.oneUrl" class="avatar">
              <i v-else class="avatar-uploader-icon">头像</i>
            </el-upload>
          </el-form-item>
          <el-form-item label="第二名:">
            <el-input v-model="form.twoName" class="inputDiv" style="float: left" placeholder="请输入姓名" />
            <el-upload
              class="avatar-uploader"
              action="/server/farmitemimg/upload"
              :show-file-list="false"
              :on-success="twOhandleAvatarSuccess"
              :before-upload="twObeforeAvatarUpload"
            >
              <img v-if="form.twoUrl" :src="form.twoUrl" class="avatar">
              <i v-else class="avatar-uploader-icon"> 头像</i>
            </el-upload>
          </el-form-item>
          <el-form-item label="第三名:">
            <el-input v-model="form.threeName" class="inputDiv" style="float: left" placeholder="请输入姓名" />
            <el-upload
              class="avatar-uploader"
              action="/server/farmitemimg/upload"
              :show-file-list="false"
              :on-success="threehandleAvatarSuccess"
              :before-upload="threebeforeAvatarUpload"
            >
              <img v-if="form.threeUrl" :src="form.threeUrl" class="avatar">
              <i v-else class="avatar-uploader-icon"> 头像</i>
            </el-upload>
          </el-form-item>
          <el-form-item label="规则说明:">
            <el-input v-model="form.textarea" type="textarea" :rows="4" class="inner" placeholder="请输入内容" />
          </el-form-item>
        </el-form>
        <el-form v-if="id!==undefined" ref="form" style="width: 100%" :model="Lookform" label-width="80px">
          <el-form-item label="封面图：">
            <el-upload
              id="coverUploada"
              class="avatar-uploader"
              action="/server/farmitemimg/upload"
              :show-file-list="false"
              style="margin-right:25%"
              :on-success="handleAvatarSuccess"
              :file-list="Lookform.fileList"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
            >
              <img v-if="Lookform.url" :src="Lookform.url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
            <i class="el-icon-warning" style="font-size: 10px;color: #8c939d;float: left">提示：请上传1张750*360 分辨率的png、jpg、jpeg图，单张图的容量不超过20MB，作为该排行的展示图</i>
          </el-form-item>
          <el-form-item label="第一名:">
            <el-input v-model="Lookform.oneName" disabled class="inputDiv" style="float: left" placeholder="请输入姓名" />
            <el-upload
              class="avatar-uploader"
              action="/server/farmitemimg/upload"
              :show-file-list="false"
              disabled
              :on-success="OnehandleAvatarSuccess"
              :before-upload="OnebeforeAvatarUpload"
            >
              <img v-if="Lookform.oneUrl" :src="Lookform.oneUrl" class="avatar">
              <i v-else class="avatar-uploader-icon"> 头像</i>
            </el-upload>
          </el-form-item>
          <el-form-item label="第二名:">
            <el-input v-model="Lookform.twoName" disabled class="inputDiv" style="float: left" placeholder="请输入姓名" />
            <el-upload
              class="avatar-uploader"
              action="/server/farmitemimg/upload"
              :show-file-list="false"
              :on-success="twOhandleAvatarSuccess"
              disabled
              :before-upload="twObeforeAvatarUpload"
            >
              <img v-if="Lookform.twoUrl" :src="Lookform.twoUrl" class="avatar">
              <i v-else class="avatar-uploader-icon"> 头像</i>
            </el-upload>
          </el-form-item>
          <el-form-item label="第三名:">
            <el-input v-model="Lookform.threeName" disabled class="inputDiv" style="float: left" placeholder="请输入姓名" />
            <el-upload
              class="avatar-uploader"
              action="/server/farmitemimg/upload"
              :show-file-list="false"
              :on-success="threehandleAvatarSuccess"
              disabled
              :before-upload="threebeforeAvatarUpload"
            >
              <img v-if="Lookform.threeUrl" :src="Lookform.threeUrl" class="avatar">
              <i v-else class="avatar-uploader-icon"> 头像</i>
            </el-upload>
          </el-form-item>
          <el-form-item label="简介:">
            <el-input v-model="Lookform.textarea" type="textarea" :rows="4" class="inner" disabled placeholder="请输入内容" />
          </el-form-item>
        </el-form>
      </el-card>
      <el-button type="primary" size="medium" @click="returnTest">返回</el-button>
      <el-button v-if="id===undefined" type="primary" size="medium" @click="OnSubmit">提交</el-button>
    </div>
    <el-card style="width: 50%;float: right;padding: 10px;" align="center">
      <div v-if="id===undefined" style="border: 1px solid #adb2b8;width: 450px; ">
        <div>
          <div class="demo-image__preview">
            <el-image
              style="width: 446px; height: 220px"
              :src="form.url"
              :preview-src-list="form.url"
            />
          </div>
        </div>
        <div id="logo" style="width: 100%;height: 300px;padding-top: 30px;">
          <div style="width: 90%">
            <el-divider id="divder"direction="vertical" />
            <div style="color: #55B700;font-size: 21.5px;margin-right: 60%;opacity: 1">
              公益之星
            </div>
          </div>
          <div style="padding-top: 40px;width: 90%">
            <div>
              <el-card style="float: left;height: 150px;width: 130px;opacity: 1;">
                <div style="font-family: Adobe Heiti Std;font-weight:700">NO.2</div>
                <img :src="form.twoUrl" width="110px" onerror="this.src='https://gss0.baidu.com/9vo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=ee323c6c71cf3bc7e855c5eae1309699/3801213fb80e7becdddcc3802e2eb9389b506b49.jpg'" height="80px" style="margin: 5%;align-content: center">
                <br>
                <div style="font-family:Adobe Heiti Std;font-weight:700">
                  {{ form.twoName }}&nbsp;
                </div>
              </el-card>
            </div>
            <div>
              <el-card style="float: right;height: 150px;width: 130px">
                <div style="font-family: Adobe Heiti Std;font-weight:700">NO.3</div>
                <img :src="form.threeUrl" width="110px" onerror="this.src='https://gss0.baidu.com/9vo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=ee323c6c71cf3bc7e855c5eae1309699/3801213fb80e7becdddcc3802e2eb9389b506b49.jpg'" height="80px" style="margin: 5%;align-content: center">
                <br>
                <div style="font-family:Adobe Heiti Std;font-weight:700">
                  {{ form.threeName }}&nbsp;
                </div>
              </el-card>
            </div>
            <div>
              <el-card style="height: 150px;width: 130px">
                <div style="font-family: Adobe Heiti Std;font-weight:700">NO.1</div>
                <img :src="form.oneUrl" width="110px" onerror="this.src='https://gss0.baidu.com/9vo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=ee323c6c71cf3bc7e855c5eae1309699/3801213fb80e7becdddcc3802e2eb9389b506b49.jpg'" height="80px" style="margin: 5%;align-content: center">
                <br>
                <div style="font-family:Adobe Heiti Std;font-weight:700">
                  {{ form.oneName }}&nbsp;
                </div>
              </el-card>
            </div>

          </div>
        </div>
        <div style="width: 100% ">
          <div style="width: 90%">
            <br>
            <el-divider id="divder01" direction="vertical" />
            <div style="color:rgba(51,51,51,1);font-size: 21.5px;margin-right: 60%;opacity: 1">规则说明:</div>
            <br>
            <el-input v-model="form.textarea" type="textarea" disabled :rows="4" placeholder="请输入内容" />
          </div>
        </div>
      </div>
      <div v-if="id!==undefined" style="border: 1px solid #adb2b8;width: 450px; ">
        <div>
          <div class="demo-image__preview">
            <el-image
              style="width: 446px; height: 220px"
              :src="Lookform.url"
              :preview-src-list="Lookform.url"
            />
          </div>
        </div>
        <div id="logoa" style="width: 100%;height: 300px;padding-top: 30px;">
          <div style="width: 90%">
            <el-divider id="divdera"direction="vertical" />
            <div style="color: #55B700;font-size: 21.5px;margin-right: 60%;opacity: 1">
              公益之星
            </div>
          </div>
          <div style="padding-top: 40px;width: 90%">
            <div>
              <el-card style="float: left;height: 150px;width: 130px;opacity: 1;">
                <div style="font-family: Adobe Heiti Std;font-weight:700">NO.2</div>
                <img :src="Lookform.twoUrl" width="110px" onerror="this.src='https://gss0.baidu.com/9vo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=ee323c6c71cf3bc7e855c5eae1309699/3801213fb80e7becdddcc3802e2eb9389b506b49.jpg'" height="80px" style="margin: 5%;align-content: center">
                <br>
                <div style="font-family:Adobe Heiti Std;font-weight:700">
                  {{ Lookform.twoName }}&nbsp;
                </div>
              </el-card>
            </div>
            <div>
              <el-card style="float: right;height: 150px;width: 130px">
                <div style="font-family: Adobe Heiti Std;font-weight:700">NO.3</div>
                <img :src="Lookform.threeUrl" width="110px" onerror="this.src='https://gss0.baidu.com/9vo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=ee323c6c71cf3bc7e855c5eae1309699/3801213fb80e7becdddcc3802e2eb9389b506b49.jpg'" height="80px" style="margin: 5%;align-content: center">
                <br>
                <div style="font-family:Adobe Heiti Std;font-weight:700">
                  {{ Lookform.threeName }}&nbsp;
                </div>
              </el-card>
            </div>
            <div>
              <el-card style="height: 150px;width: 130px">
                <div style="font-family: Adobe Heiti Std;font-weight:700">NO.1</div>
                <img :src="Lookform.oneUrl" width="110px" onerror="this.src='https://gss0.baidu.com/9vo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=ee323c6c71cf3bc7e855c5eae1309699/3801213fb80e7becdddcc3802e2eb9389b506b49.jpg'" height="80px" style="margin: 5%;align-content: center">
                <br>
                <div style="font-family:Adobe Heiti Std;font-weight:700">
                  {{ Lookform.oneName }}&nbsp;
                </div>
              </el-card>
            </div>

          </div>
        </div>
        <div style="width: 100% ">
          <div style="width: 90%">
            <br>
            <el-divider id="divder01a" direction="vertical" />
            <div style="color:rgba(51,51,51,1);font-size: 21.5px;margin-right: 60%;opacity: 1">规则说明:</div>
            <br>
            <el-input v-model="Lookform.textarea" type="textarea" disabled :rows="4" placeholder="请输入内容" />
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { onsubmit, fetchDataId } from '@/api/welfareCompany'
export default {
  data() {
    return {
      form: {
        url: ``,
        one: '1',
        oneName: '',
        oneUrl: ``,
        two: '2',
        twoName: '',
        twoUrl: ``,
        three: '3',
        threeName: '',
        threeUrl: ``,
        textarea: ''
      },
      Lookform: {
        fileList: [],
        url: [],
        one: '1',
        oneName: '',
        oneUrl: ``,
        two: '2',
        twoName: '',
        twoUrl: ``,
        three: '3',
        threeName: '',
        threeUrl: ``,
        textarea: ''
      },
      Visible: false,
      list: [],
      dialogImageUrl: '',
      dialogVisible: false,
      currentPage: 1,
      size: 1,
      total: 0,
      value: '',
      imageUrl: '',
      input: '',
      textarea: '',
      id: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.id = this.$route.query.id
      if (this.id !== undefined || this.id !== '') {
        fetchDataId(this.id).then(res => {
          const dataList = res.data.queryResult.data
          const arrUrl = []
          const urlList = {}
          urlList.url = dataList.url
          arrUrl.push(urlList)
          this.Lookform.fileList = arrUrl
          this.Lookform.url = dataList.url
          this.Lookform.textarea = (dataList.intro)
          dataList.companyRankSs.forEach(item => {
            if (item.sequence === 1) {
              this.Lookform.oneName = item.name
              this.Lookform.oneUrl = (item.url)
            }
            if (item.sequence === 2) {
              this.Lookform.twoName = item.name
              this.Lookform.twoUrl = (item.url)
            }
            if (item.sequence === 3) {
              this.Lookform.threeName = item.name
              this.Lookform.threeUrl = (item.url)
            }
          })
        })
      }
    },
    OnSubmit() {
      this.judge()
      const object = {}
      const arr = []
      const obj = {}
      obj.sequence = 1
      obj.name = this.form.oneName
      obj.url = this.form.oneUrl
      arr.push(obj)
      const obj1 = {}
      obj1.sequence = 2
      obj1.name = this.form.twoName
      obj1.url = this.form.twoUrl
      arr.push(obj1)
      const obj2 = {}
      obj2.sequencef = 3
      obj2.name = this.form.threeName
      obj2.url = this.form.threeUrl
      arr.push(obj2)
      object.url = this.form.url
      object.intro = this.form.textarea
      object.companyRankSs = arr
      onsubmit(object).then(res => {
        if (res.data.success === true) {
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          window.history.back()
        }
      })
    },
    close() {
      this.Visible = false
    },
    judge() {
      if (this.form.url === '' || this.form.url === undefined) {
        this.$message({
          type: 'warning',
          message: '请上传一张封面图'
        })
        return
      }
      if (this.form.oneName === '' || this.form.oneName === undefined) {
        this.$message({
          type: 'warning',
          message: '请输入第一名的名字'
        })
        return
      }
      if (this.form.oneUrl === '' || this.form.oneUrl === undefined) {
        this.$message({
          type: 'warning',
          message: `请上传第一名的头像`
        })
        return
      }
      if (this.form.twoName === '' || this.form.twoName === undefined) {
        this.$message({
          type: 'warning',
          message: '请输入第二名的名字'
        })
        return
      }
      if (this.form.twoUrl === '' || this.form.twoUrl === undefined) {
        this.$message({
          type: 'warning',
          message: '请上传第二名的头像'
        })
        return
      }
      if (this.form.threeName === '' || this.form.threeName === undefined) {
        this.$message({
          type: 'warning',
          message: '请输入第三名的名字'
        })
        return
      }
      if (this.form.threeUrl === '' || this.form.threeUrl === undefined) {
        this.$message({
          type: 'warning',
          message: '请上传第三名的图片'
        })
        return
      }
      if (this.form.textarea === '' || this.form.textarea === undefined) {
        this.$message({
          type: 'warning',
          message: '请输入简介'
        })
        return
      }
    },
    handleAvatarSuccess(res, file) {
      this.form.url = file.response.queryResult.data
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
      /*
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }*/
      return isJPG && isLt2M
    },
    twOhandleAvatarSuccess(res, file) {
      this.form.twoUrl = file.response.queryResult.data
    },
    twObeforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      return isJPG && isLt2M
    },
    threehandleAvatarSuccess(res, file) {
      this.form.threeUrl = file.response.queryResult.data
    },
    threebeforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      return isJPG && isLt2M
    },
    addRanking() {
      this.$router.push({ path: '/welfare/ranking' })
    },
    returnTest() {
      window.history.back()
    }
  }
}
</script>
<style lang="scss" scoped>
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
    margin: 0px 26% 0px 0px;
    line-height: 105px;
    vertical-align: top;
  }
  .inner{
    margin: 0px 50% 0px 0px;
    width: 60%;
  }
  .innercc{
    width: 44%;
  }
  #logo{
    background: url("backgr.png");
    background-size: 100% 100%;
    height: 100%;
  }
  #logoa{
    background: url("backgr.png");
    background-size: 100% 100%;
    height: 100%;
  }
</style>
<style>
  #coverUpload i.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 250px;
    height: 120px;
    line-height: 120px;
    text-align: center;
    float: right;
  }
  #coverUpload img.avatar {
    width: 250px;
    height: 120px;
    display: block;
    float: right;
  }
  #coverUploada i.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 250px;
    height: 120px;
    line-height: 120px;
    text-align: center;
    float: right;
  }
  #coverUploada img.avatar {
    width: 250px;
    height: 120px;
    display: block;
    float: right;
  }
  #divder{
    float: left;
    background: #55B700;
    width: 8px;
    height: 21.5px;
  }
  #divder01{
    float: left;
    background: rgba(60,182,242,1);
    width: 8px;
    height: 21.5px;
  }
  #divdera{
    float: left;
    background: #55B700;
    width: 8px;
    height: 21.5px;
  }
  #divder01a{
    float: left;
    background: rgba(60,182,242,1);
    width: 8px;
    height: 21.5px;
  }

</style>
