<template>
    <div class="WhiteList" ref="wrap">
        <Card :bordered="false">
            <h2 slot="title">
                <Button 
                    :loading="isLoading" 
                    style="position: absolute;left:1%"
                    @click="getIpLists(true)" 
                    icon="md-refresh"
                    type="success"
                    >刷新</Button>
                白名单
            </h2>
            <div slot="extra" style="display:flex;marginTop:-5px">
                <Input 
                    v-model="searchText"
                    style="width: 177px;margin-right: 20px;"
                    placeholder="搜索...">
                    <Button icon="ios-search" slot="prepend" />
                </Input>

                <Button 
                    v-if="isAdminRole"
                    style="margin-right: 10px;"
                    @click="isModal = true" 
                    icon="md-checkbox-outline"
                    type="success"
                    >添加</Button>
                <Button 
                    v-if="isAdminRole"
                    style="margin-right: 10px;"
                    @click="delWhiteList" 
                    icon="ios-trash"
                    type="success"
                    >删除</Button>
            </div>
            <Table
                ref="table"
                :height="tableHeight"
                :stripe="true"
                :columns="showColumns"
                :data="showDevices"
                :loading="isLoading"
                @on-selection-change="selectTableItem"
                @on-row-click="rowClick"
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
            <FormModal 
                v-model="isModal"
                :data="modal"
                :width="400"
                @submit="insertWhiteList"
            />
        </Card>
    </div>
</template>

<script>
import { api, apiCover } from '@/api/index'
import isFilter from '@/utils/IsFilter'
import Storage from '@/utils/Storage'
import RegExpRule from '@/utils/RegExpRule'

import FormModal from '@/components/FormModal'

export default {
    name: 'WhiteList',
    components: {
        FormModal
    },
    data() {
        return {
            isAdminRole: '',
            wrapDOM: null,
            filter:[],
            tableSelection: [],
            ipList: [],
            isLoading: false,
            isModal: false,
            modal: {
                title: '添加白名单',
                form: [
                    {key: 'input', label: '起始ip', value: '', clearable: true},
                    {key: 'input', label: '结束ip', value: '', clearable: true, placeholder: '不填会默认填充为起始ip'}
                ]
            },
            searchText: '',
            currentPage: 0,
            currentPageSize: 10,
            columns: [
                {
                    title: 'IP地址',
                    key: 'ip',
                    sortable: true
                }
            ]
        }
    },
    computed: {
        filterDevices() {
            //先根据搜索字符模糊匹配数据
            const filter = this.ipList.filter(item => {
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
            const checkbox = {
                type: 'selection',
                width: 60,
                align: 'center'
            }
            return this.isAdminRole? [checkbox, ...this.columns]: this.columns
        },
        tableHeight() {
            return this.wrapDOM?Number.parseFloat(getComputedStyle(this.wrapDOM)['height'])-150 :0
        }
    },
    //组件加载刷新
    created() {
        //只让管理员才能操作
        this.isAdminRole = Storage.get('isAdminRole')
        this.getIpLists()
    },
    mounted() {
        this.wrapDOM = this.$refs.wrap
    },
    methods: {
        //加载所有登录日志信息
        getIpLists(flag = false) {
            this.isLoading = true
            const tips = flag? '白名单获取': ''

            apiCover({
                url: 'GetWhiteList',
                tips
            })
            .then(res => {
                this.isLoading = false
                if(res.type == 'success') {
                    this.ipList = res.data
                }
                else {
                    this.ipList = []
                }
            })
            .catch(err => {
                this.isLoading = false
            })
        },
        //单击表格复选框选中表格行，多选
        selectTableItem(selection,row) {
            this.tableSelection = selection
        },
        //单击表格行，让复选框被选中然后动态更新当前被选中的数据
        rowClick(row, index) {
            this.$refs.table.toggleSelect(index) //调用table组件中的方法
            const selection = this.$refs.table.getSelection() //调用table组件中的方法
            this.tableSelection = selection
        },
        //切换页码
        changePage(num) {
            this.currentPage = num -1
        },
        //切换页数
        changePageSize(num) {
            this.currentPageSize = num 
        },
        // 添加白名单
        insertWhiteList(returnVal, done) {
            const startIp = returnVal[0].value
            const endIp = returnVal[1].value
                          ? returnVal[1].value
                          : startIp
            const startIpArea = startIp.split('.').slice(0, 3).join('.')
            const endIpArea = endIp.split('.').slice(0, 3).join('.')

            const isIPvalid = RegExpRule.isIP(startIp) && RegExpRule.isIP(endIp)
            const isIPInCommonArea = startIpArea === endIpArea

            if(isIPvalid) {
                if(isIPInCommonArea) {
                    done()
                    this.isLoading = true
                    apiCover({
                        url: 'AddWhiteList',
                        data: { startIp, endIp },
                        tips: '白名单添加'
                    })
                    .then(res => {
                        this.isLoading = false
                        if(res.type == 'success') {
                            this.getIpLists()
                        }
                    })
                    .catch(err => {
                        this.isLoading = false
                    })
                }
                else {
                    this.$Message.warning({
                        content: '起始ip和结束ip必须保证在同一网段，请重新输入',
                        duration: 4
                    })
                }
            }
            else {
                this.$Message.warning({
                    content: '起始ip和结束ip必须为有效ip地址，请重新输入',
                    duration: 4
                })
            }
        },
        // 删除白名单
        delWhiteList() {
            const id = this.tableSelection.map(a => a.id)
            const canBeDelete = id && id.length>=1

            if(canBeDelete) {
                this.$Modal.confirm({
                    title: '删除提醒',
                    content: '是否删除选中ip？',
                    closable: true,
                    onOk: () => {
                        apiCover({
                            url: 'DeleteWhiteList',
                            data: {id},
                            tips: 'ip删除'
                        })
                        .then(res => {
                            if(res.type == 'success') {
                                this.getIpLists()
                            }
                        })
                    }
                })
            }
            else {
                this.$Message.warning({
                    content: '请至少选中一条数据操作'
                })
            }
        }  
    }
}    
</script>

<style lang="css">
</style>