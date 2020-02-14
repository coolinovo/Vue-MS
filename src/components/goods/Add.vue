<template>
  <div class="goods-add-container">
    <h3>
      <!-- 面包屑导航 -->
      <el-breadcrumb>
        <el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加商品</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-alert type="info" title="添加商品信息" show-icon center :closable="false"></el-alert>
        <el-steps :space="200" :active="activeIndex - 0" process-status="finish" finish-status="success" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="80px" label-position="top">
          <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave"
            @tab-click="tabClick"
          >
            <el-tab-pane label="基本信息" name="0">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model="addForm.goods_price" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="addForm.goods_weight" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="addForm.goods_number" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品分类" prop="goods_cat">
                <el-cascader
                    expand-trigger="hover"
                   :options="cateList"
                   @change="cateChange"
                    :props="cateProps"
                    v-model="addForm.goods_cat"
                ></el-cascader>
              </el-form-item>
            </el-tab-pane>


            <el-tab-pane label="商品参数" name="1">
              <el-form-item :label="item.attr_name" v-for="item in manyData" :key="item.attr_id">
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox border :label="cb" v-for="(cb, i) in item.attr_vals" :key="i"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="2">
              <el-form-item :label="item.attr_name" v-for="item in onlyData" :key="item.attr_id">
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="3">
              <el-upload
                  action="https://www.liulongbin.top:8888/api/private/v1/upload"
                  :on-preview="preview"
                  :on-remove="onRemove"
                  list-type="picture"
                  :headers="headers"
                  :on-success="success"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="4">
              <quill-editor v-model="addForm.goods_introduce"></quill-editor>
              <el-button type="primary" class="ql-btn" @click="add">添加商品</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </el-card>
      <!-- 图片预览 -->
      <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
        <img :src="previewPath" alt="picture" class="pre">
      </el-dialog>
    </h3>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'add',
  data() {
    return {
      activeIndex: '0',
      cateList: [],
      // 添加表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addRules: {
        goods_name: [{required: true, message: '商品名称为必选项', trigger: 'blur'}],
        goods_price: [{required: true, message: '商品价格为必选项', trigger: 'blur'}],
        goods_weight: [{required: true, message: '商品重量为必选项', trigger: 'blur'}],
        goods_number: [{required: true, message: '商品数量为必选项', trigger: 'blur'}],
        goods_cat: [{required: true, message: '商品数量为必选项', trigger: 'blur'}]
      },
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      manyData: [],
      onlyData: [],
      // 请求头
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) return this.addForm.goods_cat[2]
      return null
    }
  },
  methods: {
    async getCateList() {
      const {data:res} = await this.$http.get('categories')
      console.log(res)
      if (res.meta.status !== 200) return this.$msg.error('获取分类数据失败！')
      this.cateList = res.data
    },
    cateChange() {
      if (this.addForm.goods_cat.length !== 3) return this.addForm.goods_cat = []
      console.log(this.addForm.goods_cat)
    },
    beforeTabLeave(avtive, oldActive) {
      if (oldActive === '0' && this.addForm.goods_cat.length !== 3) {
        this.$msg.error('请先选择商品分类！')
        return false
      }
    },
    async tabClick() {
      // 动态参数面板
      if (this.activeIndex === '1') {
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: {sel: 'many'}
        })
        console.log(res)
        if (res.meta.status !== 200) return this.$msg.error('获取动态参数列表失败！')
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length !== 0 ?
          item.attr_vals.split(' ') : []
        })
        this.manyData = res.data
      } else if (this.activeIndex === '2') {
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: {sel: 'only'}
        })
        console.log(res)
        if (res.meta.status !== 200) return this.$msg.error('获取静态属性列表失败！')
        // res.data.forEach(item => {
        //   item.attr_vals = item.attr_vals.length !== 0 ?
        //     item.attr_vals.split(' ') : []
        // })
        this.onlyData = res.data
      }
    },
    // 图片预览
    preview(file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 图片移除
    onRemove(file) {
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => {
        x.pic === filePath
      })
      this.addForm.pics.splice(i ,1)
      console.log(this.addForm)
    },
    success(res) {
      const picInfo = {pic: res.data.tmp_path}
      this.addForm.pics.push(picInfo)
    },
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$msg.error('请填写必要的表单项')
        // lodash cloneDeep(obj) 深拷贝
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        this.manyData.forEach(item => {
          const newinfo = {attr_id: item.attr_id, attr_value: item.attr_vals.join(' ')}
          this.addForm.attrs.push(newinfo)
        })
        this.onlyData.forEach(item => {
          const newinfo = {attr_id: item.attr_id, attr_value: item.attr_vals}
          this.addForm.attrs.push(newinfo)
        })
        form.attrs = this.addForm.attrs

        const {data:res} = await this.$http.post('goods', form)
        if (res.meta.status !== 201) return this.$msg.error('添加商品失败！')
        this.$msg.success('添加商品成功！')
        this.$router.push('/goods')
      })
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang='less' scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
  .pre {
    width: 100%;
  }
  .ql-btn {
    margin-top: 20px;
  }
</style>