<!--
 * @Author: 徐玲
 * @Description: file content
 * @LastEditors: 徐玲
 * @UpdateLogs: 功能：1.底层网络资源池 添加 组播组地址段
 * @Date: 2019-02-25 09:45:27
 * @LastEditTime: 2019-03-18 17:22:04
 -->
<template>
    <div class="Config">
        <Card :bordered="false">
            <h2 slot="title">资源池</h2>
            <div class="sourceCard">
                <FormCard
                    class="cardItem"
                    v-for="underlay of underlaySource"
                    :key="underlay.title"
                    :source="underlay"
                    :showIcon="isAdminRole"
                    @saveConfig="saveConfig1" />
                <ListCard 
                    class="cardItem"
                    :source="overlaySource[0]"
                    :showIcon="isAdminRole"
                    @saveConfig="saveConfig2"
                    />
                <FormCard 
                    class="cardItem"
                    :source="SSHSource"
                    :showIcon="isAdminRole"
                    @saveConfig="setSSHConfig" />
                <FormCard 
                    class="cardItem"
                    :source="gateWay"
                    :showIcon="isAdminRole"
                    @saveConfig="setGateWayConfig" />
            </div>
        </Card> 
    </div>
</template>

<script>
import { api, apiCover } from '@/api/index'
import Storage from '@/utils/Storage'

import ListCard from './ListCard'
import FormCard from './FormCard'

export default {
    name: 'Config',
    components: {
        ListCard,
        FormCard
    },
    data() {
        return {
            isAdminRole: '',
            underlaySource: [
                {
                    title: '底层网络资源池',
                    // helpInfo: '底层网络资源池参数',
                    flex: 3,
                    input: [
                        {
                            label: 'overlay协议类型',
                            name: 'overlayBgpType',
                            value: '',
                            placeholder: '例：bgp'
                        },
                        {
                            label: 'underlay协议类型',
                            name: 'underlayBgpType',
                            value: '',
                            placeholder: '例：ebgp'
                        },
                        {
                            label: '分布式网关MAC地址',
                            name: 'anycastGatewayMac',
                            value: '',
                            placeholder: '例:0001.0001.0001.0001'
                        },
                        {
                            label: '核心节点bgp环回地址段',
                            name: 'bgpSpineOverlayLoopbackCidr',
                            value: '',
                            placeholder: '例:2.2.2.0/24'
                        },
                        {
                            label: '分支节点bgp环回地址段',
                            name: 'bgpLeafOverlayLoopbackCidr',
                            value: '',
                            placeholder: '例:1.1.1.0/24'
                        },
                        {
                            label: 'VTEP环回地址段 ',
                            name: 'bgpLeafNveLoopbackCidr',
                            value: '',
                            placeholder: '例:1.1.10.0/24'
                        },
                        {
                            label: '承载网络地址段',
                            name: 'bgpUnderlayCidr',
                            value: '',
                            placeholder: '例:192.168.0.0/24'
                        },
                        {
                            label: '核心节点overlay AS号',
                            name: 'spineOverlayAs',
                            value: '',
                            placeholder: '例:901'
                        },
                        {
                            label: '核心节点underlay AS号',
                            name: 'spineUnderlayAs',
                            value: '',
                            placeholder: '例:901'
                        },
                        {
                            label: '分支节点overlay AS号',
                            name: 'leafOverlayAs',
                            value: '',
                            placeholder: '例:65101'
                        },
                        {
                            label: '分支节点underlay AS号',
                            name: 'leafUnderlayAs',
                            value: '',
                            placeholder: '例:65101'
                        },
                        {
                            label: '组播组地址段',
                            name: 'mutilcastGroupCidr',
                            value: '',
                            placeholder: '例:225.0.0.0/8'
                        }
                    ]
                },
                {
                    title: '交换机管理地址段',
                    // helpInfo: '底层网络交换机管理地址段参数',
                    input: [
                        {
                            label: '核心(spine)交换机起始地址',
                            name: 'spineIpStart',
                            value: '',
                            placeholder: '例:10.17.12.133'
                        },
                        {
                            label: '核心(spine)交换机结束地址',
                            name: 'spineIpEnd',
                            value: '',
                            placeholder: '例:10.17.12.134'
                        },
                        {
                            label: '分支(leaf)交换机起始地址',
                            name: 'leafIpStart',
                            value: '',
                            placeholder: '例:10.17.12.135'
                        },
                        {
                            label: '分支(leaf)交换机结束地址',
                            name: 'leafIpEnd',
                            value: '',
                            placeholder: '例:10.17.12.136'
                        },
                        {
                            label: '核心(spine)网关',
                            name: 'spineGatewayCidr',
                            value: '',
                            placeholder: '例:192.168.0.254/24'
                        },
                        {
                            label: '分支(leaf)网关',
                            name: 'leafGatewayCidr',
                            value: '',
                            placeholder: '例:192.168.0.254/24'
                        }
                    ],
                    checkbox: [
                        {
                            label: '核心节点使用不同的AS号',
                            name: 'spineUseDiffAs',
                            value: ''
                        },
                        {
                            label: '分支节点使用不同的AS号',
                            name: 'leafUseDiffAs',
                            value: ''
                        }
                    ]
                },
                {
                    title: '虚拟端口汇聚(vPC)配置',
                    // helpInfo: '虚拟端口汇聚(vPC)配置参数',
                    input: [
                        {
                            label: 'vpc域ID',
                            name: 'vpcDomain',
                            value: '',
                            placeholder: '例：1-1000'
                        },
                        {
                            label: '环回地址段',
                            name: 'loopbackGatewayCidr',
                            value: ''
                        },
                        {
                            label: '心跳地址段',
                            name: 'keepAliveGatewayCidr',
                            value: ''
                        }
                    ]
                }
            ],
            overlaySource: [
                {
                    title: '租户网络资源池',
                    // helpInfo: '租户网络资源池参数',
                    data: [
                        {label: 'VXLAN-L3-POOL', start: '', end: ''},
                        {label: 'VXLAN-L2-POOL', start: '', end: ''},
                        {label: 'VLAN-L3-POOL', start: '', end: ''},
                        {label: 'VLAN-L2-POOL', start: '', end: ''}
                    ] 
                }
            ],
            SSHSource: {
                title: 'SSH信息配置',
                // helpInfo: 'SSH信息配置参数',
                input: [
                    {
                        label: 'SSH名称',
                        name: 'sshName',
                        value: '',
                        id: 0
                    },
                    {
                        label: 'SSH密码',
                        name: 'sshPassword',
                        value: '',
                        id: 0
                    },
                    {
                        label: 'SNMP团体名',
                        name: 'snmpName',
                        value: '',
                        id: 0
                    }
                ]
            },
            gateWay: {
                title: '网关类型配置',
                select: [
                    {
                        title: '当前网关类型',
                        item: [],
                        result: ''
                    }
                ]
            }
        }
    },
    //组件加载刷新
    created() {
        this.isAdminRole = Boolean(Storage.get('isAdminRole'))
        this.getResourceConfig()
        this.getSSHConfig()
        this.getGateWayConfig()
    },
    methods: {
        //获取所有配置
        getResourceConfig() {
            apiCover({
                url: 'GetAllResourceConfig',
                tips: ['', '资源池配置信息获取失败']
            })
            .then(res => {
                if(res.type == 'success') {
                    const data = res.data
                    console.log(data)
                    if(data) {
                        this.underlaySource.forEach(item => {
                            item.input.forEach((a,b) => {
                                a.value = data[a.name]
                            })
                            item.checkbox && item.checkbox.forEach((a,b) => {
                                a.value = data[a.name]
                            })
                        })
                        this.overlaySource[0].data.forEach(item => {
                            const lanData = data['overlayPoolInfo'].filter(a => a['pool-type'] == item.label)[0]
                            item.start = lanData['id-start']
                            item.end = lanData['id-end']
                        })
                    }
                }
            })
        },
        //下发设置的接口函数
        setResourceConfig(data) { 
            return apiCover({
                url: 'SetResourceConfig',
                data,
                tips: '设置资源池配置信息'
            })
        },
        //保存下发underlay配置
        saveConfig1(val) { 
            let data = {}
            val.input.forEach( a => {
                if(a.value) {
                    data[a.name] = a.value
                }
            })
            val.checkbox.forEach( a => {
                if(a.value) {
                    data[a.name] = a.value.toString()
                }
            })
            console.log(data)
            // 仅当有参数时才请求接口
            if(Object.keys(data).length>0) {
                this.setResourceConfig(data)
            }
        },
        //保存下发overlay配置
        saveConfig2(val) { 
            const value = val.map(a => { 
                return {
                    poolType: a.label,
                    idStart: a.start,
                    idEnd: a.end
                }
            })
            const data = {
                overlayPool: value
            }
            console.log(data)
            const notNull = val.every(a => a.start!='' && a.end!='') //判断是否参数为空
            //下发成功，then调用初始化资源池配置接口
            if(notNull) { //只当参数完整时才请求接口
                this.setResourceConfig(data)
                    .then(res => {
                        if(res.type == 'success') {
                            const devIpList = [...this.$store.state.deviceInfo].map(a => a.devIpAdd)
                            console.log(devIpList)
                            apiCover({
                                url: 'InitResourceConfig',
                                data: {devIpList}
                            })
                        }
                    })
            } 
            else {
                this.$Message.info({
                    title: '保存提示',
                    content:'请输入完整的IP起始和结束区段！',
                    duration: 3
                })
            }
        },
        // 获取SSH的预设值
        getSSHConfig() {
            apiCover({
                url: 'GetSSHResourceConfig'
            })
            .then(res => {
                if(res.type == 'success') {
                    const data = res.data[0]
                    this.SSHSource.input.forEach(item => {
                        item.value = data[item.name]
                        item.id = data.id
                    })
                }
            })
        },
        // 下发SSH的参数
        setSSHConfig(val) {
            const params = val.input
            const id = params[0].id
            const sshName = params[0].value
            const sshPassword = params[1].value
            const snmpName = params[2].value

            apiCover({
                url: 'SetSSHResourceConfig',
                data: { id, sshName, sshPassword, snmpName },
                tips: '设置SSH配置信息'
            })
            .then(res => {
                if(res.type == 'success') {
                    this.getSSHConfig()
                }
            })
        },
        // 获取当前gateWay的类型
        async getGateWayConfig() {
            const { type, data } = await apiCover({
                url: 'GetAvalibleGateWayType'
            })
            if(type == 'success') {
                this.gateWay.select[0].item = data.map(a => {
                    return {
                        label: a,
                        value: a
                    }
                })
            }

            const { type: type2, data: data2 } = await apiCover({
                url: 'GetCurrentGateWayType'
            })
            if(type2 == 'success') {
                this.gateWay.select[0].result = data2['gateway-type']
            }
        },
        // 下发gateWay的类型
        setGateWayConfig({ select }) {
            const data = {
                type: select[0]
            }

            apiCover({
                url: 'SetCurrentGateWayType',
                data,
                tips: '设置当前网关类型配置'
            })
            .then(res => {
                if(res.type == 'success') {
                    this.getGateWayConfig()
                }
            })
        }
    }
}    
</script>

<style lang="css" scoped>
.Config {
    overflow: auto;
}
.sourceCard {
    column-count: 2; 
    column-gap: 0;
}
.cardItem {
    break-inside: avoid; 
    box-sizing: border-box; 
    padding: 6px;
}
</style>