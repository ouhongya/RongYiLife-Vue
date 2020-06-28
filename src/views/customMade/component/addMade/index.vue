<template>
  <el-card
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)"
  >
    <div style="width: 50%;float: left;" align="center">
      <el-form ref="form" :model="form" width="300px" label-width="80px" style="padding: 10px;">
        <el-form-item label="标题:">
          <el-input
            v-model="form.title"
            type="textarea"
            class="textareaClass"
            :rows="2"
            style="width: 150%;"
            placeholder="请输入标题"
          />
        </el-form-item>
        <el-form-item label="分类:">
          <el-select
            v-model="operateType"
            size="medium"
            style="float: left"
          >
            <el-option
              v-for="item in option"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="封面:">
          <el-upload
            class="upload-demo"
            action="/server/farmitemimg/upload"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :before-remove="beforeRemove"
            :before-upload="beforeAvatarUpload"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="form.fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
          </el-upload>
        </el-form-item>
        <el-form-item label="断落:">
          <div v-for="(text,index) in counter" :key="index">
            <el-input
              v-model="text.count"
              type="textarea"
              :rows="5"
              class="textareaClass"
              style="width: 150%;"
              placeholder="在此输入框中可以输入文章的每一小段,右下的插图按钮可以插入单张图片,多张请点击下一段"
            />
            <el-button v-if="index!==0" size="small" @click="deleteTextarea(index)">删除</el-button>
            <el-upload
              style="float: right"
              class="upload-demo"
              action="/server/farmitemimg/upload"
              :on-success="handleChange"
              :before-remove="beforeRemove"
              :on-remove="handleRemove"
              :limit="1"
              :before-upload="beforeAvatarUpload"
              :file-list="counter.fileList"
            >
              <el-button size="small" @click="onChangeUpload(index)">插图</el-button>
            </el-upload>
            <div style="float: left">
              <el-button size="small" @click="addTextarea(index)">下一段</el-button>
              <el-button v-if="index===0" size="small" disabled @click="deleteTextarea(index)">删除</el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="medium" style="margin:  0px 0px 0px 33%" @click="cancel">取消</el-button>
      <el-button type="primary" size="medium" @click="onsubmit">提交</el-button>
    </div>
    <div style="width: 35%;float: right;">
      <!-- <p>
         <FONT><strong style="line-height: 20px;font-size: 15px;color: #676767 "></strong></FONT>
       </p>-->
      <div style="width: 350px;">
        <el-card header="文章预览" style="min-height: 300px">
          <FONT><strong style="line-height: 20px;font-size: 15px;color: #676767;margin-top: 20px;letter-spacing: 1px"> {{ form.title }}</strong></FONT>
          <br style="margin: 10px">
          <span style="font-size: 15px;color: #606266;background-image: none;border-radius: 4px;">{{ new Date() |dateformat('YYYY-MM-DD HH:mm') }}</span>
          <br>
          <div>
            <el-image
              style="width: 100%; height: 170px"
              :src="form.url"
            />
          </div>
          <div v-for="(item,index) in counter" :ket="index">
            <div style="font-size: inherit;color: #606266;background-image: none;border-radius: 4px;letter-spacing:2px">
              &nbsp;&nbsp;&nbsp;&nbsp;{{ item.count }}
            </div>
            <div v-if="item.fileList!==null">
              <el-image
                style="width: 100%; height: 170px"
                :src="item.fileList"
              />
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </el-card>
</template>
<script>
import { addMade, getLadle } from '@/api/made'
export default {
  data() {
    return {
      loading: false,
      form: {
        title: null,
        url: null,
        input: null
      },
      fileList: [],
      counter: [{ count: '', num: `0`, fileList: null }],
      num: 1,
      imageId: null,
      option: null,
      operateType: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      getLadle().then(res => {
        if (res.data.success === true) {
          this.option = res.data.queryResult.data.list
          this.loading = false
        } else {
          this.loading = false
        }
      })
    },
    handleRemove(file, fileList) {
      const url = file.response.queryResult.data
      if (url === this.form.url) {
        this.form.url = null
      }
      if (url !== this.form.url) {
        this.counter.forEach(item => {
          if (item.fileList === url) {
            item.fileList = null
          }
        })
      }
    },
    beforeAvatarUpload(file) {

    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleAvatarSuccess(res, file) {
      this.form.url = res.queryResult.data
    },
    addTextarea(index) {
      this.counter.push({ count: '', num: ++index, fileList: null })
    },
    deleteTextarea(index) {
      this.$confirm('您确定要删除此段落吗', '是否继续', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.counter.splice(index, 1)
      }).catch(() => {})
    },
    handleChange(file, fileList) {
      this.counter[this.imageId].fileList = file.queryResult.data
    },
    onChangeUpload(index) {
      this.imageId = index
    },
    onsubmit() {
      const obj = {}
      obj.author = null
      obj.title = this.form.title
      obj.cover = this.form.url
      if (obj.title === null || obj.title === '') {
        this.$message({
          type: 'warning',
          message: '请填写文章名称'
        })
        return
      }
      if (this.operateType === null || this.operateType === '') {
        this.$message({
          type: 'warning',
          message: '请选择分类'
        })
        return
      }
      if (obj.cover === null || obj.cover === '') {
        this.$message({
          type: 'warning',
          message: '请上传文章封面'
        })
        return
      }
      if (this.counter[0].count === null || this.counter[0].count === '') {
        this.$message({
          type: 'warning',
          message: '文章内容最少一段'
        })
        return
      }
      const arr = []
      if (this.counter.length !== 0) {
        this.counter.forEach((item, index) => {
          if (item.count !== null) {
            const object = {}
            object.content = item.count
            object.queue = index
            object.type = 1
            arr.push(object)
          }
          if (item.fileList !== null) {
            const object = {}
            object.content = item.fileList
            object.queue = index
            object.type = 0
            arr.push(object)
          }
        })
      }
      arr.forEach((item, index) => {
        item.queue = index
      })
      obj.contents = arr
      obj.productCustomizedCategoryId = this.operateType
      this.loading = true
      addMade(obj).then(res => {
        this.loading = false
        if (res.data.success === true) {
          this.$router.push({ path: '/made/maderelease' })
          this.$message({
            type: 'success',
            message: '添加成功,请等待管理员审核...'
          })
        }
      })
    },
    cancel() {
      this.$router.push({ path: '/made/maderelease' })
    }
  }
}
</script>
<style>
  .el-upload-list__item-name {
    color: #606266;
    display: block;
    margin-right: 40px;
    width: 130px;
    overflow: hidden;
    padding-left: 4px;
    text-overflow: ellipsis;
    -webkit-transition: color .3s;
    transition: color .3s;
    white-space: nowrap;
  }
</style>
