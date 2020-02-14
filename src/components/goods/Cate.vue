<template>
  <div class="goods-cate-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addClick">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table class="tree-table" :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" :show-index="true" index-text="#" border :show-row-hover="false">
        <template slot="isok" slot-scope="scope">
          <i v-if="scope.row.cat_deleted === false" class="el-icon-success" style="color: lightgreen"></i>
          <i v-else class="el-icon-error" style="color: lightcoral"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" type="primary" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <template slot="option" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="editClick(scope.row.cat_id)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="delClick(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
          background
          @size-change="sizeChange"
          @current-change="currentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[4, 8, 12, 16]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCate" width="50%" @close="closeAdd" :close-on-click-modal="false">
      <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" prop="cat_pid">
          <el-cascader expand-trigger="hover" :props="cascaderProps" :options="pCateList" v-model="selectedKeys" @change="cateChange">
          </el-cascader>
        </el-form-item>
      </el-form>
      <!-- footer -->
      <span slot="footer">
        <el-button @click="addCate = false">取消</el-button>
        <el-button @click="add">确定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类 -->
    <el-dialog title="修改分类" :visible.sync="editCate" width="50%" @close="closeEdit" :close-on-click-modal="false">
      <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
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
  name: 'goodsCate',
  data() {
    return {
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      // 为 table 指定列的定义
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      },{
        label: '是否有效',
        // 当前模板列
        type: 'template',
        // 当前列使用的模板名称
        template: 'isok'
      },{
        label: '排序',
        // 当前模板列
        type: 'template',
        // 当前列使用的模板名称
        template: 'order'
      },{
        label: '操作',
        // 当前模板列
        type: 'template',
        // 当前列使用的模板名称
        template: 'option'
      }],
      // 添加分类对话框显示
      addCate: false,
      editCate: false,
      // 添加分类表单数据收集
      addForm: {
        cat_name: '',
        // 父级分类 id
        cat_pid: 0,
        // 默认一级分类
        cat_level: 0
      },
      editForm: {},
      addRules: {
        cat_name: [{required: true, message: '分类名称为必填项', trigger: 'blur'}],
        cat_pid: [{required: true, message: '父级分类为必填项', trigger: 'blur'}],
        cat_level: [{required: true, message: '分类等级为必填项', trigger: 'blur'}]
      },
      editRules: {
        cat_name: [{required: true, message: '分类名称为必填项', trigger: 'blur'}],
      },
      // 父级分类列表
      pCateList: [],
      // 指定级联选择框的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类 id 数组
      selectedKeys: []
    }
  },
  methods: {
    async getCateList() {
      const {data: res} = await this.$http.get('categories', {params: this.queryInfo})
      if (res.meta.status !== 200) return this.$msg.error('获取分类列表失败！')
      this.cateList = res.data.result
      console.log('catelist:',this.cateList)
      this.total = res.data.total
      this.$msg.success('获取分类列表成功！')
    },
    // 分页变化
    sizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getCateList()
    },
    currentChange(newnum) {
      this.queryInfo.pagenum = newnum
      this.getCateList()
    },
    // 关闭添加对话框
    closeAdd() {
      this.$refs.addFormRef.resetFields()
      this.selectedKeys = []
      this.addForm.cat_level = 0
      this.addForm.cat_pid = 0
    },
    // 添加按钮
    addClick() {
      this.getPcate()
      this.addCate = true
    },
    // 获取父级分类的数据列表
    async getPcate() {
      const {data:res} = await this.$http.get('categories', {params: {type: 2}})
      console.log(res)
      if (res.meta.status !== 200) return this.$msg.error('获取父级分类列表失败！')
      this.pCateList = res.data
    },
    // 确认添加
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const {data:res} = await this.$http.post('categories', this.addForm)
        if (res.meta.status !== 201) return this.$msg.error('添加分类失败！')
        this.$msg.success('添加分类成功！')
        this.getCateList()
        this.addCate = false
      })
    },
    // 选择项发生变化触发
    cateChange() {
      // 判断已选中的数据长度
      if (this.selectedKeys.length > 0) {
        this.addForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addForm.cat_level = this.selectedKeys.length
        return
      } else {
        // 没有选中分类
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      }
    },
    // 编辑按钮
    async editClick(id) {
      const {data:res} = await this.$http.get(`categories/${id}`)
      console.log('getInfo:', res.data)
      if (res.meta.status !== 200) return this.$msg.error('获取分类信息失败！')
      this.editForm = res.data
      console.log('form:', this.editForm)
      this.editCate = true
    },
    closeEdit() {
      this.$refs.editFormRef.resetFields()
    },
    edit() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        console.log(this.editForm.cat_id)
        const {data:res} = await this.$http.put(`categories/${this.editForm.cat_id}`, {cat_name: this.editForm.cat_name})
        console.log('sure:', res)
        if (res.meta.status !== 200) return this.$msg.error('修改分类信息失败！')
        this.$msg.success('修改分类信息成功！')
        this.getCateList()
        this.editCate = false
      })
    },
    async delClick(id) {
      const clickRes = await this.$confirm('此操作不可以撤回，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '算了',
        type: 'warning'
      }).catch(err => err)
      if (clickRes !== 'confirm') return this.$msg.info('你后悔了~')
      const {data: res} = await this.$http.delete(`categories/${id}`)
      if (res.meta.status !== 200) return this.$msg.error('删除失败！')
      this.$msg.success('删除成功！')
      this.getCateList()
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang='less' scoped>
  .tree-table {
    margin-top: 20px;
  }
</style>