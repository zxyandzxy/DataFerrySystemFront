import service from './request'

export const getLogListAPI = (pageNum: number, pageSize: number) => {
  return service
    .get('/log/get_logs', {
      params: {
        pageNum, // 分页参数
        pageSize, // 每页显示条数
      },
    })
    .then((response) => response.data.data)
}
