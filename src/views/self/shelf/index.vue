<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)"
    style="height: 950px"
  >
    <!--<el-card style=" margin-top: 20px;" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="handleSearchList()"
          type="primary"
          size="small">
          查询结果
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品货号：">
            <el-input style="width: 203px" v-model="listQuery.productSn" placeholder="商品货号"></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-cascader
              clearable
              v-model="selectProductCateValue"
              :options="productCateOptions">
            </el-cascader>
          </el-form-item>
          <el-form-item label="商品品牌：">
            <el-select v-model="listQuery.brandId" placeholder="请选择品牌" clearable>
              <el-option
                v-for="item in brandOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上架状态：">
            <el-select v-model="listQuery.publishStatus" placeholder="全部" clearable>
              <el-option
                v-for="item in publishStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select v-model="listQuery.verifyStatus" placeholder="全部" clearable>
              <el-option
                v-for="item in verifyStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>-->
    <el-card class="operate-container" shadow="never">
      <el-select
        v-model="operateType"
        size="small"
        class="selectOption"
        style="float: right"
        placeholder="排序"
        @change="fetchData"
      >
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.field"
        />
      </el-select>
      <el-select
        v-model="operate"
        size="small"
        class="selectOption"
        style="float: right"
        placeholder="分类"
        @change="fetchData"
      >
        <el-option
          v-for="item in option"
          :key="item.value"
          :label="item.label"
          :value="item.field"
        />
      </el-select>
      <el-button
        class="btn-add"
        size="medium"
        type="primary"
        style="margin: 0px 0px 0px 750px"
        @click="handleAddProduct()"
      >
        添加商品
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="productTable"
        :data="list"
        style="width: 100%;height: 100%"
      >
        <template slot="empty">
          <img class="data-pic" src="#" alt="">
        </template>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.createdTime | dateformat('YYYY-MM-DD HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column label="商品图片" align="center">
          <template slot-scope="scope">
            <el-image
              style="width: 120px; height: 120px"
              :src="scope.row.img"
              :preview-src-list="scope.row.urlList"
            />
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.name }}</p>
            <!--<p>品牌：{{scope.row.brandName}}</p>-->
          </template>
        </el-table-column>
        <el-table-column label="商品描述" align="center">
          <template slot-scope="props">
            <el-popover
              placement="top"
              width="200"
              trigger="hover"
              :content="props.row.description"
            >
              <el-button slot="reference" type="text" style="color: rgb(90, 94, 102);">{{ props.row.description.substring(0,10) }}...</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="规格_价格" align="center">
          <template slot-scope="scope">
            <p style="color: #333">{{ scope.row.unit }}</p>
            <p style="color: #999">{{ scope.row.price }}元</p>
          </template>
        </el-table-column>
        <el-table-column
          label="分类"
          align="center"
        >
          <template slot-scope="props">
            <p>{{ props.row.category }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="排序"
          align="center"
        >
          <template slot-scope="props">
            <el-popover
              id="popover2"
              v-model="props.row.visible2"
              placement="bottom"
              trigger="click"
              @hide="closeData(props.row.id)"
            >
              <div style="text-align: right; margin: 0">
                <el-input v-model="sort" class="popover" on-keypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" type="number" />
                <el-button size="mini" type="text" @click="props.row.visible2 = false;sort=null">取消</el-button>
                <el-button type="primary" size="mini" @click="sortSubmit(props.row.id)">确定</el-button>
              </div>
            </el-popover>
            {{ props.row.sort }}
            <el-button v-if="props.row.pass==='已下架'" size="small" style="color: #8c939d" type="text" class="el-icon-edit" @click="props.row.visible2 = true;sort=props.row.sort" />
            <el-button v-if="props.row.pass==='已上架'" size="small" style="color: #409EFF" type="text" class="el-icon-edit" @click="props.row.visible2 = true;sort=props.row.sort" />
            <el-button v-if="props.row.pass==='未审核'" size="small" style="color: #f06a0a" type="text" class="el-icon-edit" @click="props.row.visible2 = true;sort=props.row.sort" />
            <el-button v-if="props.row.pass==='审核未通过'" size="small" style="color: #f01214" type="text" class="el-icon-edit" @click="props.row.visible2 = true;sort=props.row.sort" />
          </template>
          <!--<template slot-scope="props">
            <p>{{ props.row.sort}}</p>
          </template>-->
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="props">
            <p v-if="props.row.pass==='已下架'" style="color: #8c939d">
              {{ props.row.pass }}
            </p>
            <p v-if="props.row.pass==='已上架'" style="color: #409EFF">
              {{ props.row.pass }}
            </p>
            <p v-if="props.row.pass==='未审核'" style="color: #f06a0a">
              {{ props.row.pass }}
            </p>
            <p v-if="props.row.pass==='审核未通过'" style="color: #f01214">
              {{ props.row.pass }}
            </p>
            <p v-if="props.row.pass==='审核未通过'">
              <el-tooltip class="item" effect="light" :content="props.row.passComment" placement="top">
                <el-button type="text" style="color: #f01214">详情</el-button>
              </el-tooltip>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300x" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleUpdateProduct(scope.row.id)"
            >编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)"
            >删除
            </el-button>
            <el-button
              v-if="scope.row.pass===`已上架`"
              size="mini"
              type="primary"
              @click="addGoods(scope.row.id,scope.row.pass)"
            >
              下架
            </el-button>
            <el-button
              v-if="scope.row.pass===`审核未通过`"
              size="mini"
              type="primary"
              disabled
              @click="addGoods(scope.row.id,scope.row.pass)"
            >
              上架
            </el-button>
            <el-button
              v-if="scope.row.pass===`已下架`"
              size="mini"
              type="primary"
              @click="addGoods(scope.row.id,scope.row.pass)"
            >
              上架
            </el-button>
            <el-button
              v-if="scope.row.pass===`未审核`"
              size="mini"
              type="primary"
              disabled
              @click="addGoods(scope.row.id,scope.row.pass)"
            >
              上架
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="text-align: center">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="size"
        layout="total, prev, pager, next"
        :total="total"
        @size-change="fetchData()"
        @current-change="fetchData()"
      />
    </div>
  </div>
</template>
<script>
import { fachData, itemDelete, addGoods, updateSort } from '@/api/self'
export default {
  data() {
    return {
      list: [],
      listQuery: {},
      loading: false,
      currentPage: 1,
      size: 4,
      total: 0,
      operates: [
        {
          label: '已上架的商品',
          value: 'publishOn',
          field: 'up'
        },
        {
          label: '已下架的商品',
          value: 'publishOff',
          field: 'down'
        },
        {
          label: '未审核的商品',
          value: 'recommendOff',
          field: 'init'
        },
        {
          label: '审核未通过的商品',
          value: 'newOn',
          field: 'fail'
        }
      ],
      option: [
        {
          label: '果蔬汇',
          value: 'publishOn',
          field: 'gsh'
        },
        {
          label: '蘑菇街',
          value: 'publishOff',
          field: 'mgj'
        },
        {
          label: '百草堂',
          value: 'recommendOff',
          field: 'bct'
        },
        {
          label: '社服小站',
          value: 'newOn',
          field: 'sfxz'
        }
      ],
      operateType: null,
      operate: null,
      sort: null
    }
  },
  created() {
    this.$message.closeAll()
    this.operateType = ''
    this.operate = ''
    this.fetchData('', '')
  },
  methods: {
    fetchData(val) {
      val = this.operateType
      fachData(this.operate, this.currentPage, this.size, val).then(res => {
        const dataList = res.data.queryResult.data
        this.list = dataList.list
        this.list.forEach(item => {
          item.visible2 = false
          const arr = []
          arr.push(item.img)
          item.urlList = arr
        })
        for (let x = 0; x < this.list.length; x++) {
          if (this.list[x].pass === 0) {
            this.list[x].pass = '未审核'
          }
          if (this.list[x].pass === -1) {
            this.list[x].pass = '审核未通过'
          }
          if (this.list[x].pass === 1) {
            if (this.list[x].state === 1) {
              this.list[x].pass = '已上架'
            }
            if (this.list[x].state === -1) {
              this.list[x].pass = '已下架'
            }
          }
        }
        this.total = dataList.total
      })
    },
    handleAddProduct() {
      this.$router.push({ path: 'selfAdd' })
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除此商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listQuery = true
        itemDelete(id).then(res => {
          if (res.data.success === true) {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.listQuery = false
          }
        }).catch(err => {
          this.$message({
            type: 'info',
            message: res.data.message
          })
          this.listQuery = false
        })
      })
    },
    addGoods(id, pass) {
      let url = ''
      if (pass === '已上架') {
        url = `down`
        const user = {}
        const arr = []
        arr.push(id)
        this.$confirm('是否将此商品下架, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          addGoods(url, arr).then(res => {
            this.loading = false
            this.fetchData()
            if (res.data.success === true) {
              this.$message({
                type: 'success',
                message: '下架成功'
              })
            } else {
              this.$message({
                type: 'info',
                message: res.data.message
              })
            }
          })
        })
      }
      if (pass === '已下架') {
        url = `up`
        const user = {}
        const arr = []
        arr.push(id)
        this.$confirm('是否将此商品上架, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          addGoods(url, arr).then(res => {
            this.loading = false
            this.fetchData()
            this.$message({
              type: 'success',
              message: '上架成功'
            })
          })
        })
      }
    },
    handleUpdateProduct(id) {
      this.$router.push({ name: '自营商品编辑', query: { id: id }})
    },
    sortSubmit(id) {
      this.loading = false
      this.list.forEach(item => {
        if (item.id === id) {
          const obj = {
            id: id,
            sort: this.sort
          }
          updateSort(obj.id, obj.sort).then(res => {
            if (res.data.success === true) {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.fetchData(this.operate, this.operateType)
            } else {
              this.$message({
                type: 'info',
                message: '修改失败'
              })
            }
          })
          this.loading = false
        }
      })
    },
    closeData(id) {
      this.list.forEach(item => {
        if (item.id === id) {
          item.visible2 = false
        }
      })
    }
  }
}
</script>
<style>
  .el-input--small .el-input__inner {
    height: 36px;
    line-height: 36px;
  }
  .el-table-filter__checkbox-group {
    padding: 10px;
    height: 130px;
  }
  .selectOption .el-input--small .el-input__inner {
    width: 150px;
  }
</style>
