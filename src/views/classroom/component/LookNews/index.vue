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
        <el-form-item label="封面:">
          <el-upload
            class="upload-demo"
            action="/server/farmitemimg/upload"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :before-remove="beforeRemove"
            multiple
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
            <div style="float: left">
              <el-button size="small" @click="addTextarea(index)">下一段</el-button>
              <el-button v-if="index===0" size="small" disabled @click="deleteTextarea(index)">删除</el-button>
            </div>
            <el-upload
              v-if="text.fileList!==null"
              style="float: right;width: 200px;"
              class="upload-demo"
              action="/server/farmitemimg/upload"
              :on-success="handleChange"
              :before-remove="beforeRemove"
              :on-remove="handleRemove"
              :before-upload="beforeAvatarUpload"
              :file-list="text.fileList"
            >
              <el-button size="small" @click="onChangeUpload(index)">插图</el-button>
            </el-upload>
            <el-upload
              v-if="text.fileList===null"
              style="float: right;width: 200px;"
              class="upload-demo"
              action="/server/farmitemimg/upload"
              :on-success="handleChange"
              :before-remove="beforeRemove"
              :on-remove="handleRemove"
              :before-upload="beforeAvatarUpload"
              :file-list="counter.fileList"
            >
              <el-button size="small" @click="onChangeUpload(index)">插图</el-button>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="medium" @click="cancel">取消</el-button>
      <el-button type="primary" size="medium" @click="onsubmit">提交</el-button>
    </div>
    <div style="width: 35%;float: right;">
      <div style="width: 350px;">
        <el-card header="文章预览" style="min-height: 300px">
          <FONT><strong style="line-height: 20px;font-size: 15px;color: #676767;margin-top: 20px;letter-spacing: 1px"> {{ form.title }}</strong></FONT>
          <br style="margin: 10px">
          <div style="font-size: 15px;color: #606266;background-image: none;border-radius: 4px;">{{ new Date() |dateformat('YYYY-MM-DD HH:mm') }}</div>
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
                :src="item.fileList[0].url"
              />
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </el-card>
</template>
<script>
import { getArticleId, update } from '@/api/answer'
export default {
  data() {
    return {
      loading: false,
      form: {
        title: null,
        url: null,
        input: null,
        fileList: []
      },
      fileList: [],
      counter: [{ count: '', fileList: null }],
      num: 1,
      imageId: null,
      id: null
    }
  },
  created() {
    this.$message.closeAll()
    function compare(property) {
      return function(a, b) {
        var value1 = a[property]
        var value2 = b[property]
        return value1 - value2// 升序,降序为value2 - value1
      }
    }
    this.id = this.$route.query.id
    this.loading = true
    getArticleId(this.id).then(res => {
      this.loading = false
      if (res.data.success === true) {
        const dataList = res.data.queryResult.data[0]
        console.log(dataList)
        this.form.title = dataList.title
        this.form.url = dataList.cover
        const obj = {}
        obj.url = dataList.cover
        obj.name = dataList.cover.substring(dataList.cover.indexOf('s/') + 2, dataList.cover.length)
        this.form.fileList.push(obj)
        const contents = dataList.contents.sort(compare('queue'))
        const arr = []
        contents.forEach((item, index) => {
          const obj = {}
          if (item.type === 1) {
            obj.count = item.content
            obj.fileList = null
          }
          if (item.type === 0) {
            obj.count = null
            const c = {}
            c.name = item.content.substring(item.content.indexOf('s/') + 2, item.content.length)
            c.url = item.content
            obj.fileList = []
            obj.fileList.push(c)
          }
          arr.push(obj)
        })

        for (let x = 0; x < arr.length; x++) {
          if (arr[x].fileList !== null) {
            const a = x - 1
            arr[a].count = arr[a].count
            arr[a].fileList = arr[x].fileList
          }
        }
        for (let i = 0; i < arr.length; ++i) {
          if (arr[i].count === null) {
            arr.splice(i--, 1)
          }
        }
        this.counter = arr
      }
    })
  },
  methods: {
    handleRemove(file, fileList) {
      if (file.response !== undefined) {
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
      }
      if (file.response === undefined) {
        const url = file.name
        if (this.form.url !== null) {
          if (url === this.form.url.substring(this.form.url.indexOf('s/') + 2, this.form.url.length)) {
            this.form.url = null
          }
        }
        if (url !== this.form.url) {
          this.counter.forEach(item => {
            if (item.fileList !== null) {
              if (item.fileList[0].name === url) {
                item.fileList = null
              }
            }
          })
          console.log(this.counter)
        }
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
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
      this.counter.splice(index, 1)
    },
    handleChange(file, fileList) {
      console.log(file)
      this.counter[this.imageId].fileList = []
      const arr = {
        url: file.queryResult.data,
        name: file.queryResult.data.substring(file.queryResult.data.indexOf('s/') + 2, file.queryResult.data.length)
      }
      this.counter[this.imageId].fileList.push(arr)
    },
    onChangeUpload(index) {
      this.imageId = index
    },
    onsubmit() {
      const obj = {}
      obj.id = this.id
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
            object.content = item.fileList[0].url
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
      this.loading = true
      update(obj).then(res => {
        this.loading = false
        if (res.data.success === true) {
          this.$router.push({ path: '/classroom/answer' })
          this.$message({
            type: 'success',
            message: '编辑成功'
          })
        }
      })
    },
    cancel() {
      this.$router.push({ path: '/classroom/answer' })
    }
  }
}
</script>
<style lang="scss">
  div.el-form-item__content {
    line-height: 40px;
    position: relative;
    font-size: 14px;
    width: 400px;
  }
</style>
