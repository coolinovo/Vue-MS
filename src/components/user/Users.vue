<template>
  <div class="users">
    <h3>
      <!-- 面包屑导航 -->
      <el-breadcrumb>
        <el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片视图 -->
      <el-card>
        <!-- 搜索与添加区域 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addUser = true">添加用户</el-button>
          </el-col>
        </el-row>
        <!-- 用户列表 -->
        <el-table :data="userlist" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label="状态" prop="mg_state">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" @change="stateChange(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
              <el-tooltip content="修改" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top" :enterable="false">
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="remove(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="queryInfo.pagenum" :page-sizes="[4, 8, 12, 16]" :page-size="queryInfo.pagesize" layout="total,sizes,prev,pager,next,jumper" :total="total"/>
      </el-card>

      <!-- 添加用户 -->
      <el-dialog title="添加用户" :visible.sync="addUser" width="50%" @close="closeDialog" :close-on-click-modal="false">
        <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <span slot="footer">
          <el-button @click="addUser = false">取消</el-button>
          <el-button type="primary" @click="add">确定</el-button>
        </span>
      </el-dialog>
      <!-- 修改 -->
      <el-dialog title="修改信息" :visible.sync="editUser" width="50%" @close="closeEdit" :close-on-click-modal="false">
        <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <span slot="footer">
          <el-button @click="editUser = false">取消</el-button>
          <el-button type="primary" @click="edit">确定</el-button>
        </span>
      </el-dialog>
    </h3>
  </div>
</template>

<script>
export default {
  name: 'users',
  data() {
    // 自定义校验规则
    const checkEmail = (rule, val, cb) => {
      const regE = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (regE.test(val)) return cb()
      cb(new Error('请输入合法邮箱！'))
    }
    const checkMobile = (rule, val, cb) => {
      const regM = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/
      if (regM.test(val)) return cb()
      cb(new Error('请输入合法手机！'))
    }
    return {
      // 用户列表参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      userlist: [],
      total: 0,
      // 对话框显示
      addUser: false,
      // 添加用户规则
      addRules: {
        username: [{required: true, message: '用户名为必填项！', trigger: 'blur'}],
        password: [{required: true, message: '密码为必填项！', trigger: 'blur'}],
        email: [{required: true, message: '邮箱为必填项！', trigger: 'blur'}, {validator: checkEmail, trigger: 'blur'}],
        mobile: [{required: true, message: '手机为必填项！', trigger: 'blur'}, {validator: checkMobile, trigger: 'blur'}]
      },
      // 添加用户表单
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 编辑用户对话框显示
      editUser: false,
      editForm: {},
      editRules: {
        username: [{}],
        password: [{required: true, message: '密码为必填项！', trigger: 'blur'}],
        mobile: [{required: true, message: '手机为必填项！', trigger: 'blur'}, {validator: checkMobile, trigger: 'blur'}]
      }
    }
  },
  methods: {
    async getUserList() {
      const {data:res} = await this.$http.get('users', {params: this.queryInfo})
      console.log(res)
      if (res.meta.status !== 200) return this.$msg.error('获取数据失败!')
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // pagesize 变化事件
    sizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getUserList()
    },
    // 页码变化
    currentChange(newpagenum) {
      console.log(newpagenum)
      this.queryInfo.pagenum = newpagenum
      console.log(this.queryInfo.pagenum)
      this.getUserList()
    },
    // 监听状态开关改变
    async stateChange(userInfo) {
      const {data:res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$msg.error('更新用户状态失败!')
      }
      this.$msg.success('更新用户状态成功!')
    },
    // 对话框关闭
    closeDialog() {
      this.$refs.addFormRef.resetFields()
    },
    // 确定添加
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const {data:res} = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$msg.error('添加用户失败')
        this.$msg.success('添加用户成功！')
        this.addUser = false
        this.getUserList()
      })
    },
    // 编辑用户
    async editDialog(id) {
      const {data:res} = await this.$http.get(`users/${id}`)
      if (res.meta.status !==200) {
        this.editUser = false
        this.$msg.error('查询用户信息失败！')
      }
      this.editForm = res.data
      this.editUser = true
    },
    closeEdit() {
      this.$refs.editFormRef.resetFields()
    },
    edit() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const {data:res} = await this.$http.put(`users/${this.editForm.id}`, {email:this.editForm.email, mobile: this.editForm.mobile})
        if (res.meta.status !==200) return this.$msg.error('更新用户信息失败！')
        this.editUser = false
        this.getUserList()
        this.$msg.success('修改用户信息成功！')
      })
    },
    // 删除
    async remove(id) {
      const clickRes = await this.$confirm('此操作不可以撤回，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '算了',
        type: 'warning'
      }).catch(err => err)
      if (clickRes !== 'confirm') return this.$msg.info('你后悔了~')
      const {data: res} = await this.$http.delete(`users/${id}`)
      if (res.meta.status !== 200) return this.$msg.error('删除失败！')
      this.$msg.success('删除成功！')
      this.getUserList()
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style lang='less' scoped>

</style>