
import {drawMarker,drawWindow,drawPolygon,drawMesh,calcCenterPosi,updateMeshColors,drawPolyline,drawCircle,drawLabelMarker} from './Amap'
import iconx from "../imgs/icon-x.png";


//默认mesh 颜色
var bottomColor = [13 / 255, 34 / 255, 63 / 255, 0.8];
var topColor = [90 / 255, 118 / 255, 152 / 255, 0.8];
var topFaceColor = [93 / 255, 118 / 255, 152 / 255, 1];

//mesh 选中颜色
var selectBottomColor = [135 / 255, 131 / 255, 24 / 255, 0.8];
var selectTopColor = [229 / 255, 224 / 255, 55 / 255, 0.8];
var selectTopFaceColor = [225 / 255, 247 / 255, 24 / 255, 1];

 // 鼠标移入改变mesh三颜色
 var mouseInBottomColor = [68 / 255, 79 / 255, 47 / 255, 0.8];
 var mouseInTopColor = [128 / 255, 146 / 255, 115 / 255, 0.8];
 var mouseInTopFaceColor = [128 / 255, 146 / 255, 115 / 255, 1];

 //管道动画原点个数
 var  circleAimPosiCount =  10


 //管道颜色
 var pipeColorMouseOn = "#FFF" // 鼠标移入管道颜色
 var pipeCircleColor = "#FFF" // 管道移入颜色
 var waterPipeColor = '#3892f7'  //水管
 

/**
 * 底层覆盖
 */
var underLayerOption = {
    hideWithoutStyle: false, //是否隐藏设定区域外的楼块
    areas: [
      {
        //围栏1
        visible: false, //是否可见
        rejectTexture: true, //是否屏蔽自定义地图的纹理
        color1: "ff99ff00",
        color2: "ff999900",
        path: [
          [108.989814,34.121468], 
          [108.990324,34.122275], 
          [108.989935,34.122532], 
          [108.990254,34.123025], 
          [108.989629,34.123454], 
          [108.989886,34.12389], 
          [108.989594,34.124856], 
          [108.990886,34.1253], 
          [108.992044,34.125154], 
          [108.992987,34.124171], 
          [108.993852,34.123379], 
          [108.994304,34.122743], 
          [108.994034,34.122471], 
          [108.993254,34.122605], 
          [108.992451,34.122669], 
          [108.990931,34.120496], 
          [108.98976,34.121383], 
        ]
      }
    ]
  }

var createMap = () => {
    let mapCenter = [108.990904, 34.122029];




    let buildingLayer = getBuildingLayer()
    // eslint-disable-next-line no-undef
    let map = new AMap.Map("container", {
        // mask:[
        //     [108.939592,34.115587],
        //     [108.980793,34.163637],
        //     [109.047506,34.12441],
        //     [109.009909,34.077219]
        //   ],
        mapStyle: "amap://styles/afcf7d6c61e676a6978291df7effda7a",
        expandZoomRange: true,
        zooms: [16, 20],
        zoom: 19, //级别[3-18]
        center: mapCenter, //中心点坐标
        viewMode: "3D", //使用3D视图
        pitch: 60, // 地图俯仰角度，有效范围 0 度- 83 度
        rotation: 0, //在MapOptions中设置地图的旋转角度
        //showLabel: false, //不显示地图文字标记
        features: ["bg", "road"], //设置地图上显示的元素种类支持'bg'（地图背景）、'point'（POI点）、'road'（道路）、'building'（建筑物）
        // eslint-disable-next-line no-undef
        layers: [new AMap.TileLayer({}), buildingLayer]
    });


    let underLayer = drawPolygon("green",0.1,null,1,underLayerOption.areas[0].path)
    
    map.add(underLayer)


    return map

}

/**
 * 获取地图底层覆盖
 */
var getBuildingLayer = ()=> {
    //区域建筑消除
    // eslint-disable-next-line no-undef
    var buildingLayer = new AMap.Buildings({
        zIndex: 130,
        merge: false,
        sort: false,
        zooms: [17, 20]
      })
    let options = underLayerOption
      buildingLayer.setStyle(options); //此配色优先级高于自定义mapStyle
      return buildingLayer
}


var drawBuildingMesh = (buildingList,map,callback,onMeshClicked) =>{

    var myBuildingList = []

    
    // eslint-disable-next-line no-undef
    // var markerOverlayGroup = new AMap.OverlayGroup();

    // eslint-disable-next-line no-undef
    var markerOverlayLayer = new AMap.LabelsLayer({
        zooms: [3, 20],
        zIndex: 2100,
        // 开启标注避让，默认为开启，v1.4.15 新增属性
        collision: true,
        // 开启标注淡入动画，默认为开启，v1.4.15 新增属性
        animation: true,
    });
     // 添加 Object3DLayer 图层，用于添加 3DObject 对象
     // eslint-disable-next-line no-undef
     var object3Dlayer = new AMap.Object3DLayer();
     map.add(object3Dlayer);
 
    // 初始化Mesh的构造
    var initMesh = () => {
        buildingList.forEach((meshGold, bindex) => {
        var meshes = [];

        meshGold.mesh.forEach((path, pindex) => {
            var buildingsHeight = meshGold.height;
            let mesh = drawMesh(
            map,
            path,
            buildingsHeight[pindex],
            bottomColor,
            topColor,
            topFaceColor
            );
            object3Dlayer.add(mesh);
            meshes.push(mesh);
        });

        /**************建筑标题***************/
        let markPosition = calcCenterPosi2(meshGold.mesh);
        let marker = drawBuildingMarker(
            meshGold.buildingText,
            markPosition
        );
        // map.add(marker);
        // markerOverlayGroup.addOverlay(marker)
        markerOverlayLayer.add(marker)
        /**************弹出层***************/

        let infoWindow = drawBuildingWindow(
            meshGold.buildingText,
            iconx
        );

        let myBuilding = {
            obj: meshes,
            id: bindex,
            name: meshGold.buildingText,
            marker: marker,
            center: markPosition,
            infoWindow: infoWindow,
            data:meshGold
        };

        myBuildingList.push(myBuilding);
        });
        //添加marker group
        // map.add(markerOverlayGroup);
        map.add(markerOverlayLayer)
    };
    /*******************计算mesh中心点 */
    // 三维数转一位数组计算中心点
    function calcCenterPosi2(loglatList) {
        let destArr = [];
        loglatList.forEach((meshs) => {
        meshs.forEach((posi) => {
            destArr.push(posi);
        });
        });
        return calcCenterPosi(destArr);
    }
    /*******添加Mesh */
    initMesh();

    callback(object3Dlayer,markerOverlayLayer)

    
    var lastObj = null
    
    var lastSelectObj = null
    var mousemove1 = ev => {
        var pixel = ev.pixel;
        // eslint-disable-next-line no-undef
        var px = new AMap.Pixel(pixel.x, pixel.y);
        let obj =
        map.getObject3DByContainerPos(px, [object3Dlayer], false) ||
        null;
        // 选中的 object3D 对象，这里为当前 Mesh
        // var object = obj.object;
         

        if (lastObj != null) {
            // updateMeshColor2(lastObj, bottomColor, topColor);
            resetBuildingColor(myBuildingList);
            //使用CSS默认样式定义地图上的鼠标样式
            map.setDefaultCursor("");
            lastObj = null;
        }

        //如果 当前存在选中的建筑 且与 鼠标当前划入的建筑一致，那么则不更新color
       
        let lastSelectMeshs = []

        if(lastSelectObj != null){
            lastSelectMeshs = lastSelectObj.obj //数组
            //更新建筑颜色
            updateBuildingColor(lastSelectObj, selectBottomColor,
                selectTopColor,
                selectTopFaceColor);
        }
        
        if (obj != null) {
            let object = obj.object
            let tag = false
            for (let index = 0; index < lastSelectMeshs.length; index++) {
                let meshObj = lastSelectMeshs[index];
                if(object.id == meshObj.id){
                    tag = true
                    return
                }
            }
            
            if(tag){
                return
            }

            map.setDefaultCursor("pointer");
            lastObj = setBuildingSelected(
                myBuildingList,
                object.id,
                mouseInBottomColor,
                mouseInTopColor,
                mouseInTopFaceColor
            );
        }
    };
    // prism 拾取
    map.on("mousemove", mousemove1);
    map.on("click", ev => {
    //   console.log("[" + ev.lnglat.lng + "," + ev.lnglat.lat + "]");
        var pixel = ev.pixel
        // eslint-disable-next-line no-undef
        var px = new AMap.Pixel(pixel.x, pixel.y)
        var obj =
        map.getObject3DByContainerPos(px, [object3Dlayer], false) ||
        {}
        // 选中的 object3D 对象，这里为当前 Mesh
        let object = obj.object
        if (typeof object == "undefined") {
            lastSelectObj = null
            resetBuilding(myBuildingList, true, true)

        map.on("mousemove", mousemove1)
        } else {
        // map.off("mousemove", mousemove1)
        let myBuild = setBuildingClicked(
            myBuildingList,
            object.id,
            selectBottomColor,
            selectTopColor,
            selectTopFaceColor
        )
        //隐藏marker
        myBuild.marker.setOpacity(0)

        map.setCenter(myBuild.center)
        // myBuild.infoWindow.open(map, myBuild.center)
            lastSelectObj = myBuild
            onMeshClicked(myBuild)
        }
    });

    //buidling 选中
    function setBuildingSelected(
        buildingList,
        meshId,
        colorA,
        colorB,
        colorC
    ) {
        return updateBuilding(
        buildingList,
        false,
        true,
        false,
        false,
        meshId,
        colorA,
        colorB,
        colorC
        );
    }

    //building 点击
    function setBuildingClicked(
        buildingList,
        meshId,
        colorA,
        colorB,
        colorC
    ) {
        return updateBuilding(
        buildingList,
        true,
        true,
        true,
        false,
        meshId,
        colorA,
        colorB,
        colorC
        );
    }
    /**
     * 更新建筑信息
     * @param {*} buildingList 建筑列表
     * @param {*} isResetOther 是否重置其他mesh
     * @param {*} isQuery 是否进行查询
     * @param {*} isResetMarker 是否恢复marker显示
     * @param {*} isResetWindow 是否恢复关闭window
     * @param {*} meshId  meshId
     * @param {*} color1 颜色
     * @param {*} color2
     * @param {*} color3
     */
    function updateBuilding(
        buildingList,
        isResetOther,
        isQuery,
        isResetMarker,
        isResetWindow,
        meshId,
        colorA,
        colorB,
        colorC
    ) {
        let tagBulding = null;
        for (let index = 0; index < buildingList.length; index++) {
            let myBuild = buildingList[index];
            //是否需重置其他颜色
            if (isResetOther) {
                // 先重置其他颜色
                updateBuildingColor(myBuild, bottomColor, topColor, topFaceColor)
            }
            //处理marker及window重置
            isResetMarker && myBuild.marker.setOpacity(1);
            isResetWindow && myBuild.infoWindow.close();
            //是否返回选中的建筑信息
            if (!isQuery) {
                continue;
            }
            //是否选中选中
            let tag = isInBuilding(myBuild, meshId);
            if (tag) {
                //更新建筑颜色
                updateBuildingColor(myBuild, colorA, colorB, colorC);
                // let textOpt = labelMarkerTextOption('asdasd','top',[0,0],'#3D93FD')
                // myBuild.marker.setText(textOpt)
                // myBuild.marker.setOpacity(1);
                tagBulding = myBuild;
            }
        }
        return tagBulding;
    }

    function resetBuilding(buildingList, isResetMarker, isResetWindow) {
        updateBuilding(
        buildingList,
        true,
        false,
        isResetMarker,
        isResetWindow,
        0,
        bottomColor,
        topColor,
        topFaceColor
        );
    }

    function resetBuildingColor(buildingList) {
        updateBuilding(
        buildingList,
        true,
        true,
        false,
        false,
        0,
        bottomColor,
        topColor,
        topFaceColor
        );
    }

    //判断是否在建筑中
    function isInBuilding(myBuild, meshId) {
        for (let j = 0; j < myBuild.obj.length; j++) {
        let meshObj = myBuild.obj[j];
        if (meshId == meshObj.id) {
            return true;
        }
        }
        return false;
    }

    //更新建筑颜色
    function updateBuildingColor(myBuild, colorA, colorB, colorC) {
        for (let index = 0; index < myBuild.obj.length; index++) {
            let mesh = myBuild.obj[index];
            updateMeshColors(mesh, colorA, colorB, colorC); //改变obj里所有mesh颜色
        }
    }

    return myBuildingList
}


/**
 * 绘制管道
 * @param {*} dirColor 管道路径颜色
 * @param {*} strokeColor  管道颜色
 * @param {*} path 
 */
var drawPipeLine = (pipelineArr, dirColor, strokeColor,map,callback) => {
    let allLineCircles = [] //管道上所有的节点
    // eslint-disable-next-line no-undef
    let pipeLineOverlayGroup = new AMap.OverlayGroup();
     /******添加线 */
     for (let i = 0; i < pipelineArr.length; i++) {
        let path = pipelineArr[i].mesh
        let circles = drawPipeLineCircle(path,pipeLineOverlayGroup);
        allLineCircles.push(...circles)
        let pipeline = drawPolyline(dirColor, strokeColor, 2, "solid", path);
        setPipeOn(pipeline,function (){
            
        })

        setPipeOut(pipeline,function (){
            
        })

        pipeLineOverlayGroup.addOverlay(pipeline)
        
    }

    
    drawCircleAnim(allLineCircles);

    // pipeLineOverlayGroup.addOverlays(allLineCircles)
    map.add(pipeLineOverlayGroup);
    callback(pipeLineOverlayGroup)
}
/***线的起点画个圆*/
function  drawPipeLineCircle(pipeline,pipeLineOverlayGroup) {
    let pipeLineCircle = []
//   let aimPosiCount = 5;
  /*******计算线上的中心点和起点 */
  let calCenter = (start, end) => {
    let slong = start[0];
    let slat = start[1];

    let elong = end[0];
    let elat = end[1];

    // let centerLong = (slong + elong) / 2;
    // let centerLat = (slat + elat) / 2;

    let centerPath = [];

    let longstep = (elong - slong) / circleAimPosiCount;
    let latstep = (elat - slat) / circleAimPosiCount;
    // centerPath.push([slong, slat]);
    for (let index = 0; index < circleAimPosiCount; index++) {
      centerPath.push([slong + longstep * index, slat + latstep * index]);
    }

    let center = {
      center: [slong, slat],
      centerPath: centerPath
    };
    return center;
  };

  for (let index = 0; index < pipeline.length; index++) {
    if (index != 0) {
      let center = calCenter(pipeline[index - 1], pipeline[index]);

      let circleColor = pipeCircleColor;

      let circleMarker = drawCircle(
        1,
        circleColor,
        circleColor,
        1,
        center.center
      );
    //   map.add(circleMarker);
    pipeLineOverlayGroup.addOverlay(circleMarker)

      let cObj = {
        centerObj: center,
        centerMarker: circleMarker
      };

      pipeLineCircle.push(cObj);
    }
  }

  return pipeLineCircle
}

// 路径上的圆添加动画
function drawCircleAnim(circles) {
  let time = 0

  let draw = () => {
    for (let i = 0; i < circles.length; i++) {
      let cPath = circles[i].centerObj.centerPath[time];
      let circleMarker = circles[i].centerMarker;
      circleMarker.setCenter(cPath);
      // circleMarker.setMap(null)
      // circleMarker.setMap(this.map)
    }
    time = (time + 1) % circleAimPosiCount;
  };

  //重复render
  setInterval(draw, 500);
}

/**
 * 绘制建筑marker
 * @param {*} title 
 * @param {*} position 
 */
var drawBuildingMarker = (title,position) => {
    // let mContent = '<div class="stadium">' + title + "</div>";
     // eslint-disable-next-line no-undef
    let textOpt = labelMarkerTextOption(title,'top',[0,-20],'#3D93FD')
    return drawLabelMarker(textOpt,null,position)
}



var labelMarkerTextOption = (name,anchor,offset,color) => {
    let textOpt = {
        content: name,
        direction: anchor,
        offset: offset,
        style: {
            // fontFamily:'宋体', 2D 模式可用
            fontSize: 13,
            // fontWeight: 'normal', 2D 模式可用
            fillColor: '#fff',
            padding: '2, 5',
            backgroundColor: color
      }
    }
    return textOpt
    
}

/**
 * 绘制建筑marker
 * @param {*} title 
 * @param {*} position 
 */
var drawWellMarker = (wellList) => {

    // eslint-disable-next-line no-undef
    var markerOverlayLayer = new AMap.LabelsLayer({
        zooms: [17, 20],
        zIndex: 2100,
        // 开启标注避让，默认为开启，v1.4.15 新增属性
        collision: true,
        // 开启标注淡入动画，默认为开启，v1.4.15 新增属性
        animation: true,
    });

    wellList.forEach(wellObj => {
        let title = wellObj.title
        let position = wellObj.position
        // let wellIcon = ''+window.location.origin+require("@/imgs/markers/well.png")
     let icon = {
        type: 'image',
        image: require('@/imgs/markers/well.png'),
        // clipOrigin: [635, 92],
        // clipSize: [50, 68],
        size: [20, 20],
        anchor: 'center',
        angel: 0,
        retina: true
     }

    let textOpt = labelMarkerTextOption(title,'top',[0,0],'#3D93FD')
    let wellMarker = drawLabelMarker(textOpt,icon,position)
    markerOverlayLayer.add(wellMarker)
        
    });
    return markerOverlayLayer
}


/**
 * 绘制压力marker
 * @param {*} num 
 * @param {*} img 
 * @param {*} position 
 */
var drawMpaMarker = (num,img,position) => {
    var mpaContent =
          `<div class="center" style="width:50px;color:#fff;"><p class="yujing-kuang" style="">0.0` +
          num +
          "&nbsp;Mp" +
          `<p><img src="${img}" alt="xiaofangshuan"></div>`;
        // eslint-disable-next-line no-undef
        return drawMarker(mpaContent,"bottom-center",position,new AMap.Pixel(0, -0))
}

/**
 * 绘制infowindow
 * @param {*} title 
 * @param {*} icon 
 */
var drawBuildingWindow = (title,icon) =>{
    let infoHtml =
            `
            <div class="info-1">
                <div class="title">
                    ` +
                    title +
                `
                    <!--<img src="`+icon+`" alt="" style="cursor: pointer;" id="close2" class="right" onclick="closeInf()"/>-->
                </div>
                <div class="clearfix">
                    <span class="left color-90a">今日用水：<span class="color-7ca font-18">1245t</span></span> 
                    <span class="right color-90a">本月用水：<span class="color-7ca font-18">1245t</span></span>
                </div>
                <div class="color-90a">统计时间：2019/6/20 11:30</div>
                <div class="clearfix">
                    <span class="left color-90a">功能类型：<span class="color-fff">教学楼</span></span> 
                    <span class="right color-90a">建筑面积：<span class="color-fff">5200m²</span></span>
                </div>
                <div class="color-90a">所属机构：<span class="color-fff">后勤</span></div>
                <div class="angle angle1"></div>
                <div class="angle angle2"></div>
                <div class="angle angle3"></div>
            </div>`;
    // eslint-disable-next-line no-undef
    return drawWindow(infoHtml,new AMap.Pixel(0, -150),"bottom-center")
}

/**
 * pipeline 鼠标移入事件
 */
var setPipeOn = (pipeLine,callback) =>{
    pipeLine.on('mouseover',function(){
        pipeLine.setOptions({
          strokeColor:pipeColorMouseOn,
          strokeWeight:5
        })
        callback()
      })
}

/**
 * pipeline 鼠标移出事件
 */
var setPipeOut = (pipeLine,callback) =>{
    pipeLine.on('mouseout',function(){
        pipeLine.setOptions({
          strokeColor:waterPipeColor,
          strokeWeight:2
        })
        callback()
      })
}
 
export default {
    createMap,//构建地图
    getBuildingLayer,
    drawBuildingMesh,//绘制mesh
    drawPipeLine,//绘制管道
    drawBuildingMarker,//绘制marker
    drawWellMarker,//绘制井marker
    drawBuildingWindow,//绘制infowindow
    drawMpaMarker,
    setPipeOn,//管道鼠标移入
    setPipeOut //管道鼠标移出
    
}