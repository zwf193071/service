<!--
 * @Author: 陈晨
 * @Description: 拓扑图组件
 * @Date: 2018-12-04 09:06:06
 * @LastEditTime: 2019-03-20 15:26:46
 * @LastEditors: 徐玲
 * @UpdateLogs: 1. 解决浏览器窗口大小变化，canvas宽高不自适应的bug。 2. 修改api函数的参数调用方式
 -->
<template>
    <div class="TopoLinks">
        <div class="Topo">
            <canvas class="canvas"></canvas>
            <Button 
                class="fixed_btn" 
                style="position: absolute; left: 1%; top: 2%"
                type="success" 
                icon="md-refresh"
                :loading="isLoading"
                @click="() => {refreshData(true)}">刷新</Button>
            <FullScreen 
                style="position: absolute; right: 2%; top: 2%"
                dom=".TopoLinks"
                @inFullScreen="initCanvasContainer(true)"
                @outFullScreen="initCanvasContainer(false)"
            />
            <!--loading-->
            <Spin size="large" fix v-if="isLoading"></Spin>
        </div>
        <!--topo图tips-->
        <div class="tips" :style="tipsStyle">{{tips}}</div>
         <!--topo图右键菜单-->
        <ul class="contextMeunu" :style="contextMeunuPosition">
            <li 
                class="contextMeunu_item"
                v-for="(item,i) of contextMeunu"
                :key="i"
                v-show="item.enabled"
                @click="contextMeunuHandler(item.id)"
                >{{item.label}}</li>
        </ul>
        <!--添加设备-->
        <Modal v-model="isAddModal" ok-text="添加" @on-ok="addDevice" width="400" >
            <p slot="header" style="font-size:16px">
                <span>{{addItem.title}}</span>
            </p>
            <Form label-position="left"  :label-width="100">
                <FormItem :label="addItem.radio.title">
                    <RadioGroup v-model="addItem.radio.value" type="button">
                        <Radio 
                            v-for="item of addItem.radio.label"
                            :key="item"
                            :label="item" />
                    </RadioGroup>
                </FormItem>
                <FormItem 
                    v-for="input of showAddItem.input"
                    :key="input.label"
                    :label="input.label">
                    <Input v-model="input.value" :type="input.type || 'text'" />
                </FormItem>
                <FormItem 
                    v-for="(select,i) of showAddItem.select"
                    :key="i"
                    :label="select.label">
                    <Select v-model="select.result" :disabled="select.disabled || false">
                        <Option 
                            v-for="item of select.value"
                            :key="item"
                            :value="item"
                            >{{item}}</Option>
                    </Select> 
                </FormItem> 
            </Form>
        </Modal>
        <!--设备发现-->
        <CModal 
            v-model="isFindModal"
            :data="findItem"
            ok-text="添加"
            :width="400"
            :label-width="100"
            @submit="findDevice"
        />
        <!--设备发现结果展示-->
        <Modal 
            v-model="isFindeResultModal" 
            :closable="false"
            :mask-closable="false"
            width="400" >
            <p slot="header" style="font-size:16px">
                <span>发现设备提示</span>
            </p>
            <img 
                class="loading_png"
                :class="findModalStyle.className"
                :src="findModalStyle.IMG"
            />
            <div slot="footer">
                <Button 
                    type="error" 
                    size="large" 
                    @click="isFindeResultModal=false">关闭</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { api, apiCover } from '@/api/index'
import Storage from '@/utils/Storage'
import Network from 'ctopo'
import RegExpRule from '@/utils/RegExpRule'

import CModal from '@/components/CModal'
import FullScreen from '@/components/FullScreen'

import DevicePicMap from './DevicePicMap.config'

import loading from '@/assets/image/physicTopo/loading.png'
import success from '@/assets/image/physicTopo/success.png'
import fail from '@/assets/image/physicTopo/fail.png'

export default {
    name: 'TopoLinks',
    components: {
        CModal,
        FullScreen
    },
    data() {
        return {
            isAddModal: false,
            isFindModal:false,
            isFindeResultModal: false,
            isLoading: false,
            SSHInfo: null, // 预设的ssh信息
            addItem: {
                title: '添加设备',
                inputItem: {
                    device: [
                        {label: '设备名称', value: ''},
                        {label: '设备IP', value: ''},
                        {label: 'SSH用户名', value: ''},
                        {label: 'SSH密码', value: '',type:'password'}
                    ],
                    host: [
                        {label: '主机名称', value: ''},
                        {label: '主机IP', value: ''},
                        {label: 'SSH用户名', value: ''},
                        {label: 'SSH密码', value: '',type:'password'}
                    ]
                },
                selectItem: {
                    device: [
                        {
                            label: '设备类型', 
                            value: [
                                'CN12710','CN12706',
                                'CN8696Q','CN8672UP-16G','CN8648Q',
                                'CN6048TP-1GE','CN6132Q-V','CN61108TC-V','CN61108PC-V',
                                'CN3348UPQ',
                                'S6850-48XS','S6850-24XS',
                                'S6650-24TD','S6650-48TD','S6650-48TQ',
                                'S5960-24TS','S5960-48TD','S5960-48TS',
                                'C3650-24TD','C3650-48TD','C3650-48TQ','C3850-24XS','C3850-48XS','C5672UP','N9K-C9272Q','other'
                            ],
                            result:'CN8648Q'
                        },
                        {
                            label: '设备角色',
                            value: ['Spine', 'ServerLeaf', 'BorderLeaf'],
                            result:'Spine'
                        } 
                    ],
                    host: [
                        {
                            label: '主机类型', 
                            value: ['物理主机','裸金主机'],
                            result:'物理主机'
                        },
                        {
                            label: 'vtep类型', 
                            value: ['软件','硬件'],
                            result:'软件',
                            disabled: false
                        }
                    ],
                    common: [
                        {
                            label: '在线状态', 
                            value: ['在线','离线'],
                            result:'在线'
                        }
                    ]
                },
                radio:{
                    title: '切换',
                    label: ['设备','主机'], 
                    value: '设备'
                }
            },
            findItem: { 
                title: '设备发现',
                input: [
                    {label: '起始IP', value: '', clearable: true},
                    {label: '结束IP', value: '', clearable: true},
                    {label: 'SSH用户名', value: '', clearable: true},
                    {label: 'SSH密码', value: '',type:'password', clearable: true}

                ],
                resultStatus: false
            },
            findResultClass: {
                loading: [loading,'rotate'],
                success: [success],
                fail: [fail]
            },
            canContextMeunuEdit: true, // 是否可以打开右键菜单，区分全屏状态不显示
            contextMeunu: [ // 右键菜单项，包括名称、id、类型和显示状态
                {id:'delDevice',enabled: false, label: '删除设备',type:'node'},
                {id:'delLink',enabled: false, label: '删除链路',type:'link'},
                {id:'findDevice',enabled: false, label: '发现设备',type:'global'},
                {id:'addDevice',enabled: false, label: '添加设备',type:'global'}
            ],
            target: '', // 右键菜单点击之后获取到的数据
            contextMeunuPosition: {
                left: 0,
                top: 0
            },
            tips: '',
            tipsStyle: {
                display: 'none',
                left: 0,
                top: 0
            },
            network: null, // topo图实例
            isNodePositionChanged: false, // 判断拓扑图节点位置是否改变
            nodePosition: [], // 拓扑图位置信息
            windowResizeHandler: null, // 浏览器窗口大小改变的事件函数
        }
    },
    computed: {
        findModalStyle() { // 设备发现展示结果的样式
            const type = this.findItem.resultStatus
            const style = type && this.findResultClass[type]
            const className = style[1] || ''
            return {className, IMG:style[0]}
        },
        showAddItem() { // 通过radio开关来选择显示设备还是主机添加modal
            let item = {input:null,select:null}
            if(this.addItem.radio.value == '设备') {
                item.input = this.addItem.inputItem.device
                item.select = [...this.addItem.selectItem.device,...this.addItem.selectItem.common]
            }
            else if(this.addItem.radio.value == '主机') {
                item.input = this.addItem.inputItem.host
                item.select = [...this.addItem.selectItem.host,...this.addItem.selectItem.common]
            }
            return item
        }
    },
    watch: {
        //监测主机类型，当为裸金时，禁止用户选择vtep，默认为硬件
        'addItem.selectItem.host.0.result'(val) {
            if(val == '裸金主机') {
                this.addItem.selectItem.host[1].result = '硬件'
                this.addItem.selectItem.host[1].disabled = true
            }
            else {
                this.addItem.selectItem.host[1].disabled = false
            }
        },
        // 切换add的modal中radio时，填充ssh信息
        'addItem.radio.value'() {
            this.QuerySSHInfo()
        }
    },
    beforeRouteLeave(to, from, next){
        //每次离开路有前将当前layout布局位置保存到store和后台
        const userName = Storage.get('userName')
        if(Boolean(this.isNodePositionChanged)) { //当位置信息发生改变才保存
            this.$store.commit('resetTopoLayout',this.nodePosition)
            const position = this.$store.state.topoLayoutPosition
            api({
                url: 'SetTopoPosition',
                data: {userName, positionInfo:JSON.stringify(position)}
            })
        }
        next() 
    },
    created() {
        this.QueryDeviceRole()
        this.QuerySSHInfo()
    },
    mounted() {
        this.initCanvasContainer()
        // Network实例只需要初始化一次
        this.network = new Network('.canvas')
        // topo图舞台居中并保持0.6缩放(改变canvas内元素scale属性)
        this.network.stage.zoomIn(.6) 
        this.refreshData()
        // 监听浏览器窗口大小变化事件，动态改变canvas容器宽高，但不重绘
        this.windowResizeHandler = () => {
            console.log('窗口大小发生改变了')
            this.initCanvasContainer()
        }
        window.addEventListener('resize', this.windowResizeHandler)
 
    },
    // 必须要去除window的resize事件监听，因为绑定是全局的
    destroyed() {
        window.removeEventListener('resize', this.windowResizeHandler)
    },
    methods: {
        //查询设备角色，填充modal框内角色
        QueryDeviceRole() {
            apiCover({
                url: 'QueryDeviceRole'
            })
            .then(res => {
                let roleList
                if(res.type == 'success') {
                    roleList = res.data.map(a => a.deviceRole)
                }
                else {
                    roleList = []
                }
                this.addItem.selectItem.device[1].value = roleList
                this.addItem.selectItem.device[1].result = roleList[0]
            })
            .catch(err => {
                this.addItem.selectItem.device[1].value = []
                this.addItem.selectItem.device[1].result = ''
            })
        },
        //获取拓扑图位置信息，重新绘制画布
        refreshData(flag) {
            this.isNodePositionChanged = false
            this.isLoading = true
            //位置信息先从store取数据，没数据再从后台取
            if(this.$store.state.topoLayoutPosition.length == 0) {
                const userName = Storage.get('userName')

                apiCover({
                    url: 'GetTopoPosition',
                    data: { userName },
                    tips: ['', '拓扑图加载失败！']
                })
                .then(res => {
                    if(res.type == 'success') {
                        this.nodePosition = res.data
                    }
                    else {
                        this.nodePosition = []
                    }
                    this.getTopoInfo(flag)
                })
                .catch(err => {
                    this.isLoading = false
                })
            }
            else {
                this.nodePosition = this.$store.state.topoLayoutPosition
                this.getTopoInfo(flag)
            }
        },
        //请求接口，获取拓扑图数据并同步更新store
        getTopoInfo(flag) {
            const tips = flag? ['拓扑图刷新', '拓扑图加载失败！']: ['', '拓扑图加载失败！'] 
            apiCover({
                url: 'GetTopoLinkInfo',
                tips
            })
            .then(res => {
                this.isLoading = false
                let data

                if(res.type == 'success') {
                    //通过添加type字段来区分交换机、主机以及其余设备
                    const device = res.data.node.map(a => {
                        const type = 'device'
                        return {...a, type}
                    })

                    const host = res.data.host.map(a => {
                        const type = 'host'
                        return {...a, type}
                    })

                    const link = res.data.link

                    let others = []
                    for (let key in res.data) {
                        if(res.data.hasOwnProperty(key)) {
                            if(key != 'node' && key != 'host' && key != 'link') {
                                others = [...others, ...res.data[key]]
                            }
                        }
                    }
                    others = others.map(a => {
                        const type = 'others'
                        return {...a, type}
                    })
                    
                    data = {node: [...device, ...host, ...others], link}
                    //每次请求数据都同步更改store数据
                    this.$store.commit('resetDeviceInfo', device)
                    this.$store.commit('resetHostInfo', host)
                }
                else {
                    data = {node: [], link: []}
                }
                
                this.drawCanvas(data) 
            })
            .catch(err => {
                this.isLoading = false
            })
        },
        // 初始topo图canvas容器,当切换全屏时调用一次(解决屏幕高度发生改变canvas不自适应的问题)
        initCanvasContainer(status) {
            this.$nextTick(() => { // 为了确保虚拟DOM渲染成功
                let canvas = document.querySelector('.canvas')
                const wrapper = document.querySelector('.TopoLinks')
                const width = Number.parseFloat(getComputedStyle(wrapper)['width'])
                const height = Number.parseFloat(getComputedStyle(wrapper)['height'])
                canvas.setAttribute('width', width)
                canvas.setAttribute('height', height)

                // 动态开启关闭右键菜单显示功能
                if(status) {
                    this.canContextMeunuEdit = false
                }
                else {
                    this.canContextMeunuEdit = true
                }
            })
        },
        //绘制画布
        drawCanvas(data) {
            const links = data.link //所有链路
            const devices = data.node //所有设备
            
            // 所有节点,id,label,image和shape为插件默认参数
            let nodeInfo = devices.map(a => {
                const id = a.devIpAdd || a.ipAddress //用设备唯一id作为拓扑图节点id
                const label = a['devName'] || a['deviceName'] || a['name']
                const x = a.pointX 
                const y = a.pointY
                const type = a.type
                const role = a.deviceRole
                let image = ''
                let size = []

                /* 从DevicePicMap模块里取图标数据来匹配 */
                const isRoleDevice = !DevicePicMap[type].hasOwnProperty('imgSrc')
                let targetDev
                if(isRoleDevice) { // 交换机图标
                    targetDev = Object.entries(DevicePicMap[type]).find(item => item[0].startsWith(role))[1]
                }
                else { //服务器图标和未知设备图标
                    targetDev = DevicePicMap[type]
                }
                // require参数必须为静态路径，也就是说必须存在字符串字面量，如果全部都为变量拼接的字符串，则只能使用require.context()
                image = a['onlineStatus'] == 'onLine'
                        ? require(`@/assets/image/physicTopo/${targetDev.imgSrc.onStatus}`)
                        : require(`@/assets/image/physicTopo/${targetDev.imgSrc.offStatus}`) 
                size = targetDev.size

                const onlineStatus = (a['onlineStatus'] == 'onLine') || (a['onlineStatus'] == undefined)? true : false
                const sshInfo = {
                    sshUsr: a['sshUserName'],
                    sshPwd: a['sshPassword'],
                    enablePwd: a['enablePassword']
                }
                return {id, x, y, label, image, shape: 'image', size, onlineStatus, type, sshInfo}
            })

            // 所有连线
            let edgeInfo = links.map(a => {
                const start = a.source['source-node']
                const destinate = a.destination['dest-node']
                const linkId = a['link-id'] 
                const fromNode = nodeInfo.find(a => a.id == start)
                const toNode = nodeInfo.find(a => a.id == destinate)
                const from = fromNode && fromNode.id
                const to = toNode && toNode.id
                const tips = linkId.split(':').slice(1,3).join('----')

                //只有当两台设备在线、端口全部up才显示链路在线
                const isAllProtUp = a.source.portStatus == 'up' && a.destination.portStatus == 'up'
                const isNodeExist = from && to
                const isActive = isNodeExist && fromNode.onlineStatus && toNode.onlineStatus && isAllProtUp
                const color = isActive?'22,124,255':'179,175,169' //在线和离线状态的连线颜色
                return {from, to, style: {color}, linkId, tips}
            })
            // 生成数据
            const networkData = {
                nodes: nodeInfo,
                edges: edgeInfo
            }
            //全局配置
            const options = {} 

            // 初始化network,填充数据并配置
            const network = this.network
            network.setData(networkData)
            // network.setOptions(options)

            // 保存当前nodes的位置,和初始化当前nodes的位置
            const storePosition = () => { 
                this.isNodePositionChanged = true
                this.nodePosition = network.getPosition()
            }
            const initPosition = (data = []) => { 
                const positions = data.map(a => {
                    const id = a.id
                    const x = a.x || 0
                    const y = a.y || 0
                    return {id, x, y}
                })
                network.setPosition(positions)
            }
            initPosition(this.nodePosition)

            /* network绑定的事件 */
            // 拖动画布结束时存储nodes的位置
            network.on('dragEnd', storePosition) 

            // 双击nodes节点跳转路由
            // network.on('dbclick', res => { 
            //     if(res.nodes[0]) { //点击的是nodes节点
            //         const nodeData = nodeInfo[res.nodes[0]-1]
            //          //双击跳转路由到面板图
            //         this.$router.push(`/home/TopoPic?siteIp=${nodeData.siteIp}&siteType=${nodeData.siteType}`)
            //     }
            //     else if(res.edges[0]) { //点击的是edges连线
            //         console.log(edgeInfo[res.edges[0]-1])
            //     }
            //     else {
            //         console.log('你没有点击交换机')
            //     }
            // })

            // 鼠标hover到node显示tips,鼠标离开node和拖动node关闭tips
            network.on('mousemove', res => { 
                if(res.type == 'node') {
                    this.tips = res.target.data.id
                    this.tipsStyle.display = 'block'
                    this.tipsStyle.left = res.DOM.pageX + 20 + 'px'
                    this.tipsStyle.top = res.DOM.pageY + 20 + 'px'
                }
                else {
                    this.tipsStyle.display = 'none'
                }
            })
            network.on('drag', res => { 
                this.tipsStyle.display = 'none'
            })

            // 鼠标右键弹出对应的菜单项，单击让右键菜单全部隐藏
            network.on('click',() => { 
                this.contextMeunu.forEach(a => a.enabled = false)
            })
            network.on('contextmenu',res => { 
                this.contextMeunu.forEach(a => a.enabled = false) //先让之前的菜单全部消失再打开对应菜单
                
                const x = res.DOM.pageX
                const y = res.DOM.pageY
                //让菜单项跟随鼠标移动
                this.contextMeunuPosition.left = x + 'px'
                this.contextMeunuPosition.top = y + 'px'
                
                const showContextMenu = type => { //根据右键选中的type显示对应的右键餐单
                    this.contextMeunu.forEach(a => {
                        if(a.type == type) a.enabled = true
                    })
                }
                //只让管理员并且在非全屏状态下才能操作右键菜单
                const isAdminRole = Storage.get('isAdminRole')
                if(isAdminRole && this.canContextMeunuEdit) {
                    // 动态弹出对应的右键菜单
                    const nodeType = res.type
                    const machineType = res.target && res.target.data.type
                    let menuType = ''
                    if(Boolean(nodeType) && machineType != 'others') {
                        menuType = nodeType
                    }
                    else if(!Boolean(nodeType)) {
                        menuType = 'global'
                    }
                    
                    showContextMenu(menuType)
                    this.target = res.target?res.target.data: ''
                }
            })
        },
        //弹出菜单点击的操作逻辑
        contextMeunuHandler(item) {
            this.contextMeunu.forEach(a => a.enabled = false)
            console.log(item)
            switch (item) {
                case 'addDevice' :
                    this.isAddModal = true
                    break ;
                case 'findDevice' :
                    this.isFindModal = true
                    break ;
                case 'delDevice' :
                    this.delDevice()
                    break ;
                case 'delLink' :
                    this.delLink()
                    break ;
            }
        },
        //查询预设的SSH信息到添加设备modal和发现设备modal
        async QuerySSHInfo() {
            const {type, data} = await apiCover({
                url: 'GetSSHResourceConfig'
            })
            if(type == 'success') {
                const SSHInfo = data[0]
                this.showAddItem.input[2].value = SSHInfo.sshName
                this.showAddItem.input[3].value = SSHInfo.sshPassword
                this.findItem.input[2].value = SSHInfo.sshName
                this.findItem.input[3].value = SSHInfo.sshPassword
            }
        },
        //添加设备,包含添加交换机和服务器
        addDevice() {
            let apiUrl, data, isIPValid
            if(this.addItem.radio.value == '设备') {
                apiUrl = 'InsertDevice'
                const onlineStatus = this.showAddItem.select[2].result == '在线'? 'onLine': 'offLine'

                data = {
                    deviceName: this.showAddItem.input[0].value,
                    deviceIp: this.showAddItem.input[1].value,
                    sshUserName: this.showAddItem.input[2].value,
                    sshPassword: this.showAddItem.input[3].value,
                    deviceType: this.showAddItem.select[0].result,
                    deviceRole: this.showAddItem.select[1].result,
                    onlineStatus 
                }
                isIPValid = RegExpRule.isIP(data.deviceIp)
            }
            else if (this.addItem.radio.value == '主机') {
                apiUrl = 'AddHost'
                const hostType = this.showAddItem.select[0].result == '物理主机'? 'HOST': 'BAREMETAL'
                const vtepType = this.showAddItem.select[1].result == '软件'? 'SW': 'HW'
                const onlineStatus = this.showAddItem.select[2].result == '在线'? 'onLine': 'offLine'
               
                data = {
                    hostName: this.showAddItem.input[0].value,
                    hostIp: this.showAddItem.input[1].value,
                    sshUserName: this.showAddItem.input[2].value,
                    sshPassword: this.showAddItem.input[3].value,
                    hostType,
                    vtepType,
                    onlineStatus 
                }
                isIPValid = RegExpRule.isIP(data.hostIp)
            }

            if(isIPValid) {
                this.isLoading = true
                apiCover({
                    url: apiUrl,
                    data,
                    tips: '添加设备'
                })
                .then(res => {
                    this.isLoading = false
                    this.refreshData()
                    this.showAddItem.input.forEach(a => a.value = '')  //清除输入框
                })
                .catch(err => {
                    this.isLoading = false
                })
            }
            else {
                this.$Message.warning({
                    content: '请输入有效的ip地址'
                })
            }
        },
        //设备发现
        findDevice() {
            const startIP = this.findItem.input[0].value
            if(!this.findItem.input[1].value) { //当用户没有输入结束IP时，自动填充为起始IP
                this.findItem.input[1].value = this.findItem.input[0].value
            }
            const endIP = this.findItem.input[1].value
            
            //判断输入的ip地址合法性
            const startIPFirst = startIP.split('.').slice(0,3).join('.')
            const endIPFirst = endIP.split('.').slice(0,3).join('.')
            const isIP = RegExpRule.isIP(startIP) && RegExpRule.isIP(endIP)
            const isValid = isIP && (startIPFirst == endIPFirst) //需要确保起始和结束处于同一网段

            if(isValid) {
                this.isFindeResultModal = true
                this.findItem.resultStatus = 'loading'

                const data = {
                    ipStart: startIP, 
                    ipEnd: endIP,
                    sshUserName: this.findItem.input[2].value,
                    sshPassword: this.findItem.input[3].value,
                }

                api({
                    url: 'FindDevice', 
                    data
                })
                .then(res =>{
                    if(res.data.code == '0000') {
                        this.findItem.resultStatus = 'success'
                        this.refreshData() //设备发现之后重新加载刷新数据
                    }
                    else {
                        this.findItem.resultStatus = 'fail'
                    }
                    // setTimeout(() => {
                    //     this.isFindeResultModal = false
                    // },2000)
                })
                .catch(err => {
                    this.findItem.resultStatus = 'fail'
                })
            }
            else {
                this.$Message.info({
                    content: '输入的IP无效，请输入同一网段的IP',
                    duration: 5,
                    closable: true
                })
            }
        },
        //删除设备
        delDevice() {
            const type = this.target.type
            const data = type=='device'?{deviceIp:this.target.id}:{hostIp:this.target.id}
            const apiUrl = type=='device'?'DeleteDevice':'DeleteHost'
            this.$Modal.confirm({
                title: '删除提醒',
                content: '是否删除设备？',
                closable: true,
                onOk: () => {
                    apiCover({
                        url: apiUrl,
                        data,
                        tips: '设备删除'
                    })
                    .then(res => {
                        this.refreshData() 
                    })
                }
            })
        },
        //删除链路
        delLink() {
            const linkId = this.target.linkId
            this.$Modal.confirm({
                title: '删除提醒',
                content: '是否删除链路？',
                closable: true,
                onOk: () => {
                    apiCover({
                        url: 'DeleteLink',
                        data: {linkId},
                        tips: '链路删除'
                    })
                    .then(res => {
                        this.refreshData() 
                    })
                }
            })
        }
    }
}
    
</script>

<style lang="css" scoped>
/*重写radio组件选中的背景颜色和字体颜色*/
.ivu-radio-group-button .ivu-radio-wrapper-checked {
    background: #2d8cf0;
    color: #fff;
}

.TopoLinks {
    background: #F9F9FD;
}
.Topo {
    position: relative;
    width: 100%;
    height: 100%;
    background: transparent !important;
}
.tips {
    position:absolute;
    padding:5px;
    background:rgba(50,50,50,.7);
    border-radius:4px;color:#fff;font-size:14px;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}
.contextMeunu {
    position: absolute;
    list-style: none;
}
.contextMeunu_item {
    margin-bottom: 2px;
    padding: 0 8px;
    height: 25px;
    line-height: 25px;
    color:#fff;
    background: linear-gradient(to bottom, #618fb0,#618fb0);
    border: 1px solid #bbb;
    cursor: pointer;
}
.contextMeunu_item:hover{
    background: blue;
}
.loading_png {
    display: block;
    margin: auto;
    width: 50px;
    height: 50px;
}
@keyframes rotate {
    from {transform: rotate(0deg)}
    to {transform: rotate(360deg)}
}
.rotate {
    animation: rotate infinite 2s;
}
</style>