import service from './request'

export const getLogListAPI = (
  pageNum: number,
  pageSize: number,
  studentAccount: string,
  dateStart: number,
  dateEnd: number,
  isWorkOrderIdNull: boolean,
  existText: boolean,
  isAccountNull: boolean,
) => {
  return service
    .get('/log/get_logs', {
      params: {
        pageNum, // 分页参数
        pageSize, // 每页显示条数
        studentAccount, // 学生账号搜索
        dateStart, // 开始日期
        dateEnd, // 结束日期
        isWorkOrderIdNull, // 工单ID不为空
        existText, // 备注包含‘上传文件’
        isAccountNull, // 管理员账号和学生账号不为空
      },
    })
    .then((response) => response.data.data)
}
