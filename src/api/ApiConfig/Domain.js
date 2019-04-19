/**
 * @description VMware接口
 */
export default {
    //计算域
    InsertDomain: {
        url: 'api/vmware/v1/domain/insertDomain'
    },
    UpdateDomainInfo: {
        url: 'api/vmware/v1/domain/updateDomainInfo'
    },
    DeleteDomainInfo: {
        url: 'api/vmware/v1/domain/deleteDomainInfo/:domainUuid',
        method: 'delete',
        dynamicRouter: true,
    },
    QueryAllDomainInfo: {
        url: 'api/vmware/v1/domain/queryAllDomainInfo',
        method: 'get',
    },
    //连接vCenter
    ConnectDomain: {
        url: 'api/vmware/v1/Connect/connect',
    },
    //断开vCenter
    OffConnectDomain: {
        url: 'api/vmware/v1/Connect/disconnect/:domainUuid',
        method: 'delete',
        dynamicRouter: true,
    },
    //查询所有主机
    // GetAllHostFromDB: {
    //     url: 'api/vmware/v1/Host/getAllHostFromDB',
    //     method: 'get',
    // },
    // //查询所有虚拟机
    // GetAllVMFromDB: {
    //     url: 'api/vmware/v1/VM/getAllVMFromDB',
    //     method: 'get',
    // },
    //根据vCenter查询下面所有的主机信息
    GetHostInfoByVCenterUUid: {
        url: 'api/vmware/v1/Host/getHostInfoByVCenterUUid/:domainUuid',
        dynamicRouter: true,
        method: 'get',
    },
    //根据主机查询下面所有的虚机
    GetVMInfoByHostUUid: {
        url: 'api/vmware/v1/VM/getVMInfoByHostUUid/:hostUuid',
        dynamicRouter: true,
        method: 'get',
    },
    //查询所有的VDS
    GetDomainDvs: {
        url: 'api/vmware/v1/DVS/getAllDVS',
        method: 'get',
    },
    //关联VDS
    ConnetDomainVds: {
        url: 'api/vmware/v1/DVS/bindDomain',
    },
}
