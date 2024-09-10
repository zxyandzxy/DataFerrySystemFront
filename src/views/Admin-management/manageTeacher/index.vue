<template>
  <div class="app-container">
    <div class="app-container-inner">
      <div class="header">
        <h2>管理员列表</h2>
      </div>
      <div class="middle">
        <!-- 搜索 -->
        <div class="search">
          <el-input v-model="searchInfo" class="search-input" placeholder="按照账号查找" />
          <el-button type="primary" @click="onSubmit" :icon="Search" class="search-button">
            查询
          </el-button>
        </div>
        <!-- 添加管理员部分 -->
        <div class="edit">
          <el-button type="primary" @click="openAddAdminDialog">添加管理员</el-button>
        </div>
      </div>
      <!-- 表格部分 -->
      <div class="table">
        <el-table :data="adminList" border style="width: 100%">
          <el-table-column prop="adminAccount" label="账号" width="180" />
          <el-table-column prop="adminName" label="姓名" width="180" />
          <el-table-column prop="telephone" label="电话" />
          <el-table-column prop="wechat" label="微信" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="primary" @click="resetPassword(row)">重置密码</el-button>
              <el-button type="danger" @click="deleteAdmin(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :current-page="pageNum"
          :page-size="pageSize"
          @current-change="handlePageChange"
          @size-change="handlePageSizeChange"
        />
      </div>
    </div>
    <!-- 添加管理员弹窗 -->
    <add-student-dialog
      :show="showAddAdminDialog"
      title="添加管理员"
      field1-name="账号"
      field2-name="姓名"
      field1="adminAccount"
      field2="adminName"
      @update:show="showAddAdminDialog = $event"
      @submit="handleAddAdmin"
    />
    <!-- 重置密码弹窗 -->
    <password-dialog
      :show="showPasswordDialog"
      :new-password="newPassword"
      @update:show="showPasswordDialog = $event"
      :account-info="selectedAdmin"
      title="重置密码成功！"
    />
    <!-- 添加管理员密码回显 -->
    <password-dialog
      :show="showAddPasswordDialog"
      :new-password="addPassword"
      @update:show="showAddPasswordDialog = $event"
      title="添加成功！"
    />
  </div>
</template>

<script setup lang="ts">
  import { Search } from '@element-plus/icons-vue'
  import { onMounted, ref } from 'vue'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import PasswordDialog from '@/admin-components/PasswordDialog.vue'
  import AddStudentDialog from '@/admin-components/AddStudentDialog.vue'
  import {
    addAdminAPI,
    fetchAdminsAPI,
    removeAdminAPI,
    resetManagerPasswordAPI,
  } from '../../../api/admin-teacher'

  const searchInfo = ref('') // 搜索关键字
  const adminList = ref([]) // 管理员列表
  const total = ref(0) // 总的管理员数量，用于分页
  const pageNum = ref(1) // 当前页数
  const pageSize = ref(20) // 每页显示的管理员数量

  const showAddAdminDialog = ref(false)
  const showPasswordDialog = ref(false)
  const showAddPasswordDialog = ref(false)
  const newPassword = ref('')
  const addPassword = ref('')
  const selectedAdmin = ref(null)

  // 获取管理员列表的函数
  const getAdminList = async () => {
    const response = await fetchAdminsAPI(pageNum.value, pageSize.value, searchInfo.value)
    adminList.value = response.adminList // 更新管理员列表
    total.value = response.total // 更新总数
  }

  // 处理搜索操作
  const onSubmit = () => {
    pageNum.value = 1 // 搜索时从第一页开始
    getAdminList() // 获取管理员列表
  }

  // 分页改变时处理
  const handlePageChange = (newPage) => {
    pageNum.value = newPage // 更新当前页
    getAdminList() // 重新获取管理员列表
  }

  // 每页大小改变时处理
  const handlePageSizeChange = (newSize) => {
    pageSize.value = newSize // 更新每页大小
    pageNum.value = 1 // 从第一页开始
    getAdminList() // 重新获取管理员列表
  }

  // 页面加载时获取管理员列表
  onMounted(() => {
    getAdminList()
  })

  // 重置密码的操作
  const resetPassword = async (row) => {
    try {
      await ElMessageBox.confirm(
        `确认重置账号为 ${row.adminAccount} 的管理员的密码吗？`,
        '重置密码',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
      newPassword.value = await resetManagerPasswordAPI(row.adminAccount)
      selectedAdmin.value = row
      showPasswordDialog.value = true
    } catch (error) {
      console.log('重置密码取消')
    }
  }

  // 删除管理员的操作
  const deleteAdmin = async (row) => {
    try {
      await ElMessageBox.confirm(
        `确认删除账号为 ${row.adminAccount} 的管理员的账户吗？`,
        '删除账户',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
      await removeAdminAPI(row.adminAccount)
      ElMessage.success('删除成功')
      getAdminList() // 重新获取管理员列表
    } catch (error) {
      console.log('删除账户取消')
    }
  }

  // 打开添加管理员的弹窗
  const openAddAdminDialog = () => {
    showAddAdminDialog.value = true
  }

  // 处理添加管理员的操作
  const handleAddAdmin = async (form) => {
    try {
      // 调用 API 添加管理员，获取密码
      const password = await addAdminAPI(form.adminAccount, form.adminName)
      addPassword.value = password
      showAddPasswordDialog.value = true
      getAdminList() // 添加成功后重新获取管理员列表
    } catch (err) {
      console.error('添加管理员失败', err)
    }
  }
</script>

<style scoped lang="scss">
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

    .edit {
      display: flex;
      gap: 10px;
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
</style>
