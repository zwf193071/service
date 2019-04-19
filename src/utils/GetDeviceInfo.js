/**
 * @author AlanChen
 * @module GetDeviceInfo 用来获取设备信息的函数
 * @param {Array} item devices或hosts数据，目前从store里直接取。也可以请求接口获取
 * @returns {Object} 包括siteIp,siteType和siteName和siteId键值
 */

const map = { //映射关系，左侧为需要导出的key，右侧为对应源数据中的key
    siteIp: 'devIpAdd',
    siteName: 'devName',
    siteType: 'devType',
    siteId: 'devId'
}
const insertInfo = (item) => {
    let info = {}
    const keys = Object.keys(map)
    const values = Object.values(map)
    keys.forEach(a => info[a] = [])
    
    item.forEach(a => {
        keys.forEach((b,c) => {
            info[b].push(a[values[c]])
        })
    })
    return info
}
export default insertInfo