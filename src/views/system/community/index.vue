<template>
  <div
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)"
    style="height: 1020px"
  >
    <div class="block " style="padding-right:5px;text-align: center;">
      <el-input v-model="input" placeholder="请输入内容" style="width: 300px" />
      <el-button size="medium" icon="el-icon-plus" type="primary" @click="add">新建小区</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :default-sort="{prop: 'createdTime', order: 'desc'}"
      @sort-change="fetchData"
    >
      <el-table-column
        prop="createdTime"
        label="创建日期"
        width="180"
        sortable
        align="center"
      >
        <template slot-scope="props">
          {{ props.row.createdTime | dateformat('YYYY-MM-DD HH:mm') }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        sortable
        label="小区名称"
      />
      <el-table-column
        prop="address"
        sortable
        label="小区地址"
        align="center"
      />
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button size="medium" type="primary" icon="el-icon-edit" @click="compilation(scope.row.id)">编辑</el-button>
          <el-button icon="el-icon-delete" type="danger" size="medium"@click="strikeout(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="新建小区"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="addformVisible"
      :before-close="clone"
      style="text-align: center"
    >
      <el-form ref="pojo" label-width="80px" :model="pojo">
        <el-form-item label="小区名称" prop="name">
          <el-input v-model="pojo.name" placeholder="请输入小区名" />
        </el-form-item>
        <el-form-item label="选择地址" prop="name">
          <el-cascader
            v-model="community"
            :options="option"
            :props="props"
            @change="city"
          />
        </el-form-item>
        <el-form-item label="小区地址" prop="address">
          <el-input v-if="community.length===0" v-model="pojo.address" placeholder="请输入详细地址" disabled />
          <el-input v-if="community.length!==0" v-model="pojo.address" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="primary" size="medium" @click="clone()">关闭</el-button>
          <el-button type="primary" size="medium" @click="addsave(`pojo`)">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="编辑小区"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="formVisible"
      :before-close="clone"
      style="text-align: center"
    >
      <el-form ref="addpojo" label-width="80px" :model="addpojo">
        <el-form-item label="小区名称" prop="name">
          <el-input v-model="addpojo.communityName" placeholder="小区名称" />
        </el-form-item>
        <el-form-item label="选择地址" prop="name">
          <el-cascader
            v-model="community"
            :options="option"
            :props="props"
            @change="city"
          />
        </el-form-item>
        <el-form-item label="小区地址" prop="address">
          <el-input v-model="addpojo.address" placeholder="小区地址" />
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="primary" size="medium" @click="clone">关闭</el-button>
          <el-button type="primary" size="medium" @click="save(`addpojo`)">保存</el-button>
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
      tableData: [], // 主页的数据绑定
      formVisible: false,
      pojo: {
        areaId: '',
        name: '',
        address: ''
      },
      addpojo: {
        areaId: '',
        communityName: '',
        address: ''
      },
      addformVisible: false,
      option: [], // 懒加载
      addformVisible: false,
      active: 0,
      size: 11,
      total: 0,
      currentPage: 1,
      rules: {
        name: [
          { required: true, message: '请输入小区地址', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入正确的地址', trigger: 'blur' }
        ]
      },
      loading: false,
      input: '',
      community: [],
      props: {
        label: 'cityName',
        value: 'id',
        children: 'areas'
      },
      shi: '',
      qu: ''

    }
  },
  watch: {
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
    clone() {
      this.addformVisible = false
      this.pojo.areaId = ''
      this.pojo.name = ''
      this.pojo.address = ''
      this.community = []
      this.formVisible = false
      this.addpojo.address = ''
      this.addpojo.name = ''
    },
    fetchData(val) {
      let order = 'desc'
      let name = 'created_time'
      if (val !== undefined && val.prop === `createdTime`) {
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
      this.$axios.get(`/server/community/all?page=${this.currentPage}&size=${this.size}&search=${this.input}&sortByFiled=${name}&sortByOrder=${order}`).then(res => {
        this.loading = false
        if (res.data.queryResult.data === null) {
          return
        }
        this.tableData = res.data.queryResult.data.list
        this.total = res.data.queryResult.data.total
      }).catch(error => {
        this.$message({
          type: 'info',
          message: '系统繁忙请稍后再试'
        })
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
      this.addpojo = {}
      this.formVisible = false
    },
    /* 编辑回显数据 pojo */
    compilation(id) {
      this.loading = true
      this.formVisible = true
      this.$axios.get(`/server/community/info/${id}`).then(res => {
        const data = res.data.queryResult.data
        const arr = []
        this.shi =
          arr.push(data.cityName)
        arr.push(data.areaName)
        this.community = arr
        this.loading = false
        this.addpojo = res.data.queryResult.data
      }).catch(error => {
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
            message: '请输入小区名称'
          })
          return
        }
        if (this.pojo.address === '' || this.pojo.address === undefined) {
          this.$message({
            type: 'warning',
            message: '请输入小区地址'
          })
          return
        }
        this.loading = true
        this.community = []
        this.$axios.post(`/server/community/add`, this.pojo).then(res => {
          this.fetchData()
          this.loading = false
          this.addformVisible = false
          this.pojo.areaId = ''
          this.pojo.name = ''
          this.pojo.address = ''
          this.fetchData()
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
        }).catch(error => {
          this.loading = false
        })
      })
    },
    /* 商铺编辑保存*/
    save(addpojo) {
      this.$refs[addpojo].validate((valid) => {
        if (this.addpojo.communityName === '' || this.addpojo.communityName === undefined) {
          this.$message({
            type: 'warning',
            message: '请输入小区名字'
          })
          return
        }
        if (this.addpojo.address === '' || this.addpojo.address === undefined) {
          this.$message({
            type: 'warning',
            message: '请输入小区地址'
          })
          return
        }
        this.formVisible = false
        this.loading = true
        this.addpojo.name = this.addpojo.communityName
        this.community = []
        this.$axios.post(`/server/community/update`, this.addpojo).then(res => {
          this.fetchData()
          this.addpojo = {}
          this.community = []
          this.loading = false
          if (res.data.code === 10000) {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
          } else {
            this.$message({
              type: 'info',
              message: res.data.message
            })
          }
        }).catch(error => {
          this.loading = false
        })
        this.addpojo = {}
        this.pojo.address = ''
      })
    },
    /* 新建社区按钮*/
    shrine() {
      this.addformVisible = true
    },
    /* 删除*/
    strikeout(id) {
      this.$confirm('此操作将永久删除此小区, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$axios.delete(`/server/community/delete/${id}`).then(res => {
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
    },
    city(value) {
      this.pojo.address = ''
      this.shi = ''
      this.qu = ''
      this.pojo.areaId = ''
      this.addpojo.address = ''
      this.addpojo.areaId = ''
      this.pojo.areaId = value[1]
      this.addpojo.areaId = value[1]
      let str = ''
      for (let x = 0; x < this.option.length; x++) {
        if (this.option[x].id === value[0]) {
          str += this.option[x].cityName
          this.addpojo.address += this.option[x].cityName
          this.shi = this.option[x].cityName
        }
        for (let a = 0; a < this.option[x].areas.length; a++) {
          if (this.option[x].areas[a].id === value[1]) {
            str += this.option[x].areas[a].cityName
            this.addpojo.address += this.option[x].areas[a].cityName
            this.qu = this.option[x].areas[a].id
          }
        }
      }
      this.pojo.address = str
    }
  }
}
</script>
<style lang="scss">
  form.el-form {
    width: 410px;
    margin:  0% 20% 0% 20%;
  }
  .app-container {
    padding: 10px;
  }
</style>
