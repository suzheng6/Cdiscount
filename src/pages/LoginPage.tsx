import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "@/contexts/authContext";
import { LanguageContext } from "@/contexts/languageContext";
import { toast } from "sonner";

const LoginPage = () => {
  const { setIsAuthenticated, setUser } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
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
    
  // 模拟登录过程
  setTimeout(() => {
    // 模拟用户数据
    const mockUser = {
      id: `user_${Date.now()}`,
      name: '示例用户',
      email: formData.email,
      balance: 100,
      memberLevel: 'Silver',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    // 模拟生成认证令牌
    const mockToken = `token_${Date.now()}`;
    
    // 保存用户信息和令牌到本地存储
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', mockToken);
    
    toast.success('登录成功！');
    navigate('/');
    setIsLoading(false);
  }, 1500);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        <div className="bg-gradient-to-r from-blue-600 to-red-500 p-6 text-white text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-white/20 flex items-center justify-center text-3xl font-bold">
            C
          </div>
           <h2 className="text-2xl font-bold">{t('welcomeBack')}</h2>
           <p className="opacity-90">{t('signInToYourAccount')}</p>
         </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
               <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                 {t('emailAddress')}
               </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
               <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                 {t('password')}
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
            
             <div className="flex items-center justify-between">
               <label className="flex items-center">
                 <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600 rounded" />
                 <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">{t('rememberMe')}</span>
               </label>
               <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">{t('forgotPassword')}</a>
             </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                isLoading 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
               {isLoading ? t('signingIn') : t('signIn')}
             </motion.button>
          </form>
          
          <div className="mt-8 text-center">
               <p className="text-gray-600 dark:text-gray-300">
                 {t('dontHaveAnAccount')} <Link to="/register" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">{t('signUp')}</Link>
               </p>
             </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;