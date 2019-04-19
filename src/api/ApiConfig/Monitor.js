/**
 * @description 运维监控接口
 */
export default {
    //交换机监控
    GetDeviceMonitorInfo: {
        url: 'monitor/scanDevice'
    },
    //服务器监控
    GetHostMonitorInfo: {
        url: 'monitor/scanHost'
    },
    //集群节点监控
    GetODLMonitorInfo: {
        url: 'cluster/getOdlCluster'
    },
   //端口监控 
    GetPort: {
        url: 'port/readOneDevPorts'
    },
    // 获取除loopback以外的所有端口报文,目前用于链路源端网元的端口获取
    GetPortExceptLoopback: {
        url: 'port/readOneDevPortsExcludeLoopback'
    },
    ScanPortRefresh: {
        url: 'port/scanOneDevPorts',
        timeout: 60000
    },
    //OVS全局配置
    AddOVSConfig: {
        url: 'ovsConfig/addOvsConfig'
    },
    UpdateOVSConfig: {
        url: 'ovsConfig/updateOvsConfig'
    },
    DeleteOVSConfig: {
        url: 'ovsConfig/deleteOvsConfig'
    },
    GetOVSConfig: {
        url: 'ovsConfig/getOvsConfigs'
    },
    AddOVSConfigInfo: {
        url: 'ovsConfig/addOvsConfigInfo'
    },
    DeleteOVSConfigInfo: {
        url: 'ovsConfig/deleteOvsConfigInfo'
    },
    UpdateOVSConfigInfo: {
        url: 'ovsConfig/updateOvsConfigInfo'
    },
    // 操作日志
    GetOperateLogs: {
        url: 'userOperateLog/getList'
    },
}