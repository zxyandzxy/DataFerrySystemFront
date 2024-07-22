import Layout from '@/layout/index.vue'

const manageTicketRouter = [
  {
    path: '/manageTicket',
    component: Layout,
    name: 'manageTicket',
    meta: {
      title: '管理工单',
      icon: 'Grape',
    },
    children: [
      {
        path: '',
        component: () => import('@/views/Admin-ticketManage/index.vue'),
        name: 'manage-ticket',
        meta: { title: '管理工单', keepAlive: true, icon: 'Grape' },
      },
    ],
  },
]

export default manageTicketRouter
