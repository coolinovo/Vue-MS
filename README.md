# vue-ms

## Project setup
```
npm install

npm run serve
```

## 电商后台管理系统

### 用户登录

#### 1.登录业务流程
- 登录页输入用户名和密码
- 调用后台接口进行验证
- 通过验证之后根据后台的响应状态跳转到项目主页

#### 2.登陆业务的相关技术点
- http 是无状态的(不存在跨域使用 cookie session，否则使用 token)
    - 结合 cookie 在客户端记录
    - 结合 session 在服务端记录状态
    - 通过 token 方式维持状态
    
#### 3.token 原理
```
客户端和服务端存在跨域
    1.登录页面输入用户名和密码登录
    2.服务器验证通过之后生成该用户的 token 并返回
    3.客户端存储 token 在 sessionStorage
    4.后续所有请求都要携带 token
    5.服务端验证 token 是否通过
```

### 退出登录

### 用户管理

### 权限管理
- 角色列表
- 权限列表

### 商品管理
- 商品列表
- 分类管理
- 参数管理

### 订单管理

### 数据统计

##  项目概述

### 开发模式
项目整体采用前后端分离的开发模式，前端项目是基于 Vue 技术栈的 SPA 项目
```
user  ------>  SPA   ------>   后端项目   ------>   数据库
```
### 技术选型

#### 前端项目技术栈
- Vue
- vue-router
- element-ui
- axios
- echarts

#### 后端项目技术栈
- nodejs
- express
- jwt: 状态保持工具，模拟 session 登录记录功能
- mongodb
- mongoose

## 项目优化策略
- 生成项目打包报告
    - 命令行参数生成打包报告
    ```
    // 通过 vue-cli 的命令选项生成
    //  report.html
    vue-cli-service build --report
    ```
    - vue ui 界面生成直接查看
- 第三方库启用 CDN
    - 配置 webpack 的 externals 节点来配置加载外部的 CDN，在 externals 中的第三方依赖都不会被打包
    ```
    config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
    })
    ```
- Element-UI 组件按需加载
- 路由懒加载
- 首页内容定制

### 加载进度条
```
npm i --save nprogress

import NProgress from 'nprogress'   // js
import 'nprogress/nprogress.css'    // css
```
- axios 请求拦截器中开启进度条
- axios 响应拦截器中关闭进度条

### 移除开发中的 console.log
```
npm i --save-dev babel-plugin-transform-remove-console
```
配置 .babelrc
```
// 项目发布阶段需要用到的 babel 插件
const proPlugins = []
if (process.env.NODE_ENV === 'production') {
  proPlugins.push("transform-remove-console")
}

"plugins": [
    ...proPlugins
  ]
```

### 为开发模式和发布模式指定不同打包入口
- 开发模式：src/main-dev.js
- 发布模式：src/main-prod.js
- configureWebpack 和 chainWebpack
- vue.config.js 导出的配置对象中，新增这两个节点，来定义 webpack 的打包配置
他们的作用相同，区别在于修改 webpack 配置的方式不同
    - chainWebpack 通过链式编程来修改
        ```
        # vue.config.js
        module.exports = {
            chainWebpack: config => {
                config.when(process.env.NODE_ENV === 'production', config => {
                    config.entry('app').clear().add('./src/main-prod.js')
                })
                config.when(process.env.NODE_ENV === 'development', config => {
                    config.entry('app').clear().add('./src/main-dev.js')
                })
            }
        }
        ```
    - configureWebpack 操作对象来修改