import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
import { fetchStudents, addStudent, removeStudent, updateStudent } from '@/api/admin-student'
import { Student } from '@/admin-interface/student'

export const useStudentStore = defineStore('student', () => {
  const students = ref<Student[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  // 获得学生列表
  const fetchStudentsList = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetchStudents()
      students.value = response.data
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // 添加学生
  const addStudentToList = async (student: Student) => {
    loading.value = true
    error.value = null
    try {
      const newStudent = await addStudent(student)
      students.value.push(newStudent)
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
      students.value = students.value.filter((student) => student.id !== studentId)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // 更新学生
  const updateStudentInList = async (studentId: string, student: Student) => {
    loading.value = true
    error.value = null
    try {
      const updatedStudent = await updateStudent(studentId, student)
      const index = students.value.findIndex((s) => s.id === studentId)
      if (index !== -1) {
        students.value[index] = updatedStudent
      }
    } catch (err) {
      error.value = err
    } finally {
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
    fetchStudentsList,
    addStudentToList,
    removeStudentFromList,
    updateStudentInList,
  }
})
