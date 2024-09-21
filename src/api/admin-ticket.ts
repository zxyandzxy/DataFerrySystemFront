import service from './request'

export function getTicketListAPI(params: {
  pageNum: number
  pageSize: number
  workOrderId: string
  workOrderTitle: string
  studentName: string
  auditType: number
}): Promise<any> {
  return service
    .get('/manager/get_list', {
      params,
    })
    .then((response) => response.data.data)
}

export function getWorkOrderDetailAPI(workOrderId: string, studentId = ''): Promise<any> {
  return service
    .get('/manager/get_detail_work_order', {
      params: {
        workOrderId,
        studentId,
      },
    })
    .then((response) => response.data.data)
}

export const reviewWorkOrderAPI = async (params: {
  workOrderId: string
  adminAccount: string
  workOrderStatus: number
  remark: string
}): Promise<any> => {
  return service.put('/manager/work_order_review', { params })
}
