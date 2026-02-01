import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LanguageContext } from "@/contexts/languageContext";
import { useContext } from "react";
import { toast } from "sonner";

const SupportPage = () => {
  const { t, language } = useContext(LanguageContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<string | null>(null);
  const [supportSettings, setSupportSettings] = useState({
    email: 'support@cdiscountusa.com',
    phone: '+1 (800) 123-4567',
    businessHours: 'Mon-Fri: 9AM-6PM EST',
    telegramLink: 'https://t.me/support_cdiscount'
  });
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  // 加载客服设置
  useEffect(() => {
    const savedSettings = localStorage.getItem('supportSettings');
    if (savedSettings) {
      setSupportSettings(JSON.parse(savedSettings));
    }
  }, []);
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
   const faqs = [
    {
      id: 'faq1',
      question: language === 'en' ? 'How do I get started with Cdiscount USA?' : '如何开始使用Cdiscount美国版？',
      answer: t('howToGetStarted')
    },
    {
      id: 'faq2',
      question: language === 'en' ? 'How do I withdraw my earnings?' : '如何提取我的收益？',
      answer: t('howToWithdraw')
    },
    {
      id: 'faq3',
      question: language === 'en' ? 'What is the minimum withdrawal amount?' : '最低提现金额是多少？',
      answer: t('minimumWithdrawal')
    },
    {
      id: 'faq4',
      question: language === 'en' ? 'How long does it take to process a withdrawal?' : '处理提现需要多长时间？',
      answer: t('withdrawalProcessingTime')
    },
    {
      id: 'faq5',
      question: language === 'en' ? 'Can I upgrade my membership level?' : '我可以升级我的会员等级吗？',
      answer: t('upgradeMembership')
    }
  ];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 模拟表单提交
    setTimeout(() => {
      setIsSubmitting(false);
               toast.success(t('messageSentSuccessfully'));
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };
  
  const toggleFAQ = (id: string) => {
    setSelectedFAQ(selectedFAQ === id ? null : id);
  };
  
  return (
    <div className="space-y-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
           <motion.h1 variants={fadeIn} className="text-3xl font-bold mb-2">{t('customerSupport')}</motion.h1>
           <motion.p variants={fadeIn} className="text-gray-600 dark:text-gray-300">
             {t('weAreHereToHelp')}
           </motion.p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-6"
        >
          {/* Contact Info */}
          <motion.div
            variants={fadeIn}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
             <h2 className="text-xl font-bold mb-4">{t('contactInformation')}</h2>
             <ul className="space-y-4">
               {[
                 { label: t('emailSupport'), value: supportSettings.email, icon: 'envelope', type: 'email' },
                 { label: t('liveChat'), value: t('available247'), icon: 'comment-dots', type: 'chat' },
                 { label: t('phoneSupport'), value: supportSettings.phone, icon: 'phone', type: 'phone' },
                 { label: t('businessHours'), value: supportSettings.businessHours, icon: 'clock', type: 'hours' }
               ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <i className={`fa-solid fa-${item.icon} text-blue-500 mt-1 mr-3`}></i>
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-gray-600 dark:text-gray-300">{item.value}</p>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <a 
                  href={supportSettings.telegramLink} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <i className="fa-solid fa-headset mr-2"></i>
                  {t('chatWithSupport')}
                </a>
            </div>
          </motion.div>
          
          {/* FAQ Section */}
          <motion.div
            variants={fadeIn}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
             <h2 className="text-xl font-bold mb-4">{t('frequentlyAskedQuestions')}</h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div key={faq.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="flex justify-between items-center w-full py-3 text-left font-medium"
                  >
                    <span>{faq.question}</span>
                    <i className={`fa-solid fa-chevron-down transition-transform duration-300 ${
                      selectedFAQ === faq.id ? 'transform rotate-180' : ''
                    }`}></i>
                  </button>
                  {selectedFAQ === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="pb-3"
                    >
                      <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
        
        {/* Contact Form */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
           <h2 className="text-2xl font-bold mb-6">{t('sendUsAMessage')}</h2>
           <form onSubmit={handleSubmit} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   {t('yourName')}
                 </label>
                 <input
                   type="text"
                   id="name"
                   name="name"
                   value={formData.name}
                   onChange={handleInputChange}
                   required
                   className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                   placeholder={t('enterYourName')}
                 />
               </div>
               
               <div>
                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   {t('yourEmail')}
                 </label>
                 <input
                   type="email"
                   id="email"
                   name="email"
                   value={formData.email}
                   onChange={handleInputChange}required
                   className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                   placeholder={t('enterYourEmail')}
                 />
               </div>
             </div>
            
             <div>
               <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                 {t('subject')}
               </label>
               <select
                 id="subject"
                 name="subject"
                 value={formData.subject}
                 onChange={handleInputChange}
                 required
                 className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
               >
                 <option value="">{t('selectASubject')}</option>
                 <option value="account">{t('accountIssues')}</option>
                 <option value="withdrawal">{t('withdrawalProblems')}</option>
                 <option value="tasks">{t('taskQuestions')}</option>
                 <option value="membership">{t('membershipPlans')}</option>
                 <option value="other">{t('other')}</option>
               </select>
             </div>
            
             <div>
               <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                 {t('yourMessage')}
               </label>
               <textarea
                 id="message"
                 name="message"
                 value={formData.message}
                 onChange={handleInputChange}
                 required
                 rows={5}
                 className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                 placeholder={t('describeYourIssue')}
               ></textarea>
             </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                isSubmitting 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
               {isSubmitting ? t('sending') : t('sendMessage')}
             </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SupportPage;