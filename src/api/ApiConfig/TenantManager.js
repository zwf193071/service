/**
 * @description 租户网络接口
 */
export default {
    /* 虚拟网络拓扑 */
    GetTenantTopo: {
        url: 'tenant/getTenantTopological'
    },
    GetTenantTopoInfo: {
        url: 'tenant/getTenantInfo'
    },
    /* 租户 */
    GetTenants: {
        url: 'tenant/getTenants'
    },
    AddTenants: {
        url: 'tenant/insertTenant'
    },
    DeleteTenants: {
        url: 'tenant/deleteTenant'
    },
    /* 租户实例端口映射关系 */
    GetTenantInstancesMap: {
        url: 'tenant/getTenantInstances'
    },
    /* 同步oepnStack租户信息到控制器 */
    SyncTenantsFromOpenStack: {
        url: 'tenant/syncOpenstackTenants' 
    },
    /* 网络 */
    GetNetwork: {
        url: 'tenant/getNetworks'
    },
    AddNetwork: {
        url: 'tenant/insertNetwork'
    },
    DeleteNetwork: {
        url: 'tenant/deleteNetwork'
    },
    /* 路由器 */
    GetRouter: {
        url: 'tenant/getRouters'
    },
    AddRouter: {
        url: 'tenant/insertRouter'
    },
    DeleteRouter: {
        url: 'tenant/deleteRouter'
    },
    /* 子网 */
    GetAllSubnetOnTenant: { // 获取一个租户上的所有子网
        url: 'tenant/getSubnetBytTenant'
    },
    GetSubnet: {
        url: 'tenant/getSubnets'
    },
    AddSubnet: {
        url: 'tenant/insertSubnet'
    },
    DeleteSubnet: {
        url: 'tenant/deleteSubnet'
    },
    /* 端口 */
    GetNetport: {
        url: 'tenant/getPorts'
    },
    AddNetport: {
        url: 'tenant/insertPort'
    },
    DeleteNetport: {
        url: 'tenant/deletePort'
    },
    /* 路由器绑定/解绑子网 */
    GetRouterBindSubnet: {
        url: 'tenant/getRouterInterfaces'
    },
    SetRouterBindSubnet: {
        url: 'tenant/routerBindSubnet'
    },
    SetRouterUnbindSubnet: {
        url: 'tenant/routerUnBindSubnet'
    },

    /**
     * 虚拟机管理
     */
    GetAllVDS: {
        method: 'GET',
        url: 'api/vmware/v1/DVS/getAllDVS'
    },
    AddVDS: {
        method: 'POST',
        url: 'api/vmware/v1/DVS/createDVS'
    },
    DeleteVDS: {
        method: 'DELETE',
        url: 'api/vmware/v1/DVS/deleteDVSByUuid/:dvsUuid',
        dynamicRouter: true
    },
    EditVDS: {
        method: 'POST',
        url: 'api/vmware/v1/DVS/reconfigDVS'
    },

    /**
     * 端口组
     */
    GetPortGroup: {
        method: 'GET',
        url: 'api/vmware/v1/PortGroup/getAllPortGroup/:dvsUuid',
        dynamicRouter: true
    },
    AddPortGroup: {
        method: 'POST',
        url: 'api/vmware/v1/PortGroup/createPortGroup'
    },
    DeletePortGroup: {
        method: 'POST',
        url: 'api/vmware/v1/PortGroup/deletePortGroup'
    },

    // 获取所有网络
    GetAllNetwork: {
        method: 'GET',
        url: 'api/vmware/v1/PortGroup/getAllNetworkSummry'
    },

    // 获取所有主机和网卡
    GetHostEnablePhyNic: {
        method: 'GET',
        url: 'api/vmware/v1/Host/getHostEnablePhyNic'
    }
}