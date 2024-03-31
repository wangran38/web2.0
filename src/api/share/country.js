import request from '@/utils/request'

export function getlist(params) {
  return request({
    url: '/admin/countrylist',
    method: 'post',
    data: params
  })
}

export function add(params) {
  return request({
    url: '/admin/addcountry',
    method: 'post',
    data: params
  })
}

export function getoptions(params) {
  return request({
    url: '/admin/treecountry',
    method: 'post',
    data: params
  })
}

export function edit(params) {
  return request({
    url: '/admin/editcountry',
    method: 'post',
    data: params
  })
}

export function del(params) {
  return request({
    url: '/admin/delcountry',
    method: 'post',
    data: params
  })
}