import Layout from '@/layout/index.vue'

const StuInwardTransfer = [
  {
    path: '/',
    component: Layout,
    name: 'Stu-inward-transfer',
    redirect: '/Stu-inward-transfer',
    children: [
      {
        path: '/Stu-inward-transfer',
        name: 'Stu-inward-transfer',
        component: () => import('@/views/Stu-inward-transfer/index.vue'),
        meta: { title: '向内传输', icon: 'Files' },
      },
    ],
  },
]

export default StuInwardTransfer
