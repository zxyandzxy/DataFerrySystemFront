import Layout from '@/layout/index.vue'

const manageTeacherRouter = [
  {
    path: '/manageTeacher',
    component: Layout,
    name: 'manageTeacher',
    alwaysShow: true,
    meta: {
      title: '管理管理员',
      icon: 'Grape',
    },
    children: [
      {
        path: '',
        component: () => import('@/views/admin-management/manageTeacher/index.vue'),
        name: 'manage-teacher',
      },
    ],
  },
]

export default manageTeacherRouter