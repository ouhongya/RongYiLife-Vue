<template>
  <div>
    <div style="width: 50%;float: left;">
      <el-card class="form-container" style="width: 100%;text-align: center;line-height: 60px;height: 100%" shadow="never">
        <el-form
          ref="key"
          v-loading="loading"
          :model="key"
          label-position="left"
          label-width="80px"
          class="demo-ruleForm"
          style="width: 100%;margin: 0px"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <el-form-item label="商品图片" height="90px" style="width: 100%">
            <el-upload
              id="commodity"
              action="/server/farmitemimg/upload"
              multiple
              list-type="picture-card"
              accept="image/jpeg,image/gif,image/png"
              :on-success="handleAvatarSuccess"
              :on-preview="handlePictureCardPreview"
              multiple
              :on-remove="handleRemove"
              :before-upload="handleBeforeUploads"
              :auto-upload="true"
            >
              <i class="el-icon-plus" />
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="80%" :src="previewImg" alt="">
            </el-dialog>
          </el-form-item>
          <i class="el-icon-warning" style="font-size: 10px;color: #8c939d">提示：请上传1-10张750*750 分辨率的png、jpg、jpeg图，单张图的容量不超过20MB，作为该产品的展示图。（将在手机端商品详情页的顶端滚动展示）</i>
          <el-form-item label="商品名称" prop="name">
            <el-input
              v-model="key.name"
              :auto-size="true"
              type="textarea"
              placeholder="请输入内容"
            />
          </el-form-item>
          <el-form-item label="商品描述" prop="subTitle">
            <el-input
              v-model="key.description"
              :auto-size="true"
              type="textarea"
              placeholder="请输入内容"
            />
          </el-form-item>
          <el-form-item label="宝贝详情">
            <el-upload
              class="upload-demo"
              action="/server/farmitemimg/upload"
              list-type="picture"
              :limit="1"
              :auto-upload="true"
              accept="image/jpeg,image/gif,image/png"
              :on-success="babyhandleAvatarSuccess"
              :on-preview="babyhandlePictureCardPreview"
              :on-remove="babyhandleRemove"
              :before-upload="handleBeforeUploadsbaby"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <i class="el-icon-warning" style="font-size: 10px;color: #8c939d">提示：请上传1张 宽750，高不限制的png，jpg，jpeg图，单张图的容量不超过20MB，作为该产品的宝贝详情图。（将在手机端商品详情页的宝贝详情展示商品具体内容）</i>
          <el-form-item label="商品分类">
            <el-cascader
              v-model="option"
              :options="options"
              :props="props"
            />
          </el-form-item>
          <el-form-item label="规格/价格" style="width: 500px">
            <el-table
              :data="Spu"
            >
              <el-table-column
                prop="date"
                label="规格"
                style="padding: 0px 0px 0px 0px"
              >
                <template slot-scope="props">
                  <el-input v-model="props.row.unit" class="input" type="text" style="width: 150px;" placeholder="请输入商品规格" />
                </template>
              </el-table-column>
              <el-table-column
                prop="price"
                label="单价"
              >
                <template slot-scope="props">
                  <el-input-number v-model="props.row.price" style="width: 200px" :min="0" :max="99999999.99" controls-position="right" placeholder="请输入商品价格" @blur="oninput(props.row.price)" />
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-button @click="cancelAdd()">取消</el-button>
          <el-button type="primary" @click="onSubmit">提交商品</el-button>
        </el-form>
      </el-card>
    </div>
    <div style="width: 35%;float: right;">
      <p>
        <FONT><strong style="line-height: 20px;font-size: 15px;color: #676767 ">预览图</strong></FONT>
      </p>
      <el-card class="form-container" style="width: 50%;height: 100%;border: 1px solid #676767" shadow="never">
        <div style="height: 100%">
          <div>
            <swiper v-if="banner.length!=0" ref="mySwiper" :options="swiperOption" class="swiper-wrap">
              <swiper-slide v-for="(item,index) in banner" :key="index" style="width: 325px;height: 320px">
                <img :src="item" width="100%" height="100%" alt="">
              </swiper-slide>
              <!-- 常见的小圆点 -->
              <div v-for="(item,index) in banner" :key="index" slot="pagination" class="swiper-pagination" />
            </swiper>
          </div>
          <div style="height: 20%;padding: 9px 0px 0px 0px">
            <span style="font-size: 16px">{{ key.name }}</span>
          </div>
          <div id="div" />
          <div style="height: 30px">
            <span>{{ Spu[0].unit }}</span>
            <span>/</span>
            <span style="color: #fa4c00;font-size: 23px">￥{{ Spu[0].price }}</span>
            <el-button type="success" size="mini" style="float: right">加入购物车</el-button>
          </div>
          <div>
            <span style="font-size: 12px;">{{ key.description }}</span>
          </div>
          <br>
          <div>
            <el-divider direction="vertical" />
            宝贝详情
          </div>
          <br>
          <div style="width: 100%">
            <div style="height: 410px">
              <el-scrollbar id="test" style="height: 100%">
                <el-image
                  v-for="image in dialogImageUrl"
                  width="100%"

                  height="100%"
                  :src="image"
                  :preview-src-list="dialogImageUrl"
                  lazy
                />
              </el-scrollbar>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import { categoryFetchData, addCategory } from '@/api/farm'
export default {
  data() {
    return {
      key: {
        name: '',
        urlList: '',
        description: ''
      },
      dialogImageUrl: [],
      dialogVisible: false,
      Spu: [{
        unit: '',
        price: ''
      }],
      imgIndex: 1,
      swiperOption: {
        // 是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
        notNextTick: true,
        // 循环
        loop: true,
        // 设定初始化时slide的索引
        initialSlide: 0,
        // 自动播放
        autoplay: {
          delay: 1500,
          stopOnLastSlide: false,
          /* 触摸滑动后是否继续轮播 */
          disableOnInteraction: false
        },
        // 滑动速度
        speed: 800,
        // 滑动方向
        direction: 'horizontal',
        // 小手掌抓取滑动
        grabCursor: true,
        on: {
          // 滑动之后回调函数
          slideChangeTransitionStart: function() {
            /* realIndex为滚动到当前的slide索引值 */
            this.imgIndex = this.realIndex - 1
          }
        },
        // 分页器设置
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          type: 'bullets'
        }
      },
      banner: [],
      previewImg: '',
      srcList: [],
      options: [],
      props: {
        value: 'id'
      },
      loading: false,
      option: null
    }
  },
  created() {
    this.loading = true
    this.fetchData()
  },
  methods: {
    oninput(e) {
      this.Spu[0].price = parseFloat(e).toFixed(2)
    },
    fetchData() {
      this.loading = true
      if (window.localStorage.getItem(`farm`) === '') {
        categoryFetchData(`null`).then(res => {
          this.loading = false
          const dataList = res.data.queryResult.data
          const arr = []
          for (let x = 0; x < dataList.length; x++) {
            const name = {}
            name.id = dataList[x].id
            name.label = (dataList[x].name)
            arr.push(name)
          }
          this.options = arr
        })
      }
      if (window.localStorage.getItem(`farm`) !== '') {
        categoryFetchData(window.localStorage.getItem('farm')).then(res => {
          this.loading = false
          const dataList = res.data.queryResult.data
          const arr = []
          for (let x = 0; x < dataList.length; x++) {
            const name = {}
            name.id = dataList[x].id
            name.label = (dataList[x].name)
            arr.push(name)
          }
          this.options = arr
        })
      }
      this.loading = false
    },
    /* 提交商品*/
    onSubmit() {
      if (this.banner.length === 0 || this.banner.length === undefined) {
        this.$message({
          type: 'warning',
          message: '请上传一张商品图片'
        })
        return
      }
      if (this.key.name === `` || this.key.name === undefined) {
        this.$message({
          type: 'warning',
          message: '请输入商品名称'
        })
        return
      }
      if (this.key.description === `` || this.key.description === undefined) {
        this.$message({
          type: 'warning',
          message: '请输入商品描述'
        })
        return
      }
      if (this.dialogImageUrl.length === 0 || this.dialogImageUrl === ``) {
        this.$message({
          type: 'warning',
          message: '请上传宝贝详情'
        })
        return
      }
      console.log(this.option, 'this.option')
      if (this.option === '' || this.option === null) {
        this.$message({
          type: 'warning',
          message: '请选择商品分类'
        })
        return
      }
      if (this.Spu[0].unit === `` || this.Spu[0].unit === undefined) {
        this.$message({
          type: 'warning',
          message: '请选择商品规格'
        })
        return
      }
      if (this.Spu[0].price === `` || this.Spu[0].price === undefined) {
        this.$message({
          type: 'warning',
          message: '请输入商品价格'
        })
        return
      }
      this.Spu[0].price = parseFloat(this.Spu[0].price).toFixed(2)
      const commodity = {}
      commodity.name = this.key.name
      commodity.description = this.key.description
      const money = {}
      money.price = this.Spu[0].price
      money.unit = this.Spu[0].unit
      commodity.spec = money
      let count = 1
      const url = []
      for (let x = 0; x < this.banner.length; x++) {
        const urlArr = {}
        urlArr.url = this.banner[x]
        urlArr.location = count++
        url.push(urlArr)
      }
      const cc = {}
      cc.url = this.dialogImageUrl[0]
      cc.location = '-1'
      url.push(cc)
      commodity.imgUrls = url
      commodity.categoryId = this.option + ''
      this.loading = true
      addCategory(commodity).then(res => {
        this.loading = false
        if (res.data.success === true) {
          this.key = {}
          this.dialogImageUrl = []
          this.Spu = {}
          this.url = ''
          this.banner = []
          this.previewImg = ''
          this.srcList = {}
          this.$message({
            type: 'success',
            message: '商品添加成功,请等待审核...'
          })
          this.$router.push({ path: '/farm/farminformation' })
        } else {
          this.$message({
            type: 'info',
            message: res.data.message
          })
        }
      })
      this.loading = false
    },
    handleRemove(file, fileList) {
      if (file.response !== undefined) {
        for (let x = 0; x < this.banner.length; x++) {
          if (this.banner[x] === file.response.queryResult.data) {
            this.banner.splice(x--, 1)
          }
        }
      } else {
        for (let x = 0; x < this.banner.length; x++) {
          if (this.banner[x] === file.url) {
            this.banner.splice(x--, 1)
          }
        }
      }
    },
    handlePictureCardPreview(file) {
      this.previewImg = file.url
      this.dialogVisible = true
    },
    onBeforeUpload(file) {
      const isIMAGE = file.type === 'image/jpeg' || 'image/gif' || 'image/png'
      const isLt1M = file.size / 1024 / 1024 / 1024 < 3

      if (!isIMAGE) {
        this.$message.error('上传文件只能是图片格式!')
      }
      if (!isLt1M) {
        this.$message.error('上传文件大小不能超过 3MB!')
      }
      return isIMAGE && isLt1M
    },
    handleAvatarSuccess(res, file) {
      if (res.success === true) {
        this.$message({
          type: 'success',
          message: '上传成功'
        })
        this.banner.push(file.response.queryResult.data)
      } else {
        this.$message({
          type: 'info',
          message: res.message
        })
      }
    },
    babyhandleRemove(file, fileList) {
      for (let x = 0; x < this.dialogImageUrl.length; x++) {
        if (this.dialogImageUrl[x] === file.response.queryResult.data) {
          this.dialogImageUrl.splice(x--, 1)
        }
      }
    },
    babyhandlePictureCardPreview(file) {
      this.previewImg = file.url
      this.dialogVisible = true
    },
    babyonBeforeUpload(file) {
      const isIMAGE = file.type === 'image/jpeg' || 'image/gif' || 'image/png'
      const isLt1M = file.size / 1024 / 1024 / 1024 / 1024 / 1024 < 5

      if (!isIMAGE) {
        this.$message.error('上传文件只能是图片格式!')
      }
      if (!isLt1M) {
        this.$message.error('上传文件大小不能超过 5MB!')
      }
      return isIMAGE && isLt1M
    },
    babyhandleAvatarSuccess(res, file) {
      this.loading = false
      if (res.success === true) {
        this.$message({
          type: 'success',
          message: '上传成功'
        })
        this.dialogImageUrl.push(file.response.queryResult.data)
      } else {
        this.$message({
          type: 'info',
          message: res.message
        })
        this.dialogImageUrl = []
      }
    },
    cancelAdd() {
      this.key = {}
      this.dialogImageUrl = []
      this.Spu = {}
      this.url = ''
      this.banner = []
      this.previewImg = ''
      this.srcList = {}
      this.$router.push({ path: '/farm/farminformation' })
    },
    checkImageWH(file, resolve, reject) {
      const _this = this
      const filereader = new FileReader()
      filereader.onload = e => {
        const src = e.target.result
        const image = new Image()
        image.onload = function() {
          if (this.width !== _this.GLOBAL.PRODUCT_DETAILS_WIDTH || this.height !== _this.GLOBAL.PRODUCT_DETAILS_HEIGHT) {
            _this.$message.warning(`请上传图片高度为750px宽度为750px的图片`)
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
        const bigLt2M = file.size < 20971520
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
    checkImageWHbaby(file, resolve, reject) {
      const _this = this
      const filereader = new FileReader()
      filereader.onload = e => {
        const src = e.target.result
        const image = new Image()
        image.onload = function() {
          if ((this.width !== _this.GLOBAL.PRODUCT_DETAIL)) {
            _this.$message.warning(`请上传宽度为750px的图片`)
            reject()
          } else {
            resolve()
          }
        }
        _this.loading = false
        image.onerror = reject
        image.src = src
      }
      _this.$message({
        showClose: true,
        message: '图片正在上传中,请稍等...',
        type: 'warning'
      })
      filereader.readAsDataURL(file)
    },
    handleBeforeUploadsbaby(file) {
      // 限制图片 格式、size、分辨率
      const that = this
      this.loading = true
      return new Promise(function(resolve, reject) {
        const isJPG = file.type === 'image/jpg'
        const isJPEG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'
        const bigLt2M = file.size < 20971520
        if (!(isJPG || isJPEG || isPNG)) {
          that.$message.warning('只能上传JPG 、JPEG 、 PNG格式的图片~',)
          reject()
        } else if (!bigLt2M) {
          that.$message.warning(`图片大小超过20M`)
          reject()
        } else {
          that.checkImageWHbaby(file, resolve, reject)
        }
      })
    },
    error() {
      this.$message({
        type: 'info',
        message: '文件上传失败'
      })
    }
  }
}
</script>
<style lang="scss">
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .el-card__body {
    padding: 20px;

  }

  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .form-container {
    width: 800px;
  }

  .el-upload--picture-card {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 90PX;
    height: 90px;
    line-height: 146px;
    vertical-align: top;
  }

  .el-divider {
    background-color: #0babf2;
    margin: 0px 5px 0px 0px;
    width: 5px;
    position: relative;
  }
  .el-upload--picture-card {
    float: right;
  }
  .inputNumber.input.el-input__inner {
    cursor: pointer;
    border-color: #C0C4CC;
    width: 200px;
  }
</style>
<style>
  #commodity .el-upload-list--picture-card .el-upload-list__item {
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 125px;
    height: 125px;
    margin: 0 8px 8px 0;
    display: inline-block;
  }
  .el-scrollbar__wrap {
       overflow-x: hidden;
  }
</style>
