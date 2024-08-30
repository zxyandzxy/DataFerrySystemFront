<template>
  <div class="app-container">
    <div class="app-container-inner">
      <div class="header">
        <div class="title">管理工单</div>
      </div>
      <div class="middle">
        <!-- 搜索 -->
        <div class="search">
          <el-input v-model="searchInfo" class="search-input" placeholder="按照工单号查找" />
          <el-button type="primary" @click="onSubmit" :icon="Search" class="search-button"
            >查询</el-button
          >
        </div>
      </div>
      <!-- 表格部分 -->
      <div class="table">
        <el-table :data="filteredTickets" border style="width: 100%">
          <el-table-column prop="id" label="工单号" width="180" align="center" />
          <el-table-column prop="title" label="标题" width="180" align="center" />
          <el-table-column prop="student_id" label="发起人" width="180" align="center" />
          <el-table-column prop="create_time" label="发起时间" width="180" align="center" />
          <el-table-column label="审批状态" width="180" align="center">
            <template #default="{ row }">
              {{ row.approvalStatus }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <el-button v-if="row.status === 3" type="primary" @click="approveTicket(row)"
                >审批</el-button
              >
              <el-button v-else type="primary" @click="viewTicket(row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="ticketStore.tickets.length"
          :page-size="pageSize"
          @size-change="handlePageSizeChange"
        />
      </div>
    </div>

    <!-- 弹出窗口 -->
    <el-dialog :title="dialogTitle" v-model="isDialogVisible" width="600px">
      <div>
        <div class="form-item">
          <label>工单标题:</label>
          <el-input v-model="currentTicket.title" readonly />
        </div>
        <div class="form-item">
          <label>工单类型:</label>
          <el-input v-model="currentTicket.type" readonly />
        </div>
        <div class="form-item">
          <label>文件内容:</label>
          <el-link type="primary" href="#" @click="downloadFile">点击下载</el-link>
        </div>
        <div class="form-item">
          <label>文件概述:</label>
          <el-input v-model="currentTicket.abstract" readonly />
        </div>
        <div class="form-item">
          <label>拷贝原因:</label>
          <el-input v-model="currentTicket.reason" readonly />
        </div>
        <div class="form-item">
          <label>发起人:</label>
          <el-input v-model="currentTicket.student_id" readonly />
        </div>
        <div class="form-item">
          <label>提交时间:</label>
          <el-input v-model="currentTicket.create_time" readonly />
        </div>
        <div
          class="form-item"
          v-if="isApproving && systemConfigStore.currentConfig?.advancedApproval"
        >
          <label>超前审批秘钥:</label>
          <el-link type="primary" href="#" @click="generateSecret">点击生成</el-link>
        </div>
        <div class="form-item">
          <label>备注:</label>
          <el-input
            v-model="approvalRemark"
            type="textarea"
            :readonly="!isApproving"
            style="margin-left: 16px"
          />
        </div>
        <div class="form-item" v-if="isApproving">
          <el-button type="primary" @click="submitApproval">审批通过</el-button>
          <el-button type="danger" @click="rejectApproval">审批驳回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { Search } from '@element-plus/icons-vue'
  import { ref, computed, onMounted } from 'vue'
  import { useTicketStore } from '@/store/modules/admin-ticket'
  import { useSystemConfigStore } from '@/store/modules/admin-systemConfig'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import { ticket } from '../../admin-interface/ticket'

  const searchInfo = ref('')
  const ticketStore = useTicketStore()
  const systemConfigStore = useSystemConfigStore()
  const isDialogVisible = ref(false)
  const isApproving = ref(false)
  const currentTicket = ref<ticket | null>(null)
  const approvalRemark = ref('')

  const pageSize = ref(20) // 默认每页显示条数

  const statusMap = {
    1: '创建中',
    2: '处理中',
    3: '审批中',
    11: '可拷贝',
    21: '审批通过',
    22: '审批驳回',
  }

  const filteredTickets = computed(() => {
    if (!searchInfo.value) {
      return ticketStore.tickets
    }
    return ticketStore.tickets.filter((ticket: ticket) => ticket.id.includes(searchInfo.value))
  })

  const onSubmit = () => {
    // 查询逻辑
  }

  const approveTicket = async (ticket: ticket) => {
    isApproving.value = true
    currentTicket.value = ticket
    isDialogVisible.value = true
  }

  const viewTicket = (ticket: ticket) => {
    isApproving.value = false
    currentTicket.value = ticket
    isDialogVisible.value = true
  }

  const submitApproval = () => {
    // 审批通过逻辑
    ElMessage.success(`工单号为 ${currentTicket.value?.id} 的工单审批通过`)
    isDialogVisible.value = false
  }

  const rejectApproval = () => {
    // 审批驳回逻辑
    ElMessage.success(`工单号为 ${currentTicket.value?.id} 的工单审批驳回`)
    isDialogVisible.value = false
  }

  const handlePageSizeChange = (newSize: number) => {
    pageSize.value = newSize
    // 可以在这里添加请求数据的逻辑，根据新的 pageSize 请求对应的数据
  }

  const downloadFile = () => {
    // 下载文件逻辑
  }

  const generateSecret = () => {
    // 生成秘钥逻辑
  }

  onMounted(() => {
    ticketStore.fetchTickets()
    systemConfigStore.fetchSystemConfig()
  })

  const dialogTitle = computed(() => (isApproving.value ? '工单审批' : '工单查看'))
</script>

<style scoped lang="scss">
  @import './index';

  .middle {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;

    .search {
      display: flex;
      .search-input {
        width: 700px;
      }
      .search-button {
        margin-left: 20px;
      }
    }
  }

  .table {
    margin-top: 30px;
    margin-bottom: 20px;
  }

  .pagination {
    display: flex;
    justify-content: flex-end; /* 将内容靠右对齐 */
    align-items: center; /* 垂直居中 */
  }

  .form-item {
    margin-bottom: 20px;
    display: flex;
    align-items: center;

    label {
      width: 100px;
    }

    .el-input,
    .el-link {
      flex: 1;
    }
  }

  .form-item .el-button {
    margin-right: 10px;
  }
</style>
