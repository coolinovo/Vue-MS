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
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table class="tree-table" :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" :show-index="true" index-text="#" border :show-row-hover="false">
        <temlate slot="isok" slot-scope="scope">
          <i v-if="scope.row.cat_deleted === false" class="el-icon-success" style="color: lightgreen"></i>
          <i v-else class="el-icon-error" style="color: lightcoral"></i>
        </temlate>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" type="primary" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <template slot="option" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
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
<!--    <el-dialog>-->
<!--      <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="70px">-->
<!--        <el-form-item label="分类名称" prop="username">-->
<!--          <el-input v-model="addForm.username"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="父级分类" prop="password">-->
<!--          <el-input v-model="addForm.password"></el-input>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      &lt;!&ndash; footer &ndash;&gt;-->
<!--      <span slot="footer">-->
<!--        <el-button>取消</el-button>-->
<!--        <el-button>确定</el-button>-->
<!--      </span>-->
<!--    </el-dialog>-->
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
      }]
    }
  },
  methods: {
    async getCateList() {
      const {data: res} = await this.$http.get('categories', {params: this.queryInfo})
      if (res.meta.status !== 200) return this.$msg.error('获取分类列表失败！')
      this.cateList = res.data.result
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