<template>
  <div>
    <div id="divLeft" align="center">
      <el-card class="cardClass">
        <el-button type="primary" size="medium" @click="editArea(1)">添加市</el-button>
        <el-button type="primary" size="medium" @click="editArea(2)">编辑市</el-button>
        <div style="overflow:scroll; width:100%; height:150px">
          <div class="RadioStyle">
            <div v-for="(val) in care" class="Block PaddingL">
              <input :id="val.id" type="radio" name="Storage" :value="val.id" @click="OnfetchData(val.id)">
              <label :id="val.id" v-model="ccccc" :for="val.id">{{ val.cityName }}</label>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <div id="divRight" align="center">
      <el-button type="primary" size="medium" @click="test">添加区</el-button>
      <el-table
        :data="careList"
        height="680"
        style="width: 100%;"
      >
        <el-table-column
          prop="createdTime"
          label="日期"
          align="center"
        >
          <template slot-scope="props">
            {{ props.row.createdTime|dateformat(`YYYY-MM-DD HH:mm`) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="won"
          align="center"
          label="所属市"
        />
        <el-table-column
          prop="areaName"
          label="名称"
          align="center"
        />
        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="props">
            <el-button type="primary" size="medium" @click="deit(props.row.id,props.row.areaName,props.row.won)">编辑区
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="id===``?'添加区':`编辑区`"
      :visible.sync="Visible"
      width="30%"
      :close-on-click-modal="false"
      :before-close="colose"
      :close-on-press-escape="false"
      style="text-align: center"
    >
      <el-form id="classForm" ref="form" :model="form" style="margin: auto" label-width="80px" align="center">
        <el-form-item label="所属市:">
          <el-input v-model="form.own" disabled />
        </el-form-item>
        <el-form-item label="区名称:">
          <el-input v-model="form.name" />
        </el-form-item>
      </el-form>
      <span>
        <el-button type="primary" size="medium" @click="colose">取消</el-button>
        <el-button type="primary" size="medium" @click="addCity">添加</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="num===1?'添加市':'编辑市'"
      :visible.sync="CityVisible"
      width="30%"
      :close-on-click-modal="false"
      :before-close="colose"
      :close-on-press-escape="false"
      style="text-align: center"
    >
      <el-form id="classForm1" ref="formCity" :model="formCity" label-width="130px" align="center">
        <el-form-item label="名称:">
          <el-input v-model="formCity.name" />
        </el-form-item>
      </el-form>
      <span>
        <el-button type="primary" size="medium" @click="colose">取消</el-button>
        <el-button type="primary" size="medium" @click="adjunction">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchCity, addCity, findByCityId, addArea, updateArea, updateCity } from '@/api/systemInformation'
import * as qs from 'qs'

export default {
  data() {
    return {
      care: [],
      careList: [],
      ccccc: '',
      Visible: false,
      CityVisible: false,
      form: {
        id: '',
        own: '',
        name: ''
      },
      formCity: {
        id: '',
        name: ''
      },
      id: '',
      currentPage: 1,
      size: 10,
      total: 0,
      areaId: '',
      num: ''
    }
  },
  created() {
    this.$message.closeAll()
    this.fetchData()
  },
  methods: {
    fetchData() {
      fetchCity().then(res => {
        this.care = res.data.queryResult.data
      })
    },
    OnfetchData(id) {
      this.areaId = id
      findByCityId(id).then(res => {
        const dataList = res.data.queryResult.data
        this.careList = dataList
        this.care.forEach(item => {
          if (item.id === id) {
            this.careList.forEach(val => {
              val.won = item.cityName
            })
          }
        })
        this.total = dataList.total
      })
    },
    adjunction() {
      if (this.formCity.name === `` || this.formCity.name === undefined) {
        this.$message({
          type: 'warning',
          message: '请输入名称'
        })
        return
      }
      if (this.formCity.id === `` || this.formCity.id === undefined) {
        const pojo = { name: this.formCity.name }
        addCity(qs.stringify(pojo)).then(res => {
          this.fetchData()
          this.colose()
          if (res.data.success === true) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
          }
          if (res.data.success !== true) {
            this.$message({
              type: 'warning',
              message: '操作失败'
            })
          }
        })
      }
      if (this.formCity.id !== `` || this.formCity.id !== undefined) {
        const obj = {
          newName: this.formCity.name
        }
        updateArea(this.formCity.id, qs.stringify(obj)).then(res => {
          this.CityVisible = false
          this.fetchData()
          this.colose()
          if (res.data.success === true) {
            this.$message({
              type: 'success',
              message: '更改成功'
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
    },
    addCity() {
      if (this.id === ``) {
        let areaName = ''
        this.care.forEach(item => {
          if (item.id === this.areaId) {
            areaName = item.cityName
          }
        })
        const arr = {
          areaName: this.form.name,
          cityName: areaName
        }
        addArea(qs.stringify(arr)).then(res => {
          this.colose()
          this.OnfetchData(this.areaId)
          if (res.data.success === true) {
            this.$message({
              type: 'success',
              message: '添加成功'
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
      if (this.id !== ``) {
        if (this.form.name === `` || this.form.name === undefined) {
          this.$message({
            type: 'warning',
            message: '请输入区域名'
          })
          return
        }
        const obj = {
          id: this.form.id,
          areaName: this.form.name
        }
        updateCity(obj).then(res => {
          this.OnfetchData(this.areaId)
          this.colose()
          if (res.data.success === true) {
            this.$message({
              type: 'success',
              message: '更改成功'
            })
          }
          if (res.data.success !== true) {
            this.$message({
              type: 'warning',
              message: res.data.message
            })
          }
        })
      }
    },
    colose() {
      this.Visible = false
      this.CityVisible = false
      this.formCity.name = ''
      this.formCity.id = ''
      this.form.won = ''
      this.form.name = ''
      this.id = ''
    },
    editArea(num) {
      this.num = num
      if (num === 1) {
        this.CityVisible = true
      }
      if (num === 2) {
        if (this.areaId === `` || this.areaId === undefined) {
          this.$message({
            type: 'warning',
            message: '请选择一个市'
          })
          return
        }
        this.care.forEach(item => {
          if (item.id === this.areaId) {
            this.formCity.id = item.id
            this.formCity.name = item.cityName
          }
        })
        this.CityVisible = true
      }
    },
    deit(id, trueName, own) {
      this.id = id
      this.Visible = true
      this.form.id = id
      this.form.own = own
      this.form.name = trueName
    },
    test() {
      if (this.areaId === `` || this.areaId === undefined) {
        this.$message({
          type: 'warning',
          message: '请选择一个市'
        })
        return
      }
      this.care.forEach(item => {
        if (item.id === this.areaId) {
          this.form.own = item.cityName
        }
      })
      this.Visible = true
    }
  }
}
</script>

<style lang="scss">
  #divLeft {
    height: 50%;
  }

  #divRight {
    height: 50%;
  }

  .cardClass {
    width: 100%;
    height: 150px;
  }

  .tableCard {
    padding: 5px;
  }

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

  .buttonClass {
    margin: 8px 0px 0px 10px;
    font-size: 16px;
  }

  #colorClass.m-colorPicker .colorBtn[data-v-11842410] {
    width: 250px;
    height: 35px;
    float: left;
  }

  #colorId {
    width: 180%;
  }

  #classForm.el-form {
    margin: 0px;
  }

  #classForm1.el-form {
    margin: 0px;
  }
</style>
