<template>
    <div class="sign">
        <div class="sign_bg">
            <img class="sign_logo" src="~@/assets/image/logo.png" />
            <div class="sign_content">
                <div class="sign_canvas"></div>
                <div class="login_box">
                    <div class="login_box_inner">
                        <div class="login_box_title">
                            <p class="box_title_item"> <strong>浪潮智能云引擎(ICE)</strong></p>
                            <p class="box_title_item font-14">Inspur Intelligent Cloud Engine</p>
                        </div>
                        <div class="login_box_body">
                            <Input
                                v-model.trim="account"
                                placeholder="请输入用户名"
                                size="large"
                                clearable
                                ref="account"
                                @on-enter="toPassword"
                                class="input_item"
                            />
                            <Input
                                v-model.trim="password"
                                placeholder="请输入密码"
                                size="large"
                                type="password"
                                clearable
                                ref="password"
                                @on-enter="login"
                                class="input_item"
                            />
                            <Button @click="login" type="primary" long size="large">登 录</Button>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
    </div>     
</template>

<script>
import { api, apiCover } from '@/api/index'
import Storage from '@/utils/Storage'
import lottie from 'lottie-web'

const TARGET_ROUTERPATH = '/home/Region' // 登陆成功跳转的路由

export default {
    name:'Login',
    data() {
        return {
            account: '',
            password: '',
            canRouterGo: false
        }
    },
    mounted() {
        lottie.loadAnimation({
            container: document.querySelector('.sign_canvas'),
            enderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'static/data.json'
        })
    },
    //操作路由离开前逻辑
    beforeRouteLeave(to, from, next) {
        //只有通过正确请求登录接口才能跳转页面
        if(to.path == TARGET_ROUTERPATH && this.canRouterGo){
            console.log('router leave success')
            next()
        }else{
        //否则禁止任何路由跳转
            console.log('router leave fail')
            next(false)
        }
    },
    methods: {
        //验证是否为空，返回一个promise。如果不为空则then一个promise，否则catch对应字符串
        checkLogin(account,password) {
            const isValueNull = () => {
                if(account) {
                    if(password) {
                        return true
                    }
                    else {
                        return 'noPassword'
                    }
                }
                else {
                    return 'noAccount'
                }
            }
            return new Promise((resolve,reject) => {
                if(isValueNull() === true) {
                    resolve()
                }else{
                    reject(isValueNull())
                }
            })
        },
        //当在用户名input时按enter切换到密码input聚焦
        toPassword() {
            this.$refs.account.blur()
            this.$refs.password.focus()
        },
        login() {
            this.checkLogin(this.account,this.password)
                .then(() => {
                    const data = {
                        userName: this.account,
                        passWord: this.password 
                    }
                    //请求接口，根据不同返回状态给出相应的提示
                    api({
                        url: 'Login',
                        data
                    })
                    .then( res => {
                        const code = res.data.code
                        
                        if(code == '0000'){
                            this.$Notice.success({
                                title: '登陆提示',
                                desc: '登录成功！'
                            })
                            
                            const loginTime = new Date()
                            const isAdminRole = res.data.data.userInfo.role == 'admin' ? true: ''
                            //将登陆时间,活跃时间,用户名称和用户权限存入storage
                            const storageData = {
                                loginTime,
                                activeDate: loginTime,
                                userName: data.userName,
                                isAdminRole
                            }
                            Storage.set(storageData)

                            this.canRouterGo = true  //开启路由跳转权限
                            this.$router.push(TARGET_ROUTERPATH)
                            this.canRouterGo = false  //页面跳转完毕关闭路由跳转权限
                        }
                        else {
                            this.$Notice.error({
                                title: '登陆提示',
                                desc: res.data.errMsg
                            })
                        }
                    })
                    .catch( error => {
                        console.log(error.response)
                        console.log(error.message)
                        this.$Notice.error({
                            title: '登陆提示',
                            desc: '登陆失败！'
                        })
                    })
                })
                .catch(err => {
                    const msg = err =='noAccount'?'用户名为空！':'密码为空！'
                    if(!this.password){
                        this.$Notice.error({
                            title: '登陆提示',
                            desc: msg
                        })
                    }
                })
        }
    }
} 
</script>

<style lang="css" scoped>
.sign{
    width:100%;
    height:100vh;
    overflow:hidden;
    background: -webkit-linear-gradient(left, #4ABFFF, #3733E4);
    background: -o-linear-gradient(right, #4ABFFF, #3733E4);
    background: -moz-linear-gradient(right, #4ABFFF, #3733E4);
    background: linear-gradient(to right, #4ABFFF, #3733E4);
}
.sign_bg {
    width:100%;
    height:100vh;
    overflow:hidden;
    padding: 10% 0;
    background-image: url('~@/assets/image/bg.png');
    background-position: 55% 20%;
    background-size: 70% 70%;
}
.sign_logo{
    position: absolute;
    left: 135px;
    top: 63px;
    width: 144px;
    height: 27px;
}
.sign_content {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.sign_canvas{
    float: left;
    width: 65%;
    height: 80%;
}
.login_box{
    float: right;
    margin-top: 60px;
    width: 35%;
    height: 370px;
}
.login_box_inner {
    /*margin: auto;*/
    width: 55%;
}
.login_box_title{
    margin-bottom: 24px;
    color: #fff;
}
.box_title_item{
    font-size: 20px;
    /*font-weight: bold;*/
}
.font-14{
    font-size: 14px !important;
}
.input_item{
    margin-bottom: 24px;
}

</style>
