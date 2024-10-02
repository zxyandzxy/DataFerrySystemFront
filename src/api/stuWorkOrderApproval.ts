import request from './request'

// 获取当前审批类型
export function getAuditTypeAPI() {
  return request({
    url: '/student/get_audit_type',
    method: 'GET',
  })
}

// 获取工单列表
export function getWorkOrderListAPI(pageNum, pageSize, studentAccount, workOrderTitle, fileType) {
  return request({
    url: '/student/get_list',
    method: 'GET',
    params: {
      pageNum,
      pageSize,
      studentAccount,
      workOrderTitle,
      fileType,
    },
  })
}
// 创建工单
export function createWorkOrderAPI(data) {
  return request({
    url: '/student/create_work_order',
    method: 'POST',
    data,
  })
}
// 修改工单
export function updateWorkOrderAPI(data) {
  return request({
    url: '/student/update_work_order',
    method: 'PUT',
    data,
  })
}
// 删除工单
export function deleteWorkOrderAPI(workOrderId, studentId) {
  return request({
    url: '/student/delete_work_order',
    method: 'DELETE',
    params: {
      workOrderId,
      studentId,
    },
  })
}
// 查看工单的详细信息
export function getWorkOrderDetailAPI(workOrderId, studentId) {
  return request({
    url: '/student/get_detail_work_order',
    method: 'GET',
    params: {
      workOrderId,
      studentId,
    },
  })
}
// 超前审批验证
export function advanceApprovalVerificationAPI(
  workOrderId,
  studentAccount,
  password,
  advancedPassword,
) {
  return request({
    url: '/student/advance_approval_verification',
    method: 'GET',
    params: {
      workOrderId,
      studentAccount,
      password,
      advancedPassword,
    },
  })
}
// 拷贝文件
export function copyFileAPI(data) {
  return request({
    url: '/student/copy_file',
    method: 'GET',
    data,
  })
}
// 创建工单后上传文件
export function uploadFileAPI(data) {
  return request({
    url: '/student/work_order_fileUpload',
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
