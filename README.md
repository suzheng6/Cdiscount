# Cdiscount USA - 测试平台

这是一个电商测试平台，用户可以通过完成简单任务来赚取佣金。

## 项目特点

- 用户注册和登录系统
- 任务系统，用户可以完成任务赚取佣金
- 会员等级系统，不同等级享受不同权益
- 交易历史记录
- 个人中心，支持充值和提现
- 多语言支持（英语和中文）
- 深色模式支持

## 快速开始

### 前提条件
- Node.js 16.x 或更高版本
- npm 或 yarn 包管理器

### 安装依赖
```bash
npm install
# 或者
yarn install
```

### 开发服务器
```bash
npm run dev
# 或者
yarn dev
```

服务器将在 http://localhost:3000 启动

### 构建项目
```bash
npm run build
# 或者
yarn build
```

构建后的文件将在 `dist` 文件夹中

## 部署指南

请参考 [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) 文件获取详细的部署说明，包括多种部署方式和详细步骤。

## 技术栈

- React 18+
- TypeScript
- Tailwind CSS
- React Router
- Framer Motion (动画)
- Sonner (提示框)
- Recharts (图表)

## 用户角色

### 普通用户
- 注册和登录账号
- 浏览和完成任务
- 查看交易历史
- 管理个人资料

### 管理员
- 管理用户账号
- 设置任务和会员等级
- 查看系统统计数据
- 配置客服信息

## 重要提示

- 这是一个测试版本，请勿在生产环境中使用真实资金
- 所有数据存储在浏览器的本地存储中，刷新页面不会丢失
- 管理员登录账号：admin，密码：admin123

## 更多资源

- 如有任何问题，请查看 [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) 或联系技术支持