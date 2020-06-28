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
            disabled
            class="textareaClass"
            :rows="2"
            style="width: 150%;"
            placeholder="请输入标题"
          />
        </el-form-item>
        <el-form-item label="分类:">
          <el-select
            v-model="operateType"
            disabled
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
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="form.fileList"
          >
            <el-button size="small" type="primary" disabled>点击上传</el-button>
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
            <el-button v-if="index!==0" size="small" disabled @click="deleteTextarea(index)">删除</el-button>
            <div style="float: left">
              <el-button size="small" disabled @click="addTextarea(index)">下一段</el-button>
              <el-button v-if="index===0" size="small" disabled disabled @click="deleteTextarea(index)">删除</el-button>
            </div>
            <el-upload
              v-if="text.fileList!==null"
              style="float: right;width: 150px;"
              class="upload-demo"
              action="/server/farmitemimg/upload"
              :on-success="handleChange"
              :before-remove="beforeRemove"
              :on-remove="handleRemove"
              disabled
              :before-upload="beforeAvatarUpload"
              :file-list="text.fileList"
            >
              <el-button size="small" disabled @click="onChangeUpload(index)">插图</el-button>
            </el-upload>
            <el-upload
              v-if="text.fileList===null"
              style="float: right;width: 200px;"
              class="upload-demo"
              action="/server/farmitemimg/upload"
              :on-success="handleChange"
              :before-remove="beforeRemove"
              :on-remove="handleRemove"
              disabled
              :before-upload="beforeAvatarUpload"
              :file-list="counter.fileList"
            >
              <el-button size="small" disabled @click="onChangeUpload(index)">插图</el-button>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="medium" style="margin:  0px 0px 0px 33%" @click="cancel">返回</el-button>
    </div>
    <div style="width: 35%;float: right;">
      <div style="width: 350px;">
        <el-card style="min-height: 300px">
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
import { updateMade, getLadle, getMadeId } from '@/api/made'
export default {
  data() {
    return {
      loading: false,
      form: {
        id: null,
        title: null,
        url: ``,
        input: null,
        fileList: []
      },
      counter: [{ count: '', num: `0`, fileList: [] }],
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
      const id = this.$route.query.id
      this.form.id = id
      function compare(property) {
        return function(a, b) {
          var value1 = a[property]
          var value2 = b[property]
          return value1 - value2
        }
      }
      getMadeId(id).then(res => {
        if (res.data.success === true) {
          const dataList = res.data.queryResult.data
          this.form.title = dataList.title
          this.form.url = dataList.cover
          this.operateType = dataList.productCustomizedCategory.id
          if (dataList.cover !== '') {
            const obj = {}
            obj.url = dataList.cover
            obj.name = dataList.cover.substring(dataList.cover.indexOf('s/') + 2, dataList.cover.length)
            this.form.fileList.push(obj)
          }
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
      let url = ''
      if (file.response !== undefined) {
        url = file.response.queryResult.data
      } else {
        url = file.url
      }
      if (url === this.form.url) {
        this.form.url = null
      }
      if (url !== this.form.url) {
        this.counter.forEach(item => {
          if (item.fileList[0].url === url) {
            item.fileList = []
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
      this.counter.splice(index, 1)
    },
    handleChange(file, fileList) {
      const obj = {}
      obj.url = file.queryResult.data
      obj.name = file.queryResult.data
      this.counter[this.imageId].fileList.push(obj)
    },
    onChangeUpload(index) {
      this.imageId = index
    },
    cancel() {
      this.$router.push({ path: '/review/reviewmade' })
    }
  }
}
</script>
<style lang="scss">

</style>
