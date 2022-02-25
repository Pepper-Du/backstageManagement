import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 引入全局样式表
import '@/assets/css/global.css'

// 引入字体图标
import '@/assets/fonts/iconfont.css'

import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
// 配置请求头
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
