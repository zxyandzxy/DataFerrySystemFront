## 简介

vue-element-perfect 是一个后台前端解决方案,它使用了最新的前端技术栈、动态路由，权限验证，并且有着丰富的组件,企业级中后台解决方案，可免费商用，同时支持 PC、平板、手机

## 项目功能

- 使用 Vue3.0 开发，单文件组件采用＜ script setup ＞
- 采用 Vite3 作为项目开发、打包工具（配置了 Gzip 打包、TSX 语法、跨域代理）
- 整个项目集成了 TypeScript
- 登录逻辑，使用 vue-router 进行路由权限拦截，判断，路由懒加载
- 使用 keep-alive 对整个页面进行缓存，支持多级嵌套页面
- 侧边栏导航菜单栏动态的显示
- 各种可视化地图组件
- 使用 Pinia 替代 Vuex，轻量、简单、易用
- 导出 excel,自定义样式导出 excel、多表头导出
- 表单、表格、水印、多标签显示、打印功能，图片打印、表格打印、普通打印、二维码、拖拽、markdown、头像裁剪、图片上传...
- 使用 Prettier 统一格式化代码，集成 Eslint、代码校验规范

## 下载依赖

```
 npm install
 cnpm install
 yarn
 # npm install 安装失败，请升级 nodejs 到 16 以上，或尝试使用以下命令：
  npm install --registry=https://registry.npm.taobao.org
```

## 运行打包

```
 npm run dev
 npm run build
```

## eslint+prettier

```
# eslint 检测代码
npm run lint

#prettier 格式化代码
npm run lint:prettier
```

## 文件目录结构

```
vue-admin-perfect
├─ public                 # 静态资源文件（忽略打包）
├─ src
│  ├─ api                 # API 接口管理
│  ├─ assets              # 静态资源文件
│  ├─ components          # 全局组件
│  ├─ config              # 全局配置项
│  ├─ hooks               # 常用 Hooks
│  ├─ language            # 语言国际化
│  ├─ layout              # 框架布局
│  ├─ routers             # 路由管理
│  ├─ store               # pinia store
│  ├─ styles              # 全局样式
│  ├─ utils               # 工具库
│  ├─ views               # 项目所有页面
│  ├─ App.vue             # 入口页面
│  └─ main.ts             # 入口文件
├─ .env                   # vite 常用配置
├─ .env.development       # 开发环境配置
├─ .env.production        # 生产环境配置
├─ .env.test              # 测试环境配置
├─ .eslintignore          # 忽略 Eslint 校验
├─ .eslintrc.cjs           # Eslint 校验配置
├─ .gitignore             # git 提交忽略
├─ .prettierignore        # 忽略 prettier 格式化
├─ .prettierrc.config.js         # prettier 配置
├─ index.html             # 入口 html
├─ yarn.lock      # 依赖包包版本锁
├─ package.json           # 依赖包管理
├─ README.md              # README 介绍
├─ tsconfig.json          # typescript 全局配置
└─ vite.config.ts         # vite 配置
```
