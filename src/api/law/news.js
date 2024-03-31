import request from '@/utils/request'

export function getlist(params) {
  return request({
    url: '/admin/newslist',
    method: 'post',
    data: params
  })
}

export function add(params) {
  return request({
    url: '/admin/addnews',
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
    url: '/admin/editnews',
    method: 'post',
    data: params
  })
}

export function del(params) {
  return request({
    url: '/admin/delnews',
    method: 'post',
    data: params
  })
}