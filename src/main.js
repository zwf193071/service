// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

// import utilList from 'util-list'
// Vue.use(utilList.EventBus, {
//   prefix: 'Alan'
// })
// console.log(Vue.prototype)

//引入iview库
import iView from 'iview'
import 'iview/dist/styles/iview.css'
Vue.use(iView)

//引入element-dataset polyfill让iview兼容IE10及以下浏览器
import ElementDataset from 'element-dataset'
ElementDataset()

// 引入iconfont
// import '@/assets/iconfont/iconfont.css'
// 引入修改的样式
import '@/assets/css/modify.less'

// 引入 ECharts 主模块
const echarts = require('echarts/lib/echarts')
// 引入饼状图,柱状图,折线图
require('echarts/lib/chart/pie')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')
// 引入提示框、标题、图例、缩放组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/dataZoom')
// require("echarts/lib/component/legendScroll")
Vue.prototype.$_echarts = echarts

// 注册面包屑导肮组件为全局组件(使用频率非常高)
import BreadLink from '@/components/BreadLink/BreadLink.js'
Vue.component(BreadLink.name, BreadLink)

// scrollbar 滚动条插件

//Vue的全局配置
Vue.config.productionTip = false

//路由跳转加入loadingbar全局提示
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  next()
})

router.afterEach( route => {
  iView.LoadingBar.finish()
})

/* eslint-disable no-new */
//导出vue实例，然后在js模块里调用vue实例的方法和属性
export default new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

