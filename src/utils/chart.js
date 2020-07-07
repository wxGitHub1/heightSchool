/**
 * 构件图表控件option
 * @param {*} title  图表标题
 * @param {*} legend 图例说明 数组
 * @param {*} xLables x轴label 数组
 * @param {*} values 值数组
 */
var getWaterLineChartOption = (title,legend,xLables,values) =>{
    let option = {
        title: {
          text: title,
          textStyle: {
            color: "#7f97bd"
          },
          left: "10%"
        },
        color: ["#da6ef1", "#fac555"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          right: "center",
          bottom: 0,
          icon: "rect",
          itemWidth: 14,
          itemGap: 25,
          textStyle: {
            color: "#7f97bd"
          },
          data: legend
        },
        grid: {
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: "#4a6883"
              }
            },
            data: xLables
          }
        ],
        yAxis: [
          {
            axisLine: {
              lineStyle: {
                color: "#4a6883"
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#25394b"
              }
            },
            type: "value",
            boundaryGap: ["0%", "20%"]
          }
        ],
        series: values
      }
      return option
}

/**
 * 获取用水量颜色配置数组
 */
var waterLineChartColors = () =>{
    let colors = [
        {
          lineStyle: {
            opacity: 0.2,
            lineStyle: {
              color: "#da6ef1"
            }
          },
          areaStyle: {
            opacity: 0.5,
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#da6ef1"
                },
                {
                  offset: 0.7,
                  color: "rgba(218,110,241,0.1)"
                },
                {
                  offset: 1,
                  color: "rgba(218,110,241,0)"
                }
              ]
            }
          }
        },
        {
          lineStyle: {
            opacity: 0.2,
            lineStyle: {
              color: "#fac555"
            }
          },
          areaStyle: {
            opacity: 0.5,
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#fac555"
                },
                {
                  offset: 0.7,
                  color: "rgba(250,196,88,0.1)"
                },
                {
                  offset: 1,
                  color: "rgba(250,196,88,0)"
                }
              ]
            }
          }
        }
      ]

      return colors
}

/**
 * 获取用水量柱状图
 * @param {*} title 
 * @param {*} xLabels 
 * @param {*} values 
 */
var getWaterBarChartOption = (title,xLabels,values) => {
    let option = {
        dataZoom: [
          {
            type: "slider",
            show: true,
            textStyle: {
              color: "#7f97bd"
            },
            yAxisIndex: [0],
            right: "4%",
            start: 0, //数据窗口范围的起始百分比
            end: 36
          },
          {
            type: "inside",
            yAxisIndex: [0],
            start: 0,
            end: 36
          }
        ],
        title: {
          text: title,
          textStyle: {
            color: "#7f97bd"
          },
          left: "10%"
        },
        color: ["#fbc459", "#43c6f7"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          // left: '0%',
          // top: 0,
          // right: "10%",
          bottom: 0,
          containLabel: true
        },
        xAxis: {
          type: "value",
          show: false
        },
        yAxis: {
          type: "category",
          inverse: true,
          axisLine: {
            show: false,
            lineStyle: {
              color: "#7f97bd"
            }
          },
          axisTick: {
            show: false
          },
          data: xLabels
        },
        series: [
          {
            name: "用水量",
            type: "bar",
            barWidth: 10,
            barGap: 0.2,
            // barWidth: 10, //柱宽度
            // barGap: 50 /*多个并排柱子设置柱子之间的间距*/,
            // barCategoryGap: 10 /*多个并排柱子设置柱子之间的间距*/,
            label: {
              normal: {
                show: true,
                position: "right",
                textStyle: {
                  color: "white"
                }
              }
            },
            data: values
          }
        ]
      }
      return option
}

var waterPressLineChartOption = (xLabels,values) => {
    let option = {
        color: ['#fbc459'],
        grid: {
          top: '5%',
          bottom: '5%',
          left: '2%',
          right: '2%'
        },tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "none"
            }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          show: false,
          data: xLabels
        },
        yAxis: {
          type: "value",
          show: false
        },
        series: [
          {
            data: values,
            type: "line",
            markLine: {
              data: [
                { type: "max", name: "最大值",symbolOffset:[100,0] },
                { type: "min", name: "最小值" }
              ]
            }
          }
        ]
      }
      return option
}
export default {
    getWaterLineChartOption,
    waterLineChartColors,
    getWaterBarChartOption,
    waterPressLineChartOption
}