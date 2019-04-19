<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    //通知提示时长设为3秒
    this.$Notice.config({
      duration: 3
    })
    //全局提示时长设为3秒
    this.$Message.config({
      duration: 2
    })
  },
  watch: { //实时监测route来remove全局的modal，因为modal点击close的icon并不会关闭！iview 的bug
    $route(to, from) {
      this.$Modal.remove()
    }
  }
}
</script>

<style>
body {
  /*上下按钮上三角箭头的颜色*/
  scrollbar-arrow-color: rgb(225, 230, 234); 
  /*滚动条阴影的颜色*/
  scrollbar-shadow-color: rgb(249, 250, 252); 
  /*滚动条背景颜色*/
  scrollbar-track-color: rgb(249, 250, 252); 
  /*滚动条的基本颜色*/
  scrollbar-base-color: rgb(225, 230, 234); 
  /*以上2项适用与：body、div、textarea、iframe*/
}

/* 滚动条整体部分 */
::-webkit-scrollbar {  
    width:10px;
    margin-right: 2px;
}
/* 滚动条两端的按钮 */
::-webkit-scrollbar-button { 
    display: none;
}
::-webkit-scrollbar:horizontal {
    height:10px;
    margin-bottom:2px
}
/* 外层轨道 */
::-webkit-scrollbar-track {  
    border-radius: 10px;
}
/*内层轨道，滚动条中间部分 */
::-webkit-scrollbar-track-piece {  
    background-color:  rgb(249, 250, 252);
    border-radius: 10px;
}
/* 滑块 */
::-webkit-scrollbar-thumb {  
    width:10px;
    border-radius: 5px;
    background: rgb(225, 230, 234);
}
/* 边角 */
::-webkit-scrollbar-corner { 
    width: 10px;
    background-color: rgb(225, 230, 234);
}
/* 鼠标移入滑块 */
::-webkit-scrollbar-thumb:hover { 
    background: rgb(225, 230, 234);
}

#app {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
/*所有表格字体变为14px*/
.ivu-table { 
    font-size: 14px !important;
}
/*所有form表单项item的下边距*/ 
.ivu-form-item {
    margin-bottom: 9px;
}
/*自动输入框的下拉列表高度*/
.ivu-auto-complete .ivu-select-dropdown-list {
    max-height: 250px;
    overflow: auto;
}
</style>
