<template>
  <div class="app-container">
    <div class="app-container-inner">
      <div v-if="stuStore.systemChoose != ''">
        <h2 style="margin-left: 5%">文件上传列表</h2>
        <el-input
          v-model="content"
          style="max-width: 600px; margin-left: 5%; margin-bottom: 2%"
          placeholder="文件名称支持模糊搜索，文件类型不支持"
          clearable
          size="large"
        >
          <template #prepend>
            <el-select v-model="select" placeholder="类型" style="width: 115px" size="large">
              <el-option label="文件名称" value="1" />
              <el-option label="文件类型" value="2" />
            </el-select>
          </template>
          <template #append>
            <el-button :icon="Search" @click="searchWithContent" />
          </template>
        </el-input>
        <el-table :data="tableData" style="width: 90%; margin-left: 3%" border>
          <el-table-column prop="fileName" label="文件名称" width="400" />
          <el-table-column prop="fileType" label="文件类型" width="200" />
          <el-table-column prop="fileSize" label="文件大小(MB)" width="200" />
          <el-table-column prop="uploadTime" label="上传时间" width="300" />
          <el-table-column label="操作">
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
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
        />
      </div>
      <div v-else>
        <Error />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { viewFileAPI, downLoadFileAPI } from '@/api/studentFileProcessing'
  import { useStuStore } from '@/store/modules/student'
  import { ElNotification } from 'element-plus'
  import Error from '@/views/error/404.vue'
  import { Search } from '@element-plus/icons-vue'
  const stuStore = useStuStore()
  onMounted(async () => {
    //从后端拉取数据
    await getTableData()
  })

  const tableData = ref([])
  const currentPage = ref(1)
  const total = ref(0)
  const pageSize = ref(10)
  const select = ref('')
  const content = ref('')

  const searchWithContent = async () => {
    if (select.value == '1') {
      // 按文件名搜索
      let res = await viewFileAPI(
        currentPage.value,
        pageSize.value,
        stuStore.stuId,
        -1,
        content.value,
      )
      res = res.data
      if (res.code == 200) {
        for (let i = 0; i < res.data.array.length; i++) {
          res.data.array[i].uploadTime = res.data.array[i].uploadTime.slice(0, 10)
          res.data.array[i].fileSize = (res.data.array[i].fileSize / 1024 / 1024).toFixed(2)
          res.data.array[i].fileType = selectType(res.data.array[i].fileType)
          const fileName = res.data.array[i].fileName
          res.data.array[i].fileName = fileName.substring(findSecondUnderscore(fileName) + 1)
        }
        tableData.value = res.data.array
        total.value = res.data.total
      } else {
        ElNotification({
          message: res.msg,
          type: 'error',
          duration: 2000,
        })
      }
    } else if (select.value == '2') {
      // 按文件类型搜索
      const lowerContent = content.value.toLowerCase()
      let fileTypeNum
      if (lowerContent == 'docx' || lowerContent == 'doc') {
        fileTypeNum = 0
      } else if (lowerContent == 'pdf') {
        fileTypeNum = 1
      } else if (lowerContent == 'pptx' || lowerContent == 'ppt') {
        fileTypeNum = 2
      } else if (lowerContent == 'zip') {
        fileTypeNum = 3
      } else {
        fileTypeNum = 4
      }
      let res = await viewFileAPI(
        currentPage.value,
        pageSize.value,
        stuStore.stuId,
        fileTypeNum,
        '',
      )
      res = res.data
      if (res.code == 200) {
        for (let i = 0; i < res.data.array.length; i++) {
          res.data.array[i].uploadTime = res.data.array[i].uploadTime.slice(0, 10)
          res.data.array[i].fileSize = (res.data.array[i].fileSize / 1024 / 1024).toFixed(2)
          res.data.array[i].fileType = selectType(res.data.array[i].fileType)
          const fileName = res.data.array[i].fileName
          res.data.array[i].fileName = fileName.substring(findSecondUnderscore(fileName) + 1)
        }
        tableData.value = res.data.array
        total.value = res.data.total
      } else {
        ElNotification({
          message: res.msg,
          type: 'error',
          duration: 2000,
        })
      }
    } else {
      // 查询所有
      getTableData()
    }
  }

  const selectType = (type) => {
    switch (type) {
      case 0:
        return 'Docx'
      case 1:
        return 'pdf'
      case 2:
        return 'pptx'
      case 3:
        return 'zip'
      default:
        return '其他'
    }
  }

  const findSecondUnderscore = (str) => {
    // 寻找第一个 '_' 的位置
    const firstIndex = str.indexOf('_')

    // 如果找不到第一个 '_'，直接返回 -1
    if (firstIndex === -1) {
      return -1
    }

    // 从第一个 '_' 之后开始寻找第二个 '_'
    const secondIndex = str.indexOf('_', firstIndex + 1)

    // 如果找不到第二个 '_'，返回 -1
    return secondIndex
  }

  const getTableData = async () => {
    let res = await viewFileAPI(currentPage.value, pageSize.value, stuStore.stuId, -1, '')
    res = res.data
    if (res.code == 200) {
      for (let i = 0; i < res.data.array.length; i++) {
        res.data.array[i].uploadTime = res.data.array[i].uploadTime.slice(0, 10)
        res.data.array[i].fileSize = (res.data.array[i].fileSize / 1024 / 1024).toFixed(2)
        res.data.array[i].fileType = selectType(res.data.array[i].fileType)
        const fileName = res.data.array[i].fileName
        res.data.array[i].fileName = fileName.substring(findSecondUnderscore(fileName) + 1)
      }
      tableData.value = res.data.array
      total.value = res.data.total
    } else {
      ElNotification({
        message: res.msg,
        type: 'error',
        duration: 2000,
      })
    }
  }
  const handleCurrentChange = (val) => {
    currentPage.value = val
    getTableData()
  }
  const download = (index) => {
    downLoadFileAPI(tableData.value[index].upload_id, stuStore.stuId)
  }
</script>

<style scoped lang="scss">
  @import './index';
</style>
