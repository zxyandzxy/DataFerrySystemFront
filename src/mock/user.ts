// mock/user.ts

import { en } from 'element-plus/es/locale'
import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/manager/get_student_list',
    method: 'get',
    response: ({ query }) => {
      const { pageNum = 1, pageSize = 10, studentAccount, studentName } = query

      // 使用循环生成模拟学生数据
      const studentData = []
      for (let i = 1; i <= 50; i++) {
        studentData.push({
          studentAccount: String(i),
          studentName: `Student ${i}`,
          telephone: `123-456-78${String(i).padStart(2, '0')}`,
          wechat: `student${i}_wechat`,
        })
      }

      // 过滤数据，根据 studentAccount 或 studentName
      const filteredStudents = studentData.filter((student) => {
        return (
          (!studentAccount || student.studentAccount.includes(studentAccount)) &&
          (!studentName || student.studentName.includes(studentName))
        )
      })

      // 处理分页逻辑
      const total = filteredStudents.length
      const paginatedStudents = filteredStudents.slice((pageNum - 1) * pageSize, pageNum * pageSize)

      return {
        code: 0,
        msg: 'success',
        data: {
          total,
          studentList: paginatedStudents,
        },
      }
    },
  },

  {
    url: '/manager/get_admin_list',
    method: 'get',
    response: ({ query }) => {
      const { pageNum = 1, pageSize = 10, adminAccount, adminName } = query

      // 使用循环生成模拟管理员数据
      const adminData = []
      for (let i = 1; i <= 50; i++) {
        adminData.push({
          id: String(i),
          adminAccount: `admin${String(i).padStart(2, '0')}`,
          adminName: `Admin ${i}`,
          telephone: `987-654-32${String(i).padStart(2, '0')}`,
          wechat: `admin${i}@example.com`,
        })
      }

      // 过滤数据，根据 adminAccount 或 adminName
      const filteredAdmins = adminData.filter((admin) => {
        return (
          (!adminAccount || admin.adminAccount.includes(adminAccount)) &&
          (!adminName || admin.adminName.includes(adminName))
        )
      })

      // 处理分页逻辑
      const total = filteredAdmins.length
      const paginatedAdmins = filteredAdmins.slice((pageNum - 1) * pageSize, pageNum * pageSize)

      return {
        code: 0,
        msg: 'success',
        data: {
          total,
          adminList: paginatedAdmins,
        },
      }
    },
  },

  {
    url: '/manager/add_admin',
    method: 'post',
    response: ({ body }) => {
      const { adminAccount, adminName } = body
      return {
        code: 0,
        msg: 'success',
        data: {
          password: '123456',
        },
      }
    },
  },
  {
    url: '/manager/create_student_account',
    method: 'post',
    response: ({ body }) => {
      const { studentAccount, studentName } = body
      return {
        code: 0,
        msg: 'success',
        data: {
          password: '123456',
        },
      }
    },
  },
  {
    url: '/manager/delete_admin',
    method: 'delete',
    response: ({ query }) => {
      const { adminAccount } = query

      // 检查 adminAccount 参数
      if (!adminAccount) {
        return {
          code: 1,
          msg: 'adminAccount is required',
          data: null,
        }
      }

      return {
        code: 0,
        msg: 'success',
        data: `Admin account ${adminAccount} has been logically deleted`,
      }
    },
  },
  {
    url: '/manager/reset_manager_password',
    method: 'put',
    response: ({ query }) => {
      const { adminAccount } = query
      return {
        code: 0,
        msg: 'success',
        data: {
          password: '123',
        },
      }
    },
  },
  {
    url: '/manager/reset_student_password',
    method: 'put',
    response: ({ query }) => {
      const { studentAccount } = query // 从 query 中获取 studentAccount
      return {
        code: 0,
        msg: 'success',
        data: {
          password: '1213',
        },
      }
    },
  },
  {
    url: '/manager/delete_student_account',
    method: 'delete',
    response: ({ query }) => {
      const { studentAccount } = query

      // 模拟删除逻辑，检查 studentAccount 是否为数组
      if (!studentAccount || !Array.isArray(studentAccount)) {
        return {
          code: 1,
          msg: 'Invalid parameters',
        }
      }

      return {
        code: 0,
        msg: 'success',
        data: `Deleted accounts: ${studentAccount.join(', ')}`,
      }
    },
  },
  {
    url: '/manager/get_batch_file',
    method: 'get',
    response: () => {
      return {
        code: 0,
        msg: 'success',
        data: {
          file: 'https://example.com/path-to-batch-student-template.xlsx', // 模拟文件URL
        },
      }
    },
  },

  {
    url: '/manager/get_admin_info',
    method: 'get',
    response: ({ query }) => {
      const { adminAccount } = query

      // 模拟管理员信息
      const adminInfo = {
        adminAccount: adminAccount || 'defaultAdmin',
        adminName: 'Admin Name',
        telephone: '123-456-7890',
        wechat: 'admin_wechat',
      }

      return {
        code: 0,
        msg: 'success',
        data: adminInfo,
      }
    },
  },

  {
    url: '/manager/get_students_space',
    method: 'get',
    response: ({ query }) => {
      const { pageNum = 1, pageSize = 10 } = query

      // 模拟学生空间数据
      const studentsSpace = []
      for (let i = 0; i < pageSize; i++) {
        studentsSpace.push({
          studentAccount: `student_${(pageNum - 1) * pageSize + i + 1}`,
          studentName: `Student ${(pageNum - 1) * pageSize + i + 1}`,
          usedSpace: `${(Math.random() * 100).toFixed(2)} MB`,
        })
      }

      return {
        code: 0,
        msg: 'success',
        data: {
          total: 100, // 模拟总数
          studentsSpace,
        },
      }
    },
  },

  {
    url: '/manager/delete_files',
    method: 'delete',
    response: ({ body }) => {
      const { studentId, upload_id } = body

      // 模拟删除逻辑，可以根据 studentId 和 upload_id 校验
      if (studentId && upload_id) {
        return {
          code: 0,
          msg: '文件删除成功',
          data: studentId,
        }
      } else {
        return {
          code: 1,
          msg: '参数缺失，无法删除文件',
          data: {
            studentId,
            upload_id,
          },
        }
      }
    },
  },

  {
    url: '/manager/view_files',
    method: 'get',
    response: ({ query }) => {
      const { studentId, pageNum = 1, pageSize = 10 } = query

      // 模拟返回文件数据
      if (studentId) {
        const totalFiles = 50 // 总文件数，模拟
        const files = []

        // 生成固定的文件数据
        for (let i = 0; i < totalFiles; i++) {
          files.push({
            uploadId: i,
            fileName: `file_${i + 1}.pdf`,
            fileSize: (Math.random() * 10).toFixed(2), // 随机生成文件大小
            fileType: i % 2 === 0 ? 1 : 2, // 模拟文件类型
            submissionTime: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(), // 生成最近的提交时间
            fileURL: `https://example.com/files/${studentId}/file_${i + 1}.pdf`,
          })
        }

        // 计算分页数据
        const start = (pageNum - 1) * pageSize
        const end = start + pageSize
        const paginatedFiles = files.slice(start, end)

        return {
          code: 0,
          msg: 'success',
          data: {
            total: totalFiles, // 总文件数
            array: paginatedFiles, // 当前页的文件数据
          },
        }
      } else {
        return {
          code: 1,
          msg: 'studentId 缺失',
          data: null,
        }
      }
    },
  },
  {
    url: '/api/postUser',
    method: 'post',
    response: ({ body }) => {
      return {
        code: 0,
        msg: 'success',
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
        msg: 'success',
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
