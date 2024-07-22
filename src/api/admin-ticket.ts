import { ticket } from '../admin-interface/ticket'
import service from './request'

export function getTickets(): Promise<ticket[]> {
  try {
    return service.get<ticket[]>('/getTickets').then((response) => response.data)
  } catch (error) {
    throw new Error(`Failed to fetch Tickets ${error.message}`)
  }
}
