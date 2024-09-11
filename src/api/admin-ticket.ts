import { ticket } from '../admin-interface/ticket'
import service from './request'

export function getTickets(params: {
  pageNum?: number
  pageSize?: number
  workOrderId?: number
  workOrderTitle?: string
  StudentName?: string
  approvalStatus?: string
}): Promise<ticket[]> {
  return service.get<ticket[]>('/manager/get_list', { params }).then((response) => response.data)
}
