import service from './request' // 假设这是你的 Axios 实例
import { Admin } from '../admin-interface/teacher'

// 获取所有管理员信息
export function fetchAdminsAPI(
  pageNum: number,
  pageSize: number,
  adminAccount?: string,
  adminName?: string,
): Promise<any> {
  return service
    .get('/manager/get_admin_list', {
      params: {
        pageNum,
        pageSize,
        adminAccount,
        adminName,
      },
    })
    .then((response) => response.data) // 直接返回data中的total和array部分
}

// 添加管理员
export function addAdminAPI(adminAccount: string, adminName: string): Promise<string> {
  return service
    .post('/manager/add_admin', { adminAccount, adminName })
    .then((response) => response.data.password)
}

// 重置管理员密码
export function resetManagerPasswordAPI(adminAccount: string): Promise<string> {
  return service
    .put('/manager/reset_manager_password', null, {
      params: {
        adminAccount,
      },
    })
    .then((response) => response.data.password)
}

// 删除管理员信息
export function removeAdminAPI(adminAccount: string): Promise<void> {
  return service.delete(`/manager/delete_admin?adminAccount=${adminAccount}`)
}

// 更新管理员个人信息
export function updateAdminAPI(
  adminAccount: string,
  telephone: string,
  wechat: string,
): Promise<null> {
  return service.put(`/manager/update_manager_information`, {
    adminAccount, // 必需字段
    telephone, // 必需字段
    wechat, // 必需字段
  })
}

// 更新管理员密码
export function updateAdminPasswordAPI(
  adminAccount: string,
  curPassword: string,
  newPassword: string,
  newVerPassword: string,
): Promise<void> {
  return service.put(`/manager/update_manager_pwd`, {
    adminAccount, // 传递管理员账号
    curPassword, // 当前密码
    newPassword, // 新密码
    newVerPassword, // 确认新密码
  })
}

// 登录API
export const adminLoginAPI = (data) => {
  return service.post('/manager/login', data).then((response) => response.data.token)
}

// 获取管理员信息API
export const adminGetInfoAPI = (adminAccount: string): Promise<Admin> => {
  return service
    .get(`/manager/get_admin_info`, {
      params: {
        adminAccount, // 通过 query 参数传递 adminAccount
      },
    })
    .then((response) => response.data) // 获取响应中的 data 部分
}
