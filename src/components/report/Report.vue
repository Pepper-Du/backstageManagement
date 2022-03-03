<template>
  <div>
    <!-- 面包屑导航区域 -->
    <my-breadcrumb :firstTitle="'数据统计'" :secondTitle="'数据报表'"></my-breadcrumb>

    <!-- 卡片式图区域 -->
    <el-card class="box-card">
      <!-- echarts区域 -->
      <div id="main" style="width: 750px;height:500px;"></div>
    </el-card>
  </div>
</template>

<script>
// 引入echarts
import * as echarts from 'echarts'
// 引入lodash
import _ from 'lodash'

export default {
  name: 'Report',
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  async mounted() {
    // dom元素已经渲染完毕
    var myChart = echarts.init(document.getElementById('main'))

    const { data: res } = await this.$http.get('/reports/type/1')
    if (res.meta.status !== 200) return this.$message.error('获取数据报表数据失败')

    // 合并两个对象
    const result = _.merge(res.data, this.options)

    myChart.setOption(result)
  }
}
</script>

<style lang="less" scoped>
</style>
