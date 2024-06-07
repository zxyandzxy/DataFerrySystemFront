import Layout from '@/layout/index.vue'

const systemConfigRouter = [
  {
    path: '/system',
    component: Layout,
    name: 'system-config',
    alwaysShow: true,
    meta: {
      title: '系统配置',
      icon: 'Grape',
    },
    children: [
      {
        path: '',
        component: () => import('@/views/admin-systemConfig/index.vue'),
        name: 'system-config',
      },
    ],
  },
]

export default systemConfigRouter