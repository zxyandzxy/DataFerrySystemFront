import Layout from '@/layout/index.vue'

const StuTicketManagement = [
  {
    path: '/',
    component: Layout,
    name: 'Stu-ticket-management',
    redirect: '/Stu-ticket-management',
    meta: {
      roles: ['student'],
    },
    children: [
      {
        path: '/Stu-ticket-management',
        name: 'Stu-ticket-management',
        component: () => import('@/views/Stu-ticket-management/index.vue'),
        meta: { title: '工单管理', icon: 'Grid', roles: ['student'] },
      },
    ],
  },
]

export default StuTicketManagement
