<!--
 * @Author: 陈晨
 * @Description: 表单编辑组件
 * @Date: 2019-01-11 09:42:30
 * @LastEditTime: 2019-02-14 14:54:37
 * @LastEditors: 陈晨
 * @UpdateLogs: 1.新增是否显示编辑icon功能
 -->
<template>
    <div class="ListCard">
        <Card>
            <div slot="title" class="text--left">
                <span class="vertical--middle title">{{source.title}}</span>
                <a 
                    v-show="!isShowEditBtn" 
                    @click="toggleEditBtn">
                    <Icon type="md-create" v-if="showIcon" :size="24" class="vertical--middle" />
                </a>
                <div v-show="isShowEditBtn" class="editBtn">
                    <Button 
                        size="small" 
                        type="dashed" 
                        @click="isShowEditBtn=false;isComplete=true">取消</Button>
                    <Button 
                        size="small" 
                        type="primary" 
                        @click="saveConfig">保存</Button>
                </div>
            </div>
            <div slot="extra" 
                v-if="source.helpInfo" 
                @click="toggleHelpInfo" 
                class="tips--btn">
                <Icon 
                    type="md-information-circle" 
                    color="#47cb89" 
                    :size="20" 
                    class="vertical--middle" />
                <span class="vertical--middle">帮助</span>
            </div>
            <p 
                v-show="source.helpInfo && isToggleInfo" 
                class="helpInfo">{{source.helpInfo}}
            </p>
            
            <div class="table table--title">
                <span
                    v-for="item of headTitle"
                    :key="item"
                    class="cell">{{item}}</span>
            </div>
            <div class="table"
                v-for="(item,i) of source.data"
                :key="i">
                <p class="cell">{{item.label}}</p>
                <div class="cell">
                    <Input 
                        v-model="item.start"
                        :disabled="isComplete"
                        style="width:80px"/>
                    <div class="cell_line"></div>
                    <Input 
                        v-model="item.end"
                        :disabled="isComplete"
                        style="width:80px"/>
                </div>
            </div>
        </Card>
    </div>
</template>

<script>
/**
    component: 集成input功能的卡片组件。支持表单组件输入绑定
    使用：
        props：
            1. source 【对象】，必选。
               source可选title、helpInfo等键，必选data键
                    * title和helpInfo为字符串,idata为数组
                    * title为卡片标题，helpInfo为卡片帮助信息，通过帮助按钮toggle显示
                    * data格式为 [ 
                        {label: '标题', start: '', end: ''},   //label为input标题，start和end必填，为空字符串，用于绑定input
                    ]
            2. showIcon 【布尔值】，可选，默认为true。是否显示编辑icon。
        EmitEvent 
            1. saveConfig 自定义事件，回调出去的参数为当前整个卡片填入的信息
    注意：
        1. source中data数组项的start和ende必选，用来绑定表单的输入值。而且数组项内可以添加任意的key，最终都会在saveConfg的返回的参数内
 */
 export default {
    props: {
        source: {
            type: Object,
            required: true
        },
        showIcon: {
            type: Boolean,
            default: true,
        }
    },
    data() {
        return {
            isToggleInfo: false,
            isShowEditBtn: false,
            isComplete: true,
            headTitle: ['类别','区段']
        }
    },
    methods: {
        toggleEditBtn() {
            this.isShowEditBtn = true
            this.isComplete = false
        },
        toggleHelpInfo() {
            this.isToggleInfo = !this.isToggleInfo
        },
        saveConfig() {
            this.isShowEditBtn = false
            this.isComplete = true
            const result = this.source.data
            this.$emit('saveConfig',result)
        }
    }
 }   
</script>

<style lang="css" scoped>
i {
    cursor: pointer;
}
.text--left {
    text-align: left;
}
.vertical--middle {
    vertical-align: middle;
} 

.title {
    font-size: 18px;
    color: #666;
    margin-right: 5px;
}
.editBtn {
    display: inline-block;
}
.tips--btn {
    margin-top: -14px;
    margin-right: -22%;
    padding: 14px 5px;
    cursor: pointer;
}
.tips--btn:hover{
    background: #ccc;
}
.helpInfo {
    margin-bottom: 12px;
    text-align:left;
    text-indent: 1em;
}
.table {
    display: flex;
    justify-content: space-around;
    margin-bottom: 8px;
    width: 100%;
}
.table--title {
    padding-bottom: 6px;
    margin-bottom: 10px;
    border-bottom: 2px solid #ccc;
    color: #999;
}
.cell {
    width:40%;
    text-align: left;
}
.cell_line {
    display: inline-block;
    margin-top: -3px;
    width: 10px;
    height: 2px;
    background: #ccc;
}
</style>