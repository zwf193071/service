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
            isAdminRole:false
        }
    },
    //组件加载刷新
    created() {
        this.isAdminRole = Boolean(Storage.get('isAdminRole'))
        // this.getDevices()
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
            // this.isLoading = true
            // apiCover({
            //     url: 'GetAllPodElement',
            //     tips: '区域管理查询'
            // })
            // .then(res => {
            //     this.isLoading = false
            //     if(res.type == 'success') {
            //         this.devices = res.data
            //     } else {
            //         this.devices = []
            //     }
                
            // })
            // .catch(err => {
            //     this.isLoading = false
            // })
        }
    }
}    
</script>