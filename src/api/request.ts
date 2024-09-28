import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElLoading, ElMessage } from 'element-plus'
import { useStuStore } from '@/store/modules/student'
import { useCopyMachineStore } from '@/store/modules/copyMachine'
import { useAdminStore } from '@/store/modules/admin'
// 创建axios实例 进行基本参数配置
const service = axios.create({
  // 默认请求地址，根据环境的不同可在.env 文件中进行修改
  baseURL: import.meta.env.VITE_APP_API_URL,
  // 设置接口访问超时时间
  timeout: 3000, // request timeout，
  // 跨域时候允许携带凭证
  withCredentials: true,
})

let loadingInstance: any = null // 用于存储loading实例

//  request interceptor 接口请求拦截
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    /**
     * 用户登录之后获取服务端返回的token,后面每次请求都在请求头中带上token进行JWT校验
     * token 存储在本地储存中（storage）、vuex、pinia
     */

    const stuStore = useStuStore()
    const copyMachineStore = useCopyMachineStore()
    const adminStore = useAdminStore()
    if (copyMachineStore.systemChoose == '拷贝机端') {
      return config
    }

    let token
    if (stuStore.systemChoose == '学生端') {
      token = stuStore.token
    } else if (adminStore.systemChoose == '管理员端') {
      token = adminStore.token
    }
    // 自定义请求头
    if (token) {
      config.headers.Authorization = token
    }

    // 显示加载动画
    loadingInstance = ElLoading.service({
      lock: true,
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.7)',
    })

    return config
  },
  (error: AxiosError) => {
    // 请求错误，这里可以用全局提示框进行提示
    if (loadingInstance) loadingInstance.close() // 关闭加载动画
    return Promise.reject(error)
  },
)

//  response interceptor 接口响应拦截
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 直接返回res，当然你也可以只返回res.data
    // 系统如果有自定义code也可以在这里处理
    if (loadingInstance) loadingInstance.close() // 关闭加载动画

    const res = response.data
    // 如果自定义的状态码不是 200，抛出错误提示
    if (res.code !== 200) {
      showErrMessage(res.msg, 'error', 2000)
      return response
    } else {
      return response
    }
  },
  (error: AxiosError) => {
    loadingInstance.close()
    showErrMessage('请重新登录或者重试', 'error', 2000)
    return Promise.reject(error)
  },
)

/**
 * @description 显示错误消息
 * opt 传入参数
 * err 错误信息
 * type 消息类型
 * duration 消息持续时间
 */
function showErrMessage(msg, type: any = 'error', duration = 5000) {
  // console.log(type)

  ElMessage({
    message: msg,
    type: type,
    duration: duration,
  })
}

export default service
