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
        component: () => import('@/views/Admin-diskManage/index.vue'),
        name: 'manage-disk',
        meta: { title: '管理学生磁盘', keepAlive: true, icon: 'Files' },
      },
    ],
  },
]

export default manageDiskRouter
