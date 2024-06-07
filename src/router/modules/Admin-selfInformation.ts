import Layout from '@/layout/index.vue'

const adminSelfInfoRouter = [
  {
    path: '/adminInfo',
    component: Layout,
    name: 'admin-self-information',
    alwaysShow: true,
    meta: {
      title: '个人信息',
      icon: 'Grape',
    },
    children: [
      {
        path: '',
        component: () => import('@/views/admin-selfInformation/index.vue'),
        name: 'admin-self-information',
      },
    ],
  },
]

export default adminSelfInfoRouter