import request from './request'

// 文件查看
export function viewFileAPI(studentId) {
  return request({
    url: '/student/view_files',
    method: 'GET',
    params: {
      studentId,
    },
  })
}
// 文件上传
export function uploadFileAPI(data) {
  return request({
    url: '/student/upload_files',
    method: 'POST',
    data,
  })
}
/*
示例
export function login(data) {
  return request({
    url: '/vue-element-perfect/user/login',
    method: 'post',
    data,
  })
}
*/
