import request from '@/utils/request'

export function getlist(params) {
  return request({
    url: '/admin/getgrouplist',
    method: 'post',
    data: params
  })
}

export function addgroup(params) {
  return request({
    url: '/admin/addgroup',
    method: 'post',
    data: params
  })
}
export function getoptions(params) {
  return request({
    url: '/admin/getgrouptree',
    method: 'post',
    data: params
  })
}
export function getrulesoption(params) { //获取当前他的rules
  return request({
    url: '/admin/getrule',
    method: 'post',
    data: params
  })
}
export function getallrulesoption(params) { //获取所有的rules
  return request({
    url: '/admin/getallrule',
    method: 'post',
    data: params
  })
}
export function editgroup(params) {
  return request({
    url: '/admin/editgroup',
    method: 'post',
    data: params
  })
}

export function delgroup(params) {
  return request({
    url: '/admin/delgroup',
    method: 'post',
    data: params
  })
}
