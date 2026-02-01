import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LanguageContext } from "@/contexts/languageContext";
import { toast } from "sonner";

// 定义幸运订单接口
interface LuckyOrder {
  id: string;
  userId: string;
  userName: string;
  triggerAfter: number; // 完成多少单后触发
  task: {
    id: string;
    title: string;
    price: number;
    commission: number;
    image: string;
    memberLevel: string;
  };
  isActive: boolean;
  createdAt: string;
}

// 定义用户接口
interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  memberLevel: string;
  createdAt: string;
  role?: string;
}

const AdminLuckyOrders = () => {
  const { t, language, setLanguage } = useContext(LanguageContext);
  const [luckyOrders, setLuckyOrders] = useState<LuckyOrder[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLuckyOrder, setNewLuckyOrder] = useState<Partial<LuckyOrder>>({
    triggerAfter: 5, // 默认5单后触发
    isActive: true
  });

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
  
  // 菜单项目
  const menuItems = [
    { label: t('dashboard'), path: '/admin/dashboard', icon: 'tachometer-alt' },
    { label: t('memberLevels'), path: '/admin/member-levels', icon: 'crown' },
    { label: t('supportSettings'), path: '/admin/support-settings', icon: 'headset' },
    { label: t('userManagement'), path: '/admin/users', icon: 'users' },
    { label: t('taskManagement'), path: '/admin/tasks', icon: 'clipboard-list' },
    { label: 'Lucky Orders', path: '/admin/lucky-orders', icon: 'gift' },
  ];
  
  // 加载数据
  useEffect(() => {
    // 加载幸运订单
    const savedLuckyOrders = localStorage.getItem('luckyOrders');
    if (savedLuckyOrders) {
      setLuckyOrders(JSON.parse(savedLuckyOrders));
    }
    
    // 加载用户
    loadUsers();
    
    // 加载任务
    loadTasks();
  }, []);
  
  // 加载用户
  const loadUsers = () => {
    const usersFromStorage: User[] = [];
    const keys = Object.keys(localStorage);
    
    for (const key of keys) {
      if (key.startsWith('user_')) {
        try {
          const userData = JSON.parse(localStorage.getItem(key) || '');
          if (userData && userData.role !== 'admin') {
            usersFromStorage.push(userData);
          }
        } catch (e) {
          console.error(`Error parsing user data from localStorage: ${key}`, e);
        }
      }
    }
    
    setUsers(usersFromStorage);
  };
  
  // 加载任务
  const loadTasks = () => {
    const savedTasks = localStorage.getItem('adminTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  };
  
  // 保存幸运订单
  const saveLuckyOrders = () => {
    localStorage.setItem('luckyOrders', JSON.stringify(luckyOrders));
  };
  
  // 处理添加新幸运订单
  const handleAddLuckyOrder = () => {
    if (!newLuckyOrder.userId || !newLuckyOrder.task || !newLuckyOrder.triggerAfter) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const user = users.find(u => u.id === newLuckyOrder.userId);
    if (!user) {
      toast.error('User not found');
      return;
    }
    
    const task = tasks.find(t => t.id === newLuckyOrder.task?.id);
    if (!task) {
      toast.error('Task not found');
      return;
    }
    
    const luckyOrder: LuckyOrder = {
      id: `lucky_${Date.now()}`,
      userId: newLuckyOrder.userId,
      userName: user.name,
      triggerAfter: newLuckyOrder.triggerAfter || 5,
      task: {
        ...task,
        price: task.price * 5, // 幸运订单价格设为普通任务的5倍
        commission: task.commission * 2 // 佣金设为普通任务的2倍
      },
      isActive: newLuckyOrder.isActive || true,
      createdAt: new Date().toISOString()
    };
    
    const updatedLuckyOrders = [...luckyOrders, luckyOrder];
    setLuckyOrders(updatedLuckyOrders);
    saveLuckyOrders();
    
    // 重置表单并关闭弹窗
    setNewLuckyOrder({
      triggerAfter: 5,
      isActive: true
    });
    setShowAddModal(false);
    
    toast.success('Lucky order created successfully');
  };
  
  // 处理更新幸运订单状态
  const handleToggleStatus = (id: string) => {
    const updatedLuckyOrders = luckyOrders.map(order => 
      order.id === id ? { ...order, isActive: !order.isActive } : order
    );
    
    setLuckyOrders(updatedLuckyOrders);
    saveLuckyOrders();
    
    toast.success('Lucky order status updated');
  };
  
  // 处理删除幸运订单
  const handleDeleteLuckyOrder = (id: string) => {
    if (window.confirm('Are you sure you want to delete this lucky order?')) {
      const updatedLuckyOrders = luckyOrders.filter(order => order.id !== id);
      setLuckyOrders(updatedLuckyOrders);
      saveLuckyOrders();
      
      toast.success('Lucky order deleted successfully');
    }
  };
  
  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'userId') {
      setNewLuckyOrder(prev => ({
        ...prev,
        [name]: value
      }));
    } else if (name === 'taskId') {
      const selectedTask = tasks.find(t => t.id === value);
      setNewLuckyOrder(prev => ({
        ...prev,
        task: selectedTask
      }));
    } else if (name === 'triggerAfter') {
      setNewLuckyOrder(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else if (name === 'isActive') {
      setNewLuckyOrder(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    }
  };
  
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
              <h2 className="text-lg font-bold mb-4">{t('menu')}</h2>
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      item.path === window.location.pathname 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <i className={`fa-solid fa-${item.icon} mr-3`}></i>
                    <span>{item.label}</span>
                  </a>
                ))}
                
                <div className="border-t border-gray-200 dark:border-gray-700 my-4 pt-4">
                  <a
                    href="/logout"
                    className="flex items-center px-4 py-3 rounded-lg text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <i className="fa-solid fa-sign-out-alt mr-3"></i>
                    <span>{t('logout')}</span>
                  </a>
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
             <div className="flex justify-between items-center mb-6">
               <motion.h2 variants={fadeIn} className="text-2xl font-bold">Lucky Orders Management</motion.h2>
               <motion.button
                 variants={fadeIn}
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={() => setShowAddModal(true)}
                 className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
               >
                 <i className="fa-plus mr-2"></i> Add New Lucky Order
               </motion.button>
             </div>
             
             <motion.div
               variants={fadeIn}
               className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
             >
               {luckyOrders.length > 0 ? (
                 <div className="overflow-x-auto">
                   <table className="w-full">
                     <thead>
                       <tr className="border-b border-gray-200 dark:border-gray-700">
                         <th className="text-left py-4 px-4 font-bold">User</th>
                         <th className="text-left py-4 px-4 font-bold">Trigger After</th>
                         <th className="text-left py-4 px-4 font-bold">Task</th>
                         <th className="text-left py-4 px-4 font-bold">Price</th>
                         <th className="text-left py-4 px-4 font-bold">Commission</th>
                         <th className="text-left py-4 px-4 font-bold">Status</th>
                         <th className="text-right py-4 px-4 font-bold">Actions</th>
                       </tr>
                     </thead>
                     <tbody>
                       {luckyOrders.map((order) => (
                         <tr key={order.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                           <td className="py-4 px-4">{order.userName}</td>
                           <td className="py-4 px-4">{order.triggerAfter} tasks</td>
                           <td className="py-4 px-4">
                             <div className="flex items-center">
                               <div className="w-10 h-10 rounded-lg overflow-hidden mr-3">
                                 <img 
                                   src={order.task.image} 
                                   alt={order.task.title}
                                   className="w-full h-full object-cover"
                                 />
                               </div>
                               <span>{order.task.title}</span>
                             </div>
                           </td>
                           <td className="py-4 px-4">${order.task.price}</td>
                           <td className="py-4 px-4">${order.task.commission}</td>
                           <td className="py-4 px-4">
                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                               order.isActive 
                                 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                 : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                             }`}>
                               {order.isActive ? 'Active' : 'Inactive'}
                             </span>
                           </td>
                           <td className="py-4 px-4 text-right">
                             <div className="flex justify-end space-x-2">
                               <button 
                                 onClick={() => handleToggleStatus(order.id)}
                                 className={`px-3 py-1 rounded-lg text-sm ${
                                   order.isActive 
                                     ? 'bg-gray-600 text-white hover:bg-gray-700' 
                                     : 'bg-green-600 text-white hover:bg-green-700'
                                 } transition-colors`}
                               >
                                 {order.isActive ? 'Deactivate' : 'Activate'}
                               </button>
                               <button 
                                 onClick={() => handleDeleteLuckyOrder(order.id)}
                                 className="px-3 py-1 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 transition-colors"
                               >
                                 Delete
                               </button>
                             </div>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               ) : (
                 <div className="text-center py-8">
                   <i className="fa-solid fa-gift text-4xl text-gray-400 mb-4"></i>
                   <h3 className="text-xl font-bold mb-2">No Lucky Orders Yet</h3>
                   <p className="text-gray-600 dark:text-gray-300">
                     Click the "Add New Lucky Order" button to create your first lucky order.
                   </p>
                 </div>
               )}
             </motion.div>
           </motion.div>
         </div>
       </div>
       
       {/* Add Lucky Order Modal */}
       {showAddModal && (
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
             <h3 className="text-xl font-bold mb-4">Add New Lucky Order</h3>
             
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   Select User
                 </label>
                 <select
                   name="userId"
                   value={newLuckyOrder.userId || ''}
                   onChange={handleInputChange}
                   required
                   className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                 >
                   <option value="">Select a user</option>
                   {users.map(user => (
                     <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                   ))}
                 </select>
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   Trigger After (number of tasks)
                 </label>
                 <input
                   type="number"
                   name="triggerAfter"
                   value={newLuckyOrder.triggerAfter || 5}
                   onChange={handleInputChange}
                   min="1"
                   className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   Select Base Task
                 </label>
                 <select
                   name="taskId"
                   value={newLuckyOrder.task?.id || ''}
                   onChange={handleInputChange}
                   required
                   className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                 >
                   <option value="">Select a task</option>
                   {tasks.map(task => (
                     <option key={task.id} value={task.id}>{task.title} (${task.price})</option>
                   ))}
                 </select>
                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                   Note: Price will be multiplied by 5 and commission by 2 for the lucky order
                 </p>
               </div>
               
               <div className="flex items-center">
                 <input
                   type="checkbox"
                   id="isActive"
                   name="isActive"
                   checked={newLuckyOrder.isActive || false}
                   onChange={handleInputChange}
                   className="form-checkbox h-5 w-5 text-blue-600 rounded"
                 />
                 <label htmlFor="isActive" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                   Activate Lucky Order
                 </label>
               </div>
               
               <div className="flex justify-end space-x-4 pt-4">
                 <button
                   onClick={() => setShowAddModal(false)}
                   className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                 >
                   Cancel
                 </button>
                 <button
                   onClick={handleAddLuckyOrder}className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                 >
                   Add Lucky Order
                 </button>
               </div>
             </div>
           </motion.div>
         </motion.div>
       )}
    </div>
  );
};

export default AdminLuckyOrders;