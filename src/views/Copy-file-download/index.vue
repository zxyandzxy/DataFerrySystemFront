<template>
  <div class="app-container">
    <div class="app-container-inner">
      <el-row :gutter="20">
        <el-col :span="11">
          <div>
            <h2>内网文件拷贝</h2>
            <div class="account-div">
              <el-form :model="ticketForm" label-width="auto" style="margin-left: 20%">
                <el-form-item label="工单ID">
                  <el-input
                    v-model="ticketForm.id"
                    style="width: 500px"
                    placeholder="请输入工单ID"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="学生学号">
                  <el-input v-model="ticketForm.student_id" placeholder="请输入学号" clearable />
                </el-form-item>
                <el-form-item label="登录密码">
                  <el-input
                    v-model="ticketForm.password"
                    type="password"
                    placeholder="请输入登录密码"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-button style="color: blue; margin-left: 50%" text bg @click="validate">
                验证
              </el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="11">
          <div class="rightContent" v-if="isValid">
            <el-form :model="fileForm" label-width="auto" style="margin-left: 20%">
              <el-form-item label="文件下载链接">
                <div style="display: flex; justify-content: center; align-items: center">
                  <el-input
                    v-model="fileForm.path"
                    placeholder="文件下载链接"
                    disabled
                    style="margin-right: 5%"
                  />
                  <el-icon @click="copyFileDownPath"><DocumentCopy /></el-icon>
                </div>
              </el-form-item>
              <el-form-item label="校验码">
                <div style="display: flex; justify-content: center; align-items: center">
                  <el-input
                    v-model="fileForm.validCode"
                    placeholder="校验码下载"
                    disabled
                    style="margin-right: 5%"
                  />
                  <el-icon @click="copyFileValid"><DocumentCopy /></el-icon>
                </div>
              </el-form-item>
              <el-form-item label="文件解压密码">
                <div style="display: flex; justify-content: center; align-items: center">
                  <el-input
                    v-model="fileForm.deCodePassword"
                    placeholder="文件解压密码"
                    disabled
                    style="margin-right: 5%"
                  />
                  <el-icon @click="copyFilePassword"><DocumentCopy /></el-icon>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import useClipboard from 'vue-clipboard3'
  const { toClipboard } = useClipboard()
  const ticketForm = reactive({
    id: '',
    student_id: '',
    password: '',
  })
  const fileForm = reactive({
    path: 'http://127.0.0.1:8000/download/123456789',
    validCode: '123456789',
    deCodePassword: '123456789',
  })

  const copyFileDownPath = async () => {
    try {
      await toClipboard(fileForm.path)
      ElMessage({
        message: '复制文件校验码成功.',
        type: 'success',
        plain: true,
      })
    } catch (e) {
      ElMessage({
        message: '复制文件校验码失败.',
        type: 'error',
        plain: true,
      })
    }
  }
  const copyFileValid = async () => {
    try {
      await toClipboard(fileForm.validCode)
      ElMessage({
        message: '复制文件校验码成功.',
        type: 'success',
        plain: true,
      })
    } catch (e) {
      ElMessage({
        message: '复制文件校验码失败.',
        type: 'error',
        plain: true,
      })
    }
  }
  const copyFilePassword = async () => {
    try {
      await toClipboard(fileForm.deCodePassword)
      ElMessage({
        message: '复制文件校验码成功.',
        type: 'success',
        plain: true,
      })
    } catch (e) {
      ElMessage({
        message: '复制文件校验码失败.',
        type: 'error',
        plain: true,
      })
    }
  }
  const isValid = ref(false)

  const validate = () => {
    console.log(ticketForm)
    isValid.value = true
  }
</script>

<style scoped lang="scss">
  @import './index';
  .rightContent {
    margin-top: 14%;
  }
</style>
