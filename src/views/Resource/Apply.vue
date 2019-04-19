<template>
    <div class="Apply">
        <Card :bordered="false">
            <h2 slot="title">应用</h2>
            <div slot="extra" style="display:flex;marginTop:-5px">
                <Input 
                    v-model="searchText"
                    style="width: 177px;margin-right: 20px;"
                    placeholder="搜索...">
                    <Button icon="ios-search" slot="prepend" />
                </Input>
                <Button 
                    v-if="isAdminRole"
                    @click="applyOptions" 
                    icon="md-share"
                    type="success"
                    :loading="isLoading"
                    >应用</Button>
            </div>
            <Table
                :stripe="true"
                :columns="columns"
                :data="showDevices"
                :loading="isLoading"
            />
            <Page 
                style="marginTop:20px"
                :total="filterDevices.length" 
                show-sizer 
                show-total
                placement="top"
                :page-size-opts="[10,25,50,100]"
                @on-change="changePage"
                @on-page-size-change="changePageSize"
            />
        </Card>
    </div>
</template>

<script>
import { api, apiCover } from '@/api/index'
import isFilter from '@/utils/IsFilter'
import Storage from '@/utils/Storage'
import getDeviceInfo from '@/utils/GetDeviceInfo'

export default {
    name: 'Apply',
    data() {
        return {
            isAdminRole: '',
            filter:[],
            devices: [],
            isLoading: false,
            searchText: '',
            currentPage: 0,
            currentPageSize: 10,
            columns: [
                {
                    title: '设备名称',
                    key: 'devName',
                    sortable: true
                },
                {
                    title: '设备IP',
                    key: 'devIpAdd',
                    sortable: true
                },
                {
                    title: '设备角色',
                    key: 'deviceRole',
                    sortable: true
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
        }
    },
    //组件加载刷新
    created() {
        //只让管理员才能操作
        this.isAdminRole = Storage.get('isAdminRole')
        //表格信息从store里获取数据
        const deviceInfo = [...this.$store.state.deviceInfo].filter(a => a['deviceRole'] == 'Spine')
        this.devices = deviceInfo
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
        applyOptions() {
            this.isLoading = true
            const data = {
                deviceIp: this.devices.map(a => a.devIpAdd)
            }
            apiCover({
                url: 'ApplyBgpConfig',
                data,
                tips: '应用下发'
            })
            .then(res => {
                this.isLoading = false
            })
            .catch(err => {
                this.isLoading = false
            })
        }
    }
}   
</script>

<style lang="css" scoped>
    
</style>