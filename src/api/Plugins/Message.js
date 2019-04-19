import vm from '@/main' //vue实例，可以调用所有vue实例和原型上的方法和属性

//显示message全局提示的模块
export default {
    name: 'Message',
    success(str) {
        if(Boolean(str)) {
            vm.$Message.success({
                content: `${str}成功！`
            })
        }
    },
    fail(str,boolean) {
        const fail = boolean?`${str}失败！`:str
        if(Boolean(fail)) [
            vm.$Message.error({
                content: fail
            })
        ]
    },
    networkFail() {
        vm.$Message.error({
            content: '数据加载失败！'
        })
    }
}