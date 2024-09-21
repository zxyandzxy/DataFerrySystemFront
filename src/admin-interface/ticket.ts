export interface ticket {
  id: string
  student_id: number
  admin_id: number
  title: string
  abstract: string
  reason: string
  unzip_password: string
  status: number
  type: number
  is_ahead: boolean
  create_time: Date
  modify_time: Date
}
