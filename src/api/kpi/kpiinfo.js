import request from '@/utils/request'

export function getinfolist(params) {
  return request({
    url: '/admin/kpiinfolist',
    method: 'post',
    data: params
  })
}

export function addinfo(params) {
  return request({
    url: '/admin/addkpiinfo',
    method: 'post',
    data: params
  })
}

// export function getoptions(params) {
//   return request({
//     url: '/admin/treekpi',
//     method: 'post',
//     data: params
//   })
// }

export function editinfo(params) {
  return request({
    url: '/admin/editkpiinfo',
    method: 'post',
    data: params
  })
}

export function delinfo(params) {
  return request({
    url: '/admin/delkpiinfo',
    method: 'post',
    data: params
  })
}