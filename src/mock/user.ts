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
] as MockMethod[]
