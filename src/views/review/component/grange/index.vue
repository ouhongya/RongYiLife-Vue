<template>
  <div
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)"
    style="height: 950px"
  >
    <div style="width: 50%;float: left;">
      <el-card class="form-container" style="width: 100%;text-align: center;line-height: 60px;height: 100%" shadow="never">
        <el-form
          ref="key"
          :model="key"
          label-position="left"
          label-width="80px"
          class="demo-ruleForm"
          style="width: 100%;margin: 0px"
        >
          <el-form-item label="商品图片" height="90px" style="width: 100%">
            <el-upload
              action="/server/farmitemimg/upload"
              list-type="picture-card"
              :file-list="fileList"
              disabled
              accept="image/jpeg,image/gif,image/png"
              :before-upload="onBeforeUpload"
              :on-success="handleAvatarSuccess"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
            >
              <i class="el-icon-plus" />
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="80%" :src="previewImg" alt="">
            </el-dialog>
          </el-form-item>
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="key.name" type="textarea" disabled />
          </el-form-item>
          <el-form-item label="商品描述" prop="subTitle">
            <el-input
              v-model="key.description"
              :auto-size="true"
              type="textarea"
              disabled
              placeholder="请输入内容"
            />
          </el-form-item>
          <el-form-item label="宝贝详情">
            <el-upload
              action="/server/farmitemimg/upload"
              list-type="picture-card"
              :limit="1"
              disabled
              :file-list="fileBabyList"
              accept="image/jpeg,image/gif,image/png"
              :before-upload="babyonBeforeUpload"
              :on-success="babyhandleAvatarSuccess"
              :on-preview="babyhandlePictureCardPreview"
              :on-remove="babyhandleRemove"
            >
              <i class="el-icon-plus" />
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="80%" :src="previewImg" alt="">
            </el-dialog>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-input v-model="options" disabled />
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
                  <el-input v-model="props.row.unit" class="input" type="text" style="width: 150px;" placeholder="请输入商品规格" disabled />
                </template>
              </el-table-column>
              <el-table-column
                prop="price"
                label="单价"
              >
                <template slot-scope="props">
                  <el-input-number v-model="props.row.price" controls-position="right" placeholder="请输入商品价格" disabled />
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-button type="primary" @click="goback()">返回</el-button>
          <el-button type="danger" @click="Review(key.id)">审核不通过</el-button>
          <el-button type="primary" @click="onSubmit(key.id)">审核通过</el-button>
        </el-form>
      </el-card>
    </div>
    <div style="width: 35%;float: right;">
      <p>
        <FONT><strong style="line-height: 20px;font-size: 15px;color: #676767 ">预览图</strong></FONT>
      </p>
      <el-card class="form-container" style="width: 50%;height: 100%" shadow="never">
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
            <div class="demo-image__lazy">
              <el-image
                v-for="image in dialogImageUrl"
                width="100%"
                height="100%"
                :src="image"
                :preview-src-list="dialogImageUrl"
                lazy
              />
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog
      title="请输入您的意见"
      :visible.sync="centerDialogVisible"
      width="30%"
      :close-on-click-modal="false"
      :before-close="clone"
      :close-on-press-escape="false"
      center
    >
      <span slot="footer" class="dialog-footer">
        <el-input
          v-model="textarea2"
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          style="padding: 15px 15px"
        />
        <el-button @click="clone">取 消</el-button>
        <el-button type="primary" @click="center()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { fetchDataId, operation, center } from '@/api/reviewGrange'
export default {
  data() {
    return {
      centerDialogVisible: false,
      textarea2: '',
      state: '',
      fileList: [],
      fileBabyList: [],
      key: {
        name: '',
        urlList: '',
        description: '',
        id: ''
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
      options: '',
      props: {
        value: 'id'
      },
      loading: false,
      id: ''
    }
  },
  created() {
    this.$message.closeAll()
    this.fetchData()
  },
  methods: {
    clone() {
      this.centerDialogVisible = false
      this.id = ''
      this.textarea2 = ''
    },
    fetchData() {
      const id = this.$route.query.id
      this.state = this.$route.query.state
      this.loading = true
      fetchDataId(id).then(res => {
        const data = res.data.queryResult.data
        console.log(data.name)
        this.key.name = data[0].name
        this.key.id = data[0].id
        this.key.description = data[0].description
        this.options = data[0].categoryId
        const arrUrl = []
        const babyUrl = []
        this.Spu[0].unit = data[0].spec.unit
        this.Spu[0].price = data[0].spec.price
        for (let x = 0; x < data[0].imgUrls.length; x++) {
          if (data[0].imgUrls[x].location !== -1) {
            this.banner.push(data[0].imgUrls[x].url)
            const urlList = {}
            urlList.url = data[0].imgUrls[x].url
            arrUrl.push(urlList)
          }
          if (data[0].imgUrls[x].location === -1) {
            this.dialogImageUrl.push(data[0].imgUrls[x].url)
            const urlList = {}
            urlList.url = data[0].imgUrls[x].url
            babyUrl.push(urlList)
          }
          this.fileList = arrUrl
          this.fileBabyList = babyUrl
        }
      })
      /* this.$axios.get(`/server/farmitem/item/${id}`).then(res=>{
          let dataList = res.data.queryResult.data
          console.log(dataList,'dataList')
          this.key.name=dataList.name
          this.key.id=dataList.id
          this.key.description=dataList.description
          this.option=dataList.categoryId
          this.Spu[0].unit=dataList.spec.unit
          this.Spu[0].price=dataList.spec.price
          let arrUrl =[]
          let babyUrl=[]
          for(let x=0;x<dataList.imgUrls.length;x++){
            if(dataList.imgUrls[x].location!==-1){
              this.banner.push(dataList.imgUrls[x].url)
              let urlList ={}
              urlList.url=dataList.imgUrls[x].url
              arrUrl.push(urlList)
            }
            if(dataList.imgUrls[x].location===-1){
              this.dialogImageUrl.push(dataList.imgUrls[x].url)
              let urlList = {};
              urlList.url= dataList.imgUrls[x].url;
              babyUrl.push(urlList)
            }
            this.fileList=arrUrl
            this.fileBabyList=babyUrl
          }
        })
        this.$axios.get(`/server/farm/category/all`).then(res=>{
          this.loading=false
          let dataList =res.data.queryResult.data
          console.log(dataList)
          let arr= []
          for(let x=0;x<dataList.length;x++){
            let name={}
            name.id=dataList[x].id
            name.label=(dataList[x].name)
            arr.push(name)
          }
          this.options=arr
        })*/
      this.loading = false
    },
    onSubmit(id) {
      const user = {}
      const arr = []
      arr.push(id)
      user.comment = ''
      user.ids = arr
      this.loading = true
      operation(user).then(res => {
        this.loading = false
        if (res.data.success === true) {
          this.$router.push({ path: '/review/reviewgrange' })
          this.$message({
            type: 'success',
            message: res.data.message
          })
        } else {
          this.$message({
            type: 'info',
            message: res.data.message
          })
          this.loading = false
        }
      })
      this.loading = false
    },
    Review(id) {
      this.centerDialogVisible = true
      this.id = id
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
      user.comment = this.textarea2
      user.ids = arr
      this.loading = true
      center(user).then(res => {
        this.loading = false
        if (res.data.success === true) {
          this.$router.push({ path: '/review/reviewgrange' })
          this.$message({
            type: 'success',
            message: res.data.message
          })
        } else {
          this.$message({
            type: 'info',
            message: res.data.message
          })
          this.loading = false
        }
      })
      this.loading = false
    },
    goback() {
      this.$router.push({ path: '/review/reviewgrange' })
    },
    handleRemove(file, fileList) {
      console.log(file, 'file')
      for (let x = 0; x < this.banner.length; x++) {
        if (this.banner[x] === file.url) {
          this.banner.splice(x, 1)
        }
      }
    },
    handlePictureCardPreview(file) {
      this.previewImg = file.url
      this.dialogVisible = true
    },
    test() {
      console.log(this.srcList)
      console.log(this.srcList)
    },
    onBeforeUpload(file) {
      var _this = this
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function(e) {
        // 图片base64化
        var newUrl = this.banner[0] // 图片路径
        _this.imgUrl = newUrl
      }
      const isIMAGE = file.type === 'image/jpeg' || 'image/gif' || 'image/png'
      const isLt1M = file.size / 1024 / 1024 < 3

      if (!isIMAGE) {
        this.$message.error('上传文件只能是图片格式!')
      }
      if (!isLt1M) {
        this.$message.error('上传文件大小不能超过 3MB!')
      }
      return isIMAGE && isLt1M
    },
    handleAvatarSuccess(res, file) {
      this.banner.push(file.url)
    },
    babyhandleRemove(file, fileList) {
      console.log(file, 'file')
      for (let x = 0; x < this.dialogImageUrl.length; x++) {
        if (this.dialogImageUrl[x] === file.url) {
          this.dialogImageUrl.splice(x, 1)
        }
      }
    },
    babyhandlePictureCardPreview(file) {
      this.previewImg = file.url
      this.dialogVisible = true
    },
    babyonBeforeUpload(file) {
      const isIMAGE = file.type === 'image/jpeg' || 'image/gif' || 'image/png'
      const isLt1M = file.size / 1024 / 1024 < 5

      if (!isIMAGE) {
        this.$message.error('上传文件只能是图片格式!')
      }
      if (!isLt1M) {
        this.$message.error('上传文件大小不能超过 5MB!')
      }
      return isIMAGE && isLt1M
    },
    babyhandleAvatarSuccess(res, file) {
      this.dialogImageUrl.push(file.url)
    },
    cancelAdd() {
      this.key = {}
      this.dialogImageUrl = []
      this.Spu = {}
      this.url = ''
      this.banner = []
      this.previewImg = ''
      this.srcList = {}
      this.$router.push({ path: '/review/reviewgrange' })
    }
  }
}
</script>
<style>
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
  .el-upload-list--picture-card .el-upload-list__item-actions{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;

    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0,0,0,.5);
    -webkit-transition: opacity .3s;
    transition: opacity .3s;
  }
  .el-input.is-disabled .el-input__inner {
    background-color: #F5F7FA;
    border-color: #E4E7ED;
    color: #606266;
    cursor: not-allowed;
  }
  .el-textarea.is-disabled .el-textarea__inner {
    background-color: #F5F7FA;
    border-color: #E4E7ED;
    color: #606266;
    cursor: not-allowed;
  }
</style>
