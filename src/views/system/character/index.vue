<!--角色设置-->
<template>
  <div
    id="app"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)"
    style="min-height: 918px"
  >
    <div class="block " style="padding-right:5px;text-align: center;">
      <el-input v-model="input" placeholder="请输入内容" style="width: 300px" />
      <el-button size="small" type="primary" icon="el-icon-plus" style="height: 37px" @click="add">添加角色</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :default-sort="{prop: 'createdTimeStr', order: 'desc'}"
      @sort-change="fetchData"
    >
      <el-table-column prop="createTimeStr" align="center" sortable label="日期">
        <template slot-scope="props" prop="createTimeStr">
          {{ props.row.createTimeStr | dateformat('YYYY-MM-DD HH:mm') }}
        </template>
      </el-table-column>
      <el-table-column prop="roleName" align="center" sortable label="角色名" />
      <!--<el-table-column prop="number" label="绑定人数"/>-->
      <el-table-column prop="permission" align="center" label="拥有权限">
        <template slot-scope="props">
          <el-popover
            placement="top"
            width="290"
            trigger="hover"
            :content="props.row.permissions"
          >
            <el-button slot="reference" type="text" style="color: rgb(90, 94, 102);">{{ props.row.permission }}</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300px">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" type="primary" size="small" @click="edit(scope.row.id)">编辑</el-button>
          <el-button icon="el-icon-delete" type="danger" size="small" @click="shan(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--编辑角色-->
    <el-dialog
      title="编辑角色"
      :visible.sync="formVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="customWidth"
      :before-close="bianjiclose"
      style="text-align: center;"
    >
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="编辑角色" />
        <el-step title="选择权限" />
        <el-step title="编辑完成" />
      </el-steps>
      <div v-show="active===0" style="padding-top: 40px">
        <el-form ref="form" :model="form" label-width="80px" style="margin: auto" :rules="rules">
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="form.roleName" placeholder="请输入角色名" />
          </el-form-item>
        </el-form>
      </div>
      <div v-show="active===1" style=" overflow-y:auto; overflow-x:auto; width:100%; height:500px">
        <div v-for="(city,index) in dataps">
          <el-checkbox-group
            v-model="modules"
            style="text-align: left;margin: 0px 0px 0px 180px;font-style:oblique;font-size:18px;"
            @change="bjJs(city.id,city.flag,index)"
          >
            <el-checkbox :key="index" :label="city.id"><FONT><strong>{{ city.parentFunctionName }}</strong></FONT></el-checkbox>
          </el-checkbox-group>
          <div style="margin: 2px;padding-bottom: 2px" />
          <el-checkbox-group v-model="role" style="text-align: left;margin: 0px 0px 0px 210px;font-size: 15px">
            <el-checkbox
              v-for="(test,index) in city.functions"
              :key="index"
              :label="test.id"
              @change="compileCheckBox(test.flag,test.id,test,index)"
            >{{ test.functionName }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div v-show="active===2" style="padding-top: 30px">
        <el-form ref="form" :model="form" label-width="80px" style="margin: auto" :rules="rules">
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="form.roleName" placeholder="请输入角色名" />
          </el-form-item>
        </el-form>
        <div style="width: 100%;height: 25px;font-size: 13px">
          <span style="padding: 0px 150px 0px 0px;font-size: 15px;margin: 0px 0px 0px 140px"><FONT><strong> 拥有权限</strong></FONT></span>
        </div>
        <div style=" overflow-y:auto; overflow-x:auto; width:100%; height:200px">
          <div v-for="(city,index) in result">
            <el-checkbox-group
              v-model="modelAndRole"
              style="text-align: left;margin: 0px 0px 0px 180px;font-style:oblique;font-size:18px;"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox :key="index" :label="city" disabled><FONT><strong>{{ city.modelName }}</strong></FONT></el-checkbox>
            </el-checkbox-group>
            <div style="margin: 2px;padding-bottom: 2px" />
            <el-checkbox-group v-model="testRole" style="text-align: left;margin: 0px 0px 0px 210px;font-size: 15px">
              <el-checkbox v-for="(test,index) in city.model" :key="index" :label="test" disabled>{{ test }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <el-button style="margin-top: 12px;" class="buttontest" size="medium" type="primary" @click="addnext">{{ active===0 ? '取消':'上一步' }}</el-button>
      <el-button style="margin-top: 12px;" class="buttontest" size="medium" type="primary" @click="next('form')">{{ active===2 ? '完成':'下一步' }}</el-button>
    </el-dialog>
    <!--添加角色-->
    <el-dialog
      title="添加角色"
      :visible.sync="addformVisible"
      custom-class="customWidth"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="addclose"
      style="text-align: center;"
    >
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="添加角色" />
        <el-step title="选择权限" />
        <el-step title="设置完成" />
      </el-steps>
      <div v-show="active===0" style="width: 350px;margin-left:28%;padding: 30px">
        <el-form id="shurukaung" ref="form" :model="form" label-width="80px" :rules="rules">
          <el-form-item label="角色名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名" />
          </el-form-item>
        </el-form>
      </div>
      <div v-show="active===1" style="overflow-y:auto; overflow-x:auto; width:100%; height:500px">
        <div v-for="(p,index) in per" style="margin: 5px 0px 0px 0px;">
          <el-checkbox-group v-model="roles" style="margin: 0px 750px 0px 150px;">
            <el-checkbox :key="index" :label="p.id" style="font-style:oblique;" @change="checkboxTest(p.flag,index)"><FONT><strong>{{ p.parentFunctionName }}</strong></FONT>
            </el-checkbox>
          </el-checkbox-group>
          <div style="margin: 2px;padding-bottom: 2px" />
          <el-checkbox-group v-model="functions" style="text-align: left;margin: 0px 0px 0px 190px">
            <el-checkbox
              v-for="(city,index) in p.functions"
              :key="index"
              style="font-size:18px;"
              :label="city.id"
              @change="checkboxEffect(city.id,index,city.flag)"
            >{{ city.functionName }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div v-show="active===2">
        <el-form ref="form" :model="form" label-width="80px" style="width: 350px;margin-left:28%">
          <el-form-item label="角色名">
            <el-input v-model="form.name" placeholder="请输入角色名" />
          </el-form-item>
          <div style="width: 100%;height: 25px;font-size: 13px">
            <span style="padding: 0px 150px 0px 0px;font-size: 15px;margin: 0px 0px 0px 140px"><FONT><strong> 拥有权限</strong></FONT></span>
          </div>
        </el-form>
        <div style=" overflow-y:auto; overflow-x:auto; width:100%; height:200px">
          <div v-for="(city,index) in result">
            <el-checkbox-group
              v-model="modelAndRole"
              style="text-align: left;margin: 0px 0px 0px 180px;font-style:oblique;"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox :key="index" :label="city" disabled><FONT><strong>{{ city.modelName }}</strong></FONT></el-checkbox>
            </el-checkbox-group>
            <div style="margin: 2px;padding-bottom: 2px" />
            <el-checkbox-group
              v-model="testRole"
              style="text-align: left;margin: 0px 0px 0px 210px;"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox v-for="(test,index) in city.model" :key="index" :label="test" disabled style="font-size: 15px">{{ test }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <el-button style="margin-top: 12px;" class="buttontest" size="medium" type="primary" @click="addnextrole">{{ active===0 ? '取消':'上一步' }}
      </el-button>
      <el-button style="margin-top: 12px;" class="buttontest" size="medium" type="primary" @click="nextrole('form')">{{ active===2 ? '完成':'下一步' }}</el-button>
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
const cityOptions = []
export default {
  data() {
    return {
      input: '',
      modelAndRole: [],
      testRole: [],
      modules: [],
      role: [],
      tableData: [],
      formVisible: false, // 弹框的控制false是关true是开;编辑用户的
      pojo: {}, // 也就是弹框里边的双向数据绑定绑定
      tableData3: [],
      roleOptions: [{ value: 'role', label: '农场管理员' }],
      addformVisible: false, /* 添加用户的弹框*/
      active: 0,
      form: {
        name: ''
      }, // 添加用户pojo
      external: [], // 第二次选项
      multipleSelection: [],
      radio: '',
      name: '',
      accountRadio: 1,
      checkedCities: [], // 这里是他们绑定的值
      cities: cityOptions,
      isIndeterminate: false,
      per: [],
      radio3: '',
      checkAll: [],
      state: 1,
      currentPage: 1,
      total: 0,
      size: 11,
      functions: [],
      roles: [],
      roleName: [],
      functionsa: [],
      dataps: '',
      functionName: [],
      rules: {
        name: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ],
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ]
      },
      result: [],
      loading: false,
      imput: ''
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
  },
  methods: {
    addclose() {
      this.form.name = {}
      this.addformVisible = false
      this.active = 0
      this.roles = []
      this.functions = []
      this.form = {}
      this.fetchData()
    },
    bianjiclose() {
      this.formVisible = false
      this.active = 0
      this.form = {}
      this.modules = []
      this.role = []
    },
    /* 初始化数据*/
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
      if (val !== undefined && val.prop === `roleName`) {
        if (val.order === undefined) {
          name = 'role_name'
          order = 'desc'
        }
        if (val.order === `descending`) {
          name = 'role_name'
          order = 'desc'
        }
        if (val.order === `ascending`) {
          name = 'role_name'
          order = 'asc'
        }
      }
      this.loading = true
      const input = this.input
      let url = ''
      url = `/server/character/findAllRole?page=${this.currentPage}&size=${this.size}&search=${this.input}&sortByFiled=${name}&sortByOrder=${order}`
      this.$axios.get(url).then(res => {
        this.loading = false
        const pageList = res.data.queryResult.data.list
        const page = res.data.queryResult.data
        if (page === null) {
          return
        }
        this.tableData = pageList
        this.total = page.total
        for (let i = 0; i < this.tableData.length; i++) {
          /* 权限集处理*/
          const cc = []
          for (let w = 0; w < this.tableData[i].functions.length; w++) {
            cc.push(this.tableData[i].functions[w].functionName)
          }
          this.tableData[i].permissionList = cc
          /* 页面展示的字符串拼接*/
          let permissions = ''
          for (let y = 0; y < this.tableData[i].permissionList.length; y++) {
            permissions += this.tableData[i].permissionList[y] + ','
          }
          this.tableData[i].permissions = permissions.substring(0, permissions.length - 1)
          /* 单个角色处理*/
          let permission = ''
          for (let p = 0; p < this.tableData[i].permissionList.length; p++) {
            permission = this.tableData[i].permissionList[0]
          }
          this.tableData[i].permission = permission
        }
      }).catch(error => {
        this.$message({
          type: 'info',
          message: '系统繁忙请稍后再试'
        })
        this.loading = false
      })
    },
    /* 添加角色*/
    add() {
      this.loading = true
      this.addformVisible = true
      this.$axios.get(`/server/character/findAllFunction`).then((res) => {
        this.loading = false
        this.per = res.data.queryResult.data
        const dataList = res.data.queryResult.data
        for (let a = 0; a < dataList.length; a++) {
          dataList[a].flag = false
          for (let i = 0; i < dataList[a].functions.length; i++) {
            dataList[a].functions[i].flag = false
          }
        }
        this.per = dataList
      }).catch(error => {
        this.$message({
          type: 'info',
          message: '系统繁忙请稍后再试'
        })
        this.loading = false
      })
    },
    /* 保存*/
    save() {
      this.formVisible = false
    },
    /* 编辑回显角色*/
    edit(id) {
      this.loading = true
      this.formVisible = true
      this.$axios.get(`/server/character/findRoleByRid/${id}`).then(res => {
        this.loading = false
        const dataList = res.data.queryResult.data
        this.form = dataList.role
        for (let i = 0; i < dataList.role.ps.length; i++) {
          this.modules.push(dataList.role.ps[i].id)
          for (let c = 0; c < dataList.role.ps[i].functions.length; c++) {
            this.role.push(dataList.role.ps[i].functions[c].id)
          }
        }
        for (let i = 0; i < dataList.ps.length; i++) {
          dataList.ps[i].flag = false
          for (let x = 0; x < dataList.ps[i].functions.length; x++) {
            dataList.ps[i].functions[x].flag = false
          }
        }
        this.dataps = dataList.ps
        this.dataps.forEach(item => {
          this.modules.forEach(model => {
            if (item.id === model) {
              item.flag = true
            }
          })
        })
      }).catch(error => {
        this.loading = false
      })
    },
    close() {
      this.functions = {}
      this.roles = {}
      this.addformVisible = false
      this.addformVisible = false
      this.active = 0
      this.accountRadio = 1
    },
    /* 删除角色*/
    shan(id) {
      this.$confirm('此操作将永久删除此角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$axios.delete(`/server/character/deleteRole/${id}`).then(res => {
          this.loading = false
          this.fetchData()
          if (res.data.code === 10000) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          } else {
            this.$message({
              type: 'info',
              message: '删除失败,该角色绑定了用户'
            })
          }
        }).catch(error => {
          this.$.message({
            type: 'info',
            message: '系统繁忙请稍后再试'
          })
        })
        this.loading = false
      }).catch(() => {})
    },
    addsave() {
      this.addformVisible = false
    },
    next(form) {
      if (this.active++ === 2) this.active = 3
      if (this.active === 1) {
        if (this.form.roleName === '' || this.form.roleName === undefined) {
          this.$message({
            type: 'warning',
            message: '请输入正确的角色名'
          })
          return this.active = 0
        }
      }
      if (this.active === 2) {
        this.result = []
        this.functionName = []
        function unique1(arr) {
          const hash = []
          for (let i = 0; i < arr.length; i++) {
            if (hash.indexOf(arr[i]) == -1) {
              hash.push(arr[i])
            }
          }
          return hash
        }
        const rolelist = unique1(this.role)
        const p = this.dataps
        for (let w = 0; w < p.length; w++) {
          for (let e = 0; e < p[w].functions.length; e++) {
            for (let r = 0; r < rolelist.length; r++) {
              if (rolelist[r] === p[w].functions[e].id) {
                this.functionName.push(p[w].functions[e].functionName)
              }
            }
          }
        }

        const functionsa = unique1(this.role)
        const ps = this.dataps
        /* 数据组装*/
        const modul = []
        for (let w = 0; w < ps.length; w++) {
          const a = []
          for (let e = 0; e < ps[w].functions.length; e++) {
            for (let r = 0; r < functionsa.length; r++) {
              if (ps[w].functions[e].id === functionsa[r]) {
                const modeulAndRole = {}
                modeulAndRole.modelName = (ps[w].functions[e].parentFunctionName)
                a.push(ps[w].functions[e].functionName)
                modeulAndRole.model = (a)
                modul.push(modeulAndRole)
              }
            }
          }
        }
        var obj = {}
        for (var i = 0; i < modul.length; i++) {
          if (!obj[modul[i].modelName]) {
            this.result.push(modul[i])
            obj[modul[i].modelName] = true
          }
        }
        for (let h = 0; h < this.result.length; h++) {
          this.modelAndRole.push(this.result[h])
          for (let c = 0; c < this.result[h].model.length; c++) {
            this.testRole.push(this.result[h].model[c])
          }
        }
      }
      if (this.active === 3) {
        this.$refs[form].validate((valid) => {
          const dataps = this.dataps
          const roles = this.form
          roles.functions = []
          for (let w = 0; w < dataps.length; w++) {
            for (let y = 0; y < dataps[w].functions.length; y++) {
              for (let r = 0; r < this.role.length; r++) {
                if (dataps[w].functions[y].id === this.role[r]) {
                  roles.functions.push(dataps[w].functions[y])
                }
              }
            }
          }
          roles.roleName = this.form.roleName
          if (this.form.roleName === '') {
            this.$message({
              type: 'info',
              message: '请输入角色名'
            })
            this.active = 2
            return
          }
          if (this.functionName.length === 0) {
            this.$message({
              type: 'info',
              message: '最少选择一个权限'
            })
            this.active = 2
            return
          }
          this.formVisible = false
          this.active = 0
          this.form = {}
          this.modules = []
          this.role = []
          this.loading = true
          this.$axios.post(`/server/character/updateRole`, roles).then(res => {
            this.fetchData()
            this.loading = false
            if (res.data.code === 10000) {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
            } else {
              this.$message({
                type: 'info',
                message: res.data.queryResult.data
              })
            }
          }).catch(error => {
            this.$message({
              type: 'info',
              message: '系统繁忙请稍后再试'
            })
            this.loading = false
          })
        })
      }
    },
    addnext() {
      if (this.active-- === 0) this.active = -1
      if (this.active === -1) {
        this.formVisible = false
        this.accountRadio = this.accountRadio
        this.active = 0
      }
    },
    nextrole(form) {
      if (this.active++ === 2) this.active = 3
      if (this.active === 1) {
        if (this.form.name === '' || this.form.name === undefined) {
          this.$message({
            type: 'warning',
            message: '请输入正确的角色名'
          })
          return this.active = 0
        }
      }
      if (this.active === 2) {
        this.result = []
        this.functionName = []
        function unique1(arr) {
          const hash = []
          for (let i = 0; i < arr.length; i++) {
            if (hash.indexOf(arr[i]) == -1) {
              hash.push(arr[i])
            }
          }
          return hash
        }
        const functionList = unique1(this.functions)
        const p = this.per
        for (let w = 0; w < p.length; w++) {
          for (let e = 0; e < p[w].functions.length; e++) {
            for (let r = 0; r < functionList.length; r++) {
              if (functionList[r] === p[w].functions[e].id) {
                this.functionName.push(p[w].functions[e].functionName)
              }
            }
          }
        }
        /* 角色编辑*/
        function unique(arr) {
          return Array.from(new Set(arr))
        }

        const functionsa = unique(this.functions)
        const ps = this.per
        /* 数据组装*/
        const modul = []
        for (let w = 0; w < ps.length; w++) {
          const a = []
          for (let e = 0; e < ps[w].functions.length; e++) {
            for (let r = 0; r < functionsa.length; r++) {
              if (ps[w].functions[e].id === functionsa[r]) {
                const modeulAndRole = {}
                modeulAndRole.modelName = (ps[w].functions[e].parentFunctionName)
                a.push(ps[w].functions[e].functionName)
                modeulAndRole.model = (a)
                modul.push(modeulAndRole)
              }
            }
          }
        }
        var obj = {}
        for (var i = 0; i < modul.length; i++) {
          if (!obj[modul[i].modelName]) {
            this.result.push(modul[i])
            obj[modul[i].modelName] = true
          }
        }
        for (let h = 0; h < this.result.length; h++) {
          this.modelAndRole.push(this.result[h])
          for (let c = 0; c < this.result[h].model.length; c++) {
            this.testRole.push(this.result[h].model[c])
          }
        }
      }
      if (this.active === 3) {
        function unique1(arr) {
          const hash = []
          for (let i = 0; i < arr.length; i++) {
            if (hash.indexOf(arr[i]) == -1) {
              hash.push(arr[i])
            }
          }
          return hash
        }
        const functionList = unique1(this.functions)
        this.$refs[form].validate((valid) => {
          let data = this.tableData[0]
          data = {}
          data.roleName = this.form.name
          data.functions = functionList
          if (this.form.name === '') {
            this.$message({
              type: 'info',
              message: '请输入角色名'
            })
            this.active = 2
            return
          }
          if (data.functions.length === 0) {
            this.$message({
              type: 'info',
              message: '最少选择一个权限'
            })
            this.active = 2
            return
          }
          this.active = 0
          this.roles = []
          this.functions = []
          this.form = {}
          this.addformVisible = false
          this.modelAndRole = []
          this.testRole = []
          this.loading = true
          this.$axios.post(`/server/character/addRole`, data).then(res => {
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
                message: res.data.queryResult.data
              })
            }
          }).catch(error => {
            this.$message({
              type: 'info',
              message: '系统繁忙请稍后再试'
            })
            this.loading = false
          })
        })
      }
    },
    addnextrole() {
      if (this.active-- === 0) this.active = -1
      if (this.active === -1) {
        this.form = {}
        this.addformVisible = false
        this.accountRadio = this.accountRadio
        this.active = 0
      }
    },
    className(row) {
      if (row.columnIndex === 0) {
        return 'DisableSelection'
      }
    },
    bjJs(id, flag, index) {
      const p = this.dataps[index]
      if (flag === false) {
        p.flag = true
        this.dataps[index] = p
        for (let x = 0; x < p.functions.length; x++) {
          p.functions[x].flag = true
          this.role.push(p.functions[x].id)
          this.dataps[index] = p
        }
        return
      }
      if (flag === true) {
        if (p.id === id) {
          for (let i = 0; i < p.functions.length; i++) {
            for (let y = 0; y < this.role.length; y++) {
              if (p.functions[i].id === this.role[y]) {
                p.flag = false
                p.functions[i].flag = false
                this.dataps[index] = p
                this.role.splice(y--, 1)
              }
            }
          }
          return
        }
      }
    },
    compileCheckBox(flag, id, test, index) {
      const per = this.dataps[index]
      if (flag === false) {
        for (let x = 0; x < this.models.length; x++) {
          if (this.modules !== per.id) {
            for (let r = 0; r < per.functions.length; r++) {
              if (per.functions[r].id === id) {
                per.functions[r].flag = true
              }
            }
            per.flag = true
            this.modules.push(per.id)
            this.dataps[index] = per
            return
          }
        }
      }
      if (flag === true) {
        const arr = []
        for (let r = 0; r < per.functions.length; r++) {
          if (per.functions[r].id === id) {
            for (let x = 0; x < this.role.length; x++) {
              if (per.functions[r].id === this.role) {
                arr.push(per.functions[r].id)
              }
            }
            if (arr.length <= 1) {
              for (let y = 0; y < this.modules.length; y++) {
                if (this.modules === p.id) {
                  this.dataps = per.functions[r].flag = false
                  this.modules.splice(y, 1)
                }
              }
            }
          }
        }
        return
      }
    },
    /* 添加角色的连接选中*/
    checkboxTest(flag, index) {
      const p = this.per[index]
      var roleid = p.id
      /* flag模块的状态值 false未选中.true选中,index当前点击那个模块*/
      if (p.flag === false) {
        for (let q = 0; q < p.functions.length; q++) {
          p.functions[q].flags = true
          this.functions.push(p.functions[q].id)
        }
        p.flag = true
        return
      }
      if (p.flag === true) {
        /* 模块名的处理*/
        for (let w = 0; w < this.roles.length; w++) {
          if (this.roles[w] === roleid) {
            this.roles.splice(w, 1)
          }
        }
        /* 权限名的处理*/
        for (let e = 0; e < this.functions.length; e++) {
          for (let r = 0; r < p.functions.length; r++) {
            if (this.functions[e] === p.functions[r].id) {
              p.functions.flag = false
              this.functions.splice(e, 1)
              p.flag = false
            }
          }
        }
        return
      }
    },
    /* 添加角色的二级菜单联动效果*/
    checkboxEffect(id, index, flag) {
      function unique(arr) {
        return Array.from(new Set(arr))
      }
      Array.prototype.remove = function(dx) {
        if (isNaN(dx) || dx > this.length) {
          return false
        }
        for (var i = 0, n = 0; i < this.length; i++) {
          if (this[i] != this[dx]) {
            this[n++] = this[i]
          }
        }
        this.length -= 1
      }
      const per = this.per
      /* 没有父元素的进去添加*/
      if (this.roles.length === 0) {
        for (let x = 0; x < per.length; x++) {
          for (let c = 0; c < per[x].functions.length; c++) {
            if (per[x].functions[c].id === id) {
              per[x].flag = true
              per[x].functions.flag = true
              this.roles.push(this.per[x].id)
              this.per = unique(per)
            }
          }
        }
        return
      }
      /* 当有父元素的时候添加*/
      const arr = []
      for (let x = 0; x < per.length; x++) {
        for (let v = 0; v < per[x].functions.length; v++) {
          for (let c = 0; c < this.roles.length; c++) {
            if (flag === false) {
              if (per[x].functions[v].id === id) {
                if (this.roles[c] !== per[x].id) {
                  per[x].functions[v].flag = true
                  per[x].flag = true
                  this.per = unique(per)
                  this.per = per
                  this.roles.push(per[x].id)
                  return
                }
              }
            }
            if (flag === true) {
              if (this.roles.length === 1) {
                this.roles.remove(1)
              }
              if (per[x].functions[v].flag === true) {
                arr.push(per[x].functions[v].id)
                if (arr.length === 1) {
                  if (per[x].functions[v].id === id) {
                    if (this.roles[c] === per[x].id) {
                      this.roles.remove(c)
                      per[x].functions[v].flag = false
                      per[x].flag = false
                      this.per = unique(per)
                      return
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    handleCheckedCitiesChangeFunction(val) {
      for (let i = 0; i < val.length; i++) {
        /* 进*/
        if (val[i].flag === false) {
          this.functions.push(val[i])
          val[i].flag = true
        }
        /* 出*/
        if (val[i].flag === true) {
          for (let e = 0; e < this.functions.length; e++) {
            if (this.functions[e].id === val[i].id) {
              s.functions.splice(e, 1)
            }
          }
          val[i].flag = false
        }
      }
    },
    handleCheckAllChange(index, val) {
      const p = this.per[index]
      for (let x = 0; p.functions.length; x++) {
        this.checkedCities.push(p.functions[x])
        this.checkedCities.splice(0, this.checkedCities.length)
      }
    },
    handleCheckedCitiesChange(value) {
      if (this.role !== null) return
      for (let a = 0; a < this.role.length; a++) {
        if (this.role[a] === value) {
          this.role.splice(a, 1)
        }
        if (this.role[a] !== value) {
          this.role.push(value)
        }
      }
    }
  }
}

</script>
<style lang="scss">
  span.el-checkbox__label {
    font-size: 16px;
    color: #676767;
  }
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  #shurukaung.el-form {
    width: 300px;
    margin: 0px 200px 0px 0px;
  }
  #shurukaung1.el-form {
    width: 300px;
    margin: 0px 200px 0px 0px;
  }
  .el-dialog__title {
    line-height: 24px;
    font-size: 25px;
    color: #676767;
  }

  .app-container {
    padding: 10px;
  }
</style>

