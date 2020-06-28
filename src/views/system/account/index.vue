<!--账号设置-->
<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(50, 0, 0, 0.1)"
  >
    <div style="padding-right:5px;text-align: center;">
      <!--<el-input placeholder="搜索" icon="el-icon-search" v-model="input" :on-icon-click="pchandleIconClick" style="width: 300px" @keyup.enter.native="searchEnterFun"/>-->
      <el-input v-model="input" placeholder="请输入内容" style="width: 300px" />
      <el-button type="primary" icon="el-icon-plus" size="small" style="height: 38px" @click="add">添加账号</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      height="710px"
      :default-sort="{prop: 'createdTimeStr', order: 'desc'}"
      @sort-change="fetchData"
    >
      <el-table-column
        prop="createdTimeStr"
        sortable
        label="日期"
        align="center"
      >
        <template slot-scope="props">
          {{ props.row.createdTimeStr | dateformat('YYYY-MM-DD HH:mm') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="trueName"
        align="center"
        label="姓名"
        sortable
      />
      <el-table-column
        prop="username"
        align="center"
        label="账号"
        sortable
      />
      <el-table-column
        label="类型"
        align="center"
      >
        <template slot-scope="props">
          {{ props.row.isInsider===0?'内部':'外部' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="phoneNum"
        align="center"
        label="手机"
        sortable
      />
      <el-table-column
        prop="role"
        label="角色"
        align="center"
      >
        <template slot-scope="props">
          <el-popover
            placement="top"
            width="200"
            trigger="hover"
            :content="props.row.ro"
            style="cursor :all-scroll"
          >
            <el-button slot="reference" type="text" style="color: rgb(90, 94, 102);">{{ props.row.role }}</el-button>
          </el-popover>
        </template>
      </el-table-column>
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
      </el-table-column><!--
      <el-table-column label="状态">
        <template slot-scope="props">
          {{ props.row.status===1?'启用':'禁用' }}
        </template>
      </el-table-column>-->
      <el-table-column label="操作" align="center" width="330px">
        <template slot-scope="props">
          <el-button icon="el-icon-edit" type="primary" size="small" @click="edit(props.row.id)">编辑</el-button>
          <!--
                        <el-button icon="el-icon-sort" size="small" @click="activate(props.row.id)">{{ props.row.status===1?'禁用':'启用' }}</el-button>
              -->
          <el-button icon="el-icon-delete" type="danger"size="small" @click="strikeout(props.row.id)">删除</el-button>
          <el-button icon="el-icon-refresh" type="warning" size="small" @click="notPassword(props.row.id)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--编辑账号-->
    <el-dialog
      title="内部账号编辑"
      :visible.sync="formVisible"
      width="50%"
      :close-on-click-modal="false"
      :before-close="nclose"
      :close-on-press-escape="closeDialog"
      style="text-align: center"
    >
      <el-steps :active="active1" finish-status="success" align-center>
        <el-step title="账号编辑" />
        <el-step title="选择角色" />
        <el-step title="筛选权限" />
        <el-step title="设置完成" />
      </el-steps>
      <div v-show="active1===0" style="">
        <el-form ref="form" :model.lazy="addform" style="margin: auto;" label-width="80px">
          <el-form-item label="姓名">
            <el-input v-model.lazy="addform.trueName" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="手机" style="text-align: center;">
            <el-input v-model.lazy="addform.phoneNum" placeholder="请输入手机号" />
          </el-form-item>
        </el-form>
      </div>
      <!--选择角色-->
      <div v-show="active1===1" style=" overflow-y:auto; overflow-x:auto; width:100%; height:500px">
        <div v-for="(p,index) in per.roles" style="margin: 5px 0px 0px 0px"><!--ncheckboxTest(p.flag,index)-->
          <el-checkbox-group v-model="roles" style="margin: 0px 720px 0px 80px">
            <el-checkbox :key="index" :label="p.id" @change="cccheckboxTest(p.flag,p.id,index)"><FONT><strong>{{ p.roleName }}</strong></FONT></el-checkbox>
          </el-checkbox-group>
          <div style="margin: 2px;padding-bottom: 2px" />
          <div v-for="(city,index) in p.ps">
            <el-checkbox-group
              v-model="functions"
              style="text-align: left;margin: 0px 0px 0px 135px;font-style:oblique;padding: 5px"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox :key="index" :label="city.pid" disabled>{{ city.parentFunctionName }}</el-checkbox>
            </el-checkbox-group>
            <div style="margin: 2px;padding-bottom: 2px" />
            <el-checkbox-group
              v-model="functionsa"
              style="text-align: left;margin: 0px 0px 0px 160px"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox v-for="(test,index) in city.functions" :key="index" :label="test.fid" disabled>{{ test.functionName }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <!--选择权限-->
      <div v-show="active1===2" style=" overflow-y:auto; overflow-x:auto; width:100%; height:500px">
        <div>
          <div style="width: 100%;height: 25px;font-size: 15px;align-content: center;padding: 9px;">
            <span><FONT><strong>当前选择的角色:&nbsp&nbsp&nbsp{{ roleTime }}</strong></FONT></span>
          </div>
          <br>
          <br>
          <div style="margin: 2px 0;margin: 5px 0px 5px 5px" />
          <div v-for="(city,index) in per.ps" style="margin: 5px 0px 0px 0px;"><!--模块 functions-->
            <el-checkbox-group
              v-model="functions"
              style="text-align: left;margin: 0px 0px 0px 110px;font-style:oblique;padding: 5px"
              @change="addcheckboxTest(city.flag,city.id,index)"
            ><!--checkboxTestxx(city.state,index)-->
              <!--handleCheckedCitiesChangeModeul(index,city.state)-->
              <el-checkbox :key="index" :label="city.id">{{ city.parentFunctionName }}</el-checkbox>
            </el-checkbox-group>
            <div style="margin: 2px 0;margin: 5px 0px 5px 5px" /><!--二级菜单 functionsa-->
            <el-checkbox-group v-model="functionsa" style="text-align: left;margin: 0px 0px 0px 150px">
              <el-checkbox v-for="(test,index) in city.functions" :key="index" :label="test.id">{{ test.functionName }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div v-show="active1===3">
        <el-form ref="form" :model="addform" label-width="80px" style="margin: auto">
          <el-form-item label="姓名">
            <el-input v-model="addform.trueName" placeholder="请输入姓名" autocomplete="off" />
          </el-form-item>
          <el-form-item label="手机">
            <el-input v-model="addform.phoneNum" placeholder="请输入手机号" autocomplete="off" />
          </el-form-item>
          <div>
            <div style="width: 100%;height: 25px;font-size: 15px;align-content: center;padding: 2px">
              <span><FONT><strong>角色:&nbsp&nbsp&nbsp{{ roleTime }}</strong></FONT></span>
            </div>
            <br>
            <br>
            <div style=" overflow-y:auto; overflow-x:auto; width:110%; height:500px;margin: 0px 380px 0px 0px">
              <div v-for="(city,index) in result">
                <el-checkbox-group
                  v-model="modelAndRole"
                  style="text-align: left;margin: 0px 180px 0px 0px;font-style:oblique;padding: 5px"
                  @change="handleCheckedCitiesChange"
                >
                  <el-checkbox :key="index" :label="city" disabled>{{ city.modelName }}</el-checkbox>
                </el-checkbox-group>
                <div style="margin: 2px;padding-bottom: 2px" />
                <el-checkbox-group
                  v-model="testRole"
                  style="text-align: left;margin: 0px 0px 0px 50px"
                  @change="handleCheckedCitiesChange"
                >
                  <el-checkbox v-for="(test,index) in city.model" :key="index" :label="test" disabled>{{ test }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </el-form>
      </div>
      <div class="leftButton">
        <el-button style="margin-top: 12px;" size="medium" type="primary" class="buttontest" @click="addnext1">{{ active1==0 ? '取消':'上一步' }}
        </el-button>
        <el-button style="margin-top: 12px;" size="medium" type="primary" class="buttontest" @click="next1">{{ active1==3 ? '完成':'下一步' }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="外部账号编辑"
      :visible.sync="wformVisible"
      width="50%"
      :close-on-click-modal="false"
      :before-close="wclose"
      :close-on-press-escape="false"
      style="text-align: center"
    >
      <el-steps :active="active1" finish-status="success" align-center>
        <el-step title="账号编辑" />
        <el-step title="签约绑定" />
        <el-step title="选择角色" />
        <el-step title="设置完成" />
      </el-steps>
      <div v-show="active1===0">
        <el-form ref="form" :model="addform" label-width="80px" style="margin: auto" :rules="rules" class="demo-ruleForm">
          <el-form-item label="姓名" prop="trueName">
            <el-input v-model.lazy="addform.trueName" placeholder="请输入姓名" autocomplete="off" />
          </el-form-item>
          <el-form-item label="手机" prop="phoneNum">
            <el-input v-model.lazy="addform.phoneNum" placeholder="请输入手机号" autocomplete="off" />
          </el-form-item>
        </el-form>
        <el-radio-group v-model="isInsider" style="overflow:hidden">
          <el-radio-button :label="1">商铺账号</el-radio-button>
          <el-radio-button :label="2" checked>农场账号</el-radio-button>
          <el-radio-button :label="3">农庄账号</el-radio-button>
        </el-radio-group>
      </div>
      <!--签约绑定-->
      <div v-show="active1===1">
        <div v-if="isInsider===1" style=" overflow-y:auto; overflow-x:auto; width:100%; height:500px"><!--商铺-->
          <el-table
            ref="singleTable"
            :data="waibuStores"
            highlight-current-row
            style="width: 91%;float: right"
          >
            <el-table-column label="选择" width="70" center>
              <template scope="scope">
                <el-radio v-model="radio" class="radio" :label="scope.row.id" @change.native="getCurrentRow(scope.row.id)">&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="createdTime" sortable label="签约日期" width="180">
              <template slot-scope="props">
                {{ props.row.createdTime | dateformat('YYYY-MM-DD HH:mm') }}
              </template>
            </el-table-column>
            <el-table-column prop="address" sortable label="商铺地址" width="271" />
            <el-table-column prop="name" sortable label="商铺名字" width="271" />
          </el-table>
        </div>
        <div v-if="isInsider===2" style=" overflow-y:auto; overflow-x:auto; width:100%; height:500px"><!--农装-->
          <el-table
            ref="singleTable"
            :data="waibuFarmAndUsers"
            highlight-current-row
            style="width: 91%;float: right"
            border
          >
            <el-table-column label="选择" width="70" center>
              <template scope="scope">
                <el-radio v-model="radio" class="radio" :label="scope.row.id" @change.native="getCurrentRow(scope.row.id)">&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="createdTime" label="签约日期" width="180">
              <template slot-scope="props">
                {{ props.row.createdTime | dateformat('YYYY-MM-DD HH:mm') }}
              </template>
            </el-table-column>
            <el-table-column prop="address" label="农场地址" width="271" />
            <el-table-column prop="name" label="农场名字" width="271" />
          </el-table>
        </div>
        <div v-if="isInsider===3" style=" overflow-y:auto; overflow-x:auto; width:100%; height:500px"><!--农装-->
          <el-table
            ref="singleTable"
            :data="waibuGrange"
            highlight-current-row
            style="width: 91%;float: right"
            border
          >
            <el-table-column label="选择" width="70" center>
              <template scope="scope">
                <el-radio v-model="radio" class="radio" :label="scope.row.id" @change.native="getCurrentRow(scope.row.id)">&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="createdTime" label="签约日期" width="180">
              <template slot-scope="props">
                {{ props.row.createdTime | dateformat('YYYY-MM-DD HH:mm') }}
              </template>
            </el-table-column>
            <el-table-column prop="address" label="农装地址" width="271" />
            <el-table-column prop="name" label="农装名字" width="271" />
          </el-table>
        </div>
      </div>
      <!--选择角色-->
      <div v-show="active1===2" style=" overflow-y:auto; overflow-x:auto; width:500px; height:500px">
        <div v-for="(p,index) in per.roles" style="margin: 5px 0px 0px 0px">
          <el-radio-group v-model="single" style="margin: 0px 750px 0px 150px;font-size: 28px">
            <el-radio :key="index" :label="p.id" @change="checkboxTestcc(p)">{{ p.roleName }}</el-radio>
          </el-radio-group>
          <div style="margin: 2px;padding-bottom: 3px" />
          <div v-for="(city,index) in p.ps">
            <el-checkbox-group v-model="functions" style="text-align: left;margin: 0px 0px 0px 180px;font-size: 24px">
              <el-checkbox :key="index" :label="city.id" disabled>{{ city.parentFunctionName }}</el-checkbox>
            </el-checkbox-group>
            <div style="margin: 2px;padding-bottom: 3px" />
            <el-checkbox-group v-model="functionsa" style="text-align: left;margin: 0px 0px 0px 210px;font-size: 18px">
              <el-checkbox v-for="(test,index) in city.functions" :key="index" :label="test.id" disabled>{{ test.functionName }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <!--设置完成-->
      <div v-show="active1===3">
        <el-form
          ref="form"
          :model="form"
          label-width="80px"
          style="text-align: center;margin: auto"
          :rules="rules"
        >
          <el-form-item label="姓名" style="margin: 10px 0px 20px 0px" prop="trueName">
            <el-input v-model="form.trueName" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="手机号" style="margin: 10px 0px 20px 0px" prop="phoneNum">
            <el-input v-model="form.phoneNum" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="签约模块" style="margin: 10px 0px 20px 0px">
            <el-input v-model="waibuName" disabled />
          </el-form-item>
        </el-form>
        <div style="width: 100%;height: 25px;font-size: 15px;align-content: center;padding: 2px;">
          <span style="float: bottom">角色:</span>&nbsp{{ waibuJueSe }}
        </div>
        <br>
        <br>
        <div style=" overflow-y:auto; overflow-x:auto; width:100%; height:150px;">
          <div v-for="(city,index) in result">
            <el-checkbox-group v-model="modelAndRole" style="text-align: left;margin: 0px 0px 0px 29%;">
              <el-checkbox :key="index" :label="city" disabled>{{ city.modelName }}</el-checkbox>
            </el-checkbox-group>
            <div style="margin: 2px;padding-bottom: 2px" />
            <el-checkbox-group v-model="testRole" style="text-align: left;margin: 0px 0px 0px 35%">
              <el-checkbox v-for="(test,index) in city.model" :key="index" :label="test" disabled>{{ test }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div class="leftButton">
        <el-button style="margin-top: 12px;" size="medium" type="primary" class="buttontest" @click="addnext1">{{ active1==0 ? '取消':'上一步' }}
        </el-button>
        <el-button style="margin-top: 12px;" size="medium" type="primary" class="buttontest" @click="next1">{{ active1==3 ? '完成':'下一步' }}</el-button>
      </div>
    </el-dialog>
    <!--添加账号-->
    <el-dialog
      title="添加账号"
      :visible.sync="addformVisible"
      :close-on-click-modal="false"
      custom-class="customWidth"
      width="50%"
      :close-on-press-escape="closeDialog"
      :before-close="addclose"
      show-clos="false"
      style="text-align: center;"
    >
      <el-steps v-show="isInsider===0" :active="active" finish-status="success" align-center>
        <el-step title="账号设置" />
        <el-step title="选择角色" />
        <el-step title="筛选权限" />
        <el-step title="设置完成" />
      </el-steps>
      <el-steps v-show="isInsider!==0" :active="active" finish-status="success" align-center>
        <el-step title="账号设置" />
        <el-step title="签约绑定" />
        <el-step title="选择角色" />
        <el-step title="设置完成" />
      </el-steps>
      <div v-show="active===0" style="overflow:hidden"><!--width: 350px;margin-left:1%;padding: 30px-->
        <el-form ref="form" :model.lazy="form" label-width="80px" style="overflow:hidden;text-align: center;margin: auto" :rules="rules" class="demo-ruleForm">
          <el-form-item label="姓名" prop="trueName">
            <el-input v-model.lazy="form.trueName" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="手机" prop="phoneNum">
            <el-input v-model.lazy="form.phoneNum" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="账号" prop="username">
            <el-input v-model.lazy="form.username" placeholder="请输入账号；最少六位" />
          </el-form-item>
          <el-form-item label="密码" prop="passwordtest">
            <el-input v-model.lazy="form.passwordtest" type="password" placeholder="请输入密码；最少六位" auto-complete="off" />
          </el-form-item>
          <el-form-item label="确认密码" prop="password">
            <el-input v-model.lazy="form.password" type="password" placeholder="确认密码；最少六位" auto-complete="off" />
          </el-form-item>
        </el-form>
        <el-radio-group v-model="isInsider" style="overflow:hidden">
          <el-radio-button :label="0" checked>内部账号</el-radio-button>
          <el-radio-button :label="1">商铺账号</el-radio-button>
          <el-radio-button :label="2">农场账号</el-radio-button>
          <el-radio-button :label="3">农庄账号</el-radio-button>
        </el-radio-group>
      </div>
      <!--第二步-->
      <div v-show="active===1&&isInsider===0" style=" overflow-y:auto; overflow-x:auto; width:100%; height:500px">
        <div v-for="(p,index) in per.roles" style="margin: 5px 0px 0px 0px">
          <el-checkbox-group v-model="roles" style="margin: 0px 750px 0px 100px">
            <el-checkbox :key="index" :label="p.id" @change="cccheckboxTest(p.flag,p.id,index)"><FONT><strong>{{ p.roleName }}</strong></FONT></el-checkbox>
          </el-checkbox-group>
          <div style="margin: 2px;padding-bottom: 3px" />
          <div v-for="(city,index) in p.ps">
            <el-checkbox-group v-model="functions" style="text-align: left;margin: 0px 0px 0px 130px;font-size: 16px" disabled>
              <el-checkbox :key="index" :label="city.pid" style="padding: 3px;font-style:oblique;padding: 7px">{{ city.parentFunctionName }}</el-checkbox>
            </el-checkbox-group>
            <el-checkbox-group v-model="functionsa" style="text-align: left;margin: 0px 0px 0px 170px" disabled>
              <el-checkbox v-for="(test,index) in city.functions" :key="index" :label="test.fid">{{ test.functionName }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div v-show="active===1&&isInsider!==0" style=" overflow-y:auto; overflow-x:auto; width:100%; height:500px">
        <div v-if="isInsider===1" style=" overflow-y:auto; overflow-x:auto; width:100%; height:500px"><!--商铺-->
          <el-table
            ref="singleTable"
            :data="waibuStores"
            highlight-current-row
            style="width: 91%;float: right"
            border
          >
            <el-table-column label="选择" width="70" center>
              <template scope="scope">
                <el-radio v-model="radio" class="radio" :label="scope.row.id" @change.native="getCurrentRow(scope.row.id)">&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="createdTime" label="签约日期" width="180">
              <template slot-scope="props">
                {{ props.row.createdTime | dateformat('YYYY-MM-DD') }}
              </template>
            </el-table-column>
            <el-table-column prop="address" label="商铺地址" width="271" />
            <el-table-column prop="name" label="商铺名字" width="271" />
          </el-table>
        </div>
        <div v-if="isInsider===2" style=" overflow-y:auto; overflow-x:auto; width:900px; height:500px"><!--农场-->
          <el-table
            ref="singleTable"
            :data="waibuFarmAndUsers"
            highlight-current-row
            style="width: 91%;float: right"
            border
          >
            <el-table-column label="选择" width="70" center>
              <template scope="scope">
                <el-radio v-model="radio" class="radio" :label="scope.row.id" @change.native="getCurrentRow(scope.row.id)">&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="createdTime" label="签约日期" width="180">
              <template slot-scope="props">
                {{ props.row.createdTime | dateformat('YYYY-MM-DD') }}
              </template>
            </el-table-column>
            <el-table-column prop="address" label="农场地址" width="271" />
            <el-table-column prop="name" label="农场名字" width="271" />
          </el-table>
        </div>
        <div v-if="isInsider===3" style=" overflow-y:auto; overflow-x:auto; width:900px; height:500px"><!--农场-->
          <el-table
            ref="singleTable"
            :data="waibuGrange"
            highlight-current-row
            style="width: 91%;float: right"
            border
          >
            <el-table-column label="选择" width="70" center>
              <template scope="scope">
                <el-radio v-model="radio" class="radio" :label="scope.row.id" @change.native="getCurrentRow(scope.row.id)">&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="createdTime" label="签约日期" width="180">
              <template slot-scope="props">
                {{ props.row.createdTime | dateformat('YYYY-MM-DD') }}
              </template>
            </el-table-column>
            <el-table-column prop="address" label="农庄地址" width="271" />
            <el-table-column prop="name" label="农庄名字" width="271" />
          </el-table>
        </div>
      </div>
      <!--第三步-->
      <div v-show="active===2&&isInsider===0" style="overflow-y:auto; overflow-x:auto; width:100%; height:500px">
        <div>
          <div style="width: 100%;height: 25px;font-size: 14px;align-content: center;padding: 10px;">
            <span><FONT><strong>当前选择的角色&nbsp&nbsp&nbsp{{ roleTime }}</strong></FONT></span>
          </div>
          <br>
          <br>
          <div style="margin: 2px 0;margin: 5px 0px 5px 5px" />
          <div v-for="(city,index) in per.ps" style="margin: 5px 0px 0px 0px"><!--模块 functions-->
            <el-checkbox-group
              v-model="functions"
              style="text-align: left;margin: 0px 0px 0px 100px;font-style:oblique;padding: 7px"
              @change="addcheckboxTest(city.flag,city.id,index)"
            >
              <el-checkbox :key="index" :label="city.id">{{ city.parentFunctionName }}</el-checkbox>
            </el-checkbox-group>
            <div style="margin: 2px 0;margin: 5px 0px 5px 5px" /><!--二级菜单 functionsa-->
            <el-checkbox-group v-model="functionsa" style="text-align: left;margin: 0px 0px 0px 150px"><!--@change="addcheckboxTest01(test.id,index)"-->
              <el-checkbox v-for="(test,index) in city.functions" :key="index" :label="test.id">{{ test.functionName }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div v-show="active===2&&isInsider!==0" style=" overflow-y:auto; overflow-x:auto; width:100%; height:500px">
        <div v-for="(p,index) in per.roles" style="margin: 5px 0px 0px 0px">
          <el-radio-group v-model="single" style="margin: 0px 650px 0px 0px">
            <el-radio :key="index" :label="p" @change="checkboxTestcc(p)"><FONT><strong>{{ p.roleName }}</strong></FONT></el-radio>
          </el-radio-group>
          <div style="margin: 2px;padding-bottom: 5px" />
          <div v-for="(city,index) in p.ps">
            <el-checkbox-group
              v-model="functions"
              style="text-align: left;margin: 0px 0px 0px 120px;font-style:oblique;padding: 7px"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox :key="index" :label="city.id" disabled>{{ city.parentFunctionName }}</el-checkbox>
            </el-checkbox-group>
            <div style="margin: 2px;padding-bottom: 3px" />
            <el-checkbox-group
              v-model="functionsa"
              style="text-align: left;margin: 0px 0px 0px 180px"
              disabled
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox v-for="(test,index) in city.functions" :key="index" :label="test.id">{{ test.functionName }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <!--第四步-->
      <div v-show="active===3&&isInsider===0">
        <el-form
          id="submitForm"
          ref="form"
          :model="form"
          label-width="80px"
          style="width: 330px;margin: auto;padding: 5px"
          :rules="rules"
        >
          <el-form-item label="姓名" style="margin: 10px 0px 20px 0px" prop="trueName">
            <el-input v-model="form.trueName" placeholder="请输入姓名" auto-complete="off" />
          </el-form-item>
          <el-form-item label="手机号" style="margin: 10px 0px 20px 0px" prop="phoneNum">
            <el-input v-model="form.phoneNum" placeholder="请输入手机号" auto-complete="off" />
          </el-form-item>
          <el-form-item label="账号" style="margin: 10px 0px 20px 0px" prop="username">
            <el-input v-model="form.username" placeholder="请输入账号" auto-complete="off" />
          </el-form-item>
          <el-form-item label="密码" prop="passwordtest">
            <el-input v-model="form.passwordtest" type="password" placeholder="请输入密码" auto-complete="off" />
          </el-form-item>
          <el-form-item label="确认密码" prop="password">
            <el-input v-model="form.password" type="password" placeholder="确认密码" auto-complete="off" />
          </el-form-item>
        </el-form>
        <div style="width: 100%;height: 25px;font-size: 15px;align-content: center;padding: 2px">
          <span><FONT><strong>角色:&nbsp&nbsp&nbsp{{ roleTime }}</strong></FONT></span>
        </div>
        <br>
        <br>
        <div style=" overflow-y:auto; overflow-x:auto; width:100%; height:200px">
          <div v-for="(city,index) in result">
            <el-checkbox-group v-model="modelAndRole" style="text-align: left;margin: 0px 0px 0px 25%;font-style:oblique;padding: 7px">
              <el-checkbox :key="index" :label="city" disabled>{{ city.modelName }}</el-checkbox>
            </el-checkbox-group>
            <div style="margin: 2px;padding-bottom: 2px" />
            <el-checkbox-group v-model="testRole" style="text-align: left;margin: 0px 0px 0px 30%">
              <el-checkbox v-for="(test,index) in city.model" :key="index" :label="test" disabled>{{ test }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div v-show="active===3&&isInsider!==0" style="width: 350px;margin-left:28%;padding: 20px">
        <el-form
          id="el-form"
          ref="form"
          :model="form"
          label-width="80px"
          style="width: 330px;margin: auto"
          :rules="rules"
        >
          <el-form-item label="姓名" style="margin: 10px 0px 20px 0px" prop="trueName">
            <el-input v-model="form.trueName" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="手机号" style="margin: 10px 0px 20px 0px" prop="phoneNum">
            <el-input v-model="form.phoneNum" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="账号" style="margin: 10px 0px 20px 0px" prop="username">
            <el-input v-model="form.username" placeholder="请输入账号" />
          </el-form-item>
          <el-form-item label="密码" prop="passwordtest">
            <el-input v-model="form.passwordtest" type="password" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item label="确认密码" prop="password">
            <el-input v-model="form.password" type="password" placeholder="确认密码" />
          </el-form-item>
          <el-form-item label="签约名称" style="margin: 10px 0px 20px 0px">
            <el-input v-model="waibuName" disabled />
          </el-form-item>
        </el-form>
        <div style="width: 100%;height: 25px;font-size: 15px;align-content: center;padding: 2px;">
          <span style="float: bottom"><FONT><strong>角色:&nbsp&nbsp{{ waibuJueSe }}</strong></FONT></span>
        </div>
        <br>
        <br>
        <div style=" overflow-y:auto; overflow-x:auto; width:130%; height:100px">
          <div v-for="(city,index) in result">
            <el-checkbox-group
              v-model="modelAndRole"
              style="text-align: left;font-style:oblique;padding: 7px"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox :key="index" :label="city" disabled>{{ city.modelName }}</el-checkbox>
            </el-checkbox-group>
            <div style="margin: 2px;padding-bottom: 2px" />
            <el-checkbox-group
              v-model="testRole"
              style="text-align: left;margin: 0px 0px 0px 60px"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox v-for="(test,index) in city.model" :key="index" :label="test" disabled>{{ test }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div class="leftButton">
        <el-button type="primary" style="margin-top: 12px;" size="medium" class="buttontest" @click="addnext">{{ active==0 ? '取消':'上一步' }}
        </el-button>
        <el-button type="primary" style="margin-top: 12px;" size="medium" class="buttontest" @click="next('form')">{{ active==3 ? '完成':'下一步' }}
        </el-button>
      </div>
    </el-dialog>
    <!--分页-->
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
      isFullscreen: false,
      modelAndRole: [],
      testRole: [],
      functionModeul: [],
      functionrole: [],
      tableData: [],
      formVisible: false, // 弹框的控制false是关true是开;编辑用户的
      wformVisible: false, // 编辑外部账号
      echoroles: [],
      echofunctions: [],
      pojo: {}, // 也就是弹框里边的双向数据绑定绑定
      roleList: [], // 编辑回显所有的角色和功能集
      role: '', // 下拉框里边的角色数据绑定默认的
      module: '农场', // 下拉框里边的模块数据绑定
      permission: [], // 编辑的权限集合
      addformVisible: false, /* 添加用户的弹框*/
      active: 0,
      form: {
        trueName: '',
        phoneNum: '',
        username: '',
        password: '',
        passwordtest: '',
        isInsider: ''
      },
      addform: {
        trueName: '',
        phoneNum: '',
        username: '',
        password: '',
        passwordtest: '',
        isInsider: ''
      }, //
      tableData3: [], // 第二次选项
      external: [], // 第二次选择的数据
      multipleSelection: [],
      name: '',
      isInsider: 0, // 是不是内部人员
      isIndeterminate: false,
      functions: [], // 新增选择角色的集合
      functionsa: [], // 新增选择权限的集合
      roleTime: '', // 当前选择的角色
      per: [], // 当前选中的角色集合
      radio3: '',
      checkAll: [],
      state: 1,
      externaldiv: 1, // 外部账号选择
      currentPage: 1,
      total: 0,
      size: 10,
      roles: [], // 新增选择角色集合
      Permission: [], // 编辑里边的角色集合
      Character: [], // 编辑里边的权限集合
      active1: 0,
      nameArrtest: [],
      addisInsider: 1, // 编辑角色默认是内部账号
      stores: [], // 商铺名字的集合
      roleId: [],
      nameArr: [],
      rules: {
        trueName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        phoneNum: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        passwordtest: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      single: '',
      quanxianArrId: [],
      closeDialog: false,
      bossId: '',
      ps: '',
      result: [],
      waibu: '',
      radio: '',
      waibuStores: '',
      waibuJueSe: '',
      boosId: '',
      waibuName: '',
      waibuFarmAndUsers: '',
      waibuGrange: '',
      loading: false,
      input: ''
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
    this.functions = []
    this.functionsa = []
    this.roles = []
    this.single = ''
    this.radio = ''
    function uuid() {
      var s = []
      var hexDigits = '0123456789abcdef'
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4'
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
      s[8] = s[13] = s[18] = s[23] = '-'
      var uuid = s.join('')
      return uuid
    }
    this.$axios.get(`/server/account/findAllRoleAndFunction`).then((res) => {
      this.loading = false
      const dataList = res.data.queryResult.data
      this.ps = res.data.queryResult.data.ps
      this.stores = res.data.queryResult.data.stores
      this.waibu = res.data.queryResult.data
      this.waibuStores = res.data.queryResult.data.stores
      this.waibuFarmAndUsers = res.data.queryResult.data.farmAndUsers
      this.waibuGrange = res.data.queryResult.data.granges
      /* 给状态*/
      for (let i = 0; i < dataList.roles.length; i++) {
        dataList.roles[i].flag = false
        for (let f = 0; f < dataList.roles[i].ps.length; f++) {
          dataList.roles[i].ps[f].flag = false
          for (let a = 0; a < dataList.roles[i].ps[f].functions.length; a++) {
            dataList.roles[i].ps[f].functions[a].flag = false
          }
        }
      }

      for (let x = 0; x < dataList.ps.length; x++) {
        dataList.ps[x].flag = false
        for (let c = 0; c < dataList.ps[x].functions.length; c++) {
          dataList.ps[x].functions[c].flag = false
        }
      }
      for (let c = 0; c < dataList.roles.length; c++) {
        for (let v = 0; v < dataList.roles[c].ps.length; v++) {
          dataList.roles[c].ps[v].pid = uuid()
          for (let y = 0; y < dataList.roles[c].ps[v].functions.length; y++) {
            dataList.roles[c].ps[v].functions[y].fid = uuid()
          }
        }
      }
      this.per = dataList
    })
  },
  methods: {
    colne() {
      for (let i = 0; i < this.per.ps.length; i++) {
        this.per.ps[i].flag = false
        for (let x = 0; x < this.per.ps[i].functions.length; x++) {
          this.per.ps[i].functions[x].flag = false
        }
      }
      for (let x = 0; x < this.per.roles.length; x++) {
        this.per.roles[x].flag = false
        for (let i = 0; i < this.per.roles[x].ps.length; i++) {
          this.per.roles[x].ps[i].state = false
        }
      }
      for (let x = 0; x < this.per.ps.length; x++) {
        this.per.ps[x].state = false
        for (let c = 0; c < this.per.ps[x].functions.length; c++) {
          this.per.ps[x].functions[c].test = false
        }
      }
    },
    aaaaa(val) {
    },
    handleCheckedCitiesChange(val) {
    },
    addclose() {
      for (let i = 0; i < this.per.ps.length; i++) {
        this.per.ps[i].flag = false
        for (let x = 0; x < this.per.ps[i].functions.length; x++) {
          this.per.ps[i].functions[x].flag = false
        }
      }
      for (let x = 0; x < this.per.roles.length; x++) {
        this.per.roles[x].flag = false
        for (let i = 0; i < this.per.roles[x].ps.length; i++) {
          this.per.roles[x].ps[i].state = false
        }
      }
      for (let x = 0; x < this.per.ps.length; x++) {
        this.per.ps[x].state = false
        for (let c = 0; c < this.per.ps[x].functions.length; c++) {
          this.per.ps[x].functions[c].test = false
        }
      }
      this.addformVisible = false
      this.active = 0
      this.form = {}
      this.isInsider = 0
      this.roles = []
      this.functions = []
      this.functionsa = []
      this.roleTime = ''
      this.stores = []
      this.testRole = []
      this.result = []
      this.modelAndRole = []
      this.active1 = 0
      this.echoroles = {}
      this.echofunctions = {}
      this.functionsa = []
      this.functions = []
      this.addform = {}
      this.form = {}
    },
    /* 内*/
    nclose() {
      for (let i = 0; i < this.per.ps.length; i++) {
        this.per.ps[i].flag = false
        for (let x = 0; x < this.per.ps[i].functions.length; x++) {
          this.per.ps[i].functions[x].flag = false
        }
      }
      for (let x = 0; x < this.per.roles.length; x++) {
        this.per.roles[x].flag = false
        for (let i = 0; i < this.per.roles[x].ps.length; i++) {
          this.per.roles[x].ps[i].state = false
        }
      }
      for (let x = 0; x < this.per.ps.length; x++) {
        this.per.ps[x].state = false
        for (let c = 0; c < this.per.ps[x].functions.length; c++) {
          this.per.ps[x].functions[c].test = false
        }
      }
      for (let i = 0; i < this.per.ps.length; i++) {
        this.per.ps[i].flag = false
        for (let x = 0; x < this.per.ps[i].functions.length; x++) {
          this.per.ps[i].functions[x].flag = false
        }
      }
      for (let x = 0; x < this.per.roles.length; x++) {
        this.per.roles[x].flag = false
        for (let i = 0; i < this.per.roles[x].ps.length; i++) {
          this.per.roles[x].ps[i].state = false
        }
      }
      this.formVisible = false
      this.active1 = 0
      this.echoroles = {}
      this.echofunctions = {}
      this.roles = []
      this.functionsa = []
      this.functions = []
      this.addform = {}
      this.form = {}
      for (let i = 0; i < this.per.ps.length; i++) {
        this.per.ps[i].flag = false
        for (let x = 0; x < this.per.ps[i].functions.length; x++) {
          this.per.ps[i].functions[x].flag = false
        }
      }
      for (let x = 0; x < this.per.roles.length; x++) {
        this.per.roles[x].flag = false
        for (let i = 0; i < this.per.roles[x].ps.length; i++) {
          this.per.roles[x].ps[i].state = false
        }
      }
      for (let x = 0; x < this.per.ps.length; x++) {
        this.per.ps[x].state = false
        for (let c = 0; c < this.per.ps[x].functions.length; c++) {
          this.per.ps[x].functions[c].test = false
        }
      }
      this.testRole = []
      this.result = []
      this.modelAndRole = []
      this.active1 = 0
      this.echoroles = {}
      this.echofunctions = {}
      this.functionsa = []
      this.functions = []
      this.addform = {}
      this.form = {}
    },
    /* 外*/
    wclose() {
      for (let i = 0; i < this.per.ps.length; i++) {
        this.per.ps[i].flag = false
        for (let x = 0; x < this.per.ps[i].functions.length; x++) {
          this.per.ps[i].functions[x].flag = false
        }
      }
      for (let x = 0; x < this.per.roles.length; x++) {
        this.per.roles[x].flag = false
        for (let i = 0; i < this.per.roles[x].ps.length; i++) {
          this.per.roles[x].ps[i].state = false
        }
      }
      for (let x = 0; x < this.per.ps.length; x++) {
        this.per.ps[x].state = false
        for (let c = 0; c < this.per.ps[x].functions.length; c++) {
          this.per.ps[x].functions[c].test = false
        }
      }
      this.wformVisible = false
      this.testRole = []
      this.result = []
      this.modelAndRole = []
      this.active1 = 0
      this.echoroles = {}
      this.echofunctions = {}
      this.functionsa = []
      this.functions = []
      this.addform = {}
      this.form = {}
    },
    /* 初始化数据*/
    fetchData(val) {
      let order = 'desc'
      let name = 'created_time'
      if (val !== undefined && val.prop === `createdTimeStr`) {
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
      if (val !== undefined && val.prop === `trueName`) {
        if (val.order === undefined) {
          name = 'true_name'
          order = 'desc'
        }
        if (val.order === `descending`) {
          name = 'true_name'
          order = 'desc'
        }
        if (val.order === `ascending`) {
          name = 'true_name'
          order = 'asc'
        }
      }
      if (val !== undefined && val.prop === `username`) {
        if (val.order === undefined) {
          name = 'username'
          order = 'desc'
        }
        if (val.order === `descending`) {
          name = 'username'
          order = 'desc'
        }
        if (val.order === `ascending`) {
          name = 'username'
          order = 'asc'
        }
      }
      if (val !== undefined && val.prop === `phoneNum`) {
        if (val.order === undefined) {
          name = 'phone_num'
          order = 'desc'
        }
        if (val.order === `descending`) {
          name = 'phone_num'
          order = 'desc'
        }
        if (val.order === `ascending`) {
          name = 'phone_num'
          order = 'asc'
        }
      }
      this.loading = true
      this.functions = []
      this.functionsa = []
      this.roles = []
      this.single = ''
      this.radio = ''
      const input = this.input
      let url = ''
      url = `/server/account/findAllUser?page=${this.currentPage}&size=${this.size}&search=${this.input}&sortByFiled=${name}&sortByOrder=${order}`
      this.$axios.get(url).then(res => {
        this.loading = false
        const pageList = res.data.queryResult.data
        if (pageList === null) {
          return
        }
        this.total = pageList.total
        this.tableData = pageList.list
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
          /* 角色名处理*/
          let arr = ''
          for (let x = 0; x < this.tableData[i].roles.length; x++) {
            arr += (this.tableData[i].roles[x].roleName + ',')
          }
          /* 时间格式化*/

          let rol = ''
          rol += this.tableData[i].roles[0].roleName
          this.tableData[i].role = rol
          this.tableData[i].ro = arr.substring(0, arr.length - 1)
        }
      })
    },
    /* 添加账号*/
    add() {
      this.addformVisible = true
      this.roles = []
      this.functions = []
      this.functionsa = []
    },
    /* 保存*/
    save() {
      this.formVisible = false
    },
    /* 编辑*/
    edit(id) {
      this.loading = true
      this.$axios.get(`/server/account/findUserByUid/${id}`).then(res => {
        this.loading = false
        /* 当前选择项的角色*/
        const pojoEdit = res.data.queryResult.data.user
        this.isInsider = pojoEdit.isInsider
        /* 所有的的角色和权限*/
        this.roleList = res.data.queryResult.data.roles
        this.addform = pojoEdit
        this.form = pojoEdit
        /* 外部编辑*/
        if (pojoEdit.isInsider !== 0) {
          this.wformVisible = true
          const roleName = []
          this.radio = res.data.queryResult.data.bossId
          /* 数据回显*/
          for (let r = 0; r < pojoEdit.roles.length; r++) {
            this.single = (pojoEdit.roles[r].id)// functions
            /* this.waibuJueSe=pojoEdit.roles[r].roleName*/
            for (let c = 0; c < pojoEdit.roles[r].functions.length; c++) {
              roleName.push(pojoEdit.roles[r].functions[c].id)
              this.functionsa.push(pojoEdit.roles[r].functions[c].id)
            }
          }
          if (this.isInsider === 1) {
            for (let i = 0; i < this.waibuStores.length; i++) {
              if (this.waibuStores[i].id === this.radio) {
                this.waibuName = this.waibuStores[i].name
              }
            }
          }
          if (this.isInsider === 2) {
            for (let z = 0; z < this.waibuFarmAndUsers.length; z++) {
              if (this.waibuFarmAndUsers[z].id === this.radio) {
                this.waibuName = this.waibuFarmAndUsers[z].name
              }
            }
          }
          if (this.isInsider === 3) {
            for (let r = 0; r < this.waibuGrange.length; r++) {
              if (this.waibuGrange[r].id === this.radio) {
                this.waibuName = this.waibuGrange[r].name
              }
            }
          }
          this.$axios.get(`/server/account/findAllRoleAndFunction`).then(res => {
            const dataPs = res.data.queryResult.data.ps
            this.waibu = res.data.queryResult.data
            this.waibuStores = res.data.queryResult.data.stores
            this.waibuFarmAndUsers = res.data.queryResult.data.farmAndUsers
            this.waibuGrange = res.data.queryResult.data.granges
            /* 模块的选中*/
            for (let y = 0; y < dataPs.length; y++) {
              for (let a = 0; a < dataPs[y].functions.length; a++) {
                for (let b = 0; b < roleName.length; b++) {
                  if (dataPs[y].functions[a].id === roleName[b]) {
                    this.functions.push(dataPs[y].id)
                  }
                }
              }
            }
          })
          return
        }
        /* 内部编辑*/
        if (pojoEdit.isInsider === 0) {
          this.formVisible = true
          const roleName = []
          /* 数据回显*/
          for (let r = 0; r < pojoEdit.roles.length; r++) {
            this.roles.push(pojoEdit.roles[r].id)
            for (let c = 0; c < pojoEdit.roles[r].functions.length; c++) {
              roleName.push(pojoEdit.roles[r].functions[c].id)
              this.per.roles.forEach(item => {
                if (item.id === pojoEdit.roles[r].id) {
                  item.ps.forEach(key => {
                    key.functions.forEach(val => {
                      if (val.id === pojoEdit.roles[r].functions[c].id) {
                        this.functionsa.push(val.fid)
                      }
                    })
                  })
                }
              })
            }
          }
          this.$axios.get(`/server/account/findAllRoleAndFunction`).then((res) => {
            /* let dataList = res.data.queryResult.data
              let dataPs = res.data.queryResult.data.ps
              this.ps = res.data.queryResult.data.ps
              /!*给状态*!/
              for (let i = 0; i < dataList.roles.length; i++) {
                dataList.roles[i].flag = false
                for (let f = 0; f < dataList.roles[i].ps.length; f++) {
                  dataList.roles[i].ps[f].state = false
                }
              }
              for (let x = 0; x < dataList.ps.length; x++) {
                dataList.ps[x].state = false
                for (let c = 0; c < dataList.ps[x].functions.length; c++) {
                  dataList.ps[x].functions[c].test = false
                }
              }
              for(let x=0;x<dataList.roles.length;x++){
                for(let y=0;y<this.roles.length;y++){
                  if(this.roles[y]===dataList.roles[x].id){
                    dataList.roles[x].flag=true;
                  }
                }
              }
              this.per = dataList*/
            const dataList = res.data.queryResult.data
            const dataPs = res.data.queryResult.data.ps
            /* 模块的选中*/
            for (let y = 0; y < dataPs.length; y++) {
              for (let a = 0; a < dataPs[y].functions.length; a++) {
                for (let b = 0; b < roleName.length; b++) {
                  if (dataPs[y].functions[a].id === roleName[b]) {
                    this.per.roles.forEach(item => {
                      item.ps.forEach(key => {
                        if (dataPs[y].id === key.id) {
                          this.roles.forEach(each => {
                            if (item.id === each) {
                              this.functions.push(key.pid)
                            }
                          })
                        }
                      })
                    })
                  }
                }
              }
            }
          })
        }
      })
    },
    /* 激活与否*/
    activate(id) {
      this.loading = true
      this.$axios.get(`/server/account/updateUserStatus/${id}`).then(res => {
        this.loading = false
        this.fetchData()
      }).catch(error => {
        this.$message({
          type: 'info',
          message: '系统繁忙请稍后再试'
        })
        this.loading = false
      })
    },
    /* 删除*/
    strikeout(id) {
      this.$confirm('此操作将永久删除此账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$axios.delete(`/server/account/deleteUser/${id}`).then(res => {
          this.loading = false
          if (res.data.code === 10000) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchData()
          } else {
            this.$message({
              type: 'success',
              message: res.data.queryResult.data
            })
            this.fetchData()
          }
        })
      }).catch(() => {})
    },
    /* 密码重置*/
    notPassword(id) {
      this.$confirm('您确定要把该账号的密码重置为" 123456 " 吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$axios.get(`/server/account/resetPassword/${id}`).then(res => {
          this.loading = false
          if (res.data.code === 10000) {
            this.$message({
              type: 'success',
              message: '重置成功!'
            })
          } else {
            this.$message({
              type: 'success',
              message: '重置失败!'
            })
          }
        }).catch(error => {
          this.$message({
            type: 'inof',
            message: '系统繁忙请稍后再试'
          })
          this.loading = false
        })
      }).catch(() => {})
    },
    addsave() {
      this.addformVisible = false
    },
    /* 下一步*/
    next(form) {
      if (this.active === 0) {
        if (this.form.passwordtest !== this.form.password) {
          this.$message({
            type: 'warning',
            message: '两次输入的密码不对'
          })
          this.active = 0
          return
        }
        if (this.form.trueName === '' || this.form.trueName === undefined) {
          this.$message({
            type: 'warning',
            message: '请输入真实姓名 '
          })
          this.active = 0
          return
        }
        if (this.form.phoneNum === '' || this.form.phoneNum === undefined) {
          this.$message({
            type: 'warning',
            message: '请输入正确的手机号'
          })
          this.active = 0
          return
        }
        if (this.form.phoneNum.length < 11 || this.form.phoneNum.length === undefined) {
          this.$message({
            type: 'warning',
            message: '请输入正确的手机号'
          })
          this.active = 0
          return
        }
        if (this.form.username === '' || this.form.username === undefined) {
          this.$message({
            type: 'warning',
            message: '请输入正确的账号'
          })
          this.active = 0
          return
        }
        if (this.form.username.length < 6 || this.form.username.length === undefined) {
          this.$message({
            type: 'warning',
            message: '账号最低6位数'
          })
          this.active = 0
          return
        }
        if (this.form.password.length < 6 || this.form.password.length === undefined) {
          this.$message({
            type: 'warning',
            message: '密码最低六位数'
          })
          this.active = 0
          return
        }
      }
      if (this.active++ > 3) this.active = 4
      const mokuaiArr = []
      const quanxianArr = []
      if (this.active === 1) {
        if (this.radio === 0 || this.radio === undefined) {
          this.$message({
            type: 'info',
            message: '请选择一个模块'
          })
          this.active = 0
          return
        }
        if (this.isInsider === 1) {
          for (let i = 0; i < this.waibuStores.length; i++) {
            if (this.waibuStores[i].id === this.radio) {
              this.waibuName = this.waibuStores[i].name
            }
          }
        }
        if (this.isInsider === 2) {
          for (let z = 0; z < this.waibuFarmAndUsers.length; z++) {
            if (this.waibuFarmAndUsers[z].id === this.radio) {
              this.waibuName = this.waibuFarmAndUsers[z].name
            }
          }
        }
        if (this.isInsider === 3) {
          for (let r = 0; r < this.waibuGrange.length; r++) {
            if (this.waibuGrange[r].id === this.radio) {
              this.waibuName = this.waibuGrange[r].name
            }
          }
        }
      }
      if (this.active === 2) {
        const functions = unique(this.functions)
        const functionsa = unique(this.functionsa)
        const fun = []
        const funa = []
        this.per.roles.forEach(key => {
          key.ps.forEach(item => {
            functions.forEach(role => {
              if (item.pid === role) {
                fun.push(item.id)
              }
            })
            item.functions.forEach(cc => {
              functionsa.forEach(val => {
                if (cc.fid === val) {
                  funa.push(cc.id)
                }
              })
            })
          })
        })
        this.functions = []
        this.functionsa = []
        this.functions = fun
        this.functionsa = funa
        function unique(arr) {
          const hash = []
          for (let i = 0; i < arr.length; i++) {
            if (hash.indexOf(arr[i]) == -1) {
              hash.push(arr[i])
            }
          }
          return hash
        }
        var roles = unique(this.roles)
        let role = ''
        const nameArr = []
        for (let x = 0; x < this.per.roles.length; x++) {
          for (let i = 0; i < roles.length; i++) {
            if (roles[i] === this.per.roles[x].id) {
              nameArr.push(this.per.roles[x].roleName)
              role += this.per.roles[x].roleName + ',' + ''
            }
          }
        }
        this.nameArrtest = nameArr
        this.roleTime = role.substring(0, role.length - 1)
        for (let p = 0; p < this.ps.length; p++) {
          for (let x = 0; x < functions.length; x++) {
            if (this.ps[p].id === functions[x]) {
              this.ps[p].flag = true
            }
          }
          for (let i = 0; i < this.ps[p].functions.length; i++) {
            for (let y = 0; y < functionsa.length; y++) {
              if (this.ps[p].functions[i].id === functionsa[y]) {
                this.ps[p].functions[i].flag = true
              }
            }
          }
        }
      }
      if (this.active === 3) {
        this.modelAndRole = []
        this.testRole = []
        this.result = []
        function unique(arr) {
          return Array.from(new Set(arr))
        }
        const functionsa = unique(this.functionsa)
        const functions = unique(this.functions)
        const ps = this.ps
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
        /* this.functions = mokuaiArr
          this.functionsa = quanxianArr*/
        const per = this.per.ps
        for (let i = 0; i < per.length; i++) {
          for (let w = 0; w < functions.length; w++) {
            if (functions[w] === per[i].id) {
              mokuaiArr.push(per[i].parentFunctionName)
            }
          }
          for (let y = 0; y < per[i].functions.length; y++) {
            for (let u = 0; u < functionsa.length; u++) {
              if (functionsa[u] === per[i].functions[y].id) {
                quanxianArr.push(per[i].functions[y].functionName)
                this.quanxianArrId.push(per[i].functions[y].id)
              }
            }
          }
        }
      }
      if (this.active === 4) {
        if (this.isInsider === 0) {
          this.$refs[form].validate((valid) => {
            const user = {}
            function unique(arr) {
              return Array.from(new Set(arr))
            }
            const unknowns = unique(this.functionsa)
            user.username = this.form.username
            user.password = this.form.password
            user.phoneNum = this.form.phoneNum
            user.trueName = this.form.trueName
            user.functionArr = unknowns
            user.roleNameArr = this.nameArrtest
            user.isInsider = this.isInsider
            if (user.trueName === '') {
              this.$message({
                type: 'info',
                message: '请输入真实姓名 '
              })
              this.active = 3
              return
            }
            if (user.phoneNum === '') {
              this.$message({
                type: 'info',
                message: '请输入手机号'
              })
              this.active = 3
              return
            }
            if (user.username === '') {
              this.$message({
                type: 'info',
                message: '请输入账号'
              })
              this.active = 3
              return
            }
            if (user.password === '') {
              this.$message({
                type: 'info',
                message: '请输入密码'
              })
              this.active = 3
              return
            }
            if (user.roleNameArr.length === 0) {
              this.$message({
                type: 'info',
                message: '最少选择一个角色'
              })
              this.active = 3
              return
            }
            if (user.functionArr.length === 0) {
              this.$message({
                type: 'info',
                message: '最少选择一个权限'
              })
              this.active = 3
              return
            }
            if (this.form.passwordtest !== this.form.password) {
              this.$message({
                type: 'info',
                message: '两次输入的密码不对'
              })
              this.active = 3
              return
            }
            this.addformVisible = false
            this.active = 0
            this.isInsider = 0
            this.functionsa = []
            this.functions = []
            this.roles = []
            this.nameArrtest = []
            this.form = {}
            this.fetchData()
            for (let i = 0; i < this.per.ps.length; i++) {
              this.per.ps[i].flag = false
              for (let x = 0; x < this.per.ps[i].functions.length; x++) {
                this.per.ps[i].functions[x].flag = false
              }
            }
            for (let x = 0; x < this.per.roles.length; x++) {
              this.per.roles[x].flag = false
              for (let i = 0; i < this.per.roles[x].ps.length; i++) {
                this.per.roles[x].ps[i].state = false
              }
            }
            for (let x = 0; x < this.per.ps.length; x++) {
              this.per.ps[x].state = false
              for (let c = 0; c < this.per.ps[x].functions.length; c++) {
                this.per.ps[x].functions[c].test = false
              }
            }
            this.$axios.post(`/server/account/addUser`, user).then(res => {
              this.fetchData()
              if (res.data.code === 10000) {
                this.$message({
                  type: 'success',
                  message: '添加成功'
                })
              } else {
                this.fetchData()
                this.$message({
                  type: 'info',
                  message: res.data.queryResult.data
                })
              }
            })
          })
        }
        if (this.isInsider !== 0) {
          const user = {}
          user.username = this.form.username
          user.password = this.form.password
          user.phoneNum = this.form.phoneNum
          user.trueName = this.form.trueName
          user.isInsider = this.isInsider
          user.roleName = this.waibuJueSe
          user.bossId = this.boosId
          if (user.trueName === '') {
            this.$message({
              type: 'info',
              message: '请输入真实姓名 '
            })
            this.active = 3
            return
          }
          if (user.phoneNum === '') {
            this.$message({
              type: 'info',
              message: '请输入手机号'
            })
            this.active = 3
            return
          }
          if (user.username === '') {
            this.$message({
              type: 'info',
              message: '请输入账号'
            })
            this.active = 3
            return
          }
          if (user.password === '') {
            this.$message({
              type: 'info',
              message: '请输入密码'
            })
            this.active = 3
            return
          }
          if (user.roleName === '') {
            this.$message({
              type: 'info',
              message: '请选择对应的模块'
            })
            this.active = 3
            return
          }
          this.addformVisible = false
          this.loading = true
          this.active = 0
          this.isInsider = 0
          this.functionsa = []
          this.waibuJueSe = ''
          this.form = {}
          this.functions = []
          this.isInsider = 0
          this.roles = []
          for (let i = 0; i < this.per.ps.length; i++) {
            this.per.ps[i].flag = false
            for (let x = 0; x < this.per.ps[i].functions.length; x++) {
              this.per.ps[i].functions[x].flag = false
            }
          }
          for (let x = 0; x < this.per.roles.length; x++) {
            this.per.roles[x].flag = false
            for (let i = 0; i < this.per.roles[x].ps.length; i++) {
              this.per.roles[x].ps[i].state = false
            }
          }
          for (let x = 0; x < this.per.ps.length; x++) {
            this.per.ps[x].state = false
            for (let c = 0; c < this.per.ps[x].functions.length; c++) {
              this.per.ps[x].functions[c].test = false
            }
          }
          this.radio = ''
          this.$axios.post(`/server/account/addUser`, user).then(res => {
            this.fetchData()
            this.loading = false
            if (res.data.code === 10000) {
              this.$message({
                type: 'success',
                message: '添加成功'
              })
            } else {
              this.fetchData()
              this.$message({
                type: 'info',
                message: res.data.queryResult.data
              })
            }
          })
        }
      }
    },
    /* 上一步*/
    addnext() {
      if (this.active-- === -1) this.active = -1
      if (this.active === 1) {
        function unique(arr) {
          const hash = []
          for (let i = 0; i < arr.length; i++) {
            if (hash.indexOf(arr[i]) == -1) {
              hash.push(arr[i])
            }
          }
          return hash
        }
        const functions = unique(this.functions)
        const functionsa = unique(this.functionsa)
        const fun = []
        const funa = []
        this.per.roles.forEach(key => {
          this.roles.forEach(role => {
            if (key.id === role) {
              key.ps.forEach(item => {
                functions.forEach(role => {
                  if (item.id === role) {
                    fun.push(item.pid)
                  }
                })
                item.functions.forEach(cc => {
                  functionsa.forEach(val => {
                    if (cc.id === val) {
                      funa.push(cc.fid)
                    }
                  })
                })
              })
            }
          })
        })
        this.functions = []
        this.functionsa = []
        this.functions = fun
        this.functionsa = funa
      }
      if (this.active === -1) {
        for (let i = 0; i < this.per.ps.length; i++) {
          this.per.ps[i].flag = false
          for (let x = 0; x < this.per.ps[i].functions.length; x++) {
            this.per.ps[i].functions[x].flag = false
          }
        }
        for (let x = 0; x < this.per.roles.length; x++) {
          this.per.roles[x].flag = false
          for (let i = 0; i < this.per.roles[x].ps.length; i++) {
            this.per.roles[x].ps[i].state = false
          }
        }
        for (let x = 0; x < this.per.ps.length; x++) {
          this.per.ps[x].state = false
          for (let c = 0; c < this.per.ps[x].functions.length; c++) {
            this.per.ps[x].functions[c].test = false
          }
        }
        this.form = {}
        this.addformVisible = false
        this.isInsider = this.isInsider
        this.active = 0
        this.functions = []
        this.roles = []
        this.from = {}
        this.active = 0
        this.isInsider = 0
        this.functionsa = []
        this.waibuJueSe = ''
        this.form = {}
        this.functions = []
        this.isInsider = 0
        this.single = ''
        this.fetchData()
      }
    },
    /* 下一步*/
    next1() {
      if (this.active1++ > 3) this.active1 = 4
      function unique(arr) {
        return Array.from(new Set(arr))
      }
      if (this.active1 === 1) {
        if (this.isInsider === 1) {
          for (let i = 0; i < this.waibuStores.length; i++) {
            if (this.waibuStores[i].id === this.radio) {
              this.waibuName = this.waibuStores[i].name
            }
          }
        }
        if (this.isInsider === 2) {
          for (let z = 0; z < this.waibuFarmAndUsers.length; z++) {
            if (this.waibuFarmAndUsers[z].id === this.radio) {
              this.waibuName = this.waibuFarmAndUsers[z].name
            }
          }
        }
        if (this.isInsider === 3) {
          for (let r = 0; r < this.waibuGrange.length; r++) {
            if (this.waibuGrange[r].id === this.radio) {
              this.waibuName = this.waibuGrange[r].name
            }
          }
        }
        this.roleTime = ''
      }
      if (this.active1 === 2) {
        const roles = unique(this.roles)
        for (let a = 0; a < this.per.roles.length; a++) {
          if (this.per.roles[a].id === this.single) {
            this.waibuJueSe = this.per.roles[a].roleName
          }
        }
        if (this.isInsider === 0) {
          const functions = unique(this.functions)
          const functionsa = unique(this.functionsa)
          this.result = []
          const fun = []
          const funa = []
          this.per.roles.forEach(key => {
            key.ps.forEach(item => {
              functions.forEach(role => {
                if (item.pid === role) {
                  fun.push(item.id)
                }
              })
              item.functions.forEach(cc => {
                functionsa.forEach(val => {
                  if (cc.fid === val) {
                    funa.push(cc.id)
                  }
                })
              })
            })
          })
          this.functions = []
          this.functionsa = []
          this.functions = fun
          this.functionsa = funa
          for (let r = 0; r < this.per.ps.length; r++) {
            for (let e = 0; e < this.functions.length; e++) {
              if (this.per.ps[r].id === this.functions[e]) {
                this.per.ps[r].flag = true
              }
            }
          }
          let roleName = ''
          for (let p = 0; p < this.per.roles.length; p++) {
            for (let i = 0; i < roles.length; i++) {
              if (this.per.roles[p].id === roles[i]) {
                this.nameArr.push(this.per.roles[p].roleName)
                roleName += (this.per.roles[p].roleName + ',')
              }
            }
          }
          this.roleTime = roleName.substring(0, roleName.length - 1)
          for (let y = 0; y < this.per.ps.length; y++) {
            for (let o = 0; o < this.per.ps[y].functions.length; o++) {
              for (let k = 0; k < functionsa.length; k++) {
                if (this.per.ps[y].functions[o].id === functionsa[k]) {
                  this.roleId.push(this.per.ps[y].functions[o].id)
                }
              }
            }
          }
          for (let v = 0; v < this.per.ps.length; v++) {
            for (let j = 0; j < functions.length; j++) {
              if (this.per.ps[v].id === functions[j]) {
                this.per.ps[v].state = true
              }
            }
            for (let m = 0; m < this.per.ps[v].functions.length; m++) {
              for (let k = 0; k < functionsa.length; k++) {
                if (this.per.ps[v].functions[m].id === functionsa[k]) {
                  this.per.ps[v].functions[m].test = true
                }
              }
            }
          }
          if (this.isInsider === 1) {
            for (let i = 0; i < this.waibuStores.length; i++) {
              if (this.waibuStores[i].id === this.radio) {
                this.waibuName = this.waibuStores[i].name
              }
            }
          }
          if (this.isInsider === 2) {
            for (let z = 0; z < this.waibuFarmAndUsers.length; z++) {
              if (this.waibuFarmAndUsers[z].id === this.radio) {
                this.waibuName = this.waibuFarmAndUsers[z].name
              }
            }
          }
          if (this.isInsider === 3) {
            for (let r = 0; r < this.waibuGrange.length; r++) {
              if (this.waibuGrange[r].id === this.radio) {
                this.waibuName = this.waibuGrange[r].name
              }
            }
          }
        }
      }
      if (this.active1 === 3) {
        const functionsa = unique(this.functionsa)
        const ps = this.ps
        /* 数据组装*/
        const modul = []
        for (let w = 0; w < ps.length; w++) {
          const a = []
          for (let e = 0; e < ps[w].functions.length; e++) {
            for (let r = 0; r < functionsa.length; r++) {
              if (ps[w].functions[e].id === functionsa[r]) {
                const modeulAndRole = {}
                modeulAndRole.modelName = ps[w].functions[e].parentFunctionName
                a.push(ps[w].functions[e].functionName)
                modeulAndRole.model = (a)
                modul.push(modeulAndRole)
              }
            }
          }
        }
        const obj = {}
        for (let i = 0; i < modul.length; i++) {
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
      if (this.active1 === 4) {
        function unique(arr) {
          return Array.from(new Set(arr))
        }
        if (this.addform.isInsider !== 0) {
          this.formVisible = false
          this.wformVisible = false
          const user = {}
          user.phoneNum = this.addform.phoneNum
          user.trueName = this.addform.trueName
          user.username = this.addform.username
          user.password = this.addform.password
          user.isInsider = this.addform.isInsider
          user.roleName = this.waibuJueSe
          user.bossId = this.radio
          if (user.trueName === '') {
            this.$message({
              type: 'info',
              message: '请输入姓名'
            })
            this.active1 = 3
            return
          }
          if (user.phoneNum === '') {
            this.$message({
              type: 'info',
              message: '请输入手机号 '
            })
            this.active1 = 3
            return
          }
          this.addform = {}
          this.roles = []
          this.functions = []
          this.functionsa = []
          this.roleTime = ''
          this.active1 = 0
          this.active = 0
          this.isInsider = 0
          this.functionsa = []
          this.waibuJueSe = ''
          this.form = {}
          this.functions = []
          this.isInsider = 0
          this.radio = ''
          this.single = ''
          this.fetchData()
          this.loading = true
          for (let i = 0; i < this.per.ps.length; i++) {
            this.per.ps[i].flag = false
            for (let x = 0; x < this.per.ps[i].functions.length; x++) {
              this.per.ps[i].functions[x].flag = false
            }
          }
          for (let x = 0; x < this.per.roles.length; x++) {
            this.per.roles[x].flag = false
            for (let i = 0; i < this.per.roles[x].ps.length; i++) {
              this.per.roles[x].ps[i].state = false
            }
          }
          for (let x = 0; x < this.per.ps.length; x++) {
            this.per.ps[x].state = false
            for (let c = 0; c < this.per.ps[x].functions.length; c++) {
              this.per.ps[x].functions[c].test = false
            }
          }
          this.$axios.post(`/server/account/updateUser`, user).then(res => {
            this.loading = false
            this.fetchData()
            if (res.data.code === 10000) {
              this.$message({
                type: 'success',
                message: '编辑成功'
              })
            } else {
              this.$message({
                type: 'info',
                message: res.data.queryResult.data
              })
            }
          })
        }
        if (this.addform.isInsider === 0) {
          this.formVisible = false
          this.wformVisible = false
          const user = {}
          const a = unique(this.functionsa)
          user.password = this.addform.password
          user.isInsider = this.addform.isInsider
          user.username = this.addform.username
          user.trueName = this.addform.trueName
          user.phoneNum = this.addform.phoneNum
          user.functionArr = unique(a)
          user.roleNameArr = unique(this.roleTime.split(','))
          if (user.trueName === '') {
            this.$message({
              type: 'info',
              message: '请输入姓名'
            })
            this.active1 = 3
            return
          }
          if (user.phoneNum === '') {
            this.$message({
              type: 'info',
              message: '请输入手机号 '
            })
            this.active1 = 3
            return
          }
          this.addform = {}
          this.roles = []
          this.functions = []
          this.functionsa = []
          this.roleTime = ''
          this.active1 = 0
          this.active = 0
          this.isInsider = 0
          this.functionsa = []
          this.waibuJueSe = ''
          this.form = {}
          this.functions = []
          this.isInsider = 0
          this.fetchData()
          this.roleId = []
          this.loading = true
          for (let i = 0; i < this.per.ps.length; i++) {
            this.per.ps[i].flag = false
            for (let x = 0; x < this.per.ps[i].functions.length; x++) {
              this.per.ps[i].functions[x].flag = false
            }
          }
          for (let x = 0; x < this.per.roles.length; x++) {
            this.per.roles[x].flag = false
            for (let i = 0; i < this.per.roles[x].ps.length; i++) {
              this.per.roles[x].ps[i].state = false
            }
          }
          for (let x = 0; x < this.per.ps.length; x++) {
            this.per.ps[x].state = false
            for (let c = 0; c < this.per.ps[x].functions.length; c++) {
              this.per.ps[x].functions[c].test = false
            }
          }
          this.$axios.post(`/server/account/updateUser`, user).then(res => {
            this.loading = false
            this.fetchData()
            if (res.data.code === 10000) {
              this.$message({
                type: 'success',
                message: '编辑成功'
              })
            } else {
              this.$message({
                type: 'info',
                message: res.data.queryResult.data
              })
            }
          })
        }
      }
    },
    /* 上一步*/
    addnext1() {
      if (this.active1-- === -1) this.active1 = -1
      if (this.active1 === -1) {
        this.formVisible = false
        this.active1 = 0
        this.form = {}
        this.wformVisible = false
        this.active1 = 0
        this.externaldiv = 0
        this.stores = ''
        this.radio = ''
        this.roles = []
        this.functions = []
        this.functionsa = []
        this.modelAndRole = []
        this.testRole = []
        this.fetchData()
        for (let i = 0; i < this.per.ps.length; i++) {
          this.per.ps[i].flag = false
          for (let x = 0; x < this.per.ps[i].functions.length; x++) {
            this.per.ps[i].functions[x].flag = false
          }
        }
        for (let x = 0; x < this.per.roles.length; x++) {
          this.per.roles[x].flag = false
          for (let i = 0; i < this.per.roles[x].ps.length; i++) {
            this.per.roles[x].ps[i].state = false
          }
        }
        for (let x = 0; x < this.per.ps.length; x++) {
          this.per.ps[x].state = false
          for (let c = 0; c < this.per.ps[x].functions.length; c++) {
            this.per.ps[x].functions[c].test = false
          }
        }
      }
      if (this.active1 === 1) {
        this.roleTime = ''
        if (this.isInsider === 0) {
          function unique(arr) {
            const hash = []
            for (let i = 0; i < arr.length; i++) {
              if (hash.indexOf(arr[i]) == -1) {
                hash.push(arr[i])
              }
            }
            return hash
          }
          const functions = unique(this.functions)
          const functionsa = unique(this.functionsa)
          const roles = unique(this.roles)
          const fun = []
          const funa = []
          this.per.roles.forEach(key => {
            key.ps.forEach(item => {
              roles.forEach(role => {
                if (key.id === role) {
                  fun.push(item.pid)
                  item.functions.forEach(cc => {
                    funa.push(cc.fid)
                  })
                }
              })
            })
          })
          this.functions = []
          this.functionsa = []
          this.functions = fun
          this.functionsa = funa
        }
      }
      if (this.active1 === 2) this.result = []
    },
    /* 内部账号角色的选择 true是取消,false是添加*/
    checkboxTest(flag, id, index) {
      function unique(arr) {
        const hash = []
        for (let i = 0; i < arr.length; i++) {
          if (hash.indexOf(arr[i]) == -1) {
            hash.push(arr[i])
          }
        }
        return hash
      }
      let functions = []
      let functionsa = []
      if (this.functions.length !== 0) {
        functions = unique(this.functions)
      }
      if (this.functionsa.length !== 0) {
        functionsa = unique(this.functionsa)
      }
      /* 选中状态 this.waibuJueSe  */
      const JueSe = []
      if (flag === false) {
        for (let v = 0; v < this.per.roles.length; v++) {
          if (this.per.roles[v].id === id) {
            JueSe.push(this.per.roles[v].roleName)
            this.per.roles[v].flag = true
            this.roles.push(this.per.roles[v].id)
            for (let i = 0; i < this.per.roles[v].ps.length; i++) {
              this.per.roles[v].ps[i].flag = true
              functions.push(this.per.roles[v].ps[i].id)
              for (let y = 0; y < this.per.roles[v].ps[i].functions.length; y++) {
                this.per.roles[v].ps[i].functions[y].flag = true
                functionsa.push(this.per.roles[v].ps[i].functions[y].id)
              }
            }
          }
        }
        this.functions = unique(functions)
        this.functionsa = unique(functionsa)
        for (let q = 0; q < JueSe.length; q++) {
          this.waibuJueSe += JueSe[q] + ','
        }
      }
      /* 取消状态*/
      if (flag === true) {
        for (let v = 0; v < this.per.roles.length; v++) {
          if (this.per.roles[v].id === id) {
            // this.waibuJueSe = this.per.roles[v].roleName
            for (let a = 0; a < this.roles.length; a++) {
              if (this.roles[a] === this.per.roles[v].id) {
                this.per.roles[v].flag = false
                this.roles.splice(a--, 1)
              }
            }
            for (let i = 0; i < this.per.roles[v].ps.length; i++) {
              for (let e = 0; e < this.functions.length; e++) {
                for (let r = 0; r < this.per.roles[v].ps.length; r++) {
                  if (this.functions[e] === this.per.roles[v].ps[r].id) {
                    this.per.roles[v].ps[i].flag = false
                    this.functions.splice(e--, 1)
                  }
                  for (let i = 0; i < this.per.roles[v].ps[r].functions.length; i++) {
                    for (let y = 0; y < this.functionsa.length; y++) {
                      if (this.functionsa[y] === this.per.roles[v].ps[r].functions[i].id) {
                        this.per.roles[v].ps[r].functions[i].flag = false
                        this.functionsa.splice(y--, 1)
                        for (let a = 0; a < this.roles.length; a++) {
                          if (this.per.roles[v].id === this.roles[a]) {
                            for (let x = 0; x < this.per.roles[v].ps.length; x++) {
                              for (let e = 0; e < this.functions.length; e++) {
                                if (this.per.roles[v].ps[x].id !== this.functions[e]) {
                                  this.roles.splice(a--, 1)
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
              /*
                this.functions.push(this.per.roles[v].ps[i].id)
                for (let y = 0; y < this.per.roles[v].ps[i].functions.length; y++) {
                  this.per.roles[v].ps[i].functions[y].flag = true;
                  this.functionsa.push(this.per.roles[v].ps[i].functions[y].id)
                }
              }*/
            }
          }
          /* for (let a = 0; a < this.roles.length; a++) {
            if (this.roles[a] === p.roleName) {
              this.roles.splice(a, 1)
            }
          }
          for (let e = 0; e < this.functions.length; e++) {
            for (let r = 0; r < p.ps.length; r++) {
              if (this.functions[e] === p.ps[r].id) {
                this.functions.splice(e, 1)
              }
              for (let i = 0; i < p.ps[r].functions.length; i++) {
                for (let y = 0; y < this.functionsa.length; y++) {
                  if (this.functionsa[y] === p.ps[r].functions[i].id) {
                    this.functionsa.splice(y, 1)
                  }
                }
              }
            }
          }*/
        }
      }
    },
    checkboxTestcc(p) {
      this.functionsa = []
      this.functions = []
      this.waibuJueSe = p.roleName
      for (let x = 0; x < p.ps.length; x++) {
        this.functions.push(p.ps[x].id)
        for (let i = 0; i < p.ps[x].functions.length; i++) {
          this.functionsa.push(p.ps[x].functions[i].id)
        }
      }
    },
    handleCheckAllChange(val) {
    },
    /* 进来选角色*/
    handleCheckedCitiesChange(value) {
      if (this.functionsa.length === 0) {
        this.functionsa.push(value)
      }
      for (let a = 0; a < this.functionsa.length; a++) {
        if (this.functionsa[a] === value) {
          this.functionsa.splice(a--, 1)
        }
        if (this.functionsa[a] !== value) {
          this.functionsa.push(value)
        }
      }
    },
    aaaaa(val) {
    },
    getCurrentRow(val) {
      this.boosId = val
      this.waibuStores.forEach(item => {
        if (item.id === val) {
          this.waibuName = item.name
        }
      })
      this.waibuFarmAndUsers.forEach(item => {
        if (item.id === val) {
          this.waibuName = item.name
        }
      })
      this.waibuGrange.forEach(item => {
        if (item.id === val) {
          this.waibuName = item.name
        }
      })
    },
    handleCheckedCitiesChange() {
    },
    addcheckboxTest(flag, id, index) {
      let p = ''
      for (let y = 0; y < this.ps.length; y++) {
        if (this.ps[y].id === id) {
          p = this.ps[y]
        }
      }
      var roleid = p.id
      /* flag模块的状态值 false未选中.true选中,index当前点击那个模块*/
      if (p.flag === false) {
        this.functions.push(roleid)
        for (let q = 0; q < p.functions.length; q++) {
          this.functionsa.push(p.functions[q].id)
          p.functions[q].flag = true
        }
        p.flag = true
        this.ps[index] = p
        return
      }
      if (p.flag === true) {
        for (let r = 0; r < p.functions.length; r++) {
          for (let t = 0; t < this.functionsa.length; t++) {
            if (this.functionsa[t] === p.functions[r].id) {
              this.functionsa.splice(t--, 1)
              p.functions[r].flag = false
            }
          }
        }
        for (let e = 0; e < this.functions.length; e++) {
          if (this.functions[e] === p.id) {
            this.functions.splice(e--, 1)
          }
        }
        this.ps[index] = p
        p.flag = false
        return
      }
    },
    cccheckboxTest(flag, id, index) {
      function unique(arr) {
        const hash = []
        for (let i = 0; i < arr.length; i++) {
          if (hash.indexOf(arr[i]) == -1) {
            hash.push(arr[i])
          }
        }
        return hash
      }
      let functions = []
      let functionsa = []
      if (this.functions.length !== 0) {
        functions = unique(this.functions)
      }
      if (this.functionsa.length !== 0) {
        functionsa = unique(this.functionsa)
      }
      /* 选中状态 this.waibuJueSe  */
      const JueSe = []
      if (flag === false) {
        for (let v = 0; v < this.per.roles.length; v++) {
          if (this.per.roles[v].id === id) {
            JueSe.push(this.per.roles[v].roleName)
            this.per.roles[v].flag = true
            this.roles.push(this.per.roles[v].id)
            for (let i = 0; i < this.per.roles[v].ps.length; i++) {
              this.per.roles[v].ps[i].flag = true
              functions.push(this.per.roles[v].ps[i].pid)
              for (let y = 0; y < this.per.roles[v].ps[i].functions.length; y++) {
                this.per.roles[v].ps[i].functions[y].flag = true
                functionsa.push(this.per.roles[v].ps[i].functions[y].fid)
              }
            }
          }
        }
        this.functions = unique(functions)
        this.functionsa = unique(functionsa)
        for (let q = 0; q < JueSe.length; q++) {
          this.waibuJueSe += JueSe[q] + ','
        }
      }
      /* 取消状态*/
      if (flag === true) {
        for (let v = 0; v < this.per.roles.length; v++) {
          if (this.per.roles[v].id === id) {
            // this.waibuJueSe = this.per.roles[v].roleName
            for (let a = 0; a < this.roles.length; a++) {
              if (this.roles[a] === this.per.roles[v].id) {
                this.per.roles[v].flag = false
                this.roles.splice(a--, 1)
              }
            }
            for (let i = 0; i < this.per.roles[v].ps.length; i++) {
              for (let e = 0; e < this.functions.length; e++) {
                for (let r = 0; r < this.per.roles[v].ps.length; r++) {
                  if (this.functions[e] === this.per.roles[v].ps[r].pid) {
                    this.per.roles[v].ps[i].flag = false
                    this.functions.splice(e--, 1)
                  }
                  for (let i = 0; i < this.per.roles[v].ps[r].functions.length; i++) {
                    for (let y = 0; y < this.functionsa.length; y++) {
                      if (this.functionsa[y] === this.per.roles[v].ps[r].functions[i].fid) {
                        this.per.roles[v].ps[r].functions[i].flag = false
                        this.functionsa.splice(y--, 1)
                        for (let a = 0; a < this.roles.length; a++) {
                          if (this.per.roles[v].id === this.roles[a]) {
                            for (let x = 0; x < this.per.roles[v].ps.length; x++) {
                              for (let e = 0; e < this.functions.length; e++) {
                                if (this.per.roles[v].ps[x].id !== this.functions[e]) {
                                  this.roles.splice(a--, 1)
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

}
</script>
<style>
  .app-container {
    padding: 10px;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
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
    width: 100%;
    margin: 0px 0px 0px 53px;

  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
    height: 200px;
  }

  .external {
    width: 100%;
    height: 300px;
    float: left;
  }

  .buttontest {
    margin: 12px 30px 0px 10px;
  }

  form.el-from.demo-ruleForm {
    width: 420px;
   margin: 0px 0px 0px 0px;

  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .el-form.el-from {
    width: 100%;
    margin: 0px 0px 0px 0px;
  }

  input.el-input_inner {
    width: 500px;
  }

  form.el-form {
    width: 400px;
    padding-top: 15px;
    margin: 0px 0px 0px 220px;
  }
  form#el-form1.el-form {
    width: 400px;
    padding-top: 15px;
    margin: 0px 0px 0px 280px;
  }

  #submitForm {
    height: 370px;
  }

  #submitForm.el-form {
    height: 320px;
  }
  span.el-checkbox__label{
    font-size: 16px;
    color: #676767;
  }
  form.el-form{
    padding: 0px 0px 0px 0px;
  }
  #mycell.el-checkbox__input {
    display: none
  }
  .el-checkbox__input.is-disabled+span.el-checkbox__label {
    color: #676767;
    cursor: not-allowed;
  }
  .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #409eff  ;
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
    border-color: #409eff;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #edf2fc;
    border-color:#409eff;
  }
  .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #676767;
  }
  .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #676767;
  }

  .el-checkbox__inner::after {
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
    content: "";
    border: 1px solid #409eff;
    border-left: 0;
    border-top: 0;
    height: 7px;
    left: 4px;
    position: absolute;
    top: 1px;
    -webkit-transform: rotate(45deg) scaleY(0);
    transform: rotate(45deg) scaleY(0);
    width: 3px;
    -webkit-transition: -webkit-transform .15s ease-in .05s;
    transition: -webkit-transform .15s ease-in .05s;
    transition: transform .15s ease-in .05s;
    transition: transform .15s ease-in .05s, -webkit-transform .15s ease-in .05s;
    transition: transform .15s ease-in .05s,-webkit-transform .15s ease-in .05s;
    -webkit-transform-origin: center;
    transform-origin: center;
  }
  div {
    display: block;
    align-content: center;
  }

</style>

