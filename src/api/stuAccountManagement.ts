import request from './request'

// 学生获取登录验证码
export function stuGetCaptchaAPI() {
  return request({
    url: 'student/captcha',
    method: 'GET',
  })
}

// 学生账号登录
export function stuLoginAPI(data) {
  return request({
    url: '/student/login',
    method: 'POST',
    data,
  })
}
// 学生获取个人信息
export function stuGetInfoAPI(studentId) {
  return request({
    url: '/student/get_stu_info',
    method: 'GET',
    params: { studentId },
  })
}
// 学生修改联系方式
export function stuUpdateContactInfoAPI(data) {
  return request({
    url: '/student/update_student_contact_information',
    method: 'PUT',
    data,
  })
}
// 学生修改密码
export function stuUpdatePasswordAPI(data) {
  return request({
    url: '/student/update_student_pwd',
    method: 'PUT',
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
