<template>
  <div
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)"
    style="height: 919px"
  >
    <div v-if="isInsider!==`0`" style="width: 100%;float: left">
      <el-card style="float: right;width: 50%;height:430px; margin: 5px">
        <el-button type="primary" size="small" style="float: right" @click="addToImg">上传&nbsp;编辑</el-button>
        <div class="circle">
          <ul class="circle-ul">
            <li v-for="(item,index) in classList" :key="index" class="circle-li">
              <img :src="item.url"height="114px" width="114px" alt>
            </li>
          </ul>
        </div>
        <el-card style="height: 135px;width: 315px;float: left;margin: 5px; border:1px solid #adb2b8">
          <div style="height: 100px;width: 180px;float: right; border:1px solid #ffffff">
            <div style="height: 100px;width: 180px;float: right;">
              <span style="font-size: 17px;padding: 3px;letter-spacing: 1px"><FONT><strong>&nbsp;&nbsp;{{ user.name.substring(0,5) }}...</strong></FONT></span>
              <span style="font-size: 10px;color: #0ff055;">0.0分</span>
              <br>
              <span v-if="user.intro!==null" style="letter-spacing: 1px;font-size: 14px;color: #8c939d">&nbsp;&nbsp;&nbsp;简介:{{ user.intro.substring(0,29) }}...</span>
              <br>
              <span class="el-icon-location-outline" style="font-size: 10px;color: #5a5e66;margin: 10px 0px 5px 0px">成都市温江区光华之心</span>
            </div>
          </div>
          <el-upload
            class="avatar-uploader"
            :action="url"
            :show-file-list="false"
            width="200px"
            :on-success="handleAvatarSuccess"
            :before-upload="handleBeforeUploads"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
          <i class="el-icon-warning" style="font-size: 10px;color: #8c939d">点击上传或图片即可上传一张店铺的缩略图,分辨率是:200*142</i>
        </el-card>
      </el-card>
      <div style="float: right;margin: 15px">
        <span><FONT><strong style="font-size: 18px;color: #676767">相册:&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;</strong></FONT></span>
      </div>
      <div class="divfather">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span><FONT><strong style="font-size: 15px;color: #676767;">欢迎尊敬的用户:{{ user.trueName }}</strong></FONT></span>
            <el-button style="float: right; padding: 3px 0;font-size: 15px" type="text" @click="modify">修改信息</el-button>
            <el-popover v-if="user.status===0" trigger="hover" placement="top" style="float: right; padding: 3px;font-size: 15px">
              <p>信息完整即可应用到手机端</p>
              <div slot="reference" class="name-wrapper">
                <el-button v-if="state===false" type="text" style="padding: 0px" disabled @click="application(user.companyId)">应用到手机端 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                <el-button v-if="state===true" type="text" style="padding: 0px" @click="application(user.companyId)">应用到手机端 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
              </div>
            </el-popover>
          </div>
          <div class="text item">
            <div class="divUser">
              积分:<span class="spanUser">{{ user.score }}</span>
              <div class="tableTitle" />
            </div>
            <div class="divUser">
              运费:<span class="spanUser">{{ user.freight }}</span>
              <div class="tableTitle" />
            </div>
            <div class="divUser">
              账户信息:
              <span class="spanName">{{ user.username }}</span>
              <div class="tableTitle" />
            </div>
            <div class="divUser">
              农场名称:
              <span class="spanName">{{ user.name }}</span>
              <div class="tableTitle" />
            </div>
            <div class="divUser">
              农场地址:
              <span class="spanName">{{ user.address }}</span>
              <div class="tableTitle" />
            </div>
            <div class="divUser">
              联系电话:
              <span class="spanName">{{ user.contactNum }}</span>
              <div class="tableTitle" />
            </div>
            <div class="divUser">
              店铺简介:
              <span class="spanName">{{ user.intro }}</span>
              <div class="tableTitle" />
            </div>
            <div class="divUser">
              店铺标签:
              <span v-for="(item,index) in user.tags" :key="index" class="spanName">
                <el-tag style="margin: 0px 0px 0px 5px">{{ item.name }}</el-tag>
              </span>
              <div class="tableTitle" />
            </div>
          </div>
        </el-card>
      </div>
      <div class="divTable">
        <el-card>
          <el-button size="small" style="margin: 0px 0px 0px 50%" type="primary" @click="centerDialogVisible=true">
            新增商品分类
          </el-button>
          <el-table
            :data="tableData"
            height="417"
            empty-text="暂时还没有类别，请稍后再来"
            style="width: 100%;"
          >
            <el-table-column
              prop="date"
              label="日期"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.createdTime | dateformat('YYYY-MM-DD') }}
              </template>
            </el-table-column>
            <el-table-column
              label="类型名称"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.categoryName }}
              </template>
            </el-table-column>
            <el-table-column
              label="商品数量"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.itemNum }}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
            >
              <template slot-scope="scope">
                <el-button size="small" type="primary" @click="edit(scope.row.id)">编辑</el-button>
                <el-button v-if="scope.row.itemNum===0" size="small" type="danger" @click="strike(scope.row.id)">删除
                </el-button>
                <el-button
                  v-if="scope.row.itemNum!==0"
                  size="small"
                  type="danger"
                  disabled
                  @click="strike(scope.row.id)"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>
    <div v-if="fefresh===1" style="width: 100%;float: left">
      <el-card style="float: right;width: 50%;height:430px; margin: 5px">
        <el-button type="primary" size="small" style="float: right" @click="addToImg">上传&nbsp;编辑</el-button>
        <div class="circle">
          <ul class="circle-ul">
            <li v-for="(item,index) in classList" :key="index" class="circle-li">
              <img :src="item.url"height="114px" width="114px" alt>
            </li>
          </ul>
        </div>
        <el-card style="height: 135px;width: 315px;float: left;margin: 5px; border:1px solid #adb2b8">
          <div style="height: 100px;width: 180px;float: right; border:1px solid #ffffff">
            <div style="height: 100px;width: 180px;float: right;">
              <span style="font-size: 17px;padding: 3px;letter-spacing: 1px"><FONT><strong>&nbsp;&nbsp;{{ user.name.substring(0,5) }}...</strong></FONT></span>
              <span style="font-size: 10px;color: #0ff055;">0.0分</span>
              <br>
              <span v-if="user.intro!==null" style="letter-spacing: 1px;font-size: 14px;color: #8c939d">&nbsp;&nbsp;&nbsp;简介:{{ user.intro.substring(0,29) }}...</span>
              <br>
              <span class="el-icon-location-outline" style="font-size: 10px;color: #5a5e66;margin: 10px 0px 5px 0px">成都市温江区光华之心</span>
            </div>
          </div>
          <el-upload
            class="avatar-uploader"
            :action="url"
            :show-file-list="false"
            width="200px"
            :on-success="handleAvatarSuccess"
            :before-upload="handleBeforeUploads"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
          <i class="el-icon-warning" style="font-size: 10px;color: #8c939d">点击上传或图片即可上传一张店铺的缩略图,分辨率是:200*142</i>
        </el-card>
      </el-card>
      <div style="float: right;margin: 15px">
        <el-button type="primary" size="medium" style="float: right" @click="permissionVisble=true">农场切换</el-button>
      </div>
      <div class="divfather">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span><FONT><strong style="font-size: 15px;color: #676767;">欢迎尊敬的用户:{{ user.trueName }}</strong></FONT></span>
            <el-button style="float: right; padding: 3px 0;font-size: 15px" type="text" @click="modify">修改信息</el-button>
            <el-popover v-if="user.status===0" trigger="hover" placement="top" style="float: right; padding: 3px;font-size: 15px">
              <p>信息完整即可应用到手机端</p>
              <div slot="reference" class="name-wrapper">
                <el-button v-if="state===false" type="text" style="padding: 0px" disabled @click="application(user.companyId)">应用到手机端 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                <el-button v-if="state===true" type="text" style="padding: 0px" @click="application(user.companyId)">应用到手机端 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
              </div>
            </el-popover>
          </div>
          <div class="text item">
            <div class="divUser">
              积分:<span class="spanUser">{{ user.score }}</span>
              <div class="tableTitle" />
            </div>
            <div class="divUser">
              运费:<span class="spanUser">{{ user.freight }}</span>
              <div class="tableTitle" />
            </div>
            <div class="divUser">
              账户信息:
              <span class="spanName">{{ user.username }}</span>
              <div class="tableTitle" />
            </div>
            <div class="divUser">
              农场名称:
              <span class="spanName">{{ user.name }}</span>
              <div class="tableTitle" />
            </div>
            <div class="divUser">
              农场地址:
              <span class="spanName">{{ user.address }}</span>
              <div class="tableTitle" />
            </div>
            <div class="divUser">
              联系电话:
              <span class="spanName">{{ user.contactNum }}</span>
              <div class="tableTitle" />
            </div>
            <div class="divUser">
              店铺简介:
              <span class="spanName">{{ user.intro }}</span>
              <div class="tableTitle" />
            </div>
            <div class="divUser">
              店铺标签:
              <span v-for="(item,index) in user.tags" :key="index" class="spanName">
                <el-tag style="margin: 0px 0px 0px 5px">{{ item.name }}</el-tag>
              </span>
              <div class="tableTitle" />
            </div>
          </div>
        </el-card>
      </div>
      <div class="divTable">
        <el-card>
          <el-button size="small" style="margin: 0px 0px 0px 50%" type="primary" @click="centerDialogVisible=true">
            新增商品分类
          </el-button>
          <el-table
            :data="tableData"
            height="417"
            style="width: 100%;"
          >
            <el-table-column
              prop="date"
              label="日期"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.createdTime | dateformat('YYYY-MM-DD HH:mm') }}
              </template>
            </el-table-column>
            <el-table-column
              label="类型名称"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.categoryName }}
              </template>
            </el-table-column>
            <el-table-column
              label="商品数量"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.itemNum }}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
            >
              <template slot-scope="scope">
                <el-button size="small" type="primary" @click="edit(scope.row.id)">编辑</el-button>
                <el-button v-if="scope.row.itemNum===0" size="small" type="danger" @click="strike(scope.row.id)">删除
                </el-button>
                <el-button
                  v-if="scope.row.itemNum!==0"
                  size="small"
                  type="danger"
                  disabled
                  @click="strike(scope.row.id)"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>
    <el-dialog
      :title="id===''?'添加商品类别':'编辑商品类别'"
      :visible.sync="centerDialogVisible"
      width="30%"
      :close-on-click-modal="false"
      :before-close="cancel"
      :close-on-press-escape="false"
      center
    >
      <el-form id="shurukaung1" label-width="60%">
        <el-form-item label="类别名:">
          <el-input v-model="category" placeholder="请输入类别名" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="cancel()">取 消</el-button>
        <el-button type="primary" size="medium" @click="send()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改信息"
      :visible.sync="Visible"
      :close-on-click-modal="false"
      custom-class="customWidth"
      width="40%"
      :close-on-press-escape="false"
      :before-close="close"
      :show-clos="false"
      style="text-align: center;"
    >
      <el-form ref="farm" :model="farm" label-width="80px">
        <el-form-item label="账户信息:">
          <el-input v-model="farm.account" disabled />
        </el-form-item>
        <el-form-item label="农场名称:">
          <el-input v-model="farm.name" disabled />
        </el-form-item>
        <el-form-item label="选择地址:">
          <el-cascader
            v-model="community"
            disabled
            :options="option"
            :props="props"
            @change="city"
          />
        </el-form-item>
        <el-form-item label="农场地址:">
          <el-input v-model="farm.address" placeholder="请输入农场地址" />
        </el-form-item>
        <el-form-item label="联系电话:">
          <el-input v-model="farm.contactNum" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="运费:">
          <el-input
            v-model="farm.freight"
            placeholder="请输入运费"
            :min="0"
            type="number"
            on-key-press="if (event.keyCode!=46 && event.keyCode!=45 && event.keyCode<48 || event.keyCode>57) event.returnValue=false"
            @change="money"
          />
        </el-form-item>
        <el-form-item label="店铺简介:">
          <el-input v-model="farm.intro" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="店铺标签:">
          <el-checkbox-group
            v-model="tags"
            style="overflow-y:auto; overflow-x:auto; width:100%; height:100px"
            :min="1"
            :max="3"
          >
            <el-checkbox v-for="(item,index) in tagList" :key="index" :label="item.id">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="medium" @click="close">取消</el-button>
      <el-button type="primary" size="medium" @click="onSubmit">确认</el-button>
    </el-dialog>
    <el-dialog
      title="请选择您要查看的农场"
      :visible.sync="permissionVisble"
      :close-on-click-modal="false"
      custom-class="customWidth"
      width="65%"
      :close-on-press-escape="false"
      :before-close="permissionClose"
      style="text-align: center;"
    >
      <div style="overflow-y: auto; width:100%; height:500px">
        <div class="RadioStyle">
          <div v-for="(val,index) in care" class="Block PaddingL">
            <input :id="val.id" type="radio" name="val.id">
            <label :id="val.id" :for="val.id" @click="clickOnSubmit(val.id)">{{ val.name }}</label>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  findInfo,
  createdInfo,
  categoryEdit,
  categoryAdd,
  categoryUpdate,
  categoryDelete,
  findByIdAndShop,
  updateFarmInfo,
  fetchImgList,
  chief,
  permissionFarm,
  applicationFarm
} from '@/api/farm'
export default {
  data() {
    return {
      user: {
        status: '',
        companyId: ``,
        name: '',
        address: '',
        score: '',
        trueName: '',
        username: '',
        contactNum: ``,
        intro: ``,
        tags: ``
      },
      imageUrl: '',
      tableData: [],
      centerDialogVisible: false,
      tableId: '',
      category: '',
      form: '',
      loading: false,
      id: '',
      Visible: false,
      farm: {
        id: ``,
        account: ``,
        name: ``,
        address: ``,
        contactNum: ``,
        intro: ``,
        tags: ``,
        freight: ``
      },
      community: [],
      props: {
        label: 'cityName',
        value: 'id',
        children: 'areas'
      },
      option: [],
      urlList: [],
      tagList: [],
      tags: [],
      dialogImageUrl: '',
      dialogVisible: false,
      a: true,
      classList: [],
      urlId: '',
      isInsider: ``,
      permissionVisble: false,
      care: [],
      permissionId: ``,
      fefresh: ``,
      state: false,
      url: '',
      arrList: []
    }
  },
  created() {
    this.permission()
    const id = window.localStorage.getItem('farm')
    if (id !== null) {
      this.url = '/server/farm/album/cover/add/' + id + '/'
    } else {
      this.url = '/server/farm/album/cover/add/' + window.localStorage.getItem('user').substring(0, window.localStorage.getItem('user').indexOf(',')) + '/'
    }
  },
  methods: {
    permission() {
      const user = window.localStorage.getItem('user')
      const farmId = window.localStorage.getItem('farm')
      this.isInsider = user.substring(user.indexOf(',') + 1, user.length)
      if (this.isInsider !== `0`) {
        this.fetchData()
        this.fetchTable()
        this.cityCreate()
        this.fetchImgList()
      }
      if (this.isInsider === `0`) {
        permissionFarm().then(res => {
          this.care = res.data.queryResult.data.list
          if (farmId === null) {
            this.permissionVisble = true
          }
          if (farmId !== null) {
            this.care.forEach(item => {
              if (item.id === farmId) {
                this.$message.closeAll()
                this.$message({
                  message: '当前位于:' + item.name,
                  type: 'success',
                  duration: 1000 * 5
                })
              }
            })
            this.loading = true
            findInfo(farmId).then(res => {
              this.fefresh = 1
              this.loading = false
              if (res.data.success === true) {
                this.user = res.data.queryResult.data
                if (this.user.contactNum !== null) {
                  this.state = true
                }
                if (this.user.intro !== null) {
                  this.state = true
                }
                this.permissionVisble = false
                const dataList = res.data.queryResult.data.account
                let name = ''
                for (let x = 0; x < dataList.length; x++) {
                  name += (dataList[x].username + '_' + dataList[x].trueName + ',')
                }
                this.user.username = name.substring(name.length - 1, 0)
              } else {
                this.$message({
                  type: 'info',
                  message: res.data.message
                })
              }
            })
            createdInfo(farmId).then(res => {
              this.loading = false
              if (res.data.success === true) {
                this.tableData = res.data.queryResult.data
              } else {
                this.$message({
                  type: 'info',
                  message: res.data.message
                })
              }
            })
            fetchImgList(farmId).then(res => {
              const dataList = res.data.queryResult.data
              const arr = []
              dataList.forEach(item => {
                if (item.isCover === 1) {
                  this.imageUrl = item.url
                }
                if (item.isCover !== 1) {
                  const obj = {}
                  obj.url = item.url
                  arr.push(obj)
                }
              })
              this.classList = arr
            })
          }
        })
        this.cityCreate()
      }
    },
    clickOnSubmit(id) {
      this.url = '/server/farm/album/cover/add/' + id + '/'
      this.permissionId = id
      window.localStorage.removeItem('farm')
      window.localStorage.setItem('farm', id)
      this.care.forEach(item => {
        if (item.id === this.permissionId) {
          this.$message.closeAll()
          this.$message({
            message: '当前位于:' + item.name,
            type: 'success',
            duration: 1000*5
          })
          window.localStorage.removeItem('farmName')
          window.localStorage.setItem('farmName',item.name)
        }
      })
      this.loading = true
      findInfo(this.permissionId).then(res => {
        this.fefresh = 1
        this.loading = false
        if (res.data.success === true) {
          this.user = res.data.queryResult.data
          if (this.user.contactNum !== null) {
            this.state = true
          }
          if (this.user.intro !== null) {
            this.state = true
          }
          this.permissionVisble = false

          const dataList = res.data.queryResult.data.account
          let name = ''
          for (let x = 0; x < dataList.length; x++) {
            name += (dataList[x].username + '_' + dataList[x].trueName + ',')
          }
          this.user.username = name.substring(name.length - 1, 0)
        } else {
          this.$message({
            type: 'info',
            message: res.data.message
          })
        }
      })
      createdInfo(this.permissionId).then(res => {
        this.loading = false
        if (res.data.success === true) {
          this.tableData = res.data.queryResult.data
        } else {
          this.$message({
            type: 'info',
            message: res.data.message
          })
        }
      })
      fetchImgList(this.permissionId).then(res => {
        const dataList = res.data.queryResult.data
        this.imageUrl = []
        const arrList = []
        dataList.forEach(item => {
          if (item.isCover === 1) {
            this.imageUrl = item.url
          }
        })
        dataList.forEach(item => {
          if (item.isCover !== 1) {
            arrList.push(item)
          }
        })
        this.classList = arrList
        this.arrList = arrList
      })
    },
    fetchData() {
      this.loading = true
      findInfo('null').then(res => {
        this.loading = false
        if (res.data.success === true) {
          this.user = res.data.queryResult.data
          const dataList = res.data.queryResult.data.account
          this.user.companyId = res.data.queryResult.data.account[0].companyId
          let name = ''
          for (let x = 0; x < dataList.length; x++) {
            name += (dataList[x].username + '_' + dataList[x].trueName + ',')
          }
          this.user.username = name.substring(name.length - 1, 0)
          this.user.shopId = dataList[0].companyId
          if (this.user.contactNum !== null) {
            this.state = true
          } else {
            this.state = false
          }
          if (this.user.intro !== null) {
            this.state = true
          } else {
            this.state = false
          }
          window.localStorage.removeItem('farmName')
          window.localStorage.setItem('farmName',this.user.name)
        } else {
          this.$message({
            type: 'info',
            message: res.data.message
          })
        }
      })
      this.loading = false
    },
    fetchTable() {
      this.loading = true
      createdInfo('null').then(res => {
        this.loading = false
        if (res.data.success === true) {
          this.tableData = res.data.queryResult.data
        } else {
          this.$message({
            type: 'info',
            message: res.data.message
          })
        }
      })
      this.loading = false
    },
    fetchImgList() {
      fetchImgList('null').then(res => {
        const dataList = res.data.queryResult.data
        const arrList = []
        dataList.forEach(item => {
          if (item.isCover === 1) {
            this.imageUrl = item.url
          }
        })
        dataList.forEach(item => {
          if (item.isCover !== 1) {
            arrList.push(item)
          }
        })
        this.classList = arrList
      })
    },
    cityCreate() {
      this.$axios.get(`/server/city/tree`).then((res) => {
        const data = res.data.queryResult.data
        for (let x = 0; x < data.length; x++) {
          for (let a = 0; a < data[x].areas.length; a++) {
            const arr = {}
            arr.id = data[x].areas[a].id
            arr.cityName = data[x].areas[a].areaName
            data[x].areas[a] = (arr)
          }
        }
        this.option = data
      })
      this.$axios.get(`/server/tag/all`).then((res) => {
        const data = res.data.queryResult.data
        this.tagList = data.list
      })
    },
    money() {
      this.farm.freight = parseFloat(this.farm.freight).toFixed(2)
    },
    modify() {
      this.Visible = true
      if (this.isInsider === '0') {
        findByIdAndShop(window.localStorage.getItem('farm')).then(res => {
          const dataList = res.data.queryResult.data
          this.farm = dataList
          this.community = [dataList.cityId, dataList.areaId]
          let name = ``
          for (let x = 0; x < dataList.owners.length; x++) {
            name += (dataList.owners[x].ownerUsername + '_' + dataList.owners[x].ownerName + ',')
          }
          this.farm.account = name.substring(name.length - 1, 0)
          dataList.tags.forEach(item => {
            this.tags.push(item.id)
          })
        })
      }
      if (this.isInsider !== '0') {
        findByIdAndShop(this.user.companyId).then(res => {
          const dataList = res.data.queryResult.data
          this.farm = dataList
          this.community = [dataList.cityId, dataList.areaId]
          let name = ``
          for (let x = 0; x < dataList.owners.length; x++) {
            name += (dataList.owners[x].ownerUsername + '_' + dataList.owners[x].ownerName + ',')
          }
          this.farm.account = name.substring(name.length - 1, 0)
          dataList.tags.forEach(item => {
            this.tags.push(item.id)
          })
        })
      }
    },
    edit(id) {
      this.id = id
      this.loading = true
      this.centerDialogVisible = true
      categoryEdit(id).then(res => {
        this.loading = false
        if (res.data.success === true) {
          const data = res.data.queryResult.data
          this.category = data.name
          this.tableId = data.id
        } else {
          this.$message({
            type: 'info',
            message: res.data.message
          })
        }
      })
      this.loading = false
    },
    send() {
      this.id = ''
      if (this.tableId === '') {
        if (this.category === '' || this.category === undefined) {
          this.$message({
            type: 'warning',
            message: '请输入商品类型名称'
          })
          return
        }
        const goods = {}
        goods.name = this.category
        this.centerDialogVisible = false
        this.tableId = ''
        this.category = ''
        this.loading = true
        if (this.isInsider === `0`) {
          categoryAdd(window.localStorage.getItem('farm'), goods).then(res => {
            createdInfo(window.localStorage.getItem('farm')).then(res => {
              this.loading = false
              if (res.data.success === true) {
                this.tableData = res.data.queryResult.data
              } else {
                this.$message({
                  type: 'info',
                  message: res.data.message
                })
              }
            })
            this.loading = false
            if (res.data.success === true) {
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
        }
        if (this.isInsider !== `0`) {
          categoryAdd(`null`, goods).then(res => {
            this.fetchTable()
            this.loading = false
            if (res.data.success === true) {
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
        }
        this.loading = false
      }
      if (this.tableId !== '') {
        if (this.category === '' || this.category === undefined) {
          this.$message({
            type: 'warning',
            message: '请输入商品类型名称'
          })
          return
        }
        const goods = {}
        goods.id = this.tableId
        goods.name = this.category
        this.centerDialogVisible = false
        this.loading = false
        if (this.isInsider === '0') {
          categoryUpdate(this.tableId, this.category).then(res => {
            this.tableId = ''
            this.category = ''
            createdInfo(window.localStorage.getItem('farm')).then(res => {
              this.loading = false
              if (res.data.success === true) {
                this.tableData = res.data.queryResult.data
              } else {
                this.$message({
                  type: 'info',
                  message: res.data.message
                })
              }
            })
            this.loading = false
            if (res.data.success === true) {
              this.$message({
                type: 'success',
                message: res.data.message
              })
            } else {
              this.$message({
                type: 'info',
                message: res.data.message
              })
            }
          })
        }
        if (this.isInsider !== '0') {
          categoryUpdate(this.tableId, this.category).then(res => {
            this.tableId = ''
            this.category = ''
            this.fetchTable()
            this.loading = false
            if (res.data.success === true) {
              this.$message({
                type: 'success',
                message: res.data.message
              })
            } else {
              this.$message({
                type: 'info',
                message: res.data.message
              })
            }
          })
        }
        this.loading = false
        this.tableId = ''
        this.category = ''
      }
    },
    onSubmit() {
      if (this.farm.address === `` || this.farm.address === undefined) {
        this.$message({
          type: 'warning',
          message: '请输入农场地址'
        })
        return
      }
      if (this.farm.contactNum === `` || this.farm.contactNum === undefined) {
        this.$message({
          type: 'warning',
          message: '请输入联系电话'
        })
        return
      }
      if (this.farm.contactNum.length !== 11) {
        this.$message({
          type: 'warning',
          message: '请输入正确的联系电话'
        })
        return
      }
      if (this.farm.intro === `` || this.farm.intro === undefined) {
        this.$message({
          type: 'warning',
          message: '请输入店铺简介'
        })
        return
      }
      this.farm.tags = []
      const arr = []
      this.tags.forEach(item => {
        const obj = {}
        obj.id = item
        arr.push(obj)
      })
      this.farm.tags = arr
      this.farm.id = window.localStorage.getItem('farm')
      const user = window.localStorage.getItem('user')
      if (this.isInsider !== '0') {
        this.farm.id = user.substring(0, user.indexOf(','))
      }
      updateFarmInfo(this.farm).then(res => {
        this.close()
        if (this.isInsider !== `0`) {
          this.fetchData(`null`)
        }
        if (this.isInsider === `0`) {
          findInfo(window.localStorage.getItem('farm')).then(res => {
            this.loading = false
            if (res.data.success === true) {
              this.user = res.data.queryResult.data
              const dataList = res.data.queryResult.data.account
              let name = ''
              for (let x = 0; x < dataList.length; x++) {
                name += (dataList[x].username + '_' + dataList[x].trueName + ',')
              }
              this.user.username = name.substring(name.length - 1, 0)
              if (this.user.contactNum !== null) {
                this.state = true
              } else {
                this.state = false
              }
              if (this.user.intro !== '') {
                this.state = true
              } else {
                this.state = false
              }
            } else {
              this.$message({
                type: 'info',
                message: res.data.message
              })
            }
          })
        }
        if (res.data.success === true) {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        }
        if (res.data.success !== true) {
          this.$message({
            type: 'info',
            message: '修改失败'
          })
        }
      })
    },
    cancel() {
      this.centerDialogVisible = false
      this.tableId = ''
      this.id = ''
      this.category = ''
    },
    strike(id) {
      this.$confirm('您确定要删除当前的商品分类吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        if (this.isInsider === `0`) {
          categoryDelete(window.localStorage.getItem('farm'), id).then(res => {
            if (this.isInsider === '0') {
              createdInfo(window.localStorage.getItem('farm')).then(res => {
                this.loading = false
                if (res.data.success === true) {
                  this.tableData = res.data.queryResult.data
                } else {
                  this.$message({
                    type: 'info',
                    message: res.data.message
                  })
                }
              })
            }
            if (this.isInsider !== '0') {
              this.fetchTable()
            }
            this.loading = false
            if (res.data.success === true) {
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
        }
        if (this.isInsider !== `0`) {
          categoryDelete(`null`, id).then(res => {
            this.fetchTable()
            this.loading = false
            if (res.data.success === true) {
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
        }
      })
      this.loading = false
    },
    city() {
    },
    changeList(id) {
      this.urlId = id
      if (this.a == id) {
        this.a = !this.a
      } else {
        this.a = id
      }
    },
    chief() {
      if (this.urlId !== ``) {
        this.classList.forEach(item => {
          item.isCover = 0
        })
        this.classList.forEach(item => {
          if (item.id === this.urlId) {
            item.isCover = 1
          }
        })
        if (this.isInsider === '0') {
          chief(window.localStorage.getItem('farm'), this.classList).then(res => {
            this.urlId = ``
            if (res.data.success === true) {
              fetchImgList(window.localStorage.getItem('farm')).then(res => {
                const dataList = res.data.queryResult.data
                const arrList = []
                dataList.forEach(item => {
                  if (item.isCover === 1) {
                    arrList.push(item)
                  }
                })
                dataList.forEach(item => {
                  if (item.isCover !== 1) {
                    arrList.push(item)
                  }
                })
                this.classList = arrList
              })
              this.$message({
                type: 'success',
                message: '设置成功'
              })
            }
            if (res.data.success !== true) {
              this.$message({
                type: 'info',
                message: res.data.message
              })
            }
          })
        }
        if (this.isInsider !== '0') {
          chief('null', this.classList).then(res => {
            this.urlId = ``
            if (res.data.success === true) {
              this.fetchImgList()
              this.$message({
                type: 'success',
                message: '设置成功'
              })
            }
            if (res.data.success !== true) {
              this.$message({
                type: 'info',
                message: res.data.message
              })
            }
          })
        }
      }
      if (this.urlId === ``) {
        this.$message({
          type: 'info',
          message: '请选择一张图片'
        })
        return
      }
    },
    close() {
      this.Visible = false
      this.farm.id = ``
      this.farm.account = ``
      this.farm.name = ``
      this.farm.address = ``
      this.farm.contactNum = ``
      this.farm.intro = ``
      this.farm.tags = ``
      this.tags = []
    },
    addToImg() {
      this.$router.push({ path: '/farm/farmAddToImg' })
    },
    permissionClose() {
      this.permissionVisble = false
    },
    application(id) {
      if (this.isInsider === '0') {
        applicationFarm(window.localStorage.getItem('farm')).then(res => {
          if (res.data.success === true) {
            findInfo(window.localStorage.getItem('farm')).then(res => {
              this.loading = false
              if (res.data.success === true) {
                this.user = res.data.queryResult.data
                console.log(res.data.queryResult.data)
                const dataList = res.data.queryResult.data.account
                this.user.companyId = res.data.queryResult.data.account[0].companyId
                let name = ''
                for (let x = 0; x < dataList.length; x++) {
                  name += (dataList[x].username + '_' + dataList[x].trueName + ',')
                }
                this.user.username = name.substring(name.length - 1, 0)
                this.user.shopId = dataList[0].companyId
                if (this.user.contactNum !== null) {
                  this.state = ``
                }
                if (this.user.intro !== null) {
                  this.state = ``
                }
              } else {
                this.$message({
                  type: 'info',
                  message: res.data.message
                })
              }
            })
          }
          this.$message({
            type: 'success',
            message: '设置成功'
          })
          if (res.data.success !== true) {
            if (res.data.code === 3) {
              this.$message({
                type: 'info',
                message: '请上传封面图'
              })
            }
            if (res.data.code !== 3) {
              this.$message({
                type: 'info',
                message: res.data.message
              })
            }
            if (res.data.code === 1) {
              this.$message({
                type: 'info',
                message: '您还没有输入手机号或店铺简介'
              })
            }
          }
        })
      }
      if (this.isInsider !== '0') {
        applicationFarm(id).then(res => {
          if (this.isInsider !== '0') {
            this.fetchData()
          }
          this.$message({
            type: 'success',
            message: '设置成功'
          })
          if (res.data.success !== true) {
            if (res.data.code === 3) {
              this.$message({
                type: 'info',
                message: '请上传封面图'
              })
            }
            if (res.data.code !== 3) {
              this.$message({
                type: 'info',
                message: res.data.message
              })
            }
            if (res.data.code === 1) {
              this.$message({
                type: 'info',
                message: '您还没有输入手机号或店铺简介'
              })
            }
          }
        })
      }
    },
    handleAvatarSuccess(res, file) {
      if (res.queryResult !== undefined) {
        if (res.success === true) {
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.imageUrl = res.queryResult.data.url
        }
        if (res.success !== true) {
          this.$message({
            type: 'info',
            message: res.message
          })
        }
      }
    },
    checkImageWH(file, resolve, reject) {
      const _this = this
      const filereader = new FileReader()
      filereader.onload = e => {
        const src = e.target.result
        const image = new Image()
        image.onload = function() {
          if ((this.width !== _this.GLOBAL.PRODUCT_SHOP_Thumbnail_WIDTH) || this.height !== _this.GLOBAL.PRODUCT_SHOP_Thumbnail_HEIGHT) {
            _this.$message.warning(`请上传图片高度为200x宽度为142px的图片`)
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
        const bigLt2M = file.size / 1024 < (1024 * 50)
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
<style scoped>
  .RadioStyle label {
    border: 1px solid #00a4ff;
    padding: 2px 10px 2px 5px;
    line-height: 28px;
    min-width: 80px;
    text-align: center;
    float: left;
    margin: 15px 0px 15px 20px;
    border-radius: 4px
  }

  .RadioStyle input {
    display: none
  }

  .RadioStyle input:checked + label {
    background: url(yes.svg) no-repeat right bottom;
    background-size: 21px 21px;
    color: #00a4ff
  }

  .el-table__expanded-cell[class*=cell] {
    padding: 0px 0px 30px 50px;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
  }

  .divUser {
    font-size: 16px;
    padding: 10px;
    color: #676767;
  }

  .tableTitle {
    position: relative;
    margin: 0 auto;
    width: 700px;
    height: 1px;
    background-color: #d4d4d4;
    text-align: center;
    font-size: 16px;
    color: rgba(101, 101, 101, 1);
    margin-top: 5px;
  }

  .spanUser {
    margin: 0px 0px 0px 40px;
  }

  .spanName {

  }

  .divfather {
    padding: 5px;
    width: 40%;
  }

  .divTable {
    clear: both;
    padding: 5px;
    width: 100%;
    float: left;
  }

  .el-dialog--center .el-dialog__body {
    text-align: initial;
    padding: 20px;
  }

  .input_category {
    margin: 0px 0px 0px 100px;
  }

  .inputtest {
    cursor: pointer;
    border-color: #C0C4CC;
    width: 250px;
    margin: 0px 0px 0px 150px;
  }

  .el-form-item__content {
    line-height: 40px;
    position: relative;
    font-size: 14px;
  }

  .el-dialog__title {
    line-height: 24px;
    font-size: 25px;
    color: #676767;
  }

  circle {
    position: relative;
    width: 632px;
    left: 15px;
  }

  .circle-ul{
    width: 100%;
    height: 250px;
  }

  .circle-li {
    margin-right: 20px;
    list-style: none;
    margin-bottom: 20px;
  }

  /*.topic-shade{
    display: none;
  }*/
  .changeBorder {
    width: 114px;
    height: 114px;
    position: relative;
    cursor: pointer;
    border: 1px dashed #969696;
    margin: -1px -8px 0 -8px;
  }

  .topic-shade {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: absolute;
    top: 122px;
    /*
        right: 0;
    */
    bottom: 0;
    left: 100px;
  }

  .shade {
    margin-bottom: 4px;
  }

  .circle-ul {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: flex-start;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    width: 90%;
    padding: 0;
    margin: 14px 0 0 50px;
  }
  img.avatar {
    width: 120px;
    height: 100px;
    display: block;
    float: right;
  }
  i.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    float: right;
  }
</style>
