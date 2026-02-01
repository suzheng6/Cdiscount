# Cdiscount USA - 部署指南

## 项目介绍
这是一个基于React 18+、TypeScript和Tailwind CSS构建的电商测试平台前端应用。现在，您已经完成了前端和后端的初步开发，准备将其部署为可公开访问的网站。以下是详细的部署步骤指南。

## 目录结构
```
├── .gitignore
├── README.md
├── index.html
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── src
│   ├── App.tsx
│   ├── components
│   ├── contexts
│   ├── hooks
│   ├── index.css
│   ├── lib
│   ├── main.tsx
│   ├── pages
│   └── vite-env.d.ts
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 部署前的准备工作

### 1. 代码备份
在部署前，确保您的代码已经备份到Git仓库：
```bash
# 初始化Git仓库（如果尚未初始化）
git init
git add .
git commit -m "Initial commit before deployment"

# 推送到远程仓库（如GitHub、GitLab等）
git remote add origin 您的仓库地址
git push -u origin main
```

### 2. 环境配置检查
确保您的项目具有正确的环境配置：
- 确认`package.json`中的依赖项完整
- 验证构建脚本是否正确
- 检查是否有需要在生产环境中移除的开发代码

## 前端优化与构建

### 1. 生产环境构建
运行以下命令创建生产环境构建：
```bash
# 使用pnpm构建
pnpm run build

# 或者使用npm
npm run build
```

构建完成后，会在`dist`目录中生成优化后的生产版本文件。

### 2. 构建优化
- 确保代码分割和懒加载已正确配置（如需要）
- 优化图像和静态资源
- 配置适当的缓存策略

## 后端服务搭建（替换localStorage）

当前项目使用localStorage存储用户数据，这在生产环境中是不够安全和可靠的。您需要搭建一个真正的后端服务：

### 1. 选择后端技术栈
推荐使用以下技术栈之一：
- Node.js + Express.js + MongoDB
- Firebase（全托管服务，适合快速部署）
- Supabase（开源Firebase替代品）
- 云开发平台（如腾讯云开发、阿里云函数计算等）

### 2. 数据迁移与API开发
创建必要的API端点：
- 用户注册（`POST /api/register`）
- 用户登录（`POST /api/login`）
- 获取/更新用户信息（`GET/PUT /api/user`）
- 任务管理（`GET/POST/PUT/DELETE /api/tasks`）
- 订单管理（`GET/POST /api/orders`）

### 3. 身份验证实现
实现JWT (JSON Web Token) 认证机制来替代当前的localStorage认证方式。

### 4. 示例Express.js服务器代码（简化版）
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 连接数据库
mongoose.connect('mongodb://localhost:27017/cdiscount')
  .then(() => console.log('Connected to database'))
  .catch(err => console.error('Database connection error:', err));

// 定义用户模型
const User = mongoose.model('User', {
  id: String,
  name: String,
  email: String,
  password: String, // 应该存储加密后的密码
  balance: Number,
  memberLevel: String,
  createdAt: String,
  invitationCode: String,
  referredBy: String
});

// 用户注册接口
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, invitationCode } = req.body;
    
    // 检查用户是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // 生成邀请码
    const generateInvitationCode = () => {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let code = '';
      for (let i = 0; i < 2; i++) code += letters.charAt(Math.floor(Math.random() * letters.length));
      const randomDigits = Math.floor(10 + Math.random() * 90);
      code += randomDigits;
      for (let i = 0; i < 2; i++) code += letters.charAt(Math.floor(Math.random() * letters.length));
      return code;
    };
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 创建新用户
    const newUser = new User({
      id: `user${Date.now()}`,
      name,
      email,
      password: hashedPassword,
      balance: 0,
      memberLevel: 'Silver',
      createdAt: new Date().toLocaleDateString(),
      invitationCode: generateInvitationCode(),
      referredBy: invitationCode
    });
    
    await newUser.save();
    
    // 生成JWT令牌
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      'your_jwt_secret_key',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        balance: newUser.balance,
        memberLevel: newUser.memberLevel,
        invitationCode: newUser.invitationCode
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 用户登录接口
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // 生成JWT令牌
    const token = jwt.sign(
      { id: user.id, email: user.email },
      'your_jwt_secret_key',
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        balance: user.balance,
        memberLevel: user.memberLevel,
        invitationCode: user.invitationCode
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 启动服务器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 前端适配后端API

### 1. 修改认证逻辑
在`src/contexts/authContext.ts`和登录/注册页面中，将localStorage存储改为调用API：

```typescript
// 修改后的登录逻辑示例
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    const response = await fetch('https://your-api-domain/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // 存储JWT令牌
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      toast.success('Login successful!');
      navigate('/');
    } else {
      toast.error(data.message || 'Login failed');
    }
  } catch (error) {
    toast.error('Failed to connect to server');
  } finally {
    setIsLoading(false);
  }
};
```

### 2. 创建API服务文件
创建一个新文件`src/services/api.ts`来集中管理API调用：

```typescript
const API_BASE_URL = 'https://your-api-domain.com/api';

// 创建带认证的请求头
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

// API调用函数
export const api = {
  // 用户相关
  user: {
    login: async (credentials: { email: string; password: string }) => {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(credentials),
      });
      return response.json();
    },
    register: async (userData: any) => {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });
      return response.json();
    },
    getProfile: async () => {
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return response.json();
    },
  },
  
  // 任务相关
  tasks: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return response.json();
    },
    // 其他任务相关API...
  },
  
  // 订单相关
  orders: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return response.json();
    },
    create: async (orderData: any) => {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData),
      });
      return response.json();
    },
  },
};
```

## 部署选项

### 1. 前端部署平台
以下是几个常用的前端部署平台：

#### Vercel
1. 访问 [Vercel](https://vercel.com/) 并登录
2. 点击"New Project"按钮
3. 选择您的Git仓库
4. 配置构建设置（通常Vercel会自动检测React项目）
5. 点击"Deploy"按钮
6. 等待部署完成并获取URL

#### Netlify
1. 访问 [Netlify](https://www.netlify.com/) 并登录
2. 点击"New site from Git"按钮
3. 选择您的Git仓库
4. 配置构建命令（`npm run build`或`pnpm run build`）和发布目录（`dist`）
5. 点击"Deploy site"按钮
6. 等待部署完成并获取URL

#### GitHub Pages
1. 确保您的项目有`.github/workflows`目录
2. 创建部署工作流文件`.github/workflows/deploy.yml`：
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```
3. 提交并推送此文件到GitHub
4. 在仓库设置中启用GitHub Pages，选择`gh-pages`分支

### 2. 后端部署选项

#### Heroku
1. 访问 [Heroku](https://www.heroku.com/) 并登录
2. 点击"New" -> "Create new app"
3. 给应用命名并选择区域
4. 连接您的GitHub仓库
5. 配置环境变量（如数据库连接字符串、JWT密钥等）
6. 点击"Deploy Branch"按钮

#### Vercel Serverless Functions
如果您使用Vercel部署前端，可以同时使用Vercel的Serverless Functions功能部署后端API：
1. 在项目根目录创建`api`文件夹
2. 在`api`文件夹中创建各个端点文件，如`api/login.ts`、`api/register.ts`等
3. 按照Vercel的Serverless Functions格式编写代码

#### AWS EC2/阿里云/腾讯云
1. 创建云服务器实例
2. 通过SSH连接到服务器
3. 安装Node.js和MongoDB（或其他数据库）
4. 克隆您的后端代码
5. 安装依赖并构建项目
6. 使用PM2等工具管理Node.js进程
7. 配置Nginx作为反向代理

## 域名和SSL配置

### 1. 注册域名
1. 选择一个域名注册商（如阿里云、腾讯云、GoDaddy等）
2. 搜索并购买您喜欢的域名
3. 完成域名实名认证（如适用）

### 2. 配置DNS
1. 在域名注册商的管理控制台找到DNS设置
2. 添加A记录或CNAME记录，将域名指向您的服务器IP或CDN地址
3. 等待DNS生效（通常需要几分钟到几小时）

### 3. 配置SSL证书
#### 使用Let's Encrypt（免费）
1. 在您的服务器上安装Certbot
2. 运行Certbot命令获取证书：`sudo certbot --nginx`
3. 按照提示完成配置
4. 设置自动续期：`sudo certbot renew --dry-run`

#### 使用云服务提供商的SSL证书
1. 在云服务提供商控制台申请SSL证书
2. 完成域名验证
3. 下载证书文件
4. 在Web服务器（如Nginx）中配置证书

## 部署后的维护

### 1. 监控系统运行
- 设置错误日志监控
- 监控服务器资源使用情况
- 实施用户行为分析

### 2. 定期更新
- 定期更新依赖包
- 修复安全漏洞
- 优化性能

### 3. 数据备份
- 设置定期数据库备份
- 存储备份到多个位置
- 测试备份恢复流程

## 安全性考虑

1. 实施HTTPS加密传输
2. 对敏感数据进行加密存储
3. 防止SQL注入和XSS攻击
4. 实施适当的访问控制
5. 定期进行安全审计

## 常见问题解决

### 1. 部署后页面空白
- 检查构建是否成功
- 确保路由配置正确
- 查看浏览器控制台错误

### 2. API连接失败
- 验证API地址是否正确
- 检查CORS配置
- 确认服务器正在运行

### 3. 数据库连接问题
- 验证连接字符串
- 检查数据库服务是否启动
- 确认防火墙设置正确

祝您部署顺利！如有其他问题，请随时咨询。