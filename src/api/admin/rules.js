import request from '@/utils/request'

export function getlist(params) {
  return request({
    url: '/admin/getruleslist',
    method: 'post',
    data: params
  })
}

export function addrules(params) {
  return request({
    url: '/admin/addrules',
    method: 'post',
    data: params
  })
}
export function getoptions(params) {
  return request({
    url: '/admin/getrule',
    method: 'post',
    data: params
  })
}

export function editrules(params) {
  return request({
    url: '/admin/editrules',
    method: 'post',
    data: params
  })
}

export function delrules(params) {
  return request({
    url: '/admin/delrules',
    method: 'post',
    data: params
  })
}
