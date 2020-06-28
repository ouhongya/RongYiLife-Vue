<!--商铺-->
<template>
  <div
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)"
    style="height: 1027px"
  >
    <div class="block " style="padding-right:5px;text-align: center;">
      <el-input v-model="input" placeholder="请输入内容" style="width: 300px" />
      <el-button size="small" icon="el-icon-plus" type="primary" @click="add">新建商铺</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :default-sort="{prop: 'createTimeStr', order: 'descending'}"
      @sort-change="fetchData"
    >
      <el-table-column
        prop="createTimeStr"
        label="创建日期"
        sortable
        align="center"
        width="130"
      >
        <template slot-scope="props">
          {{ props.row.createTimeStr | dateformat('YYYY-MM-DD HH:mm') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        sortable
        label="商铺地址"
        align="center"
      />
      <el-table-column
        prop="name"
        label="商铺名称"
        sortable
        align="center"
      />
      <el-table-column
        prop="usepws"
        label="所属账号"
        align="center"
      >
        <template slot-scope="props">
          {{ props.row.usepws|propData('暂无') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="communityName"
        label="所属小区"
        align="center"
      >
        <template slot-scope="props">
          {{ props.row.communityName|propData('暂无') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        align="center"
      >
        <template slot-scope="props">
          <p :style="{'color':(props.row.status===0 ? '#BBBBBB':'#3d8cff')}">
            {{ props.row.status===0 ? '未应用手机端':'已应用手机端' }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="300px"
        align="center"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.status!==1" type="primary" size="medium" disabled @click="applicationFarm(scope.row.id)">取消应用</el-button>
          <el-button v-if="scope.row.status===1" type="primary" size="medium" @click="applicationFarm(scope.row.id)">取消应用</el-button>
          <el-button size="small" type="primary" icon="el-icon-edit" @click="compilation(scope.row.id)">编辑</el-button>
          <el-button icon="el-icon-delete" type="danger" size="small" @click="strikeout(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--新建商铺-->
    <el-dialog
      title="新建商铺"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="addformVisible"
      :before-close="addclose"
      style="text-align: center"
    >
      <el-form ref="pojo" label-width="80px" :model="pojo">
        <el-form-item label="商铺名称" prop="name">
          <el-input v-model="pojo.name" />
        </el-form-item>
        <el-form-item label="选择位置" prop="address">
          <el-cascader
            v-model="community"
            :options="option"
            :props="props"
            @change="city"
          />
        </el-form-item>
        <el-form-item label="选择小区" prop="address">
          <div class="group-list">
            <el-checkbox-group v-for="radios in RadioList" v-model="checkList">
              <el-checkbox :label="radios.id"> {{ radios.cityName }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <div class="tableTitlecc" />
        <el-form-item label="已选小区" prop="address">
          <div class="group-list">
            <el-tag
              v-for="(tag,index) in tags"
              :key="index"
              closable
              @close="tagClose(tag)"
            >
              {{ tag.name }}
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item label="商铺地址" prop="address">
          <el-input v-model="pojo.address" />
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button size="medium" type="primary" @click="close()">关闭</el-button>
          <el-button size="medium" type="primary" @click="addsave(`pojo`)">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--编辑商铺-->
    <el-dialog
      title="编辑商铺"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="formVisible"
      :before-close="close"
      style="text-align: center"
    >
      <el-form ref="addpojo" label-width="80px" :model="addpojo">
        <el-form-item label="商铺名称" prop="name">
          <el-input v-model="addpojo.name" placeholder="商铺名称" />
        </el-form-item>
        <el-form-item label="商铺地址" prop="address">
          <el-input v-model="addpojo.address" placeholder="商铺地址" />
        </el-form-item>
        <el-form-item label="选择位置" prop="address">
          <el-cascader
            v-model="community"
            :options="option"
            :props="props"
            @change="city"
          />
        </el-form-item>
        <el-form-item label="选择小区" prop="address">
          <div class="group-list">
            <el-checkbox-group v-for="radios in RadioList" v-model="checkList">
              <el-checkbox :label="radios.id"> {{ radios.cityName }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <div class="tableTitlecc" />
        <el-form-item label="已选小区" prop="address">
          <div class="group-list">
            <el-tag
              v-for="(tag,index) in tags"
              :key="index"
              closable
              @close="tagClose(tag)"
            >
              {{ tag.name }}
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item label="所属账号" prop="address">
          <el-input v-model="addpojo.usepws" placeholder="所属账号" disabled />
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button size="medium" type="primary" @click="close">关闭</el-button>
          <el-button size="medium" type="primary" @click="save(`addpojo`)">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-pagination
      :current-page.sync="currentPage"
      :page-size="size"
      layout="total, prev, pager, next"
      :total="total"
      style="text-align: center"
      @size-change="fetchData"
      @current-change="fetchData"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      input: '',
      tableData: [], // 主页的数据绑定
      formVisible: false,
      pojo: {
        name: '',
        address: '',
        communityId: []
      },
      addpojo: {
        id: '',
        name: '',
        address: '',
        usepws: ''
      },
      addformVisible: false,
      option: [],
      addformVisible: false,
      active: 0,
      size: 11,
      total: 0,
      currentPage: 1,
      rules: {
        name: [
          { required: true, message: '请输入商铺名', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入正确的地址', trigger: 'blur' }
        ]
      },
      loading: false,
      props: {
        label: 'cityName',
        value: 'id',
        children: 'areas'
      },
      community: [],
      RadioList: [],
      checkList: [],
      tags: []
    }
  },
  watch: {
    checkList: function(checkList) {
      if (checkList.length === 0) {
        this.tags = []
      }
      if (checkList.length !== 0) {
        const arr = []
        this.option.forEach(item => {
          item.areas.forEach(val => {
            val.areasShow.forEach(area => {
              checkList.forEach(check => {
                if (check === area.id) {
                  const obj = {}
                  obj.name = area.cityName
                  obj.id = area.id
                  arr.push(obj)
                }
              })
            })
          })
        })
        this.tags = arr
      }
    },
    input: function(input) {
      if (input !== '' || input !== undefined) {
        this.fetchData()
      }
    }
  },
  created() {
    this.$message.closeAll()
    this.fetchData()
    this.cityCreate()
  },
  methods: {
    /* 初始化角色*/
    fetchData(val) {
      let order = 'desc'
      let name = 'created_time'
      if (val !== undefined && val.prop === `createTimeStr`) {
        if (val.order === undefined) {
          name = 'created_time'
          order = 'desc'
        }
        if (val.order === `descending`) {
          name = 'created_time'
          order = 'desc'
        }
        if (val.order === `ascending`) {
          name = 'created_time'
          order = 'asc'
        }
      }
      if (val !== undefined && val.prop === `address`) {
        if (val.order === undefined) {
          name = 'address'
          order = 'desc'
        }
        if (val.order === `descending`) {
          name = 'address'
          order = 'desc'
        }
        if (val.order === `ascending`) {
          name = 'address'
          order = 'asc'
        }
      }
      if (val !== undefined && val.prop === `name`) {
        if (val.order === undefined) {
          name = 'name'
          order = 'desc'
        }
        if (val.order === `descending`) {
          name = 'name'
          order = 'desc'
        }
        if (val.order === `ascending`) {
          name = 'name'
          order = 'asc'
        }
      }
      this.loading = true
      const input = this.input
      let url = ''
      if (input !== '') {
        url = `/server/unitshop/findAllStore?page=${this.currentPage}&size=${this.size}&search=${this.input}`
      }
      if (input === '') {
        url = `/server/unitshop/findAllStore?page=${this.currentPage}&size=${this.size}&search=${this.input}&sortByFiled=${name}&sortByOrder=${order}`
      }
      this.$axios.get(url).then(res => {
        this.loading = false
        const dataList = res.data.queryResult.data.list
        for (let x = 0; x < dataList.length; x++) {
          const name = []
          dataList[x].usepws = ''
          for (let i = 0; i < dataList[x].owners.length; i++) {
            if (i < dataList[x].owners.length - 1) {
              name.push(dataList[x].owners[i].ownerUsername + '_' + dataList[x].owners[i].ownerName + ',')
            } else {
              name.push(dataList[x].owners[i].ownerUsername + '_' + dataList[x].owners[i].ownerName)
            }
          }
          for (let c = 0; c < name.length; c++) {
            dataList[x].usepws += name[c]
          }
          if (dataList[x].storeCommunities.length !== 0) {
            let obj = ''
            dataList[x].storeCommunities.forEach(item => {
              obj += item.communityName + '_'
            })
            dataList[x].communityName = obj.substring(0, obj.length - 1)
          }
        }
        this.tableData = dataList
        /* 单个用户名处理*/
        this.total = res.data.queryResult.data.total
      }).catch(err => {
        this.loading = false
      })
    },
    /* 新建异常关闭*/
    addclose() {
      this.pojo = {}
      this.addformVisible = false
    },
    /* 新建异常关闭*/
    close() {
      this.addformVisible = false
      this.formVisible = false
      this.tags = []
      this.pojo = {}
      this.addpojo = {}
      this.community = []
      this.checkList = []
    },
    /* 编辑回显数据 pojo */
    compilation(id) {
      this.loading = true
      this.formVisible = true
      this.$axios.get(`/server/unitshop/findStoreById/${id}`).then(res => {
        this.loading = false
        this.addpojo = res.data.queryResult.data
        const dataList = res.data.queryResult.data
        const name = []
        for (let x = 0; x < dataList.owners.length; x++) {
          if (x < dataList.owners.length - 1) {
            name.push(dataList.owners[x].ownerUsername + '_' + dataList.owners[x].ownerName + ',')
          } else {
            name.push(dataList.owners[x].ownerUsername + '_' + dataList.owners[x].ownerName)
          }
        }
        let nameArr = ''
        for (let i = 0; i < name.length; i++) {
          nameArr += name[i]
        }
        this.addpojo.usepws = nameArr
        const arr = []
        dataList.storeCommunities.forEach((item, index) => {
          if (index === 0) {
            this.community = [item.cityId, item.areaId]
            this.option.forEach(cc => {
              cc.areas.forEach(val => {
                if (val.id === item.areaId) {
                  this.RadioList = val.areasShow
                }
              })
            })
          }
          const obj = {}
          obj.cityName = item.communityName
          obj.id = item.communityId
          arr.push(obj)
          this.checkList.push(item.communityId)
        })
      }).catch(err => {
        this.loading = false
      })
    },
    /* 添加商铺*/
    add() {
      this.addformVisible = true
    },
    /* 商铺的新增*/
    addsave(pojo) {
      this.$refs[pojo].validate((valid) => {
        if (this.pojo.name === '' || this.pojo.name === undefined) {
          this.$message({
            type: 'warning',
            message: '请输入商铺名称'
          })
          return
        }
        if (this.pojo.address === '' || this.pojo.address === undefined) {
          this.$message({
            type: 'warning',
            message: '请输入商铺地址'
          })
          return
        }
        this.pojo.communityId = this.community[2]
        this.loading = true
        this.pojo.communityIds = this.checkList
        this.$axios.post(`/server/unitshop/addStore`, this.pojo).then(res => {
          this.fetchData()
          this.RadioList = []
          this.tags = []
          this.community = []
          this.loading = false
          if (res.data.code === 10000) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
          } else {
            this.$message({
              type: 'info',
              message: res.data.queryResult.data
            })
          }
        }).catch(err => {
          this.loading = false
        })
        this.community = []
        this.addformVisible = false
        this.pojo = {}
      })
    },
    /* 商铺编辑保存*/
    save(addpojo) {
      this.$refs[addpojo].validate((valid) => {
        if (this.addpojo.name === '' || this.addpojo.name === undefined) {
          this.$message({
            type: 'warning',
            message: '请输入商铺名字'
          })
          return
        }
        if (this.addpojo.address === '' || this.addpojo.address === undefined) {
          this.$message({
            type: 'warning',
            message: '请输入商铺地址'
          })
          return
        }
        this.formVisible = false
        this.loading = true
        this.addpojo.communityIds = this.checkList
        this.$axios.post(`/server/unitshop/updateStore`, this.addpojo).then(res => {
          this.fetchData()
          this.close()
          this.loading = false
          if (res.data.code === 10000) {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
          } else {
            this.$message({
              type: 'info',
              message: '保存失败'
            })
          }
        }).catch(err => {
          this.$message({
            type: 'info',
            message: '系统繁忙请稍后再试'
          })
          this.loading = false
        })

        this.addpojo = {}
      })
    },
    /* 新建社区按钮*/
    shrine() {
      this.addformVisible = true
    },
    strikeout(id) {
      this.$confirm('此操作将永久删除此商铺, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$axios.delete(`/server/unitshop/deleteStore/${id}`).then(res => {
          this.fetchData()
          this.loading = false
          if (res.data.code === 10000) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.fetchData()
          } else {
            this.$message({
              type: 'info',
              message: res.data.queryResult.data
            })
            this.fetchData()
          }
        }).catch(error => {
          this.loading = false
        })
      }).catch(() => {})
    },
    cityCreate() {
      this.$axios.get(`/server/city/tree/community`).then((res) => {
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
    },
    city(value) {
      this.option.forEach(item => {
        item.areas.forEach(val => {
          if (val.id === value[1]) {
            this.RadioList = val.areasShow
          }
        })
      })
    },
    tagClose(tag) {
      if (this.checkList.length !== 0) {
        this.$confirm('是否删除:' + tag.name + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          for (let x = 0; x < this.checkList.length; x++) {
            if (this.checkList[x] === tag.id) {
              this.checkList.splice(x--, 1)
            }
          }
        }).catch(() => {})
      }
    },
    applicationFarm(id) {
      this.$confirm('此操作将该商铺在手机端不显示, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.put(`/server/store/apply/down/${id}`).then(res => {
          if (res.data.success === true) {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '操作成功'
            })
          }
          if (res.data.success !== true) {
            this.$message({
              type: 'success',
              message: res.data.message
            })
          }
        })
      }).catch(() => {})
    }
  }
}
</script>
<style lang="scss">
  .tableTitlecc {
    position: relative;
    margin: 0 auto;
    width: 400px;
    height: 1px;
    background-color: #d4d4d4;
    text-align: center;
    font-size: 16px;
    color: rgba(101, 101, 101, 1);
    margin-top: 5px;
  }

  form.el-form {
    width: 410px;
    margin: 0% 20% 0% 20%;
  }

  input.el-input__inner {
    cursor: pointer;
    border-color: #C0C4CC;
    width: 250px;
  }

  .group-list {
    max-height: 100px;
    overflow: auto;
  }

  .group-list::-webkit-scrollbar {
    width: 4px;
  }

  .group-list::-webkit-scrollbar-thumb {
    background-color: #d9d9d9;
  }
</style>
