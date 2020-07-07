<template>
  <div class="content-r right content-r-active">
    <div class="map">
      <!-- 室外 -->
      <div id="container"></div>
      <div class="menu-b">
        <div class="menu-b-head" @click="show=!show">
          <i class="iconfont margin-r-10 icon-shixindiqiu"></i>
          <span>专题图管理</span>
          <i class="iconfont right" :class="show?'icon-xiajiantou':'icon-shouqishangjiantou-'"></i>
        </div>

        <!-- <div class="menu-b-body" v-if="show">
          <div
            class="menu-b-item"
            v-for="(menub,index) in menuBlist"
            :key="index"
            @click="activeFunc(menub,index)"
          >
            <span class="frame" :class="{active:menub.mbActive}"></span>
            {{menub.name}}
          </div>
        </div> -->

        <div class="menu-b-body" v-if="show">
          <div class="checkbox-group" v-for="item in mapLayers" :key="item.id">
            <el-checkbox v-model="item.check" @change="handleCheckedChange(item)">
              <img :src="getImgUrl(item.icon)" />
              {{item.name}}
            </el-checkbox>
          </div>
        </div>
      </div>
      <div class="menu-l-dw">
        <i class="iconfont icon-target-lock"></i>
        <div class="dw-title display-n">中心点</div>
      </div>
      <div class="menu-l-dw menu-l-cl">
        <i class="iconfont icon-chizi"></i>
        <div class="dw-title cl-title display-n">测量工具</div>
      </div>
      <!-- 侧边菜单 -->
      <div class="leftMenu">
        <div class="weather">
          <div class="city">{{city}}</div>
          <div class="margin-b-20">
            <img :src="tianqiUrl" alt class="margin-r-20" />
            <span class="margin-r-20">{{tianqi.wea}}</span>
            <span>{{tianqi.tem2+"~"+tianqi.tem1}}</span>
          </div>
          <div class="margin-b-10">
            <span class="margin-r-10">空气</span>
            <span>{{tianqi.air}}{{tianqi.air_level}}</span>
            <span class="margin-l-20 margin-r-10">风力</span>
            <span>{{tianqi.win_speed}}</span>
          </div>
        </div>
        <div class="statistics">
          <div class="sta-title" @click="isShowData=!isShowData">
            <span>统计数据</span>
            <!-- <i class="iconfont right" :class="show?'icon-xiajiantou':'icon-shouqishangjiantou-'"></i> -->
            <i class="iconfont right icon-xiajiantou" :class="{ active: isShowData }"></i>
          </div>
          <div :class="{ spread:isShowData }" class="cont-data">
            <div class="shuju">
              <span>本月用水</span>
              <span class="yongshui">{{waterCurrentMonth}}&nbsp;t</span>
              <!-- <span class="ys-stat"></span> -->
              <el-progress :percentage="50" :show-text="false"></el-progress>
            </div>
            <div class="shuju">
              <span>上月同期</span>
              <span class="tonqi">{{waterLastMonth}}&nbsp;t</span>
              <el-progress :percentage="60" :show-text="false" color="#d651ea"></el-progress>
              <!-- <span class="tq-stat"></span> -->
            </div>
            <div class="clearfix info">
              <div class="left">
                <span>
                  <i class="iconfont icon-yibiaopan"></i>&nbsp;压力表
                </span>
                <span class="color-1">9</span>
              </div>
              <div class="left">
                <span>
                  <i class="iconfont icon-yibiaopan"></i>&nbsp;流量表
                </span>
                <span class="color-2">30</span>
              </div>
              <div class="left">
                <span>
                  <i class="iconfont icon-qiyegongchangjianzhu"></i>&nbsp;建筑
                </span>
                <span class="color-1">{{buildLenght}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="statistics jiance">
          <div class="sta-title" @click="isShow=!isShow">
            <span>报警信息</span>
            <!-- <i class="iconfont right" :class="show?'icon-xiajiantou':'icon-shouqishangjiantou-'"></i> -->
            <i class="iconfont right icon-xiajiantou" :class="{ active: isShow }"></i>
          </div>
          <div :class="{ spread:isShow }" class="cont">
            <div class="yichang margin-b-20">
              <span class="margin-r-5">
                <img src="@/imgs/tanhao.png" alt="tanhao" />
              </span>
              <span class="margin-r-20">水压异常</span>
              <span class="margin-r-10">2019/4/5</span>
              <span>15:11</span>
            </div>
            <div class="yichang margin-b-20">
              <span class="margin-r-5">
                <img src="@/imgs/tanhao.png" alt="tanhao" />
              </span>
              <span class="margin-r-20">水压异常</span>
              <span class="margin-r-10">2019/4/5</span>
              <span>15:11</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var mapManage = [
  // { id:'1', icon: 'gr50', name: "生活管网（50mm）", check: true },
  // { id:'2', icon: 'gr20', name: "生活管网（20mm）", check: false },
  { id:'1', icon: 'sh50', name: "用水管网", check: true,layer:{} },
  // { id:'4', icon: 'sh20', name: "生活用水（20mm）", check: false },
  { id:'2', icon: 'jz', name: "建筑楼块", check: true ,layer:{} }
]
import staff from "../imgs/staff-01.png";
import xiaofangshuan from "../imgs/xiaofangshuan.png";
import iconx from "../imgs/icon-x.png";
import shu from "../imgs/shu.png";
import shuBaojing from "../imgs/shu-baojing.png";

import {
  drawPolygon,
  drawMesh,
  updateMeshColor,
  updateMeshColors,
  drawWindow,
  calcCenterPosi,
  drawMpaMarker,
  drawPolyline,
  drawCircle
} from "@/mapUtil/Amap";

import myMapUtil from "@/mapUtil/MyMapUtil";
import weatherUtil from "@/utils/weather/weather";
import {getBuildingList,getWaterTotal} from '@/api/gis'

export default {
  data() {
    return {
      isShowData: false,
      isShow: false,
      mapManage: mapManage,
      waterCurrentMonth: 0,
      waterLastMonth: 0,
      mapLayers: [],
      layerNames:{
        building:'buildingLayer',
        buildingMarker:'buildingMarkerLayer',
        waterPipe:'waterPipeLayer',
        waterWell:'waterWellLayer'
      },
      wellList:[
        {
          title:'1#深水井',
          position:[108.992031, 34.122647]
        },
        {
          title:'2#深水井',
          position:[108.992676, 34.123778]
        },
        {
          title:'3#深水井',
          position:[108.991585, 34.124581]
        },
        {
          title:'蓄水池',
          position:[108.992098, 34.124536]
        }
      ],
      staff: staff,
      menuBlist: [
        { name: "建筑名称", mbActive: false },
        { name: "报警统计", mbActive: false },
        { name: "人员", mbActive: false },
        { name: "供水管路", mbActive: false }
      ],
      show: false,
      circles: [],
      map: {},
      staffOverlayGroups: [],
      fireOverlayGroups: [],
      mpaOverlayGroups: [],
      myBuildingList: [],
      circleAimPosiCount: 10, // 水管圆形 动画节点数量
      buildingMarkerLayer: null,
      buildingMeshLayer: {},
      staffGold: [
        [108.922494, 34.175315],
        [108.922494, 34.176315],
        [108.921494, 34.176315],
        [108.923494, 34.1756315],
        [108.921194, 34.1756315]
      ],
      fireGold: [
        [108.924156, 34.17648],
        [108.926116, 34.17648],
        [108.925156, 34.17648],
        [108.925156, 34.17548],
        [108.925656, 34.17548],
        [108.925956, 34.17548]
      ],
      /***多边形 */
      gardenPolygon: [
        {
          name: "花坛上",
          fillColor: "#20463A",
          strokeColor: "#316857",
          garden: [
            [108.990627, 34.121763],
            [108.990672, 34.121744],
            [108.990652, 34.121671],
            [108.990566, 34.121708]
          ]
        },
        {
          name: "花坛下",
          fillColor: "#20463A",
          strokeColor: "#316857",
          garden: [
            [108.990501, 34.121611],
            [108.99059, 34.121573],
            [108.99052, 34.121516],
            [108.990479, 34.121534]
          ]
        },
        {
          name: "三个花坛-1",
          fillColor: "#20463A",
          strokeColor: "#316857",
          garden: [
            [108.991504, 34.123109],
            [108.991571, 34.123083],
            [108.991556, 34.123056],
            [108.991489, 34.123081]
          ]
        },
        {
          name: "三个花坛-2",
          fillColor: "#20463A",
          strokeColor: "#316857",
          garden: [
            [108.991687, 34.123039],
            [108.991758, 34.123012],
            [108.991743, 34.122983],
            [108.991672, 34.12301]
          ]
        },
        {
          name: "三个花坛-3",
          fillColor: "#20463A",
          strokeColor: "#316857",
          garden: [
            [108.991868, 34.122974],
            [108.991942, 34.122948],
            [108.991925, 34.122919],
            [108.991852, 34.122947]
          ]
        },
        {
          name: "大门",
          fillColor: "#20463A",
          strokeColor: "#316857",
          garden: [
            [108.990239, 34.121291],
            [108.990309, 34.121282],
            [108.99038, 34.121259],
            [108.990447, 34.12122],
            [108.990497, 34.12117],
            [108.990531, 34.121121],
            [108.990542, 34.121081],
            [108.990527, 34.121077],
            [108.990514, 34.121123],
            [108.990478, 34.121169],
            [108.990434, 34.121211],
            [108.990371, 34.121249],
            [108.990303, 34.12127],
            [108.990236, 34.121276]
          ]
        }
      ],
      /***圆 */
      circle: [
        {
          name: "进门花坛中心",
          center: [108.990575, 34.121642]
        },
        {
          name: "大门柱子-1",
          center: [108.990303, 34.121269]
        },
        {
          name: "大门柱子-2",
          center: [108.990471, 34.121169]
        }
      ],
      /********marke压力表 */
      mpaGold: [[108.99133, 34.122563], [108.991562, 34.123908]],
      buildLenght: "",
      city: "",
      tianqi: "",
      tianqiUrl: ""
    };
  },
  mounted() {
    /****加载地图 */
    this.init();
    this.waterData()
    this.weather();
    setInterval(() => {
      this.weather();
    }, 6480000);
  },
  beforeDestroy() {
    this.map.destroy();
  },
  methods: {
    waterData(){
      getWaterTotal()
      .then(response =>{
        let waterArray = response.Data
        if(waterArray.length ==2){
          //  let waterData = waterArray[0];
          this.waterCurrentMonth = waterArray[0].TotalWater
          this.waterLastMonth = waterArray[1].TotalWater
        }
      })
    },
    // 获取图片地址
    getImgUrl(icon){
      return require("@/imgs/legend/"+icon+".png")
    },
    // 图例多选框
    handleCheckedChange(obj) {
      if(obj.check){
          obj.layer.show()
      }else{
        obj.layer.hide()
      }
    },
    addMapLayer(key,name,icon,checked,layer){
      let layerObj = { 
        id:key, 
        icon: icon, 
        name: name, 
        check: checked,
        layer:layer 
        }
      this.mapLayers.push(layerObj)
    },
    //根据key 判定图层是否显示
    iaMapLayerShow(key){
      for (let index = 0; index < this.mapLayers.length; index++) {
        let layerObj = this.mapLayers[index];
         if(layerObj.id == key){
          return layerObj.check
        }
      }
      return false
    },
    // 地图天气查询
    weather() {
      let th = this;
      weatherUtil.getWeather(function(weatherObj) {
        th.city = weatherObj.city;
        th.tianqiUrl = weatherObj.imgUrl;
        th.tianqi = weatherObj.tianqi;
      });
    },
    activeFunc(data, index) {
      // console.log(index);
      let markShow = () => {
        for (let index = 0; index < this.myBuildingList.length; index++) {
          let myBuild = this.myBuildingList[index];
          if (myBuild) {
            myBuild.marker.show();
          }
        }
      };
      let markHide = () => {
        for (let index = 0; index < this.myBuildingList.length; index++) {
          let myBuild = this.myBuildingList[index];
          if (myBuild) {
            myBuild.marker.hide();
          }
        }
      };
      if (index == 0) {
        markShow();
        this.mpaOverlayGroups.hide();
        // this.fireOverlayGroups.hide();
      } else if (index == 1) {
        markHide();
        this.mpaOverlayGroups.show();
        // this.staffOverlayGroups.hide();
      } else if (index == 2) {
        markHide();
        this.buildingMeshLayer.hide();
        this.fireOverlayGroups.hide();
      } else {
        markShow();
        this.buildingMeshLayer.show();
        this.staffOverlayGroups.show();
      }
      this.menuBlist.forEach(function(obj) {
        obj.mbActive = false;
      });
      data.mbActive = !data.mbActive;
    },
    drawSchoolPolygon(fillColor, strokeColor, path) {
      let polygon = drawPolygon(fillColor, 1, strokeColor, 1, path);
      this.map.add(polygon);
    },
    
    /*地图函数*/
    init() {
      //区域建筑消除
      var buildingLayer = myMapUtil.getBuildingLayer()
      /********中心点坐标 */
      var mapCenter = [108.990904, 34.122029];

      this.map = myMapUtil.createMap()
      // var map_center = map.getCenter(); //获取当前地图中心位置
      /****添加刻度尺*/
      // this.map.addControl(new AMap.Scale())
      /**设置鼠标样式 */
      // this.map.setDefaultCursor("default");
      /*********添加多边图层 */
      /*****校区不规则多边形 */
      for (let i = 0; i < this.gardenPolygon.length; i++) {

        let polygon = this.drawSchoolPolygon(
          this.gardenPolygon[i].fillColor,
          this.gardenPolygon[i].strokeColor,
          this.gardenPolygon[i].garden
        )
      }

      /***添加圆平面*/
      /****老校区开门花坛 */
      for (let i = 0; i < this.circle.length; i++) {
        var circleMarker = new AMap.Circle({
          center: this.circle[i].center, // 圆心位置
          radius: 4, // 圆半径
          fillColor: "#505245", // 圆形填充颜色
          strokeColor: "#757865", // 描边颜色
          strokeWeight: 1, // 描边宽度
          map: this.map
        });
      }
      // /******添加线 */
      // for (let i = 0; i < this.pipeline.length; i++) {
      //   this.drawPipeline("pink", "#FF33FF", this.pipeline[i]);
      // }
      // this.drawCricleAnim();

     
     
      /******添加mpa */
      var mpaPositions = this.mpaGold; //添加mpa坐标
      var mpaMarkers = [];
      for (var m = 0; m < mpaPositions.length; m++) {
        var lnglat = mpaPositions[m];
        let mpaMarker = myMapUtil.drawMpaMarker(
          m,
          shu,
          new AMap.LngLat(lnglat[0], lnglat[1])
        );
        mpaMarkers.push(mpaMarker);
      }
      // // 创建覆盖物群组，并将 marker 传给 OverlayGroup
      this.mpaOverlayGroups = new AMap.OverlayGroup(mpaMarkers);
      // /***将消防栓类加到地图*/
      this.map.add(this.mpaOverlayGroups);
      // 清除 marker
      // map.remove(marker);
      // 缩放地图到合适的视野级别
      // this.map.setFitView([ circle ])
      /*******工具栏********/
      document.querySelector(".menu-l-dw").onclick = () => {
        this.map.setCenter(mapCenter); //设置地图中心点
      };
      /*测量工具 */
      //自定义样式
      var startMarkerOptions = {
        icon: new AMap.Icon({
          size: new AMap.Size(19, 31), //图标大小
          imageSize: new AMap.Size(19, 31),
          image: "https://webapi.amap.com/theme/v1.3/markers/b/start.png"
        })
      };
      var endMarkerOptions = {
        icon: new AMap.Icon({
          size: new AMap.Size(19, 31), //图标大小
          imageSize: new AMap.Size(19, 31),
          image: "https://webapi.amap.com/theme/v1.3/markers/b/end.png"
        }),
        offset: new AMap.Pixel(-9, -31)
      };
      var midMarkerOptions = {
        icon: new AMap.Icon({
          size: new AMap.Size(19, 31), //图标大小
          imageSize: new AMap.Size(19, 31),
          image: "https://webapi.amap.com/theme/v1.3/markers/b/mid.png"
        }),
        offset: new AMap.Pixel(-9, -31)
      };
      var lineOptions = {
        strokeStyle: "solid",
        strokeColor: "#FF33FF",
        strokeOpacity: 1,
        strokeWeight: 2
      };
      var rulerOptions = {
        startMarkerOptions: startMarkerOptions,
        midMarkerOptions: midMarkerOptions,
        endMarkerOptions: endMarkerOptions,
        lineOptions: lineOptions
      };
      var ruler2 = new AMap.RangingTool(this.map, rulerOptions);
      var clTitle = document.querySelector(".cl-title");
      var clTicon = document.querySelector(".icon-chizi");
      document.querySelector(".menu-l-cl").onclick = function() {
        console.log(clTitle.innerHTML);
        if (clTitle.innerHTML == "测量关闭") {
          clTitle.innerHTML = "测量开启";
          clTitle.style.left = "-100px";
          this.style.background = "rgba(31, 50, 91, 0.86)";
          clTicon.style.color = "#7ca5e2";
          ruler2.turnOff();
        } else {
          clTitle.innerHTML = "测量关闭";
          clTitle.style.left = "-100px";
          this.style.background = "rgba(45, 170, 253, 0.86)";
          clTicon.style.color = "#fff";
          ruler2.turnOn();
        }
      };
      // document.querySelector(".menu-l-cl").ondblclick = function() {

      // };
      /************** */
      // 光照条件
      this.map.on("complete", () => {
        this.map.AmbientLight = new AMap.Lights.AmbientLight([1, 1, 1], 1);
        this.map.DirectionLight = new AMap.Lights.DirectionLight(
          [1, -1, 2],
          [1, 1, 1],
          0.5
        );
        //获取建筑列表
        getBuildingList()
        .then(response =>{
          if(response.Result){
            let gisObjStr = response.Data

            let gisObj = JSON.parse(gisObjStr)
            let buildingList = gisObj.buildingMaps.JianZhu
            let th = this
            let onMeshClicked =  (buildingObject) =>{
              if(this.iaMapLayerShow(this.layerNames.building)){
                 // debugger
                // alert(buildingObject.data.buildingText)
                let infoWindow = myMapUtil.drawBuildingWindow(
                    buildingObject.data.buildingText,
                    // iconx
                );
                buildingObject.infoWindow = infoWindow

                infoWindow.open(this.map, buildingObject.center)
              }
            }

            // let gisObj = this.buildingName
            myMapUtil.drawBuildingMesh(buildingList,this.map,(object3Dlayer,markerLayer) =>{
              this.buildingMeshLayer = object3Dlayer
              this.buildingMarkerLayer = markerLayer //建筑物marker
              this.addMapLayer(this.layerNames.building,"建筑",'jz',true,object3Dlayer)
              this.addMapLayer(this.layerNames.buildingMarker,"建筑名称",'buildingName',true,markerLayer)
            },onMeshClicked)

            let pipeLines = gisObj.buildingMaps.GuanDao
            myMapUtil.drawPipeLine(pipeLines,"pink", "#3892f7",this.map,(pipeLineLayer)=>{
              this.addMapLayer(this.layerNames.waterPipe,"用水管道",'sh50',true,pipeLineLayer)
            })//绘制管道
            this.buildLenght = gisObj.buildingMaps.JianZhu.length;

            //绘制井
            let wellMarkerLayer = myMapUtil.drawWellMarker(this.wellList)
            this.addMapLayer(this.layerNames.waterWell,"水井",'well',true,wellMarkerLayer)
            this.map.add(wellMarkerLayer)

          }
        })
        
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.map {
  height: 100%;
}
.leftMenu {
  width: 302px;
  height: auto;
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 110;
  .weather {
    background: rgba(31, 50, 91, 0.86);
    border: 1px solid #495b83;
    padding: 15px;
    margin-bottom: 10px;
    font-size: 15px;
    color: #7ca5e2;
    .city {
      margin-bottom: 20px;
    }
  }
  .statistics {
    background: rgba(31, 50, 91, 0.86);
    border: 1px solid #495b83;
    padding: 15px;
    margin-bottom: 10px;
    color: #7ca5e2;
    font-size: 15px;
    box-sizing: border-box;
    margin-bottom: 10px;
    .active {
      transform: rotate(-90deg)
    }
    i {
      transition: transform .3s;
    }
    .sta-title {
      margin-bottom: 20px;
      cursor: pointer;
    }
    .cont-data {
      height: 213px;
      overflow: hidden;
      transition:height .3s ease-in-out,padding-top .3s ease-in-out,padding-bottom .3s ease-in-out;
    }
    .cont {
      height: 85px;
      overflow: hidden;
      transition:height .3s ease-in-out,padding-top .3s ease-in-out,padding-bottom .3s ease-in-out;
    }
    .spread {
      height: 0;
    }
    .shuju {
      margin-bottom: 20px;
      span {
        display: inline-block;
      }
      span:first-child {
        margin-right: 20px;
      }
      span:nth-child(2) {
        width: 25%;
      }
      span:nth-child(3) {
        width: 45%;
      }
      span.yongshui {
        color: #47acfe;
        font-size: 20px;
      }
      span.ys-stat {
        position: relative;
        height: 15px;
      }
      span.ys-stat::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 30%;
        height: 85%;
        background: #69b1ee;
      }
      span.tonqi {
        color: #d651ea;
        font-size: 20px;
      }
      span.tq-stat {
        position: relative;
        height: 15px;
      }
      span.tq-stat::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 50%;
        height: 85%;
        background: #e175f1;
      }
    }
    .info {
      border-top: 1px solid #495b83;
      padding-top: 20px;
      .left {
        width: 50%;
        margin-bottom: 10px;
        i {
          font-size: 20px;
        }
      }

      .left span:first-child {
        margin-right: 10px;
      }
      .color-1 {
        color: #3a86c9;
        font-size: 20px;
      }
      .color-2 {
        color: #fea147;
        font-size: 20px;
      }
    }
  }
  .jiance > div:last-child {
    margin-bottom: 0;
  }
}
</style>
<style>
.yujing-kuang {
  background: #1b1b1b;
  border: 1px solid #7ecef4;
}
.yujing-kuang-baojing {
  border: 1px solid #ef412a;
}
.color-7ca {
  color: #7ca5e2;
}
.menu-b-body .el-checkbox__input {
  float: right;
  margin-right: 10px;
  padding-top: 5px;
}
.menu-b-body label {
  background: none;
  padding-left: 0px;
  width: 100%;
  color: #7ca5e2;
  border-bottom: none;
}
.menu-b-body label:hover {
  background: #263a67;
}
.menu-b-body label::after {
  content: "";
}
.menu-b-body .el-checkbox__inner {
    background: none;
    border: 1px solid #409EFF;
}
.statistics .el-progress-bar__outer {
  height: 15px !important;
  border-radius: 0;
  border: 1px solid #495b83;
  background-color: rgba(0,0,0,0);
}
.statistics .el-progress-bar__inner {
  border-radius: 0;
}
.statistics .el-progress {
  margin-top: 5px;
}
</style>
