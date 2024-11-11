import request from './request'

// 拷贝机端下载向外摆渡文件
export function downloadZipFileAPI(workOrderId) {
  return request({
    url: '/student/download_zip_file',
    method: 'GET',
    params: {
      workOrderId,
    },
    responseType: 'blob',
  })
}

// 下载学生上传的文件
export function downLoadFileAPI(upload_id, student_id) {
  return request({
    url: '/student/download_file',
    method: 'GET',
    params: {
      upload_id: upload_id,
      student_account: student_id,
    },
    responseType: 'blob',
  })
}

// 文件查看
export function viewFileAPI(pageNum, pageSize, student_id, fileType, fileName) {
  return request({
    url: '/student/view_files',
    method: 'GET',
    params: {
      pageNum,
      pageSize,
      student_id,
      fileType,
      fileName,
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
