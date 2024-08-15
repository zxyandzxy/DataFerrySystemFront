<template>
  <div class="app-container">
    <div class="app-container-inner">
      <h2 style="margin-left: 5%">文件上传列表</h2>
      <el-table :data="tableData" style="width: 90%; margin-left: 3%">
        <el-table-column prop="id" label="文件编号" width="250" />
        <el-table-column prop="fileType" label="文件类型" width="200" />
        <el-table-column prop="fileSize" label="文件大小" width="200" />
        <el-table-column prop="create_time" label="上传时间" width="300" />
        <el-table-column label="Operations">
          <template #default>
            <el-button link type="primary" size="small" @click="download"> 下载 </el-button>
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
  import { onMounted } from 'vue'
  onMounted(() => {
    //从后端拉取数据
    console.log('mounted')
  })
  const tableData = [
    {
      id: '1',
      fileType: 'pdf',
      fileSize: '10M',
      create_time: '2024-05-02',
    },
    {
      id: '2',
      fileType: 'docx',
      fileSize: '10M',
      create_time: '2024-05-03',
    },
    {
      id: '3',
      fileType: 'ppt',
      fileSize: '10M',
      create_time: '2024-05-04',
    },
  ]
  const download = () => {
    console.log('download')
  }
</script>

<style scoped lang="scss">
  @import './index';
</style>
