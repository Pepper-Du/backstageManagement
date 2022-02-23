<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="@/assets/logo.png">
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" class="login_form" :model="loginForm" :rules="loginFormRules">
        <!-- 用户名 -->
        <el-form-item label="用户名" class="form_input" prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      // 登录表单数据
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则
      loginFormRules: {
        // 用户名
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        // 密码
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 重置登录表单数据
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    // 登录功能
    login() {
      // 表单预验证
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('/login', this.loginForm)
        // 登录失败
        if (res.meta.status !== 200) {
          return this.$message({
            message: '登录失败',
            showClose: true,
            type: 'error'
          })
        }
        // 登录成功
        this.$message.success('登录成功')
        // 保存token
        window.sessionStorage.setItem('token', res.data.token)
        // 编程式导航跳转
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    border: 1px solid #eee;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;

  .form_input {
    height: 70px;
  }
}
</style>
