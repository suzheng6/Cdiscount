import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LanguageContext } from "@/contexts/languageContext";
import { toast } from "sonner";

interface SupportSettings {
  email: string;
  phone: string;
  businessHours: string;
  telegramLink: string;
}

const AdminSupportSettings = () => {
  const { t, language, setLanguage } = useContext(LanguageContext);
  const [settings, setSettings] = useState<SupportSettings>({
    email: 'support@cdiscountusa.com',
    phone: '+1 (800) 123-4567',
    businessHours: 'Mon-Fri: 9AM-6PM EST',
    telegramLink: 'https://t.me/support_cdiscount'
  });
  const [isSaving, setIsSaving] = useState(false);
  
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
  ];
  
  // 加载客服设置
  useEffect(() => {
    const savedSettings = localStorage.getItem('supportSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = () => {
    setIsSaving(true);
    
    // 保存设置到localStorage
    localStorage.setItem('supportSettings', JSON.stringify(settings));
    
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Support settings updated successfully');
    }, 1000);
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
             <motion.h2 variants={fadeIn} className="text-2xl font-bold mb-6">{t('supportSettings')}</motion.h2>
             
             <motion.div
               variants={fadeIn}
               className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
             >
               <h3 className="text-xl font-bold mb-6">{t('contactInformation')}</h3>
               
               <div className="space-y-6">
                 <div>
                   <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                     {t('supportEmail')}
                   </label>
                   <input
                     type="email"
                     id="email"
                     name="email"
                     value={settings.email}
                     onChange={handleInputChange}
                     className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                     placeholder={t('enterSupportEmail')}
                   />
                 </div>
                
                 <div>
                   <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                     {t('supportPhone')}
                   </label>
                   <input
                     type="text"
                     id="phone"
                     name="phone"
                     value={settings.phone}
                     onChange={handleInputChange}
                     className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                     placeholder={t('enterSupportPhone')}
                   />
                 </div>
                
                 <div>
                   <label htmlFor="businessHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                     {t('businessHours')}
                   </label>
                   <input
                     type="text"
                     id="businessHours"
                     name="businessHours"
                     value={settings.businessHours}
                     onChange={handleInputChange}
                     className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                     placeholder={t('enterBusinessHours')}
                   />
                 </div>
                
                 <div>
                   <label htmlFor="telegramLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                     {t('telegramSupportLink')}
                   </label>
                   <input
                     type="url"
                     id="telegramLink"
                     name="telegramLink"
                     value={settings.telegramLink}
                     onChange={handleInputChange}
                     className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                     placeholder={t('enterTelegramLink')}
                   />
                   <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                     {t('telegramLinkDescription')}
                   </p>
                 </div>
                
                 <div className="pt-4">
                   <motion.button
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     onClick={handleSave}
                     disabled={isSaving}
                     className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                       isSaving 
                         ? 'bg-gray-400 text-white cursor-not-allowed' 
                         : 'bg-blue-600 text-white hover:bg-blue-700'
                     }`}
                   >
                     {isSaving ? t('saving') : t('saveChanges')}
                   </motion.button>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminSupportSettings;