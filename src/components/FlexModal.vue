<!--
 * @Author: 陈晨
 * @Description: FlexModal组件
 * @Date: 2019-01-14 15:05:18
 * @LastEditTime: 2019-02-14 10:40:39
 * @LastEditors: 朱文芳
 * @UpdateLogs: 修改：1.增加自动校验功能；2.提交时返回表单数据
 -->

<template>
    <Modal 
        v-model="isShow" 
        transfer 
        :ok-text="okText" 
        :width="width+'px'" 
        :styles="styles"
        :closable="closable"
        :mask-closable="closable"
        >
        <p slot="header" style="font-size:16px">
            <span>{{data.title}}</span>
        </p>
        <Form
            ref="form"
            :model="formData"
            :rules="formValidator"
            label-position="left"
            :label-width="labelWidth"
        >
            <!--main-->
            <div 
                v-if="data.main.length>0"
                >
                <FormItem 
                    v-for="(main, i) of data.main" 
                    :key="`main-${i}`"
                    :prop="`main-${main.key}-${i}`"
                    :label="main.title || main.label">
                    <Select 
                        v-if="main.key == 'select'"
                        v-model="formData[`main-${main.key}-${i}`]" 
                        :clearable="main.clearable || false"
                        :multiple="main.multiple || false"
                        :disabled="main.disabled || false"
                        :placeholder="main.placeholder || '请选择'"
                        :style="main.style">
                        <Option 
                            v-for="item of main.item"
                            :key="item.label"
                            :value="item.value"
                            >{{item.label}}</Option>
                    </Select>
                    <Input 
                        v-if="main.key == 'input'"
                        v-model="formData[`main-${main.key}-${i}`]" 
                        :clearable="main.clearable || false"
                        :disabled="main.disabled || false"
                        :type="main.type || 'text'"
                        :placeholder="main.placeholder"
                        :style="main.style"
                    />
                </FormItem>
            </div>
            <!--children-->
            <div 
                class="inline-modal" 
                v-if="data.children.length>0"
                >
                <div 
                    class="modal-item"
                    v-for="(children, i) of data.children" 
                    :key="`children-${i}`">
                    <FormItem 
                        v-for="(child, j) of children.form" 
                        :key="`children-${i}-child-${j}`"
                        :prop="`children-${child.key}-${i}-${j}`"
                        :label="child.title || child.label">
                        <Select 
                            v-if="child.key == 'select'"
                            v-model="formData[`children-${child.key}-${i}-${j}`]" 
                            :clearable="child.clearable || false"
                            :multiple="child.multiple || false"
                            :disabled="child.disabled || false"
                            :placeholder="child.placeholder || '请选择'"
                            :style="child.style">
                            <Option 
                                v-for="item of child.item"
                                :key="item.label"
                                :value="item.value"
                                >{{item.label}}</Option>
                        </Select>
                        <Input 
                            v-if="child.key == 'input'"
                            v-model="formData[`children-${child.key}-${i}-${j}`]" 
                            :clearable="child.clearable || false"
                            :disabled="child.disabled || false"
                            :type="child.type || 'text'"
                            :placeholder="child.placeholder"
                            :style="child.style"
                        />
                    </FormItem>
                </div>
            </div>
        </Form>
        <div slot="footer">
            <slot name="footer">
                <Button type="text" size="large" @click="cancel">取消</Button>
                <Button type="primary" size="large" @click="submit">{{okText}}</Button>
            </slot>
        </div>
    </Modal>
</template>

<script>
/**
    1. 封装Modal和input，select的组件,分为main和children两部分，上方为main，下方children可以有多个，以children长度为个数依据
    2. 通过v-model来绑定modal是否出现，其余参数如下：
        closable  【Boolean】默认true，是否可关闭，通过右上角关闭按钮和Esc键
        okText   【String】默认‘确定’，modal框点击submit事件的按钮文本
        width   【Number】默认520，modal框宽度
        labelWidth   【Number】默认150，FormItem组件的label-width属性
        styles   【Object】默认为空，modal框的样式，与vue原生style属性一致   
    3. data必须为一个Object格式如下
        data: {
            title: '', Modal的名称，在左上角
            mian: [
                {
                    key: 'input/select'  判断input还是select的依据

                    *** input ***
                    label,  左侧input的标题
                    value,  input中绑定的value
                    type   input的类型，默认为text
                    placeholder input的placehoder
                    disabled  控制input是否可用，默认为false
                    clearable  是否可删除
                    hide  控制input是否隐藏，默认为false
                    style 样式对象，与vue原生的style一一致
                    default input默认绑定的值，可选，默认为空

                    *** select ***
                    title, 左侧select的标题
                    item: [
                        label, option中显示的内容
                        value  option中与label对应绑定的值
                    ],
                    default select默认绑定的值，可选，默认为空
                    clearable  是否可删除，只有单选模式生效
                    multiple   是否多选
                    placeholder  默认显示的文字内容
                    disabled 控制select是否可用，默认为false
                    hide  控制select是否隐藏，默认为false
                    style 样式对象，与vue原生的style一一致

                }
            ],
            children: [
                {
                    form: [ form表示FormItem部分
                        对象与main中对象一致
                    ]
                }
            ]
        }
        data中每个数组项对象都支持validate，validate默认为空数组，用于表单验证，格式如下：
 *                  validate： [
 *                      { 
 *                          required,  [boolean],验证是否必输入，默认为false
 *                          type,  [string],验证数据类型，默认为string，可选string，number，method(函数)，boolean，integer(整形)，float(浮点型)，array，object，date(Date对象)，url(网址字符串)和email(邮箱字符串)
 *                          message,  [string],验证失败的文本，默认为空字符串
 *                          trigger, [string],触发验证的条件，默认为change加blur，可选blur和change事件
 *                          len,  [number],验证长度必须为len，可选，默认不开启，无论type是什么类型，都默认调用length属性
 *                          min,  [number],验证长度最小为min，可选，默认不开启
 *                          max,  [number],验证长度最大为max，可选，默认不开启
 *                          validator  [function],自定义验证规则，可选，默认不开启，一旦开启，除了message和trigger，其余都失效。message和trigger会覆盖自定义函数配置
 *                                     函数支持异步调用。返回3个参数：
 *                                     validator: (rule, value, cb) => {
 *                                           // rule是当前规则对象，value是当前被验证的值，cb是个回调函数
 *                                           // 当验证通过，必须手动调用cb(),不传参，如果不通过，调用cb(Error),参数必须为一个Error对象
 *                                          if(value == 'alan') {
 *                                              cb()
 *                                          }
 *                                          else {
 *                                              cb(new Error('请输入正确的用户名'))
 *                                          }
 *                                      }
 *                      }
 *                  ]
    4. 点击ok-text按钮触发返回submit事件。
 */
export default {
    name: 'FlexModal',
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
            isShow: false,
            formData: {},
            formValidator: {}
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
    created() {
        this.init()
    },
    methods: {
        // 初始化组件的值，包括表单组件绑定的值，以及rules
        init() {
            this.data.main.forEach((a, i) => {
                const type = a.key
               // 每次初始化值，先取default，再取上次表单用户选中的值，如果都没有，则赋值为空
                const defaultVal = a.default || this.formData[`main-${type}-${i}`]
                const validator = a.validate || []
                
                if(type == 'select' && a.multiple) {
                    const val = defaultVal || []
                    this.$set(this.formData, `main-${type}-${i}`, val)
                }
                else if(type == 'switch') {
                    const val = defaultVal || false
                    this.$set(this.formData, `main-${type}-${i}`, val)
                }
                else {
                    const val = defaultVal || ''
                    this.$set(this.formData, `main-${type}-${i}`, val)
                }
                this.$set(this.formValidator, `main-${type}-${i}`, validator)
            })
            this.data.children.forEach((a, i) => {
                a.form.forEach((b, j) => {
                    const type = b.key
                    const defaultVal = b.default || this.formData[`children-${type}-${i}-${j}`]
                    const validator = b.validate || []
                    
                    if(type == 'select' && b.multiple) {
                        const val = defaultVal || []
                        this.$set(this.formData, `children-${type}-${i}-${j}`, val)
                    }
                    else if(type == 'switch') {
                        const val = defaultVal || false
                        this.$set(this.formData, `children-${type}-${i}-${j}`, val)
                    }
                    else {
                        const val = defaultVal || ''
                        this.$set(this.formData, `children-${type}-${i}-${j}`, val)
                    }
                    this.$set(this.formValidator, `children-${type}-${i}-${j}`, validator)
                })
            })
        },
        cancel() {
            this.isShow = false
        },
        submit() {
            const done = () => {
                this.isShow = false
            }
            
            const params = Object.entries(this.formData).map( (item, i) => {
                let label, value, type 
                type = item[0].split('-')[0]
                value = item[1]
                
                return { type, value }
            })

            this.$refs.form.validate( status => {
                const returnVal = { params, status }
                this.$emit('submit', returnVal, done)
            })
        }
    }
}  
</script>

<style lang="css" scoped>
 .inline-modal {
    display: flex;
    justify-content: space-between;
}
.modal-item {
    width: 48%;
    position: relative;
}
.modal-item:nth-of-type(2n-1) {
    margin-right: 4%;
    margin-left: 1%;
}
.modal-item:nth-of-type(2n-1)::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    right: -5%;
    width: 2px;
    height: 95%;
    background: #ddd;
}  
.ivu-form-item{
    margin-bottom: 24px;
} 
</style>