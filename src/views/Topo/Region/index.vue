<!--
 * @Author: 朱文芳
 * @Description: 区域管理
 * @LastEditors: 朱文芳
 * @UpdateLogs: 区域管理
 * @Date: 2019-04-08 11:09:57
 * @LastEditTime: 2019-04-08 16:17:06
 -->

<template>
    <div class="topoRegion" ref="wrap">
        <Card :bordered="false">
            <BreadLink />
        </Card>
        <div class="content">
            <h2 class="title">区域管理</h2>
            <Button 
                :loading="isLoading"
                class="btn"
                @click="showModal()" 
                icon="md-add"
                type="primary"
                v-if="isAdminRole"
            >区域添加</Button>
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
                    title="区域添加"
                    @on-ok="connectItem"
                    @on-cancel="cancelItem">
                        <div style="margin-bottom: 20px;">
                            区域名称：<Input v-model="regionName" placeholder="请输入" clearable style="width: 100%" />
                        </div>
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
    name: 'Region',
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
            regionName: '', // 区域名称
            deviceData: this.getDeviceData(),
            columns: [
                {
                    title: '区域名称',
                    key: 'hostName',
                    render: (h, params) => {
                        const hostName = params.row.hostName
                        return (
                            <span
                                style="color: #1890FF; cursor: pointer;"
                                onClick={() => {
                                    this.$router.push({
                                        path: '/home/RegionDetail',
                                        query: {hostName}
                                    })
                                }}
                            >{hostName}</span>
                        )
                    }
                },
                {
                    title: '交换机',
                    key: 'aclName',
                    render: (h, params) => {
                        const deviceInfo = params.row.deviceInfo
                        const arr = []
                        const list = deviceInfo.map((a, i) => {
                            let item = i == 0 ? a.deviceRole.name : '，' + a.deviceRole.name
                            arr.push(item)
                            return <span>{item}</span>
                        })
                        return <div class="nics" title={arr.join('，')}>{list}</div>
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
                url: 'GetAllPodElement',
                tips: '区域管理查询'
            })
            .then(res => {
                this.isLoading = false
                if(res.type == 'success') {
                    this.devices = res.data
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
                content: '是否删除当前策略路由规则？',
                closable: true,
                onOk: () => {
                    this.isLoading = true
                    const data = {
                        deviceIp: this.deviceIp,
                        routeMapName: this.selectedRow.routeMapName,
                        aclName: this.selectedRow.aclName,
                        nextHop: this.selectedRow.nextHop,
                        ipType: this.selectedRow.ipType
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