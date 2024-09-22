import Layout from '@/layout/index.vue'

const logRouter = [
  {
    path: '/log',
    component: Layout,
    name: 'log',
    meta: {
      title: '查看日志',
      icon: 'Grape',
      roles: ['admin'],
    },
    children: [
      {
        path: '',
        component: () => import('@/views/Admin-log/index.vue'),
        name: 'log',
        meta: { title: '查看日志', keepAlive: true, icon: 'Notebook', roles: ['admin'] },
      },
    ],
  },
]

export default logRouter
