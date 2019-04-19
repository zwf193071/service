/**
 * @author AlanChen
 * @module 接口配置文件
 * @constant {Object} globalConfig 接口的全局配置
 * @constant {Object} apiConfig 具体接口的详细配置
 */

const serverOrigin = window.location.origin

// const baseURL = 'http://10.69.65.85:8080/ice' // 朱鹏接口2
// const baseURL = 'http://192.168.132.1:8888/ice' // 黄冈
const baseURL = serverOrigin + '/ice' //打包后请求接口前缀,自动获取location作为请求地址
 
//接口的全局配置
const globalConfig = {
    baseURL,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true, //浏览器请求带上cookie，用于后台session验证
    timeout: 30000
}

// 自动导入ApiConfig中接口模块(通过webpack的require.context)
const ctx = require.context('./ApiConfig', true, /[A-Z][a-z]+\.js$/)

const configModule = ctx.keys().map(path => {
    const fixedPath = path.slice(2)
    const name = './ApiConfig/' + fixedPath
    const resource = require('./ApiConfig/' + fixedPath).default
    const apiList = Object.keys(resource)
    return {name, resource, apiList}
})

// 因为目前接口别名是全局，所以为了避免接口别名重复，提供一个错误定位功能
const configList = configModule.reduce((total, item) => {
    return [...total, ...item.apiList]
}, [])

let isRepeat=false, repeatModuleName=[], repeatName=''
isRepeat = configList.some((item, i) => {
    const filter = configList.filter((a, j) => j!=i)
    if(filter.includes(item)) {
        repeatName = item
        configModule.forEach(api => {
            if(Object.keys(api.resource).includes(item)) {
                repeatModuleName.push(api.name)
            }
        })
    }
    return filter.includes(item)
})

//具体接口的详细配置
const apiConfig = configModule.reduce((total, item) => {
    if(isRepeat) {
        const errMessage = `
  接口名重复, 重复接口为: ${repeatName}
  重复位置在:  
    ${repeatModuleName.join(', ')}`
        throw new Error(errMessage)
    }
    else {
        return {...total, ...item.resource}
    }
}, {})

export {
    globalConfig,
    apiConfig
}