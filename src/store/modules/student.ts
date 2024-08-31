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
      const res = await stuLoginAPI({ studentId, password, verKey, verificationCode })
      if (res.code === 200) {
        token.value = res.data.token
        stuId.value = studentId
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
      const res = await stuGetInfoAPI(stuId.value)
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
