<template>
  <div>
    <div class="app-container">
      <div class="app-container-inner">
        <div v-if="adminStore.systemChoose != ''">
          <div class="header">
            <h2>管理工单</h2>
          </div>
          <div class="middle">
            <!-- 搜索 -->
            <div class="search">
              <div class="search-type">
                <el-select v-model="searchType" placeholder="选择查询条件">
                  <el-option label="工单号" value="workOrderId"></el-option>
                  <el-option label="工单标题" value="workOrderTitle"></el-option>
                  <el-option label="发起人姓名" value="studentName"></el-option>
                  <el-option label="工单审批状态" value="auditType"></el-option>
                </el-select>
              </div>
              <el-input
                v-model="searchInfo"
                class="search-input"
                :placeholder="searchMap[searchType]"
              />
              <el-button type="primary" @click="onSubmit" :icon="Search" class="search-button">
                查询
              </el-button>
            </div>
          </div>
          <!-- 表格部分 -->
          <div class="table">
            <el-table :data="ticketList" border style="width: 100%">
              <el-table-column prop="workOrderId" label="工单号" width="180" align="center" />
              <el-table-column prop="workOrderTitle" label="标题" width="180" align="center" />
              <el-table-column prop="studentName" label="发起人" width="180" align="center" />
              <el-table-column prop="createTime" label="发起时间" width="180" align="center" />
              <el-table-column label="工单审批状态" width="180" align="center">
                <template #default="{ row }">
                  {{ statusMap[row.auditType] }}
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template #default="{ row }">
                  <el-button type="primary" @click="viewTicket(row)">{{
                    row.auditType === 11 ? '查看' : '审批'
                  }}</el-button>
                </template>
              </el-table-column>
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
      <!-- 弹出窗口 -->
      <el-dialog title="工单详情" v-model="isDialogVisible" width="600px">
        <div>
          <div class="form-item">
            <label>工单标题:</label>
            <el-input v-model="currentTicket.workOrderTitle" readonly />
          </div>
          <div class="form-item">
            <label>审批类型:</label>
            <el-input v-model="currentTicket.auditType" readonly />
          </div>
          <div class="form-item">
            <label>文件内容:</label>
            <el-link type="primary" :href="currentTicket.fileURL" target="_blank">点击下载</el-link>
          </div>
          <div class="form-item">
            <label>文件概述:</label>
            <el-input v-model="currentTicket.fileAbstract" readonly />
          </div>
          <div class="form-item">
            <label>拷贝原因:</label>
            <el-input v-model="currentTicket.copyReason" readonly />
          </div>
          <div class="form-item">
            <label>发起人:</label>
            <el-input v-model="currentTicket.studentName" readonly />
          </div>
          <div class="form-item">
            <label>提交时间:</label>
            <el-input v-model="currentTicket.create_time" readonly />
          </div>
          <div class="form-item">
            <label>备注:</label>
            <el-input
              v-model="currentTicket.remark"
              type="textarea"
              :readonly="
                !(
                  currentTicket.auditType === 1 ||
                  currentTicket.auditType === 2 ||
                  currentTicket.auditType === 3
                )
              "
            />
          </div>
          <div v-if="[1, 2, 3].includes(currentTicket?.auditType)">
            <el-button type="primary" @click="approveTicket(21)">审批通过</el-button>
            <el-button type="danger" @click="approveTicket(22)">审批驳回</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Search } from '@element-plus/icons-vue'
  import { ref, computed, onMounted } from 'vue'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import { useAdminStore } from '@/store/modules/admin'
  import {
    getTicketListAPI,
    getWorkOrderDetailAPI,
    reviewWorkOrderAPI,
  } from '../../api/admin-ticket'
  import Error from '@/views/error/404.vue'

  const ticketList = ref([]) // 工单列表
  const total = ref(0) // 总工单数
  const isDialogVisible = ref(false) // 控制弹窗显示
  const currentTicket = ref(null) // 当前查看的工单信息
  const pageSize = ref(20) // 默认每页显示条数
  const currentPage = ref(1) // 当前页码

  const searchType = ref('workOrderId')
  const searchInfo = ref('')

  const searchMap = {
    workOrderId: '按照工单号查询',
    workOrderTitle: '按照工单标题查询',
    studentName: '按照发起人姓名查询',
    auditType: '按照工单审批状态查询',
  }
  const statusMap = {
    '1': '创建中',
    '2': '处理中',
    '3': '审批中',
    '11': '可拷贝',
    '21': '审批通过',
    '22': '审批驳回',
  }

  const adminStore = useAdminStore()

  // 获取工单列表
  const getTicketList = async () => {
    // 动态构建 API 查询参数
    const searchParams = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      workOrderId: searchType.value === 'workOrderId' ? searchInfo.value : '',
      workOrderTitle: searchType.value === 'workOrderTitle' ? searchInfo.value : '',
      studentName: searchType.value === 'studentName' ? searchInfo.value : '',
      auditType: searchType.value === 'auditType' ? searchInfo.value || 0 : 0,
    }
    try {
      const response = await getTicketListAPI(searchParams)
      // console.log(response)

      ticketList.value = response.items
      total.value = response.total
    } catch (error) {
      ElMessage.error('获取工单列表失败')
    }
  }

  // 查询逻辑
  const onSubmit = async () => {
    currentPage.value = 1
    await getTicketList()
  }

  // 查看工单详情
  const viewTicket = async (ticket: any) => {
    try {
      const response = await getWorkOrderDetailAPI(ticket.workOrderId)
      currentTicket.value = response
      isDialogVisible.value = true
    } catch (error) {
      ElMessage.error('获取工单详情失败')
    }
  }

  // 处理页码变化
  const handlePageChange = async (newPage: number) => {
    currentPage.value = newPage
    await getTicketList() // 重新获取数据
  }

  // 工单审批
  // 审批工单
  const approveTicket = async (status: number) => {
    try {
      const params = {
        workOrderId: currentTicket.value.workOrderId,
        adminAccount: adminStore.currentAdminAccount, // 这里需要替换为实际的管理员账号
        workOrderStatus: status,
        remark: currentTicket.value.remark || '审批备注', // 可以根据需要填写备注
      }
      await reviewWorkOrderAPI(params) // 调用API进行审批
      ElMessage.success(status === 21 ? '审批通过' : '审批驳回')
      isDialogVisible.value = false // 关闭弹窗
      await getTicketList() // 刷新工单列表
    } catch (error) {
      ElMessage.error('审批操作失败')
    }
  }

  onMounted(async () => {
    await getTicketList()
  })

  // const dialogTitle = computed(() => (currentTicket.value ? '工单详情' : '工单查看'))
</script>

<style scoped lang="scss">
  .middle {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;

    .search {
      display: flex;
      .search-type {
        width: 160px;
        margin-right: 20px;
      }
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
    justify-content: flex-end;
    align-items: center;
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
</style>
