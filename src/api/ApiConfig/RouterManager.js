/**
 * @description 路由管理接口
 */
export default {
    //查询所有网络
    GetNetWorkList: {
        url: 'tenant/getIceNetWorkList'
    },
    //查询所有的路由
    QueryAllIceRouter: {
        url: 'route/queryAllIceRouter',
        method: 'get'
    },
    //动态路由
    QueryBgpVrfNeighbor: {
        url: 'route/queryBgpVrfNeighbor',
        method: 'get'
    },
    InsertBgpVrfNeighbor: {
        url: 'route/insertBgpVrfNeighbor',
    },
    DeleteBgpVrfNeighbor: {
        url: 'route/deleteBgpVrfNeighbor',
    },
    //静态路由
    QueryStaticRoute: {
        url: 'route/queryStaticRoute',
        method: 'get'
    },
    InsertStaticRoute: {
        url: 'route/insertStaticRoute',
    },
    DeleteStaticRoute: {
        url: 'route/deleteStaticRoute',
    },
    //策略路由
    QueryAllRouterBindRouteMap: {
        url: 'pbr/queryAllRouterBindRouteMap',
        method: 'get'
    },
    InsertRouterBindRouteMap: {
        url: 'pbr/insertRouterBindRouteMap',
    },
    DeleteRouterBindRouteMap: {
        url: 'pbr/deleteRouterBindRouteMap',
    },
    //策略路由规则
    QueryRouteMapByDeviceIp: {
        url: 'pbr/queryRouteMapByDeviceIp',
    },
    InsertRouteMap: {
        url: 'pbr/insertRouteMap',
    },
    DeleteRouteMap: {
        url: 'pbr/deleteRouteMap',
    },
    //查询指定设备的所有ACL规则接口
    QueryAclByDeviceIp: {
        url: 'acl/queryAclByDeviceIp',
    },
    //路由接口
    QueryAllRouteInterface: {
        url: 'route/queryAllRouteInterface',
        method: 'get'
    },
    InsertRouteInterface: {
        url: 'route/insertRouteInterface',
    },
    DeleteRouteInterface: {
        url: 'route/deleteRouteInterface',
    }
}