/*
    @author AlanChen
    1. 用来处理面板图canvas的插件，目前提供生成图片和显示toolTip提示框功能
    2. 使用new生成实例，只是预先绑定DOM生成一个canvas标签，然后初始化配置
    3. 实例有4个方法:
            init(String)
                参数为需要绑定的标签，格式为 .canvas 或 #canvas，与jq选择器一致
                
            setData(String | Array)
                参数为一个数组。数组项可以是string，可以是object，也可以是Array
                如果是Array，里面的数组必须是Object，必须包含src、position和zIndex等键值
                如果是Obejct，必须包含src、position和zIndex等键值
                如果是String，必须为src路径

                *** Array和Object可选传一个type值，只有type为port可以开启toolTip ***
                src为图片路径，label为图片的标题,label不传默认取当且src
                position和size分别有两个键值，position为{x,y}格式，size为{width,height}格式
                zIndex表示不同图片的层级关系，越小表示在最下面，不传默认都0
                如果需要开启toolTip，必须保证数据中有size和type两个键值，type必须为port！
                
                *** 此方法每调用一次就会刷新一次数据，重新绘制画布 ***

            setOptions(Object)
                参数为一个对象。目前只有toolTip一个键名配置，默认为false。
                true表示所有以Object传入的数据都会开启提示框功能，自动绑定type值为port的数据   
                
                *** 此方法只需要调用一次！但是必须在setData之前调用才能生效！ ***
           
            on(String,Function)
                参数一是原生event和二次封装的事件名称，例如： click、mouseover、contextmenu核dbclick等
                参数二是回调函数，形参为一个对象，包含当前所有data、event对象、当前选中data和当前的位置信息

                *** 插件封装了双击事件监听，事件名为dbclick，两次时间差在250ms内才触发 *** 
*/
export default  class DrawCanvas {
    constructor() {
        this.sourceData = {other:[],port:[]}
        this.AlltoolTip = false
    }
    init(DOM) {
        const wrap = document.querySelector(DOM) //传入的DOM
        const stage = document.createElement('div') //舞台DOM
        const width = Number.parseFloat(getComputedStyle(wrap)['width']) || 300
        const height = Number.parseFloat(getComputedStyle(wrap)['height']) || 150
        const canvas = document.createElement('canvas') //画布
        const tips = document.createElement('div') //tips提示框

        stage.style.cssText = 'width:100%;height:100%;position:relative;'
        canvas.width = width
        canvas.height = height
        canvas.innerHTML = '您的浏览器版本过低，请升级到IE10以上或使用Chrome浏览！'
        tips.style.cssText = `
                display:none;position:absolute;padding:5px;
                background:rgba(50,50,50,.7);
                border-radius:4px;color:#fff;font-size:14px;
                transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1)` 
                
        this.tips = tips
        this.stage = stage
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        
        stage.appendChild(canvas)
        stage.appendChild(tips)
        wrap.appendChild(stage)
    }
    setData(data) {
        this.sourceData = {other:[],port:[]}
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height) //每次调用都先清除画布

        const drawIMG = (data,num=0) => {
            const len = data.length
            const url = data[num].src
            const position = data[num].position
            const zIndex = data[num].zIndex
            //获取比当前zIndex小的所有数据，判断是否已经绘制完毕，这样可以避免画布图片层叠出错
            const preData = data.filter(a => a.zIndex<zIndex)
            const hasPreDataDrawed =  preData.length==0?true:preData.every(a => a._hasDrawed)
            if(hasPreDataDrawed) {
                const img = new Image()
                img.onload = () => {
                    // console.log('当前是第'+(num+1)+'次递归，'+'总共需要'+len+'次递归')
                    // console.log('图片加载完毕')
                    this.ctx.drawImage(img,position.x,position.y)
                    data[num]._hasDrawed = true
                    this.ctx.fill()
                    //只有当前图片绘制完毕才开始下一张图片，因为图片加载是异步，所以只能用递归，for是同步
                    if(num<len-1) {
                        drawIMG(data,++num)
                    }
                }
                img.src = url
            }
        }
        //处理数据到sourceData
        data.forEach(a => {
            if(typeof a == 'string') { //传入字符串
                const type = 'other'
                const info = {label:a,src:a,position:{x:0,y:0},zIndex:0,_hasDrawed: false}
                this.sourceData[type].push(info)
            }
            else if(Array.isArray(a)) { //传入数组，数组内是对象
                a.forEach((b) => {
                    const label = b.label || b.src 
                    const zIndex = b.zIndex || 0
                    const type = b.type == 'port'?'port':'other'
                    const info = {...b,...{label,zIndex,_hasDrawed: false}}
                    this.sourceData[type].push(info)
                })
            }
            else { //传入单个对象
                const label = a.label || a.src
                const zIndex = a.zIndex || 0
                const type = a.type == 'port'?'port':'other'
                const info = {...a,...{label,zIndex,_hasDrawed: false}}
                this.sourceData[type].push(info)
            }
        })
        //然后将soureData全部放入一个数组，并按照zIndex从小到大排序，调用drawIMG方法递归执行
        const drawData = [...this.sourceData.port,...this.sourceData.other].sort((a,b)=> a.zIndex - b.zIndex)
        drawIMG(drawData)

        if(this.AlltoolTip) {  //只要设置一次toolTip,每次更新数据都会自动绑定提示框
            const toolTipData = this.sourceData['port'] //根据type为port来区分是否需要提示框
            toolTipData.forEach(a => a.toolTip = true)
            this.toggleTips()
        }
    }
    setOptions({toolTip=false} = {}) {
        this.options = {toolTip}
        if(toolTip) { 
            this.AlltoolTip = true
        }
    }
    toggleTips() {
        const tips = this.tips //tips提示框
        this.stage.addEventListener('mousemove',(e) => {
            const toolTipData = this.sourceData['port'].filter(a => a.toolTip == true)
            //获取每个端口的大小来确定鼠标当前在哪个图片上以及tips显示范围
            tips.innerHTML = ''
            const moveX = e.offsetX
            const moveY = e.offsetY
            let index = toolTipData.findIndex(a => {
                const XCover = moveX >= a.position.x && moveX<= (a.position.x+a.size.width)
                const YCover = moveY >= a.position.y && moveY<= (a.position.y+a.size.height)
                return XCover && YCover
            })
            const isShowTips = index!=-1 && toolTipData[index] && toolTipData[index].toolTip//是否显示tips
            if(isShowTips) { //避免重复新建插入DOM，这里只操作DOM内容和样式
                tips.style.display = 'block'
                tips.innerHTML = toolTipData[index].label
                const tipsWidth = Number.parseFloat(getComputedStyle(tips)['width'])
                const tipsHeight = Number.parseFloat(getComputedStyle(tips)['height'])
                const isNearByBorderX = (this.canvas.width - moveX) <= tipsWidth //canvas x轴临界trriger
                const isNearByBorderY = (this.canvas.height - moveY) <= tipsHeight //canvas y轴临界trriger
                tips.style.top = isNearByBorderY? (moveY - tipsHeight - toolTipData[index].size.height) +'px': (moveY + toolTipData[index].size.height) + 'px'
                tips.style.left = isNearByBorderX? (moveX - tipsWidth - 10) +'px': (moveX + 10) +'px'
                this.stage.style.cursor = 'pointer'
            }
            else {
                tips.style.display = 'none'
                this.stage.style.cursor = 'default'
            }
        })
    }
    on(eType,cb) {
        const handler = (event) => {
            const x = event.offsetX
            const y = event.offsetY
            const sourceData = this.sourceData
            const toolTipData = this.sourceData['port'].filter(a => a.toolTip == true)
            let index = toolTipData.findIndex(a => {
                const XCover = x >= a.position.x && x<= (a.position.x+a.size.width)
                const YCover = y >= a.position.y && y<= (a.position.y+a.size.height)
                return XCover && YCover
            })
            const targetData = toolTipData[index] || ''
            cb && cb({poniter:{x,y},event,sourceData,targetData})
        }
        const bindHandler = eType => {
            this.stage.addEventListener(eType,(event) => {
                handler(event)
            })
        }
        if(eType == 'dbclick') {
            let num = 0
            let preTime,latterTime
            const timeBorder = 250 //两次点击的时间差边界
            this.stage.addEventListener('click',(event) => {
                num++
                if(num == 1) {
                    preTime = new Date() *1
                }
                else if(num == 2) {
                    latterTime = new Date() *1
                    if(latterTime-preTime <= timeBorder) {
                        handler(event)
                    }
                    num = 0
                    preTime = 0
                    latterTime = 0
                }
            })
        }
        else {
            bindHandler(eType)
        }
    }
}