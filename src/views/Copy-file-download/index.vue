<template>
  <div class="app-container">
    <div class="app-container-inner">
      <div v-if="copyMachineStore.systemChoose != ''">
        <h2>内网文件拷贝</h2>
        <div class="account-div" style="display: flex">
          <el-input
            v-model="ticketForm.studentId"
            style="max-width: 600px"
            placeholder="请输入账号"
          >
            <template #prepend>学生账号</template>
          </el-input>
          <el-input
            v-model="ticketForm.password"
            style="max-width: 600px; margin-left: 2%"
            placeholder="请输入密码"
          >
            <template #prepend>登录密码</template>
          </el-input>
          <el-button style="color: blue; margin-left: 2%" text bg @click="validate">验证</el-button>
        </div>
        <el-table :data="workOrderList" style="width: 100%; margin-top: 2%" border>
          <el-table-column prop="workOrderId" label="工单号" width="150" />
          <el-table-column prop="workOrderTitle" label="工单标题" width="200" />
          <el-table-column prop="checkCode" label="校验码" width="200" />
          <el-table-column prop="unzipPassword" label="解压密码" width="200" />
          <el-table-column fixed="right" label="操作" min-width="120">
            <template v-slot="scope">
              <el-button link type="primary" size="small" @click="downloadZipFile(scope.$index)">
                下载文件
              </el-button>
              <el-button link type="primary" size="small" @click="copyFilePassword(scope.$index)"
                >复制解压密码</el-button
              >
            </template>
          </el-table-column>
        </el-table>
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
  import { copyFileListAPI } from '@/api/stuWorkOrderApproval'
  import { downloadZipFileAPI } from '@/api/studentFileProcessing'
  import useClipboard from 'vue-clipboard3'
  import { useCopyMachineStore } from '@/store/modules/copyMachine'
  import Error from '@/views/error/404.vue'
  const copyMachineStore = useCopyMachineStore()
  const { toClipboard } = useClipboard()
  const ticketForm = ref({
    studentId: '',
    password: '',
  })
  const workOrderList = ref([])

  const copyFilePassword = async (index) => {
    try {
      await toClipboard(workOrderList.value[index].unzipPassword)
      ElMessage({
        message: '复制文件解压密码成功.',
        type: 'success',
      })
    } catch (e) {
      ElMessage({
        message: '复制文件解压密码失败.',
        type: 'error',
      })
    }
  }
  const isValid = ref(false)

  const validate = async () => {
    let res = await copyFileListAPI(ticketForm.value.studentId, ticketForm.value.password)
    res = res.data
    if (res.code == 200) {
      isValid.value = true
      workOrderList.value = res.data.workOrderList
    } else {
      isValid.value = false
      ElMessage({
        message: res.msg,
        type: 'error',
      })
    }
  }

  const downloadZipFile = async (index) => {
    const response = await downloadZipFileAPI(workOrderList.value[index].workOrderId)
    ElMessage({
      message: '下载文件成功，请在浏览器的下载列表中查看.',
      type: 'success',
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', workOrderList.value[index].workOrderTitle + '.zip') // 替换为实际的文件名
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
