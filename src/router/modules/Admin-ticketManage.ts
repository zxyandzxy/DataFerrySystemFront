import Layout from '@/layout/index.vue'

const manageTicketRouter = [
  {
    path: '/manageTicket',
    component: Layout,
    name: 'manageTicket',
    alwaysShow: true,
    meta: {
      title: '管理工单',
      icon: 'Grape',
    },
    children: [
      {
        path: '',
        component: () => import('@/views/admin-ticketmanage/index.vue'),
        name: 'manage-ticket',
      },
    ],
  },
]

export default manageTicketRouter