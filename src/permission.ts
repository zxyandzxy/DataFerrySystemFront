import router from './router/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useStuStore } from '@/store/modules/student'
import { useAdminStore } from './store/modules/admin'
import { useCopyMachineStore } from './store/modules/copyMachine'
import { usePermissionStore } from '@/store/modules/permission'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // 设置白名单
// 记录路由
let hasRoles = true

router.beforeEach(async (to, from, next) => {
  // 开启进度条
  NProgress.start()
  // 设置标题
  if (typeof to.meta.title === 'string') {
    document.title = to.meta.title || '数据摆渡系统'
  }
  const stuStore = useStuStore()
  const adminStore = useAdminStore()
  const copyMachineStore = useCopyMachineStore()
  // 确定用户是否已登录过，存在Token
  let hasToken
  let userStore

  if (stuStore.systemChoose != '') {
    hasToken = stuStore.token
    userStore = stuStore
  } else if (adminStore.systemChoose != '') {
    hasToken = adminStore.token
    userStore = adminStore
  } else if (copyMachineStore.systemChoose != '') {
    hasToken = copyMachineStore.token
    userStore = copyMachineStore
  }
  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，请重定向到主页
      next({ path: '/' })
    } else {
      try {
        const PermissionStore = usePermissionStore()
        // 路由添加进去了没有及时更新 需要重新进去一次拦截
        if (!PermissionStore.routes.length) {
          // 获取权限列表进行接口访问 因为这里页面要切换权限
          const accessRoutes = await PermissionStore.generateRoutes(userStore.roles)
          hasRoles = false
          accessRoutes.forEach((item) => router.addRoute(item)) // 动态添加访问路由表
          next({ ...to, replace: true }) // // 这里相当于push到一个页面 不在进入路由拦截
        } else {
          next() // // 如果不传参数就会重新执行路由拦截，重新进到这里
        }
      } catch (error) {
        next(`/login?redirect=${to.path}`)
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1 || copyMachineStore.token != '') {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
