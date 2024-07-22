import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'
import { getSystemConfig } from '../../api/admin-systemConfig'

export interface SystemConfig {
  approvalMode: string
  advancedApproval: boolean
  salt: string
}

export const useSystemConfigStore = defineStore('systemConfig', () => {
  const currentConfig = ref<SystemConfig | null>(null)

  const fetchSystemConfig = async () => {
    try {
      const config = await getSystemConfig()
      currentConfig.value = config.data
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
