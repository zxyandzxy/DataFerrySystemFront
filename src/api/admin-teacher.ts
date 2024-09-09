import service from './request' // 假设这是你的 Axios 实例
import { Admin } from '../admin-interface/teacher'

// 获取所有管理员信息
export function fetchAdmins(): Promise<Admin[]> {
  return service.get<Admin[]>('/manager/get_admin_list').then((response) => response.data)
}

// 添加管理员
export function addAdmin(adminAccount: string, adminName: string): Promise<{ password: string }> {
  return service
    .post('/manager/add_admin', { adminAccount, adminName })
    .then((response) => response.data)
}

// 重置管理员密码
export function resetManagerPassword(adminAccount: string): Promise<{ password: string }> {
  return service
    .put('/manager/reset_manager_password', null, {
      params: {
        adminAccount,
      },
    })
    .then((response) => response.data)
}

// 删除管理员信息
export function removeAdmin(adminAccount: string): Promise<void> {
  return service.delete(`/manager/delete_admin?adminAccount=${adminAccount}`)
}

// 更新管理员信息
export function updateAdmin(adminId: string, admin: Admin): Promise<Admin> {
  return service.put(`admints/${adminId}`, admin).then((response) => response.data)
}

// 登录API
export const adminLoginAPI = (data) => {
  return service.post('/api/admin/login', data)
}

// 获取管理员信息API
export const adminGetInfoAPI = (adminId) => {
  return service.get(`/api/admin/info/${adminId}`)
}
