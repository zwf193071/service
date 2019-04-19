<template>
    <div class="topBar topBar--background">
        <div class="left_area">
            <img class="vertical-middle left_area_img" style="margin-top: 6px;" src="~@/assets/image/telecom.png" />
            <span class="left_area_desc"></span>
        </div>
        <div class="right_area" @click="logOut">
            <Tooltip content="点击退出登录">
                <span class="username vertical-middle">{{userName}}</span>
                <Icon 
                    custom="iconfont icon-tuichu"
                    style="font-size: 16px;" 
                    class="vertical-middle"
                />
            </Tooltip>
        </div>
    </div>   
</template> 

<script>
import { api, apiCover } from '@/api/index'
import Storage from '@/utils/Storage'
import DateFormat from '@/utils/DateFormat'

export default {
    computed: {
        userName() {
            return Storage.get('userName')
        }
    },
    methods: {
        logOut() {
            api({
                url: 'Logout'
            })
            .then(res => {
                const code = res.data.code
                if(code == '0000') {
                    //登陆时间必须从Storage里取
                    const loginTime = DateFormat('', new Date(Storage.get('loginTime')))
                    const logoutTime = DateFormat()
                    console.log(`登入时间是：${loginTime};登出时间是：${logoutTime}`)
                    this.$Notice.success({
                        title: '提示',
                        desc: '成功退出登录'
                    })
                    Storage.clear() //登出时清除localstorage
                    this.$router.push('/')
                }
                else {
                    this.$Notice.error({
                        title: '提示',
                        desc: '网络异常！退出登录失败'
                    })
                }
            })
            .catch(err => {
                this.$Notice.error({
                    title: '提示',
                    desc: '网络异常！退出登录失败'
                })
            })
        }
    }
}
    
</script>

<style lang="css" src="@/UITheme/ColorTheme/white.css"></style>
<style lang="css" scoped>
.topBar{
    padding: 9px 50px 11px 35px;
    overflow: hidden;
    color:#fff;
}
.top::before{
    content:'';
    display:block;
    width:0;
    height:0;
    clear:all;
}
.left_area{
    float: left;
}
.left_area_img {
    width: 160px;
    height: 18px;
}
.left_area_title{
    display:inline-block;
    margin-left:10px;
    font-size:22px;
    font-weight:bold;
}
.left_area_desc{
    display:inline-block;
    font-size:14px;
}
.right_area{
    float:right;
    cursor:pointer;
}
.username{
    margin-right: 10px;
    font-size: 16px;
}
.vertical-middle{
    vertical-align: middle;
}
</style>