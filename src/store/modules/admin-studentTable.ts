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
  const students = ref<Student[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  // 添加学生
  const addStudentToList = async (studentAccount: string, studentName: string) => {
    loading.value = true
    error.value = null
    try {
      const password = await addStudent(studentAccount, studentName)
      fetchStudents()
      return password
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // 删除学生
  const removeStudentFromList = async (studentId: string) => {
    loading.value = true
    error.value = null
    try {
      await removeStudent(studentId)
      fetchStudents()
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // 更新学生
  const resetStudentPassword = async (studentAccount: string) => {
    loading.value = true
    error.value = null
    try {
      // 调用 resetManagerPassword 函数，并等待返回结果
      const password = await resetStudentPasswordAPI(studentAccount)
      // 如果需要处理密码，可以在这里进行逻辑处理
      fetchStudentsList() // 更新管理员列表
      return password
    } catch (err) {
      // 处理错误情况
      error.value = err
    } finally {
      // 最终设置加载状态为 false
      loading.value = false
    }
  }

  onMounted(() => {
    fetchStudentsList()
  })

  return {
    students,
    loading,
    error,
    addStudentToList,
    removeStudentFromList,
    resetStudentPassword,
  }
})
