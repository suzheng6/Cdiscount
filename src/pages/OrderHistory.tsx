import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "@/contexts/authContext";
import { TaskContext } from "@/contexts/taskContext";
import { LanguageContext } from "@/contexts/languageContext";
import OrderItem from "@/components/OrderItem";
import { Empty } from "@/components/Empty";

const OrderHistory = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const { orders, setOrders } = useContext(TaskContext);
  const { t } = useContext(LanguageContext);
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [filter, setFilter] = useState("all");
  
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
  
  useEffect(() => {
    if (!user) return;
    
    // 模拟从localStorage加载订单数据
    const savedOrders = localStorage.getItem(`orders_${user.id}`);
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      // 如果没有保存的订单，使用模拟数据
      const mockOrders = [
        {
          id: 'o1',
          taskId: 't1',
          taskTitle: 'Smartphone Purchase',
          price: 100,
          commission: 5,
          status: 'Completed',
          date: '2026-01-28 14:30',
          image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=Latest%20Smartphone%20with%20Modern%20Design&sign=cfd7510df98c6b7ca2f2cf27a4d73390'
        },
        {
          id: 'o2',
          taskId: 't2',
          taskTitle: 'Fashion Shopping',
          price: 50,
          commission: 2.5,
          status: 'Completed',
          date: '2026-01-27 10:15',
          image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=Trendy%20Fashion%20Clothing%20Display&sign=58cbe7d42c843b7c0e72a648660f77fe'
        },
        {
          id: 'o3',
          taskId: 't3',
          taskTitle: 'Home Appliance',
          price: 150,
          commission: 7.5,
          status: 'Completed',
          date: '2026-01-26 16:45',
          image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=Modern%20Home%20Appliances%20in%20Kitchen&sign=0dd40b7b71aec2eaf08c66e1c2388236'
        }
      ];
      setOrders(mockOrders);
      localStorage.setItem(`orders_${user.id}`, JSON.stringify(mockOrders));
    }
  }, [user, setOrders]);
  
  useEffect(() => {
    if (filter === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status.toLowerCase() === filter.toLowerCase()));
    }
  }, [orders, filter]);
  
  // 计算统计数据
  const totalOrders = orders.length;
  const totalAmount = orders.reduce((sum, order) => sum + order.price, 0);
  const totalCommission = orders.reduce((sum, order) => sum + order.commission, 0);
  
  return (
    <div className="space-y-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
           <motion.h1 variants={fadeIn} className="text-3xl font-bold mb-2">{t('orderHistory')}</motion.h1>
           <motion.p variants={fadeIn} className="text-gray-600 dark:text-gray-300">
             {t('trackYourCompletedTasks')}
           </motion.p>
      </motion.div>
      
      {/* Stats Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
           {[
             { value: totalOrders, label: t('totalTasksCompleted'), icon: 'clipboard-check', color: 'blue' },
             { value: `$${totalAmount}`, label: t('totalOrderAmount'), icon: 'dollar-sign', color: 'green' },
             { value: `$${totalCommission}`, label: t('totalCommissionEarned'), icon: 'money-bill-wave', color: 'purple' }
           ].map((stat, index) => (
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
      
      {/* Filter Controls */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="flex flex-wrap gap-3 mb-6"
      >
           {[t('all'), t('completed'), t('pending'), t('failed')].map((status, index) => {
             const statusKey = ['all', 'completed', 'pending', 'failed'][index];
             return (
               <button
                 key={statusKey}
                 onClick={() => setFilter(statusKey)}
                 className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                   filter === statusKey 
                     ? 'bg-blue-600 text-white' 
                     : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                 }`}
               >
                 {status}
               </button>
             );
           })}
      </motion.div>
      
      {/* Order List */}
      {filteredOrders.length > 0 ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {filteredOrders.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </motion.div>
      ) : (
        <div className="h-64 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <Empty />
        </div>
      )}
    </div>
  );
};

export default OrderHistory;