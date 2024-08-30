import service from './request' // 假设这是你的 Axios 实例
import { Admin } from '../admin-interface/teacher'

// 获取所有管理员信息
export function fetchAdmins(): Promise<Admin[]> {
  return service.get<Admin[]>('/admin/adminlist').then((response) => response.data)
}

// 添加管理员信息
export function addAdmin(admin: Admin): Promise<Admin> {
  return service.post('/admin/addAdmin', admin).then((response) => response.data)
}

// 删除管理员信息
export function removeAdmin(adminId: string): Promise<void> {
  return service.delete(`/admins/${adminId}`)
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
