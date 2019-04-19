<!--
 * @Author: 陈晨
 * @Description: 表单编辑组件
 * @Date: 2019-01-11 09:42:30
 * @LastEditTime: 2019-02-14 14:54:27
 * @LastEditors: 陈晨
 * @UpdateLogs: 1.新增是否显示编辑icon功能
 -->
<template>
    <div class="FormCard">
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
            <!--input-->
            <div class="card_input">
                <div 
                    class="inputItem"
                    :style="inputStyle"  
                    v-if="source.input"
                    v-for="item of source.input" 
                    :key="item.label">
                    <p class="text--left label">{{item.label}}</p>
                    <Input 
                        v-model="item.value" 
                        :disabled="isComplete"
                        :placeholder="item.placeholder || ''"
                        />
                </div>
            <!--select-->  
                <div 
                    class="inputItem"
                    :style="inputStyle" 
                    v-if="source.select"
                    v-for="select of source.select" 
                    :key="select.title">
                    <p class="text--left label">{{select.title}}</p>
                    <Select 
                        v-model="select.result" 
                        :multiple="select.multiple"
                        :disabled="isComplete"
                        transfer>
                        <Option 
                            v-for="subItem of select.item" 
                            :value="subItem.value" 
                            :key="subItem.value"
                            >{{ subItem.label }}</Option>
                    </Select>
                </div>
            <!--checkbox-->
                <div 
                    class="inputItem text--left"
                    :style="inputStyle"  
                    v-if="source.checkbox"
                    v-for="item of source.checkbox" 
                    :key="item.label">
                    <Checkbox 
                        v-model="item.value"
                        :disabled="isComplete"
                        >{{item.label}}</Checkbox>
                </div>
            </div>
        </Card>
    </div>
</template>

<script>
/**
    component: 集成input、select和checkbox等功能的卡片组件。支持表单组件输入绑定
    使用：
        props：
            1. source 【对象】，必选。
               source可选title、helpInfo、flex、input、select和checkbox等键。
                    * title和helpInfo为字符串,input、checkbox和select均为数组
                    * title为卡片标题，helpInfo为卡片帮助信息，通过帮助按钮toggle显示，flex为卡片布局，默认是每行2列
                    * input格式为 [ 
                        {label:'',value:'',placeholder:''}   //label为input标题，value为input框输入值,placeholder为input提示语
                    ]
                    * select格式为[
                        title: '',                  //title为select标题
                        item: [                     //option的内容和value
                            {label:'',value:''}
                        ],
                        multiple: true/false        //可选，是否开启多选模式,默认false
                        result：‘’或[]              //单选模式为字符串，当开启多选模式必须为数组，默认选中项
                    ]
                    * checkbox格式为[
                        {label:'',value:''}       //label为checkbox的文本label，value为绑定的状态，true或false
                    ]
            2. showIcon 【布尔值】，可选，默认为true。是否显示编辑icon。
        EmitEvent 
            1. saveConfig 自定义事件，回调出去的参数为当前整个卡片填入的信息
    注意：
        1. input、select和checkbox内的value必选，用来绑定表单的输入值。而且数组项内可以添加任意的key，最终都会在saveConfg的返回的参数内
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
            isComplete: true
        }
    },
    computed: {
        inputStyle() {
            const len = this.source.flex || 2
            const width = `${90/len}%`
            const marginRight = `${10/len}%`
            return {width, marginRight}
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
            const input = this.source.input && [...this.source.input] || []
            const select = this.source.select && [...this.source.select].map(a => a.result) || []
            const checkbox = this.source.checkbox && [...this.source.checkbox] || []
            const result = {input,select,checkbox}
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
.card_input {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
}
.inputItem {
    margin-bottom: 20px;
}
/*.inputItem:nth-of-type(3n) {
    margin-right: 0;
}*/
.label {
    font-size: 12px;
    color: #9e9e9e;
}
</style>