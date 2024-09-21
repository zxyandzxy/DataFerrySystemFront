import Layout from '@/layout/index.vue'

const adminSelfInfoRouter = [
  {
    path: '/adminInfo',
    component: Layout,
    name: 'admin-self-information',
    meta: {
      title: '个人信息',
      icon: 'User',
      roles: ['admin'],
    },
    children: [
      {
        path: '',
        component: () => import('@/views/Admin-selfInformation/index.vue'),
        name: 'admin-self-information',
        meta: { title: '个人信息', keepAlive: true, icon: 'User', roles: ['admin'] },
      },
    ],
  },
]

export default adminSelfInfoRouter
