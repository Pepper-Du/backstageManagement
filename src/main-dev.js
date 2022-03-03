import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import MyBreadcrumb from '@/components/myComponent/MyBreadcrumb.vue'

// 引入全局样式表
import '@/assets/css/global.css'

// 引入字体图标
import '@/assets/fonts/iconfont.css'

// 引入Tree控件
import TreeTable from 'vue-table-with-tree-grid'

// 引入moment格式化时间
import moment from 'moment'

// 引入文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1'
// 配置请求头
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('my-breadcrumb', MyBreadcrumb)

Vue.component('tree-table', TreeTable)

Vue.use(VueQuillEditor)

Vue.prototype.$moment = moment

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
