import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "@/contexts/authContext";
import { LanguageContext } from "@/contexts/languageContext";
import { toast } from "sonner";

// 生成邀请码的函数 - 格式为2位英文+2位数字+2位英文
const generateInvitationCode = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  
  // 生成前2位英文
  for (let i = 0; i < 2; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // 生成2位数字
  const randomDigits = Math.floor(10 + Math.random() * 90); // 10-99的随机数
  code += randomDigits;
  
  // 生成后2位英文
  for (let i = 0; i < 2; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  return code;
};

// 检查邀请码是否有效（格式验证）
const validateInvitationCode = (code: string): boolean => {
  const regex = /^[A-Z]{2}\d{2}[A-Z]{2}$/;
  return regex.test(code);
};

const RegisterPage = () => {
  const { setIsAuthenticated, setUser } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    invitationCode: ''
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
      [name]: value.toUpperCase() // 邀请码自动转为大写
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证密码
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    // 验证密码强度
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    // 验证邀请码格式
    if (!validateInvitationCode(formData.invitationCode)) {
      toast.error('Invalid invitation code format. Please use 2 letters + 2 digits + 2 letters (e.g., AB12CD)');
      return;
    }
    
    setIsLoading(true);
    
  // 模拟注册过程
  setTimeout(() => {
    // 生成用户唯一邀请码
    const userInvitationCode = generateInvitationCode();
    
    // 创建新用户数据
    const newUser = {
      id: `user_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      balance: 0,
      memberLevel: 'Silver',
      createdAt: new Date().toISOString().split('T')[0],
      invitationCode: userInvitationCode, // 存储用户的邀请码
      referredBy: formData.invitationCode // 存储推荐人邀请码
    };
    
    // 生成认证令牌
    const token = `token_${Date.now()}`;
    
    // 保存用户信息和令牌
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('token', token);
    
    // 提示用户他们的邀请码
    toast.success(`注册成功！您的邀请码是：${userInvitationCode}`);
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
           <h2 className="text-2xl font-bold">{t('createAccount')}</h2>
           <p className="opacity-90">{t('joinBetaTesting')}</p>
         </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
               <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                 {t('fullName')}
               </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your name"
              />
            </div>
            
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
               <label htmlFor="invitationCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                 Invitation Code
               </label>
              <input
                type="text"
                id="invitationCode"
                name="invitationCode"
                value={formData.invitationCode}
                onChange={handleInputChange}
                required
                maxLength={6}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter invitation code (e.g., AB12CD)"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Format: 2 letters + 2 digits + 2 letters (case-insensitive)
              </p>
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
                placeholder="Create a password"
              />
            </div>
            
            <div>
               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                 {t('confirmPassword')}
               </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Confirm your password"
              />
            </div>
            
             <div className="flex items-start">
               <input type="checkbox" id="terms" className="form-checkbox h-5 w-5 text-blue-600 rounded mt-1" required />
               <label htmlFor="terms" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                 {t('agreeToTerms')}
               </label>
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
               {isLoading ? t('signingUp') : t('signUp')}
             </motion.button>
          </form>
          
          <div className="mt-8 text-center">
               <p className="text-gray-600 dark:text-gray-300">
                 {t('alreadyHaveAnAccount')} <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">{t('signIn')}</Link>
               </p>
             </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;