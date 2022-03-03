<template>
  <div>
    <!-- 面包屑导航区域 -->
    <my-breadcrumb :firstTitle="'订单管理'" :secondTitle="'订单列表'"></my-breadcrumb>

    <!-- 卡片式图区域 -->
    <el-card class="box-card">

      <!-- 搜索区域 -->
      <el-row>
        <el-col :span="7">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表区域 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格(元)" prop="order_price" width="120px"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="100px">
          <template v-slot:default="scope">
            <!-- 未付款 -->
            <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
            <!-- 已付款 -->
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="100px"></el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="200px"></el-table-column>
        <el-table-column label="操作" width="200px">
          <template>
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog"></el-button>
            <!-- 物流进度按钮 -->
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressDialog"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 8]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>

    </el-card>

    <!-- 修改地址的对话框 -->
    <el-dialog title="修改地址" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <span>
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader :options="cityData" v-model="editForm.address1"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="editForm.address2"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流进度的对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressDialogVisible" width="50%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>

  </div>
</template>

<script>
// 引入citydata
import cityData from './citydata.js'

export default {
  name: 'Order',
  data() {
    return {
      // 搜索查询对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 8
      },

      // 订单列表数据
      orderList: [],
      // 总订单条数
      total: 0,

      // 控制修改地址对话框的显示与隐藏
      editDialogVisible: false,

      // 修改地址的表单数据对象
      editForm: {
        address1: [],
        address2: ''
      },

      // 修改地址的表单验证规则
      editFormRules: {
        address1: [{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
        address2: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },

      cityData,

      // 控制物流进度对话框的显示与隐藏
      progressDialogVisible: false,

      // 物流进度数据
      progressInfo: []
    }
  },
  created() {
    // 获取订单列表数据
    this.getOrderList()
  },
  methods: {
    // 获取订单列表数据
    async getOrderList() {
      const { data: res } = await this.$http.get('/orders', { params: this.queryInfo })

      if (res.meta.status !== 200) return this.$message.error('获取订单数据失败')

      this.orderList = res.data.goods
      this.total = res.data.total

      // 格式化时间
      this.orderList.map((item) => {
        return (item.create_time = this.$moment(item.create_time).format('YYYY-MM-DD HH:mm:ss'))
      })
    },

    // 监听pagesize的改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },

    // 监听pagenum的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },

    // 展示修改地址的对话框
    showEditDialog() {
      this.editDialogVisible = true
    },

    // 监听修改地址对话框关闭的事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },

    // 展示物流进度的对话框
    async showProgressDialog() {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')

      if (res.meta.status !== 200) return this.$message.error('获取物流进度失败')

      this.progressInfo = res.data

      this.progressDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
