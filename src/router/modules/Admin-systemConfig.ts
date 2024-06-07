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
        component: () => import('@/views/admin-systemConfig/index.vue'),
        name: 'system-config',
        meta: { title: '系统配置', keepAlive: true, icon: 'Grape' },
      },
    ],
  },
]

export default systemConfigRouter