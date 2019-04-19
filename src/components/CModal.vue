<template>
    <div class="CModal">
        <Modal 
            v-model="isShow" 
            :ok-text="okText" 
            :width="width+'px'" 
            :styles="styles"
            :closable="closable"
            :mask-closable="closable"
            @on-ok="submit">
            <p slot="header" style="font-size:16px">
                <span>{{data.title}}</span>
            </p>
            <Form 
                v-if="!$slots.default"
                label-position="left"  
                :label-width="labelWidth">
                <!--switch 开关-->
                <FormItem
                    v-if="data.switch.length>0 && !iswitch.hide" 
                    v-for="(iswitch, i) of data.switch"
                    :key="i"
                    :label="iswitch.title">
                    <i-switch v-model="iswitch.result" :size="iswitch.size">
                        <span slot="open">{{iswitch.label && iswitch.label[0]}}</span>
                        <span slot="close">{{iswitch.label && iswitch.label[1]}}</span>
                    </i-switch>
                </FormItem>
                <!--select 下拉框-->
                <FormItem 
                    v-if="data.select.length>0 && !select.hide" 
                    v-for="select of data.select"
                    :key="select.title"
                    :label="select.title">
                    <Select 
                        v-model="select.result"
                        :clearable="select.clearable || false"
                        :multiple="select.multiple || false"
                        :disabled="select.disabled || false"
                        :placeholder="select.placeholder || '请选择'"
                        :style="select.style">
                        <Option 
                            v-for="item of select.item"
                            :key="item.value"
                            :value="item.value"
                            >{{item.label}}</Option>
                    </Select>
                </FormItem>
                <!--input 输入框-->
                <FormItem 
                    v-if="data.input.length>0 && !input.hide"
                    v-for="input of data.input"
                    :key="input.label"
                    :label="input.label">
                    <Input 
                        v-model="input.value"
                        :clearable="input.clearable || false"
                        :disabled="input.disabled || false"
                        :type="input.type || 'text'"
                        :placeholder="input.placeholder"
                        :style="input.style"
                    />
                    <!--input框内inline的input或者select-->
                    <div 
                        v-if="input.inline"
                        v-for="(inline, i) of input.inline"
                        :key="`${input.label}-${i}`"
                        style="display:inline-block;margin-left: 5px;">
                        <Input 
                            v-if="inline.key == 'input'"
                            v-model="inline.value"
                            :clearable="inline.clearable || false"
                            :disabled="inline.disabled || false"
                            :type="inline.type || 'text'"
                            :placeholder="inline.placeholder"
                            :style="inline.style"
                        />
                        <Select 
                            v-if="inline.key == 'select'"
                            v-model="inline.result"
                            :clearable="inline.clearable || false"
                            :multiple="inline.multiple || false"
                            :disabled="inline.disabled || false"
                            :placeholder="inline.placeholder || '请选择'"
                            :style="inline.style">
                            <Option 
                                v-for="item of inline.item"
                                :key="item.value"
                                :value="item.value"
                                >{{item.label}}</Option>
                        </Select>
                    </div>
                </FormItem>
            </Form>
            <slot v-if="$slots.default"></slot>
            <div slot="footer" v-if="$slots.footer">
                <slot name="footer"></slot>
            </div>
        </Modal>
    </div>
</template>

<script>
/**
    1. 封装Modal和input，select,radio以及switch的组件
    2. 通过v-model来绑定modal是否出现，其余参数如下：
        closable  【Boolean】默认true，是否可关闭，通过右上角关闭按钮和Esc键
        okText   【String】默认‘确定’，modal框点击submit事件的按钮文本
        width   【Number】默认520，modal框宽度
        labelWidth   【Number】默认150，FormItem组件的label-width属性
        styles   【Object】默认为空，modal框的样式，与vue原生style属性一致   
    3. data必须为一个Object格式如下
        data: {
            title, Modal的名称，在左上角
            input: [  input框的集合
                {   
                    label,  左侧input的标题
                    value,  input中绑定的value
                    type   input的类型，默认为text
                    placeholder input的placehoder
                    disabled  控制input是否可用，默认为false
                    clearable  是否可删除
                    hide  控制input是否隐藏，默认为false
                    style 样式对象，与vue原生的style一一致
                    inline (Array[Object])  
                        和input组件显示在一行的input或者select，注意主input.style.width必须设置,否则input默认为宽度100%。
                        inline数组内数组项对象格式与input和select一致，label或title不需要。
                        格式如下：
                            inline: [
                                {key: 'input', value: '', placeholder: '单位', style:{width: '100px'}},
                                {key: 'select', item: [{label: 'alan', value: 'alan'}], result: '', placeholder: '请选择名称', style:{width: '100px'}}
                            ]
                },
            ],
            select: [
                {
                    title, 左侧select的标题
                    item: [
                        label, option中显示的内容
                        value  option中与label对应绑定的值
                    ],
                    result  select最终被选中的value,单选状态为字符串，多选状态必须为数组
                    clearable  是否可删除，只有单选模式生效
                    multiple   是否多选
                    placeholder  默认显示的文字内容
                    disabled 控制select是否可用，默认为false
                    hide  控制select是否隐藏，默认为false
                    style 样式对象，与vue原生的style一一致
                }
            ],
            switch: [
                {
                    title,  switch左侧的名称
                    label,  【Array | String】开关的名称
                    result,  switch最终被选中的value 
                    size     开关大小，可选large，default和small
                }
            ]
        }
    4. 点击ok-text按钮触发返回submit事件。
    5. slot有dafault和footer，使用方法与Modal一致 default会覆盖掉原有的表单组件

 */
export default {
    props: {
        value: { //用于自定义表单组件v-model双向绑定，名称必须为value
            type: Boolean,
            default: false
        },
        closable: {
            type: Boolean,
            default: true
        },
        okText: {
            type: String,
            default: '确定'
        },
        width: {
            type: Number,
            default: 520
        },
        labelWidth: {
            type: Number,
            default: 150
        },
        styles: {
            type: Object
        },
        data: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            isShow: false
        }
    },
    watch: { //通过两个监听，使父子组件中的两个v-model保持同步
        value(val) {
            this.isShow = val
        },
        isShow(val) {
            this.$emit('input', val) 
        }
    },
    methods: {
        submit() {
            this.$emit('submit')
        }
    }
}
</script>

<style lang="css" scoped>

</style>