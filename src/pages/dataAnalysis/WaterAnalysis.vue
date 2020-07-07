<template>
  <el-container>
      <div id="item_1">
        <!-- <el-select v-model="checkValue" placeholder="请选择" size="mini" @change="checkScope($event)">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            id="input"
          ></el-option>
        </el-select> -->
        <div id="electricAnalysis"></div>
        <div class="switch">
          <span :class="{active:index==1}" @click="index=1">本月</span>
          <span :class="{active:index==2}" @click="index=2">今日</span>
        </div>
        <div class="sort" @click="Zsort=!Zsort">
          <div v-show="Zsort">
            <i class="iconfont icon-arrow-to-bottom"></i>正序
          </div>
          <div v-show="!Zsort">
            <i class="iconfont icon-arrow-to-top"></i>倒序
          </div>
        </div>
        <div id="energyUse"></div>
      </div>
  </el-container>
</template>

<script>
// import axios from "axios";
import echarts from "echarts";
import { setInterval } from "timers";

import { getChart} from '@/api/gis'

import chart from '@/utils/chart'

export default {
  name: "waterAnalysis",
  data() {
    this.axios.defaults.baseURL = "http://114.116.49.149:9080/api";
    return {
      Zsort: true,
      index: 1,
      electChart: "",
      myChart: "",
      item: 1,
      options: [
        {
          value: "选项1",
          label: "全校"
        },
        {
          value: "选项2",
          label: "全区"
        }
      ],
      checkValue: ""
    };
  },
  computed: {

  },
  mounted() {
    this.energyUse();
    this.echartInit();
    this.onresize();
    window.onresize = () => {
      console.log("window---");
      this.onresize();
    };
  },
  methods: {
    checkScope(e) {
      console.log(e)
      console.log(this.checkValue)
    },
    // Echart自适应图表
    onresize() {
      this.electChart.resize();
      this.myChart.resize();
    },
    // 折线图
    echartInit() {
      this.electChart = echarts.init(
        document.getElementById("electricAnalysis")
      );
      let option = {};
      let elcSeries = [];
      let waterSeries = [];
      let energyChart = [];
      
      let colors = chart.waterLineChartColors()
      let params = {
          energyType: 1,
          isIncludeBusiness: true
        }
      getChart(params)
      .then(res =>{
        energyChart = res.Data;
        energyChart.Month.forEach((item, index) => {
          elcSeries.push({
            name: item.Name,
            data: item.Value,
            type: "line",
            symbol: "rect",
            lineStyle: colors[index].lineStyle,
            areaStyle: colors[index].areaStyle
          });
        })

        option = chart.getWaterLineChartOption("用水趋势",energyChart.Type, energyChart.Time,elcSeries)
        this.electChart.setOption(option);
      })
    },
    // 柱状图
    energyUse() {
      this.myChart = echarts.init(document.getElementById("energyUse"));
      let option;
      let energyByArea = [];
      let series = [];

      this.axios({
        url: "MonitoringHall/AnalyzeEnergyByArea",
        method: "get"
      })
        .then(res => {
          // console.log(res.data.Data);
          energyByArea = res.data.Data
          let xLabels = ["#1教学楼",
                "#2教学楼",
                "#3教学楼",
                "#4教学楼",
                "#5教学楼",
                "#6教学楼",
                "#7教学楼",
                "#8教学楼",
                "#9教学楼",
                "#10教学楼",
                "#1公寓楼",
                "#2公寓楼",
                "#3公寓楼",
                "#4公寓楼",
                "#5公寓楼",
                "#6公寓楼"]

          let values = [
                  100,
                  95,
                  90,
                  89,
                  85,
                  80,
                  79,
                  75,
                  70,
                  69,
                  65,
                  60,
                  59,
                  55,
                  50,
                  49,
                  45,
                  40,
                  39,
                  35,
                  30,
                  29,
                  25,
                  20,
                  18,
                  16,
                  14,
                  12,
                  10,
                  8,
                  7,
                  6,
                  5
                ];

          option =  chart.getWaterBarChartOption('建筑用水量',xLabels,values)
          this.myChart.setOption(option);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
#item_1 {
  position: relative;
  width: 100%;
  height: 100%;
}
#item_1 .el-select {
  width: 100px;
  position: absolute;
  right: 10%;
  z-index: 1;
}
#electricAnalysis, #energyUse {
  width: 100%;
  height: 50%;
}
.switch {
  position: absolute;
  // background: #409eff;
  right: 20%;
  color: #9aafca;
  border: 1px solid #495b83;
  z-index: 1;
  width: 100px;
  word-spacing: -4px;
}
.sort {
  position: absolute;
  right: 10%;
  color: #9aafca;
  border: 1px solid #495b83;
  z-index: 1;
  width: 50px;
  height: 20px;
  line-height: 20px;
  cursor: pointer;
}
.sort i {
  width: 20px;
  display: inline-block;
  font-size: 12px;
}
.switch span {
  display: inline-block;
  width: 50%;
  line-height: 20px;
  text-align: center;
}
.switch span:hover {
  background: #495b83;
  color: #409eff;
  cursor: pointer;
}
.switch span.active {
  background: #495b83;
  color: #409eff;
}
</style>
<style>
#item_1 .el-input__inner {
  background: none;
  border-radius: 0px;
  border: 1px solid #3c576f;
  color: #9aafca;
}
</style>  

