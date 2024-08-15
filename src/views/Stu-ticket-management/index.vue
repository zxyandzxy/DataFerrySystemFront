<template>
  <div class="app-container">
    <div class="app-container-inner">
      <div style="display: flex; align-items: center">
        <h2 style="margin-left: 5%">工单列表</h2>
        <el-button
          @click="createWorkOrder"
          size="large"
          type="primary"
          link
          :icon="DocumentAdd"
          style="margin-left: 70%"
        >
          新建工单
        </el-button>
      </div>
      <el-table :data="tableData" style="width: 90%; margin-left: 3%">
        <el-table-column fixed prop="workOrderId" label="工单号" width="150" />
        <el-table-column prop="workOrderTitle" label="工单标题" width="150" />
        <el-table-column prop="fileType" label="文件类型" width="150" />
        <el-table-column prop="workOrderStatus" label="当前工单状态" width="150" />
        <el-table-column prop="unzipPassword" label="加密密码" width="300">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-input
                v-model="scope.row.unzipPassword"
                type="password"
                disabled
                style="margin-right: 5%"
              />
              <el-icon @click="viewUnzipPassword(scope.row.unzipPassword)" style="margin-right: 5%"
                ><View></View
              ></el-icon>
              <el-icon @click="copyUnzipPassword(scope.row.unzipPassword)"
                ><CopyDocument
              /></el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="120">
          <template #default>
            <el-button link type="primary" size="small" @click="viewWorkOrder"> 详情 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :total="1000"
        style="margin-left: 70%; margin-top: 1%"
      />
      <el-dialog
        v-model="createWorkOrderVisible"
        title="新建工单"
        :show-close="false"
        draggable
        overflow
      >
        <h3>基本信息</h3>
        <el-divider />
        <div>
          <el-form :model="workOrderForm" :rules="workOrderRules" label-width="auto">
            <el-form-item label="当前审批类型" prop="auditType">
              <el-input disabled v-model="workOrderForm.auditType" />
            </el-form-item>
            <el-form-item label="工单标题" prop="workOrderTitle">
              <el-input v-model="workOrderForm.workOrderTitle" />
            </el-form-item>
            <el-form-item label="文件类型" prop="fileType">
              <el-select v-model="workOrderForm.fileType" placeholder="选择要要上传文件的类型">
                <el-option label="pdf" value="pdf" />
                <el-option label="docx" value="docx" />
              </el-select>
            </el-form-item>
            <el-form-item label="文件概述" prop="fileAbstract">
              <el-input v-model="workOrderForm.fileAbstract" type="textarea" />
            </el-form-item>
            <el-form-item label="拷贝原因" prop="copyReason">
              <el-input v-model="workOrderForm.copyReason" type="textarea" />
            </el-form-item>
            <el-form-item label="文件加密密码" prop="unzipPassword">
              <el-input v-model="workOrderForm.unzipPassword" />
              <el-button @click="createUnzipPassword" size="large" type="primary" link
                >系统生成</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <div style="margin-left: 50%; margin-bottom: 2%">
          <el-popconfirm
            width="220"
            confirm-button-text="确定"
            cancel-button-text="取消"
            :icon="InfoFilled"
            icon-color="#626AEF"
            title="退出后此次不会生成工单，确定退出吗？"
            @confirm="createWorkOrderVisible = false"
          >
            <template #reference>
              <el-button>退出</el-button>
            </template>
          </el-popconfirm>
          <el-button type="success" @click="isCreateWorkOrder = true"> 保存 </el-button>
        </div>
        <div v-if="isCreateWorkOrder == true">
          <h3>文件上传</h3>
          <el-divider />
          <div>
            <el-upload drag action="">
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text"> 拖拽文件 或 <em> 点击上传 </em> </div>
              <template #tip>
                <div class="el-upload__tip">
                  只有文件上传后才能成功创建工单，后台处理文件上传需要一定时间，同学无需等待，提交工单即可
                </div>
              </template>
            </el-upload>
          </div>
          <div style="margin-left: 40%; margin-top: 1%">
            <el-popconfirm
              width="220"
              confirm-button-text="确定"
              cancel-button-text="取消"
              :icon="InfoFilled"
              icon-color="#626AEF"
              title="退出后此次工单会暂存，请及时上传文件，确定退出吗？"
              @confirm="createWorkOrderVisible = false"
            >
              <template #reference>
                <el-button>退出</el-button>
              </template>
            </el-popconfirm>
            <el-button type="success" @click="createWorkOrderVisible = false"> 提交工单 </el-button>
          </div>
        </div>
      </el-dialog>
      <el-dialog
        v-model="viewWorkOrderVisible"
        title="工单流程"
        :show-close="false"
        draggable
        overflow
      >
        <el-steps class="mb-4" style="max-width: 600px" :space="200" :active="active" simple>
          <el-step title="创建中" :icon="Postcard" />
          <el-step title="审核中" :icon="FolderChecked" />
          <el-step title="可拷贝" :icon="SuccessFilled" />
          <el-step title="审核成功/失败" :icon="Lock" />
        </el-steps>
        <div v-if="workOrderStatus == 1">
          <h3>基本信息</h3>
          <el-divider />
          <div>
            <el-form :model="workOrderForm" :rules="workOrderRules" label-width="auto">
              <el-form-item label="当前审批类型" prop="auditType">
                <el-input disabled v-model="workOrderForm.auditType" />
              </el-form-item>
              <el-form-item label="工单标题" prop="workOrderTitle">
                <el-input v-model="workOrderForm.workOrderTitle" />
              </el-form-item>
              <el-form-item label="文件类型" prop="fileType">
                <el-select v-model="workOrderForm.fileType" placeholder="选择要要上传文件的类型">
                  <el-option label="pdf" value="pdf" />
                  <el-option label="docx" value="docx" />
                </el-select>
              </el-form-item>
              <el-form-item label="文件概述" prop="fileAbstract">
                <el-input v-model="workOrderForm.fileAbstract" type="textarea" />
              </el-form-item>
              <el-form-item label="拷贝原因" prop="copyReason">
                <el-input v-model="workOrderForm.copyReason" type="textarea" />
              </el-form-item>
              <el-form-item label="文件加密密码" prop="unzipPassword">
                <el-input v-model="workOrderForm.unzipPassword" />
                <el-button @click="createUnzipPassword" size="large" type="primary" link
                  >系统生成</el-button
                >
              </el-form-item>
            </el-form>
          </div>
          <div style="margin-left: 50%; margin-bottom: 2%">
            <el-popconfirm
              width="220"
              confirm-button-text="确定"
              cancel-button-text="取消"
              :icon="InfoFilled"
              icon-color="#626AEF"
              title="撤销工单后，此工单将消失，确定撤销吗？"
              @confirm="createWorkOrderVisible = false"
            >
              <template #reference>
                <el-button type="danger">撤销工单</el-button>
              </template>
            </el-popconfirm>
            <el-popconfirm
              width="220"
              confirm-button-text="确定"
              cancel-button-text="取消"
              :icon="InfoFilled"
              icon-color="#626AEF"
              title="退出后此次不会生成工单，确定退出吗？"
              @confirm="createWorkOrderVisible = false"
            >
              <template #reference>
                <el-button>退出</el-button>
              </template>
            </el-popconfirm>
            <el-button type="success" @click="isCreateWorkOrder = true"> 保存 </el-button>
          </div>
          <div>
            <h3>文件上传</h3>
            <el-divider />
            <div>
              <el-upload drag action="">
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text"> 拖拽文件 或 <em> 点击上传 </em> </div>
                <template #tip>
                  <div class="el-upload__tip">
                    只有文件上传后才能成功创建工单，后台处理文件上传需要一定时间，同学无需等待，提交工单即可
                  </div>
                </template>
              </el-upload>
            </div>
            <div style="margin-left: 40%; margin-top: 1%">
              <el-popconfirm
                width="220"
                confirm-button-text="确定"
                cancel-button-text="取消"
                :icon="InfoFilled"
                icon-color="#626AEF"
                title="退出后此次工单会暂存，请及时上传文件，确定退出吗？"
                @confirm="createWorkOrderVisible = false"
              >
                <template #reference>
                  <el-button>退出</el-button>
                </template>
              </el-popconfirm>
              <el-button type="success" @click="createWorkOrderVisible = false">
                提交工单
              </el-button>
            </div>
          </div>
        </div>
        <div v-if="workOrderStatus == 3">
          <h3>基本信息</h3>
          <el-divider />
          <div>
            <el-form :model="workOrderForm" label-width="auto">
              <el-form-item label="工单标题" prop="workOrderTitle">
                <el-input disabled v-model="workOrderForm.workOrderTitle" />
              </el-form-item>
              <el-form-item label="文件类型" prop="fileType">
                <el-select
                  disabled
                  v-model="workOrderForm.fileType"
                  placeholder="选择要要上传文件的类型"
                >
                  <el-option label="pdf" value="pdf" />
                  <el-option label="docx" value="docx" />
                </el-select>
              </el-form-item>
              <el-form-item label="文件概述" prop="fileAbstract">
                <el-input disabled v-model="workOrderForm.fileAbstract" type="textarea" />
              </el-form-item>
              <el-form-item label="拷贝原因" prop="copyReason">
                <el-input disabled v-model="workOrderForm.copyReason" type="textarea" />
              </el-form-item>
              <el-form-item label="文件加密密码" prop="unzipPassword">
                <el-input disabled v-model="workOrderForm.unzipPassword" />
              </el-form-item>
              <el-form-item label="审批失败原因">
                <el-input disabled v-model="remark" />
                <el-button type="primary" @click="changeToAdvancedReview"
                  >点此进入超前审批</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div v-if="workOrderStatus == 11">
          <h3>基本信息</h3>
          <el-divider />
          <div>
            <el-form :model="workOrderForm" label-width="auto">
              <el-form-item label="工单标题" prop="workOrderTitle">
                <el-input disabled v-model="workOrderForm.workOrderTitle" />
              </el-form-item>
              <el-form-item label="文件类型" prop="fileType">
                <el-select
                  disabled
                  v-model="workOrderForm.fileType"
                  placeholder="选择要要上传文件的类型"
                >
                  <el-option label="pdf" value="pdf" />
                  <el-option label="docx" value="docx" />
                </el-select>
              </el-form-item>
              <el-form-item label="文件概述" prop="fileAbstract">
                <el-input disabled v-model="workOrderForm.fileAbstract" type="textarea" />
              </el-form-item>
              <el-form-item label="拷贝原因" prop="copyReason">
                <el-input disabled v-model="workOrderForm.copyReason" type="textarea" />
              </el-form-item>
              <el-form-item label="文件加密密码" prop="unzipPassword">
                <el-input disabled v-model="workOrderForm.unzipPassword" />
              </el-form-item>
              <el-form-item label="审批失败原因">
                <div style="display: flex; align-items: center">
                  <el-input disabled v-model="remark" />
                  <el-button
                    style="margin-left: 5%"
                    type="primary"
                    link
                    @click="changeToAdvancedReview"
                    >点此进入超前审批</el-button
                  >
                </div>
              </el-form-item>
            </el-form>
          </div>
          <h3>可拷贝</h3>
          <el-divider />
          <el-form :model="workOrderForm" label-width="auto">
            <el-form-item label="解压密码" prop="checkCode">
              <div style="display: flex; align-items: center">
                <el-input disabled v-model="checkCode" />
                <el-icon style="margin-left: 5%" @click="copyCheckCode"><DocumentCopy /></el-icon>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <el-dialog v-model="advancedReviewVisible" title="超前审批" append-to-body>
          <el-form :model="advancedReviewForm" label-width="auto">
            <el-form-item label="超前审批工单号" prop="advancedWorkOrderId">
              <el-input disabled v-model="advancedReviewForm.advancedWorkOrderId" />
            </el-form-item>
            <el-form-item label="超前审批状态" prop="advancedReviewStatus">
              <el-input disabled v-model="advancedReviewForm.advancedReviewStatus" />
            </el-form-item>
            <el-form-item label="超前审批密钥" prop="advanceReviewPassword">
              <div style="display: flex; align-items: center">
                <el-input disabled v-model="advancedReviewForm.advanceReviewPassword" />
                <el-icon style="margin-left: 5%" @click="copyadvanceReviewPassword"
                  ><DocumentCopy
                /></el-icon>
              </div>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-dialog>
    </div>
  </div>
</template>
<script setup lang="ts">
  import useClipboard from 'vue-clipboard3'
  const { toClipboard } = useClipboard()
  import { ElMessage } from 'element-plus'
  import {
    DocumentAdd,
    InfoFilled,
    UploadFilled,
    Postcard,
    FolderChecked,
    SuccessFilled,
    Lock,
  } from '@element-plus/icons-vue'
  import { ref } from 'vue'

  // 新建工单
  const createWorkOrderVisible = ref(false)
  const createWorkOrder = () => {
    isCreateWorkOrder.value = false
    createWorkOrderVisible.value = true
  }
  const workOrderForm = ref({
    auditType: '',
    workOrderTitle: '',
    fileType: '',
    fileAbstract: '',
    copyReason: '',
    unzipPassword: '',
  })
  const workOrderRules = {
    workOrderTitle: [{ required: true, message: '请输入工单标题', trigger: 'blur' }],
    fileType: [{ required: true, message: '请选择文件类型', trigger: 'change' }],
    fileAbstract: [{ required: true, message: '请输入文件概述', trigger: 'blur' }],
    copyReason: [{ required: true, message: '请输入拷贝原因', trigger: 'blur' }],
    unzipPassword: [{ required: true, message: '请输入解压密码', trigger: 'blur' }],
  }
  const createUnzipPassword = () => {
    workOrderForm.value.unzipPassword = Math.random().toString(36).substr(2, 8)
  }

  const isCreateWorkOrder = ref(false)

  // 查看工单
  const active = ref(1)
  const viewWorkOrderVisible = ref(false)
  const workOrderStatus = ref(11) // 1 创建中，2 处理中，3 审批中， 11 可拷贝， 21 审批通过，22 审批驳回
  const remark = ref('工单仍在审批中')
  const changeToAdvancedReview = () => {
    advancedReviewVisible.value = true
  }
  const checkCode = '1'
  const copyCheckCode = async () => {
    try {
      await toClipboard(checkCode)
      ElMessage({
        message: '复制解压密码成功.',
        type: 'success',
        plain: true,
      })
    } catch (e) {
      ElMessage({
        message: '复制解压密码失败.',
        type: 'error',
        plain: true,
      })
    }
  }
  const advancedReviewVisible = ref(false)
  const advancedReviewForm = ref({
    advancedWorkOrderId: '',
    advancedReviewStatus: '',
    advanceReviewPassword: '',
  })
  const copyadvanceReviewPassword = async () => {
    try {
      await toClipboard(advancedReviewForm.value.advanceReviewPassword)
      ElMessage({
        message: '复制超前审批密钥成功.',
        type: 'success',
        plain: true,
      })
    } catch (e) {
      ElMessage({
        message: '复制超前审批密钥失败.',
        type: 'error',
        plain: true,
      })
    }
  }

  // 主页
  const copyUnzipPassword = async (unzipPassword) => {
    try {
      await toClipboard(unzipPassword)
      ElMessage({
        message: '复制解压密码成功.',
        type: 'success',
        plain: true,
      })
    } catch (e) {
      ElMessage({
        message: '复制解压密码失败.',
        type: 'error',
        plain: true,
      })
    }
  }

  const viewUnzipPassword = async (unzipPassword) => {
    try {
      await toClipboard(unzipPassword)
      ElMessage({
        showClose: true,
        message: '解压密码为: ' + unzipPassword,
        type: 'success',
        plain: true,
      })
    } catch (e) {
      ElMessage({
        message: '复制解压密码失败.',
        type: 'error',
        plain: true,
      })
    }
  }

  const viewWorkOrder = async () => {
    viewWorkOrderVisible.value = true
    if (workOrderStatus.value === 1) {
      active.value = 1
    } else if (workOrderStatus.value === 3) {
      active.value = 2
    } else if (workOrderStatus.value === 11) {
      active.value = 3
    } else if (workOrderStatus.value === 21 || workOrderStatus.value === 22) {
      active.value = 4
    }
  }

  const tableData = [
    {
      workOrderId: '111',
      workOrderTitle: 'PDF文件烤出',
      fileType: 'PDF',
      workOrderStatus: '创建中',
      unzipPassword: '1132',
    },
    {
      workOrderId: '222',
      workOrderTitle: 'PPTx文件烤出',
      fileType: 'pptx',
      workOrderStatus: '审批中',
      unzipPassword: '1123',
    },
  ]
</script>

<style scoped lang="scss">
  @import './index';
</style>
