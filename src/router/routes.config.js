/**
 * @description router构造器的routes
 */

 //因为JTopo源码里语法不符合strict模式，会报错，所以不能使用async component加载
import TopoLinks from '@/views/Topo/TopoLinks'

//因为iview一些组件采用不规范匿名的render函数，使用async component报错
import Login from '@/views/Login/Login'
import Home from '@/views/Home/Home'

import Dashboard from '@/views/Dashboard/Dashboard'

import Device from '@/views/Device/Device'
import Host from '@/views/Device/Host'
import PortConfig from '@/views/Device/PortConfig'
import Link from '@/views/Device/Link'
// import PortSpeedLimit from '@/views/Device/PortSpeedLimit'
import PortBinding from '@/views/Device/PortBinding'
import PortBindingVpc from '@/views/Device/PortBinding/Vpc'
import DeviceConfigBackup from '@/views/Device/DeviceConfigBackup'
import VLANConfig from '@/views/Device/VLANConfig'

import PortMonitor from '@/views/Monitor/PortMonitor'
import SwitchMonitor from '@/views/Monitor/SwitchMonitor'
import ODLMonitor from '@/views/Monitor/ODLMonitor'
import FlowMonitorNodes from '@/views/Monitor/FlowMonitor/Nodes'
import FlowMonitorFlow from '@/views/Monitor/FlowMonitor/Flow'
import FlowMonitorGroup from '@/views/Monitor/FlowMonitor/Group'
import OperateLogs from '@/views/Monitor/OperateLogs'

import Trap from '@/views/Trap/Trap'
import TrapServer from '@/views/Trap/TrapServer'
import LogConifg from '@/views/Trap/LogConifg'
import Mail from '@/views/Trap/Mail'

import AclConfig from '@/views/Strategy/AclConfig'
import PortBindAcl from '@/views/Strategy/PortBindAcl'
import QosConfig from '@/views/Strategy/QosConfig'
import PortBindQos from '@/views/Strategy/PortBindQos'

import Config from '@/views/Resource/Config'

import HSRP from '@/views/FreeConfig/HSRP'
import BGP from '@/views/FreeConfig/BGP'
import OSPFConfig from '@/views/FreeConfig/OSPFConfig'
import PortBindOSPF from '@/views/FreeConfig/PortBindOSPF'
import OVSConfig from '@/views/FreeConfig/OVSConfig'

import FireWallDevice from '@/views/Network/FireWallDevice'
import FireWallDeviceResource from '@/views/Network/FireWallDeviceResource'
import RouterBindResource from '@/views/Network/RouterBindResource'
import LBaasDevice from '@/views/Network/LBaasDevice'
import LBaasDeviceResource from '@/views/Network/LBaasDeviceResource'
import ExternalNetwork from '@/views/Network/ExternalNetwork'

import User from '@/views/User/User'
import WhiteList from '@/views/User/WhiteList'

import Tenant from '@/views/TenantNetwork/Tenant'
import Network from '@/views/TenantNetwork/Network'
import Subnet from '@/views/TenantNetwork/Subnet'
import Netport from '@/views/TenantNetwork/Netport'
import TenantTopo from '@/views/TenantNetwork/TenantTopo/TenantTopo'
import TenantInstanceMap from '@/views/TenantNetwork/TenantInstanceMap'

// 虚拟机管理
// 1.虚拟分布式交换机
// 2.端口
import VirtualSwitch from '@/views/Network/VirtualSwitch'
import VirtualPortGroup from '@/views/Network/VirtualPortGroup'

import RouterConfig from '@/views/Router/RouterConfig'
import LinkedRouter from '@/views/Router/LinkedRouter'
import MapRouter from '@/views/Router/MapRouter'

import ComputeDomain from '@/views/Domain/ComputeDomain'
import DomainHost from '@/views/Domain/DomainHost'
import DomainVirtualMachine from '@/views/Domain/DomainVirtualMachine'

import Region from '@/views/Topo/Region'
import RegionDetail from '@/views/Topo/Region/detail'
export default [
    {  
      path: '/',
      component: Login
    },
    {
      path:'/home',
      component: Home,
      children: [
        //拓扑管理
          {
            path: 'Dashboard',
            component: Dashboard
          },
          {
            path: 'TopoLinks',
            component: TopoLinks
          },
          // {
          //   path: 'TopoPic',
          //   component: () => import('@/views/Topo/TopoPic')
          // },
          //设备管理
          {
            path: 'Device',
            component: Device
          },
          {
            path: 'Link',
            component: Link
          },
          {
            path: 'Host',
            component: Host
          },
          {
            path: 'PortConfig',
            component: PortConfig
          },
          // {
          //   path: 'PortSpeedLimit',
          //   component: PortSpeedLimit
          // },
          {
            path: 'PortBinding',
            component: PortBinding
          },
          {
            path: 'PortBindingVpc',
            component: PortBindingVpc
          },
          {
            path: 'DeviceConfigBackup',
            component: DeviceConfigBackup
          },
          {
            path: 'VLANConfig',
            component: VLANConfig
          },
          //路由配置
          {
            path: 'HSRP',
            component: HSRP
          },
          {
            path: 'BGP',
            component: BGP
          },
          {
            path: 'OSPF',
            component: OSPFConfig
          },
          {
            path: 'PortBindOSPF',
            component: PortBindOSPF
          },
          {
            path: 'OVSConfig',
            component: OVSConfig
          },
          //监控管理
          {
            path: 'PortMonitor',
            component: PortMonitor
          },
          {
            path: 'SwitchMonitor',
            component: SwitchMonitor
          },
          {
            path: 'ODLMonitor',
            component: ODLMonitor
          },
          {
            path: 'FlowMonitorNodes',
            component: FlowMonitorNodes
          },
          {
            path: 'FlowMonitorFlow',
            component: FlowMonitorFlow
          },
          {
            path: 'FlowMonitorGroup',
            component: FlowMonitorGroup
          },
          {
            path: 'OperateLogs',
            component: OperateLogs
          },
          // {
          //   path: 'ServerMonitor',
          //   component: () => import('@/views/Monitor/ServerMonitor')
          // },
          // {
          //   path: 'ServerSummary',
          //   component: () =>import('@/views/Monitor/ServerSummary')
          // },
          // {
          //   path: 'MonitorCycle',
          //   component: () => import('@/views/Monitor/MonitorCycle')
          // },
          // {
          //   path: 'MonitorCycleSummary',
          //   component: () => import('@/views/Monitor/MonitorCycleSummary')
          // },
          //告警管理
          {
            path: 'Mail',
            component: Mail
          },
          {
            path: 'Trap',
            component: Trap
          },
          {
            path: 'TrapServer',
            component: TrapServer
          },
          {
            path: 'LogConifg',
            component: LogConifg
          },
          // {
          //   path: 'TrapSummary',
          //   component: () => import('@/views/Trap/TrapSummary')
          // },
          //策略管理
          {
            path: 'AclConfig',
            component: AclConfig
          },
          {
            path: 'PortBindAcl',
            component: PortBindAcl
          },
          {
            path: 'QosConfig',
            component: QosConfig
          },
          {
            path: 'PortBindQos',
            component: PortBindQos
          },
          //资源管理
          {
            path: 'Config',
            component: Config
          },
          //网络防火墙和负载均衡管理
          {
            path: 'FireWallDevice',
            component: FireWallDevice
          },
          {
            path: 'FireWallDeviceResource',
            component: FireWallDeviceResource
          },
          {
            path: 'RouterBindResource',
            component: RouterBindResource
          },
          {
            path: 'LBaasDevice',
            component: LBaasDevice
          },
          {
            path: 'LBaasDeviceResource',
            component: LBaasDeviceResource
          },
          {
            path: 'ExternalNetwork',
            component: ExternalNetwork
          },
          //租户网络
          {
            path: 'Tenant',
            component: Tenant
          },
          {
            path: 'Network',
            component: Network
          },
          {
            path: 'Subnet',
            component: Subnet
          },
          {
            path: 'Netport',
            component: Netport
          },
          {
            path: 'TenantTopo',
            component: TenantTopo
          },
          {
            path: 'TenantInstanceMap',
            component: TenantInstanceMap
          },
          //用户管理
          {
            path: 'User',
            component: User
          },
          {
            path: 'WhiteList',
            component: WhiteList
          },
          {
            path: 'OperateLogs',
            component: OperateLogs
          },
          //路由配置
          {
            path: 'RouterConfig',
            component: RouterConfig
          },
          //接口路由
          {
            path: 'LinkedRouter',
            component: LinkedRouter
          },
          //策略路由规则
          {
            path: 'MapRouter',
            component: MapRouter
          },
          //计算域
          {
            path: 'ComputeDomain',
            component: ComputeDomain
          },
          //计算域主机
          {
            path: 'DomainHost',
            component: DomainHost
          },
          //计算域虚拟机
          {
            path: 'DomainVirtualMachine',
            component: DomainVirtualMachine
          },
          // 虚拟机管理
          {
            path: 'VirtualSwitch',
            component: VirtualSwitch
          },
          {
            path: 'VirtualPortGroup',
            component: VirtualPortGroup
          },
          // 区域管理
          {
            path: 'Region',
            component: Region
          },
          {
            path: 'RegionDetail',
            component: RegionDetail
          },
      ]
    }
  ]