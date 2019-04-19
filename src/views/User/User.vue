<template>
    <div class="User" ref="wrap">
        <Card :bordered="false">
            <h2 slot="title">用户</h2>
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
                    @click="getUser(true)" 
                    icon="md-refresh"
                    type="success"
                    >刷新</Button>
                <Button 
                    v-if="isAdminRole"
                    @click="showAddModal" 
                    icon="md-add"
                    type="success"
                    >用户添加</Button>
            </div>
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
                :page-size-opts="[10,25,50,100]"
                @on-change="changePage"
                @on-page-size-change="changePageSize"
            />
            <!--添加或修改设备modal-->
            <Modal 
                v-model="isModal" 
                ok-text="提交" 
                @on-ok="clickModalEvent" 
                :styles="{top:'60px'}" >
                <p slot="header" style="font-size:16px">
                    <span>{{modalStatus=='add'?'添加':'修改'}}用户</span>
                </p>
                <Form label-position="left"  :label-width="100">
                    <FormItem 
                        :label="item.label"
                        v-for="item of modalItem" 
                        :key="item.label">
                        <Input 
                            :type="item.type || 'text'" 
                            v-model="item.value" 
                            :disabled="item.disabled" 
                            style="width:300px" />
                    </FormItem>
                    <FormItem :label="roleList.title">
                        <Select 
                            v-model="roleList.result" 
                            :disabled="roleList.disabled" 
                            style="width:300px">
                            <Option 
                                v-for="role of roleList.item"
                                :key="role.value"
                                :value="role.value">{{role.label}}</Option>
                        </Select>
                    </FormItem>
                </Form>
            </Modal>
        </Card>
    </div>
</template>

<script>
import { api, apiCover } from '@/api/index'
import isFilter from '@/utils/IsFilter'
import Storage from '@/utils/Storage'

export default {
    name: 'User',
    data() {
        return {
            isAdminRole: '',
            wrapDOM: null,
            filter:[],
            //添加修改用户的参数
            modalItem: [
                {
                    label: '用户名',
                    value: '',
                    disabled: false
                },
                {
                    label: '密码',
                    value: '',
                    type: 'password',
                    disabled: false
                },
                {
                    label: '确认密码',
                    value: '',
                    type: 'password',
                    disabled: false
                }
            ],
            modalStatus: 'add',//控制显示增加用户还是修改用户的modal内容填充
            roleList: {
                title: '角色',
                item: [],
                result: '',
                disabled: false //控制role是否可选
            },
            userData: '', // 后台获取到的当前行用户信息
            user: [], //用户信息列表
            isLoading: false,
            isModal: false,
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
                    title: '角色',
                    key: 'description',
                    sortable: true
                },
                {
                    title: '状态',
                    key: 'online'
                }
            ]
        }
    },
    computed: {
        filterDevices() {
            //先根据搜索字符模糊匹配数据
            const filter = this.user.filter(item => {
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
            const operation = [{
                title: '操作',
                render: (h, params) => {
                    const del = [
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    const userId = params.row.userId
                                    this.deleteUser(userId)
                                }
                            }
                        }, '删除')
                    ]
                    const modify = [
                        h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small'
                            },
                            style:{
                                marginRight: '10px'
                            },
                            on: {
                                click: () => {
                                    const userData = params.row
                                    this.showEditModal(userData)
                                }
                            }
                        }, '修改')
                    ]
                    //根据userName动态return不同的render函数,保证admin用户不可被删除
                    if(params.row.userName == 'admin') {
                        return h('div', [
                            ...modify
                        ])
                    }
                    else {
                        return h('div', [
                            ...modify,
                            ...del
                        ])
                    }
                }
            }]
            return this.isAdminRole?[...this.columns,...operation]:this.columns
        },
        tableHeight() {
            return this.wrapDOM?Number.parseFloat(getComputedStyle(this.wrapDOM)['height'])-150 :0
        }
    },
    //组件加载刷新
    created() {
        //只让管理员才能操作
        this.isAdminRole = Storage.get('isAdminRole')
        //预先获取所有可以选择的用户角色级别
        apiCover({
            url: 'GetUserRoleList'
        })
        .then(res => {
            if(res.type == 'success') {
                this.roleList.item = res.data.map(a => {
                    const label = a.description
                    const value = a.id
                    return { label, value }
                })
            }
        })
        this.getUser()
    },
    mounted() {
        this.wrapDOM = this.$refs.wrap
    },
    methods: {
        //加载所有用户信息
        getUser(flag) {
            this.isLoading = true
            const tips = flag
                        ? '用户信息加载'
                        : ''
            apiCover({
                url: 'GetAllUserInfo',
                data: {},
                tips
            })
            .then(res => {
                this.isLoading = false
                if(res.type == 'success') {
                    this.user = res.data.map(a => {
                        const online = a.online == 0 ?'在线':'离线'
                        return {...a, online}
                    })
                    //每次刷新数据就对比当前用户是否为管理员，然后写入storage
                    const currentUser = Storage.get('userName')
                    const isCurrentUserAdminRole = this.user.filter(a => a.userName == currentUser)[0].role == 'admin'? true: ''
                    Storage.set('isAdminRole', isCurrentUserAdminRole)
                    console.log('当前用户是否为管理员:'+ Boolean(isCurrentUserAdminRole))
                    //实时改变当且用户权限，只让管理员才能操作
                    this.isAdminRole = isCurrentUserAdminRole
                }
            })
            .catch(() => {
                this.isLoading = false
            })
        },
        //获取添加用户、修改用户的参数，并且验证是否有效、是否重复、是否为空,有默认参数
        checkDataEffective(opt = ['userName','passWord','roleId']) {
            const name = this.modalItem[0].value
            const roleStatus = this.roleList.result
            const pass = this.modalItem[1].value
            const confimrPassword = this.modalItem[2].value
            //两次验证密码是否相等且验证密码不为空
            const isPasswordCorrect = confimrPassword.trim() != '' && (confimrPassword == pass)
            const data = {
                [opt[0]]: name,
                [opt[1]]: pass,  
                [opt[2]]: roleStatus
            }
            const isDataParamNull = Object.values(data).some(a => Boolean(a) == false)
            const isNameRepeat = this.user.some(a => a.userName == name)
            return {
                data,
                isPasswordCorrect,
                isDataParamNull,
                isNameRepeat
            }
        },
        //Modal点击确认按钮的操作逻辑
        clickModalEvent() {
            if(this.modalStatus == 'add') {
                this.addUser()
            }
            else if(this.modalStatus == 'edit') {
                this.upateUserConfig()
            }
        },
        //弹出添加用户modal
        showAddModal() {
            this.isModal=true
            //将moadal状态变为add添加用户
            this.modalStatus = 'add'
            //重置modal的状态
            this.modalItem[0].disabled = false
            this.roleList.disabled = false
            //清空当前用户所有的信息
            this.modalItem.forEach(a => a.value='')
            this.roleList.result =  ''
        },
        //添加用户请求后台接口
        addUser() {
            //提交后台的参数、密码验证条件和参数是否为空条件
            const data = this.checkDataEffective().data
            const isPasswordCorrect = this.checkDataEffective().isPasswordCorrect
            const isDataParamNull = this.checkDataEffective().isDataParamNull
            const isNameRepeat = this.checkDataEffective().isNameRepeat
            
            //参数不为空
            if(!isDataParamNull) {
                //name不重复
                if(!isNameRepeat) {
                    //两次密码相同
                    if(isPasswordCorrect){
                        console.log(data)
                        apiCover({
                            url: 'AddUserInfo',
                            data,
                            tips: '添加用户'
                        })
                        .then(res => {
                            //添加用户城后重新加载所有用户信息
                            this.getUser()
                        })
                        .catch(err => {
                            console.log(err)
                        })
                    }
                    else {
                        //两次密码不相同
                        this.$Message.error({
                            content: '两次密码不相同,请重新输入!'
                        })
                    }
                }
                else {
                    //两次密码相等但是名称重复
                    this.$Message.error({
                        content: '您输入的名称已存在,请重新输入!'
                    })
                }
            }
            else {
                //参数为空
                this.$Message.error({
                    content: '参数不能为空!'
                })
            }
        },
         //点击操作按钮弹出modal，并根据用户名称来决定role权限
        showEditModal(userData) {
            //将modal状态变为edit修改用户信息
            this.modalStatus = 'edit'
            this.isModal = true
            this.modalItem[0].disabled = true //不可修改用户名
            if(userData.userName == 'admin') {  //当用户是admin时，不可修改权限
                this.roleList.disabled = true
            }
            else {
                this.roleList.disabled = false //当用户不是admin时，可修改权限
            }
            //自动填入当前用户原有的信息
            this.modalItem[0].value = userData.userName
            this.modalItem[1].value = userData.password || ''
            this.modalItem[2].value = userData.password || ''
            this.roleList.result =  userData.roleId
            this.userData = userData
        },
        //修改用户信息,提交数据给后台
        upateUserConfig() {
            //提交后台的参数、密码验证条件和参数是否为空条件
            const data = {...this.checkDataEffective().data, userRoleId: this.userData.userRoleId.toString(), userId: this.userData.userId.toString()}
            const isPasswordCorrect = this.checkDataEffective().isPasswordCorrect
            const isDataParamNull = this.checkDataEffective().isDataParamNull

            //参数不为空
            if(!isDataParamNull) {
                //两次密码相同
                if(isPasswordCorrect){
                    apiCover({
                        url: 'EditUserConfig',
                        data,
                        tips: '修改用户'
                    })
                    .then(res => {
                            //添加用户后重新加载所有用户信息
                            this.getUser()
                    })
                    .catch(err => {
                        console.log(err)
                    })
                }
                else {
                    //两次密码不相同
                    this.$Message.error({
                        content: '两次密码不相同,请重新输入!'
                    })
                }
            }
            else {
                //参数为空
                this.$Message.error({
                    content: '参数不能为空!'
                })
            }
        },
        //切换页码
        changePage(num) {
            this.currentPage = num -1
        },
        //切换页数
        changePageSize(num) {
            this.currentPageSize = num 
        },
        //删除用户
        deleteUser(userId) {
            this.$Modal.confirm({
                title: '删除提醒',
                content: '是否删除用户？',
                closable: true,
                onOk: () => {
                    apiCover({
                        url: 'DeleteUserInfo',
                        data: { userId },
                        tips: '用户删除'
                    })
                    .then(res => {
                        //提交后台删除数据，然后前端数据也同步删除
                        this.getUser()
                    })
                    .catch(err => {
                        console.log(err)
                    })
                }
            })
        }
    }
}    
</script>

<style lang="css">
</style>