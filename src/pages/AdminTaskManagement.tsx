import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LanguageContext } from "@/contexts/languageContext";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  price: number;
  commission: number;
  image: string;
  memberLevel: string;
}

const AdminTaskManagement = () => {
  const { t, language, setLanguage } = useContext(LanguageContext);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Task>({
    id: '',
    title: '',
    price: 0,
    commission: 0,
    image: '',
    memberLevel: 'Silver'
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  
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
  
  // 会员等级选项
  const memberLevels = [
    'Silver', 
    'Gold', 
    'Platinum', 
    'Diamond', 
    'BlackDiamond', 
    'Crown', 
    'Supreme'
  ];
  
  // 获取会员等级对应的佣金率
  const getCommissionRateForLevel = (level: string): number => {
    const rates: Record<string, number> = {
      'Silver': 0.5,
      'Gold': 0.6,
      'Platinum': 0.7,
      'Diamond': 0.8,
      'BlackDiamond': 0.9,
      'Crown': 1.0,
      'Supreme': 1.1
    };
    
    return rates[level] || 0.5;
  };
  
  // 菜单项目
  const menuItems = [
    { label: t('dashboard'), path: '/admin/dashboard', icon: 'tachometer-alt' },
    { label: t('memberLevels'), path: '/admin/member-levels', icon: 'crown' },
    { label: t('supportSettings'), path: '/admin/support-settings', icon: 'headset' },
    { label: t('userManagement'), path: '/admin/users', icon: 'users' },
    { label: t('taskManagement'), path: '/admin/tasks', icon: 'clipboard-list' },
  ];
  
  // 加载任务数据
  useEffect(() => {
    const savedTasks = localStorage.getItem('adminTasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      // 确保所有任务都有memberLevel字段
      setTasks(parsedTasks.map((task: any) => ({
        ...task,
        memberLevel: task.memberLevel || 'Silver'
      })));
    } else {
      // 默认任务数据
      const defaultTasks: Task[] = [
        { 
          id: 't1', 
          title: 'Electronics Shopping', 
          price: 100, 
          commission: 0.5, // 根据会员等级自动计算
          image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=Latest%20Smartphone%20with%20Modern%20Design&sign=cfd7510df98c6b7ca2f2cf27a4d73390',
          memberLevel: 'Silver'
        },
        { 
          id: 't2', 
          title: 'Fashion Products', 
          price: 50, 
          commission: 0.3, // 根据会员等级自动计算
          image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=Trendy%20Fashion%20Clothing%20Display&sign=58cbe7d42c843b7c0e72a648660f77fe',
          memberLevel: 'Gold'
        },
        { 
          id: 't3', 
          title: 'Home Appliances', 
          price: 150, 
          commission: 1.05, // 根据会员等级自动计算
          image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=Modern%20Home%20Appliances%20in%20Kitchen&sign=0dd40b7b71aec2eaf08c66e1c2388236',
          memberLevel: 'Platinum'
        },
        { 
          id: 't4', 
          title: 'Books Collection', 
          price: 30, 
          commission: 0.24, // 根据会员等级自动计算
          image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=Collection%20of%20Best%20Selling%20Books&sign=aa6a15682fe5b5e89e9eb614df6cd33f',
          memberLevel: 'Diamond'
        }
      ];
      setTasks(defaultTasks);
      localStorage.setItem('adminTasks', JSON.stringify(defaultTasks));
    }
  }, []);
  
  // 处理价格或会员等级变化时自动计算佣金
  const handlePriceOrLevelChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price' || name === 'memberLevel') {
      const price = name === 'price' ? parseFloat(value) || 0 : newTask.price;
      const memberLevel = name === 'memberLevel' ? value : newTask.memberLevel;
      
      // 根据会员等级自动计算佣金
      const commissionRate = getCommissionRateForLevel(memberLevel);
      const calculatedCommission = price * (commissionRate / 100);
      
      setNewTask(prev => ({
        ...prev,
        [name]: name === 'price' ? price : value,
        commission: calculatedCommission
      }));
    } else {
      setNewTask(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // 处理编辑任务时的价格或会员等级变化
  const handleEditPriceOrLevelChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingTask) return;
    
    const { name, value } = e.target;
    
    if (name === 'price' || name === 'memberLevel') {
      const price = name === 'price' ? parseFloat(value) || 0 : editingTask.price;
      const memberLevel = name === 'memberLevel' ? value : editingTask.memberLevel;
      
      // 根据会员等级自动计算佣金
      const commissionRate = getCommissionRateForLevel(memberLevel);
      const calculatedCommission = price * (commissionRate / 100);
      
      setEditingTask(prev => ({
        ...prev,
        [name]: name === 'price' ? price : value,
        commission: calculatedCommission
      }));
    } else {
      setEditingTask(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // 处理图片上传预览
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 创建一个临时URL用于预览
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
          setNewTask(prev => ({
            ...prev,
            image: event.target.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // 处理编辑任务时的图片上传预览
  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingTask) return;
    
    const file = e.target.files?.[0];
    if (file) {
      // 创建一个临时URL用于预览
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditingTask(prev => ({
            ...prev,
            image: event.target.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAddTask = () => {
    const taskToAdd: Task = {
      ...newTask,
      id: `t${Date.now()}`
    };
    
    const updatedTasks = [...tasks, taskToAdd];
    setTasks(updatedTasks);
    localStorage.setItem('adminTasks', JSON.stringify(updatedTasks));
    
    // 重置表单并关闭模态框
    setNewTask({
      id: '',
      title: '',
      price: 0,
      commission: 0,
      image: '',
      memberLevel: 'Silver'
    });
    setImagePreview('');
    setShowAddModal(false);
    toast.success('Task added successfully');
  };
  
  const handleEditTask = (task: Task) => {
    setEditingTask({...task});
    setShowEditModal(true);
  };
  
  const handleUpdateTask = () => {
    if (!editingTask) return;
    
    const updatedTasks = tasks.map(task => 
      task.id === editingTask.id ? editingTask : task
    );
    
    setTasks(updatedTasks);
    localStorage.setItem('adminTasks', JSON.stringify(updatedTasks));
    setShowEditModal(false);
    setEditingTask(null);
    toast.success('Task updated successfully');
  };
  
  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      localStorage.setItem('adminTasks', JSON.stringify(updatedTasks));
      toast.success('Task deleted successfully');
    }
  };
  
  const calculateCommissionPercentage = (price: number, commission: number) => {
    return ((commission / price) * 100).toFixed(1);
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
            <h2 className="text-lg font-bold mb-4">Menu</h2>
            <nav className="space-y-1">
               {[
                { label: t('dashboard'), path: '/admin/dashboard', icon: 'tachometer-alt' },
                { label: t('memberLevels'), path: '/admin/member-levels', icon: 'crown' },
                { label: t('supportSettings'), path: '/admin/support-settings', icon: 'headset' },
                { label: t('userManagement'), path: '/admin/users', icon: 'users' },
                { label: t('taskManagement'), path: '/admin/tasks', icon: 'clipboard-list' },
              ].map((item) => (
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
                  <span>Logout</span>
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
              <motion.h2 variants={fadeIn} className="text-2xl font-bold">Product Management</motion.h2>
              <motion.button
                variants={fadeIn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
              >
                <i className="fa-plus mr-2"></i> Add New Product
              </motion.button>
            </div>
            
            <motion.div
              variants={fadeIn}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              {tasks.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-4 px-4 font-bold">Product</th>
                        <th className="text-right py-4 px-4 font-bold">Price</th>
                        <th className="text-right py-4 px-4 font-bold">Commission</th>
                        <th className="text-right py-4 px-4 font-bold">Member Level</th>
                        <th className="text-right py-4 px-4 font-bold">Return %</th>
                        <th className="text-right py-4 px-4 font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task) => (
                        <tr key={task.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-12 h-12 rounded-lg overflow-hidden mr-3">
                                <img 
                                  src={task.image} 
                                  alt={task.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="font-medium">{task.title}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">${task.price}</td>
                          <td className="py-4 px-4 text-right">${task.commission.toFixed(2)}</td>
                          <td className="py-4 px-4 text-right">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`}>
                              {task.memberLevel}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">{calculateCommissionPercentage(task.price, task.commission)}%</td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex justify-end space-x-2">
                              <button 
                                onClick={() => handleEditTask(task)}
                                className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteTask(task.id)}
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
                  <i className="fa-solid fa-box-open text-4xl text-gray-400 mb-4"></i>
                   <h3 className="text-xl font-bold mb-2">No Products Available</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Click the "Add New Product" button to create your first product.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Add Task Modal */}
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
             <h3 className="text-xl font-bold mb-4">Add New Product</h3>
             
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   Product Name
                 </label>
                <input
                  type="text"
                  name="title"
                  value={newTask.title}
                  onChange={handlePriceOrLevelChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter product name"
                />
              </div>
              
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   Price ($)
                 </label>
                <input
                  type="number"
                  name="price"
                  value={newTask.price}
                  onChange={handlePriceOrLevelChange}
                  min="1"
                  step="1"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter product price"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Member Level
                </label>
                <select
                  name="memberLevel"value={newTask.memberLevel}
                  onChange={handlePriceOrLevelChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {memberLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Calculated Commission ($)
                </label>
                <input
                  type="number"
                  name="commission"
                  value={newTask.commission.toFixed(2)}
                  readOnly
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Commission is automatically calculated based on member level ({getCommissionRateForLevel(newTask.memberLevel)}%)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="max-w-full h-auto rounded-lg max-h-40 mx-auto"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview('');
                            setNewTask(prev => ({ ...prev, image: '' }));
                          }}
                          className="absolute top-1 right-1 bg-white dark:bg-gray-800 rounded-full p-1 text-gray-500 hover:text-red-500"
                        >
                          <i className="fa-times"></i>
                        </button>
                      </div>
                    ) : (
                      <>
                        <i className="fa-solid fa-cloud-upload text-3xl text-gray-400 mb-2"></i>
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                          <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setImagePreview('');
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTask}
                  disabled={!newTask.image}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    !newTask.image
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Add Product
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Edit Task Modal */}
      {showEditModal && editingTask && (
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
             <h3 className="text-xl font-bold mb-4">Edit Product</h3>
             
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   Product Name
                 </label>
                <input
                  type="text"
                  name="title"
                  value={editingTask.title}
                  onChange={handleEditPriceOrLevelChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter product name"
                />
              </div>
              
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   Price ($)
                 </label>
                <input
                  type="number"
                  name="price"
                  value={editingTask.price}
                  onChange={handleEditPriceOrLevelChange}
                  min="1"
                  step="1"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter product price"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Member Level
                </label>
                <select
                  name="memberLevel"
                  value={editingTask.memberLevel}
                  onChange={handleEditPriceOrLevelChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {memberLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Calculated Commission ($)
                </label>
                <input
                  type="number"
                  name="commission"
                  value={editingTask.commission.toFixed(2)}
                  readOnly
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Commission is automatically calculated based on member level ({getCommissionRateForLevel(editingTask.memberLevel)}%)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    {editingTask.image ? (
                      <div className="relative">
                        <img 
                          src={editingTask.image} 
                          alt="Preview" 
                          className="max-w-full h-auto rounded-lg max-h-40 mx-auto"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTask(prev => prev ? { ...prev, image: '' } : null);
                          }}
                          className="absolute top-1 right-1 bg-white dark:bg-gray-800 rounded-full p-1 text-gray-500 hover:text-red-500"
                        >
                          <i className="fa-times"></i>
                        </button>
                      </div>
                    ) : (
                      <>
                        <i className="fa-solid fa-cloud-upload text-3xl text-gray-400 mb-2"></i>
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                          <label htmlFor="edit-file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                            <span>Upload a file</span>
                            <input id="edit-file-upload" name="edit-file-upload" type="file" className="sr-only" accept="image/*" onChange={handleEditImageUpload} />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingTask(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateTask}
                  disabled={!editingTask.image}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    !editingTask.image
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminTaskManagement;