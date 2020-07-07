import request from '@/utils/request'

export function getBuildingList(){
  return request({
    url:'Energy/GetBuildingMap',
    method:'get'
  })
}

export function getWaterTotal(){
  return request({
    url:'MonitoringHall/EnergySummary',
    method:'get'
  })
}

export function getChart(params) {
  return request({
    url: 'MonitoringHall/EnergyTrendChart',
    method: 'get',
    params
  })
}

export function addApp(data) {
  return request({
    url: '/app/add',
    method: 'post',
    data
  })
}

export function deleteApp(data) {
  return request({
    url: '/app/delete',
    method: 'post',
    data
  })
}

/**
 * 获取版本列表 带分页
 * @param {*} params 参数
 */
export function getVersionList(params) {
  return request({
    url: '/app/versionList',
    method: 'get',
    params
  })
}

/* 获取APP对应的Android及iOS 最新版本列表带分页
* @param {*} params 参数
*/
export function latestVersions(params) {
  return request({
    url: '/app/latestVersions',
    method: 'get',
    params
  })
}

/**
 * 添加APP版本
 * @param {*} data 表单
 */
export function addAppVer(data) {
  return request({
    url: '/app/versionAdd',
    method: 'post',
    data
  })
}

/**
 * 删除APP版本
 * @param {*} data 表单
 */
export function delAppVer(data) {
  return request({
    url: '/app/versionDelete',
    method: 'post',
    data
  })
}

/**
 * 更新APP ver 发布状态
 * @param {*} data 表单
 */
export function updatePub(data) {
  return request({
    url: '/app/publishVersion',
    method: 'post',
    data
  })
}

