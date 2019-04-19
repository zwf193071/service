export default {
    //重置设备信息
    resetDeviceInfo(state,payload) {
        state.deviceInfo = [...payload]
    },
    //重置主机信息
    resetHostInfo(state,payload) {
        state.hostInfo = [...payload]
    },
    //重置拓扑图布局位置
    resetTopoLayout(state,payload) {
        const len = payload.length
        if(len>0) { //当payload有数据才触发位置信息变化
            state.topoLayoutPosition = [...payload]
        }
    },
    //重置租户网络重要信息
    resetOverlayInfo(state, payload) {
        state.overlayInfo = [...payload]
    },
}