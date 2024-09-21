import Layout from '@/layout/index.vue'

const StuPersonalInformation = [
  {
    path: '/',
    component: Layout,
    name: 'Stu-personal-information',
    redirect: '/Stu-personal-information',
    meta: {
      roles: ['student'],
    },
    children: [
      {
        path: '/Stu-personal-information',
        name: 'Stu-personal-information',
        component: () => import('@/views/Stu-personal-information/index.vue'),
        meta: { title: '个人信息', icon: 'User', roles: ['student'] },
      },
    ],
  },
]

export default StuPersonalInformation
