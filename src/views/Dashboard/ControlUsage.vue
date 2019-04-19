<!--
 * @Author: xuling
 * @Description: 波浪进度显示器
 * @Date: 2018-12-17 17:08:37
 * @LastEditTime: 2018-12-25 14:22:36
 * @LastEditors: 徐玲
 * @UpdateLogs: logs
 -->
<template> 
    <div class="control-usage">

        <Tabs v-if="hasTab" active-key="key1">
            <Tab-pane v-for="(item, i) of data" :label="item.title" :key="item.type">
                <div class="chart_content">
                    <div v-for="(loading, i) of item.data" class="chart_wrap_controller">
                        <div class="chart_wrap_controller--canvas">
                            <canvas :id="loading.id" ref="circle"></canvas>
                        </div>
                        <h4>{{loading.id}}</h4>
                        <p>已使用{{loading.usage}}</p>
                    </div>
                </div>
            </Tab-pane>
        </Tabs>
        
        <div v-else class="chart_content">
            <div v-for="(item, i) of data" class="chart_wrap_controller">
                <div class="chart_wrap_controller--canvas">
                    <canvas :id="item.type" ref="circle"></canvas>
                </div>
                <h4>{{item.type}}</h4>
                <p>已使用{{item.usage}}</p>
            </div>
        </div>
        
        
        
        
    </div>
</template>

<script>
import waveLoading from '@/libs/waveLoading/wave.js'
export default {
    name: "ControlUsage",
    props: {
        data: {
            type: Array,
            required: true
        },
        hasTab: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            controller: []
        }
    },
    mounted() {
        if(this.hasTab) {
            this.data.forEach((item, index) => {
                item.data.forEach((circle, i) => {
                    waveLoading.render({
                        target: circle.id,
                        lineWidth: 1,
                        speed: 0.05,
                        nowRange: parseInt(circle.usage)
                    })
                })
            })
        } else {
            this.data.forEach((item, index) => {
                waveLoading.render({
                    target: item.type,
                    lineWidth: 1,
                    speed: 0.05,
                    nowRange: parseInt(item.usage)
                })
            })
        }
    }
}
</script>

<style lang="css">
.control-usage .chart_content {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-top: 50px;
}
.chart_wrap_controller {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 14px;
}
.chart_wrap_controller--canvas {
    width: 200px;
    height: 200px;
    border: 1px solid #9AD5FF;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    overflow: hidden;
}
.chart_wrap_controller--canvas canvas {
    width: 100%;
    height: 100%;
}
.chart_wrap_controller h4 {
    color: rgba(0,0,0,0.85);
    font-weight: bold;
    margin-top: 24px;
}
.chart_wrap_controller p {
    color: rgba(0,0,0,0.65);
}
</style>