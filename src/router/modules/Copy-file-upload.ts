import Layout from '@/layout/index.vue'

const CopyFileUpload = [
  {
    path: '/',
    component: Layout,
    name: 'Copy-file-upload',
    redirect: '/Copy-file-upload',
    meta: {
      roles: ['copy'],
    },
    children: [
      {
        path: '/Copy-file-upload',
        name: 'Copy-file-upload',
        component: () => import('@/views/Copy-file-upload/index.vue'),
        meta: { title: '外网文件上传', icon: 'FolderOpened', roles: ['copy'] },
      },
    ],
  },
]

export default CopyFileUpload
