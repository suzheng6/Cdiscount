import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "@/contexts/authContext";
import { LanguageContext } from "@/contexts/languageContext";
import { toast } from "sonner";

const AdminLoginPage = () => {
  const { setIsAuthenticated, setUser } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 简单的管理员验证（实际项目中应使用更安全的方法）
    if (formData.username === 'admin' && formData.password === 'admin123') {
      setTimeout(() => {
        // 模拟管理员用户数据
        const adminUser = {
          id: 'admin1',
          name: 'Administrator',
          email: 'admin@cdiscountusa.com',
          role: 'admin',
          balance: 0,
          memberLevel: 'Admin',
          createdAt: '2026-01-01'
        };
        
        setUser(adminUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(adminUser));
        
        toast.success('Admin login successful!');
        navigate('/admin/dashboard');
        setIsLoading(false);
      }, 1500);
    } else {
      setTimeout(() => {
        toast.error('Invalid admin credentials');
        setIsLoading(false);
      }, 1000);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900 p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        <div className="bg-gradient-to-r from-blue-800 to-purple-900 p-6 text-white text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-white/20 flex items-center justify-center text-3xl font-bold">
            A
          </div>
          <h2 className="text-2xl font-bold">Admin Login</h2>
          <p className="opacity-90">Control Panel Access</p>
        </div>
        
        {/* 登录提示 */}
        <div className="bg-blue-50 dark:bg-blue-900/30 p-3 text-blue-800 dark:text-blue-200 text-sm">
          <p className="flex items-center">
            <i className="fa-solid fa-info-circle mr-2"></i>
            <span>Use default credentials: Username: <strong>admin</strong>, Password: <strong>admin123</strong></span>
          </p>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your username"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your password"
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                isLoading 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-blue-800 text-white hover:bg-blue-900'
              }`}
            >
              {isLoading ? 'Signing in...' : 'Admin Sign In'}
            </motion.button>
          </form>
          
          <div className="mt-8 text-center">
            <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Back to User Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;