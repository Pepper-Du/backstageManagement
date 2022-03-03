<template>
  <div>
    <!-- 面包屑导航区域 -->
    <my-breadcrumb :firstTitle="'商品管理'" :secondTitle="'商品分类'"></my-breadcrumb>

    <!-- 卡片式图区域 -->
    <el-card class="box-card">
      <!-- 添加分类按钮 -->
      <el-row class="catebtn">
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 分类列表区域 -->
      <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
        <!-- 是否有效 -->
        <template v-slot:isok="scope">
          <i class="el-icon-success" v-if="scope.row.cat_delete === false" style="color: lightgrenn"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template v-slot:order="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template v-slot:opt="">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页功能区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 8]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>

    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
      <!-- 内容主体区域 -->
      <span>
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <!-- props用来指定配置对象 -->
            <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" clearable @change="parentCateChange"></el-cascader>
          </el-form-item>
        </el-form>
      </span>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'Cate',
  data() {
    return {
      // 获取商品分类列表的参数对象
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 8
      },
      // 商品分类列表数据
      cateList: [],
      // 商品分类列表数据总条数
      total: 0,
      // 分类列表表格的列数据
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          // 启用作用域插槽
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          // 启用作用域插槽
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      // 展示/隐藏添加分类的对话框
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 添加分类的表单验证规则
      addCateFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      // 父级商品分类列表数据
      parentCateList: [],
      // 级联选择器中用来指定配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      // 选中的父级分类的id数组
      selectedKeys: []
    }
  },
  created() {
    // 获取商品分类列表数据
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表数据
    async getCateList() {
      const { data: res } = await this.$http.get('/categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取商品分类列表失败')
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 展示添加分类的对话框
    showAddCateDialog() {
      // 获取父级商品分类列表数据
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级商品分类列表数据
    async getParentCateList() {
      const { data: res } = await this.$http.get('/categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error('获取商品分类列表失败')
      this.parentCateList = res.data
    },
    // 级联选择器中选择项发生变化触发的函数
    parentCateChange() {
      // 如果selectedKeys的length > 0，则选中了父级分类，反之未选中
      if (this.selectedKeys.length > 0) {
        // 当前要添加的分类的父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 当前要添加的分类的等级
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 确定添加分类
    addCate() {
      // 提交信息的表单预验证
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        // 发请求
        const { data: res } = await this.$http.post('/categories', this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error('添加分类失败')
        this.$message.success('添加分类成功')

        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 监听添加分类的对话框关闭事件
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    }
  }
}
</script>

<style lang="less" scoped>
.catebtn {
  margin-bottom: 15px;
}

.el-cascader {
  width: 100%;
}
</style>
