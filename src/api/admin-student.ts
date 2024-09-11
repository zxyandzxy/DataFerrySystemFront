import service from './request'
import { Student } from '../admin-interface/student'

// 获取所有学生信息
export function fetchStudentsAPI(
  pageNum: number,
  pageSize: number,
  studentAccount?: string,
  studentName?: string,
): Promise<any> {
  try {
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
  } catch (error) {
    throw new Error(`Failed to fetch students: ${error.message}`)
  }
}

// 添加学生账户
export function addStudentAPI(studentAccount: string, studentName: string): Promise<string> {
  try {
    return service
      .post('/manager/create_student_account', { studentAccount, studentName })
      .then((response) => response.data.data.password)
  } catch (error) {
    throw new Error(`Failed to add student: ${error.message}`)
  }
}

// 删除学生账户信息
export function removeStudentAPI(studentAccounts: string[]): Promise<void> {
  try {
    return service.delete(`/manager/delete_student_account`, {
      params: {
        studentAccount: studentAccounts, // 通过 query 参数传递字符串数组
      },
    })
  } catch (error) {
    throw new Error(`Failed to remove student: ${error.message}`)
  }
}

// 重置学生密码
export function resetStudentPasswordAPI(studentAccount: string): Promise<string> {
  try {
    return service
      .put(`/manager/reset_student_password`, null, {
        params: {
          studentAccount,
        },
      })
      .then((response) => response.data.data.password)
  } catch (error) {
    throw new Error(`Failed to reset student password: ${error.message}`)
  }
}

// 下载批量添加模板文件
export function downloadBatchFileAPI(): Promise<string> {
  try {
    return service.get(`/manager/get_batch_file`).then((response) => response.data.data.file)
  } catch (error) {
    throw new Error(`Failed to download batch file: ${error.message}`)
  }
}
