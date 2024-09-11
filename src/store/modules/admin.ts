import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ElNotification } from 'element-plus'
import { adminLoginAPI, adminGetInfoAPI } from '@/api/admin-teacher'

export const useAdminStore = defineStore(
  'admin',
  () => {
    // 定义状态
    const adminInfo = ref({})
    const token = ref('')
    const systemRole = ref('')
    const adminId = ref('')

    // 定义获取接口数据的 action 函数
    const login = async (data, Role) => {
      systemRole.value = Role
      const adminIdValue = data.username
      const password = data.password
      const verification_code = data.verificationCode
      const res = await adminLoginAPI({ adminId: adminIdValue, password, verification_code })
      if (res.code === 200) {
        token.value = res.data.token
        adminId.value = adminIdValue
        return true
      } else {
        ElNotification({
          message: res.msg,
          type: 'warning',
          duration: 3000,
        })
      }
    }

    const getAdminInfo = async () => {
      const res = await adminGetInfoAPI(adminId.value)
      if (res.code === 200) {
        adminInfo.value = res.data
      }
      return res
    }

    // 退出时清除管理员信息
    const clearAdminInfo = () => {
      adminInfo.value = {}
      token.value = ''
      adminId.value = ''
      systemRole.value = ''
    }

    // 导出数据
    return {
      systemRole,
      token,
      adminInfo,
      adminId,
      login,
      getAdminInfo,
      clearAdminInfo,
    }
  },
  {
    persist: true,
  },
)