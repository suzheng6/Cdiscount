import { createContext, useState, useEffect, createElement } from "react";

// 支持的语言类型
type Language = 'en' | 'zh';

// 定义语言上下文的接口
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// 创建并导出LanguageContext
export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key
});

  // 翻译字典
  const translations = {
  en: {
    // 常见文本
    welcome: 'Welcome',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    logout: 'Logout',
    home: 'Home',
    orders: 'Orders',
    tasks: 'Tasks',
    support: 'Support',
    profile: 'Profile',
    
    // Header
    balance: 'Balance',
    
    // Home Page
    betaTestingPhase: 'Beta Testing Phase',
    cdiscountUSA: 'Cdiscount USA',
    homeDescription: "France's leading e-commerce platform is now in the US! Join our beta testing program and earn commissions by completing simple tasks.",
    startEarning: 'Start Earning',
    joinNow: 'Join Now',
    liveDashboard: 'Live Dashboard',
    trackYourEarnings: 'Track Your Earnings in Real-time',
    yourBalance: 'Your Balance',
    
    howItWorks: 'How It Works',
    simpleSteps: 'Simple Steps to Start Earning',
    howItWorksDescription: 'Our platform makes it easy for you to earn commissions by completing simple tasks. Follow these steps to get started.',
    
    registerAccount: 'Register Account',
    registerAccountDesc: 'Sign up for a free account to get started with our platform.',
    addFunds: 'Add Funds',
    addFundsDesc: 'Deposit money into your account to be able to grab tasks.',
    completeTasks: 'Complete Tasks',
    completeTasksDesc: 'Grab available tasks and complete them to earn commissions.',
    withdrawEarnings: 'Withdraw Earnings',
    withdrawEarningsDesc: 'Withdraw your earnings to your preferred payment method.',
    
    membershipPlans: 'Membership Plans',
    chooseYourMemberLevel: 'Choose Your Member Level',
    membershipDescription: 'Unlock more earning potential with our premium membership plans. Each level offers better benefits and higher commission rates.',
    
    basic: 'Basic',
    starterPackage: 'Starter Package',
    premium: 'Premium',
    advancedPackage: 'Advanced Package',
    vip: 'VIP',
    elitePackage: 'Elite Package',
    
    silverBenefits: [
      'Commission Rate: 0.5%',
      'Daily Task Limit: 50 tasks',
      'Account Balance Required: ≥$500',
      'Access to basic tasks',
      'Email support'
    ],
    goldBenefits: [
      'Commission Rate: 0.6%',
      'Daily Task Limit: 50 tasks',
      'Account Balance Required: ≥$3,000',
      'Access to intermediate tasks',
      'Priority email support',
      'Exclusive task alerts'
    ],
    platinumBenefits: [
      'Commission Rate: 0.7%',
      'Daily Task Limit: 50 tasks',
      'Account Balance Required: ≥$6,000',
      'Access to premium tasks',
      'Priority email support',
      'Exclusive task alerts',
      'Higher value tasks'
    ],
    diamondBenefits: [
      'Commission Rate: 0.8%',
      'Daily Task Limit: 50 tasks',
      'Account Balance Required: ≥$20,000',
      'Access to all tasks',
      '24/7 priority support',
      'Exclusive task alerts',
      'Higher value tasks'
    ],
    blackDiamondBenefits: [
      'Commission Rate: 0.9%',
      'Daily Task Limit: 50 tasks',
      'Account Balance Required: ≥$50,000',
      'Access to all tasks',
      '24/7 priority support',
      'Exclusive task alerts',
      'Higher value tasks',
      'Dedicated account manager'
    ],
    crownBenefits: [
      'Commission Rate: 1.0%',
      'Daily Task Limit: 50 tasks',
      'Account Balance Required: ≥$100,000',
      'Access to all tasks',
      '24/7 priority support',
      'Exclusive task alerts',
      'Highest value tasks',
      'Dedicated account manager'
    ],
    supremeBenefits: [
      'Commission Rate: 1.1%',
      'Daily Task Limit: 50 tasks',
      'Account Balance Required: ≥$200,000',
      'Access to all tasks',
      '24/7 dedicated support',
      'Exclusive task alerts',
      'Highest value tasks',
      'Dedicated account manager',
      'Priority for new feature testing'
    ],
    
    currentPlan: 'Current Plan',
    upgradeNow: 'Upgrade Now',
    
    totalPaidCommissions: 'Total Paid Commissions',
    activeUsers: 'Active Users',
    tasksCompleted: 'Tasks Completed',
    userSatisfaction: 'User Satisfaction',
    
    readyToStartEarning: 'Ready to Start Earning?',
    ctaDescription: 'Join thousands of users already earning commissions with Cdiscount USA. Sign up today and start your journey.',
    signUpNow: 'Sign Up Now',
    exploreTasks: 'Explore Tasks',
    
    // Login Page
    welcomeBack: 'Welcome Back',
    signInToYourAccount: 'Sign in to your Cdiscount USA account',
    emailAddress: 'Email Address',
    password: 'Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    dontHaveAnAccount: "Don't have an account?",
    signingIn: 'Signing in...',
    
    // Register PagecreateAccount: 'Create Account',
    joinBetaTesting: 'Join Cdiscount USA Beta Testing Program',
    fullName: 'Full Name',
    confirmPassword: 'Confirm Password',
    agreeToTerms: 'I agree to the Terms of Service and Privacy Policy',
    alreadyHaveAnAccount: 'Already have an account?',
    signingUp: 'Signing up...',
    
    // Order History
    orderHistory: 'Order History',
    trackYourCompletedTasks: 'Track all your completed tasks and earnings',
    totalTasksCompleted: 'Total Tasks Completed',
    totalOrderAmount: 'Total Order Amount',
    totalCommissionEarned: 'Total Commission Earned',
    
    all: 'All',
    completed: 'Completed',
    pending: 'Pending',
    failed: 'Failed',
    
    orderAmount: 'Order Amount:',
    commission: 'Commission:',
    
    // Tasks Page
    availableTasks: 'Available Tasks',
    grabTasksDescription: 'Grab tasks to earn commissions. Check back regularly for new opportunities.',
    
    dailyTasks: 'Daily Tasks',
    lastUpdated: 'Last updated:',
    noAvailableTasks: 'No Available Tasks',
    needMoreBalance: 'You need more balance to grab tasks.',
    checkBackLater: 'Check back later for new tasks.',
    addFundsButton: 'Add Funds',
    
    taskCompleted: 'Task Completed',
    insufficientBalance: 'Insufficient Balance',
    grabTask: 'Grab Task',
    taskCompletedMessage: 'Task completed! You earned ${{amount}}.',
    taskGrabbedMessage: 'Task grabbed: {{title}}. Processing...',
    
    // Support Page
    customerSupport: 'Customer Support',
    weAreHereToHelp: "We're here to help you with any questions or issues you may have.",
    
    sendUsAMessage: 'Send Us a Message',
    yourName: 'Your Name',
    yourEmail: 'Your Email',
    subject: 'Subject',
    yourMessage: 'Your Message',
    sending: 'Sending...',
    sendMessage: 'Send Message',
    selectASubject: 'Select a subject',
    accountIssues: 'Account Issues',
    withdrawalProblems: 'Withdrawal Problems',
    taskQuestions: 'Task Questions',
    other: 'Other',
    describeYourIssue: 'Please describe your issue or question in detail',
    messageSentSuccessfully: 'Your message has been sent! We will get back to you soon.',
    
    frequentlyAskedQuestions: 'Frequently Asked Questions',
    contactInformation: 'Contact Information',
    
    emailSupport: 'Email Support',
    liveChat: 'Live Chat',
    phoneSupport: 'Phone Support',
    businessHours: 'Business Hours',
    available247: 'Available 24/7',
    
    chatWithSupport: 'Chat with Support',
    
    // FAQ Answers
    howToGetStarted: 'Getting started is easy! Simply register for an account, add funds to your balance, and start grabbing tasks from the Tasks page. Each completed task earns you a commission.',
    howToWithdraw: 'You can withdraw your earnings from the Profile page. Click on the "Withdraw" button, enter the amount you wish to withdraw, and select your preferred payment method.',
    minimumWithdrawal: 'The minimum withdrawal amount is $50. Please ensure your account balance meets this requirement before submitting a withdrawal request.',
    withdrawalProcessingTime: 'Withdrawal requests are typically processed within 1-3 business days. You will receive a notification once your withdrawal has been processed.',
    upgradeMembership: 'Yes, you can upgrade your membership level at any time from the Home page. Upgrading gives you access to more tasks and higher commission rates.',
    
    // Profile Page
    accountBalance: 'Account Balance',
    addFundsProfile: 'Add Funds',
    withdrawFundsProfile: 'Withdraw',
    
    accountInfo: 'Account Info',
    depositFunds: 'Deposit Funds',
    withdrawFunds: 'Withdraw Funds',
    transactionHistory: 'Transaction History',
    settings: 'Settings',
    
    fullNameProfile: 'Full Name',
    emailAddressProfile: 'Email Address',
    memberLevel: 'Member Level',
    accountCreated: 'Account Created',
    
    todaysEarnings: "Today's Earnings",
    totalCommissionEarnedToday: 'Total Commission Earned Today',
    
    currentBalance: 'Current Balance',
    availableBalance: 'Available Balance',
    minimumWithdrawalAmount: 'Minimum withdrawal: $50',
    depositAmount: 'Deposit Amount',
    withdrawalAmount: 'Withdrawal Amount',
    paymentMethod: 'Payment Method',
    withdrawalMethod: 'Withdrawal Method',
    enterYourName: 'Enter your name',
    enterYourEmail: 'Enter your email',
    enterAmountMinimum10: 'Enter amount (minimum $10)',
    enterAmountMinimum50: 'Enter amount (minimum $50)',
    
    depositFundsButton: 'Deposit Funds',
    requestWithdrawalButton: 'Request Withdrawal',
    
    transactionTypes: {
      deposit: 'Deposit',
      commission: 'Commission',
      withdrawal: 'Withdrawal'
    },
    
    withdrawalHistory: 'Withdrawal History',
    depositHistory: 'Deposit History',
    deposits: 'Deposits',
    withdrawals: 'Withdrawals',
    commissions: 'Commissions',
    
    paymentMethods: 'Payment Methods',
    securitySettings: 'Security Settings',
    notifications: 'Notifications',
    
    twoFactorAuthentication: 'Two-Factor Authentication',
    enhanceYourAccountSecurity: 'Enhance your account security',
    transactionPassword: 'Transaction Password',
    setUpTransactionPassword: 'Set up a password for transactions',
    setPassword: 'Set Password',
    changeLoginPassword: 'Change Login Password',
    updateYourAccountPassword: 'Update your account password',
    change: 'Change',
    
    // Payment Methods
    creditCard: 'Credit Card',
    bankTransfer: 'Bank Transfer',
    
    taskAlerts: 'Task Alerts',
    receiveTaskAlerts: 'Receive notifications when new tasks are available',
    withdrawalUpdates: 'Withdrawal Updates',
    getWithdrawalUpdates: 'Get updates on your withdrawal requests',
    accountActivity: 'Account Activity',
    monitorAccountActivity: 'Monitor account login and transaction activity',
    promotionalOffers: 'Promotional Offers',
    receiveSpecialOffers: 'Receive special offers and promotions',
    
    // Footer
    bringingToUS: "Bringing France's top e-commerce platform to the United States. Currently in beta testing phase.",
    quickLinks: 'Quick Links',
    legal: 'Legal',
    contactUs: 'Contact Us',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    cookiePolicy: 'Cookie Policy',
    gdprCompliance: 'GDPR Compliance',
    emailFooter: 'Email',
    phoneFooter: 'Phone',
    addressFooter: 'Address',
    allRightsReserved: 'All rights reserved.',
    termsFooter: 'Terms',
    privacyFooter: 'Privacy',
    cookiesFooter: 'Cookies',
    
  // Admin Dashboard
    dashboard: 'Dashboard',
    name: 'Name',
    memberLevels: 'Member Levels',
    supportSettings: 'Support Settings',
    userManagement: 'User Management',
    taskManagement: 'Task Management',
    quickActions: 'Quick Actions',
    manageMemberLevels: 'Manage Member Levels',
    updateSupportInfo: 'Update Support Info',
    manageTasks: 'Manage Tasks',
    recentActivity: 'Recent Activity',
    menu: 'Menu',
    level: 'Level',
    title: 'Title',
    commissionRate: 'Commission Rate',
    dailyTaskLimit: 'Daily Task Limit',
    balanceRequirement: 'Balance Requirement',
    actions: 'Actions',
    edit: 'Edit',
    cancel: 'Cancel',
    saveChanges: 'Save Changes',
    editMemberLevel: 'Edit Member Level',
    levelName: 'Level Name',
    packageTitle: 'Package Title',
    user: 'User',
    email: 'Email',
    joined: 'Joined',
    searchUsers: 'Search users by name, email or ID...',
    noUsersFound: 'No Users Found',
    noUsersMatchCriteria: 'No users match your search criteria.',
    noRegisteredUsers: 'There are currently no registered users.',
    editUser: 'Edit User',
    enterUserName: 'Enter user name',
    enterUserEmail: 'Enter user email',
    enterUserBalance: 'Enter user balance',
    delete: 'Delete',
    addNewTask: 'Add New Task',
    task: 'Task',
    price: 'Price',
    returnPercentage: 'Return %',
    clickAddTaskButton: 'Click the "Add New Task" button to create your first task.',
    taskTitle: 'Task Title',
    taskPrice: 'Task Price',
    enterTaskTitle: 'Enter task title',
    enterTaskPrice: 'Enter task price',
    enterCommissionAmount: 'Enter commission amount',
    taskImageUrl: 'Task Image URL',
    enterImageUrl: 'Enter image URL',
    addTask: 'Add Task',
    editTask: 'Edit Task',
    supportEmail: 'Support Email',
    enterSupportEmail: 'Enter support email',
    supportPhone: 'Support Phone',
    enterSupportPhone: 'Enter support phone number',
    enterBusinessHours: 'Enter business hours',
    telegramSupportLink: 'Telegram Support Link',
    enterTelegramLink: 'Enter Telegram support link',
    telegramLinkDescription: 'Users will be redirected to this Telegram link when they click "Chat with Support"',
  },
  zh: {
    // 常见文本
    welcome: '欢迎',
    signIn: '登录',
    signUp: '注册',
    logout: '退出',
    home: '首页',
    orders: '订单',
    tasks: '任务',
    support: '客服',
    profile: '个人中心',
    
    // Header
    balance: '余额',
    
    // Home Page
    betaTestingPhase: '测试阶段',
    cdiscountUSA: 'Cdiscount美国',
    homeDescription: '法国领先的电子商务平台现已登陆美国！加入我们的测试计划，通过完成简单任务赚取佣金。',
    startEarning: '开始赚钱',
    joinNow: '立即加入',
    liveDashboard: '实时控制面板',
    trackYourEarnings: '实时追踪您的收益',
    yourBalance: '您的余额',
    
    howItWorks: '如何运作',
    simpleSteps: '开始赚钱的简单步骤',
    howItWorksDescription: '我们的平台让您轻松通过完成简单任务赚取佣金。按照以下步骤开始。',
    
    registerAccount: '注册账户',
    registerAccountDesc: '注册免费账户以开始使用我们的平台。',
    addFunds: '添加资金',
    addFundsDesc: '向您的账户存入资金以便能够抢任务。',
    completeTasks: '完成任务',
    completeTasksDesc: '抢可用任务并完成它们以赚取佣金。',
    withdrawEarnings: '提现收益',
    withdrawEarningsDesc: '将您的收益提现到您首选的支付方式。',
    
    membershipPlans: '会员计划',
    chooseYourMemberLevel: '选择您的会员等级',
    membershipDescription: '通过我们的高级会员计划释放更多赚钱潜力。每个等级提供更好的福利和更高的佣金率。',
    
    silver: '白银',
    silverPackage: '白银套餐',
    gold: '黄金',
    goldPackage: '黄金套餐',
    platinum: '铂金',
    platinumPackage: '铂金套餐',
    diamond: '钻石',
    diamondPackage: '钻石套餐',
    blackDiamond: '黑钻',
    blackDiamondPackage: '黑钻套餐',
    crown: '皇冠',
    crownPackage: '皇冠套餐',
    supreme: '至尊',
    supremePackage: '至尊套餐',
    
    silverBenefits: [
      '佣金率：0.5%',
      '每日任务上限：50单',
      '账户余额要求：≥500美元',
      '访问基础任务',
      '电子邮件支持'
    ],
    goldBenefits: [
      '佣金率：0.6%',
      '每日任务上限：50单',
      '账户余额要求：≥3000美元',
      '访问中级任务',
      '优先电子邮件支持',
      '专属任务提醒'
    ],
    platinumBenefits: [
      '佣金率：0.7%',
      '每日任务上限：50单',
      '账户余额要求：≥6000美元',
      '访问高级任务',
      '优先电子邮件支持',
      '专属任务提醒',
      '更高价值的任务'
    ],
    diamondBenefits: [
      '佣金率：0.8%',
      '每日任务上限：50单',
      '账户余额要求：≥20000美元',
      '访问所有任务',
      '24/7优先支持',
      '专属任务提醒',
      '更高价值的任务'
    ],
    blackDiamondBenefits: [
      '佣金率：0.9%',
      '每日任务上限：50单',
      '账户余额要求：≥50000美元',
      '访问所有任务',
      '24/7优先支持',
      '专属任务提醒',
      '更高价值的任务',
      '专属客户经理'
    ],
    crownBenefits: [
      '佣金率：1.0%',
      '每日任务上限：50单','账户余额要求：≥100000美元',
      '访问所有任务',
      '24/7优先支持',
      '专属任务提醒',
      '最高价值的任务',
      '专属客户经理'
    ],
    supremeBenefits: [
      '佣金率：1.1%',
      '每日任务上限：50单',
      '账户余额要求：≥200000美元',
      '访问所有任务',
      '24/7专属支持',
      '专属任务提醒',
      '最高价值的任务',
      '专属客户经理',
      '优先参与新功能测试'
    ],
    
    currentPlan: '当前计划',
    upgradeNow: '立即升级',
    
    totalPaidCommissions: '已支付佣金总额',
    activeUsers: '活跃用户',
    tasksCompleted: '已完成任务',
    userSatisfaction: '用户满意度',
    
    readyToStartEarning: '准备好开始赚钱了吗？',
    ctaDescription: '加入成千上万已经在Cdiscount美国版赚取佣金的用户。今天注册并开始您的旅程。',
    signUpNow: '立即注册',
    exploreTasks: '浏览任务',
    
    // Login Page
    welcomeBack: '欢迎回来',
    signInToYourAccount: '登录您的Cdiscount美国账户',
    emailAddress: '电子邮箱',
    password: '密码',
    rememberMe: '记住我',
    forgotPassword: '忘记密码？',
    dontHaveAnAccount: '还没有账户？',
    signingIn: '登录中...',
    
    // Register Page
    createAccount: '创建账户',
    joinBetaTesting: '加入Cdiscount美国测试计划',
    fullName: '全名',
    confirmPassword: '确认密码',
    agreeToTerms: '我同意服务条款和隐私政策',
    alreadyHaveAnAccount: '已有账户？',
    signingUp: '注册中...',
    
    // Order History
    orderHistory: '订单历史',
    trackYourCompletedTasks: '追踪您所有已完成的任务和收益',
    totalTasksCompleted: '已完成任务总数',
    totalOrderAmount: '订单总金额',
    totalCommissionEarned: '已赚取佣金总额',
    
    all: '全部',
    completed: '已完成',
    pending: '待处理',
    failed: '失败',
    
    orderAmount: '订单金额:',
    commission: '佣金:',
    
    // Tasks Page
    availableTasks: '可用任务',
    grabTasksDescription: '抢任务赚取佣金。定期回来查看新机会。',
    
    dailyTasks: '每日任务',
    lastUpdated: '最后更新:',
    noAvailableTasks: '暂无可用任务',
    needMoreBalance: '您需要更多余额才能抢任务。',
    checkBackLater: '稍后再来查看新任务。',
    addFundsButton: '添加资金',
    
    taskCompleted: '任务已完成',
    insufficientBalance: '余额不足',
    grabTask: '抢任务',
    taskCompletedMessage: '任务完成！您赚取了${{amount}}。',
    taskGrabbedMessage: '已抢任务: {{title}}。处理中...',
    
    // Support Page
    customerSupport: '客户支持',
    weAreHereToHelp: '我们随时为您解答任何问题或解决您可能遇到的任何问题。',
    
    sendUsAMessage: '给我们留言',
    yourName: '您的姓名',
    yourEmail: '您的邮箱',
    subject: '主题',
    yourMessage: '您的留言',
    sending: '发送中...',
    sendMessage: '发送留言',
    selectASubject: '选择主题',
    accountIssues: '账户问题',
    withdrawalProblems: '提现问题',
    taskQuestions: '任务问题',
    other: '其他',
    describeYourIssue: '请详细描述您的问题',
    messageSentSuccessfully: '您的留言已发送！我们将尽快回复您。',
    
    frequentlyAskedQuestions: '常见问题',
    contactInformation: '联系信息',
    
    emailSupport: '电子邮件支持',
    liveChat: '在线聊天',
    phoneSupport: '电话支持',
    businessHours: '营业时间',
    available247: '24/7可用',
    
    chatWithSupport: '与客服聊天',
    
    // FAQ Answers
    howToGetStarted: '入门很简单！只需注册一个账户，向您的余额添加资金，然后从任务页面开始抢任务。每个完成的任务都会为您赚取佣金。',
    howToWithdraw: '您可以从个人中心页面提现您的收益。点击"提现"按钮，输入您希望提现的金额，然后选择您首选的支付方式。',
    minimumWithdrawal: '最低提现金额为50美元。请确保您的账户余额满足此要求，然后再提交提现请求。',
    withdrawalProcessingTime: '提现请求通常在1-3个工作日内处理。一旦您的提现被处理，您将收到通知。',
    upgradeMembership: '是的，您可以随时从首页升级您的会员等级。升级可以访问更多任务和更高的佣金率。',
    
    // Profile Page
    accountBalance: '账户余额',
    addFundsProfile: '添加资金',
    withdrawFundsProfile: '提现',
    
    accountInfo: '账户信息',
    depositFunds: '存入资金',
    withdrawFunds: '提现资金',
    transactionHistory: '交易历史',
    settings: '设置',
    
    fullNameProfile: '全名',
    emailAddressProfile: '电子邮箱',
    memberLevel: '会员等级',
    accountCreated: '账户创建日期',
    
    todaysEarnings: '今日收益',
    totalCommissionEarnedToday: '今日已赚取佣金总额',
    
    currentBalance: '当前余额',
    availableBalance: '可用余额',
    minimumWithdrawalAmount: '最低提现金额：50美元',
    depositAmount: '存入金额',
    withdrawalAmount: '提现金额',
    paymentMethod: '支付方式',
    withdrawalMethod: '提现方式',
    enterYourName: '输入您的姓名',
    enterYourEmail: '输入您的邮箱',
    enterAmountMinimum10: '输入金额（最低10美元）',
    enterAmountMinimum50: '输入金额（最低50美元）',
    
    depositFundsButton: '存入资金',
    requestWithdrawalButton: '申请提现',
    
    transactionTypes: {
      deposit: '存入',
      commission: '佣金',
      withdrawal: '提现'
    },
    
    withdrawalHistory: '提现历史',
    depositHistory: '存入历史',
    deposits: '存入记录',
    withdrawals: '提现记录',
    commissions: '佣金记录',
    
    paymentMethods: '支付方式',
    securitySettings: '安全设置',
    notifications: '通知',
    
    twoFactorAuthentication: '双重认证',
    enhanceYourAccountSecurity: '增强您的账户安全性',
    transactionPassword: '交易密码',
    setUpTransactionPassword: '设置交易密码',
    setPassword: '设置密码',
    changeLoginPassword: '修改登录密码',
    updateYourAccountPassword: '更新您的账户密码',
    change: '修改',
    
    // Payment Methods
    creditCard: '信用卡',
    bankTransfer: '银行转账',
    
    taskAlerts: '任务提醒',
    receiveTaskAlerts: '当有新任务可用时接收通知',
    withdrawalUpdates: '提现更新',
    getWithdrawalUpdates: '获取您的提现请求更新',
    accountActivity: '账户活动',
    monitorAccountActivity: '监控账户登录和交易活动',
    promotionalOffers: '促销优惠',
    receiveSpecialOffers: '接收特别优惠和促销活动',
    
    // Footer
    bringingToUS: '将法国顶级电子商务平台带到美国。目前处于测试阶段。',
    quickLinks: '快速链接',
    legal: '法律信息',
    contactUs: '联系我们',
    termsOfService: '服务条款',
    privacyPolicy: '隐私政策',
    cookiePolicy: 'Cookie政策',
    gdprCompliance: 'GDPR合规',
    emailFooter: '邮箱',
    phoneFooter: '电话',
    addressFooter: '地址',
    allRightsReserved: '保留所有权利。',
    termsFooter: '条款',
    privacyFooter: '隐私',
    cookiesFooter: 'Cookies',
    
    // Admin Dashboard
    dashboard: '控制面板',
    memberLevels: '会员等级',
    supportSettings: '客服设置',
    userManagement: '用户管理',
    taskManagement: '任务管理',
    quickActions: '快速操作',
    manageMemberLevels: '管理会员等级',
    updateSupportInfo: '更新客服信息',
    manageTasks: '管理任务',
    recentActivity: '最近活动',
    menu: '菜单',
    level: '等级',
    title: '标题',
    commissionRate: '佣金率',
    dailyTaskLimit: '每日任务上限',
    balanceRequirement: '余额要求',
    actions: '操作',
    edit: '编辑',
    cancel: '取消',
    saveChanges: '保存更改',
    editMemberLevel: '编辑会员等级',
    levelName: '等级名称',
    packageTitle: '套餐标题',
    user: '用户',
    email: '电子邮箱',
    joined: '加入日期',
    searchUsers: '搜索用户（按名称、邮箱或ID）...',
    noUsersFound: '未找到用户',
    noUsersMatchCriteria: '没有符合搜索条件的用户。',
    noRegisteredUsers: '当前没有注册用户。',
    editUser: '编辑用户',
    enterUserName: '输入用户名',
    enterUserEmail: '输入用户邮箱',
    enterUserBalance: '输入用户余额',
    delete: '删除',
    addNewTask: '添加新任务',
    task: '任务',
    price: '价格',
    returnPercentage: '回报率 %',
    clickAddTaskButton: '点击"添加新任务"按钮创建您的第一个任务。',
    taskTitle: '任务标题',
    taskPrice: '任务价格',
    enterTaskTitle: '输入任务标题',
    enterTaskPrice: '输入任务价格',
    enterCommissionAmount: '输入佣金金额',
    taskImageUrl: '任务图片URL',
    enterImageUrl: '输入图片URL',
    addTask: '添加任务',
    editTask: '编辑任务',
    supportEmail: '客服邮箱',
    enterSupportEmail: '输入客服邮箱',
    supportPhone: '客服电话',
    enterSupportPhone: '输入客服电话',
    enterBusinessHours: '输入营业时间',
    telegramSupportLink: 'Telegram客服链接',
    enterTelegramLink: '输入Telegram链接',
    telegramLinkDescription: '用户点击"与客服聊天"时将重定向到此Telegram链接'
     }
  };

  // 添加会员卡片默认翻译
  translations.en.accessMemberTasks = 'Access to member exclusive tasks';
  translations.en.dailyTaskLimit = 'Daily limit of 50 tasks';
  translations.en.dedicatedSupport = 'Dedicated customer support';
  translations.en.commissionBasedOnLevel = 'Different commission rates based on level';

  translations.zh.accessMemberTasks = '访问会员专属任务';
  translations.zh.dailyTaskLimit = '每日限制50个任务';
  translations.zh.dedicatedSupport = '专属客户支持';
  translations.zh.commissionBasedOnLevel = '根据等级享受不同佣金率';

  // 添加任务页面新的翻译项
  translations.en.matchingTask = 'Matching Task...';
  translations.en.dailyLimitReachedButton = 'Daily Limit Reached';
  translations.en.completeLuckyOrderFirst = 'Complete Lucky Order First';
  translations.en.availableProducts = 'Available Products';
  translations.en.allLevels = 'All Levels';
  translations.en.yourMemberLevel = 'Your Member Level';
  translations.en.currentBalance = 'Current Balance';
  translations.en.minimumBalanceRequired = 'Minimum Balance Required';
  translations.en.commissionRate = 'Commission Rate';
  translations.en.tasksRemainingToday = 'Tasks Remaining Today';
  translations.en.submitOrder = 'Submit Order';
  translations.en.cancel = 'Cancel';
  translations.en.price = 'Price';
  translations.en.specialBonus = 'Special Bonus';
  translations.en.luckyOrderTitle = '🎉 Lucky Order!';
  translations.en.luckyOrderDescription = 'You\'ve received a special lucky order with extra commission!';
  translations.en.luckyOrderAvailable = 'You have a lucky order available! Complete it for extra rewards.';
  translations.en.mustCompleteLuckyOrder = 'You must complete your lucky order before continuing with regular tasks.';
  translations.en.needToRechargeForLuckyOrder = 'You need to recharge at least ${{amount}} to complete this lucky order.';
  translations.en.dailyLimitReached = 'You\'ve reached your daily limit of {{limit}} tasks.';
  translations.en.noTasksAvailableForLevel = 'No tasks available for your current membership level. Please upgrade your membership or add funds.';
  translations.en.insufficientBalanceForLevel = 'Insufficient balance. You need at least ${{amount}} to grab tasks for {{level}} level.';
  translations.en.failedToMatchTask = 'Failed to match a task. Please try again.';

  translations.zh.matchingTask = '匹配任务中...';
  translations.zh.dailyLimitReachedButton = '已达每日上限';
  translations.zh.completeLuckyOrderFirst = '请先完成幸运订单';
  translations.zh.availableProducts = '可用商品';
  translations.zh.allLevels = '所有等级';
  translations.zh.yourMemberLevel = '您的会员等级';
  translations.zh.currentBalance = '当前余额';
  translations.zh.minimumBalanceRequired = '最低余额要求';
  translations.zh.commissionRate = '佣金率';
  translations.zh.tasksRemainingToday = '今日剩余任务';
  translations.zh.submitOrder = '提交订单';
  translations.zh.cancel = '取消';
  translations.zh.price = '价格';
  translations.zh.specialBonus = '特别奖励';
  translations.zh.luckyOrderTitle = '🎉 幸运订单！';
  translations.zh.luckyOrderDescription = '您获得了一个特别的幸运订单，含有额外佣金！';
  translations.zh.luckyOrderAvailable = '您有一个幸运订单可用！完成它以获取额外奖励。';
  translations.zh.mustCompleteLuckyOrder = '您必须完成幸运订单才能继续进行常规任务。';
  translations.zh.needToRechargeForLuckyOrder = '您需要至少充值${{amount}}美元才能完成这个幸运订单。';translations.zh.dailyLimitReached = '您已达到每日{{limit}}单的上限。';
  translations.zh.noTasksAvailableForLevel = '当前会员等级暂无可用任务，请升级会员等级或添加资金。';
  translations.zh.insufficientBalanceForLevel = '余额不足。您需要至少${{amount}}美元才能抢{{level}}等级的任务。';
  translations.zh.failedToMatchTask = '匹配任务失败，请重试。';

  // 添加提现方式相关翻译
  translations.en.withdrawalMethods = 'Withdrawal Methods';
  translations.zh.withdrawalMethods = '提现方式';

  // 语言上下文提供者组件
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // 从本地存储加载语言设置，如果没有则使用浏览器语言
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && ['en', 'zh'].includes(savedLang)) {
      return savedLang;
    }
    
    // 获取浏览器语言
    const browserLang = navigator.language.split('-')[0];
    return ['en', 'zh'].includes(browserLang) ? (browserLang as Language) : 'en';
  });
  
  // 当语言改变时，保存到本地存储
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);
  
  // 翻译函数
  const t = (key: string): string => {
  // 处理嵌套键，例如 'transactionTypes.deposit'
  const keys = key.split('.');
  let value: any = translations[language];
    
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // 如果找不到翻译，返回原始键
    }
  }
    
  return typeof value === 'string' ? value : key;
  };
  
  return createElement(
    LanguageContext.Provider,
    { value: { language, setLanguage, t } },
    children
  );
}