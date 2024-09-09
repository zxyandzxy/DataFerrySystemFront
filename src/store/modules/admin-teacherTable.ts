import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
import {
  fetchAdmins,
  addAdmin,
  removeAdmin,
  updateAdmin,
  resetManagerPassword,
  adminGetInfoAPI,
} from '@/api/admin-teacher'
import { Admin } from '@/admin-interface/admin'
import { updateAdminPasswordAPI } from '../../api/admin-teacher'

export const useManageAdminStore = defineStore('manageAdmin', () => {
  const admins = ref<Admin[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const currentAdmin = ref(Admin)(null)
  const currentAdminAccount = ref(null)

  // 根据账户获得管理员信息
  const fetchCurrentAdmin = async (adminAccount: string) => {
    loading.value = true
    error.value = null
    try {
      const adminInfo = await adminGetInfoAPI(currentAdminAccount.value)
      currentAdmin.value.adminAccount = currentAdminAccount.value // 赋值给 currentAdmin.value
      currentAdmin.value.adminName = adminInfo.adminName
      currentAdmin.value.telephone = adminInfo.telephone
      currentAdmin.value.wechat = adminInfo.wechat
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

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

  // 添加管理员到列表
  const addAdminToList = async (adminAccount: string, adminName: string) => {
    loading.value = true
    error.value = null
    try {
      // 调用 addAdmin 函数，并等待返回结果
      const password = await addAdmin(adminAccount, adminName)
      // 如果需要处理密码，可以在这里进行逻辑处理
      fetchAdminsList()
      return password
    } catch (err) {
      // 处理错误情况
      error.value = err
    } finally {
      // 最终设置加载状态为 false
      loading.value = false
    }
  }

  // 重置管理员密码
  const resetAdminPassword = async (adminAccount: string) => {
    loading.value = true
    error.value = null
    try {
      // 调用 resetManagerPassword 函数，并等待返回结果
      const password = await resetManagerPassword(adminAccount)
      // 如果需要处理密码，可以在这里进行逻辑处理
      // fetchAdminsList() // 更新管理员列表
      return password
    } catch (err) {
      // 处理错误情况
      error.value = err
    } finally {
      // 最终设置加载状态为 false
      loading.value = false
    }
  }

  // 删除管理员
  const removeAdminFromList = async (adminAccount: string) => {
    loading.value = true
    error.value = null
    try {
      await removeAdmin(adminAccount)
      fetchAdminsList()
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // 更新管理员个人信息
  const updateAdminSelfInfo = async (adminAccount: string, telephone: string, wechat: string) => {
    loading.value = true
    error.value = null
    try {
      await updateAdmin(adminAccount, telephone, wechat)
      fetchCurrentAdmin(currentAdmin.adminAccount)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // 更新管理员密码
  const updateAdminSelfPassword = async (
    adminAccount: string,
    curPassword: string,
    newPassword: string,
    newVerPassword: string,
  ) => {
    loading.value = true
    error.value = null
    try {
      // 调用更新管理员密码的 API
      await updateAdminPasswordAPI(adminAccount, curPassword, newPassword, newVerPassword)
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
    fetchCurrentAdmin,
    fetchAdminsList,
    addAdminToList,
    removeAdminFromList,
    updateAdminSelfInfo,
    resetAdminPassword,
    updateAdminSelfPassword,
  }
})
