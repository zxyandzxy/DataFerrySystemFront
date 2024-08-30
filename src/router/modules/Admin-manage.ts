import Layout from '@/layout/index.vue'

const manageRouter = [
  {
    path: '/manage',
    component: Layout,
    redirect: '/manage/student',
    name: 'manage',
    alwaysShow: true,
    meta: {
      title: '管理用户',
      icon: 'School',
    },
    children: [
      {
        path: 'student',
        component: () => import('@/views/Admin-management/manageStudent/index.vue'),
        name: 'manage-student',
        meta: { title: '管理学生', icon: 'UserFilled' },
      },
      {
        path: 'teacher',
        component: () => import('@/views/Admin-management/manageTeacher/index.vue'),
        name: 'manage_teacher',
        meta: { title: '管理管理员', icon: 'Avatar' },
      },
    ],
  },
]

export default manageRouter
