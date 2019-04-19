<!--
 * @Author: 陈晨
 * @Description: Dashboard组件
 * @Date: 2018-12-10 14:49:49
 * @LastEditTime: 2019-01-02 14:12:56
 * @LastEditors: 陈晨
 * @UpdateLogs: 去除多余的console
 -->
<template>
    <div class="Dashboard">
        <Card class="content_top" :bordered="false">
            <p slot="title" class="text_left">虚拟网络</p>
            <FullScreen 
                slot="extra"
                style="marginRight: 10px"
                dom=".Dashboard"
            />
            <div class="content_top_wrap">
                <div 
                    class="content_top_item"
                    v-for="(software, i) of software"
                    :style="{'background-image': 'url('+ software.bgImg +')'}"
                    :key="`${software.title}-${i}`">
                    <div class="icon"></div>
                    <div class="top_item_text">
                        <span>{{software.num}}</span>
                        <p>{{software.title}}</p>
                    </div>
                </div>
            </div>
        </Card>
        <div class="content_bottom">
            <Card class="bottom_circle" style="min-height: 475px;">
                <p slot="title" class="text_left">物理设备</p>
                <!--
                <div class="circle">
                    <i-circle
                        class="circle_svg"
                        v-for="(circle, i) of hardware"
                        :key="`${circle.title}-${i}`"
                        :size="135"
                        stroke-color="#2d8cf0"
                        :percent="circle.usePerent? circle.num: 100">
                        <div class="circle-custom">
                            <p>{{circle.title}}</p>
                            <div class="circle-custom_num">
                                <h1>{{circle.num}}</h1>
                                <span v-if="circle.usePerent">%</span>
                            </div>
                            <p
                                v-for="desc of circle.desc"
                                :key="`${circle.title}-${desc}`"
                                class="circle-custom_dec">
                                {{desc}}
                            </p>
                        </div>
                    </i-circle>
                </div>
                -->
                
                <div class="circle">
                    <div class="circle-custom" v-for="(circle, i) of hardware">
                        <div class="circle-custom_num">{{circle.num}}</div>
                        <div class="circle-custom_title">
                            <img class="circle-custom_title--icon" :src="circle.url" />
                            <span class="circle-custom_title--text">{{circle.title}}</span>
                        </div>
                        <div class="circle-custom_desc">
                            <div class="circle-custom_desc--attr">
                                <i class="iconfont icon-lixian"></i>
                                <span>在线：{{circle.active}}</span>
                            </div>
                            <div class="circle-custom_desc--num">
                                <div class="circle-custom_desc--attr">
                                    <i class="iconfont icon-zaixian"></i>
                                    <span>离线：{{circle.inactive}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                
            </Card>
            <Card class="bottom_pie">
                <p slot="title" class="text_left">控制器</p>
                
                <ControlUsage v-if="showController" :data.sync="controller" :hasTab.sync="hasTab" />  
                
                <!--
                <div class="chart_wrap">
                    <div 
                        class="chart"
                        v-for="(chart, i) of controller" >
                        <Select v-if="select.length>0" v-model="select[i].result" style="width:110px" class="chart_select"> 
                            <Option 
                                v-for="item in select[i].item" 
                                :value="item.value" 
                                :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <div 
                            :ref="`chart${i}`" 
                            style="width:330px;height:250px"></div>
                        <Tooltip :content="chart.ip" transfer  class="chart_name">
                            <p>{{ chart.hostName }}</p>
                        </Tooltip>
                    </div>
                </div>
                -->
            </Card>
        </div>
        <Spin size="large" fix v-if="spinShow"></Spin>
    </div> 
</template>

<script>
import { api, apiCover } from '@/api/index'

import FullScreen from '@/components/FullScreen'

import ControlUsage from './ControlUsage'

export default {
    name: 'Dashboard',
    components: {
        FullScreen,
        ControlUsage
    },
    data() {
        return {
            hardware: [],
            software: [],
            controller: [],
            chartIns: [],
            select: [],
            spinShow: false,
            contentStyleObj:{
    　　　　    height:''
    　　　　 },
            showController: false,
            hasTab: false
        }
    },
    /*
    watch: {
        // select的动态填充必须在template里判断非空情况(select数据在template使用，而template编译在mounted之前)
        select: {
            handler(val, oldVal) {
                val.forEach((select, i) => {
                    const targetResult = select.result
                    const targetLabel = select.item.find(a => a.value == targetResult).label
                    const pieData = targetResult == 'cpu'
                                ? [Number.parseFloat(this.controller[i].cpu), 100-Number.parseFloat(this.controller[i].cpu)]
                                : [Number.parseFloat(this.controller[i].ram), 100-Number.parseFloat(this.controller[i].ram)]
                    const targetChartIns = this.chartIns[i]
                    this.drawChart(targetChartIns, targetLabel, pieData)
                })
            },
            deep: true
        },
        // 监测controller数据异步获取来动态生成echart实例和填充select
        controller(val) {
            this.$nextTick(() => {
                val.forEach((chart, i) => {
                    const instance = this.$_echarts.init(this.$refs[`chart${i}`][0])
                    this.chartIns.push(instance)
                    
                    // 根据chart实例数量来动态渲染select数量
                    const selectData =  {
                        item: [
                            { label: 'CPU使用(%)', value: 'cpu' },
                            { label: '内存使用(%)', value: 'mem' }
                        ],
                        result: 'cpu'
                    }
                    this.select.push(selectData)
                })
            })
        }
    },
    */
    created() {
        this.spinShow = true

        apiCover({
            url: 'GetDashboard',
            tips: ['', '概况图加载失败']
        })
        .then(res => {
            this.spinShow = false
            if(res.type == 'success') {
                const hardware = Object.entries(res.data.underlay)
                const software = res.data.tenant
                const controller = res.data.cluster

                const hardwareIcon = [
                    { url: require('@/assets/image/lbaas.png') },
                    { url: require('@/assets/image/fwaas.png') },
                    { url: require('@/assets/image/host.png') },
                    { url: require('@/assets/image/device.png') }
                ]

                hardware.forEach((item, index) => {
                    const key = item[0]
                    const val = item[1]

                    let title 
                    if(key == 'device') {
                        title = '交换机'
                    }
                    else if(key == 'fwaas') {
                        title = '防火墙'
                    }
                    else if(key == 'host') {
                        title = '服务器'
                    }
                    else if(key == 'lbaas') {
                        title = '负载均衡'
                    }

                    hardwareIcon.forEach((key, i) => {
                        if(index === i) {
                            this.hardware.push({
                                title,
                                num: val.total, 
                                usePerent: false, 
                                active: val.active,
                                inactive: val.inactive,
                                url: key.url
                            })
                        }
                    })  
                })

                const teanTitle = [
                    { key: 'tenanNumber', name: '租户', url: require('@/assets/image/ds-tenant.png')},
                    { key: 'networkNum', name: '网络', url: require('@/assets/image/ds-network.png') },
                    { key: 'subnetNum', name: '子网', url: require('@/assets/image/ds-subnet.png') },
                    { key: 'routeNum', name: '路由', url: require('@/assets/image/ds-router.png') }
                ]
                teanTitle.forEach(item => {
                    this.software.push({
                        title: item.name,
                        num: software[item.key],
                        bgImg: item.url
                    })
                })

                /*
                const controller = [
                    {
                        cpu: "34%",
                        diskUsage: "82%",
                        hostName: "chenying-virtual-machine",
                        ip: "127.0.0.1",
                        ram: "9.0%",
                        status: "Up",
                        syncStatus: "同步成功"
                    },
                    {
                        cpu: "34%",
                        diskUsage: "82%",
                        hostName: "chenying-virtual-machine",
                        ip: "127.0.0.1",
                        ram: "9.0%",
                        status: "Up",
                        syncStatus: "同步成功"
                    },
                    {
                        cpu: "34%",
                        diskUsage: "82%",
                        hostName: "chenying-virtual-machine",
                        ip: "127.0.0.1",
                        ram: "9.0%",
                        status: "Up",
                        syncStatus: "同步成功"
                    }
                ]
                */
                
                // 控制器数据
                if(controller.length === 1) {
                    let obj = controller[0]
                    this.controller.push(
                        {
                            type: 'CPU',
                            usage: obj.cpu
                        },
                        {
                            type: 'RAM',
                            usage: obj.ram
                        },
                        {
                            type: 'DISK',
                            usage: obj.diskUsage
                        }
                    )
                    this.showController = true
                } else if(controller.length === 3) {
                    this.hasTab = true
                    this.controller.push(
                        {
                            type: 'CPU',
                            title: 'CPU使用率',
                            data: [
                                {
                                    'id': 'cpu1',
                                    "usage": controller[0].cpu
                                },
                                {
                                    'id': 'cpu2',
                                    "usage": controller[1].cpu
                                },
                                {
                                    'id': 'cpu3',
                                    "usage": controller[2].cpu
                                }
                            ]
                        },
                        {
                            type: 'RAM',
                            title: '内存使用率',
                            data: [
                                {
                                    'id': 'ram1',
                                    "usage": controller[0].ram
                                },
                                {
                                    'id': 'ram2',
                                    "usage": controller[1].ram
                                },
                                {
                                    'id': 'ram3',
                                    "usage": controller[2].ram
                                }
                            ]
                        },
                        {
                            type: 'DISK',
                            title: '硬盘使用率',
                            data: [
                                {
                                    'id': 'disk1',
                                    "usage": controller[0].diskUsage
                                },
                                {
                                    'id': 'disk2',
                                    "usage": controller[1].diskUsage
                                },
                                {
                                    'id': 'disk3',
                                    "usage": controller[2].diskUsage
                                }
                            ]
                        }
                    )
                    this.showController = true
                }

            }
        })
        .catch(err =>{
            this.spinShow = false
        })
        
        /**** 模拟数据 ****/
        /**** 
        this.controller = [
            {
                type: 'cpu',
                title: 'CPU使用率',
                data: [
                    {
                        'id': 'canvas1',
                        "hostName": "cpu1",
                        "ip": "127.0.0.1",
                        "usage": "20"
                    },
                    {
                        'id': 'canvas2',
                        "hostName": "cpu2",
                        "ip": "127.0.0.1",
                        "usage": "30"
                    },
                    {
                        'id': 'canvas3',
                        "hostName": "cpu3",
                        "ip": "127.0.0.1",
                        "usage": "40"
                    }
                ]
            },
            {
                type: 'ram',
                title: '内存使用率',
                data: [
                    {
                        'id': 'canvas4',
                        "hostName": "ram1",
                        "ip": "127.0.0.1",
                        "usage": "50"
                    },
                    {
                        'id': 'canvas5',
                        "hostName": "ram2",
                        "ip": "127.0.0.1",
                        "usage": "60"
                    },
                    {
                        'id': 'canvas6',
                        "hostName": "ram3",
                        "ip": "127.0.0.1",
                        "usage": "70"
                    }
                ]
            },
            {
                type: 'disk',
                title: '硬盘使用率',
                data: [
                    {
                        'id': 'canvas7',
                        "hostName": "disk1",
                        "ip": "127.0.0.1",
                        "usage": "80"
                    },
                    {
                        'id': 'canvas8',
                        "hostName": "disk2",
                        "ip": "127.0.0.1",
                        "usage": "90"
                    },
                    {
                        'id': 'canvas9',
                        "hostName": "disk3",
                        "ip": "127.0.0.1",
                        "usage": "10"
                    }
                ]
            }
        ]
        */
        

    },
    methods: {
        //返回公共配置和给定参数的options
        formatOptions(title, data) {
            return {
                title: {
                    text: title,
                    left: 'left'
                },
                legend: {
                    type: 'plain',
                    left: 'right'
                },
                tooltip: {
                    show: true
                },
                series: [
                    {
                        name: title,
                        type: 'pie',
                        center: ['45%','55%'],
                        radius: '77%',
                        data:[
                            {
                                value:data[0], 
                                name:'已用',
                                itemStyle: {
                                    color: '#be1e2d'
                                }
                            },
                            {
                                value:data[1], 
                                name:'空闲',
                                itemStyle: {
                                    color: '#27aae1'
                                }
                            }
                        ]
                    }
                ]
            }
        },
        //绘制图表
        drawChart(ins, title, data) {
            //重绘图表仅仅是重新添加配置而不用重新生成实例占用资源
            const option = this.formatOptions(title, data)
            
            //填充数据，加入配置，绘制图表画布
            ins.setOption(option)
        }
    }
}       
</script>

<style lang="css" scoped>
.Dashboard {
    position: relative;
    overflow-y: auto;
}
.text_left {
    text-align: left;
    font-size: 16px;
    font-style: normal
}
.text_left:before {
    content: "";
    display: block;
    position: absolute;
    width: 3px;
    height: 16px;
    background: #1890FF;
    left: 0;
    top: 16px;
    z-index: 3000
}
/********************/
.content_top {
    margin-bottom: 17px;
    border: 1px solid #F2F2F2;
    box-shadow: 0 0 4px 4px rgba(242,242,242,0.50);
}
.content_top_wrap {
    display: flex;
    justify-content: space-between;
    padding: 20px;
}
.content_top_item {
    display: flex;
    width: 24%;
    height: 172px;
    border-radius: 12px;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
}
.icon {
    position: relative;
    width:110px;
    height: 100%;
    background: transparent/*#2d8cf0*/;
}
.icon_router {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%,-50%,0);
    display: block;
    width: 70px;
    height: 80px;
    background: url('~@/assets/image/router.png') no-repeat 0/110%;
}
.top_item_text {
    padding-top: 35px;
    width: calc(100% - 110px);
    color: #fff;
    font-size: 18px;
}
.top_item_text span {
    font-size: 53px;

}
/********************/
.content_bottom {
    display: flex;
}

.bottom_circle {
    margin-right: 1%;
    width: 25%;
    border: 1px solid #F2F2F2;
    box-shadow: 0 0 4px 4px rgba(242,242,242,0.50);
}
.bottom_pie {
    width: 74%;
    border: 1px solid #F2F2F2;
    box-shadow: 0 0 4px 4px rgba(242,242,242,0.50);
}
.circle {
    display: -webkit-box;
    padding: 10px 25px 10px 0;
    
}
.circle .circle_svg {
    margin-left: 8%;
    margin-bottom: 30px;
}
.circle-custom_num {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 8px 0;
}
.circle-custom_dec {
    margin-top: 8px;
    font-size: 12px;
}
.chart_wrap {
    display: flex;
    justify-content: space-around;
}
.chart {
    position: relative;
    padding: 72px 0 0 10px;
    width: 30%;
    box-sizing: border-box;
}
.chart_select {
    position: absolute;
    top: 10px;
    left: 10px;
}
.chart_name {
    margin-left: -23%;
}

/* 修改后的样式 -- 物理设备模块 */
.circle {
    display: flex;
    padding: 40px 25px 10px 0;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
}
.circle .iconfont{
    font-size: 18px;
}
.circle-custom {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 50px;
}
.circle-custom_num {
    font-size: 34px;
    color: #1F40B4;
    /* font-weight: 700; */
}
.circle-custom_title {
    font-size: 16px;
    color: rgba(0,0,0,0.85);
    font-weight: 700;
}
.circle-custom_title--icon {
    vertical-align:middle;
    width: 18px;
    height: 18px;
}
.circle-custom_title--text {
    vertical-align:middle;
}
.circle-custom_desc{
    display: flex;

    flex-direction: row;
    justify-content: space-around;
    margin-top: 6px;
}
.circle-custom_desc .iconfont {
    font-size: 10px;
}
.circle-custom_desc .iconfont.icon-zaixian {
    color: rgb(185, 185, 185);
}
.circle-custom_desc .iconfont.icon-lixian {
    color: rgb(56, 208, 203);
}
.circle-custom_desc--attr {
    margin-right: 10px;
}

.content--inner {
    background-color: rgb(245, 247, 249);
}

</style>