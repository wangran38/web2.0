import request from '@/utils/request'

export function getlist(params) {
  return request({
    url: '/admin/categorylist',
    method: 'post',
    data: params
  })
}

export function add(params) {
  return request({
    url: '/admin/addcategory',
    method: 'post',
    data: params
  })
}

export function getoptions(params) {
  return request({
    url: '/admin/treecategory',
    method: 'post',
    data: params
  })
}

export function edit(params) {
  return request({
    url: '/admin/editcategory',
    method: 'post',
    data: params
  })
}

export function del(params) {
  return request({
    url: '/admin/delcategory',
    method: 'post',
    data: params
  })
}