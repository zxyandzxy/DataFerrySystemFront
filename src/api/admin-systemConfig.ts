import service from './request'

export function getSystemConfig(): Promise<any> {
  return service.get('/manager/get_audit_mode').then((response) => response.data.data)
}

export function switchAuditMode(auditType, advanceApproval, saltValue = null, password) {
  const data = {
    auditType: auditType, // 必需
    advanceApproval: advanceApproval, // 必需
    saltValue: saltValue, // 可选
    password: password, // 根管理员密码
  }

  return service.put('/manager/audit_mode_switch', data).then((response) => response.data.data)
}
