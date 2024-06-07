import Layout from '@/layout/index.vue'

const manageStudentRouter = [
  {
    path: '/manageStudent',
    component: Layout,
    name: 'manageStudent',
    alwaysShow: true,
    meta: {
      title: '管理学生',
      icon: 'Grape',
    },
    children: [
      {
        path: '',
        component: () => import('@/views/admin-management/manageStudent/index.vue'),
        name: 'manage-student',
      },
    ],
  },
]

export default manageStudentRouter