<template>
    <div class="left-menu">
        <Menu 
            ref="menu"
            theme="light" 
            @on-select="linkTo" 
            :active-name="menuTab.active" 
            :open-names="[menuTab.open]">
            <Submenu 
                v-for="(item,index) of menu" 
                :key="item.name" 
                :name="index+1">
                <template slot="title">
                    <Icon :custom="item.icon" size="14" color="#A1A9B5"></Icon>
                    {{item.name}}
                </template>
                <MenuItem 
                    v-for="(subItem,subIndex) of item.subMenu" 
                    :key="subIndex"
                    :name="`${index+1}-${subIndex+1}`"
                    >{{subItem.name}}
                </MenuItem>
            </Submenu>
        </Menu>
    </div>
</template>

<script>
import Storage from '@/utils/Storage'
import LeftMenuConfig from './LeftMenu.config'

export default {
    data() {
        return {
            ...LeftMenuConfig
        }
    },
    created() { //每次加载组件都先从Storage里取出当前route，没有就为首页，然后转换成索引，让菜单展开和选中
        if(Storage.get('currentRoute')) {
            this.menuTab.open = this.getIndexFromRoute(Storage.get('currentRoute')).open
            this.menuTab.active = this.getIndexFromRoute(Storage.get('currentRoute')).active
        }
        else {
            this.menuTab.open = 1
            this.menuTab.active = '1-1'
        }
        
        //根据用户权限过滤出指定字符串的menu列表对象
        // const ruleList = ['拓扑管理', '拓扑图', '监控管理', '设备监控', '端口监控']
        // const hasRule = rule => ruleList.includes(rule)
        // let filterList = LeftMenuConfig.menu.map(a =>  {
        //     if(hasRule(a.name)) {
        //         const subMenu = a.subMenu.map(b => {
        //             if(hasRule(b.name)) return b
        //         }).filter(item => item != undefined) 
        //         return {...a, subMenu}
        //     }
        // }).filter(item => item != undefined)
        // console.log(filterList)
        // this.menu = filterList
    },
    watch: { //实时监测route来更改展开项和选中项
        $route(to,from) {
            const open = this.getIndexFromRoute(to.path).open
            const active = this.getIndexFromRoute(to.path).active
            this.menuTab.open = open
            this.menuTab.active = active
            this.$nextTick(() => {
                this.$refs.menu.updateOpened()
                this.$refs.menu.updateActiveName()
            })
        }
    },
    methods: {
        getIndexFromRoute(route) { //返回当前活跃索引、当前打开索引和当前活跃的subMenu的二级索引
            //通过route信息自动获取左侧菜单当前选中项
            const menu = this.menu
            let former = 0
            let latter = 0
            menu.forEach((mItem,mIndex) => {
                mItem.subMenu.forEach((subItem,subIndex) => {
                    if(route.includes(subItem.link)) {
                        former = mIndex + 1
                        latter = subIndex + 1
                    }
                })
            })
            return {active: `${former}-${latter}`, open: former, subIndex: latter}
        },
        linkTo(name) {
            const index = name.split('-')
            const fomerIndex = index[0] - 1
            const latterIndex = index[1] - 1
            const linkNme = this.menu[fomerIndex].subMenu[latterIndex].link
            //每点击一次左侧菜单触发路由变化就将当前route信息和左侧菜单已经点击过的信息存入Storage里
            const label = this.menu[fomerIndex].subMenu[latterIndex].name
            const existRoute = JSON.parse(Storage.get('existRoute')) || []
            const isLabelExist = existRoute.some(a => a.label == label)
            if(!isLabelExist) Storage.set('existRoute',JSON.stringify([...existRoute, ...[{label,link:linkNme}]]))
            Storage.set('currentRoute',linkNme)
            if(Boolean(linkNme)) {
                this.$router.push(linkNme)
            }
        }
    }
}
</script>

<style lang="css" src="@/UITheme/ColorTheme/white.css"></style>
