/**
 * @description 设备管理接口
 */
export default {
    //设备
    GetAllDevice: {
        url: 'device/getAllDevice'
    },
    AddDevice: {
        url: 'topology/batchAddDevice'
    },
    DeleteDevice: {
        url: 'device/deleteDevice'
    },
    EditDeviceConfig: {
        url: 'device/updateDevice'
    },
    //查询设备角色
    QueryDeviceRole: {
        url: 'device/getDeviceRole'
    },
    //链路
    GetAllLink: {
        url: 'link/readLink'
    },
    GetAllDesDevices: { // 获取所有的目的端设备
        url: 'link/getLinkDevice'
    },
    GetPortByLinkDevice: { // 通过目的端设备查询端口
        url: 'link/getLinkPort'
    },
    AddLink: {
        url: 'link/createLink'
    },
    DeleteLink: {
        url: 'link/removeLink'
    },
    RefreshLink: {
        url: 'link/scanLink'
    },
    //端口配置
    GetPortConfigByDevice: {
        url: 'port/getPortIpByDevice'
    },
    AddPortConfigByDevice: {
        url: 'port/insertPortIp'
    },
    DeletePortConfigByDevice: {
        url: 'port/deletePortIp'
    },
    //loopback配置
    GetLoopbackByDevice: {
        url: 'port/getLoopBackByDevice'
    },
    AddLoopbackByDevice: {
        url: 'port/insertLoopback'
    },
    DeleteLoopbackByDevice: {
        url: 'port/deleteLoopback'
    },
    QueryLoopbackByConfig: { // 查询OSPF、BGP的loopback ip
        url: 'port/getLoopback'
    },
    //主机
    GetAllHost: {
        url: 'host/getAllHosts'
    },
    AddHost: {
        url: 'host/insertHost'
    },
    DeleteHost: {
        url: 'host/deleteHost'
    },
    EditHostConfig: {
        url: 'host/updateHost'
    },
    //租户网络network和子网信息
    GetNetworkAndSubnetInfo: {
        url: 'netWork/getNetWorkAndSubnetList'
    },
    //裸金端口
    GetBareMetalPort: {
        url: 'bareMetal/getPortList'
    },
    AddBareMetalPort: {
        url: 'bareMetal/addPort',
    },
    DeleteBareMetalPort: {
        url: 'bareMetal/deletePort'
    },
    EditBareMetalPortConfig: {
        url: 'bareMetal/updatePort'
    },
    //端口绑定和vpc
    GetAllVPC: {
        url: 'portBinding/queryVpcAll'
    },
    GetVPC: {
        url: 'portBinding/queryVpc'
    },
    AddVPC: {
        url: 'portBinding/createVpc'
    },
    DeleteVPC: {
        url: 'portBinding/deleteVpc'
    },
    //设备配置文件备份和恢复
    GetDeviceBakcup: {
        url: 'configFile/getConfigFile'
    },
    SetDeviceBakcup: {
        url: 'configFile/backUp'
    },
    DeleteDeviceBakcup: {
        url: 'configFile/delete'
    },
    QueryVrf: { //查询vrf用于设置备份
        url: 'configFile/queryVrf'
    },
    RecoveryDeviceConfig: {
        url: 'configFile/recovery'
    },
    StoreDeviceConfig: { // 保存设备配置到交换机
        url: 'device/addDeviceConfig'
    },
    //VLAN管理
    SetPortBindVlan: {
        url: 'vlanConfig/setPort2VlanMode'
    },
    //HSRP/VRRP配置
    GetHSRP: {
        url: 'vlanConfig/getHsrpOrVrrpConfigs'
    },
    AddHSRP: {
        url: 'vlanConfig/configHsrpOrVrrp'
    },
    DeleteHSRP: {
        url: 'vlanConfig/configHsrpOrVrrp'
    },
    //BGP 全局配置 
    GetAllBgpRouterConfigs: { //所有BGP全局配置
        url: 'bgp/getBgpRouterConfigs'
    },
    GetSingleBgpRouterConfigs: { //单个BGP全局配置
        url: 'bgp/getBgpRouterConfigByDevIp'
    },
    EditBgpRouterConfigs: {
        url: 'bgp/configBgpRouter'
    },
    DeleteBgpRouterConfigs: {
        url: 'bgp/delBgpRouter'
    },
    //BGP peer配置
    GetBgpPeerConfigs: {
        url: 'bgp/getBgpPeerConfigs'
    },
    AddBgpPeerConfigs: {
        url: 'bgp/configBgpNeighbor'
    },
    DeleteBgpPeerConfigs: {
        url: 'bgp/delBgpNeighbor'
    },
    ApplyBgpConfig: { //自动下发spine设备
        url: 'bgp/addUnderlayBgp'
    },
    //OSPF配置
    GetOSPFConfig: {
        url: 'ospf/routerOspf'
    },
    AddOSPFConfig: {
        url: 'ospf/insertOspfInstance'
    },
    DeleteOSPFConfig: {
        url: 'ospf/deleteOspfInstance'
    },
    GetOSPFConfigByDevice: {
        url: 'ospf/getOspfInstance'
    },
    GetPortOSPFConfig: {
        url: 'ospf/getDevicePortOspf'
    },
    SetPortBindOSPF: {
        url: 'ospf/insertOspf'
    },
    SetPortUnbindOSPF: {
        url: 'ospf/deleteOspf'
    },
    //Acl管理
    GetAclConfig: {
        url: 'acl/queryAcl'
    },
    GetAclConfigByDevice: {
        url: 'acl/queryAclByDeviceIp'
    },
    AddAcl: {
        url: 'acl/insertAcl'
    },
    DeleteAcl: {
        url: 'acl/deleteAcl'
    },
    GetPortAclConfig: {
        url: 'acl/getDevicePortAclByDevIp'
    },
    SetPortBindAcl: {
        url: 'acl/devicePortBindAcl'
    },
    SetPortUnbindAcl: {
        url: 'acl/devicePortUnBindAcl'
    },
    // Qos管理
    GetQosConfig: {
        url: 'qos/queryQos'
    },
    AddQosConfig: {
        url: 'qos/createClassMapAndPolicy'
    },
    DeleteQosConfig: {
        url: 'qos/deleteQosPolicy'
    },
    GetQosPolicyByDevice: { 
        url: 'qos/getQosPolicyByDevice'
    }, 
    GetPortBindQos: {
        url: 'qos/getQosBindPolicy'
    }, 
    SetPortBindQos: { 
        url: 'qos/portBindPolicy' 
    }, 
    SetPortUnbindQos: { 
        url: 'qos/portUnBindPolicy' 
    },
    //防火墙设备
    GetFireWallDevice: {
        url: 'fwaas/getAllFWDevice'
    },
    GetFireWallInterfaceByID: {
        url: 'fwaas/getInterfaceOfDeviceId'
    },
    AddFireWallDevice: {
        url: 'fwaas/addFWDevice'
    },
    EditFireWallDevice: {
        url: 'fwaas/updateFWDevice'
    },
    CheckFireWallDeviceCanDelete: {
        url: 'fwaas/checkFWDeviceCanBeDelete '
    },
    DeleteFireWallDevice: {
        url: 'fwaas/deleteFWDevice'
    },
    //防火墙设备资源
    GetFireWallDeviceResource: {
        url: 'fwaas/getAllFwDeviceResource'
    },
    AddFireWallDeviceResource: {
        url: 'fwaas/addFwDeviceResource'
    },
    EditFireWallDeviceResource: {
        url: 'fwaas/updateFwDeviceResource'
    },
    CheckFireWallResourceCanDelete: {
        url: 'fwaas/checkFWDeviceResourceCanBeDelete '
    },
    DeleteFireWallDeviceResource: {
        url: 'fwaas/deleteFwDeviceResource'
    },
    // 负载均衡设备
    GetLBaasDevice: {
        url: 'lbaas/getAllF5Device'
    },
    GetLBaasInterfaceByID: {
        url: 'lbaas/getInterfacesOfF5Device'
    },
    AddLBaasDevice: {
        url: 'lbaas/addF5Device'
    },
    EditLBaasDevice: {
        url: 'lbaas/updateF5Device'
    },
    CheckLBaasDeviceCanDelete: {
        url: 'lbaas/checkDeviceCanBeDelete'
    },
    DeleteLBaasDevice: {
        url: 'lbaas/deleteF5Device'
    },
    // 负载均衡设备资源
    GetLBaasDeviceResource: {
        url: 'lbaas/getAllF5DeviceResource '
    },
    AddLBaasDeviceResource: {
        url: 'lbaas/configF5DeviceResource'
    },
    EditLBaasDeviceResource: {
        url: 'lbaas/updateF5DeviceResource '
    },
    CheckLBaasResourceCanDelete: {
        url: 'lbaas/checkResourceCanBeDelete'
    },
    DeleteLBaasDeviceResource: {
        url: 'lbaas/deleteF5DeviceResource'
    },
    // FW/LB路由
    GetAllRouter: {
        url: 'lbaas/getAllRouter'
    },
    GetAvilableLBResource: { // 查询所有可以被绑定的LB资源
        url: 'lbaas/getAllAvilableResource'
    },
    GetAvilableFWResource: { // 查询所有可以被绑定的FW资源
        url: 'fwaas/getAllAvilableFwDeviceResource'
    }, 
    SetRouterBindFW: {
        url: 'fwaas/fwDeviceBindRouter'
    },
    SetRouterUnbindFW: {
        url: 'fwaas/fwDeviceUnBindRouter'
    },
    SetRouterBindLB: {
        url: 'lbaas/resourceBindRouter'
    },
    CheckLBResourceCanUnbind: {
        url: 'lbaas/checkResourceCanUnbind'
    },
    SetRouterUnbindLB: {
        url: 'lbaas/resourceUnBindRouter'
    },
    //告警
    GetAllTrap: {
        url: 'trap/getAllTrap'
    },
    TrapConfirm: {
        url: 'trap/trapConfirm'
    },
    TrapClear: {
        url: 'trap/trapClear'
    },
    TrapRemark: {
        url: 'trap/setRemark'
    },
    //告警服务器配置
    GetAllTrapServer: {
        url: 'trapServer/queryTrapServer'
    },
    AddTrapServer: {
        url: 'trapServer/addTrapServer'
    },
    DeleteTrapServer: {
        url: 'trapServer/delTrapServer'
    },
    //日志服务器管理
    GetLogHostConfig: {
        url: 'logging/getLogging'
    },
    AddLogHostConfig: {
        url: 'logging/insertLogging'
    },
    DeleteLogHostConfig: {
        url: 'logging/deleteLogging'
    },
    //资源管理--配置
    GetAllResourceConfig: { //获取所有资源池配置
        url: 'resource/queryPoolConfigInfo'
    },
    SetResourceConfig: {
        url: 'resource/createPoolConfigInfo'
    }, 
    InitResourceConfig: {
        url: 'resource/initDevPool'
    },
    GetSSHResourceConfig: { // 获取ssh的信息
        url: 'ssh/getSshList'
    },
    SetSSHResourceConfig: { // 设置ssh的信息
        url: 'ssh/updateSsh'
    },
    GetAvalibleGateWayType: { // 获取所有可配置的gateWay类型
        url: 'gatewayType/getGatewayTypes'
    },
    GetCurrentGateWayType: { // 获取当前的gateWay类型
        url: 'gatewayType/getGatewayType'
    },
    SetCurrentGateWayType: { // 设置当前的gateWay类型
        url: 'gatewayType/updateGatewayType'
    },
    //接入网配置
    QueryExternalNetwork: {
        url: 'externalNetwork/queryExternalNetwork',
        method: 'get'
    },
    InsertExternalNetwork: {
        url: 'externalNetwork/insertExternalNetwork'
    },
    UpdateExternalNetwork: {
        url: 'externalNetwork/updateExternalNetwork'
    },
    DeleteExternalNetwork: {
        url: 'externalNetwork/deleteExternalNetwork'
    },
    checkExNetworkBeDelete: {
        url: 'externalNetwork/checkExternalNetworkCanBeDelete'
    },
    //查询所有borderLeaf设备
    GetAllBorderLeafDevice: {
        url: 'device/getAllBorderLeafDevice',
        method: 'get'
    },
    //查询设备下的端口
    ReadOneDevPorts: {
        url: 'port/readOneDevPorts'
    },
    //桥接网网配置
    QueryVlanBridgeNetwork: {
        url: 'externalNetwork/queryVlanBridgeNetwork',
        method: 'get'
    },
    InsertVlanBridgeNetwork: {
        url: 'externalNetwork/insertVlanBridgeNetwork'
    },
    UpdateVlanBridgeNetwork: {
        url: 'externalNetwork/updateVlanBridgeNetwork'
    },
    DeleteVlanBridgeNetwork: {
        url: 'externalNetwork/deleteVlanBridgeNetwork'
    },
}