import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
import {
  fetchStudents,
  addStudent,
  removeStudent,
  // updateStudent,
  resetStudentPasswordAPI,
} from '@/api/admin-student'
import { Student } from '@/admin-interface/student'

export const useStudentStore = defineStore('student', () => {
  // 添加学生
  const addStudentToList = async (studentAccount: string, studentName: string) => {
    const password = await addStudent(studentAccount, studentName)
    fetchStudents()
    return password
  }

  // 删除学生
  const removeStudentFromList = async (studentId: string) => {
    await removeStudent(studentId)
    fetchStudents()
  }

  // 更新学生
  const resetStudentPassword = async (studentAccount: string) => {
    // 调用 resetManagerPassword 函数，并等待返回结果
    const password = await resetStudentPasswordAPI(studentAccount)
    // 如果需要处理密码，可以在这里进行逻辑处理
    return password
  }

  return {
    addStudentToList,
    removeStudentFromList,
    resetStudentPassword,
  }
})
