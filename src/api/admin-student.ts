import service from './request' // 假设这是你的 Axios 实例
import { Student } from '../admin-interface/student'

// 获取所有学生信息
export function fetchStudents(): Promise<Student[]> {
  try {
    return service.get<Student[]>('/admin/studentlist').then((response) => response.data)
  } catch (error) {
    throw new Error(`Failed to fetch students: ${error.message}`)
  }
}

// 添加学生信息
export function addStudent(student: Student): Promise<Student> {
  try {
    return service.post('/admin/addStudent', student).then((response) => response.data)
  } catch (error) {
    throw new Error(`Failed to add student: ${error.message}`)
  }
}

// 删除学生信息
export function removeStudent(studentId: string): Promise<void> {
  try {
    return service.delete(`/students/${studentId}`)
  } catch (error) {
    throw new Error(`Failed to remove student: ${error.message}`)
  }
}

// 更新学生信息
export function updateStudent(studentId: string, student: Student): Promise<Student> {
  try {
    return service.put(`/students/${studentId}`, student).then((response) => response.data)
  } catch (error) {
    throw new Error(`Failed to update student: ${error.message}`)
  }
}
