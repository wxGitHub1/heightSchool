
/*========================mesh========================= */
/**
 * 绘制mesh
 * @param {*} path 
 * @param {*} height 
 * @param {*} bottomColor 
 * @param {*} topColor 
 * @param {*} topFaceColor 
 */
export function drawMesh(map,path,height,bottomColor,topColor,topFaceColor){
    var bounds = path.map(function(p) {
        // eslint-disable-next-line no-undef
        return new AMap.LngLat(p[0], p[1]);
      });
      // 创建 Object3D.Mesh 对象
      // eslint-disable-next-line no-undef
      var mesh = new AMap.Object3D.MeshAcceptLights();
    //   meshes.push(mesh);
      var geometry = mesh.geometry;
      var vertices = geometry.vertices;
      var vertexColors = geometry.vertexColors;
      var faces = geometry.faces;
      var vertexLength = bounds.length * 2;

      var verArr = [];

    //   var centerPosi;

      // 设置侧面
    //   var buildingsHeight = meshGold.height;
      bounds.forEach((lngLat, index) => {
        var g20 = map.lngLatToGeodeticCoord(lngLat);
        var angle = (2 * Math.PI * index) / bounds.length;
        verArr.push([g20.x, g20.y]);
        // 构建顶点-底面顶点
        vertices.push(g20.x, g20.y, 0);
        // 构建顶点-顶面顶点
        vertices.push(g20.x, g20.y, -height); //创建建筑高度设置

        // 设置底面低点颜色
        vertexColors.push.apply(vertexColors, bottomColor);
        // 设置顶面顶点颜色
        vertexColors.push.apply(vertexColors, topColor);
        var nX = Math.cos(angle);
        var nY = Math.sin(angle);
        // 为了支持光照，计算侧面顶点法向量
        geometry.vertexNormals.push(nX, nY, 0);
        geometry.vertexNormals.push(nX, nY, 0);
        // 设置三角形面
        var bottomIndex = index * 2;
        var topIndex = bottomIndex + 1;
        var nextBottomIndex = (bottomIndex + 2) % vertexLength;
        var nextTopIndex = (bottomIndex + 3) % vertexLength;

        //侧面三角形1
        faces.push(bottomIndex, topIndex, nextTopIndex);
        //侧面三角形2
        faces.push(bottomIndex, nextTopIndex, nextBottomIndex);
      })

      // 构建顶面三角形,为了区分顶面点和侧面点使用不一样的颜色,所以需要独立的顶点
      for (var i = 0; i < bounds.length; i += 1) {
        vertices.push.apply(
          vertices,
          vertices.slice(i * 6 + 3, i * 6 + 6)
        ); //底部顶点
        vertexColors.push.apply(vertexColors, topFaceColor);
        // 为了支持光照，计算顶面顶点法向量
        geometry.vertexNormals.push(0, 0, -1);
      }

      // 设置顶面，根据顶点拆分三角形
      // eslint-disable-next-line no-undef
      var triangles = AMap.GeometryUtil.triangulateShape(verArr);
      var offset = bounds.length * 2;

      for (var v = 0; v < triangles.length; v += 3) {
        faces.push(
          triangles[v] + offset,
          triangles[v + 2] + offset,
          triangles[v + 1] + offset
        );
      }

      // 开启透明度支持
      mesh.transparent = true

      // 添加至 3D 图层
      return mesh
}


/**
 * 更新mesh  color 单色
 * @param {*} mesh 
 * @param {*} color 
 */
export function updateMeshColor(mesh,color){
    updateMeshColor(mesh,color,color,color)
}

/**
 * 更新Mesh color
 * @param {*} mesh 
 * @param {*} color1 
 * @param {*} color2 
 * @param {*} color3 
 */
export function updateMeshColors(mesh, color1, color2, color3) {
  var vertexColors = mesh.geometry.vertexColors;
  var len = vertexColors.length;
  var front = len / 3;
  for (var i = 0; i < len / 4; i++) {
    let theColor;
    // let index;
    if (i < (front * 2) / 4) {
      let tag = i % 2;
      if (tag == 0) {
        theColor = color1;
      } else {
        theColor = color2;
      }
    } else {
      theColor = color3;
    }

    setColorToVertex(i, vertexColors, theColor);
  }
  mesh.needUpdate = true;
  mesh.reDraw();
}

function setColorToVertex(i, vertexColors, color) {
    var r = color[0];
    var g = color[1];
    var b = color[2];
    var a = color[3];
    vertexColors.splice(i * 4, 4, r, g, b, a);
}

/**
 * 绘制多边形
 * @param {*} fillColor 颜色
 * @param {*} fillOpacity 透明度
 * @param {*} strokeColor 
 * @param {*} width 宽度
 * @param {*} path 路径
 */
export function drawPolygon(fillColor,fillOpacity,strokeColor,width,path){

    // eslint-disable-next-line no-undef
    return new AMap.Polygon({
        bubble: true,
        fillColor: fillColor,
        fillOpacity: fillOpacity,
        strokeWeight: width,
        strokeColor: strokeColor,
        path: path
    });
}

/**
 * 绘制地图折线
 * @param {*} dirColor 线条颜色
 * @param {*} strokeColor  线条边框颜色
 * @param {*} strokeWeight 线条宽度
 * @param {*} strokeStyle 线条风格
 * @param {*} path 路径
 */
export function drawPolyline(dirColor,strokeColor,strokeWeight,strokeStyle,path){
    // eslint-disable-next-line no-undef
    return new AMap.Polyline({
        // showDir: true,
        dirColor: dirColor,
        strokeColor: strokeColor, // 线颜色
        strokeWeight: strokeWeight, // 线宽
        strokeStyle: strokeStyle,
        path: path // 设置线覆盖物路径
      });

}

/**
 * 绘制圆形
 * @param {*} radius 半径
 * @param {*} fillColor  填充颜色
 * @param {*} strokeColor  描边颜色
 * @param {*} strokeWeight  描边宽度
 * @param {*} position 圆心位置
 */
export function drawCircle(radius,fillColor,strokeColor,strokeWeight,position){
  // eslint-disable-next-line no-undef
  return new AMap.Circle({
    radius: radius, // 圆半径
    fillColor: fillColor, // 圆形填充颜色
    strokeColor: strokeColor, // 描边颜色
    strokeWeight: strokeWeight, // 描边宽度
    center: position // 圆心位置
  });
}

/**
 * 绘制window弹出层
 * @param {*} title 
 * @param {*} icon 
 */
export function drawWindow(content,offset,anchor){
  // eslint-disable-next-line no-undef
  return new AMap.InfoWindow({
    isCustom: true, //使用自定义窗体
    content: content, //使用自定义信息窗体框样式，显示信息内容
    // eslint-disable-next-line no-undef
    offset: offset,
    anchor: anchor // 设置锚点方位
  });
}


export function drawLabelMarker(textOption,icon,position){
  // eslint-disable-next-line no-undef
  // var layer = new AMap.LabelsLayer({
  //   zooms: [3, 20],
  //   zIndex: 1000,
  //   // 开启标注避让，默认为开启，v1.4.15 新增属性
  //   collision: true,
  //   // 开启标注淡入动画，默认为开启，v1.4.15 新增属性
  //   animation: true,
  // });
  // return layer

   // eslint-disable-next-line no-undef

  // eslint-disable-next-line no-undef
   var labelMarker = new AMap.LabelMarker({
      name: name,
      position: position,
      zooms: [1, 20],
      opacity: 1,
      zIndex: 100,
      icon: icon,
      text: textOption
   });

   return labelMarker
}

export function drawMarker(content,anchor,position,offset){
    // eslint-disable-next-line no-undef
    let marker = new AMap.Marker({
        position: position,
        content: content,
        // eslint-disable-next-line no-undef
        offset: offset,
        anchor: anchor // 设置锚点方位
    });
    return marker
}

export function drawMpaMarker(num,img,position){
    var mpaContent =
          `<div class="center" style="width:50px;color:#fff;"><p class="yujing-kuang" style="">0.0` +
          num +
          "&nbsp;Mp" +
          `<p><img src="${img}" alt="xiaofangshuan"></div>`;
        // eslint-disable-next-line no-undef
        return drawMarker(mpaContent,"bottom-center",position,new AMap.Pixel(0, -0))
}

/**
 * 计算中心点坐标
 * @param {*} loglatList 
 */
export function calcCenterPosi(loglatList) {
  let minLog;
  let maxLog;
  let minLat;
  let maxLat;

  for (let index = 0; index < loglatList.length; index++) {
    let loglat = loglatList[index];
    let long = loglat[0];
    let lat = loglat[1];

    if (minLog == null || maxLog == null) {
      minLog = maxLog = long;
    }

    if (minLat == null || maxLat == null) {
      minLat = maxLat = lat;
    }

    if (long < minLog) {
      minLog = long;
    }
    if (long > maxLog) {
      maxLog = long;
    }

    if (lat < minLat) {
      minLat = lat;
    }
    if (lat > maxLat) {
      maxLat = lat;
    }
  }
  return [(minLog + maxLog) / 2, (minLat + maxLat) / 2];
} 
