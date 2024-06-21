import service from './request' // 假设这是你的 Axios 实例
import { Admin } from '../admin-interface/teacher'

// 获取所有管理员信息
export function fetchAdmins(): Promise<Admin[]> {
  try {
    return service.get<Admin[]>('/admin/adminlist').then((response) => response.data)
  } catch (error) {
    throw new Error(`Failed to fetch admins ${error.message}`)
  }
}

// 添加管理员信息
export function addAdmin(admin: Admin): Promise<Admin> {
  try {
    return service.post('/admin/addAdmin', admin).then((response) => response.data)
  } catch (error) {
    throw new Error(`Failed to add admin: ${error.message}`)
  }
}

// 删除管理员信息
export function removeAdmin(adminId: string): Promise<void> {
  try {
    return service.delete(`/admins/${adminId}`)
  } catch (error) {
    throw new Error(`Failed to remove admin: ${error.message}`)
  }
}

// 更新管理员信息
export function updateAdmin(adminId: string, admin: Admin): Promise<Admin> {
  try {
    return service.put(`admints/${adminId}`, admin).then((response) => response.data)
  } catch (error) {
    throw new Error(`Failed to update admin: ${error.message}`)
  }
}
