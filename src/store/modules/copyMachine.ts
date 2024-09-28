import { copy } from 'clipboard'
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useCopyMachineStore = defineStore(
  'copyMachine',
  () => {
    //定义数据state
    const systemChoose = ref('')
    const token = ref()
    const roles = ref([])
    //定义获取接口数据的action函数
    const login = async (Choose) => {
      roles.value = ['copy']
      token.value =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      systemChoose.value = Choose
      return true
    }
    //退出时清除用户信息
    const clearCopyMachineInfo = () => {
      systemChoose.value = ''
    }
    //导出数据
    return {
      systemChoose,
      token,
      login,
      clearCopyMachineInfo,
      copy,
      roles,
    }
  },
  {
    persist: true,
  },
)
