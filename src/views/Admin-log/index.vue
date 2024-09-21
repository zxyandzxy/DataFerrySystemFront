<template>
  <div>
    <div class="app-container">
      <div class="app-container-inner">
        <div v-if="adminStore.systemChoose != ''">
          <div class="header">
            <h2>查看日志列表</h2>
          </div>
          <!-- 表格部分 -->
          <div class="table">
            <el-table :data="logList" border style="width: 100%">
              <el-table-column prop="logId" label="日志ID" width="180" align="center" />
              <el-table-column prop="createTime" label="创建时间" width="180" align="center" />
              <el-table-column prop="workOrderId" label="工单ID" width="180" align="center" />
              <el-table-column prop="studentAccount" label="学生账号" width="180" align="center" />
              <el-table-column prop="adminAccount" label="管理员账号" width="180" align="center" />
              <el-table-column prop="remark" label="备注" align="center" />
            </el-table>
          </div>
          <div class="pagination">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="total"
              :page-size="pageSize"
              :current-page="currentPage"
              @current-change="handlePageChange"
            />
          </div>
        </div>
        <div v-else>
          <Error />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import { getLogListAPI } from '@/api/admin-log' // 导入获取日志列表的API
  import { useAdminStore } from '../../store/modules/admin'
  import Error from '@/views/error/404.vue'

  const logList = ref([]) // 日志列表数据
  const total = ref(0) // 总日志数
  const pageSize = ref(20) // 每页显示条数
  const currentPage = ref(1) // 当前页码
  const adminStore = useAdminStore()

  // 获取日志列表数据
  const getLogList = async () => {
    try {
      const response = await getLogListAPI(currentPage.value, pageSize.value)
      logList.value = response.data // 响应的日志数据
      total.value = response.total // 总条数
    } catch (error) {
      ElMessage.error('获取日志列表失败')
    }
  }

  // 处理页码变化
  const handlePageChange = async (newPage: number) => {
    currentPage.value = newPage
    await getLogList() // 重新获取日志数据
  }

  // 页面加载时获取日志列表
  onMounted(async () => {
    await getLogList()
  })
</script>

<style scoped lang="scss">
  .table {
    margin-top: 30px;
    margin-bottom: 20px;
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .app-container {
    padding: 20px;
  }

  .header h2 {
    margin: 0;
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
  }
</style>
