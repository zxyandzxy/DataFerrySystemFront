import { defineStore } from 'pinia'
import { ref } from 'vue'
import { updateAdmin, adminGetInfoAPI } from '@/api/admin-teacher'
import { Admin } from '@/admin-interface/admin'
import { adminLoginAPI, updateAdminPasswordAPI } from '../../api/admin-teacher'

export const useManageAdminStore = defineStore(
  'manageAdmin',
  () => {
    const currentAdminAccount = ref(null)
    const token = ref('')
    const systemChoose = ref('')

    // 根据账户获得管理员信息
    // const fetchCurrentAdmin = async (adminAccount: string) => {
    //   const adminInfo = await adminGetInfoAPI(currentAdminAccount.value)
    //   currentAdmin.value.adminAccount = currentAdminAccount.value // 赋值给 currentAdmin.value
    //   currentAdmin.value.adminName = adminInfo.adminName
    //   currentAdmin.value.telephone = adminInfo.telephone
    //   currentAdmin.value.wechat = adminInfo.wechat
    // }

    //定义获取接口数据的action函数
    const login = async (data, Choose) => {
      systemChoose.value = Choose
      const adminAccount = data.username
      const password = data.password
      const verificationCode = data.verificationCode
      const verKey = data.verKey
      token.value = await adminLoginAPI({ adminAccount, password, verKey, verificationCode })
    }

    // 更新管理员个人信息
    const updateAdminSelfInfo = async (telephone: string, wechat: string) => {
      await updateAdmin(currentAdminAccount.value, telephone, wechat)
      // fetchCurrentAdmin(currentAdminAccount.value)
    }

    //退出时清除用户信息
    const clearAdminInfo = () => {
      token.value = ''
      currentAdminAccount.value = ''
      systemChoose.value = ''
    }
    return {
      // fetchCurrentAdmin,
      login,
      updateAdminSelfInfo,
      clearAdminInfo,
    }
  },
  {
    persist: true,
  },
)
