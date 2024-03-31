import request from '@/utils/request'

export function getlist(params) {
  return request({
    url: '/admin/citylist',
    method: 'post',
    data: params
  })
}

