<template>
  <div class="app-container">
    <div class="app-container-inner">
      <h3 style="margin-left: 5%">账号信息</h3>
      <div class="account-div">
        <el-form :model="studentForm" label-width="auto" style="margin-left: 20%">
          <el-form-item label="学号">
            <el-input disabled v-model="studentForm.student_id" style="width: 500px" />
          </el-form-item>
          <el-form-item label="姓名">
            <el-input disabled v-model="studentForm.student_name" />
          </el-form-item>
          <el-form-item label="密码">
            <el-button style="color: blue" text bg @click="changePwd"> 修改密码 </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-divider />
      <h3 style="margin-left: 5%">联系方式</h3>
      <div class="account-div">
        <el-form :model="studentForm" label-width="auto" style="margin-left: 20%">
          <el-form-item label="电话">
            <el-input disabled v-model="studentForm.telephone" style="width: 500px" />
          </el-form-item>
          <el-form-item label="微信号">
            <el-input disabled v-model="studentForm.wechat" />
          </el-form-item>
          <el-form-item label="微信号">
            <el-button style="color: blue" text bg @click="changeLink"> 编辑 </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-dialog v-model="changePwdDialogVisible" title="修改密码" width="40%">
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="passwordRules"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="当前密码">
            <el-input
              v-model="ruleForm.curPassword"
              type="password"
              placeholder="请输入原来的密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input
              v-model="ruleForm.password"
              type="password"
              placeholder="请输入新密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input
              v-model="ruleForm.confirmPassword"
              type="password"
              placeholder="请确认新的密码"
            ></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="changePwdDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitChangePwd">确定</el-button>
          </span>
        </template>
      </el-dialog>
      <el-dialog v-model="changeLinkDialogVisible" title="编辑联系方式" width="40%">
        <el-form
          ref="ruleFormRef"
          :model="linkForm"
          :rules="linkRules"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="手机号">
            <el-input
              v-model="linkForm.telephone"
              type="text"
              placeholder="请输入新手机号"
            ></el-input>
          </el-form-item>
          <el-form-item label="微信号">
            <el-input v-model="linkForm.wechat" type="text" placeholder="请输入新微信号"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="changeLinkDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitChangeLink">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import type { ElForm } from 'element-plus'
  const changePwdDialogVisible = ref(false)
  const changeLinkDialogVisible = ref(false)

  const ruleForm = reactive({
    curPassword: '',
    password: '',
    confirmPassword: '',
  })

  const linkForm = reactive({
    telephone: '',
    wechat: '',
  })

  const passwordRules = reactive({
    curPassword: [
      {
        required: true,
        message: '请输入当前密码',
        trigger: 'blur',
      },
    ],
    password: [
      {
        required: true,
        message: '请输入新密码',
        trigger: 'blur',
      },
    ],
    confirmPassword: [
      {
        required: true,
        message: '请确认新的密码',
        trigger: 'blur',
      },
      {
        validator: (rule: any, value: any, callback: any) => {
          if (value !== ruleForm.password) {
            callback(new Error('两次输入的密码不一致'))
          } else {
            callback()
          }
        },
        trigger: 'blur',
      },
    ],
  })

  const linkRules = reactive({
    telephone: [
      {
        required: true,
        message: '请输入手机号',
        trigger: 'blur',
      },
    ],
    wechat: [
      {
        required: true,
        message: '请输入微信号',
        trigger: 'blur',
      },
    ],
  })

  const studentForm = reactive({
    student_id: 'test',
    student_name: 'test',
    telephone: 'test',
    wechat: 'test',
  })

  const submitChangePwd = () => {
    // 执行API接口，判断修改密码逻辑
    alert('修改密码成功')
    changePwdDialogVisible.value = false
  }

  const submitChangeLink = () => {
    // 执行API接口，判断修改联系方式逻辑
    alert('修改联系方式成功')
    changeLinkDialogVisible.value = false
  }

  const changePwd = () => {
    changePwdDialogVisible.value = true
  }

  const changeLink = () => {
    changeLinkDialogVisible.value = true
  }
</script>

<style scoped lang="scss">
  @import './index';
  .account-div {
    display: flex;
    justify-content: flex-start; /* 默认就是靠左，但为了明确可以写上 */
    align-items: center; /* 垂直居中 */
  }
</style>
