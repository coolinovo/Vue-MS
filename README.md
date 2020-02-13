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


