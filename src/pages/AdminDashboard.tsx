import { useContext } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AuthContext } from "@/contexts/authContext";
import { LanguageContext } from "@/contexts/languageContext";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const { t, language, setLanguage } = useContext(LanguageContext);
  
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

  const menuItems = [
    { label: t('dashboard'), path: '/admin/dashboard', icon: 'tachometer-alt' },
    { label: t('memberLevels'), path: '/admin/member-levels', icon: 'crown' },
    { label: t('supportSettings'), path: '/admin/support-settings', icon: 'headset' },
    { label: t('userManagement'), path: '/admin/users', icon: 'users' },
    { label: t('taskManagement'), path: '/admin/tasks', icon: 'clipboard-list' },
    { label: 'Lucky Orders', path: '/admin/lucky-orders', icon: 'gift' },
  ];
  
  // 模拟统计数据
  const stats = [
    { value: '250+', label: t('activeUsers'), icon: 'user', color: 'blue' },
    { value: '1.5K', label: t('tasksCompleted'), icon: 'clipboard-check', color: 'green' },
    { value: '$12K', label: t('totalDeposits'), icon: 'dollar-sign', color: 'purple' },
    { value: '12', label: t('pendingWithdrawals'), icon: 'money-bill-wave', color: 'orange' },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-blue-800 flex items-center justify-center text-white font-bold text-xl mr-3">
              A
            </div>
            <h1 className="text-xl font-bold">Admin Control Panel</h1>
          </div>
          
           <div className="flex items-center space-x-4">
            {/* 语言切换按钮 */}
            <button 
              onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={`Switch to ${language === 'en' ? 'Chinese' : 'English'}`}
            >
              <span className="font-medium">{language === 'en' ? '中文' : 'EN'}</span>
            </button>
            
            <div className="hidden md:flex items-center">
              <span className="mr-2">{user?.name}</span>
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium">
                {user?.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="md:w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4"
          >
            <h2 className="text-lg font-bold mb-4">Menu</h2>
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    item.path === window.location.pathname 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <i className={`fa-solid fa-${item.icon} mr-3`}></i>
                  <span>{item.label}</span>
                </Link>
              ))}
              
              <div className="border-t border-gray-200 dark:border-gray-700 my-4 pt-4">
                <Link
                  to="/logout"
                  className="flex items-center px-4 py-3 rounded-lg text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors"
                >
                  <i className="fa-solid fa-sign-out-alt mr-3"></i>
                  <span>Logout</span>
                </Link>
              </div>
            </nav>
          </motion.div>
          
          {/* Main Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex-1"
          >
            <motion.h2 variants={fadeIn} className="text-2xl font-bold mb-6">Welcome back, {user?.name}</motion.h2>
            
            {/* Stats Cards */}
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  variants={fadeIn}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className={`w-12 h-12 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/50 flex items-center justify-center text-${stat.color}-600 dark:text-${stat.color}-400 mb-4`}>
                    <i className={`fa-solid fa-${stat.icon} text-xl`}></i>
                  </div>
                  <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Quick Actions */}
             <motion.div
               variants={fadeIn}
               className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8"
             >
               <h3 className="text-xl font-bold mb-4">{t('quickActions')}</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {[
                   { label: t('manageMemberLevels'), path: '/admin/member-levels', icon: 'crown', color: 'purple' },
                   { label: t('updateSupportInfo'), path: '/admin/support-settings', icon: 'headset', color: 'blue' },
                   { label: t('manageTasks'), path: '/admin/tasks', icon: 'clipboard-list', color: 'green' },
                 ].map((action, index) => (
                  <Link
                    key={index}
                    to={action.path}
                    className={`flex items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}
                  >
                    <div className={`w-10 h-10 rounded-full bg-${action.color}-100 dark:bg-${action.color}-900/50 flex items-center justify-center text-${action.color}-600 dark:text-${action.color}-400 mr-3`}>
                      <i className={`fa-solid fa-${action.icon}`}></i>
                    </div>
                    <span className="font-medium">{action.label}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
            
            {/* Recent Activity */}
             <motion.div
               variants={fadeIn}
               className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
             >
               <h3 className="text-xl font-bold mb-4">{t('recentActivity')}</h3>
              <div className="space-y-4">
                {[
                  { user: 'John Doe', action: 'completed a task', time: '2 minutes ago', task: 'Electronics Shopping' },
                  { user: 'Jane Smith', action: 'deposited funds', time: '15 minutes ago', amount: '$200' },
                  { user: 'Mike Johnson', action: 'withdrew funds', time: '1 hour ago', amount: '$50' },
                  { user: 'Sarah Williams', action: 'registered', time: '2 hours ago' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start p-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium mr-3">
                      {activity.user.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.user} {activity.action}</p>
                      {activity.task && <p className="text-sm text-gray-500 dark:text-gray-400">Task: {activity.task}</p>}
                      {activity.amount && <p className="text-sm text-gray-500 dark:text-gray-400">Amount: {activity.amount}</p>}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;