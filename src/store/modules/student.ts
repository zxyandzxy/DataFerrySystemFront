import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ElNotification } from 'element-plus'
import { stuLoginAPI, stuGetInfoAPI } from '@/api/stuAccountManagement'
export const useStuStore = defineStore(
  'student',
  () => {
    //定义数据state
    const userInfo = ref({})
    const token = ref('')
    const systemChoose = ref('')
    const stuId = ref('')
    //定义获取接口数据的action函数
    const login = async (data, Choose) => {
      systemChoose.value = Choose
      const studentId = data.username
      const password = data.password
      const verificationCode = data.verificationCode
      const verKey = data.verKey
      let res = await stuLoginAPI({ studentId, password, verKey, verificationCode })
      res = res.data
      if (res.code === 200) {
        token.value = res.data.token
        stuId.value = studentId
        if (res.data.is_first_login) {
          ElNotification({
            message: '为保证您的账号安全，请尽快修改密码',
            type: 'warning',
            duration: 3000,
          })
        }
        return true
      } else {
        ElNotification({
          message: res.msg,
          type: 'warning',
          duration: 3000,
        })
      }
    }
    const getStuInfo = async () => {
      let res = await stuGetInfoAPI(stuId.value)
      res = res.data
      if (res.code === 200) {
        userInfo.value = res.data
      }
      return res
    }
    //退出时清除用户信息
    const clearStuInfo = () => {
      userInfo.value = {}
      token.value = ''
      stuId.value = ''
      systemChoose.value = ''
    }
    //导出数据
    return {
      systemChoose,
      token,
      userInfo,
      stuId,
      login,
      getStuInfo,
      clearStuInfo,
    }
  },
  {
    persist: true,
  },
)
