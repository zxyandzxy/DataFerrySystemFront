// mock/user.ts

import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/admin/studentlist',
    method: 'get',
    response: ({ query }) => {
      return {
        code: 0,
        message: 'success',
        data: [
          {
            id: '1',
            name: 'John Doe',
            phone: '123-456-7890',
            wechat: 'johndoe_wechat',
          },
          {
            id: '2',
            name: 'Jane Smith',
            phone: '098-765-4321',
            wechat: 'janesmith_wechat',
          },
          // 其他学生信息
        ],
      }
    },
  },
  {
    url: '/admin/adminlist',
    method: 'get',
    response: ({ query }) => {
      return {
        code: 0,
        message: 'success',
        data: [
          {
            id: '1',
            name: 'John Doe',
            phone: '123-456-7890',
            wechat: 'johndoe_wechat',
          },
          {
            id: '2',
            name: 'Jane Smith',
            phone: '098-765-4321',
            wechat: 'janesmith_wechat',
          },
          // 其他学生信息
        ],
      }
    },
  },
  {
    url: '/api/postUser',
    method: 'post',
    response: ({ body }) => {
      return {
        code: 0,
        message: 'success',
        data: {
          ...body,
        },
      }
    },
  },
  {
    url: '/systemConfig',
    method: 'get',
    response: ({ query }) => {
      return {
        code: 0,
        message: 'success',
        data: {
          approvalMode: '定期审批',
          advancedApproval: false,
          salt: '',
        },
      }
    },
  },
  {
    url: '/getTickets',
    method: 'get',
    response: ({ query }) => {
      return {
        code: 0,
        message: 'success',
        data: [
          {
            id: '001',
            student_id: 123,
            admin_id: 456,
            title: 'Test1 Ticket',
            abstract: 'This is a test1 ticket.',
            reason: 'Test1 reason',
            unzip_password: 'password123',
            status: 3,
            type: 0,
            is_ahead: false,
            create_time: new Date(),
            modify_time: new Date(),
          },
          {
            id: '002',
            student_id: 123,
            admin_id: 456,
            title: 'Test2 Ticket',
            abstract: 'This is a test2 ticket.',
            reason: 'Test2 reason',
            unzip_password: 'password123',
            status: 21,
            type: 0,
            is_ahead: false,
            create_time: new Date(),
            modify_time: new Date(),
          },
          // 添加更多工单
        ],
      }
    },
  },
] as MockMethod[]
