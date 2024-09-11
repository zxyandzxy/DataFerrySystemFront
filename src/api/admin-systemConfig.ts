import { systemConfig } from '../admin-interface/systemConfig'
import service from './request'

export function getSystemConfig(): Promise<systemConfig[]> {
  return service.get<systemConfig[]>('/systemConfig').then((response) => response.data)
}
