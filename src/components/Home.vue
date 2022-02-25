<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <span>后台管理系统</span>
      <el-button @click="logout">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 折叠按钮 -->
        <div class="toggle_button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#686868" text-color="#dddddd" active-text-color="#fefefe" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="$route.path">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id">
              <!-- 一级菜单的模板区域 -->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体内容区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      // 左侧菜单列表数据
      menuList: [],
      // 菜单对应图标数据
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否折叠
      isCollapse: false
    }
  },
  created() {
    this.getMenuList()

    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 退出功能
    logout() {
      window.sessionStorage.clear()
      this.$router.replace('/login')
    },
    // 获取菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('/menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 折叠菜单栏按钮
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  background: #47362b;
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    font-size: 25px;
    color: #fefefe;
  }
  .el-button {
    background: #fefefe;
    color: #47362b;
  }
}
.el-aside {
  background: #686868;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background: #fefefe;
}
.iconfont {
  margin-right: 10px;
  color: #9b9b9b;
}
.toggle_button {
  background: #5f403b;
  color: #9b9b9b;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
