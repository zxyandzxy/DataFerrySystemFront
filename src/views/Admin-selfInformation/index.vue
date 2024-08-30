<template>
  <div class="app-container">
    <div class="app-container-inner">
      <div class="profile-container">
        <div class="section">
          <div class="section-title">账户信息</div>
          <div class="section-content">
            <el-form :model="accountForm" label-width="80px">
              <el-form-item label="账号">
                <el-input v-model="accountForm.account" disabled />
              </el-form-item>
              <el-form-item label="姓名">
                <el-input v-model="accountForm.name" disabled />
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="section">
          <div class="section-title">联系方式</div>
          <div class="section-content">
            <el-form :model="contactForm" label-width="80px">
              <el-form-item label="手机号">
                <el-input v-model="contactForm.phone" :disabled="!editMode" />
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
  import { reactive, ref } from 'vue'
  import { ElForm, ElFormItem, ElInput, ElButton, ElDialog } from 'element-plus'

  // 初始化数据
  const accountForm = reactive({
    account: 'user123',
    name: '张三',
  })

  const contactForm = ref({
    phone: '13812345678',
    wechat: 'wechat123',
  })

  const editMode = ref(false)
  const passwordDialogVisible = ref(false)
  const passwordForm = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // 切换编辑模式
  const toggleEditMode = () => {
    if (editMode.value) {
      // 这里可以添加保存逻辑
    }
    editMode.value = !editMode.value
  }

  // 重置联系方式表单
  const resetForm = () => {
    contactForm.value = {
      phone: '13812345678',
      wechat: 'wechat123',
    }
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
  const changePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      // 提示新密码不一致
      alert('新密码和确认密码不一致')
      return
    }
    // 这里添加修改密码的逻辑
    passwordDialogVisible.value = false
    resetPasswordForm() // 成功修改密码后重置表单
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
