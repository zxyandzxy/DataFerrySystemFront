<template>
  <div class="app-container">
    <div class="app-container-inner">
      <div v-if="stuStore.systemChoose != ''">
        <div>
          <h2 style="margin-left: 5%">工单列表</h2>
          <el-input
            v-model="content"
            style="max-width: 600px; margin-left: 5%"
            placeholder="工单名称支持模糊搜索，文件类型不支持"
            clearable
            size="large"
          >
            <template #prepend>
              <el-select v-model="select" placeholder="类型" style="width: 115px" size="large">
                <el-option label="工单名称" value="1" />
                <el-option label="文件类型" value="2" />
              </el-select>
            </template>
            <template #append>
              <el-button :icon="Search" @click="searchWithContent" />
            </template>
          </el-input>
          <el-button
            @click="showCreateWorkOrder"
            size="large"
            type="primary"
            link
            :icon="DocumentAdd"
            style="margin-left: 70%"
          >
            新建工单
          </el-button>
        </div>
        <el-table :data="tableData" style="width: 90%; margin-left: 3%" border>
          <el-table-column fixed prop="workOrderId" label="工单号" width="150" />
          <el-table-column prop="workOrderTitle" label="工单标题" width="150" />
          <el-table-column prop="fileType" label="文件类型" width="150" />
          <el-table-column prop="workOrderStatus" label="当前工单状态" width="150" />
          <el-table-column prop="unzipPassword" label="解压密码" width="300">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <el-input
                  v-model="scope.row.unzipPassword"
                  type="password"
                  disabled
                  style="margin-right: 5%"
                />
                <el-icon
                  @click="viewUnzipPassword(scope.row.unzipPassword)"
                  style="margin-right: 5%"
                  ><View></View
                ></el-icon>
                <el-icon @click="copyUnzipPassword(scope.row.unzipPassword)"
                  ><CopyDocument
                /></el-icon>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="120">
            <template v-slot="scope">
              <el-button link type="primary" size="small" @click="viewWorkOrder(scope.$index)">
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          layout="prev, pager, next"
          background
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
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
                  <el-option
                    v-for="item in fileTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="文件概述" prop="fileAbstract">
                <el-input v-model="workOrderForm.fileAbstract" type="textarea" />
              </el-form-item>
              <el-form-item label="拷贝原因" prop="copyReason">
                <el-input v-model="workOrderForm.copyReason" type="textarea" />
              </el-form-item>
              <el-form-item label="文件解压密码" prop="unzipPassword">
                <el-input disabled v-model="workOrderForm.unzipPassword" />
                <el-button @click="createUnzipPassword" size="large" type="primary" link
                  >系统生成(请点击此按钮)</el-button
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
              title="退出后此次不会生成工单，确定退出吗？（点击右侧保存后工单就会产生，此时点击退出工单也不会删除）"
              @confirm="createWorkOrderVisible = false"
            >
              <template #reference>
                <el-button>退出</el-button>
              </template>
            </el-popconfirm>
            <el-button type="success" @click="createWorkOrder"> 保存 </el-button>
          </div>
          <div v-if="isCreateWorkOrder == true">
            <h3>文件上传</h3>
            <el-divider />
            <div>
              <el-upload
                class="upload-demo"
                drag
                :limit="1"
                v-model:file-list="fileList"
                action="#"
                :show-file-list="true"
                list-type="text"
                :auto-upload="false"
              >
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text"> 拖拽文件 或 <em> 点击上传 </em> </div>
                <template #tip>
                  <div class="el-upload__tip">
                    只有文件上传后才能成功提交工单，后台处理文件上传需要一定时间，同学无需等待，提交工单即可。如需更新文件需先删除原来的上传的文件
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
              <el-button type="success" @click="submitTicket"> 提交工单 </el-button>
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
          <el-steps
            class="mb-4"
            style="max-width: 600px"
            :space="200"
            :active="active"
            simple
            finish-status="success"
            process-status="process"
            align-center
          >
            <el-step title="创建中" :icon="Postcard" />
            <el-step title="审核中" :icon="FolderChecked" />
            <el-step title="可拷贝" :icon="SuccessFilled" />
            <el-step :status="getFinishWorkOrdersStatus" title="审核成功/失败" :icon="Lock" />
          </el-steps>
          <div v-if="workOrderDetailForm.workOrderStatus == 1">
            <h3>基本信息</h3>
            <el-divider />
            <div>
              <el-form :model="workOrderDetailForm" :rules="workOrderRules" label-width="auto">
                <el-form-item label="当前审批类型" prop="auditType">
                  <el-input disabled v-model="workOrderDetailForm.auditType" />
                </el-form-item>
                <el-form-item label="工单标题" prop="workOrderTitle">
                  <el-input v-model="workOrderDetailForm.workOrderTitle" />
                </el-form-item>
                <el-form-item label="文件类型" prop="fileType">
                  <el-select
                    v-model="workOrderDetailForm.fileType"
                    placeholder="选择要要上传文件的类型"
                  >
                    <el-option
                      v-for="item in fileTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="文件概述" prop="fileAbstract">
                  <el-input v-model="workOrderDetailForm.fileAbstract" type="textarea" />
                </el-form-item>
                <el-form-item label="拷贝原因" prop="copyReason">
                  <el-input v-model="workOrderDetailForm.copyReason" type="textarea" />
                </el-form-item>
                <el-form-item label="文件解压密码" prop="unzipPassword">
                  <el-input disabled v-model="workOrderDetailForm.unzipPassword" />
                  <el-button @click="createUnzipPassword" size="large" type="primary" link
                    >系统生成(请点击此按钮)</el-button
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
                @confirm="deleteWorkOrder"
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
                title="退出后此次不会进行任何操作，确定退出吗？"
                @confirm="viewWorkOrderVisible = false"
              >
                <template #reference>
                  <el-button>退出</el-button>
                </template>
              </el-popconfirm>
              <el-button type="success" @click="updateWorkOrder"> 保存 </el-button>
            </div>
            <div>
              <h3>文件上传</h3>
              <el-divider />
              <div>
                <el-upload
                  class="upload-demo"
                  drag
                  :limit="1"
                  v-model:file-list="fileList"
                  action="#"
                  :auto-upload="false"
                  :show-file-list="true"
                  list-type="text"
                >
                  <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                  <div class="el-upload__text"> 拖拽文件 或 <em> 点击上传 </em> </div>
                  <template #tip>
                    <div class="el-upload__tip">
                      只有文件上传后才能成功提交工单，后台处理文件上传需要一定时间，同学无需等待，提交工单即可
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
                  title="退出后此次填写的所有工单信息都失效（除非点击保存按钮），确定退出吗？"
                  @confirm="viewWorkOrderVisible = false"
                >
                  <template #reference>
                    <el-button>退出</el-button>
                  </template>
                </el-popconfirm>
                <el-button type="success" @click="submitTicketOnViewTime"> 提交工单 </el-button>
              </div>
            </div>
          </div>
          <div v-if="workOrderDetailForm.workOrderStatus == 3">
            <h3>基本信息</h3>
            <el-divider />
            <div>
              <el-form :model="workOrderDetailForm" label-width="auto">
                <el-form-item label="工单标题" prop="workOrderTitle">
                  <el-input disabled v-model="workOrderDetailForm.workOrderTitle" />
                </el-form-item>
                <el-form-item label="文件类型" prop="fileType">
                  <el-select
                    disabled
                    v-model="workOrderDetailForm.fileType"
                    placeholder="选择要上传文件的类型"
                  >
                    <el-option
                      v-for="item in fileTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="文件概述" prop="fileAbstract">
                  <el-input disabled v-model="workOrderDetailForm.fileAbstract" type="textarea" />
                </el-form-item>
                <el-form-item label="拷贝原因" prop="copyReason">
                  <el-input disabled v-model="workOrderDetailForm.copyReason" type="textarea" />
                </el-form-item>
                <el-form-item label="文件解压密码" prop="unzipPassword">
                  <el-input disabled v-model="workOrderDetailForm.unzipPassword" />
                </el-form-item>
                <el-form-item label="审批结果">
                  <div style="display: flex; align-items: center">
                    <el-input disabled v-model="workOrderDetailForm.remark" />
                    <el-button
                      style="margin-left: 5%"
                      type="primary"
                      @click="changeToAdvancedReview"
                      >点此进入超前审批</el-button
                    >
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div v-if="workOrderDetailForm.workOrderStatus == 11">
            <h3>基本信息</h3>
            <el-divider />
            <div>
              <el-form :model="workOrderDetailForm" label-width="auto">
                <el-form-item label="工单标题" prop="workOrderTitle">
                  <el-input disabled v-model="workOrderDetailForm.workOrderTitle" />
                </el-form-item>
                <el-form-item label="文件类型" prop="fileType">
                  <el-select
                    disabled
                    v-model="workOrderDetailForm.fileType"
                    placeholder="选择要要上传文件的类型"
                  >
                    <el-option
                      v-for="item in fileTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="文件概述" prop="fileAbstract">
                  <el-input disabled v-model="workOrderDetailForm.fileAbstract" type="textarea" />
                </el-form-item>
                <el-form-item label="拷贝原因" prop="copyReason">
                  <el-input disabled v-model="workOrderDetailForm.copyReason" type="textarea" />
                </el-form-item>
                <el-form-item label="文件解压密码" prop="unzipPassword">
                  <el-input disabled v-model="workOrderDetailForm.unzipPassword" />
                </el-form-item>
                <el-form-item label="审批结果">
                  <div style="display: flex; align-items: center">
                    <el-input disabled v-model="workOrderDetailForm.remark" />
                  </div>
                </el-form-item>
              </el-form>
            </div>
            <h3>可拷贝</h3>
            <el-divider />
            <h4>请在拷贝机上进行拷贝</h4>
          </div>
          <div
            v-if="
              workOrderDetailForm.workOrderStatus == 21 || workOrderDetailForm.workOrderStatus == 22
            "
          >
            <h3>基本信息</h3>
            <el-divider />
            <div>
              <el-form :model="workOrderDetailForm" label-width="auto">
                <el-form-item label="工单标题" prop="workOrderTitle">
                  <el-input disabled v-model="workOrderDetailForm.workOrderTitle" />
                </el-form-item>
                <el-form-item label="文件类型" prop="fileType">
                  <el-select
                    disabled
                    v-model="workOrderDetailForm.fileType"
                    placeholder="选择要要上传文件的类型"
                  >
                    <el-option
                      v-for="item in fileTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="文件概述" prop="fileAbstract">
                  <el-input disabled v-model="workOrderDetailForm.fileAbstract" type="textarea" />
                </el-form-item>
                <el-form-item label="拷贝原因" prop="copyReason">
                  <el-input disabled v-model="workOrderDetailForm.copyReason" type="textarea" />
                </el-form-item>
                <el-form-item label="文件解压密码" prop="unzipPassword">
                  <el-input disabled v-model="workOrderDetailForm.unzipPassword" />
                </el-form-item>
                <el-form-item label="审批结果">
                  <div style="display: flex; align-items: center">
                    <el-input disabled v-model="workOrderDetailForm.remark" />
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <el-dialog v-model="advancedReviewVisible" title="超前审批" append-to-body>
            <el-form :model="advancedReviewForm" label-width="auto">
              <el-form-item label="超前审批工单号" prop="advancedWorkOrderId">
                <el-input disabled v-model="advancedReviewForm.workOrderId" />
              </el-form-item>
              <el-form-item label="学生学号" prop="studentId">
                <el-input disabled v-model="advancedReviewForm.studentId" />
              </el-form-item>
              <el-form-item label="登录密码" prop="password">
                <el-input v-model="advancedReviewForm.password" />
              </el-form-item>
              <el-form-item label="超前审批密钥" prop="advancedPassword">
                <el-input v-model="advancedReviewForm.advancedPassword" />
              </el-form-item>
              <el-button style="margin-left: 40%" type="primary" @click="getAdvancedReviewResult"
                >发送超前审批请求</el-button
              >
            </el-form>
          </el-dialog>
        </el-dialog>
      </div>
      <div v-else>
        <Error />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import useClipboard from 'vue-clipboard3'
  import { ElMessage, ElNotification } from 'element-plus'
  import {
    DocumentAdd,
    InfoFilled,
    UploadFilled,
    Postcard,
    FolderChecked,
    SuccessFilled,
    Lock,
  } from '@element-plus/icons-vue'
  import { ref, onMounted } from 'vue'
  import {
    getWorkOrderListAPI,
    getAuditTypeAPI,
    createWorkOrderAPI,
    getWorkOrderDetailAPI,
    uploadFileAPI,
    deleteWorkOrderAPI,
    updateWorkOrderAPI,
    advanceApprovalVerificationAPI,
  } from '@/api/stuWorkOrderApproval'
  import { useStuStore } from '@/store/modules/student'
  import Error from '@/views/error/404.vue'
  import { Search } from '@element-plus/icons-vue'

  const { toClipboard } = useClipboard()
  const stuStore = useStuStore()
  const auditType = ref() // 当前审批类型
  const fileTypeOptions = [
    // Docx 0 pdf 1 pptx 2 zip 3 else 4
    {
      value: 0,
      label: 'docx',
    },
    {
      value: 1,
      label: 'pdf',
    },
    {
      value: 2,
      label: 'pptx',
    },
    {
      value: 3,
      label: 'zip',
    },
    {
      value: 4,
      label: 'else',
    },
  ]
  const workOrderForm = ref({
    workOrderId: '',
    auditType: auditType.value == 0 ? '即时审批' : '定期审批', // 0 即时审批，1 定期审批
    workOrderTitle: '',
    fileType: fileTypeOptions[0].value,
    fileAbstract: '',
    copyReason: '',
    unzipPassword: '',
  })

  const workOrderDetailForm = ref({
    workOrderId: '',
    auditType: '',
    workOrderTitle: '',
    fileType: fileTypeOptions[0].value,
    fileAbstract: '',
    copyReason: '',
    unzipPassword: '',
    remark: '',
    workOrderStatus: 1,
  })
  const num2LabelMap = new Map([
    [1, '创建中'],
    [2, '处理中'],
    [3, '审批中'],
    [11, '可拷贝'],
    [21, '审批通过'],
    [22, '审批驳回'],
  ])
  const label2NumMap = new Map([
    ['创建中', 1],
    ['处理中', 2],
    ['审批中', 3],
    ['可拷贝', 11],
    ['审批通过', 21],
    ['审批驳回', 22],
  ])
  const fileType2LabelMap = new Map([
    [0, 'docx'],
    [1, 'pdf'],
    [2, 'pptx'],
    [3, 'zip'],
    [4, 'else'],
  ])
  // 分页操作
  const currentPage = ref(1)
  const total = ref(0)
  //const tableData = ref([])
  const pageSize = ref(10)
  const handleCurrentChange = (val) => {
    currentPage.value = val
    getWorkOrderList()
  }

  // 搜索操作
  const content = ref('')
  const select = ref('')
  const searchWithContent = async () => {
    if (select.value == '1') {
      // 按工单名搜索
      let res = await getWorkOrderListAPI(
        currentPage.value,
        pageSize.value,
        stuStore.stuId,
        content.value,
        null,
      )
      res = res.data
      if (res.code === 200) {
        total.value = res.data.total
        for (let i = 0; i < res.data.items.length; i++) {
          res.data.items[i].workOrderStatus = num2LabelMap.get(res.data.items[i].workOrderStatus)
          res.data.items[i].fileType = fileType2LabelMap.get(res.data.items[i].fileType)
        }
        tableData.value = res.data.items
      } else {
        ElNotification({
          message: res.msg,
          type: 'error',
          duration: 2000,
        })
      }
    } else if (select.value == '2') {
      // 按文件类型搜索
      const lowerContent = content.value.toLowerCase()
      let fileTypeNum
      if (lowerContent == 'docx' || lowerContent == 'doc') {
        fileTypeNum = 0
      } else if (lowerContent == 'pdf') {
        fileTypeNum = 1
      } else if (lowerContent == 'pptx' || lowerContent == 'ppt') {
        fileTypeNum = 2
      } else if (lowerContent == 'zip') {
        fileTypeNum = 3
      } else {
        fileTypeNum = 4
      }
      let res = await getWorkOrderListAPI(
        currentPage.value,
        pageSize.value,
        stuStore.stuId,
        '',
        fileTypeNum,
      )
      res = res.data
      if (res.code === 200) {
        total.value = res.data.total
        for (let i = 0; i < res.data.items.length; i++) {
          res.data.items[i].workOrderStatus = num2LabelMap.get(res.data.items[i].workOrderStatus)
          res.data.items[i].fileType = fileType2LabelMap.get(res.data.items[i].fileType)
        }
        tableData.value = res.data.items
      } else {
        ElNotification({
          message: res.msg,
          type: 'error',
          duration: 2000,
        })
      }
    } else {
      // 查询所有
      getWorkOrderList()
    }
  }

  // 新建工单
  const createWorkOrderVisible = ref(false)
  const isCreateWorkOrder = ref(false) // isCreateWorkOrder 是 true 时，就显示文件上传
  const showCreateWorkOrder = () => {
    isCreateWorkOrder.value = false
    createWorkOrderVisible.value = true
  }
  const createWorkOrder = async () => {
    // 判断必填信息是否填写完成
    const fileTypeChoose = [0, 1, 2, 3, 4] // 文件类型
    if (
      workOrderForm.value.workOrderTitle == '' ||
      !fileTypeChoose.includes(workOrderForm.value.fileType) ||
      workOrderForm.value.fileAbstract == '' ||
      workOrderForm.value.copyReason == '' ||
      workOrderForm.value.unzipPassword == ''
    ) {
      ElMessage({
        message: '请填写完整信息',
        type: 'error',
      })
      return
    }
    // 后端创建工单
    const data = {
      studentAccount: stuStore.stuId,
      auditType: auditType.value,
      workOrderTitle: workOrderForm.value.workOrderTitle,
      fileType: workOrderForm.value.fileType,
      fileAbstract: workOrderForm.value.fileAbstract,
      copyReason: workOrderForm.value.copyReason,
      unzipPassword: workOrderForm.value.unzipPassword,
    }
    // console.log( data)

    let res = await createWorkOrderAPI(data)
    res = res.data
    if (res.code == 200) {
      ElMessage({
        message: '创建成功',
        type: 'success',
      })
      workOrderForm.value.workOrderId = res.data
      isCreateWorkOrder.value = true
    } else {
      ElMessage({
        message: '创建失败',
        type: 'error',
      })
    }
    // isCreateWorkOrder.value = true // 开发用，后面注释掉
  }
  // 文件上传
  //定义一个响应式数组用来接收文件
  const fileList = ref([])
  const submitTicket = async () => {
    if (fileList.value.length > 0) {
      // 封装为FromData对象
      const fromData = new FormData()
      fileList.value.forEach((val) => {
        fromData.append('file', val.raw)
      })
      fromData.append('workOrderId', workOrderForm.value.workOrderId)
      fromData.append('studentAccount', stuStore.stuId)
      let res = await uploadFileAPI(fromData)
      res = res.data
      if (res.code == 200) {
        ElNotification({
          message: res.msg,
          type: 'success',
          duration: 2000,
        })
        createWorkOrderVisible.value = false
        await getWorkOrderList()
      }
    }
  }

  const workOrderRules = {
    workOrderTitle: [{ required: true, message: '请输入工单标题', trigger: 'blur' }],
    fileType: [{ required: true, message: '请选择文件类型', trigger: 'change' }],
    fileAbstract: [{ required: true, message: '请输入文件概述', trigger: 'blur' }],
    copyReason: [{ required: true, message: '请输入拷贝原因', trigger: 'blur' }],
    unzipPassword: [{ required: true, message: '请输入文件解压密码', trigger: 'blur' }],
  }
  const createUnzipPassword = () => {
    function generateVerificationCode(length) {
      // 定义允许使用的字符集
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let verificationCode = ''

      // 使用 Math.random() 生成随机索引并选择字符
      for (let i = 0; i < length; i++) {
        verificationCode += characters.charAt(Math.floor(Math.random() * characters.length))
      }

      return verificationCode
    }
    workOrderForm.value.unzipPassword = generateVerificationCode(8)
  }

  // 查看工单
  const active = ref(0) // 流程组件的控制
  const viewWorkOrderVisible = ref(false)
  const getFinishWorkOrdersStatus = () => {
    let status
    if (workOrderDetailForm.workOrderStatus === 21) {
      status = 'success'
    } else if (workOrderDetailForm.workOrderStatus === 22) {
      status = 'error'
    } else {
      status = 'process'
    }
    return status
  }
  const changeToAdvancedReview = () => {
    advancedReviewForm.value.workOrderId = workOrderDetailForm.value.workOrderId
    advancedReviewVisible.value = true
  }
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
  // 超前审批
  const advancedReviewVisible = ref(false)
  const advancedReviewForm = ref({
    workOrderId: '',
    studentId: stuStore.stuId,
    password: '',
    advancedPassword: '',
  })
  const getAdvancedReviewResult = async () => {
    if (
      advancedReviewForm.value.password == '' ||
      advancedReviewForm.value.advancedPassword == ''
    ) {
      ElMessage({
        message: '请输入登录密码与超前审批密钥进行验证',
        type: 'error',
        plain: true,
      })
      return
    }
    let res = await advanceApprovalVerificationAPI(
      advancedReviewForm.value.workOrderId,
      advancedReviewForm.value.studentId,
      advancedReviewForm.value.password,
      advancedReviewForm.value.advancedPassword,
    )
    res = res.data
    if (res.code == 200) {
      ElNotification({
        title: res.msg,
        type: 'success',
        duration: 0,
      })
      advancedReviewVisible.value = false
    }
  }

  // 主页
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

  // 进入工单详情页
  const viewWorkOrder = async (index) => {
    workOrderDetailForm.value.workOrderStatus = label2NumMap.get(
      tableData.value[index].workOrderStatus,
    )
    workOrderDetailForm.value.workOrderId = tableData.value[index].workOrderId
    // 测试用，后续删
    viewWorkOrderVisible.value = true
    if (workOrderDetailForm.value.workOrderStatus === 1) {
      active.value = 1
      // 创建表单页面
    } else if (workOrderDetailForm.value.workOrderStatus === 3) {
      active.value = 2
      // 审批表单页面
    } else if (workOrderDetailForm.value.workOrderStatus === 11) {
      active.value = 3
      // 可拷贝页面
    } else if (
      workOrderDetailForm.value.workOrderStatus === 21 ||
      workOrderDetailForm.value.workOrderStatus === 22
    ) {
      active.value = 4
      // 审批结果
    }
    let res = await getWorkOrderDetailAPI(tableData.value[index].workOrderId, stuStore.stuId)
    res = res.data
    if (res.code == 200) {
      workOrderDetailForm.value.auditType = res.data.auditType == 0 ? '即时审批' : '定期审批'
      workOrderDetailForm.value.workOrderTitle = res.data.workOrderTitle
      workOrderDetailForm.value.fileType = res.data.fileType
      workOrderDetailForm.value.fileAbstract = res.data.fileAbstract
      workOrderDetailForm.value.copyReason = res.data.copyReason
      workOrderDetailForm.value.unzipPassword = res.data.unzipPassword
      workOrderDetailForm.value.remark = res.data.remark
    } else {
      return
    }

    viewWorkOrderVisible.value = true
    if (workOrderDetailForm.value.workOrderStatus === 1) {
      active.value = 1
      // 创建表单页面
    } else if (workOrderDetailForm.value.workOrderStatus === 3) {
      active.value = 2
      // 审批表单页面
    } else if (workOrderDetailForm.value.workOrderStatus === 11) {
      active.value = 3
      // 可拷贝页面
    } else if (
      workOrderDetailForm.value.workOrderStatus === 21 ||
      workOrderDetailForm.value.workOrderStatus === 22
    ) {
      active.value = 4
      // 审批结果
    }
  }

  // 撤销工单
  const deleteWorkOrder = async () => {
    let res = await deleteWorkOrderAPI(workOrderDetailForm.value.workOrderId, stuStore.stuId)
    res = res.data
    if (res.code == 200) {
      ElMessage({
        showClose: true,
        message: res.msg,
        type: 'success',
        plain: true,
      })
      await getWorkOrderList()
      viewWorkOrderVisible.value = false
    } else {
      viewWorkOrderVisible.value = false
    }
  }

  // 修改工单基本信息
  const updateWorkOrder = async () => {
    // 判断所有必填信息是否填写完成
    const fileTypeChoose = [0, 1, 2, 3, 4] // 文件类型
    if (
      workOrderDetailForm.value.workOrderTitle == '' ||
      !fileTypeChoose.includes(workOrderDetailForm.value.fileType) ||
      workOrderDetailForm.value.fileAbstract == '' ||
      workOrderDetailForm.value.copyReason == '' ||
      workOrderDetailForm.value.unzipPassword == ''
    ) {
      ElMessage({
        showClose: true,
        message: '请填写所有必填信息',
        type: 'error',
        plain: true,
      })
      return
    }
    const data = {
      studentId: stuStore.stuId,
      auditType: workOrderDetailForm.value.auditType == '即时审批' ? 0 : 1,
      workOrderId: workOrderDetailForm.value.workOrderId,
      workOrderTitle: workOrderDetailForm.value.workOrderTitle,
      fileType: workOrderDetailForm.value.fileType,
      fileAbstract: workOrderDetailForm.value.fileAbstract,
      copyReason: workOrderDetailForm.value.copyReason,
      unzipPassword: workOrderDetailForm.value.unzipPassword,
    }

    let res = await updateWorkOrderAPI(data)
    res = res.data
    if (res.code == 200) {
      ElMessage({
        showClose: true,
        message: res.msg,
        type: 'success',
        plain: true,
      })
      await getWorkOrderList()
      viewWorkOrderVisible.value = false
    }
  }

  // 创建中状态提交工单（与新建工单直接提交不冲突，文件处理可以用一样的代码）
  const submitTicketOnViewTime = async () => {
    if (fileList.value.length > 0) {
      // 封装为FromData对象
      const fromData = new FormData()
      fileList.value.forEach((val) => {
        fromData.append('file', val.raw)
      })
      fromData.append('workOrderId', workOrderDetailForm.value.workOrderId)
      fromData.append('studentAccount', stuStore.stuId)
      let res = uploadFileAPI(fromData)
      res = res.data
      if (res.code == 200) {
        ElMessage({
          message: res.msg,
          type: 'success',
        })
        viewWorkOrderVisible.value = false
      }
    }
  }
  // 测试用数据
  const tableData = ref([
    // {
    //   workOrderId: '111',
    //   workOrderTitle: 'PDF文件烤出',
    //   fileType: 'PDF',
    //   workOrderStatus: num2LabelMap.get(1),
    //   unzipPassword: '1132',
    // },
    // {
    //   workOrderId: '222',
    //   workOrderTitle: 'PPTx文件烤出',
    //   fileType: 'pptx',
    //   workOrderStatus: num2LabelMap.get(3),
    //   unzipPassword: '1123',
    // },
    // {
    //   workOrderId: '333',
    //   workOrderTitle: 'docx文件烤出',
    //   fileType: 'docx',
    //   workOrderStatus: num2LabelMap.get(11),
    //   unzipPassword: '1123',
    // },
    // {
    //   workOrderId: '444',
    //   workOrderTitle: 'docx文件烤出',
    //   fileType: 'docx',
    //   workOrderStatus: num2LabelMap.get(21),
    //   unzipPassword: '1123',
    // },
    // {
    //   workOrderId: '555',
    //   workOrderTitle: 'docx文件烤出',
    //   fileType: 'docx',
    //   workOrderStatus: num2LabelMap.get(22),
    //   unzipPassword: '1123',
    // },
  ])

  const getWorkOrderList = async () => {
    let res = await getWorkOrderListAPI(currentPage.value, pageSize.value, stuStore.stuId, '', null)
    res = res.data

    if (res.code === 200) {
      total.value = res.data.total
      for (let i = 0; i < res.data.items.length; i++) {
        res.data.items[i].workOrderStatus = num2LabelMap.get(res.data.items[i].workOrderStatus)
        res.data.items[i].fileType = fileType2LabelMap.get(res.data.items[i].fileType)
      }
      tableData.value = res.data.items
    }
  }

  onMounted(async () => {
    // 获取工单列表
    await getWorkOrderList()
    let tmp = await getAuditTypeAPI()
    auditType.value = tmp.data.data
    workOrderForm.value.auditType = auditType.value == 0 ? '即时审批' : '定期审批' // 0 即时审批，1 定期审批
  })
</script>

<style scoped lang="scss">
  @import './index';
</style>
