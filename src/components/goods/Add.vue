<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片式图区域 -->
    <el-card class="box-card">

      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" show-icon :closable="false" center>
      </el-alert>

      <!-- 步骤条区域 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- form表单包裹区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">

        <!-- tab栏区域 -->
        <el-tabs tab-position="left" v-model="activeIndex" @tab-click="tabClicked">
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
              <!-- 级联选择框 -->
              <el-cascader :options="cateList" :props="cascaderProps" v-model="addForm.goods_cat" @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(item1,i) in item.attr_vals" :key="i" :label="item1" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload :action="uploadUrl" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headerObj" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce">
            </quill-editor>

            <!-- 添加商品按钮 -->
            <el-button type="primary" class="addBtn" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>

      </el-form>
    </el-card>

    <!-- 图片预览的对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewDialogVisible" width="50%">
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>

  </div>
</template>

<script>
// 引入loadsh
import _ from 'lodash'

export default {
  name: 'Add',
  data() {
    return {
      // 当前激活的步骤索引
      activeIndex: '0',

      // 添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 1,
        // 级联选择器双向绑定的数组
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },

      // 添加商品的表单验证规则
      addFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      },

      // 商品分类列表数据
      cateList: [],

      // 级联选择器中用来指定配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },

      // 获取到的商品参数
      manyTableData: [],

      // 获取到的商品属性
      onlyTableData: [],

      // 上传图片的url地址
      uploadUrl: 'https://lianghj.top:8888/api/private/v1/upload',

      // 上传图片时添加的请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },

      // 上传图片时预览的地址
      previewPath: '',

      // 控制图片预览对话框的显示与隐藏
      previewDialogVisible: false
    }
  },
  created() {
    // 获取商品分类列表数据
    this.getCateList()
  },
  computed: {
    // 当前选中的三级分类的id
    cateId() {
      if (this.addForm.goods_cat.length === 3) return this.addForm.goods_cat[2]
      return null
    }
  },
  methods: {
    // 获取商品分类列表数据
    async getCateList() {
      const { data: res } = await this.$http.get('/categories')
      if (res.meta.status !== 200) return this.$message.error('获取商品分类列表失败')
      this.cateList = res.data
    },

    // tab标签页选中时触发的事件
    async tabClicked() {
      // 证明访问的是商品参数面板
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`/categories/${this.cateId}/attributes`, { params: { sel: 'many' } })

        if (res.meta.status !== 200) return this.$message.error('获取商品参数失败，请确认已选择商品分类')

        // 分割attr_vals为数组
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        })

        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        // 证明访问的是商品属性面板
        const { data: res } = await this.$http.get(`/categories/${this.cateId}/attributes`, { params: { sel: 'only' } })

        if (res.meta.status !== 200) return this.$message.error('获取商品属性失败，请确认已选择商品分类')

        this.onlyTableData = res.data
      }
    },

    // 处理上传图片时的图片预览事件
    handlePreview(file) {
      this.previewPath = file.response.data.url

      this.previewDialogVisible = true
    },

    // 处理上传图片时的图片移除事件
    handleRemove(file) {
      const filePath = file.response.data.tmp_path

      const i = this.addForm.pics.findIndex((x) => x.pic === filePath)

      this.addForm.pics.splice(i, 1)
    },

    // 监听图片上传成功的事件
    handleSuccess(response) {
      if (response.meta.status !== 200) return this.$message.error('上传图片失败')

      // 拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }

      // 将图片信息对象 push 到 pics 数组中
      this.addForm.pics.push(picInfo)
    },

    // 确认添加商品
    add() {
      // 添加商品的表单预验证
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请确认商品内容填写完整无误')

        // 深拷贝
        const form = _.cloneDeep(this.addForm)

        form.goods_cat = form.goods_cat.join(',')

        // 处理商品参数和属性
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          this.addForm.attrs.push(newInfo)
        })

        this.onlyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })

        form.attrs = this.addForm.attrs
        // 发请求
        const { data: res } = await this.$http.post('/goods', form)

        if (res.meta.status !== 201) return this.$message.error('添加商品失败')
        this.$message.success('添加商品成功')

        this.$router.push('/goods')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}
.el-checkbox {
  margin-right: 10px !important;
}
.previewImg {
  width: 100%;
}
.addBtn {
  margin-top: 15px;
}
</style>
