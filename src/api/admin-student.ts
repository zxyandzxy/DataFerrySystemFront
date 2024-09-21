import service from './request'
import { Student } from '../admin-interface/student'

// 获取所有学生信息
export function fetchStudentsAPI(
  pageNum: number,
  pageSize: number,
  studentAccount = '',
  studentName = '',
): Promise<any> {
  // 发送带有查询参数的请求
  return service
    .get<any>('/manager/get_student_list', {
      params: {
        pageNum,
        pageSize,
        studentAccount,
        studentName,
      },
    })
    .then((response) => response.data.data)
}

// 添加学生账户
export function addStudentAPI(studentAccount: string, studentName: string): Promise<string> {
  return service
    .post('/manager/create_student_account', { studentAccount, studentName })
    .then((response) => response.data.data.password)
}

// 删除学生账户信息
// 删除学生账户信息
export function removeStudentAPI(studentAccounts: string[]): Promise<void> {
  return service.delete(`/manager/delete_student_account`, {
    params: {
      studentAccount: studentAccounts, // 通过 query 参数传递字符串数组
    },
    paramsSerializer: (params) => {
      return new URLSearchParams(params).toString()
    },
  })
}

// 重置学生密码
export function resetStudentPasswordAPI(studentAccount: string): Promise<string> {
  return service
    .put(`/manager/reset_student_password`, null, {
      params: {
        studentAccount,
      },
    })
    .then((response) => response.data.data.password)
}

// 下载批量添加模板文件
export function downloadBatchFileAPI(): Promise<string> {
  return service.get(`/manager/get_batch_file`).then((response) => response.data.data.file)
}
