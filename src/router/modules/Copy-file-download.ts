import Layout from '@/layout/index.vue'

const CopyFileDownload = [
  {
    path: '/',
    component: Layout,
    name: 'Copy-file-download',
    redirect: '/Copy-file-download',
    children: [
      {
        path: '/Copy-file-download',
        name: 'Copy-file-download',
        component: () => import('@/views/Copy-file-download/index.vue'),
        meta: { title: '内网文件拷贝', icon: 'CopyDocument' },
      },
    ],
  },
]

export default CopyFileDownload
