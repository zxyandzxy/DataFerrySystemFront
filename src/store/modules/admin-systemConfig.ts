import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'
import { getSystemConfig } from '../../api/admin-systemConfig'

export const useSystemConfigStore = defineStore('systemConfig', () => {
  const currentConfig = ref({})

  const fetchSystemConfig = async () => {
    try {
      const config = await getSystemConfig()
      currentConfig.value = config
    } catch (error) {
      ElMessage.error(`获取系统配置失败: ${error.message}`)
    }
  }

  onMounted(() => {
    fetchSystemConfig()
  })

  return {
    currentConfig,
    fetchSystemConfig,
  }
})
