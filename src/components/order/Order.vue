<template>
  <div class="order-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '1'" type="success">已付款</el-tag>
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="editClick"></el-button>
          <el-button type="success" size="mini" icon="el-icon-location" @click="editLoca"></el-button>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
          background
          @size-change="sizeChange"
          @current-change="currentChange"
          :current-page="queryInfo.pagenum"
          :page-size="queryInfo.pagesize"
          :page-sizes="[4, 8, 12, 16]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </el-card>

    <el-dialog width="50%" :visible.sync="editAdrr" title="修改订单信息" @close="closeEdit">
      <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="editForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editForm.address2" placeholder="请填写详细地址"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
          <el-button @click="editAdrr = false">取消</el-button>
          <el-button type="primary" @click="edit">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog width="50%" :visible.sync="proLoca" title="物流进度" @close="closeEdit">
      <el-timeline>
        <el-timeline-item
          v-for="(ac, i) in progressInfo"
          :key="i"
          :timestamp="ac.time"
        >
          {{ac.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { provinceAndCityData } from 'element-china-area-data'

export default {
  name: 'order',
  data() {
    return {
      orderList: [],
      queryInfo: {
        query: '',
        pagesize: 8,
        pagenum: 1
      },
      total: 0,
      editAdrr: false,
      editForm: {
        address1: [],
        address2: ''
      },
      editRules: {
        address1: [{required: true, message: '省市区为必须项', trigger: 'blur'}],
        address2: [{required: true, message: '街道为必须项', trigger: 'blur'}]
      },
      cityData: provinceAndCityData,
      proLoca: false,
      progressInfo: []
    }

  },
  methods: {
    async getOrderList() {
      const {data:res} = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$msg.error('获取订单列表失败！')
      this.$msg.success('获取订单列表成功！')
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    sizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getOrderList()
    },
    currentChange(newpagenum) {
      this.queryInfo.pagenum = newpagenum
      this.getOrderList()
    },
    editClick() {
      this.editAdrr = true
    },
    edit() {
      this.editAdrr = false
    },
    closeEdit() {
      this.$refs.editFormRef.resetFields()
    },
    async editLoca() {
      const {data:res} = await this.$http.get('/kuaidi/804909574412544580')
      if (res.meta.status !== 200) return this.$msg.error('获取物流信息失败！')
      this.progressInfo = res.data
      this.proLoca = true
    }
  },
  created() {
    this.getOrderList()
  }
}
</script>

<style lang='less' scoped>

</style>