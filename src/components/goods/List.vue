<template>
  <div class="goods-list-container">
    <h3>
      <!-- 面包屑导航 -->
      <el-breadcrumb>
        <el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片视图 -->
      <el-card>
        <!-- 搜索与添加区域 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
              <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addClick">添加商品</el-button>
          </el-col>
        </el-row>
        <!-- 用户列表 -->
        <el-table :data="goodsList" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="商品名称" prop="goods_name"></el-table-column>
          <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
          <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
          <el-table-column label="创建时间" prop="add_time" width="180px">
            <template slot-scope="scope">
              {{scope.row.add_time | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="130px">
            <template slot-scope="scope">
              <el-tooltip content="修改" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editClick(scope.row.goods_id)"></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top" :enterable="false">
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="remove(scope.row.goods_id)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[4, 8, 12, 16]"
            :page-size="queryInfo.pagesize"
            layout="total,sizes,prev,pager,next,jumper"
            :total="total"
            background
        >
        </el-pagination>
      </el-card>

      <!-- 修改 -->
      <el-dialog title="修改信息" :visible.sync="editGoods" width="50%" @close="closeEdit" :close-on-click-modal="false">
        <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="70px">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="editForm.goods_name" disabled></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="editForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="editForm.goods_weight"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <span slot="footer">
          <el-button @click="editGoods = false">取消</el-button>
          <el-button type="primary" @click="edit">确定</el-button>
        </span>
      </el-dialog>
    </h3>
  </div>
</template>

<script>
  export default {
    name: 'list',
    data() {
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 8
        },
        goodsList: [],
        total: 0,
        editGoods: false,
        editForm: {},
        editRules: {
          goods_name: [{required: true, message: '商品名称为必选项', trigger: 'blur'}],
          goods_price: [{required: true, message: '商品名称为必选项', trigger: 'blur'}],
          goods_weight: [{required: true, message: '商品名称为必选项', trigger: 'blur'}]
        }
      }
    },
    methods: {
      async getGoodsList() {
        const {data:res} = await this.$http.get('goods', {params: this.queryInfo})
        if (res.meta.status !== 200) return this.$msg.error('获取商品列表失败！')
        this.$msg.success('获取商品列表成功！')
        console.log(res.data)
        this.goodsList = res.data.goods
        this.total = res.data.total
      },
      // 分页，改变页面大小
      sizeChange(newsize) {
        this.queryInfo.pagesize = newsize
        this.getGoodsList()
      },
      // 分页，改变当前页
      currentChange(newnum) {
        this.queryInfo.pagenum = newnum
        this.getGoodsList()
      },
      // 添加商品
      addClick() {
        this.$router.push('/goods/add')
      },
      // 添加关闭
      closeAdd() {
        this.$refs.addFormRef.resetFields()
      },
      // 编辑商品
      async editClick(id) {
        const {data:res} = await this.$http.get(`goods/${id}`)
        if (res.meta.status !== 200) return this.$msg.error('获取商品信息失败！')
        this.editForm = res.data
        this.editGoods = true
      },
      // 确认编辑
      edit() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return
          const {data:res} = await this.$http.post(`goods/${this.editForm.goods_id}`, this.editForm)
          if (res.meta.status !== 200) return this.$msg.error('编辑商品信息失败！')
          this.getGoodsList()
          this.editGoods = false
          this.$msg.success('编辑商品信息成功！')
        })
      },
      // 编辑关闭
      closeEdit() {
        this.$refs.addFormRef.resetFields()
      },
      // 删除
      async remove(id) {
        const clickRes = await this.$confirm('此操作不可以撤回，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '算了',
          type: 'warning'
        }).catch(err => err)
        if (clickRes !== 'confirm') return this.$msg.info('你后悔了~')
        const {data: res} = await this.$http.delete(`goods/${id}`)
        if (res.meta.status !== 200) return this.$msg.error('删除失败！')
        this.$msg.success('删除成功！')
        this.getGoodsList()
      }
    },
    created() {
      this.getGoodsList()
    }
  }
</script>

<style lang='less' scoped>

</style>