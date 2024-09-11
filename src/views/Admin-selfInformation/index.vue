<template>
  <div class="app-container">
    <div class="app-container-inner">
      <div class="profile-container">
        <div class="section">
          <div class="section-title">账户信息</div>
          <div class="section-content">
            <el-form :model="currentAdmin" label-width="80px">
              <el-form-item label="账号">
                <el-input v-model="currentAdmin.adminAccount" disabled />
              </el-form-item>
              <el-form-item label="姓名">
                <el-input v-model="currentAdmin.adminName" disabled />
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="section">
          <div class="section-title">联系方式</div>
          <div class="section-content">
            <el-form :model="contactForm" label-width="80px">
              <el-form-item label="手机号">
                <el-input v-model="contactForm.telephone" :disabled="!editMode" />
              </el-form-item>
              <el-form-item label="微信号">
                <el-input v-model="contactForm.wechat" :disabled="!editMode" />
              </el-form-item>
            </el-form>
            <div class="edit-buttons">
              <el-button type="primary" @click="toggleEditMode">
                {{ editMode ? '保存' : '编辑' }}
              </el-button>
              <el-button v-if="editMode" @click="resetForm">取消</el-button>
              <el-button type="warning" @click="openPasswordDialog">修改密码</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="修改密码" v-model="passwordDialogVisible" @close="resetPasswordForm">
      <el-form :model="passwordForm" label-width="100px">
        <el-form-item label="旧密码">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            show-password
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="changePassword">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { useAdminStore } from '@/store/modules/admin'
  import { adminGetInfoAPI, updateAdminAPI, updateAdminPasswordAPI } from '../../api/admin-teacher'
  import { Admin } from '../../admin-interface/teacher'

  const manageAdminStore = useAdminStore()

  // 绑定当前管理员数据
  const currentAdmin = ref<Admin>({
    adminAccount: '',
    adminName: '',
    telephone: '',
    wechat: '',
  })

  // 绑定联系方式表单
  const contactForm = reactive({
    telephone: '',
    wechat: '',
  })

  // 获取管理员信息
  const getAdminSelfInfo = async () => {
    const data = await adminGetInfoAPI(manageAdminStore.adminId)
    currentAdmin.value.adminAccount = manageAdminStore.adminId
    currentAdmin.value.adminName = data.adminName
    currentAdmin.value.telephone = data.telephone
    currentAdmin.value.wechat = data.wechat

    // 更新联系方式表单
    contactForm.telephone = data.telephone
    contactForm.wechat = data.wechat
  }

  onMounted(async () => {
    await getAdminSelfInfo()
  })

  // 初始化编辑模式和密码弹窗状态
  const editMode = ref(false)
  const passwordDialogVisible = ref(false)
  const passwordForm = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // 切换编辑模式
  const toggleEditMode = async () => {
    if (editMode.value) {
      // 保存联系方式修改
      await updateAdminAPI(
        currentAdmin.value.adminAccount,
        contactForm.telephone,
        contactForm.wechat,
      )
      getAdminSelfInfo()
    }
    editMode.value = !editMode.value
  }

  // 重置联系方式表单
  const resetForm = () => {
    contactForm.telephone = currentAdmin.value.telephone
    contactForm.wechat = currentAdmin.value.wechat
    editMode.value = false
  }

  // 打开修改密码弹窗
  const openPasswordDialog = () => {
    passwordDialogVisible.value = true
  }

  // 重置密码表单
  const resetPasswordForm = () => {
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  }

  // 修改密码
  const changePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('新密码和确认密码不一致')
      return
    }
    try {
      // 调用更新密码 API
      await updateAdminPasswordAPI(
        currentAdmin.value.adminAccount,
        passwordForm.oldPassword,
        passwordForm.newPassword,
        passwordForm.confirmPassword,
      )
      passwordDialogVisible.value = false
      resetPasswordForm() // 成功修改密码后重置表单
    } catch (error) {
      alert('修改密码失败')
    }
  }
</script>

<style scoped lang="scss">
  .profile-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  .section {
    margin-bottom: 20px;
  }

  .section-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .section-content {
    padding: 20px;
  }

  .edit-buttons {
    margin-top: 10px;
    display: flex;
    gap: 10px;
  }

  .dialog-footer {
    text-align: right;
  }
</style>
