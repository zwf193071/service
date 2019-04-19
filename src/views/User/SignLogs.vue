<template>
    <div class="SignLogs">
        <Card :bordered="false">
            <h2 slot="title">登录日志列表</h2>
            <div slot="extra" style="display:flex;marginTop:-5px">
                <Input 
                    v-model="searchText"
                    style="width: 177px;margin-right: 20px;"
                    placeholder="搜索...">
                    <Button icon="ios-search" slot="prepend" />
                </Input>
                <Button 
                    :loading="isLoading" 
                    style="margin-right: 10px;"
                    @click="refresh" 
                    icon="refresh"
                    type="success"
                    >刷新</Button>
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

export default {
    name: 'SignLogs',
    data() {
        return {
            filter:[],
            log: [],
            isLoading: false,
            searchText: '',
            currentPage: 0,
            currentPageSize: 10,
            columns: [
                {
                    title: '用户名',
                    key: 'userName',
                    sortable: true
                },
                {
                    title: '用户IP',
                    key: 'userIp',
                    sortable: true
                },
                {
                    title: '登录时间',
                    key: 'loginTime',
                    sortable: true
                },
                {
                    title: '登出时间',
                    key: 'logoutTime',
                    sortable: true
                },
            ]
        }
    },
    computed: {
        filterDevices() {
            //先根据搜索字符模糊匹配数据
            const filter = this.log.filter(item => {
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
        this.getLogs()
    },
    methods: {
        //加载所有登录日志信息
        getLogs(cb) {
            this.isLoading = true
            api('GetSignLogs')
                .then(res => {
                    this.$nextTick(() => {
                        this.isLoading = false
                        this.log = res.data
                        cb && cb()
                    })
                })
                .catch(() => {
                    this.$Message.error({
                        content: '数据加载失败！'
                    })
                    this.isLoading = false
                })
        },
        //按钮点击刷新
        refresh() {
            this.getLogs(() => {
                 this.$Message.success({
                    content: '数据加载成功！'
                })
            })
        },
        //切换页码
        changePage(num) {
            this.currentPage = num -1
        },
        //切换页数
        changePageSize(num) {
            this.currentPageSize = num 
        }
    }
}    
</script>

<style lang="css">
</style>