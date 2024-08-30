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
    url: '/manager/get_list',
    method: 'get',
    response: ({ query }) => {
      return {
        code: 0, // 状态码
        msg: 'success', // 返回信息
        data: [
          {
            workOrderId: 1, // 工单Id
            workOrderTitle: 'Test1 Ticket', // 工单标题
            studentId: 123, // 发起人Id
            startTime: new Date().toISOString(), // 发起时间
            approvalStatus: 'Approved', // 审核状态
          },
          {
            workOrderId: 2, // 工单Id
            workOrderTitle: 'Test2 Ticket', // 工单标题
            studentId: 123, // 发起人Id
            startTime: new Date().toISOString(), // 发起时间
            approvalStatus: 'Pending', // 审核状态
          },
          // 继续添加更多工单
        ],
      }
    },
  },
  // 学生登录
  {
    url: '/student/login',
    method: 'post',
    response: ({ body }) => {
      const { studentId, password, verification_code } = body

      // 假设我们有一个简单的验证逻辑
      if (studentId === '1' && password === '1' && verification_code === '1') {
        return {
          code: 200,
          data: {
            token: 'mock-token-123456',
          },
          msg: '登录成功',
        }
      } else {
        return {
          code: 401,
          msg: '用户名或密码错误',
        }
      }
    },
  },
] as MockMethod[]
