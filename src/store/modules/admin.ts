import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ElNotification } from 'element-plus'
import { adminLoginAPI, adminGetInfoAPI } from '@/api/admin-teacher'

import { adminLoginAPI, adminGetInfoAPI } from '@/api/admin-teacher'

export const useAdminStore = defineStore(
  'admin',
  () => {
    // 定义状态
    const adminInfo = ref({})
    // 定义状态
    const adminInfo = ref({})
    const token = ref('')
    const systemChoose = ref('')
    const adminAccount = ref('root')

    // 定义获取接口数据的 action 函数
    const login = async (data, Role) => {
      systemChoose.value = Role
      const adminIdValue = data.username
      const password = data.password
      const verificationCode = data.verificationCode
      const verKey = data.verKey
      console.log(1111)

      const resp = await adminLoginAPI({
        adminAccount: adminIdValue,
        password,
        verKey,
        verificationCode,
      })
      console.log(resp)

      if (resp.code === 200) {
        token.value = resp.data.token
        adminAccount.value = adminIdValue
        return true
      } else {
        ElNotification({
          message: resp.msg,
          type: 'warning',
          duration: 3000,
        })
      }
    }

    const getAdminInfo = async () => {
      const res = await adminGetInfoAPI(adminAccount.value)
      if (res.code === 200) {
        adminInfo.value = res.data
        adminInfo.value = res.data
      }
      return res
    }

    // 退出时清除管理员信息
    const clearAdminInfo = () => {
      adminInfo.value = {}

    // 退出时清除管理员信息
    const clearAdminInfo = () => {
      adminInfo.value = {}
      token.value = ''
      adminAccount.value = ''
      systemChoose.value = ''
    }

    // 导出数据

    // 导出数据
    return {
      systemRole,
      token,
      adminInfo,
      adminAccount,
      login,
      getAdminInfo,
      clearAdminInfo,
      getAdminInfo,
      clearAdminInfo,
    }
  },
  {
    persist: true,
  },
)
