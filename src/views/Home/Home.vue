<template>
    <div class="home">
        <Layout :style="{minHeight: '100vh'}">
            <TopBar />
            <Layout>
                <Sider 
                    :width="240" 
                    :style="{position: 'relative', height: 'calc(100vh - 44px)', left: 0, overflow: 'auto'}">
                    <LeftMenu />
                </Sider>
                <Layout>
                    <Content class="content">
                        <router-view class="content--inner" />
                    </Content>
                    <Footer class="content--footer">Copyright &copy; 2018  浪潮思科网络科技有限公司 版权所有</Footer>
                </Layout>
            </Layout>
        </Layout>
    </div>
    
</template>

<script>

import { api, apiCover } from '@/api/index'

import TopBar from '@/views/Home/TopBar'
import LeftMenu from '@/views/Home/LeftMenu/LeftMenu'

export default {
    name: 'Home',
    components: {
        TopBar,
        LeftMenu
    },
    //一加载主组件就获取设备信息到store里，方便后面所有组件使用siteNmae和siteIP
    created() {
        // apiCover({
        //     url: 'GetAllDevice'
        // })
        // .then(res => {
        //     if(res.type == 'success') {
        //         const data = res.data
        //         this.$store.commit('resetDeviceInfo',data)
        //     }
        // })
    }
}    
</script>

<style lang="css" scoped>
.content{
    box-sizing: border-box;
    padding:15px;
    background: #F6F7F9;
}
.content--inner{
    /*height: calc(100vh - 66px - 80px - 46px);去掉了tagLink的高度*/
    height: calc(100vh - 44px - 65px);
    background:#fff;
}
.content--footer {
    padding: 0;   
    height: 35px;
    line-height: 20px;
    background: #F6F7F9;
    color: rgba(0, 0, 0, .3);  
}
</style>