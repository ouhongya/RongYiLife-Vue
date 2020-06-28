<template>
  <div>
    <div class="block " style="padding-right:5px;text-align: center;">
      <el-cascader
        :options="option"
        :props="props"
        size="small"
        @active-item-change="handleItemChange"
        @change="city"
      />
      <el-button size="small" icon="el-icon-plus" @click="add">新建小区</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        prop="date"
        label="日期"
        width="180"
      />
      <el-table-column
        prop="name"
        label="小区名"
        align="center"
      />
      <el-table-column
        prop="address"
        label="地址"
        align="center"
      />
      <el-table-column
        prop="point"
        label="数量"
        align="center"
      />
      <el-table-column
        prop="admin"
        label="管理员"
        align="center"
      />
      <el-table-column
        prop="phone"
        label="电话"
        align="center"
      />
      <el-table-column
        prop="number"
        label="户数"
        align="center"
      />
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button size="small" icon="el-icon-edit" @click="compilation(scope.row.id)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="社区编辑" width="40%" :visible.sync="formVisible" style="text-align: center">
      <el-form label-width="80px">
        <el-form-item label="小区名">
          <el-input v-model="pojo.name" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="pojo.name" />
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="pojo.address" />
        </el-form-item>
        <el-form-item label="社区管理">
          <el-input v-model="pojo.admin" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="pojo.phone" />
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="pojo.point" />
        </el-form-item>
        <el-form-item label="户数">
          <el-input v-model="pojo.number" />
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button @click="save">保存</el-button>
          <el-button @click="formVisible = false">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="添加社区" width="40%" :visible.sync="addformVisible" style="text-align: center">
      <el-form label-width="80px">
        <el-form-item label="小区名">
          <el-input v-model="add.name" />
        </el-form-item>
        <el-form-item label="位置">
          <el-input v-model="add.name1" />
        </el-form-item>
        <el-form-item label="管理员">
          <el-input v-model="add.name3" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="add.name4" />
        </el-form-item>
        <el-form-item label="门户">
          <el-input v-model="add.name5" />
        </el-form-item>
        <el-form-item label="投放站点">
          <el-input v-model="add.name6" />
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button @click="addsave()">保存</el-button>
          <el-button @click="addformVisible = false">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="添加账号" :visible.sync="addformVisible" custom-class="customWidth" width="50%" show-clos="false" style="text-align: center;">
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="小区名设置" />
        <el-step title="小区位置" />
        <el-step title="小区人数" />
        <el-step title="小区其他" />
      </el-steps>
      <div style="width: 350px;margin-left:28%;padding: 30px">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="姓名">
            <el-input v-model="form.trueName" placeholder="请输入姓名" autocomplete="off" />
          </el-form-item>
          <el-form-item label="手机">
            <el-input v-model="form.phoneNum" placeholder="请输入手机号" autocomplete="off" />
          </el-form-item>
          <el-form-item label="账号">
            <el-input v-model="form.username" placeholder="请输入账号" autocomplete="off" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.password" placeholder="请输入密码" autocomplete="off" />
          </el-form-item>
        </el-form>
      </div>

      <div class="leftButton">
        <el-button style="margin-top: 12px;" class="buttontest" @click="addnext">{{ active==0 ? '取消':'上一步' }}</el-button>
        <el-button style="margin-top: 12px;" class="buttontest" @click="next">{{ active==3 ? '完成':'下一步' }}</el-button>
      </div>
    </el-dialog>
    <el-pagination
      :current-page.sync="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
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
      tableData: [
        { date: '2016-05-02', name: '光华之心1', address: '光华之心3幢7楼', admin: '张三', phone: '13654613546', point: '4', number: '465' },
        { date: '2016-05-04', name: '光华之心2', address: '光华之心3幢8楼', admin: '李四', phone: '153154632', point: '7', number: '321' },
        { date: '2016-05-01', name: '光华之心3', address: '光华之心3幢9楼', admin: '赵六', phone: '3135468468', point: '6', number: '145' },
        { date: '2016-05-03', name: '光华之心4', address: '光华之心3幢10楼', admin: '王五', phone: '13544655465', point: '8', number: '321' }
      ],
      formVisible: false,
      pojo: { name: '光华之心3', address: '光华之心3幢9楼', admin: '赵六', phone: '123456789', point: '6', number: '145' }, // 回显列表
      options: [
        { value: 'chengdu', label: '成都市',
          children: [
            { value: 'wenjaing', label: '温江区',
              children: [
                { value: 'yizhi', label: '光华之心1' },
                { value: 'fankui', label: '光华之心2' },
                { value: 'xiaolv', label: '光华之心3' },
                { value: 'kekong', label: '光华之心4' }
              ]
            },
            { value: 'daohang', label: '锦江区',
              children: [
                { value: 'cexiangdaohang', label: 'a' },
                { value: 'dingbudaohang', label: 'b' }
              ]
            },
            { value: 'a', label: '青羊区',
              children: [
                { value: 'cexiangdaohang', label: 'c' },
                { value: 'dingbudaohang', label: 'd' }
              ]
            }
          ]
        }], /* 搜索框的输入*/
      addformVisible: false,
      imageUrl: '', // 图片回显,
      option: [], // 懒加载
      props: {
        value: 'label',
        children: 'cities'
      },
      addformVisible: false,
      active: 0,
      size: 1,
      total: 100,
      currentPage: 0,
      form: {}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /* 初始化角色*/
    fetchData(name) {
    },
    /* 下一步*/
    next() {
      if (this.active++ > 3) this.active = 4
      if (this.active === 4) {
        this.addformVisible = false
        this.active = 0
      }
    },
    /* 上一步*/
    addnext() {
      if (this.active-- === -1) this.active = -1
      if (this.active === -1) {
        this.addformVisible = false
        this.active = 0
      }
    },
    add() {
      this.addformVisible = true
    },
    save() {
      /* 编辑社区弹框保存*/
      this.formVisible = false
    },
    /* 新建社区保存*/
    addsave() {
      this.addformVisible = false
    },
    /* 新建社区按钮*/
    shrine() {
      this.addformVisible = true
    },
    handleAvatarSuccess(res, file) { // 图片上传的方法
      this.imageUrl = file.response
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'// 图片的类型
      const isLt2M = file.size / 1024 / 1024 < 2// 单个图片的大小

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 第一个选项
    cityCreate() {
      this.$axios.get(`/user/api/city/all`).then((res) => {
        if (res.data.queryResult.data != null) {
          const cityList = res.data.queryResult.data
          for (let city = 0; city < cityList.length; city++) {
            const obj = {}
            obj.label = cityList[city]
            obj.cities = []
            this.option.push(obj)
          }
        } else {
          const test = ''
          this.option.push(test)
        }
      })
    },
    // 第二个选项
    handleItemChange(val) {
      const optionList = this.option
      for (let i = 0; i < optionList.length; i++) {
        if (optionList[i].cities.length === 0 && val[0] != null) {
          // 二级菜单
          this.$axios.get(`/user/api/area/${val[0]}`).then(res => {
            const resList = res.data.queryResult.data
            if (resList != null) {
              for (let x = 0; x < resList.length; x++) {
                const obj = {}
                obj.label = resList[x]
                if (optionList[i].label === val[0]) optionList[i].cities.push(obj)
              }
            } else {
              const test = ''
              if (optionList[i].label === val[0]) optionList[i].cities.push(test)
            }
          })
        }
      }
    },
    city(value) {
      // 发送请求刷新数据 市 区 小区
      this.$axios.get(`/user/api/user/${value[0]}/${value[1]}`).then((res) => {
        const responseList = res.data.queryResult.data
        this.tableData = responseList
        for (const i in responseList.length) {
        }
        console.log(this.address)
      })
    }
  }
}
</script>
<style>

</style>
