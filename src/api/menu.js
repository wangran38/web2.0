import request from '@/utils/request'

export function getMenu(params) {
  return request({
    url: '/admin/getrule',
    method: 'post',
    data: params
  })
}

export function addMenu(params) {
  return request({
    url: '/api/userinfo/addrules',
    method: 'post',
    data: params
  })
}

export function editMenu(params) {
  return request({
    url: '/api/userinfo/editrules',
    method: 'post',
    data: params
  })
}

export function deleteMenu(params) {
  return request({
    url: '/api/userinfo/delrules',
    method: 'post',
    data: params
  })
}
