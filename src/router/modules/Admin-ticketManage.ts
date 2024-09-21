import Layout from '@/layout/index.vue'

const manageTicketRouter = [
  {
    path: '/manageTicket',
    component: Layout,
    name: 'manageTicket',
    meta: {
      title: '管理工单',
      icon: 'Grape',
      roles: ['admin'],
    },
    children: [
      {
        path: '',
        component: () => import('@/views/Admin-ticketManage/index.vue'),
        name: 'manage-ticket',
        meta: { title: '管理工单', keepAlive: true, icon: 'Tickets', roles: ['admin'] },
      },
    ],
  },
]

export default manageTicketRouter
