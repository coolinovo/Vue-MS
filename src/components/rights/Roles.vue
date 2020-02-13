<template>
  <div class="roles-container">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addClick">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['vertical','bdbottom', i1 === 0?'bdtop':'']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeR(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二、三级权限 -->
              <el-col :span="19">
                <!-- 渲染二级权限 -->
                <el-row :class="['vertical', i2 === 0?'':'bdtop']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <!-- 二级 -->
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeR(scope.row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="18">
                    <el-tag closable @close="removeR(scope.row, item3.id)" type="warning" v-for="(item3, i3) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <pre></pre>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
           <el-button size="mini" type="primary" icon="el-icon-edit" @click="editClick(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="remove(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="giveClick(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addRole" width="50%" @close="closeDialog" :close-on-click-modal="false">
      <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer">
          <el-button @click="addRole = false">取消</el-button>
          <el-button type="primary" @click="add">确定</el-button>
        </span>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog title="修改角色信息" :visible.sync="editRole" width="50%" :close-on-click-modal="false">
      <el-form :model="editForm" ref="editFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer">
          <el-button @click="editRole = false">取消</el-button>
          <el-button type="primary" @click="edit">确定</el-button>
        </span>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="giveV" width="50%" :close-on-click-modal="false" @close="giveClose">
      <el-tree ref="treeRef" :data="rightsList" :props="treeProps" show-checkbox node-key="id" :default-expand-all="true" :default-checked-keys="defKeys"></el-tree>
      <!-- 底部 -->
      <span slot="footer">
        <el-button @click="giveV = false">取消</el-button>
        <el-button type="primary" @click="give">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'roles',
    data() {
      return {
        // 角色列表
        rolesList: [],
        // 添加角色对话框
        addRole: false,
        // 修改角色对话框
        editRole: false,
        // 分配权限
        giveV: false,
        // 添加表单手机数据
        addForm: {
          roleName: '',
          roleDesc: ''
        },
        // 添加角色验证
        addRules: {
          roleName: [{required: true, message: '角色名称为必填项', trigger: 'blur'}],
          roleDesc: [{required: true, message: '角色描述为必填项', trigger: 'blur'}]
        },
        // 角色表单数据收集
        editForm: {},
        // 权限信息列表
        rightsList: [],
        // 树形控件的属性绑定对象
        treeProps: {
          label: 'authName',
          children: 'children'
        },
        // 默认选中节点 id 值数组
        defKeys: [],
        // 即将分配权限的角色 id
        roleId: ''
      }
    },
    methods: {
      async getRoles() {
        const {data:res} = await this.$http.get(`roles`)
        console.log(res)
        if (res.meta.status !== 200) return this.$msg.error('获取角色列表失败！')
        this.rolesList = res.data
      },
      // 关闭添加对话框
      closeDialog() {
        this.$refs.addFormRef.resetFields()
      },
      // 添加角色
      addClick() {
        this.addRole = true
      },
      // 确认添加
      add() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return
          const {data:res} = await this.$http.post('roles', this.addForm)
          if (res.meta.status !== 201) return this.$msg.error('创建角色失败！')
          this.$msg.success(res.meta.msg)
          this.addRole = false
          this.getRoles()
        })
      },
      // 编辑按钮
      async editClick(id) {
        const {data:res} = await this.$http.get(`roles/${id}`)
        if (res.meta.status !== 200) return this.$msg.error('查询角色信息失败！')
        this.editForm = res.data
        this.editRole = true
      },
      // 确认修改
      async edit() {
        const {data:res} = await this.$http.put(`roles/${this.editForm.roleId}`, {roleName: this.editForm.roleName, roleDesc: this.editForm.roleDesc})
        if (res.meta.status !== 200) return this.$msg.error('修改角色信息失败！')
        this.$msg.success(res.meta.msg)
        this.editRole = false
        this.getRoles()
      },
      // 删除
      async remove(id) {
        const clickRes = await this.$confirm('此操作不可以撤回，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '算了',
          type: 'warning'
        }).catch(err => err)
        if (clickRes !== 'confirm') return this.$msg.info('你后悔了~')
        const {data: res} = await this.$http.delete(`roles/${id}`)
        if (res.meta.status !== 200) return this.$msg.error('删除失败！')
        this.$msg.success('删除成功！')
        this.getRoles()
      },
      // 删除权限
      async removeR(role, rid) {
        const clickRes = await this.$confirm('此操作不可以撤回，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '算了',
          type: 'warning'
        }).catch(err => err)
        if (clickRes !== 'confirm') return this.$msg.info('你后悔了~')
        const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rid}`)
        if (res.meta.status !== 200) return this.$msg.error('删除失败！')
        this.$msg.success('删除成功！')
        role.children = res.data
      },
      // 点击分配权限
      async giveClick(role) {
        this.roleId = role.id
        const {data:res} = await this.$http.get('rights/tree')
        if (res.meta.status !== 200) return this.$msg.error('获取权限信息失败！')
        this.rightsList = res.data
        this.getDefKeys(role, this.defKeys)
        this.giveV = true
      },
      // 递归获取三级节点
      getDefKeys(node, arr) {
        if (!node.children) return arr.push(node.id)
        node.children.forEach(item => this.getDefKeys(item, arr))
      },
      // 关闭分配
      giveClose() {
        this.defKeys = []
      },
      // 确定分配
      async give() {
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys(),
        ]
        const idStr = keys.join(',')
        const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})
        if (res.meta.status !== 200) return this.$msg.error('分配权限失败！')
        this.$msg.success('分配权限成功！')
        this.getRoles()
        this.giveV = false
      }
    },
    created() {
      this.getRoles()
    }
  }
</script>

<style lang='less' scoped>
  .el-tag {
    margin: 7px;
  }
  .bdtop {
    border-top: 1px solid #eee;
  }
  .bdbottom {
    border-bottom: 1px solid #eee;
  }
  .vertical {
    display: flex;
    align-items: center;
  }
</style>