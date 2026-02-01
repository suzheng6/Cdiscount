import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "@/contexts/authContext";
import { UserContext } from "@/contexts/userContext";
import { LanguageContext } from "@/contexts/languageContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const { balance, setBalance, saveUserData } = useContext(UserContext);
  const { t, language } = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState("account");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [showWithdrawalMethodModal, setShowWithdrawalMethodModal] = useState(false);
  const [showTransactionPasswordModal, setShowTransactionPasswordModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [withdrawalMethodForm, setWithdrawalMethodForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    exchange: "",
    address: ""
  });
  const [transactionPasswordForm, setTransactionPasswordForm] = useState({
    password: "",
    confirmPassword: ""
  });
  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  
  const navigate = useNavigate();
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  // 模拟数据 - 最近交易记录
  const [recentTransactions, setRecentTransactions] = useState([
    { id: 't1', type: 'deposit', amount: 200, date: '2026-01-28 14:30' },
    { id: 't2', type: 'withdrawal', amount: 50, date: '2026-01-27 10:15' },
    { id: 't3', type: 'commission', amount: 15, date: '2026-01-26 16:45' },
    { id: 't4', type: 'deposit', amount: 100, date: '2026-01-25 09:20' },
  ]);
  
  // 模拟数据 - 提现记录
  const [withdrawalHistory, setWithdrawalHistory] = useState([
    { id: 'w1', amount: 50, status: 'Completed', date: '2026-01-27 10:15', method: 'PayPal' },
    { id: 'w2', amount: 100, status: 'Completed', date: '2026-01-20 15:30', method: 'Bank Transfer' },
    { id: 'w3', amount: 75, status: 'Pending', date: '2026-01-15 11:45', method: 'PayPal' },
  ]);
  
  // 模拟数据 - 充值记录
  const [depositHistory, setDepositHistory] = useState([
    { id: 'd1', amount: 200, status: 'Completed', date: '2026-01-28 14:30', method: 'Credit Card' },
    { id: 'd2', amount: 100, status: 'Completed', date: '2026-01-25 09:20', method: 'Credit Card' },
    { id: 'd3', amount: 150, status: 'Completed', date: '2026-01-20 16:00', method: 'PayPal' },
  ]);
  
  // 模拟数据 - 提现方式
  const [withdrawalMethods, setWithdrawalMethods] = useState([
    { id: 'wm1', exchange: 'Binance', address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', status: 'Active' },
    { id: 'wm2', exchange: 'Coinbase', address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', status: 'Active' },
  ]);
  
  // 虚拟货币交易所选项
  const cryptoExchanges = [
    'Binance',
    'Coinbase',
    'Kraken',
    'FTX',
    'Huobi Global',
    'KuCoin',
    'OKX',
    'Bybit',
    'Gate.io',
    'Bitfinex'
  ];
  
  const handleDeposit = () => {
    // 跳转到客服页面并显示提示
    navigate('/support');
    toast.info('请联系客服完成充值');
  };
  
  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid withdrawal amount');
      return;
    }
    
    if (amount > balance) {
      toast.error('Insufficient balance for withdrawal');
      return;
    }
    
    if (amount < 50) {
      toast.error('Minimum withdrawal amount is $50');
      return;
    }
    
    // 模拟提现，创建待处理的提现记录
    const newWithdrawal = {
      id: `w${Date.now()}`,
      amount: amount,
      status: 'Pending',
      date: new Date().toLocaleString(),
      method: paymentMethod === 'paypal' ? 'PayPal' : 
              paymentMethod === 'bank-transfer' ? 'Bank Transfer' : 'Venmo'
    };
    
    // 更新提现历史
    setWithdrawalHistory(prev => [newWithdrawal, ...prev]);
    
    // 更新最近交易记录
    const newTransaction = {
      id: `t${Date.now()}`,
      type: 'withdrawal',
      amount: amount,
      date: new Date().toLocaleString()
    };
    setRecentTransactions(prev => [newTransaction, ...prev]);
    
    // 扣除余额
    setBalance(prev => prev - amount);
    saveUserData();
    
    toast.success(`Withdrawal request for $${amount} submitted successfully`);
    setWithdrawAmount("");
  };
  
  const getTransactionTypeColor = (type: string) => {
    switch(type) {
      case 'deposit':
        return 'text-green-600 dark:text-green-400';
      case 'commission':
        return 'text-blue-600 dark:text-blue-400';
      case 'withdrawal':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-300';
    }
  };
  
  const getTransactionTypeIcon = (type: string) => {
    switch(type) {
      case 'deposit':
        return 'fa-plus-circle';
      case 'commission':
        return 'fa-gift';
      case 'withdrawal':
        return 'fa-minus-circle';
      default:
        return 'fa-exchange-alt';
    }
  };
  
  const getTransactionTypeText = (type: string) => {
    switch(type) {
      case 'deposit':
        return 'Deposit';
      case 'commission':
        return 'Commission';
      case 'withdrawal':
        return 'Withdrawal';
      default:
        return 'Transaction';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  return (
    <div className="space-y-8">
      {/* User Info Card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-gradient-to-r from-blue-600 to-red-500 rounded-xl p-6 shadow-xl text-white"
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold mr-4">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
               <h2 className="text-2xl font-bold">{user?.name || 'Guest User'}</h2>
               <p className="opacity-80">{user?.email}</p>
               <p className="opacity-80">UID: {user?.id || 'N/A'}</p>
               {user?.invitationCode && (
                 <p className="opacity-80">Invitation Code: {user.invitationCode}</p>
               )}
             </div>
          </div>
          
           <div className="text-center md:text-right">
               <p className="text-sm opacity-80">{t('accountBalance')}</p>
               <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
               <div className="flex justify-center md:justify-end mt-2 space-x-2">
                 <button onClick={() => setActiveTab("deposit")} className="px-4 py-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-sm">
                   {t('addFundsProfile')}
                 </button>
                 <button onClick={() => setActiveTab("withdraw")} className="px-4 py-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-sm">
                   {t('withdrawFundsProfile')}
                 </button>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Tabs Navigation */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="flex flex-wrap">
           {[
             { id: "account", label: t('accountInfo'), icon: "user" },
             { id: "deposit", label: t('depositFunds'), icon: "plus-circle" },
             { id: "withdraw", label: t('withdrawFunds'), icon: "minus-circle" },
             { id: "transactions", label: t('transactionHistory'), icon: "history" },
             { id: "settings", label: t('settings'), icon: "cog" }
           ].map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                 activeTab === tab.id 
                   ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                   : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
               }`}
             >
               <i className={`fa-solid fa-${tab.icon} mr-2`}></i>
               {tab.label}
             </button>
           ))}
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {/* Account Info Tab */}
          {activeTab === "account" && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-6"
            >
               <motion.h3 variants={fadeIn} className="text-xl font-bold mb-4">{t('accountInfo')}</motion.h3>
              
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('fullNameProfile')}</p>
                 <p className="font-medium">{user?.name || 'Not set'}</p>
               </div>
               
               <div>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('emailAddressProfile')}</p>
                 <p className="font-medium">{user?.email || 'Not set'}</p>
               </div>
               
               <div>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('memberLevel')}</p>
                 <p className="font-medium">{user?.memberLevel || 'Basic'}</p>
               </div>
               
               <div>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('accountCreated')}</p>
                 <p className="font-medium">{user?.createdAt || 'Not set'}</p>
               </div>
             </div>
              
               <div className="mt-8">
                 <h4 className="text-lg font-bold mb-4">{t('todaysEarnings')}</h4>
                 <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                   <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('totalCommissionEarnedToday')}</p>
                   <p className="text-2xl font-bold text-green-600 dark:text-green-400">$25.00</p>
                 </div>
               </div>
            </motion.div>
          )}
          
          {/* Deposit Funds Tab */}
          {activeTab === "deposit" && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="space-y-6"
            >
             <h3 className="text-xl font-bold mb-4">{t('depositFunds')}</h3>
             
             <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 mb-6">
               <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-2">{t('currentBalance')}</p>
               <p className="text-center text-3xl font-bold">${balance.toFixed(2)}</p>
             </div>
              
             <div className="space-y-4">
               <div>
                 <label htmlFor="depositAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   {t('depositAmount')}
                 </label>
                 <div className="relative">
                   <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                     $
                   </span>
                   <input
                     type="number"
                     id="depositAmount"
                     value={depositAmount}
                     onChange={(e) => setDepositAmount(e.target.value)}
                     min="10"
                     step="1"
                     className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                     placeholder={t('enterAmountMinimum10')}
                   />
                 </div>
               </div>
                
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   {t('paymentMethod')}
                 </label>
                  <div className="grid grid-cols-3 gap-4">
                    {['credit-card', 'paypal', 'bank-transfer'].map((method) => (
                       <div
                          key={method}
                          onClick={() => setPaymentMethod(method)}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors flex flex-col items-center ${
                            paymentMethod === method 
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400' 
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                          }`}
                        >
                          <i className={`fa-cc-${method === 'credit-card' ? 'visa' : method === 'paypal' ? 'paypal' : 'transfer' } text-2xl mb-2`}></i>
                          <span className="text-sm capitalize">
                            {method === 'credit-card' ? t('creditCard') : 
                             method === 'paypal' ? 'PayPal' : 
                             method === 'bank-transfer' ? t('bankTransfer') : 
                             method.replace('-', ' ')}
                          </span>
                        </div>
                    ))}
                  </div>
                </div>
                
                 <motion.button
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={handleDeposit}
                   className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                 >
                   {t('depositFundsButton')}
                 </motion.button>
                
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  By proceeding, you agree to our Terms of Service and Privacy Policy. All deposits are processed securely.
                </p>
              </div>
            </motion.div>
          )}
          
          {/* Withdraw Funds Tab */}
          {activeTab === "withdraw" && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="space-y-6"
            >
             <h3 className="text-xl font-bold mb-4">{t('withdrawFunds')}</h3>
             
             <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 mb-6">
               <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-2">{t('availableBalance')}</p>
               <p className="text-center text-3xl font-bold">${balance.toFixed(2)}</p>
               <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-1">{t('minimumWithdrawalAmount')}</p>
             </div>
             
             <div className="space-y-4">
               <div>
                 <label htmlFor="withdrawAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   {t('withdrawalAmount')}
                 </label>
                 <div className="relative">
                   <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                     $
                   </span>
                   <input
                     type="number"
                     id="withdrawAmount"
                     value={withdrawAmount}
                     onChange={(e) => setWithdrawAmount(e.target.value)}
                     min="50"
                     max={balance}
                     step="1"
                     className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                     placeholder={t('enterAmountMinimum50')}
                   />
                 </div>
               </div>
                
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   {t('withdrawalMethod')}
                 </label>
                  <div className="grid grid-cols-3 gap-4">
                    {['paypal', 'bank-transfer', 'venmo'].map((method) => (
                       <div
                          key={method}
                          onClick={() => setPaymentMethod(method)}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors flex flex-col items-center ${
                            paymentMethod === method 
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400' 
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                          }`}
                        >
                          <i className={`fa-${method === 'paypal' ? 'cc-paypal' : method === 'bank-transfer' ? 'university' : 'money-bill-wave' } text-2xl mb-2`}></i>
                          <span className="text-sm capitalize">
                            {method === 'paypal' ? 'PayPal' : 
                             method === 'bank-transfer' ? t('bankTransfer') : 
                             method === 'venmo' ? 'Venmo' : 
                             method.replace('-', ' ')}
                          </span>
                        </div>
                    ))}
                  </div>
                </div>
                
                 <motion.button
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={handleWithdraw}
                   className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                 >
                   {t('requestWithdrawalButton')}
                 </motion.button>
                
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  Withdrawal requests are processed within 1-3 business days. A $2.50 processing fee applies to all withdrawals.
                </p>
              </div>
            </motion.div>
          )}
          
          {/* Transaction History Tab */}
          {activeTab === "transactions" && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="space-y-6"
            >
             <h3 className="text-xl font-bold mb-4">{t('transactionHistory')}</h3>
             
             <div className="flex flex-wrap gap-3 mb-4">
               {[
                 {key: 'all', label: t('all')},
                 {key: 'deposits', label: t('deposits')},
                 {key: 'withdrawals', label: t('withdrawals')},
                 {key: 'commissions', label: t('commissions')}
               ].map((type) => (
                 <button
                   key={type.key}
                   className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                     type.key === 'all' 
                       ? 'bg-blue-600 text-white' 
                       : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                   }`}
                 >
                   {type.label}
                 </button>
               ))}
             </div>
              
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
                 <div className="flex items-center">
                   <i className={`fa-solid ${getTransactionTypeIcon(transaction.type)} ${getTransactionTypeColor(transaction.type)} mr-3`}></i>
                   <div>
                     <p className="font-medium">{t(`transactionTypes.${transaction.type}`)}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.date}</p>
                      </div>
                    </div>
                    <p className={`font-bold ${getTransactionTypeColor(transaction.type)}`}>
                      {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                 <h4 className="text-lg font-bold mb-4">{t('withdrawalHistory')}</h4>
                    <div className="space-y-3">
                      {withdrawalHistory.map((withdrawal) => (
                        <div key={withdrawal.id} className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
                          <div>
                            <p className="font-medium">${withdrawal.amount}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{withdrawal.date}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(withdrawal.status)}`}>
                              {withdrawal.status}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{withdrawal.method}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                 <h4 className="text-lg font-bold mb-4">{t('depositHistory')}</h4>
                    <div className="space-y-3">
                      {depositHistory.map((deposit) => (
                        <div key={deposit.id} className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
                          <div>
                            <p className="font-medium">${deposit.amount}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{deposit.date}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(deposit.status)}`}>
                              {deposit.status}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{deposit.method}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Settings Tab */}
          {activeTab === "settings" && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold mb-4">Settings</h3>
              
              <div className="space-y-6">
                 <div>
                 <h4 className="text-lg font-bold mb-4">{t('withdrawalMethods')}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {withdrawalMethods.map((method) => (
                      <div key={method.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium">{method.exchange}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{method.address}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-blue-600 dark:text-blue-400">
                              <i className="fa-edit"></i>
                            </button>
                            <button className="text-red-600 dark:text-red-400">
                              <i className="fa-trash-alt"></i>
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${method.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                            {method.status}
                          </span>
                          {method.id === 'wm1' && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">{language === 'en' ? 'Default Withdrawal Method' : '默认提现方式'}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    
                     <button 
                       onClick={() => setShowWithdrawalMethodModal(true)}
                       className="border border-dashed rounded-lg p-4 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                     >
                      <i className="fa-plus-circle text-xl mr-2"></i>
                      <span>{language === 'en' ? 'Add Withdrawal Method' : '添加提现方式'}</span>
                    </button>
                  </div>
                </div>
                
                <div>
                 <h4 className="text-lg font-bold mb-4">{t('securitySettings')}</h4>
                  <div className="space-y-4">
                   <div className="flex justify-between items-center p-4 border rounded-lg">
                     <div>
                       <p className="font-medium">{t('twoFactorAuthentication')}</p>
                       <p className="text-sm text-gray-500 dark:text-gray-400">{t('enhanceYourAccountSecurity')}</p>
                     </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                   <div className="flex justify-between items-center p-4 border rounded-lg">
                     <div>
                       <p className="font-medium">{t('transactionPassword')}</p>
                       <p className="text-sm text-gray-500 dark:text-gray-400">{t('setUpTransactionPassword')}</p>
                     </div>
                      <button 
                       onClick={() => setShowTransactionPasswordModal(true)}
                       className="px-4 py-1 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
                     >
                       {t('setPassword')}
                     </button>
                   </div>
                    
                   <div className="flex justify-between items-center p-4 border rounded-lg">
                     <div>
                       <p className="font-medium">{t('changeLoginPassword')}</p>
                       <p className="text-sm text-gray-500 dark:text-gray-400">{t('updateYourAccountPassword')}</p>
                     </div>
                      <button 
                       onClick={() => setShowChangePasswordModal(true)}
                       className="px-4 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                     >
                       {t('change')}
                     </button>
                   </div>
                  </div>
                </div>
                
                <div>
                 <h4 className="text-lg font-bold mb-4">{t('notifications')}</h4>
                  <div className="space-y-4">
                   {[
                     { label: t('taskAlerts'), desc: t('receiveTaskAlerts') },
                     { label: t('withdrawalUpdates'), desc: t('getWithdrawalUpdates') },
                     { label: t('accountActivity'), desc: t('monitorAccountActivity') },
                     { label: t('promotionalOffers'), desc: t('receiveSpecialOffers') }
                   ].map((notification, index) => (
                      <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{notification.label}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{notification.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
             </div>
            </motion.div>
          )}
        </div>
      </motion.div>
      
      {/* 添加提现方式弹窗 */}
      {showWithdrawalMethodModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg p-6"
          >
            <h3 className="text-xl font-bold mb-4">{language === 'en' ? 'Add Withdrawal Method' : '添加提现方式'}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'en' ? 'Full Name' : '真实姓名'}
                </label>
                <input
                  type="text"
                  value={withdrawalMethodForm.fullName}
                  onChange={(e) => setWithdrawalMethodForm(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={language === 'en' ? 'Enter your full name' : '请输入您的真实姓名'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'en' ? 'Email Address' : '邮箱'}
                </label>
                <input
                  type="email"
                  value={withdrawalMethodForm.email}
                  onChange={(e) => setWithdrawalMethodForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={language === 'en' ? 'Enter your email' : '请输入您的邮箱'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'en' ? 'Phone Number' : '电话'}
                </label>
                <input
                  type="tel"
                  value={withdrawalMethodForm.phone}
                  onChange={(e) => setWithdrawalMethodForm(prev => ({ ...prev, phone: e.target.value }))}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={language === 'en' ? 'Enter your phone number' : '请输入您的电话'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'en' ? 'Crypto Exchange' : '虚拟货币交易所'}
                </label>
                <select
                  value={withdrawalMethodForm.exchange}
                  onChange={(e) => setWithdrawalMethodForm(prev => ({ ...prev, exchange: e.target.value }))}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">{language === 'en' ? 'Select exchange' : '选择交易所'}</option>
                  {cryptoExchanges.map(exchange => (
                    <option key={exchange} value={exchange}>{exchange}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'en' ? 'Withdrawal Address' : '提现地址'}
                </label>
                <input
                  type="text"
                  value={withdrawalMethodForm.address}
                  onChange={(e) => setWithdrawalMethodForm(prev => ({ ...prev, address: e.target.value }))}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={language === 'en' ? 'Enter your withdrawal address' : '请输入您的提现地址'}
                />
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => {
                    setShowWithdrawalMethodModal(false);
                    setWithdrawalMethodForm({
                      fullName: "",
                      email: "",
                      phone: "",
                      exchange: "",
                      address: ""
                    });
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={() => {
                    // 验证表单
                    if (!withdrawalMethodForm.fullName || !withdrawalMethodForm.email || 
                        !withdrawalMethodForm.phone || !withdrawalMethodForm.exchange || 
                        !withdrawalMethodForm.address) {
                      toast.error(language === 'en' ? 'Please fill in all required fields' : '请填写所有必填字段');
                      return;
                    }
                    
                    // 添加新的提现方式
                    const newMethod = {
                      id: `wm${Date.now()}`,
                      exchange: withdrawalMethodForm.exchange,
                      address: withdrawalMethodForm.address,
                      status: 'Active'
                    };
                    
                    setWithdrawalMethods(prev => [newMethod, ...prev]);
                    setShowWithdrawalMethodModal(false);
                    setWithdrawalMethodForm({
                      fullName: "",
                      email: "",
                      phone: "",
                      exchange: "",
                      address: ""
                    });
                    
                    toast.success(language === 'en' ? 'Withdrawal method added successfully' : '提现方式添加成功');
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  {language === 'en' ? 'Add Method' : '添加方式'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* 设置交易密码弹窗 */}
      {showTransactionPasswordModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6"
          >
            <h3 className="text-xl font-bold mb-4">{language === 'en' ? 'Set Transaction Password' : '设置交易密码'}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('password')}
                </label>
                <input
                  type="password"
                  value={transactionPasswordForm.password}
                  onChange={(e) => setTransactionPasswordForm(prev => ({ ...prev, password: e.target.value }))}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={language === 'en' ? 'Set your transaction password' : '设置您的交易密码'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('confirmPassword')}
                </label>
                <input
                  type="password"
                  value={transactionPasswordForm.confirmPassword}
                  onChange={(e) => setTransactionPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={language === 'en' ? 'Confirm your transaction password' : '确认您的交易密码'}
                />
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => {
                    setShowTransactionPasswordModal(false);
                    setTransactionPasswordForm({
                      password: "",
                      confirmPassword: ""
                    });
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={() => {
                    // 验证密码
                    if (transactionPasswordForm.password.length < 6) {
                      toast.error(language === 'en' ? 'Password must be at least 6 characters' : '密码长度至少为6位');
                      return;
                    }
                    
                    if (transactionPasswordForm.password !== transactionPasswordForm.confirmPassword) {
                      toast.error(language === 'en' ? 'Passwords do not match' : '两次输入的密码不一致');
                      return;
                    }
                    
                    // 保存交易密码（实际应用中应该加密存储）
                    if (user) {
                      localStorage.setItem(`transaction_password_${user.id}`, transactionPasswordForm.password);
                    }
                    
                    setShowTransactionPasswordModal(false);
                    setTransactionPasswordForm({
                      password: "",
                      confirmPassword: ""
                    });
                    
                    toast.success(language === 'en' ? 'Transaction password set successfully' : '交易密码设置成功');
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  {language === 'en' ? 'Set Password' : '设置密码'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* 修改登录密码弹窗 */}
      {showChangePasswordModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6"
          >
            <h3 className="text-xl font-bold mb-4">{language === 'en' ? 'Change Login Password' : '修改登录密码'}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'en' ? 'Current Password' : '当前密码'}
                </label>
                <input
                  type="password"
                  value={changePasswordForm.currentPassword}
                  onChange={(e) => setChangePasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={language === 'en' ? 'Enter your current password' : '请输入您的当前密码'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'en' ? 'New Password' : '新密码'}
                </label>
                <input
                  type="password"
                  value={changePasswordForm.newPassword}
                  onChange={(e) => setChangePasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={language === 'en' ? 'Set your new password' : '设置您的新密码'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'en' ? 'Confirm New Password' : '确认新密码'}
                </label>
                <input
                  type="password"
                  value={changePasswordForm.confirmNewPassword}
                  onChange={(e) => setChangePasswordForm(prev => ({ ...prev, confirmNewPassword: e.target.value }))}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={language === 'en' ? 'Confirm your new password' : '确认您的新密码'}
                />
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => {
                    setShowChangePasswordModal(false);
                    setChangePasswordForm({
                      currentPassword: "",
                      newPassword: "",
                      confirmNewPassword: ""
                    });
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={() => {
                    // 验证当前密码
                    // 实际应用中应该与服务器验证，这里简化处理
                    if (changePasswordForm.currentPassword !== 'password123') {
                      toast.error(language === 'en' ? 'Current password is incorrect' : '当前密码不正确');
                      return;
                    }
                    
                    // 验证新密码
                    if (changePasswordForm.newPassword.length < 6) {
                      toast.error(language === 'en' ? 'New password must be at least 6 characters' : '新密码长度至少为6位');
                      return;
                    }
                    
                    if (changePasswordForm.newPassword !== changePasswordForm.confirmNewPassword) {
                      toast.error(language === 'en' ? 'New passwords do not match' : '两次输入的新密码不一致');
                      return;
                    }
                    
                    // 修改密码（实际应用中应该发送到服务器）
                    setShowChangePasswordModal(false);
                    setChangePasswordForm({
                      currentPassword: "",
                      newPassword: "",
                      confirmNewPassword: ""
                    });
                    
                    toast.success(language === 'en' ? 'Password changed successfully' : '密码修改成功');
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  {language === 'en' ? 'Change Password' : '修改密码'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfilePage;