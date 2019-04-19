<template>
    <div class="GetDevicePic" style="height:100%">
        <Card :bordered="false" style="height:100%">
            <h2 slot="title">面板图</h2>
            <div slot="extra" style="display:flex;marginTop:-5px">
                <Select v-model="selectSuccess" style="width:130px;marginRight: 10px;">
                    <Option 
                        v-for="(item,i) of selectItem.name" 
                        :value="selectItem.ip[i]" 
                        :key="selectItem.ip[i]"
                        >{{ item }}</Option>
                </Select>
            </div>
            <div class="canvasWrapper">
                <div id="canvas"></div>
            </div>
        </Card>
    </div>
</template>

<script>
import { api, apiCover } from '@/api/index'
import { baseURL as base } from '@/api/config'
import getDeviceInfo from '@/utils/GetDeviceInfo'
import DrawDeviceCanvas from '@/utils/DrawDeviceCanvas'

export default {
    name: 'TopoPic',
    data() {
        return {
            //添加设备for的参数
            selectItem:{name:[],type:[],ip:[]},
            //select绑定选中的参数
            selectSuccess:'',
            DrawDeviceCanvas: null
        }
    },
    
    created() { //组件加载刷新
        //下拉框value从store里获取
        let deviceInfo = [...this.$store.state.deviceInfo]
        this.selectItem.name = getDeviceInfo(deviceInfo).siteName
        this.selectItem.ip = getDeviceInfo(deviceInfo).siteIp
        //一加载组件，先让select下拉框默认从路由query取数据选中第一个数据，没有的话默认为当前数据第一条
        const deviceType = this.$route.query.siteType
        const deviceIp = this.$route.query.siteIp
        this.selectSuccess = deviceIp || this.selectItem.ip[0]
    },
    mounted() {  //创建一个DrawDeviceCanvas实例
        this.DrawDeviceCanvas = new DrawDeviceCanvas()
        this.DrawDeviceCanvas.init('#canvas')
        this.DrawDeviceCanvas.setOptions({toolTip:true})
        this.DrawDeviceCanvas.on('contextmenu',e => {
            e.event.preventDefault();
            console.log(e)
        })
    },
    watch: { //通过modal下拉选择框输入值动态变化获取下方option的value,注意watch的key格式
        selectSuccess(val,oldVal) {
            this.DrawPics()
        }
    },
    methods: {
        DrawPics() { //获取数据动态绘制画布
            const siteIp = this.selectSuccess
            api('GetTopoPic',{siteIp})
                .then(res => {
                    if(res.data) {
                        let data = JSON.parse(JSON.stringify(res.data)) //深拷贝
                        let canvasData = []
                        //交换机背景图
                        if(data.deviceImage) {
                            data.deviceImage = base + data.deviceImage //添加url前缀
                            canvasData.push(data.deviceImage)
                        }
                        //板卡图
                        if(data.cardInfo) {
                            data.cardInfo.forEach(a => {
                                a.image = base + a.image //添加url前缀
                            }) 
                            const cardInfo = data.cardInfo.map(a => {
                                const info = {
                                    label: a.cardName,
                                    src: a.image,
                                    position: a.position,
                                    zIndex: 1
                                }
                                return info
                            })
                            canvasData.push(cardInfo)
                            // canvasData = [...canvasData,...cardInfo]
                        }
                        //端口图
                        data.portInfo.forEach(a => {
                            a.portImage = base + a.portImage //添加url前缀
                        })
                        const portInfo = data.portInfo.map((a,b) => {
                            const info = {
                                type:'port',
                                label:a.portName,
                                src:a.portImage,
                                position:a.portPosition,
                                size:a.portSize,
                                id:b+1,
                                zIndex: 3
                            }
                            return info
                        })
                        canvasData.push(portInfo)
                        this.DrawDeviceCanvas.setData(canvasData)
                        // console.log(canvasData)
                        // console.log(this.DrawDeviceCanvas)
                    }
                    else {
                        this.DrawDeviceCanvas.setData([])
                    }
                })
                .catch(err => console.log(err))
        }
    }
}
    
</script>

<style lang="css">
.canvasWrapper {
    margin: 5% auto;
    width: 80%;
    height: 350px;
    overflow-x: auto;
    overflow-y: hidden;
}
#canvas {
    width:1100px;
    height:100%;
}
</style>