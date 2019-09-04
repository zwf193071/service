/**
 * @author AlanChen
 * @module BreadLink面包屑导航组件的参数模块
 * @description 将面包屑组件抽离出来，与路由path结合，通过配置文件来动态渲染内容和对应的link跳转
 * @argument 
 *      path: 页面的当前路由path
 *      breadLink
 *          name： 面包屑的名称
 *          link： 面包屑对应的导航路由
 * 
 */

export default [
    {
        path: '/home/Region',
        breadLink: [
            {name: '系统概况', link: ''},
            {name: '区域管理', link: ''},
        ]
    }
]