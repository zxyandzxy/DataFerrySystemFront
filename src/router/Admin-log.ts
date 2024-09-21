import Layout from '@/layout/index.vue'

const logRouter = [
  {
    path: '/log',
    component: Layout,
    name: 'log',
    meta: {
      title: '查看日志',
      icon: 'Grape',
    },
    children: [
      {
        path: '',
        component: () => import('@/views/Admin-log/index.vue'),
        name: 'manage-disk',
        meta: { title: '查看日志', keepAlive: true, icon: 'Files' },
      },
    ],
  },
]

export default logRouter
