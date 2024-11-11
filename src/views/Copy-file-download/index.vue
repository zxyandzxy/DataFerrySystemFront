<template>
  <div class="app-container">
    <div class="app-container-inner">
      <div v-if="copyMachineStore.systemChoose != ''">
        <el-row :gutter="20">
          <el-col :span="11">
            <div>
              <h2>内网文件拷贝</h2>
              <div class="account-div">
                <el-form :model="ticketForm" label-width="auto" style="margin-left: 20%">
                  <el-form-item label="工单ID">
                    <el-input
                      v-model="ticketForm.workOrderId"
                      style="width: 500px"
                      placeholder="请输入工单ID"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="学生学号">
                    <el-input v-model="ticketForm.studentId" placeholder="请输入学号" clearable />
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
                      v-model="fileForm.fileDownloadLink"
                      placeholder="文件下载链接"
                      disabled
                      style="margin-right: 5%"
                    />
                  </div>
                </el-form-item>
                <el-form-item label="校验码">
                  <div style="display: flex; justify-content: center; align-items: center">
                    <el-input
                      v-model="fileForm.checkCode"
                      placeholder="校验码下载"
                      disabled
                      style="margin-right: 5%"
                    />
                  </div>
                </el-form-item>
                <el-form-item label="文件解压密码">
                  <div style="display: flex; justify-content: center; align-items: center">
                    <el-input
                      v-model="fileForm.unzipPassword"
                      placeholder="文件解压密码"
                      disabled
                      style="margin-right: 5%"
                    />
                    <el-icon @click="copyFilePassword"><DocumentCopy /></el-icon>
                  </div>
                </el-form-item>
              </el-form>
              <el-button style="color: blue; margin-left: 50%" text bg @click="downloadZipFile">
                下载文件
              </el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-else>
        <Error />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { copyFileAPI } from '@/api/stuWorkOrderApproval'
  import { downloadZipFileAPI } from '@/api/studentFileProcessing'
  import useClipboard from 'vue-clipboard3'
  import { useCopyMachineStore } from '@/store/modules/copyMachine'
  import Error from '@/views/error/404.vue'
  const copyMachineStore = useCopyMachineStore()
  const { toClipboard } = useClipboard()
  const ticketForm = ref({
    workOrderId: '',
    studentId: '',
    password: '',
  })
  const fileForm = ref({
    fileDownloadLink: '',
    checkCode: '',
    unzipPassword: '',
  })

  const copyFilePassword = async () => {
    try {
      await toClipboard(fileForm.value.unzipPassword)
      ElMessage({
        message: '复制文件解压密码成功.',
        type: 'success',
        plain: true,
      })
    } catch (e) {
      ElMessage({
        message: '复制文件解压密码失败.',
        type: 'error',
        plain: true,
      })
    }
  }
  const isValid = ref(false)

  const validate = async () => {
    let res = await copyFileAPI(
      ticketForm.value.workOrderId,
      ticketForm.value.studentId,
      ticketForm.value.password,
    )
    res = res.data
    if (res.code == 200) {
      isValid.value = true
      fileForm.value.fileDownloadLink = res.data.fileDownloadLink
      fileForm.value.checkCode = res.data.checkCode
      fileForm.value.unzipPassword = res.data.unzipPassword
    } else {
      isValid.value = false
      ElMessage({
        message: res.msg,
        type: 'error',
        plain: true,
      })
    }
  }

  const downloadZipFile = async () => {
    const response = await downloadZipFileAPI(ticketForm.value.workOrderId)
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'file.zip') // 替换为实际的文件名
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
</script>

<style scoped lang="scss">
  @import './index';
  .rightContent {
    margin-top: 14%;
  }
</style>
