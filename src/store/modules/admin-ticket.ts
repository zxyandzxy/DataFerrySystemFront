import { defineStore } from 'pinia'
import { ticket } from '../../admin-interface/ticket'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { getTickets } from '../../api/admin-ticket'

export const useTicketStore = defineStore('Ticket', () => {
  const tickets = ref<ticket[]>([])

  const fetchTickets = async () => {
    try {
      // 模拟获取数据
      const res = await getTickets()
      tickets.value = res.data
    } catch (error) {
      ElMessage.error(`获取工单列表失败: ${error.message}`)
    }
  }

  onMounted(() => {
    fetchTickets()
  })

  return {
    tickets,
    fetchTickets,
  }
})
