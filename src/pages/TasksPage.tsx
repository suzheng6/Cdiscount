import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "@/contexts/authContext";
import { UserContext } from "@/contexts/userContext";
import { TaskContext } from "@/contexts/taskContext";
import { LanguageContext } from "@/contexts/languageContext";
import { toast } from "sonner";

const TasksPage = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const { balance, setBalance, saveUserData } = useContext(UserContext);
  const { tasks, setTasks, orders, setOrders, saveOrdersData, loadAvailableTasks } = useContext(TaskContext);
  const { t } = useContext(LanguageContext);
  const [completedTasksToday, setCompletedTasksToday] = useState(0);
  const [availableTasks, setAvailableTasks] = useState<any[]>([]);
  const [matchingTasks, setMatchingTasks] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [hasPendingLuckyOrder, setHasPendingLuckyOrder] = useState(false);
  
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
  
  // 获取每日任务上限
  const getDailyTaskLimit = () => {
    // 所有会员等级每日任务上限统一为50单
    return 50;
  };
  
  // 获取用户会员等级的佣金率
  const getUserCommissionRate = () => {
    // 根据用户会员等级获取对应的佣金率
    const commissionRates: Record<string, number> = {
      'Silver': 0.5,
      'Gold': 0.6,
      'Platinum': 0.7,
      'Diamond': 0.8,
      'BlackDiamond': 0.9,
      'Crown': 1.0,
      'Supreme': 1.1
    };
    
    return commissionRates[user?.memberLevel || 'Silver'] || 0.5;
  };
  
  useEffect(() => {
    if (!user) return;
    
    // 从localStorage加载管理员设置的任务，如果没有则使用默认任务
    const adminTasks = localStorage.getItem('adminTasks');
    if (adminTasks) {
      setTasks(JSON.parse(adminTasks));
    } else {
      loadAvailableTasks();
    }
    
    // 计算今日已完成任务数
    const today = new Date().toDateString();
    const todayOrders = orders.filter(order => {
      const orderDate = new Date(order.date).toDateString();
      return orderDate === today && order.status === 'Completed';
    });
    setCompletedTasksToday(todayOrders.length);
    
    // 检查是否有待处理的幸运订单
    const pendingLuckyOrder = orders.find(order => 
      order.status === 'Pending' && order.isLuckyOrder
    );
    setHasPendingLuckyOrder(!!pendingLuckyOrder);
    
    // 筛选匹配用户会员等级的任务
    const filtered = tasks.filter(task => {
      // 检查余额是否满足最低要求
      const balanceRequirement = getBalanceRequirementForLevel(user?.memberLevel || 'Silver');
      return balance >= balanceRequirement && 
             (!task.memberLevel || task.memberLevel === user?.memberLevel);
    });
    setMatchingTasks(filtered);
    
    // 设置所有可用任务（用于预览）
    setAvailableTasks(tasks);
    
    // 检查是否需要显示幸运订单
    checkForLuckyOrder();
  }, [user, tasks, balance, orders, loadAvailableTasks]);
  
  // 检查是否需要显示幸运订单
  const checkForLuckyOrder = () => {
    if (!user) return;
    
    // 从localStorage获取幸运订单设置
    const luckyOrders = JSON.parse(localStorage.getItem('luckyOrders') || '[]');
    const userLuckyOrder = luckyOrders.find((order: any) => order.userId === user.id);
    
    if (userLuckyOrder) {
      // 获取用户的总完成任务数
      const totalCompletedTasks = orders.filter(order => order.status === 'Completed').length;
      
      // 检查是否达到了触发幸运订单的任务数
      if (totalCompletedTasks >= userLuckyOrder.triggerAfter && !hasPendingLuckyOrder) {
        // 检查用户是否已经完成过这个幸运订单
        const hasCompletedLuckyOrder = orders.some(order => 
          order.isLuckyOrder && order.luckyOrderId === userLuckyOrder.id && order.status === 'Completed'
        );
        
        if (!hasCompletedLuckyOrder) {
          // 显示幸运订单
          const luckyTask = {
            ...userLuckyOrder.task,
            isLuckyOrder: true,
            luckyOrderId: userLuckyOrder.id
          };
          
          setSelectedTask(luckyTask);
          setShowTaskModal(true);
          
          // 显示提示信息
          toast.info(t('luckyOrderAvailable'));
        }
      }
    }
  };
  
  // 获取会员等级对应的最低余额要求
  const getBalanceRequirementForLevel = (level: string) => {
    const requirements: Record<string, number> = {
      'Silver': 500,
      'Gold': 3000,
      'Platinum': 6000,
      'Diamond': 20000,
      'BlackDiamond': 50000,
      'Crown': 100000,
      'Supreme': 200000
    };
    
    return requirements[level] || 0;
  };
  
  const handleGrabRandomTask = () => {
    if (!user) return;
    
    // 检查是否有待处理的幸运订单
    if (hasPendingLuckyOrder) {
      toast.error(t('mustCompleteLuckyOrder'));
      return;
    }
    
    // 检查是否达到今日任务上限
    if (completedTasksToday >= getDailyTaskLimit()) {
      toast.error(t('dailyLimitReached').replace('{{limit}}', getDailyTaskLimit().toString()));
      return;
    }
    
    // 检查是否有匹配的任务
    if (matchingTasks.length === 0) {
      toast.error(t('noTasksAvailableForLevel'));
      return;
    }
    
    // 检查余额是否满足要求
    const balanceRequirement = getBalanceRequirementForLevel(user?.memberLevel || 'Silver');
    if (balance < balanceRequirement) {
      toast.error(t('insufficientBalanceForLevel')
        .replace('{{amount}}', balanceRequirement.toString())
        .replace('{{level}}', user?.memberLevel || 'Silver'));
      return;
    }
    
    setIsGrabbing(true);
    
    // 模拟匹配延迟
    setTimeout(() => {
      // 随机选择一个匹配的任务
      const randomIndex = Math.floor(Math.random() * matchingTasks.length);
      const task = matchingTasks[randomIndex];
      
      if (!task) {
        toast.error(t('failedToMatchTask'));
        setIsGrabbing(false);
        return;
      }
      
      // 显示任务详情弹窗
      setSelectedTask(task);
      setShowTaskModal(true);
      setIsGrabbing(false);
      
    }, 1500); // 1.5秒匹配时间
  };
  
  // 处理提交订单
  const handleSubmitOrder = () => {
    if (!user || !selectedTask) return;
    
    // 对于幸运订单，检查是否有足够的余额
    if (selectedTask.isLuckyOrder) {
      // 幸运订单余额要求通常会很高，确保用户必须充值
      const luckyOrderBalanceRequirement = selectedTask.price * 2; // 假设幸运订单需要两倍价格的余额
      if (balance < luckyOrderBalanceRequirement) {
        toast.error(t('needToRechargeForLuckyOrder')
          .replace('{{amount}}', luckyOrderBalanceRequirement.toString()));
        return;
      }
    }
    
    // 创建新订单
    const newOrder = {
      id: `o${Date.now()}`,
      taskId: selectedTask.id,
      taskTitle: selectedTask.title,
      price: selectedTask.price,
      commission: selectedTask.commission,
      status: 'Completed', // 直接标记为已完成，因为余额不会被扣除
      date: new Date().toLocaleString(),
      image: selectedTask.image,
      isLuckyOrder: selectedTask.isLuckyOrder || false,
      luckyOrderId: selectedTask.luckyOrderId || null
    };
    
    // 更新订单列表
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    
    // 保存订单数据
    saveOrdersData();
    
    // 更新余额（只添加佣金，不扣除任务金额）
    const newBalance = balance + selectedTask.commission;
    setBalance(newBalance);
    
    // 保存用户数据和订单数据
    saveUserData();
    localStorage.setItem(`orders_${user.id}`, JSON.stringify(updatedOrders));
    
    // 更新今日已完成任务数（如果不是幸运订单）
    if (!selectedTask.isLuckyOrder) {
      setCompletedTasksToday(prev => prev + 1);
    }
    
    // 显示成功消息
    const completedMessage = t('taskCompletedMessage').replace('${{amount}}', selectedTask.commission.toString());
    toast.success(completedMessage);
    
    // 关闭弹窗
    setShowTaskModal(false);
    setSelectedTask(null);
    
    // 更新最后更新时间
    setLastUpdated(new Date());
  };
  
  // 处理关闭弹窗
  const handleCloseModal = () => {
    // 如果是幸运订单，不允许关闭
    if (selectedTask?.isLuckyOrder) {
      toast.error(t('mustCompleteLuckyOrder'));
      return;
    }
    
    setShowTaskModal(false);
    setSelectedTask(null);
  };
  
  return (
    <div className="space-y-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
         <motion.h1 variants={fadeIn} className="text-3xl font-bold mb-2">{t('availableTasks')}</motion.h1>
         <motion.p variants={fadeIn} className="text-gray-600 dark:text-gray-300">
           {t('grabTasksDescription')}
         </motion.p>
      </motion.div>
      
      {/* Task Limit Indicator */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
             <div>
               <p className="text-sm text-gray-500 dark:text-gray-400">{t('dailyTasks')}</p>
               <p className="text-xl font-bold">{completedTasksToday} / {getDailyTaskLimit()}</p>
             </div>
          
          <div className="w-full md:w-1/2 my-4 md:my-0">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                style={{ width: `${(completedTasksToday / getDailyTaskLimit()) * 100}%` }}
              ></div>
            </div>
          </div>
          
           <div className="flex items-center space-x-2">
             <span className="text-sm text-gray-500 dark:text-gray-400">{t('lastUpdated')}</span>
             <span className="text-sm font-medium">{lastUpdated.toLocaleTimeString()}</span>
           </div>
        </div>
      </motion.div>
      
      {/* Grab Task Button */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="flex justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGrabRandomTask}
          disabled={isGrabbing || completedTasksToday >= getDailyTaskLimit() || hasPendingLuckyOrder}
          className={`px-8 py-4 rounded-lg text-lg font-bold shadow-lg transition-colors ${
            isGrabbing 
              ? 'bg-gray-400 text-white cursor-not-allowed' 
              : completedTasksToday >= getDailyTaskLimit()
                ? 'bg-red-500 text-white cursor-not-allowed'
                : hasPendingLuckyOrder
                  ? 'bg-yellow-500 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-red-500 text-white hover:from-blue-700 hover:to-red-600'
          }`}
        >
          {isGrabbing 
            ? t('matchingTask') 
            : completedTasksToday >= getDailyTaskLimit()
              ? t('dailyLimitReachedButton')
              : hasPendingLuckyOrder
                ? t('completeLuckyOrderFirst')
                : t('grabOrder')}
        </motion.button>
      </motion.div>
      
      {/* Available Products Preview */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-xl font-bold mb-4">{t('availableProducts')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {availableTasks.slice(0, 10).map((task) => (
            <motion.div
              key={task.id}
              whileHover={{ y: -5 }}
              className="rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700"
            >
              <div className="h-32 overflow-hidden">
                <img 
                  src={task.image} 
                  alt={task.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2">
                <p className="font-medium text-sm truncate">{task.title}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">${task.price}</span>
                  <span className="text-xs text-green-600 dark:text-green-400">${task.commission} {t('commission')}</span>
                </div>
                <div className="mt-1">
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded">
                    {task.memberLevel || t('allLevels')}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {availableTasks.length === 0 && (
          <div className="text-center py-8">
            <i className="fa-solid fa-box-open text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-xl font-bold mb-2">{t('noAvailableTasks')}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('checkBackLater')}
            </p>
          </div>
        )}
      </motion.div>
      
      {/* Member Level Info */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-xl font-bold mb-4">{t('yourMemberLevel')}: {user?.memberLevel || 'Silver'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('currentBalance')}</p>
            <p className="text-2xl font-bold">${balance.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('minimumBalanceRequired')}</p>
            <p className="text-2xl font-bold">
              ${getBalanceRequirementForLevel(user?.memberLevel || 'Silver').toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('commissionRate')}</p>
            <p className="text-2xl font-bold">{getUserCommissionRate()}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('tasksRemainingToday')}</p>
            <p className="text-2xl font-bold">{getDailyTaskLimit() - completedTasksToday}</p>
          </div>
        </div>
      </motion.div>
      
      {/* Task Confirmation Modal */}
      {showTaskModal && selectedTask && (
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
            {selectedTask.isLuckyOrder && (
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4 flex items-center">
                <i className="fa-solid fa-gift text-yellow-500 mr-3 text-xl"></i>
                <div>
                  <h3 className="font-bold text-yellow-800 dark:text-yellow-400">{t('luckyOrderTitle')}</h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">{t('luckyOrderDescription')}</p>
                </div>
              </div>
            )}
            
            <h3 className="text-xl font-bold mb-4">{selectedTask.title}</h3>
            
            <div className="relative h-48 rounded-lg overflow-hidden mb-6">
              <img 
                src={selectedTask.image} 
                alt={selectedTask.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">{t('price')}</span>
                <span className="font-bold">${selectedTask.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">{t('commission')}</span>
                <span className="font-bold text-green-600 dark:text-green-400">${selectedTask.commission}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">{t('memberLevel')}</span>
                <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm">
                  {selectedTask.memberLevel || t('allLevels')}
                </span>
              </div>
              
              {selectedTask.isLuckyOrder && (
                <div className="flex justify-between items-center text-yellow-700 dark:text-yellow-300">
                  <span>{t('specialBonus')}</span>
                  <span className="font-bold">+50%</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-4">
              {!selectedTask.isLuckyOrder && (
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {t('cancel')}
                </button>
              )}
              <button
                onClick={handleSubmitOrder}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedTask.isLuckyOrder 
                    ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {t('submitOrder')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default TasksPage;