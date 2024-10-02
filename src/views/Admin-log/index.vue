<template>
  <div class="app-container">
    <div class="app-container-inner">
      <div v-if="adminStore.systemChoose != ''">
        <div class="header">
          <h2>查看日志列表</h2>
        </div>

        <!-- 搜索部分 -->
        <div class="search">
          <el-input
            v-model="searchStudentAccount"
            placeholder="输入学生学号进行搜索"
            class="search-input"
            style="width: 200px"
          />
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            class="search-date"
            style="margin-right: 10px"
          />

          <!-- 类型选择 -->
          <div class="checkbox">
            <el-checkbox v-model="isWorkOrderIdNull">工单ID不为空</el-checkbox>
            <el-checkbox v-model="existText">上传文件记录</el-checkbox>
            <el-checkbox v-model="isAccountNull">管理员和学生账号不为空</el-checkbox>
          </div>

          <el-button type="primary" @click="onSearch" icon="Search">搜索</el-button>
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
</template>

<script setup lang="ts">
  import { Search } from '@element-plus/icons-vue'
  import { ref, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import { getLogListAPI } from '@/api/admin-log'
  import { useAdminStore } from '../../store/modules/admin'
  import Error from '@/views/error/404.vue'

  const logList = ref([]) // 日志列表
  const total = ref(0) // 总条数
  const pageSize = ref(7) // 每页显示条数
  const currentPage = ref(1) // 当前页码

  const searchStudentAccount = ref('') // 学生学号搜索
  const dateRange = ref([]) // 时间区间
  const isWorkOrderIdNull = ref(false) // 工单ID不为空
  const existText = ref(false) // 备注包含‘上传文件’
  const isAccountNull = ref(false) // 管理员账号和学生账号不为空

  const adminStore = useAdminStore()

  // 获取日志列表数据
  const getLogList = async () => {
    const params = {
      studentAccount: searchStudentAccount.value,
      startDate: dateRange.value[0] ? new Date(dateRange.value[0]).getTime() : null, // 开始时间戳
      endDate: dateRange.value[1] ? new Date(dateRange.value[1]).getTime() : null, // 结束时间戳
      isWorkOrderIdNull: isWorkOrderIdNull.value, // 工单ID不为空
      existText: existText.value, // 备注包含“上传文件”
      isAccountNull: isAccountNull.value, // 管理员账号和学生账号不为空
      pageNum: currentPage.value,
      pageSize: pageSize.value,
    }

    try {
      const response = await getLogListAPI(
        params.pageNum,
        params.pageSize,
        params.studentAccount,
        params.startDate,
        params.endDate,
        params.isWorkOrderIdNull, // 新增的布尔参数
        params.existText, // 新增的布尔参数
        params.isAccountNull, // 新增的布尔参数
      )
      logList.value = response.items
      total.value = response.total
    } catch (error) {
      ElMessage.error('获取日志列表失败')
    }
  }

  // 处理页码变化
  const handlePageChange = async (newPage: number) => {
    currentPage.value = newPage
    await getLogList()
  }

  // 搜索操作
  const onSearch = async () => {
    currentPage.value = 1 // 重置页码
    await getLogList() // 重新获取日志数据
  }

  // 页面加载时获取日志列表
  onMounted(async () => {
    await getLogList()
  })
</script>

<style scoped lang="scss">
  @import './index';
  .search {
    display: flex;
    margin-bottom: 20px;
    align-items: center;
    .checkbox {
      width: 500px;
    }

    .search-input {
      margin-right: 10px;
    }

    .search-date {
      margin-right: 10px;
    }

    .search-types {
      margin-right: 10px;
    }
  }

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
</style>
