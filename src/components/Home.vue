<template>
  <div class="home_container">
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    // 退出功能
    logout () {
      window.sessionStorage.clear()
      this.$router.replace('/login')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
