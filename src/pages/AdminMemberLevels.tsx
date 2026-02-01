import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LanguageContext } from "@/contexts/languageContext";
import { toast } from "sonner";

interface MemberLevel {
  id: string;
  level: string;
  title: string;
  commissionRate: number;
  dailyTaskLimit: number;
  balanceRequirement: number;
  gradientFrom: string;
  gradientTo: string;
  icon: string;
  benefits: string[];
}

const AdminMemberLevels = () => {
  const { t, language, setLanguage } = useContext(LanguageContext);
  const [memberLevels, setMemberLevels] = useState<MemberLevel[]>([]);
  const [editingLevel, setEditingLevel] = useState<MemberLevel | null>(null);
  const [showModal, setShowModal] = useState(false);
  
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
  
  // 加载会员等级数据
  useEffect(() => {
    const savedLevels = localStorage.getItem('memberLevels');
    if (savedLevels) {
      setMemberLevels(JSON.parse(savedLevels));
    } else {
      // 默认会员等级数据
      const defaultLevels: MemberLevel[] = [
        {
          id: 'silver',
          level: 'Silver',
          title: 'Silver Package',
          commissionRate: 0.5,
          dailyTaskLimit: 50,
          balanceRequirement: 500,
          gradientFrom: 'from-gray-400',
          gradientTo: 'to-gray-600',
          icon: 'medal',
          benefits: [
            'Commission Rate: 0.5%',
            'Daily Task Limit: 50 tasks',
            'Account Balance Required: ≥$500',
            'Access to basic tasks',
            'Email support'
          ]
        },
        {
          id: 'gold',
          level: 'Gold',
          title: 'Gold Package',
          commissionRate: 0.6,
          dailyTaskLimit: 50,
          balanceRequirement: 3000,
          gradientFrom: 'from-yellow-500',
          gradientTo: 'to-yellow-700',
          icon: 'award',
          benefits: [
            'Commission Rate: 0.6%',
            'Daily Task Limit: 50 tasks',
            'Account Balance Required: ≥$3,000',
            'Access to intermediate tasks',
            'Priority email support',
            'Exclusive task alerts'
          ]
        },
        {
          id: 'platinum',
          level: 'Platinum',
          title: 'Platinum Package',
          commissionRate: 0.7,
          dailyTaskLimit: 50,
          balanceRequirement: 6000,
          gradientFrom: 'from-blue-300',
          gradientTo: 'to-blue-500',
          icon: 'trophy',
          benefits: [
            'Commission Rate: 0.7%',
            'Daily Task Limit: 50 tasks',
            'Account Balance Required: ≥$6,000',
            'Access to premium tasks',
            'Priority email support',
            'Exclusive task alerts',
            'Higher value tasks'
          ]
        },
        {
          id: 'diamond',
          level: 'Diamond',
          title: 'Diamond Package',
          commissionRate: 0.8,
          dailyTaskLimit: 50,
          balanceRequirement: 20000,
          gradientFrom: 'from-indigo-500',
          gradientTo: 'to-indigo-700',
          icon: 'gem',
          benefits: [
            'Commission Rate: 0.8%',
            'Daily Task Limit: 50 tasks',
            'Account Balance Required: ≥$20,000',
            'Access to all tasks',
            '24/7 priority support',
            'Exclusive task alerts',
            'Higher value tasks'
          ]
        },
        {
          id: 'black-diamond',
          level: 'Black Diamond',
          title: 'Black Diamond Package',
          commissionRate: 0.9,
          dailyTaskLimit: 50,
          balanceRequirement: 50000,
          gradientFrom: 'from-gray-800',
          gradientTo: 'to-black',
          icon: 'gem',
          benefits: [
            'Commission Rate: 0.9%',
            'Daily Task Limit: 50 tasks',
            'Account Balance Required: ≥$50,000',
            'Access to all tasks',
            '24/7 priority support',
            'Exclusive task alerts',
            'Higher value tasks',
            'Dedicated account manager'
          ]
        },
        {
          id: 'crown',
          level: 'Crown',
          title: 'Crown Package',
          commissionRate: 1.0,
          dailyTaskLimit: 50,
          balanceRequirement: 100000,
          gradientFrom: 'from-yellow-400',
          gradientTo: 'to-amber-600',
          icon: 'crown',
          benefits: [
            'Commission Rate: 1.0%',
            'Daily Task Limit: 50 tasks',
            'Account Balance Required: ≥$100,000',
            'Access to all tasks',
            '24/7 priority support',
            'Exclusive task alerts',
            'Highest value tasks',
            'Dedicated account manager'
          ]
        },
        {
          id: 'supreme',
          level: 'Supreme',
          title: 'Supreme Package',
          commissionRate: 1.1,
          dailyTaskLimit: 50,
          balanceRequirement: 200000,
          gradientFrom: 'from-purple-600',
          gradientTo: 'to-pink-500',
          icon: 'star',
          benefits: [
            'Commission Rate: 1.1%',
            'Daily Task Limit: 50 tasks',
            'Account Balance Required: ≥$200,000',
            'Access to all tasks',
            '24/7 dedicated support',
            'Exclusive task alerts',
            'Highest value tasks',
            'Dedicated account manager',
            'Priority for new feature testing'
          ]
        }
      ];
      setMemberLevels(defaultLevels);
      localStorage.setItem('memberLevels', JSON.stringify(defaultLevels));
    }
  }, []);
  
  const handleEdit = (level: MemberLevel) => {
    setEditingLevel({...level});
    setShowModal(true);
  };
  
  const handleSave = () => {
    if (!editingLevel) return;
    
    const updatedLevels = memberLevels.map(level => 
      level.id === editingLevel.id ? editingLevel : level
    );
    
    setMemberLevels(updatedLevels);
    localStorage.setItem('memberLevels', JSON.stringify(updatedLevels));
    setShowModal(false);
    setEditingLevel(null);
    toast.success('Member level updated successfully');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingLevel) return;
    
    const { name, value } = e.target;
    
    // 处理数值类型的字段
    if (name === 'commissionRate' || name === 'dailyTaskLimit' || name === 'balanceRequirement') {
      setEditingLevel(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setEditingLevel(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
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
            <motion.h2 variants={fadeIn} className="text-2xl font-bold mb-6">Manage Member Levels</motion.h2>
            
             <motion.div
                variants={fadeIn}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-4 px-4 font-bold">{t('level')}</th>
                        <th className="text-left py-4 px-4 font-bold">{t('title')}</th>
                        <th className="text-right py-4 px-4 font-bold">{t('commissionRate')}</th>
                        <th className="text-right py-4 px-4 font-bold">{t('dailyTaskLimit')}</th>
                        <th className="text-right py-4 px-4 font-bold">{t('balanceRequirement')}</th>
                        <th className="text-right py-4 px-4 font-bold">{t('actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {memberLevels.map((level) => (
                        <tr key={level.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="py-4 px-4 font-medium">{level.level}</td>
                          <td className="py-4 px-4">{level.title}</td>
                          <td className="py-4 px-4 text-right">{level.commissionRate}%</td>
                          <td className="py-4 px-4 text-right">{level.dailyTaskLimit}</td>
                          <td className="py-4 px-4 text-right">{formatBalance(level.balanceRequirement)}</td>
                          <td className="py-4 px-4 text-right">
                            <button 
                              onClick={() => handleEdit(level)}
                              className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
                            >
                              {t('edit')}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
       {/* Edit Modal */}
      {showModal && editingLevel && (
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
            <h3 className="text-xl font-bold mb-4">{t('editMemberLevel')}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('levelName')}
                </label>
                <input
                  type="text"
                  name="level"
                  value={editingLevel.level}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('packageTitle')}
                </label>
                <input
                  type="text"
                  name="title"
                  value={editingLevel.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('commissionRate')} (%)
                </label>
                <input
                  type="number"
                  name="commissionRate"
                  value={editingLevel.commissionRate}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('dailyTaskLimit')}
                </label>
                <input
                  type="number"
                  name="dailyTaskLimit"
                  value={editingLevel.dailyTaskLimit}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('balanceRequirement')} ($)
                </label>
                <input
                  type="number"
                  name="balanceRequirement"
                  value={editingLevel.balanceRequirement}
                  onChange={handleInputChange}
                  min="0"
                  step="100"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingLevel(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleSave}
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

export default AdminMemberLevels;