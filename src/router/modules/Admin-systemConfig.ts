import Layout from '@/layout/index.vue'

const systemConfigRouter = [
  {
    path: '/system',
    component: Layout,
    name: 'system-config',
    meta: {
      title: '系统配置',
      icon: 'Grape',
    },
    children: [
      {
        path: '',
        component: () => import('@/views/Admin-systemConfig/index.vue'),
        name: 'system-config',
        meta: { title: '系统配置', keepAlive: true, icon: 'Setting' },
      },
    ],
  },
]

export default systemConfigRouter
