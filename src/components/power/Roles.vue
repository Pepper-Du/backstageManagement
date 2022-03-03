<template>
  <div>
    <!-- 面包屑导航区域 -->
    <my-breadcrumb :firstTitle="'权限管理'" :secondTitle="'角色列表'"></my-breadcrumb>

    <!-- 卡片式图区域 -->
    <el-card class="box-card">
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot:default="scope">
            <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id" :class="['borderbottom', i1 === 0 ? 'bordertop' : '', 'vcenter']">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRight(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="[i2 === 0 ? '' : 'bordertop', 'vcenter']">
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRight(scope.row, item2.id)">
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRight(scope.row, item3.id)">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述">
        </el-table-column>
        <el-table-column prop="" label="操作" width="300px">
          <template v-slot:default="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightsDialogVisible" width="50%" @close="setRightsDialogClosed">
      <span>
        <!-- 树形控件 -->
        <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      // 角色列表数据
      rolesList: [],
      // 展示/隐藏分配权限对话框
      setRightsDialogVisible: false,
      // 所有权限数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认有权限的id值的数组，显示在树形控件中
      defKeys: [],
      // 当前即将分配权限的角色对应id
      roleId: ''
    }
  },
  created() {
    // 获取角色列表数据
    this.getRolesList()
  },
  methods: {
    // 获取角色列表数据
    async getRolesList() {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表数据失败')
      this.rolesList = res.data
    },
    // 删除单个三级权限
    async removeRight(role, rightId) {
      // 弹框提示用户是否删除
      const confirmResult = await this.$confirm('此操作将删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)

      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      // 发起删除单个权限的请求
      const { data: res } = await this.$http.delete(`/roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error('删除权限失败')
      role.children = res.data
    },
    // 展示分配权限对话框
    async showSetRightDialog(role) {
      // 当前即将分配权限的角色对应id
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('/rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取所有权限数据失败')
      this.rightsList = res.data

      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)
      this.setRightsDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys中
    getLeafKeys(node, arr) {
      // 判断是否为三级节点(三级节点不包含children属性)
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭时间
    setRightsDialogClosed() {
      this.defKeys = []
    },
    // 分配权限
    async allotRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`/roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightsDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bordertop {
  border-top: 1px solid #eee;
}
.borderbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
