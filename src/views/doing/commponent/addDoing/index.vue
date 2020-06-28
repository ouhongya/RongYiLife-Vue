<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)"
    style="height: auto"
  >
    <el-card class="box-card" align="center">
      <el-form ref="form" :model="form" style="width: 50%;margin: auto" label-width="100px">
        <el-form-item label="活动封面图:">
          <el-upload
            id="uploadUrl01"
            action="/server/farmitemimg/upload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :limit="1"
            :on-success="handleAvatarSuccess01"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <i class="el-icon-warning" style="font-size: 14px;color: #8c939d">请上传1张702*280 分辨率的png、jpg、jpeg图，单张图的容量不超过20MB，作为活动的封面图。（将在手机端活动列表展示）</i>
        <el-form-item label="活动详情图:">
          <el-upload
            id="uploadUrl02"
            action="/server/farmitemimg/upload"
            list-type="picture-card"
            :limit="3"
            :on-preview="handlePictureCardPreview"
            :on-success="handleAvatarSuccess02"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <i class="el-icon-warning" style="font-size: 14px;color: #8c939d">请上传1-3张702*360 分辨率的png、jpg、jpeg图，单张图的容量不超过20MB，作为活动的封面图。（将在手机端活动详情展示）</i>
        <el-form-item label="活动名称:">
          <el-input v-model="form.name" type="textarea" style="width: 70%;float: left" placeholder="请输入活动名称" :rows="3" />
        </el-form-item>
        <el-form-item label="活动描述:">
          <div v-for="(text,index) in counter" :key="index" style="width: 70%;float: left">
            <el-input
              v-model="text.count"
              type="textarea"
              :rows="3"
              style="width: 100%;float: left"
              placeholder="在此输入框中可以输入文章的每一小段,右下的插图按钮可以插入单张图片,多张请点击下一段"
            />
            <el-button v-if="index!==0" size="small" @click="deleteTextarea(index)">删除</el-button>
            <el-button size="small"style="float: left;" @click="addTextarea(index)">下一段</el-button>
            <el-button v-if="index===0"size="small" style="float: left;" disabled @click="deleteTextarea(index)">删除</el-button>
          </div>
        </el-form-item>
        <el-form-item label="发布区域:">
          <el-cascader
            v-model="community"
            class="floatLeft "
            :options="option"
            :props="props"
          />
        </el-form-item>
        <el-form-item label="活动地址:">
          <el-input v-model="form.location" class="floatLeft " placeholder="请输入活动地址" />
        </el-form-item>
        <el-form-item label="报名开始时间">
          <el-date-picker
            v-model="form.applyStartTime"
            class="floatLeft"
            type="datetime"
            placeholder="选择报名开始时间"
          />
        </el-form-item>
        <el-form-item label="报名截止时间">
          <el-date-picker
            v-model="form.applyEndTime"
            :picker-options="pickerOptions"
            class="floatLeft"
            type="datetime"
            placeholder="选择报名截止时间"
          />
        </el-form-item>
        <el-form-item label="活动开始时间">
          <el-date-picker
            v-model="form.startTime"
            class="floatLeft"
            type="datetime"
            placeholder="选择活动开始时间"
          />
        </el-form-item>
        <el-form-item label="活动结束时间">
          <el-date-picker
            v-model="form.endTime"
            class="floatLeft"
            type="datetime"
            placeholder="选择活动结束时间"
          />
        </el-form-item>
        <el-form-item label="活动参与人数">
          <el-input v-model="form.member" placeholder="请输入活动参与人数" class="floatLeft " />
        </el-form-item>
        <el-form-item label="活动发起单位">
          <el-input v-model="form.publisherUnit" placeholder="请输入活动发起单位" class="floatLeft" />
        </el-form-item>
        <el-form-item label="活动发起人">
          <el-input v-model="form.publisher" placeholder="请输入活动发起人" class="floatLeft" />
        </el-form-item>
        <el-form-item label="发起人电话">
          <el-input v-model="form.contactNum" placeholder="请输入发起人电话" class="floatLeft" />
        </el-form-item>
        <el-form-item>
          <el-button @click="test">取消</el-button>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { addDong } from '@/api/doingRomulgation'
import { test } from '../../../../utils/img'
export default {
  data() {
    return {
      form: {
        name: '',
        startTime: '',
        endTime: '',
        member: '',
        applyStartTime: '',
        applyEndTime: '',
        location: '',
        publisherUnit: '',
        contactNum: '',
        imgs: [],
        contents: [],
        areaId: []
      },
      img: '',
      banner: [],
      option: [],
      dialogImageUrl: '',
      dialogVisible: false,
      counter: [{ count: '', num: `0` }],
      props: {
        label: 'cityName',
        value: 'id',
        children: 'areas'
      },
      community: [],
      loading: false,
      pickerOptions:{
        disabledDate(time) {
          return test();
        },
      }
    }
  },
  watch: {
    community: function(community) {
      if (this.community.length !== 0) {
        this.form.areaId = community[1]
      }
    },
    pickerOptions: {

    }
  },
  created() {
    this.loading = true
    this.$axios.get(`/server/city/tree/community`).then((res) => {
      this.loading = false
      const data = res.data.queryResult.data
      for (let x = 0; x < data.length; x++) {
        for (let i = 0; i < data[x].areas.length; i++) {
          const arr = {}
          arr.id = data[x].areas[i].id
          arr.cityName = data[x].areas[i].areaName
          arr.areas = data[x].areas[i].areas
          data[x].areas[i] = arr
          for (let y = 0; y < data[x].areas[i].areas.length; y++) {
            const list = {}
            list.id = data[x].areas[i].areas[y].id
            list.cityName = data[x].areas[i].areas[y].name
            data[x].areas[i].areas[y] = list
          }
        }
      }
      data.forEach(item => {
        item.areas.forEach(val => {
          val.areasShow = val.areas
          val.areas = ''
        })
      })
      this.option = data
    })
    this.loading = false
  },
  methods: {
    onSubmit() {
      if (this.img === '' || this.img === undefined) {
        this.$message({
          type: 'warning',
          message: '请上传一张活动封面图'
        })
        return
      }
      if (this.banner.length === 0 || this.banner === ``) {
        this.$message({
          type: 'warning',
          message: '最少上传一张活动详情图'
        })
        return
      }
      if (this.form.name === '' || this.form.name === undefined) {
        this.$message({
          type: 'warning',
          message: '请输入活动名称'
        })
        return
      }
      this.counter.forEach(item => {
        if (item.count === '') {
          this.$message({
            type: 'warning',
            message: '请输入活动描述'
          })
          return
        }
      })
      if (this.form.location === '' || this.form.location === undefined) {
        this.$message({
          type: 'warning',
          message: '请输入活动地址'
        })
        return
      }
      if (this.form.areaId === '' || this.form.areaId === undefined) {
        this.$message({
          type: 'warning',
          message: '请选择活动举办地址'
        })
        return
      }
      if (this.form.applyStartTime === '' || this.form.applyStartTime === undefined) {
        this.$message({
          type: 'warning',
          message: '请选择活动报名开始时间'
        })
        return
      }
      if (this.form.applyEndTime === '' || this.form.applyEndTime === undefined) {
        this.$message({
          type: 'warning',
          message: '请选择活动报名截至时间'
        })
        return
      }
      if (this.form.startTime === '' || this.form.startTime === undefined) {
        this.$message({
          type: 'warning',
          message: '请选择活动开始时间'
        })
        return
      }
      if (this.form.endTime === '' || this.form.endTime === undefined) {
        this.$message({
          type: 'warning',
          message: '请选择活动结束时间'
        })
        return
      }
      if (this.form.member === '' || this.form.member === undefined) {
        this.$message({
          type: 'warning',
          message: '请输入活动参与人数'
        })
        return
      }
      if (this.form.publisherUnit === '' || this.form.publisherUnit === undefined) {
        this.$message({
          type: 'warning',
          message: '请输入活动发起单位'
        })
        return
      }
      if (this.form.publisher === '' || this.form.publisher === undefined) {
        this.$message({
          type: 'warning',
          message: '请输入活动发起人'
        })
        return
      }
      if (this.form.contactNum === '' || this.form.contactNum === undefined) {
        this.$message({
          type: 'warning',
          message: '请输入活动发起人电话'
        })
        return
      }
      let count = 1
      const arr = []
      this.counter.forEach(item => {
        const obj = {}
        obj.content = item.count
        obj.queue = ++count
        arr.push(obj)
      })
      this.form.contents = arr
      let num = 1
      const array = []
      this.banner.forEach(item => {
        const obj = {}
        obj.url = item
        obj.location = ++num
        array.push(obj)
      })
      const obj = {}
      obj.url = this.img
      obj.location = 0
      array.push(obj)
      this.form.imgs = array
      this.loading = true
      addDong(this.form).then(res => {
        this.loading = false
        if (res.data.success === true) {
          this.$router.push({ path: '/doing/romulgation' })
          this.$message({
            type: 'success',
            message: '创建成功'
          })
        }
        if (res.data.success !== true) {
          this.close()
          this.$message({
            type: 'info',
            message: res.data.message
          })
        }
      })
      this.loading = false
    },
    deleteTextarea(index) {
      this.counter.splice(index, 1)
    },
    addTextarea(index) {
      this.counter.push({ count: '', num: ++index })
    },
    handleRemove(file, fileList) {
      const url = file.response.queryResult.data
      if (this.img === url) {
        this.img = ''
      } else {
        for (let x = 0; x < this.banner.length; x++) {
          if (this.banner[x] === url) {
            this.banner.splice(x--, 1)
          }
        }
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleAvatarSuccess01(res, file) {
      this.img = res.queryResult.data
    },
    handleAvatarSuccess02(res, file) {
      this.banner.push(res.queryResult.data)
    },
    test() {
      this.$router.push({ path: '/doing/romulgation' })
    }
  }
}
</script>

<style>
  #uploadUrl01 .el-upload-list--picture-card .el-upload-list__item {
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 175px;
    height: 85px;
    margin: 0 8px 8px 0;
    display: inline-block;
  }
 #uploadUrl02 .el-upload-list--picture-card .el-upload-list__item {
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 175px;
    height: 100px;
    margin: 0 8px 8px 0;
    display: inline-block;
  }

  .floatLeft{
    float: left;
    width: auto;
  }
  .floatLeft input.el-input__inner{
    float: left;
    width: 300px;
  }
</style>
