/**
 * @description 网络拓扑接口
 */
export default {
    //dashboard获取展示数据
    GetDashboard: {
        url: 'dashboard/getDashBoard'
    },
    //拓扑图功能接口
    GetTopoLinkInfo: { //获取拓扑图的所有展示信息
        url: 'topo/getTopoInfo'
    },
    SetTopoPosition: {
        url: 'topo/saveTopoLocation'
    },
    GetTopoPosition: {
        url: 'topo/getPosition'
    },
    InsertDevice: { //添加单个设备
        url: 'device/insertDevice'
    },
    FindDevice: { //设备发现
        url: 'device/deviceDiscover',
        timeout: 100000
    },
    /*********区域管理 start**********/
    GetAllPodElement: {
        url: 'pod/getAllPodElement'
    },
    AddPod: {
        url: 'pod/registerPod'
    },
    DeletePod: {
        url: 'pod/deletePod'
    },
    GetPodElement: {
        url: 'pod/getPodElement'
    },
    DeletePodElement: {
        url: 'pod/delDeviceToPod'
    },
    /*********区域管理 end**********/
}