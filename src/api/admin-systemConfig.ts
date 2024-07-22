import { systemConfig } from '../admin-interface/systemConfig'
import service from './request'

export function getSystemConfig(): Promise<systemConfig[]> {
  try {
    return service.get<systemConfig[]>('/systemConfig').then((response) => response.data)
  } catch (error) {
    throw new Error(`Failed to fetch systemConfig ${error.message}`)
  }
}
