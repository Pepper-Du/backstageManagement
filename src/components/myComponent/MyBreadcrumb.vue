<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{first_title}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{second_title}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'MyBreadcrumb',
  props: {
    firstTitle: {
      type: String
    },
    secondTitle: {
      type: String
    }
  },
  data() {
    return {
      first_title: this.firstTitle,
      second_title: this.secondTitle
    }
  }
}
</script>

<style>
</style>
