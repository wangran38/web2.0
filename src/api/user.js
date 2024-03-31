import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/getinfo',
    method: 'post',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}

export function getlist(data) {
  return request({
    url: '/admin/getadminlist',
    method: 'post',
    data: data,
  })
}
export function getgroup(params) {
  return request({
    url: '/admin/getgrouptree',
    method: 'post',
    data: params
  })
}
export function addadmin(params) {
  return request({
    url: '/admin/add',
    method: 'post',
    data: params
  })
}
export function editadmin(params) {
  return request({
    url: '/admin/edit',
    method: 'post',
    data: params
  })
}
export function deladmin(params) {
  return request({
    url: '/admin/del',
    method: 'post',
    data: params
  })
}