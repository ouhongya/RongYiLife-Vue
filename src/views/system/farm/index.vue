<!--农场-->
<template>
  <div
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)"
    style="height: 1020px"
  >
    <div class="block " style="padding-right:5px;text-align: center;">
      <el-input v-model="input" placeholder="请输入内容" style="width: 300px;" />
      <el-button size="medium" icon="el-icon-plus" type="primary" @click="add">新建农场</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :default-sort="{prop: 'created_time', order: 'desc'}"
      :row-class-name="tableRowClassName"
      height="820px"
      @sort-change="fetchData"
    >
      <el-table-column
        prop="created_time"
        label="创建日期"
        sortable
        align="center"
        width="130"
      >
        <template slot-scope="props">
          {{ props.row.created_time | dateformat('YYYY-MM-DD HH:mm') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="农场地址"
        sortable
        align="center"
      />
      <el-table-column
        prop="name"
        label="农场名称"
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
        prop="score"
        label="积分"
        sortable
        align="center"
      />
      <el-table-column
        prop="defaultSort"
        label="排序"
        sortable
        align="center"
      >
        <template slot-scope="props">
          <el-popover
            id="popover2"
            v-model="props.row.visible2"
            placement="bottom"
            trigger="click"
          >
            <div style="text-align: right; margin: 0">
              <el-input v-model="sort" class="popover" on-keypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" type="number" />
              <el-button size="mini" type="text" @click="props.row.visible2 = false;sort=null">取消</el-button>
              <el-button type="primary" size="mini" @click="sortSubmit(props.row.id)">确定</el-button>
            </div>
          </el-popover>
          {{ props.row.defaultSort }}
          <el-button v-if="props.row.status===0" size="small" style="color: #8c939d" type="text" class="el-icon-edit" @click="props.row.visible2 = true;sort=props.row.defaultSort" />
          <el-button v-if="props.row.status===1" size="small" style="color: #409EFF" type="text" class="el-icon-edit" @click="props.row.visible2 = true;sort=props.row.defaultSort" />
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
        align="center"
        width="400px"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.status===1" type="primary" size="medium" @click="applicationFarm(scope.row.id)">取消应用</el-button>
          <el-button v-if="scope.row.status!==1" type="primary" size="medium" disabled @click="applicationFarm(scope.row.id)">取消应用</el-button>
          <el-button size="medium" type="primary" icon="el-icon-edit" @click="compilation(scope.row.id)">编辑</el-button>
          <el-button icon="el-icon-delete" type="danger" size="medium"@click="strikeout(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--编辑农场-->
    <el-dialog
      title="编辑农场"
      width="40%"
      :visible.sync="formVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="close"
      style="text-align: center"
    >
      <el-form ref="pojo" label-width="80px" :model="pojo" :rules="rules">
        <el-form-item label="农场名称" prop="name">
          <el-input v-model="pojo.name" />
        </el-form-item>
        <el-form-item label="排序数值" prop="name">
          <el-input v-model="pojo.defaultSort" type="number" :min="0" placeholder="请输入排序字段" />
        </el-form-item>
        <el-form-item label="选择地址" prop="name">
          <el-cascader
            v-model="community"
            :options="option"
            :props="props"
            @change="city"
          />
        </el-form-item>
        <el-form-item label="农场地址" prop="address">
          <el-input v-model="pojo.address" />
        </el-form-item>
        <el-form-item label="所属账号">
          <el-input v-model="pojo.usepws" disabled />
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button size="medium" type="primary" @click="closeSave()">关闭</el-button>
          <el-button size="medium" type="primary" @click="save(`pojo`)">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--新建农场-->
    <el-dialog
      title="新建农场"
      width="40%"
      :visible.sync="addformVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="addclose"
      style="text-align: center"
    >
      <el-form ref="addpojo" label-width="80px" :model="addpojo">
        <el-form-item label="农场名称" prop="name">
          <el-input v-model="addpojo.name" placeholder="请输入农场名称" />
        </el-form-item>
        <el-form-item label="排序字段" prop="defaultSort">
          <el-input v-model="addpojo.defaultSort" type="number" :min="0" placeholder="请输入排序字段" />
        </el-form-item>
        <el-form-item label="选择地址" prop="name">
          <el-cascader
            v-model="community"
            :options="option"
            :props="props"
            @change="city"
          />
        </el-form-item>
        <el-form-item label="农场地址" prop="address">
          <el-input v-if="community.length===0" v-model="addpojo.address" placeholder="请输入详细地址" disabled />
          <el-input v-if="community.length!==0" v-model="addpojo.address" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button size="medium" type="primary" @click="closeSave()">关闭</el-button>
          <el-button size="medium" type="primary" @click="addsave(`addpojo`)">保存</el-button>
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
        areaId: ``,
        name: '',
        address: '',
        defaultSort: 1
      }, // 编辑农场
      addpojo: {
        areaId: ``,
        name: '',
        address: '',
        defaultSort: 1
      }, // 添加农场
      imageUrl: '', // 图片回显,
      option: [], // 懒加载
      addformVisible: false,
      active: 0,
      size: 9,
      total: 0,
      currentPage: 1,
      form: {},
      rules: {
        name: [
          { required: true, message: '请输入农场名称', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入正确地址', trigger: 'blur' }
        ]
      },
      loading: false,
      input: '',
      props: {
        label: 'cityName',
        value: 'id',
        children: 'areas'
      },
      community: [],
      sort: null
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
    closeSave() {
      this.addformVisible = false
      this.formVisible = false
      this.community = []
      this.addpojo.cityId = ``
      this.addpojo.name = ``
      this.addpojo.address = ``
      this.addpojo.defaultSort = `1`
      this.pojo.cityId = ``
      this.pojo.name = ``
      this.pojo.address = ``
      this.pojo.defaultSort = `1`
    },
    /* 初始化角色*/
    fetchData(val) {
      let order = 'desc'
      let name = 'default_sort'
      if (val !== undefined && val.prop === `created_time`) {
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
      if (val !== undefined && val.prop === `score`) {
        if (val.order === undefined) {
          name = 'score'
          order = 'desc'
        }
        if (val.order === `descending`) {
          name = 'score'
          order = 'desc'
        }
        if (val.order === `ascending`) {
          name = 'score'
          order = 'asc'
        }
      }
      if (val !== undefined && val.prop === `defaultSort`) {
        if (val.order === undefined) {
          name = 'default_sort'
          order = 'desc'
        }
        if (val.order === `descending`) {
          name = 'default_sort'
          order = 'desc'
        }
        if (val.order === `ascending`) {
          name = 'default_sort'
          order = 'asc'
        }
      }
      this.loading = true
      let url = ''
      url = `/server/farm/all?page=${this.currentPage}&size=${this.size}&search=${this.input}&sortByFiled=${name}&sortByOrder=${order}`
      this.$axios.get(url).then(res => {
        this.loading = false
        if (res.data.queryResult.data === null) {
          return
        }
        this.tableData = res.data.queryResult.data.list
        this.total = res.data.queryResult.data.total
        const dataList = res.data.queryResult.data.list
        for (let x = 0; x < dataList.length; x++) {
          dataList[x].visible2 = false
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
        }
      })
    },
    /* 新建异常关闭*/
    close() {
      this.community = [],
      this.addpojo.cityId = ``
      this.addpojo.name = ``
      this.addpojo.address = ``
      this.addpojo.defaultSort = ``
      this.pojo.city = ``
      this.pojo.name = ``
      this.pojo.address = ``
      this.pojo.defaultSort = ``
      this.formVisible = false
      this.addformVisible = false
    },
    /* 新建异常关闭*/
    addclose() {
      this.addpojo = {}
      this.addformVisible = false
    },
    /* 编辑回显数据 pojo */
    compilation(id) {
      this.loading = true
      this.formVisible = true
      this.$axios.get(`/server/farm/farm/${id}`).then(res => {
        this.loading = false
        this.pojo = res.data.queryResult.data
        const dataList = res.data.queryResult.data
        this.community = [dataList.cityId, dataList.areaId]
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
        this.pojo.usepws = nameArr
      })
    },
    /* 添加农场*/
    add() {
      this.addformVisible = true
    },
    /* 农场新增保存*/
    addsave(addpojo) {
      this.$refs[addpojo].validate((valid) => {
        this.loading = false
        if (this.addpojo.name === '' || this.addpojo.name === undefined) {
          this.$message({
            type: 'warning',
            message: '请输入农场名称'
          })
          return
        }
        if (this.addpojo.defaultSort === '') {
          this.$message({
            type: 'warning',
            message: '请输入排序数值'
          })
          return
        }
        if (this.addpojo.address === '') {
          this.$message({
            type: 'warning',
            message: '请输入农场地址'
          })
          return
        }

        this.addformVisible = false
        this.loading = true
        this.$axios.post(`/server/farm/add`, this.addpojo).then(res => {
          this.closeSave()
          this.fetchData()
          this.loading = false
          if (res.data.code === 10000) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
          } else {
            this.$message({
              type: 'info',
              message: res.data.message
            })
          }
        })
      })
    },
    /* 农场编辑保存*/
    save(pojo) {
      this.$refs[pojo].validate((valid) => {
        if (this.pojo.name === '' || this.pojo.name === undefined) {
          this.$message({
            type: 'warning',
            message: '请输入农场名称'
          })
          return
        }
        if (this.pojo.defaultSort === '') {
          this.$message({
            type: 'warning',
            message: '请输入排序数值'
          })
          return
        }
        if (this.pojo.address === '' || this.pojo.address === undefined) {
          this.$message({
            type: 'warning',
            message: '请输入农场地址'
          })
          return
        }
        const user = {}
        user.id = this.pojo.id
        user.areaId = this.pojo.areaId
        user.name = this.pojo.name
        user.address = this.pojo.address
        user.defaultSort = this.pojo.defaultSort
        this.formVisible = false
        this.pojo = {}
        this.loading = true
        this.$axios.post(`/server/farm/update`, user).then(res => {
          this.loading = false
          this.fetchData()
          this.pojo = {}
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
        })
      })
    },
    /* 新建农场按钮*/
    shrine() {
      this.addformVisible = true
    },
    /* 删除*/
    strikeout(id) {
      this.$confirm('此操作将永久删除此农场, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$axios.delete(`/server/farm/delete/${id}`).then(res => {
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
        })
      }).catch(() => {})
    },
    city(value) {
      this.addpojo.areaId = ``
      this.pojo.address = ``
      this.addpojo.address = ''
      this.pojo.areaId = value[1]
      this.addpojo.areaId = value[1]
      let str = ''
      for (let x = 0; x < this.option.length; x++) {
        if (this.option[x].id === value[0]) {
          str += this.option[x].cityName
          this.addpojo.address += this.option[x].cityName
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
    },
    tableRowClassName({ row, rowIndex }) {
      /* if(row.status===0){
          return 'warning-row';
        }
        if(row.status===1){
          return 'success-row';
        }*/
    },
    applicationFarm(id) {
      this.$confirm('此操作将此农场在手机端不显示, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.put(`/server/farm/apply/down/${id}`).then(res => {
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
    },
    sortSubmit(id) {
      this.loading = false
      this.tableData.forEach(item => {
        if (item.id === id) {
          const obj = {
            id: id,
            sort: this.sort
          }
          this.$axios.put(`/server/farm/sort/${obj.id}/${obj.sort}`).then(res => {
            if (res.data.success === true) {
              this.loading = false
              this.fetchData()
              item.visible2 = false
              this.$message({
                type: 'success',
                message: '修改成功'
              })
            } else {
              this.$message({
                type: 'info',
                message: res.data.message
              })
            }
          })
          this.loading = false
        }
      })
    }
  }
}
</script>
<style>
  .el-table .warning-row {
    background: #BCC2D7;
  }

  .el-table .success-row {
    background: #409EFF;
  }
  /*div.el-dialog__body{
      width: 450px;
    text-align: center      ;
  }*/
  form.el-form {
    width: 410px;
    margin:  0% 20% 0% 20%;
  }
  .app-container {
    padding: 10px;
  }
</style>
