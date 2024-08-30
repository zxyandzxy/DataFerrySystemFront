import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
import { fetchAdmins, addAdmin, removeAdmin, updateAdmin } from '@/api/admin-teacher'
import { Admin } from '@/admin-interface/admin'

export const useAdminStore = defineStore('admin', () => {
  const admins = ref<Admin[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  // 获取管理员列表
  const fetchAdminsList = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetchAdmins()
      admins.value = response.data
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // 添加管理员
  const addAdminToList = async (admin: Admin) => {
    loading.value = true
    error.value = null
    try {
      const newAdmin = await addAdmin(admin)
      admins.value.push(newAdmin)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // 删除管理员
  const removeAdminFromList = async (adminId: string) => {
    loading.value = true
    error.value = null
    try {
      await removeAdmin(adminId)
      admins.value = admins.value.filter((admin) => admin.id !== adminId)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // 更新管理员
  const updateAdminInList = async (adminId: string, admin: Admin) => {
    loading.value = true
    error.value = null
    try {
      const updatedAdmin = await updateAdmin(adminId, admin)
      const index = admins.value.findIndex((a) => a.id === adminId)
      if (index !== -1) {
        admins.value[index] = updatedAdmin
      }
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchAdminsList()
  })

  return {
    admins,
    loading,
    error,
    fetchAdminsList,
    addAdminToList,
    removeAdminFromList,
    updateAdminInList,
  }
})
