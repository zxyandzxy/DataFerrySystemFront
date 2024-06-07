import Layout from '@/layout/index.vue'

const manageDiskRouter = [
  {
    path: '/manageDisk',
    component: Layout,
    name: 'manageDisk',
    meta: {
      title: '管理学生磁盘',
      icon: 'Grape',
    },
    children: [
      {
        path: '',
        component: () => import('@/views/admin-diskmanage/index.vue'),
        name: 'manage-teacher',
        meta: { title: '管理学生磁盘', keepAlive: true, icon: 'MenuIcon' },
      },
    ],
  },
]

export default manageDiskRouter