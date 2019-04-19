/**
 *  左侧菜单的配置模块 
 *      menuTab控制菜单展开项和激活项 
 *      menu为渲染的数据，包含name，icon和link。link为自定义字段，控制subMenu点击的路由
 */
export default {
    menuTab: {
        open: 1,
        active: '1-1'
    },
    menu :[
        {
            name: '系统概况',
            icon: 'iconfont icon-shebeigaikuang',
            subMenu: [
                {
                    name: '概况',
                    link: '/home/Dashboard'
                },
                {
                    name: '拓扑图',
                    link: '/home/TopoLinks'
                },
                {
                    name: '区域管理',
                    link: '/home/Region'
                }
            ]
        },
        {
            name: '运维监控',
            icon: 'iconfont icon-tongjibaobiao',
            subMenu: [
                {
                    name: '设备监控',
                    link: '/home/SwitchMonitor'
                },
                {
                    name: '端口监控',
                    link: '/home/PortMonitor'
                },
                {
                    name: '集群监控',
                    link: '/home/ODLMonitor'
                }, 
                {
                    name: '流表展示',
                    link: '/home/FlowMonitorNodes'
                },              
                {
                    name: 'Ovs配置',
                    link: '/home/OVSConfig'
                },
                {
                    name: '操作日志',
                    link: '/home/OperateLogs'
                },
                // {
                //     name: '监控周期设置',
                //     link: '/home/MonitorCycle'
                // },
                // {
                //     name: '交换机性能统计',
                //     link: '/home/MonitorCycleSummary'
                // },
                // {
                //     name: '端口统计',
                //     link: '/home/PortMonitor'
                // },
                // {
                //     name: '服务器信息',
                //     link: '/home/ServerMonitor'
                // },
                // {
                //     name: '服务器性能',
                //     link: '/home/ServerSummary'
                // }
            ]
        },
        {
            name: '物理网络',
            icon: 'iconfont icon-wuliwangluo',
            subMenu: [
                {
                    name: '交换机',
                    link: '/home/Device'
                },
                {
                    name: '防火墙',
                    link: '/home/FireWallDevice'
                },
                {
                    name: '负载均衡',
                    link: '/home/LBaasDevice'
                },
                {
                    name: '服务器',
                    link: '/home/Host'
                },
                {
                    name: '端口',
                    link: '/home/PortConfig'
                },
                {
                    name: '链路',
                    link: '/home/Link'
                },
                // {
                //     name: '限速',
                //     link: '/home/PortSpeedLimit'
                // },
                {
                    name: '绑定',
                    link: '/home/PortBinding'
                },
                {
                    name: '备份恢复',
                    link: '/home/DeviceConfigBackup'
                },
                {
                    name: 'VLAN配置',
                    link: '/home/VLANConfig'
                },
                {
                    name: '路由冗余',
                    link: '/home/HSRP'
                },
                {
                    name: 'BGP配置',
                    link: '/home/BGP'
                },
                {
                    name: 'OSPF配置',
                    link: '/home/OSPF'
                },
                {
                    name: '端口配置OSPF',
                    link: '/home/PortBindOSPF'
                },
                {
                    name: '当前告警',
                    link: '/home/Trap'
                },
                {
                    name: '告警配置',
                    link: '/home/TrapServer'
                },
                {
                    name: '日志配置',
                    link: '/home/LogConifg'
                },
                {
                    name: 'ACL规则',
                    link: '/home/AclConfig'
                },
                {
                    name: '端口配置ACL',
                    link: '/home/PortBindAcl'
                },
                {
                    name: 'Qos限速',
                    link: '/home/QosConfig'
                },
                {
                    name: '端口配置Qos',
                    link: '/home/PortBindQos'
                },
                {
                    name: '资源池',
                    link: '/home/Config'
                },
                {
                    name: '外部网络',
                    link: '/home/ExternalNetwork'
                },
                {
                    name: '计算域',
                    link: '/home/ComputeDomain'
                }
            ]
        },
        // {
        //     name: '路由配置',
        //     icon: 'gear-a',
        //     subMenu: [
                
        //     ]
        // },
        {
            name: '告警管理',
            icon: 'iconfont icon-gaojing',
            subMenu: [
                {
                    name: '邮箱设置',
                    link: '/home/Mail'
                }
                // {
                //     name: '告警统计',
                //     link: '/home/TrapSummary'
                // }
            ]
        },
        // {
        //     name: '策略管理',
        //     icon: 'ios-lightbulb',
        //     subMenu: [
        //     ]
        // },
        {
            name: '虚拟网络',
            icon: 'iconfont icon-xuniwangluo',
            subMenu: [
                {
                    name: '服务资源',
                    link: '/home/RouterBindResource'
                },
                {
                    name: '租户',
                    link: '/home/Tenant'
                },
                {
                    name: '租户拓扑',
                    link: '/home/TenantTopo'
                },
                {
                    name: 'VDS',
                    link: '/home/VirtualSwitch'
                },
                // {
                //     name: '端口组',
                //     link: '/home/VirtualPortGroup'
                // }
            ]
        },
        // {
        //     name: '租户网络',
        //     icon: 'ios-people',
        //     subMenu: [
        //     ]
        // },
        // {
        //     name: '资源管理',
        //     icon: 'briefcase',
        //     subMenu: [
        //     ]
        // },
        {
            name: '路由管理',
            icon: 'iconfont icon-luyou',
            subMenu: [             
                {
                    name: '路由接口',
                    link: '/home/LinkedRouter'
                },
                {
                    name: '路由配置',
                    link: '/home/RouterConfig'
                },
                {
                    name: '策略路由规则',
                    link: '/home/MapRouter'
                }
            ]
        },
        {
            name: '系统管理',
            icon: 'iconfont icon-xitongguanli',
            subMenu: [
                {
                    name: '用户',
                    link: '/home/User'
                },
                {
                    name: '白名单',
                    link: '/home/WhiteList'
                },
            ]
        }
    ]
}