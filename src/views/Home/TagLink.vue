<template>
    <div class="TagLink">
        <div class="TagWrap" ref="tagContainer">
            <div class="TagScroll" :style="tagScroll" ref="tagScroll">
                <Tag 
                    class="Tag"
                    v-for="(tag,i) of tags"
                    :key="i"
                    type="dot" 
                    checkable
                    :checked="tag.isChecked"
                    :closable="!tag.unclosable" 
                    :color="tag.isChecked?'primary':'default'"
                    :name="tag.link"
                    @on-change="ActiveTag"
                    @on-close="DeleteTag">{{tag.label}}</Tag>
            </div>
        </div>
        <div class="TagLink_btn">
            <p @click="closeAllTags">
                <Tooltip content="关闭所有标签">
                    <Icon type="md-trash" size="24" color="#999" class="cursor--p" />
                </Tooltip>
            </p>
            <!--<Button type="dashed" @click="fullScreen">点击全屏</Button>-->
        </div>
    </div>
</template>

<script>
import Storage from '@/utils/Storage'

export default {
    name: 'TagLink',
    data() {
        return {
            tags: [
                {label: '拓扑图', link: '/home/TopoLinks', unclosable: true, isChecked: true}
            ],
            tagScroll: {
                transform: `translate3d(0px,0px,0px)`
            },
            activeTagIndex: 0
        }
    },
    created() { //加载组件先从Storage读取当前route和已存在existRoute，没有就默认为首页
        const currentRoute = Storage.get('currentRoute')
        const existRoute = JSON.parse(Storage.get('existRoute'))
        if(currentRoute && existRoute) {
            existRoute.forEach(item => {
                const isTagExist = this.tags.some(tag => tag.link == item.link)
                if(!isTagExist) {
                    const newTag = {label: item.label, link: item.link, isChecked: false}
                    this.tags.push(newTag)
                }
            }) 
            this.tags.forEach(a => {
                a.isChecked = a.link == currentRoute?true:false
            })
        }
    },
    watch: { 
        tags(val) { //监测tag数组，实时改变外层tagScroll容器的宽度，因为IE不支持width的max0content属性！！！！
            this.$nextTick(() => {
                const nowTagDOM = [...document.querySelectorAll('.Tag')]
                const len = nowTagDOM.length

                //实测，数组的splice操作并不会实时在nextTick获取到最新DOM！
                const validTagDOM = val.length == len
                                ? nowTagDOM
                                : nowTagDOM.slice(0,len-1)

                const tagScrollWidth = validTagDOM.reduce((total,a) => {
                    return total + a.offsetWidth + 4
                },0)
                this.$refs.tagScroll.style.width = tagScrollWidth + 'px'
            })
        },
        $route(to,from) { //实时监测route来更改标签的活跃状态
            const isTagExist = this.tags.some(a => a.link == to.path)
            const existRoute = JSON.parse(Storage.get('existRoute'))
            const link = Storage.get('currentRoute')
            const currentRouteItem = existRoute && existRoute.find(a => a.link == link)

            if(!isTagExist) { //先判断是否存在该route的标签，没有才添加新的route标签
                const newTag = {label: currentRouteItem.label, link, isChecked: false}
                this.tags.push(newTag)
            }
            this.tags.forEach((a, b) => {
                if(a.link == link) {
                    a.isChecked = true
                    this.activeTagIndex = b
                }
                else {
                    a.isChecked = false
                }
            })
        },
        activeTagIndex() { //监测当前激活状态标签的索引来判断是否开启动画，包含标签点击操作和左侧菜单点击操作
            
            //必须要在nextTick操作，因为涉及到数据更新之后操作DOM。否则DOM不会确保及时更新
            this.$nextTick(() => {
                const wrapWidth = Number.parseFloat(getComputedStyle(this.$refs.tagContainer)['width'])
                const scrollWidth = Number.parseFloat(getComputedStyle(this.$refs.tagScroll)['width'])
                const translateWidth = scrollWidth >= wrapWidth? scrollWidth - wrapWidth: 0
                const activeIndex = this.activeTagIndex
                const needTagScroll = translateWidth>0 && activeIndex>=this.tags.length/1.8? true: false 
                // console.log(`容器宽：${wrapWidth}，滚动层宽：${scrollWidth}，是否需要位移：${needTagScroll}，需要位移：${translateWidth}`)
                
                // console.log(`${activeIndex}/${this.tags.length} ===== ${needTagScroll}`)
                if(needTagScroll) { //当标签超出容器宽度并且当前点击索引超过所有标签索引一半即开启动画滚动
                    this.tagScroll.transform = `translate3d(${-translateWidth}px,0px,0px)`
                }
                else { //否则开启动画回到初始位置
                    this.tagScroll.transform = `translate3d(0px,0px,0px)`
                }
            })
        }
    },
    methods: {
        ActiveTag(checked, link) { //动态切换标签开关状态并跳转路由
            const activeTag = this.tags.find(a => a.link == link)
            const hasChecked = activeTag.isChecked

            if(!hasChecked) { //只有点击非激活的标签才执行逻辑
                this.tags.forEach((a, b) => {
                    if(a == activeTag) {
                        a.isChecked = true
                        this.activeTagIndex = b
                    }
                    else {
                        a.isChecked = false
                    }
                })
                this.$router.push(link)
                Storage.set('currentRoute', link) //同步更改Storage中当前route的值
            }
        },
        DeleteTag(event, link) { //删除标签，同步删除Storage里点击过的标签数据
            const index = this.tags.findIndex(a => a.link == link)
            this.tags.splice(index,1)

            const len = this.tags.length
            this.activeTagIndex = len - 1
            this.tags.forEach((a,b) => {
                a.isChecked = b==len-1? true: false
            })

            const currentRoute = this.tags[len-1].link
            const existRoute = JSON.parse(Storage.get('existRoute'))
            const delIndex = existRoute.findIndex(a => a.link == link)
            this.$router.push(currentRoute)
            existRoute.splice(delIndex, 1) //删除对应标签的Storage列，然后刷新Storage数据
            Storage.set('existRoute', JSON.stringify(existRoute))
            Storage.set('currentRoute', currentRoute) //同步更改Storage中当前route的值
        }, 
        closeAllTags() { //清除所有标签，清除Storage存在的tags，改变当前route为默认首页
            this.tags = this.tags.slice(0,1)
            this.activeTagIndex = 0
            this.$router.push(this.tags[0].link)

            Storage.set('currentRoute', this.tags[0].link)
            Storage.remove('existRoute')
        },
        fullScreen() { //全屏按钮功能
            const  launchFullscreen = (element) => {
                if(element.requestFullscreen) {
                    element.requestFullscreen();
                } else if(element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if(element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                } else if(element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
            }
            launchFullscreen(document.documentElement)
        }
    }
}
</script>

<style lang="css" scoped>
.TagLink {
    padding: 5px;
    width: 100%;
}
.TagWrap {
    float: left;
    width: 80%;
    height: 100%;
    overflow: hidden;
}
.TagScroll {
    /*width: max-content; 因为IE不支持，所以只能用nowrap和js动态改变宽度来hack效果*/
    text-align: left;
    white-space: nowrap;
    transition: transform .25s ; 
}  
.Tag {
    display: inline-block;
    box-sizing: border-box;
}
.TagLink_btn {
    margin-top: 6px;
    margin-right: 20px;
    float: right;
    width: 18%;
}
.cursor--p {
    cursor: pointer;
}
</style>