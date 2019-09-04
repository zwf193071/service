export default {
    //重置设备信息
    resetDeviceInfo(state,payload) {
        state.deviceInfo = [...payload]
    }
}