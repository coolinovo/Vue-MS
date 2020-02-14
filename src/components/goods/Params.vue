<template>
  <div class="goods-params-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" :closeable="false" show-icon></el-alert>
      <el-row class="cat-opt">
        <el-col>
          <span>选择商品分类</span>
          <el-cascader expand-trigger="hover" :props="cascaderProps" :options="cateList" v-model="selectedKeys" @change="cateChange">
          </el-cascader>
        </el-col>
      </el-row>
      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addCate = true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag @close="closeTag(i, scope.row)" v-if="scope.row.attr_vals" v-for="(item, i) in scope.row.attr_vals" :key="i" closable>{{item}}</el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="inputRef"
                    size="small"
                    @keyup.enter.native="inputConfirm(scope.row)"
                    @blur="inputConfirm(scope.row)"
                ></el-input>
                <el-button v-else size="small" @click="showInput(scope.row)">添加</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="editClick(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="delClick(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addCate = true">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag @close="closeTag(i, scope.row)" v-if="scope.row.attr_vals" v-for="(item, i) in scope.row.attr_vals" :key="i" closable>{{item}}</el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="inputRef"
                    size="small"
                    @keyup.enter.native="inputConfirm(scope.row)"
                    @blur="inputConfirm(scope.row)"
                ></el-input>
                <el-button v-else size="small" @click="showInput(scope.row)">添加</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="editClick(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="delClick(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addCate" width="50%" @close="closeAdd" :close-on-click-modal="false">
      <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- footer -->
      <span slot="footer">
        <el-button @click="addCate = false">取消</el-button>
        <el-button @click="add">确定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数 -->
    <el-dialog :title="'修改' + titleText" :visible.sync="editCate" width="50%" @close="closeEdit" :close-on-click-modal="false">
      <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- footer -->
      <span slot="footer">
        <el-button @click="editCate = false">取消</el-button>
        <el-button @click="edit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'params',
  data() {
    return {
      cateList: [],
      selectedKeys: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeName: 'many',
      manyData: [],
      onlyData: [],
      addCate: false,
      addForm: {
        attr_name: ''
      },
      addRules: {
        attr_name: [{required: true, message: `${this.titleText}为必填项`, trigger: 'blur'}]
      },
      editForm: {},
      editCate: false,
      editRules: {
        attr_name: [{required: true, message: `${this.titleText}为必填项`, trigger: 'blur'}]
      },
      inputVisible: false,
      inputValue: ''
    }
  },
  computed: {
    // 按钮需要被禁用？
    isBtnDisabled() {
      if (this.selectedKeys.length !== 3) return true
      return false
    },
    // 当前选中的三级分类的 id
    cateId() {
      if (this.selectedKeys.length === 3) return this.selectedKeys[2]
      return null
    },
    // dialog 标题
    titleText() {
      if (this.activeName === 'many') return '动态参数'
      return '静态属性'
    }
  },
  methods: {
    async getCateList() {
      const {data:res} = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$msg.error('获取分类列表失败！')
      this.cateList = res.data
    },
    cateChange() {
      this.getParamsData()
    },
    // 获取参数列表数据
    async getParamsData() {
      // 不是三级分类
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyData = []
        this.onlyData = []
        return
      }
      // 根据分类 id 获取对应参数
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: this.activeName}})
      console.log('params:', res)
      if (res.meta.status !== 200) return this.$msg.error('获取参数失败！')
      console.log(res.data)
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals?
        item.attr_vals = item.attr_vals.split(' '):[]
        // 添加布尔值控制文本框显示
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyData = res.data
        console.log(this.manyData)
      } else {
        this.onlyData = res.data
      }
    },
    // 页签点击事件
    tabClick() {
      console.log(this.activeName)
      this.getParamsData()
    },
    // 关闭添加对话框
    closeAdd() {
      this.$refs.addFormRef.resetFields()
    },
    add () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        console.log(res)
        if (res.meta.status !== 201) return this.$msg.error(`添加${this.titleText}失败！`)
        this.$msg.success('添加参数成功！')
        this.addCate = false
        this.getParamsData()
      })
    },
    async editClick(id) {
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, {
        params: {attr_sel: this.activeName}
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$msg.error(`获取${this.titleText}信息失败！`)
      this.editForm = res.data
      this.editCate = true
    },
    closeEdit() {
      this.$refs.editFormRef.resetFields()
    },
    edit() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) return this.$msg.error(`修改${this.titleText}信息失败！`)
        this.getParamsData()
        this.editCate = false
        this.$msg.success(`修改${this.titleText}信息成功！`)
      })
    },
    async delClick(id) {
      const clickRes = await this.$confirm('此操作不可以撤回，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '算了',
        type: 'warning'
      }).catch(err => err)
      if (clickRes !== 'confirm') return this.$msg.info('你后悔了~')
      const {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
      if (res.meta.status !== 200) return this.$msg.error('删除失败！')
      this.$msg.success('删除成功！')
      this.getParamsData()
    },
    showInput(row) {
      row.inputVisible = true
      // $nextTick：当页面上元素重新被渲染后才会执行回调函数代码
      this.$nextTick(()=> {
        this.$refs.inputRef.$refs.input.focus()
      })
    },
    inputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue)
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttr(row)
    },
    async saveAttr(row) {
      const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$msg.error('修改失败！')
      this.$msg.success('修改成功！')
    },
    closeTag(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttr(row)
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang='less' scoped>
.cat-opt {
  margin: 20px 0;
  span {
    margin-right: 20px;
  }
}
  .el-tag {
    margin: 10px;
  }
  .input-new-tag {
    width: 120px;
  }
</style>