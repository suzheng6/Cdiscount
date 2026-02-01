# Git 配置指南

在使用Git提交代码之前，您需要先配置Git的用户名和邮箱地址。这是Git提交代码时必须的身份信息。

## 步骤 1：配置Git用户名和邮箱

打开Git Bash（Windows）或终端（Mac/Linux），输入以下命令（请替换为您自己的信息）：

```bash
git config --global user.email "your.email@example.com"
git config --global user.name "Your Name"
```

**说明：**
- 将`your.email@example.com`替换为您的实际邮箱地址
- 将`Your Name`替换为您的实际姓名
- `--global`参数表示这是全局配置，会应用到所有Git仓库

## 步骤 2：验证配置是否成功

输入以下命令检查配置是否已正确设置：

```bash
git config --global --list
```

您应该能看到包含您刚才设置的用户名和邮箱的输出。

## 步骤 3：继续您的Git操作

完成配置后，您可以继续执行之前的Git命令：

```bash
git commit -m "Initial commit"
git remote add origin https://github.com/您的GitHub用户名/您的仓库名称.git
git push -u origin main
```

## 常见问题解答

**问：我应该使用什么邮箱？**  
答：建议使用您注册GitHub时使用的邮箱，这样GitHub才能正确关联您的提交。

**问：配置后还需要其他操作吗？**  
答：不需要，配置后您就可以正常使用Git进行代码提交和推送了。

**问：如何为不同的项目使用不同的用户名和邮箱？**  
答：进入特定项目的文件夹，去掉`--global`参数执行相同的命令：
```bash
git config user.email "different.email@example.com"
git config user.name "Different Name"
```

如果您在操作过程中遇到任何问题，可以随时联系我获取帮助！