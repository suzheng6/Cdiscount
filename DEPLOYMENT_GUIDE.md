# Cdiscount USA 项目部署指南

这是一个详细的、面向初学者的部署指南，即使你没有任何网站搭建经验，也能按照这个指南一步步完成部署！

## 前提条件

在开始之前，你需要准备以下工具：
1. 一台可以上网的电脑
2. 一个浏览器（推荐Chrome或Firefox）
3. 一个GitHub账号（免费注册）
4. 安装Git软件（接下来会教你如何安装）

## 部署方式选择

我为你准备了几种部署方式，从最简单到稍微复杂的，你可以根据自己的情况选择：

### 方式一：使用 Vercel 一键部署（推荐，最简单）

Vercel 是一个免费的网站托管平台，可以一键部署你的React项目，完全不需要懂代码！

#### 步骤 1：安装Git软件
1. 访问 [Git官网](https://git-scm.com/downloads)
2. 下载适合你电脑系统的Git版本（Windows/Mac/Linux）
3. 安装Git，安装时保持所有默认选项即可

#### 步骤 2：将项目代码推送到你的 GitHub 仓库
你已经注册了GitHub账号并创建了仓库，现在需要将项目代码推送到仓库中：

1. 首先，确保你已经有了项目的完整代码
2. 在你的电脑上，找到存放项目代码的文件夹
3. 在这个文件夹内，点击鼠标右键，选择 "Git Bash Here"（Windows）或 "在终端中打开"（Mac）
4. 在打开的命令窗口中，输入以下命令并按回车执行：
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/你的GitHub用户名/你的仓库名称.git
   git push -u origin main
   ```
   注意：将"你的GitHub用户名"和"你的仓库名称"替换成你自己的GitHub用户名和仓库名称

   例如：如果你的GitHub用户名是 "user123"，仓库名称是 "cdiscount-usa"，那么命令应该是：
   ```bash
   git remote add origin https://github.com/user123/cdiscount-usa.git
   ```

5. 执行完上面的命令后，系统会提示你输入GitHub的用户名和密码（或个人访问令牌），输入完成后按回车
6. 等待代码上传完成，这样你的项目代码就成功推送到GitHub仓库了！

#### 步骤 3：使用 Vercel 一键部署
1. 访问 [Vercel官网](https://vercel.com)
2. 点击右上角的 "Sign Up" 注册账号（可以直接用GitHub账号登录）
3. 登录后，点击 "New Project"
4. 选择你刚才创建的GitHub仓库（比如 "cdiscount-usa"）
5. 点击 "Import" 按钮
6. 在配置页面，保持所有默认设置，确保 "Framework Preset" 选择为 "Vite"
7. 点击 "Deploy" 按钮
8. 等待几分钟，Vercel会自动构建并部署你的网站
9. 部署完成后，你会得到一个类似 `https://cdiscount-usa.vercel.app` 的网址，这就是你的网站地址！

**重要提示：** 我们已经添加了 `vercel.json` 配置文件来解决SPA路由问题，确保所有路由都能正确访问。

### 方式二：使用 Netlify 一键部署

Netlify 和 Vercel 类似，也是一个免费的网站托管平台。

#### 步骤 1：将项目代码推送到GitHub仓库（同方式一的步骤1和2）

#### 步骤 2：使用 Netlify 一键部署
1. 访问 [Netlify官网](https://www.netlify.com)
2. 点击右上角的 "Sign Up" 注册账号（可以直接用GitHub账号登录）
3. 登录后，点击 "New site from Git"
4. 选择 "GitHub"，然后选择你的仓库
5. 保持默认设置，点击 "Deploy site" 按钮
6. 等待几分钟，Netlify会自动构建并部署你的网站
7. 部署完成后，你会得到一个类似 `https://你的网站名称.netlify.app` 的网址，这就是你的网站地址！

### 方式三：使用 GitHub Pages 部署

GitHub Pages 是 GitHub 提供的免费静态网站托管服务。

#### 步骤 1：修改项目配置
1. 在项目代码中，找到并打开 `package.json` 文件
2. 在 `scripts` 部分添加一行：
   ```json
   "deploy": "npm run build && npx gh-pages -d dist"
   ```
3. 在文件末尾添加一行（注意替换为你的GitHub用户名和仓库名称）：
   ```json
   "homepage": "https://你的GitHub用户名.github.io/你的仓库名称"
   
   然后在文件中找到并添加一个新的配置部分：
   ```json
   "vite": {
     "base": "/你的仓库名称/"
   }
   ```

#### 步骤 2：安装依赖并部署
1. 在项目文件夹中打开命令窗口（Git Bash或终端）
2. 运行以下命令：
   ```bash
   npm install -g gh-pages
   npm install
   npm run deploy
   ```
3. 等待部署完成，你的网站就会发布在 `https://你的GitHub用户名.github.io/你的仓库名称`

## 高级部署选项（使用自己的服务器）

如果你有自己的服务器，或者想要更灵活的部署方式，可以按照以下步骤进行：

### 步骤 1：准备服务器
1. 购买一个云服务器（推荐阿里云、腾讯云、AWS等）
2. 安装 Node.js（推荐版本 16.x 或更高）
3. 安装 Nginx（一个网页服务器软件）

### 步骤 2：构建项目
1. 在本地电脑上，打开命令窗口（Git Bash或终端）
2. 导航到你的项目文件夹
3. 运行以下命令构建项目：
   ```bash
   npm install
   npm run build
   ```
4. 构建完成后，项目根目录会生成一个 `dist` 文件夹，里面包含了所有需要部署的文件

### 步骤 3：部署到服务器
1. 使用 FTP 工具（如 FileZilla）将 `dist` 文件夹中的所有文件上传到你的服务器
2. 配置 Nginx 以提供这些文件
3. 你可以参考网上的 Nginx 配置教程，这部分稍微复杂一点

## 绑定自定义域名

如果你想使用自己的域名（例如 `www.your-site.com`），可以按照以下步骤操作：

### 步骤 1：购买域名
1. 访问域名注册商（如阿里云、腾讯云、GoDaddy等）
2. 搜索并购买你喜欢的域名

### 步骤 2：配置域名解析
1. 在域名注册商的管理后台，找到 "域名解析" 或 "DNS 设置"
2. 添加一条 A 记录，将你的域名指向你的服务器IP地址（如果使用Vercel或Netlify，则按照它们的文档进行配置）

### 步骤 3：在托管平台配置自定义域名
1. 如果你使用 Vercel 或 Netlify，登录到它们的后台
2. 找到你的项目，进入设置页面
3. 找到 "自定义域名" 选项，按照提示添加你的域名

## 常见问题解决

1. **部署后网站显示404错误？**
   - 这是单页应用(SPA)的常见问题。如果你使用GitHub Pages，确保添加了正确的homepage和vite.base配置
   - 如果你使用Vercel或Netlify，确保配置了正确的路由回退设置
   - 对于Apache服务器，需要创建`.htaccess`文件（见下文）

2. **部署后网站显示空白？**
   - 检查是否正确构建了项目
   - 检查浏览器控制台是否有错误信息
   - 确保所有文件都已正确上传

3. **页面可以访问，但样式不对？**
   - 检查 CSS 文件路径是否正确
   - 尝试重新构建并部署项目

4. **自定义域名无法访问？**
   - 检查域名解析是否正确配置
   - DNS 记录可能需要 24-48 小时才能全球生效

5. **Git 命令执行错误？**
   - 确保你的GitHub账号和密码（或个人访问令牌）正确
   - 确保你的仓库地址格式正确
   - 如果你使用的是Windows系统，尝试使用"Git Bash"而不是"命令提示符"

## 解决SPA路由404问题的特殊配置

对于使用Apache服务器的部署，需要在网站根目录创建一个`.htaccess`文件，内容如下：

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

这个配置确保所有请求都被重定向到index.html，这样React Router就能正确处理路由。

对于Nginx服务器，需要在配置文件中添加：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}

如果你在部署过程中遇到任何问题，可以随时联系我获取帮助！