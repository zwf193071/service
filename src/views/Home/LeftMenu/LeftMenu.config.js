/**
 *  左侧菜单的配置模块 
 *      menuTab控制菜单展开项和激活项 
 *      menu为渲染的数据，包含name，icon和link。link为自定义字段，控制subMenu点击的路由
 */
export default {
    menuTab: {
        open: 1,
        active: '1-1'
    },
    menu :[
        {
            name: '系统概况',
            icon: 'iconfont icon-shebeigaikuang',
            subMenu: [
                {
                    name: '区域管理',
                    link: '/home/Region'
                }
            ]
        }
    ]
}