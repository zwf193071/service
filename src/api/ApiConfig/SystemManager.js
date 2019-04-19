/**
 * @description 系统管理接口
 */
export default {
    //登录
    Login: {
        url: 'login/login'
    },
    Logout: {
        url: 'login/logout'
    },
    //用户
    GetAllUserInfo: {
        url: 'user/getUserList'
    },
    AddUserInfo: {
        url: 'user/insertUser'
    },
    DeleteUserInfo: {
        url: 'user/deleteUser'
    },
    EditUserConfig: {
        url: 'user/updateUser'
    },
    GetUserRoleList: { // 获取所有可以选择的用户角色级别
        url: 'role/getRoleList'
    },
    // 白名单
    GetWhiteList: {
        url: 'whiteList/getWhiteList'
    },
    AddWhiteList: {
        url: 'whiteList/insertWhiteList'
    },
    DeleteWhiteList: {
        url: 'whiteList/deleteWhiteList'
    },
}