import request from './request'

// 文件查看
export function viewFileAPI(student_id) {
  return request({
    url: '/student/view_files',
    method: 'GET',
    params: {
      student_id,
    },
  })
}
// 文件上传
export function uploadFileAPI(data) {
  return request({
    url: '/student/upload_files',
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
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
