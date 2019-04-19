<!--
 * @Author: 朱文芳
 * @Description: 区域管理详情
 * @LastEditors: 朱文芳
 * @UpdateLogs: 区域管理详情
 * @Date: 2019-04-08 11:09:57
 * @LastEditTime: 2019-04-08 17:20:04
 -->

<template>
    <div class="topoRegion" ref="wrap">
        <Card :bordered="false">
            <BreadLink />
        </Card>
        <div class="content">
            <h2 class="title">{{$route.query.hostName}}</h2>
            <Button 
                :loading="isLoading"
                class="btn"
                @click="showModal()" 
                icon="md-add"
                type="primary"
                v-if="isAdminRole"
            >管理设备</Button>
            <div class="box-wrap">
                <Table
                    ref="table"
                    :height="tableHeight"
                    :stripe="true"
                    :columns="showColumns"
                    :data="showDevices"
                    :loading="isLoading" 
                />
                <Page 
                    style="marginTop:20px"
                    :total="filterDevices.length" 
                    show-sizer 
                    show-total
                    placement="top"
                    transfer
                    :page-size-opts="[10,25,50,100]"
                    @on-change="changePage"
                    @on-page-size-change="changePageSize"
                />
                <Modal
                    width="460"
                    v-model="isConModal"
                    title="管理设备"
                    @on-ok="connectItem"
                    @on-cancel="cancelItem">
                        <p>交换机选择：</p>
                        <Transfer
                            :data="deviceData"
                            :target-keys="targetKeys"
                            :render-format="renderVds"
                            @on-change="handleChange"
                        ></Transfer>
                </Modal>
            </div>
            
        </div>
    </div>
</template>

<script>
import { api, apiCover } from '@/api/index'
import isFilter from '@/utils/IsFilter'
import RegExpRule from '@/utils/RegExpRule'
import Storage from '@/utils/Storage'

import { Button } from 'iview'

export default {
    name: 'RegionDetail',
    data() {
        return {
            isAdminRole:false,
            wrapDOM: null,
            filter:[],
            devices: [],
            isLoading: false,
            searchText: '',
            currentPage: 0,
            currentPageSize: 10,
            isAdminRole:false,
            deviceIp: '', // 选中的设备IP
            selectedRow: {}, // 当前点击的行数据
            isConModal: false, // 弹层
            deviceData: this.getDeviceData(),
            columns: [
                {
                    title: '角色',
                    key: 'deviceRole',
                },
                {
                    title: '名称',
                    key: 'devName',
                },
                {
                    title: 'IP',
                    key: 'IP',
                    render: (h, params) => {
                        const ip = params.row.devId.split(':')[1]
                        return <span>{ip}</span>
                    }
                }
            ]
        }
    },
    computed: {
        filterDevices() {
            //先根据搜索字符模糊匹配数据
            const filter = this.devices.filter(item => {
                return isFilter(item,this.columns,this.searchText)
            })
            this.filter = filter
            return filter
        },
        showDevices() {
            //再截取数据分页展示
            const filter = this.filter
            const startIndex = this.currentPage*this.currentPageSize
            const endIndex = startIndex + this.currentPageSize
            return filter.slice(startIndex,endIndex)
        },
        showColumns() {
            const operation = {
                title: '操作',
                align: 'center',
                width: 250,
                render: (h, params) => {
                    return (
                        <div>
                            <Button
                                icon="md-close-circle"
                                type='error'
                                onClick={() => {
                                    this.selectedRow = params.row;
                                    this.deleteItem();
                                }}
                                >删除</Button>
                        </div>
                    )
                }
            }

            return this.isAdminRole?[...this.columns,...operation]:this.columns
        }, 
        tableHeight() {
            return this.wrapDOM?Number.parseFloat(getComputedStyle(this.wrapDOM)['height'])-150 :0
        }
    },
    //组件加载刷新
    created() {
        this.isAdminRole = Boolean(Storage.get('isAdminRole'))
        this.getDevices()
    },
    mounted() {
        this.wrapDOM = this.$refs.wrap
    },
    methods: {
        //切换页码
        changePage(num) {
            this.currentPage = num -1
        },
        //切换页数
        changePageSize(num) {
            this.currentPageSize = num 
        },
        // 根据选中ip请求port接口,加载所有注册实例信息
        getDevices() {
            this.isLoading = true
            apiCover({
                url: 'GetPodElement',
                data: {
                    PodName: this.route.query.hostName
                },
                tips: '区域详情查询'
            })
            .then(res => {
                this.isLoading = false
                if(res.type == 'success') {
                    this.devices = res.data.deviceInfo
                } else {
                    this.devices = []
                }
                
            })
            .catch(err => {
                this.isLoading = false
            })
        },
        // modal内表单数据清空
        showModal() {
            this.isConModal = true
            this.targetKeys = []
        },
        //获取设备数据
        getDeviceData() {
            const newData = []
            apiCover({
                url: "GetAllDevice",
                tips: "交换机查询"
            })
            .then(res => {
                if (res.type == "success") {
                    res.data.forEach(a => {
                        newData.push({ key: a.dvsUuid, label: a.dvsName})
                    })
                }
            })
            this.deviceData = newData
            return newData
        },
        //渲染选中的设备
        renderDevice(item) {
            return item.label
        },
        //选择设备
        handleChange (newTargetKeys, direction, moveKeys) {
            this.targetKeys = newTargetKeys;
        },
        //创建区域
        addItem() {
            apiCover({
                url: "AddPod",
                data: {
                    domainUuid: this.selectedRow.uuid,
                    vdsUuid: this.targetKeys.join(',')
                },
                tips: "区域添加"
            })
            .then(res => {
                if (res.type == "success") {
                    this.isConModal = false
                    this.getDevices();
                }
            })
        },
        // 关闭弹层
        cancelItem() {
            this.isConModal = false
            this.targetKeys = []
        },
        // 删除
        deleteItem() {
            this.$Modal.confirm({
                title: '删除提示',
                content: '是否删除当前区域详情？',
                closable: true,
                onOk: () => {
                    this.isLoading = true
                    const data = {
                        podName: this.$route.query.hostName,
                        deviceIP: this.selectedRow.devId.split(':')[1],
                    }
                    apiCover({
                        url: 'DeleteRouteMap',
                        data,
                        tips: '策略路由规则删除'
                    })
                    .then(res => {
                        this.isLoading = false
                        if(res.type == 'success') {
                            this.getDevices()
                        }
                    })
                    .catch(err => {
                        this.isLoading = false
                    })
                }
            })
        }
    }
}    
</script>

<style lang="css">
.topoRegion .nics{
    width:760px;
    overflow:hidden;
    white-space:nowrap;
    text-overflow:ellipsis
}
</style>