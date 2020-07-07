<template>
  <div class="cont">
    <section class="chart-item">
      <el-select v-model="value2" placeholder="请选择" size="mini" @change="checkScope($event)">
        <el-option
          v-for="item in options2"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          id="input"
        ></el-option>
      </el-select>
      <div class="text">A点至B节点压差系数变化曲线</div>
      <div id="waterPressure1" style="width: 100% ;height:100%;margin:5px"></div>
    </section>
    <section class="chart-item">
      <div class="text">A点至B节点压差系数变化曲线</div>
      <div id="waterPressure2" style="width: 100% ;height:100%;margin:5px"></div>
    </section>
    <section class="chart-item">
      <div class="text">A点至B节点压差系数变化曲线</div>
      <div id="waterPressure3" style="width: 100% ;height:100%;margin:5px"></div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import echarts from "echarts";

import chart from '@/utils/chart'

export default {
  name: "waterPressure",
  data() {
    return {
      waterPressChart1: {},
      waterPressChart2: {},
      waterPressChart3: {},
      options2: [
        {
          value: "选项1",
          label: "用水管道"
        },
        {
          value: "选项2",
          label: "暖气管道"
        }
      ],
      value2: ""
    };
  },
  mounted() {
    this.waterPress();
    this.onresize();
    window.onresize = () => {
      console.log('window---');
      this.onresize();
    };
  },
  methods: {
    checkScope(e) {
      console.log(e)
      console.log(this.value2)
    },
    // Echart自适应图表
    onresize() {
      this.waterPressChart1.resize();
      this.waterPressChart2.resize();
      this.waterPressChart3.resize();
    },
    // 水压分析表
    waterPress() {
      
      this.waterPressChart1 = echarts.init(
        document.getElementById("waterPressure1")
      );
      this.waterPressChart2 = echarts.init(
        document.getElementById("waterPressure2")
      );
      this.waterPressChart3 = echarts.init(
        document.getElementById("waterPressure3")
      );
      // this.waterPressChart.resize()
      // let option = {
      //   color: ['#fbc459'],
      //   grid: {
      //     top: '5%',
      //     bottom: '5%',
      //     left: '2%',
      //     right: '2%'
      //   },tooltip: {
      //     trigger: "axis",
      //     axisPointer: {
      //       type: "none"
      //     }
      //   },
      //   xAxis: {
      //     type: "category",
      //     boundaryGap: false,
      //     show: false,
      //     data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      //   },
      //   yAxis: {
      //     type: "value",
      //     show: false
      //   },
      //   series: [
      //     {
      //       data: [0, 0.3, 0.3, 0.4, 0.6, 0.3, 0.3],
      //       type: "line",
      //       markLine: {
      //         data: [
      //           { type: "max", name: "最大值",symbolOffset:[100,0] },
      //           { type: "min", name: "最小值" }
      //         ]
      //       }
      //     }
      //   ]
      // };
      let xLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      let values = [0, 0.3, 0.3, 0.4, 0.6, 0.3, 0.3]
      let option = chart.waterPressLineChartOption(xLabels,values)

      this.waterPressChart1.setOption(option);
      this.waterPressChart2.setOption(option);
      this.waterPressChart3.setOption(option);
    }
  }
};
</script>
<style lang="scss" scoped>
.cont {
  height: 100%;
}
.chart-item {
  // height: 33%;
  width: 100%;
  padding-bottom: 20px;
}
.chart-item .text {
  padding: 15px 0;
}
.chart-item .el-select {
  width: 100px;
  z-index: 1;
}
#waterPressure1, #waterPressure2, #waterPressure3 {
  height: 100%;
  width: 100%;
  border: 1px solid #3c576f;
}
</style>
<style>
.cont .el-input__inner {
  background: none;
  border-radius: 0px;
  border: 1px solid #3c576f;
  color: #9aafca;
}
</style>