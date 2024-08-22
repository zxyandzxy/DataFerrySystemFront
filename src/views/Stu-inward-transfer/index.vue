<template>
  <div class="app-container">
    <div class="app-container-inner">
      <h2 style="margin-left: 5%">文件上传列表</h2>
      <el-table :data="tableData" style="width: 90%; margin-left: 3%">
        <el-table-column prop="fileName" label="文件名称" width="250" />
        <el-table-column prop="fileType" label="文件类型" width="200" />
        <el-table-column prop="fileSize" label="文件大小" width="200" />
        <el-table-column prop="uploadTime" label="上传时间" width="300" />
        <el-table-column label="Operations">
          <template v-slot="scope">
            <el-button link type="primary" size="small" @click="download(scope.$index)">
              下载
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 3%; margin-left: 60%"
        background
        layout="prev, pager, next"
        :total="1000"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { viewFileAPI } from '@/api/studentFileProcessing'
  import { useStuStore } from '@/store/modules/student'
  import { ElNotification } from 'element-plus'
  const stuStore = useStuStore()
  onMounted(async () => {
    //从后端拉取数据
    await getTableData()
  })

  const tableData = ref([])

  const getTableData = async () => {
    const res = await viewFileAPI(stuStore.stuId)
    if (res.code == 200) {
      tableData.value = res.data
    } else {
      ElNotification({
        message: res.msg,
        type: 'error',
        duration: 2000,
      })
    }
  }
  /*
  const tableData = [
    {
      uploadId: '1',
      fileName: '1',
      fileType: 'pdf',
      fileSize: '10M',
      uploadTime: '2024-05-02',
      downPath: 'https://dl.acm.org/doi/pdf/10.1145/3663529.3663826',
    },
    {
      uploadId: '2',
      fileName: '2',
      fileType: 'docx',
      fileSize: '10M',
      uploadTime: '2024-05-03',
      downPath:
        'https://ts1.cn.mm.bing.net/th/id/R-C.57384e4c2dd256a755578f00845e60af?rik=uy9%2bvT4%2b7Rur%2fA&riu=http%3a%2f%2fimg06file.tooopen.com%2fimages%2f20171224%2ftooopen_sy_231021357463.jpg&ehk=whpCWn%2byPBvtGi1%2boY1sEBq%2frEUaP6w2N5bnBQsLWdo%3d&risl=&pid=ImgRaw&r=0',
    },
    {
      uploadId: '3',
      fileName: '3',
      fileType: 'ppt',
      fileSize: '10M',
      uploadTime: '2024-05-04',
      downPath:
        'https://tse2-mm.cn.bing.net/th/id/OIP-C.4SPZVrcvZ-Tunx4G4FFtRAAAAA?rs=1&pid=ImgDetMain',
    },
  ]
*/
  const download = (index) => {
    console.log(index)
    const url = tableData[index].downPath // 文件的下载 URL
    console.log(url)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', '')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
</script>

<style scoped lang="scss">
  @import './index';
</style>
