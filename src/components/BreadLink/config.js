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
 * @LastEditTime: 2019-03-13 14:40:04
 * @LastEditors: 朱文芳
 * @UpdateLogs: 新增计算域及所属页面的面包屑导航
 */

export default [
    // 防火墙设备
    {
        path: '/home/FireWallDevice',
        breadLink: [
            {name: '防火墙', link: ''},
            {name: '设备', link: ''}
        ]
    },
    // 防火墙设备资源
    {
        path: '/home/FireWallDeviceResource',
        breadLink: [
            {name: '防火墙', link: ''},
            {name: '设备', link: '/home/FireWallDevice'},
            {name: '资源', link: ''}
        ]
    },
    // 负载均衡设备
    {
        path: '/home/LBaasDevice',
        breadLink: [
            {name: '负载均衡', link: ''},
            {name: '设备', link: ''}
        ]
    },
    // 负载均衡设备资源
    {
        path: '/home/LBaasDeviceResource',
        breadLink: [
            {name: '负载均衡', link: ''},
            {name: '设备', link: '/home/LBaasDevice'},
            {name: '资源', link: ''}
        ]
    },
    // 租户
    {
        path: '/home/Tenant',
        breadLink: [
            {name: '租户网络', link: ''},
            {name: '租户', link: ''}
        ]
    },
    // 租户端口详情(实例端口映射)
    {
        path: '/home/TenantInstanceMap',
        breadLink: [
            {name: '租户网络', link: ''},
            {name: '租户', link: '/home/Tenant'},
            {name: '端口详情', link: ''}
        ]
    },
    // 网络
    {
        path: '/home/Network',
        breadLink: [
            {name: '租户网络', link: ''},
            {name: '租户', link: '/home/Tenant'},
            {name: '网络', link: ''}
        ]
    },
    // 子网
    {
        path: '/home/Subnet',
        breadLink: [
            {name: '租户网络', link: ''},
            {name: '租户', link: '/home/Tenant'},
            {name: '网络', link: '/home/Network'},
            {name: '子网', link: ''}
        ]
    },
    // 端口
    {
        path: '/home/Netport',
        breadLink: [
            {name: '租户网络', link: ''},
            {name: '租户', link: '/home/Tenant'},
            {name: '网络', link: '/home/Network'},
            {name: '子网', link: '/home/Subnet'},
            {name: '端口', link: ''}
        ]
    },
    // 流表展示--节点
    {
        path: '/home/FlowMonitorNodes',
        breadLink: [
            {name: '节点', link: ''},
        ]
    },
    // 流表展示--流表
    {
        path: '/home/FlowMonitorFlow',
        breadLink: [
            {name: '节点', link: '/home/FlowMonitorNodes'},
            {name: '流表', link: ''}
        ]
    },
    // 流表展示--Group
    {
        path: '/home/FlowMonitorGroup',
        breadLink: [
            {name: '节点', link: '/home/FlowMonitorNodes'},
            {name: '组', link: ''}
        ]
    },
    // 计算域-主机
    {
        path: '/home/DomainHost',
        breadLink: [
            {name: '计算域', link: '/home/ComputeDomain'},
            {name: '主机', link: ''},
        ]
    },
    // 计算域-主机-虚拟机
    {
        path: '/home/DomainVirtualMachine',
        breadLink: [
            {name: '计算域', link: '/home/ComputeDomain'},
            {name: '主机', link: '/home/DomainHost'},
            {name: '虚拟机', link: ''},
        ]
    },
    // 端口绑定-vpc
    {
        path: '/home/PortBindingVpc',
        breadLink: [
            {name: '物理网络', link: ''},
            {name: '绑定', link: '/home/PortBinding'},
            {name: 'VPC配置', link: ''},
        ]
    },
    // 拓扑图管理-区域管理
    {
        path: '/home/Region',
        breadLink: [
            {name: '系统概况', link: ''},
            {name: '区域管理', link: ''},
        ]
    },
    // 拓扑图管理-区域详情管理
    {
        path: '/home/RegionDetail',
        breadLink: [
            {name: '系统概况', link: ''},
            {name: '区域管理', link: '/home/Region'},
            {name: '详情', link: ''},
        ]
    },
]