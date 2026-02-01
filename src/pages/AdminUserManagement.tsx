import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LanguageContext } from "@/contexts/languageContext";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  memberLevel: string;
  createdAt: string;
  role?: string;
}

const AdminUserManagement = () => {
  const { t, language, setLanguage } = useContext(LanguageContext);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
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
  
  // 加载用户数据
  useEffect(() => {
    // 从localStorage获取所有用户
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
    
    // 如果没有用户数据，创建一些模拟用户
    if (usersFromStorage.length === 0) {
      const mockUsers: User[] = [
        {
          id: 'user1',
          name: 'John Doe',
          email: 'john@example.com',
          balance: 500,
          memberLevel: 'Silver',
          createdAt: '2026-01-01'
        },
        {
          id: 'user2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          balance: 3500,
          memberLevel: 'Gold',
          createdAt: '2026-01-02'
        },
        {
          id: 'user3',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          balance: 7000,
          memberLevel: 'Platinum',
          createdAt: '2026-01-03'
        },
        {
          id: 'user4',
          name: 'Sarah Williams',
          email: 'sarah@example.com',
          balance: 25000,
          memberLevel: 'Diamond',
          createdAt: '2026-01-04'
        }
      ];
      
      // 保存模拟用户到localStorage
      mockUsers.forEach(user => {
        localStorage.setItem(`user_${user.id}`, JSON.stringify(user));
      });
      
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
    } else {
      setUsers(usersFromStorage);
      setFilteredUsers(usersFromStorage);
    }
  }, []);
  
  // 搜索用户
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term) || 
        user.id.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);
  
  const handleEditUser = (user: User) => {
    setEditingUser({...user});
    setShowEditModal(true);
  };
  
  const handleUpdateUser = () => {
    if (!editingUser) return;
    
    // 更新localStorage中的用户数据
    localStorage.setItem(`user_${editingUser.id}`, JSON.stringify(editingUser));
    
    // 更新用户列表
    const updatedUsers = users.map(user => 
      user.id === editingUser.id ? editingUser : user
    );
    
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setShowEditModal(false);
    setEditingUser(null);
    toast.success('User updated successfully');
  };
  
  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // 从localStorage删除用户
      localStorage.removeItem(`user_${userId}`);
      
      // 从用户列表移除
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      toast.success('User deleted successfully');
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // 处理数值类型的字段
    if (name === 'balance') {
      setEditingUser(prev => prev ? {
        ...prev,
        [name]: parseFloat(value) || 0
      } : null);
    } else {
      setEditingUser(prev => prev ? {
        ...prev,
        [name]: value
      } : null);
    }
  };
  
  const memberLevels = [t('silver'), t('gold'), t('platinum'), t('diamond'), t('blackDiamond'), t('crown'), t('supreme')];
  
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
             <motion.h2 variants={fadeIn} className="text-2xl font-bold mb-6">{t('userManagement')}</motion.h2>
             
             <motion.div
               variants={fadeIn}
               className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6"
             >
               <div className="relative">
                 <input
                   type="text"
                   placeholder={t('searchUsers')}
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pl-10"
                 />
                 <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
               </div>
             </motion.div>
            
             <motion.div
               variants={fadeIn}
               className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
             >
               {filteredUsers.length > 0 ? (
                 <div className="overflow-x-auto">
                   <table className="w-full">
                     <thead>
                       <tr className="border-b border-gray-200 dark:border-gray-700">
                         <th className="text-left py-4 px-4 font-bold">{t('user')}</th>
                         <th className="text-left py-4 px-4 font-bold">{t('email')}</th>
                         <th className="text-right py-4 px-4 font-bold">{t('balance')}</th>
                         <th className="text-right py-4 px-4 font-bold">{t('memberLevel')}</th>
                         <th className="text-right py-4 px-4 font-bold">{t('joined')}</th>
                         <th className="text-right py-4 px-4 font-bold">{t('actions')}</th>
                       </tr>
                     </thead>
                     <tbody>
                       {filteredUsers.map((user) => (
                         <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                           <td className="py-4 px-4">
                             <div className="flex items-center">
                               <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium mr-3">
                                 {user.name.charAt(0).toUpperCase()}
                               </div>
                               <div>
                                 <p className="font-medium">{user.name}</p>
                                 <p className="text-sm text-gray-500 dark:text-gray-400">ID: {user.id}</p>
                               </div>
                             </div>
                           </td>
                           <td className="py-4 px-4">{user.email}</td>
                           <td className="py-4 px-4 text-right">${user.balance.toFixed(2)}</td>
                           <td className="py-4 px-4 text-right">{user.memberLevel}</td>
                           <td className="py-4 px-4 text-right">{user.createdAt}</td>
                           <td className="py-4 px-4 text-right">
                             <div className="flex justify-end space-x-2">
                               <button 
                                 onClick={() => handleEditUser(user)}
                                 className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
                               >
                                 {t('edit')}
                               </button>
                               <button 
                                 onClick={() => handleDeleteUser(user.id)}
                                 className="px-3 py-1 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 transition-colors"
                               >
                                 {t('delete')}
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
                   <i className="fa-solid fa-user-slash text-4xl text-gray-400 mb-4"></i>
                   <h3 className="text-xl font-bold mb-2">{t('noUsersFound')}</h3>
                   <p className="text-gray-600 dark:text-gray-300">
                     {searchTerm ? t('noUsersMatchCriteria') : t('noRegisteredUsers')}
                   </p>
                 </div>
               )}
            </motion.div>
          </motion.div>
        </div>
      </div>
      
       {/* Edit User Modal */}
      {showEditModal && editingUser && (
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
            <h3 className="text-xl font-bold mb-4">{t('editUser')}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('name')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={editingUser.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={t('enterUserName')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={editingUser.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={t('enterUserEmail')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('balance')} ($)
                </label>
                <input
                  type="number"
                  name="balance"
                  value={editingUser.balance}
                  onChange={handleInputChange}
                  min="0"
                  step="1"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={t('enterUserBalance')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('memberLevel')}
                </label>
                <select
                  name="memberLevel"
                  value={editingUser.memberLevel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {memberLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleUpdateUser}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  {t('saveChanges')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminUserManagement;