import { motion } from "framer-motion";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/contexts/authContext";
import { UserContext } from "@/contexts/userContext";
import { LanguageContext } from "@/contexts/languageContext";
import MemberCard from "@/components/MemberCard";

const HomePage = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const { balance } = useContext(UserContext);
  const { t, language } = useContext(LanguageContext);
  
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
        staggerChildren: 0.2
      }
    }
  };

     // 从localStorage获取会员等级数据，如果没有则使用默认值
  const [memberLevels, setMemberLevels] = useState<any[]>([]);
  
  useEffect(() => {
    const savedLevels = localStorage.getItem('memberLevels');
    if (savedLevels) {
      const parsedLevels = JSON.parse(savedLevels);
      // 格式化会员等级数据以适应MemberCard组件
      setMemberLevels(parsedLevels.map((level: any) => ({
        level: t(level.level.toLowerCase()), // 使用翻译函数处理等级名称
        title: t(level.title.toLowerCase().replace(' ', '')), // 使用翻译函数处理标题
        benefits: level.benefits.map((benefit: string) => {
          // 尝试翻译每个权益项
          const key = benefit.toLowerCase().replace(/[^a-z0-9]/g, '');
          return t(key) !== key ? t(key) : benefit;
        }),
        price: `$${new Intl.NumberFormat('en-US').format(level.balanceRequirement)}`,
        isCurrent: user?.memberLevel === level.level,
        gradientFrom: level.gradientFrom,
        gradientTo: level.gradientTo,
        icon: level.icon
      })));
    } else {
      // 默认会员等级数据
      setMemberLevels([
        {
          level: t('silver'),
          title: t('silverPackage'),
          benefits: language === 'zh' 
            ? [
                '佣金率：0.5%',
                '每日任务上限：50单',
                '账户余额要求：≥500美元',
                '访问基础任务',
                '电子邮件支持'
              ]
            : [
                'Commission Rate: 0.5%',
                'Daily Task Limit: 50 tasks',
                'Account Balance Required: ≥$500',
                'Access to basic tasks',
                'Email support'
              ],
          price: "$500",
          isCurrent: user?.memberLevel === "Silver" || !user?.memberLevel,
          gradientFrom: "from-gray-400",
          gradientTo: "to-gray-600",
          icon: "medal"
        },
        {
          level: t('gold'),
          title: t('goldPackage'),
          benefits: language === 'zh'
            ? [
                '佣金率：0.6%',
                '每日任务上限：50单',
                '账户余额要求：≥3000美元',
                '访问中级任务',
                '优先电子邮件支持',
                '专属任务提醒'
              ]
            : [
                'Commission Rate: 0.6%',
                'Daily Task Limit: 50 tasks',
                'Account Balance Required: ≥$3,000',
                'Access to intermediate tasks',
                'Priority email support',
                'Exclusive task alerts'
              ],
          price: "$3,000",
          isCurrent: user?.memberLevel === "Gold",
          gradientFrom: "from-yellow-500",
          gradientTo: "to-yellow-700",
          icon: "award"
        },
        {
          level: t('platinum'),
          title: t('platinumPackage'),
          benefits: language === 'zh'
            ? [
                '佣金率：0.7%',
                '每日任务上限：50单',
                '账户余额要求：≥6000美元',
                '访问高级任务',
                '优先电子邮件支持',
                '专属任务提醒',
                '更高价值的任务'
              ]
            : [
                'Commission Rate: 0.7%',
                'Daily Task Limit: 50 tasks',
                'Account Balance Required: ≥$6,000',
                'Access to premium tasks',
                'Priority email support',
                'Exclusive task alerts',
                'Higher value tasks'
              ],
          price: "$6,000",
          isCurrent: user?.memberLevel === "Platinum",
          gradientFrom: "from-blue-300",
          gradientTo: "to-blue-500",
          icon: "trophy"
        },
        {
          level: t('diamond'),
          title: t('diamondPackage'),
          benefits: language === 'zh'
            ? [
                '佣金率：0.8%',
                '每日任务上限：50单',
                '账户余额要求：≥20000美元',
                '访问所有任务',
                '24/7优先支持',
                '专属任务提醒',
                '更高价值的任务'
              ]
            : [
                'Commission Rate: 0.8%',
                'Daily Task Limit: 50 tasks',
                'Account Balance Required: ≥$20,000',
                'Access to all tasks',
                '24/7 priority support',
                'Exclusive task alerts',
                'Higher value tasks'
              ],
          price: "$20,000",
          isCurrent: user?.memberLevel === "Diamond",
          gradientFrom: "from-indigo-500",
          gradientTo: "to-indigo-700",
          icon: "gem"
        },
        {
          level: t('blackDiamond'),
          title: t('blackDiamondPackage'),
          benefits: language === 'zh'
            ? [
                '佣金率：0.9%',
                '每日任务上限：50单',
                '账户余额要求：≥50000美元',
                '访问所有任务',
                '24/7优先支持',
                '专属任务提醒',
                '更高价值的任务',
                '专属客户经理'
              ]
            : [
                'Commission Rate: 0.9%',
                'Daily Task Limit: 50 tasks',
                'Account Balance Required: ≥$50,000',
                'Access to all tasks',
                '24/7 priority support',
                'Exclusive task alerts',
                'Higher value tasks',
                'Dedicated account manager'
              ],
          price: "$50,000",
          isCurrent: user?.memberLevel === "BlackDiamond",
          gradientFrom: "from-gray-800",
          gradientTo: "to-black",
          icon: "gem"
        },
        {
          level: t('crown'),
          title: t('crownPackage'),
          benefits: language === 'zh'
            ? [
                '佣金率：1.0%',
                '每日任务上限：50单',
                '账户余额要求：≥100000美元',
                '访问所有任务',
                '24/7优先支持',
                '专属任务提醒',
                '最高价值的任务',
                '专属客户经理'
              ]
            : [
                'Commission Rate: 1.0%',
                'Daily Task Limit: 50 tasks',
                'Account Balance Required: ≥$100,000',
                'Access to all tasks',
                '24/7 priority support',
                'Exclusive task alerts',
                'Highest value tasks',
                'Dedicated account manager'
              ],
          price: "$100,000",
          isCurrent: user?.memberLevel === "Crown",
          gradientFrom: "from-yellow-400",
          gradientTo: "to-amber-600",
          icon: "crown"
        },
        {
          level: t('supreme'),
          title: t('supremePackage'),
          benefits: language === 'zh'
            ? [
                '佣金率：1.1%',
                '每日任务上限：50单',
                '账户余额要求：≥200000美元',
                '访问所有任务',
                '24/7专属支持',
                '专属任务提醒',
                '最高价值的任务',
                '专属客户经理',
                '优先参与新功能测试'
              ]
            : [
                'Commission Rate: 1.1%',
                'Daily Task Limit: 50 tasks',
                'Account Balance Required: ≥$200,000',
                'Access to all tasks',
                '24/7 dedicated support',
                'Exclusive task alerts',
                'Highest value tasks',
                'Dedicated account manager',
                'Priority for new feature testing'
              ],
          price: "$200,000",
          isCurrent: user?.memberLevel === "Supreme",
          gradientFrom: "from-purple-600",
          gradientTo: "to-pink-500",
          icon: "star"
        }
      ]);
    }
  }, [user?.memberLevel, t, language]);
  
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 md:p-12 shadow-lg">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col md:flex-row items-center"
        >
          <div className="md:w-1/2 mb-8 md:mb-0">
               <motion.div variants={fadeIn}>
                 <span className="inline-block px-4 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
                   {t('betaTestingPhase')}
                 </span>
               </motion.div>
               
               <motion.h1 
                 variants={fadeIn}
                 className="text-3xl md:text-5xl font-bold mb-4 leading-tight"
               >
                 {t('welcome')} <span className="bg-gradient-to-r from-blue-600 to-red-500 bg-clip-text text-transparent">{t('cdiscountUSA')}</span>
               </motion.h1>
               
               <motion.p 
                 variants={fadeIn}
                 className="text-lg text-gray-600 dark:text-gray-300 mb-8"
               >
                 {t('homeDescription')}
               </motion.p>
             
               <motion.div variants={fadeIn} className="flex flex-wrap gap-4">
                 <motion.a
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   href="/tasks"
                   className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                  >
                    {t('startEarning')}
                  </motion.a>
                  
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="/register"
                    className="px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    {t('joinNow')}
                  </motion.a>
                  
                  {/* 管理员登录按钮 - 为了演示目的 */}
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="/admin/login"
                    className="px-6 py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors"
                  >
                    Admin Login
                  </motion.a>
               </motion.div>
          </div>
          
          <motion.div 
            variants={fadeIn}
            className="md:w-1/2 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Modern%20E-commerce%20Platform%20Dashboard%20Interface&sign=f04a15a03bb5eecf5c8d44bb8f4e9522" 
                alt="Cdiscount Platform Dashboard" 
                className="w-full h-auto rounded-2xl"
              />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                 <div className="p-6">
                   <div className="flex items-center gap-2 mb-2">
                     <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                     <span className="text-white text-sm">{t('liveDashboard')}</span>
                   </div>
                   <h3 className="text-xl font-bold text-white">{t('trackYourEarnings')}</h3>
                 </div>
               </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-red-500/20 rounded-full filter blur-2xl"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-500/20 rounded-full filter blur-2xl"></div>
          </motion.div>
        </motion.div>
      </section>
      
      {/* How It Works Section */}
      <section>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-12"
        >
           <motion.span variants={fadeIn} className="inline-block px-4 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
             {t('howItWorks')}
           </motion.span>
           <motion.h2 variants={fadeIn} className="text-3xl font-bold mb-4">{t('simpleSteps')}</motion.h2>
           <motion.p variants={fadeIn} className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
             {t('howItWorksDescription')}
           </motion.p>
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
           {[
             {
               step: 1,
               title: t('registerAccount'),
               description: t('registerAccountDesc'),
               icon: "user-plus"
             },
             {
               step: 2,
               title: t('addFunds'),
               description: t('addFundsDesc'),
               icon: "wallet"
             },
             {
               step: 3,
               title: t('completeTasks'),
               description: t('completeTasksDesc'),
               icon: "clipboard-check"
             },
             {
               step: 4,
               title: t('withdrawEarnings'),
               description: t('withdrawEarningsDesc'),
               icon: "money-bill-wave"
             }
           ].map((item, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                <i className={`fa-solid fa-${item.icon} text-2xl`}></i>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
      
      {/* Member Levels Section */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-12"
        >
           <motion.span variants={fadeIn} className="inline-block px-4 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
             {t('membershipPlans')}
           </motion.span>
           <motion.h2 variants={fadeIn} className="text-3xl font-bold mb-4">{t('chooseYourMemberLevel')}</motion.h2>
           <motion.p variants={fadeIn} className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
             {t('membershipDescription')}
           </motion.p>
        </motion.div>
        
         <motion.div
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
           variants={staggerContainer}
           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
         >
            {memberLevels.map((level, index) => (
              <MemberCard
                key={index}
                level={level.level}
                title={level.title}
                benefits={level.benefits}
                price={level.price}
                isCurrent={level.isCurrent}
                gradientFrom={level.gradientFrom}
                gradientTo={level.gradientTo}
                icon={level.icon}
              />
            ))}
         </motion.div>
      </section>
      
      {/* Stats Section */}
      <section>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
           {[
             { value: '$1.2M', label: t('totalPaidCommissions'), icon: 'dollar-sign', color: 'blue' },
             { value: '15K+', label: t('activeUsers'), icon: 'users', color: 'green' },
             { value: '50K+', label: t('tasksCompleted'), icon: 'check-circle', color: 'purple' },
             { value: '98%', label: t('userSatisfaction'), icon: 'smile', color: 'red' }
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
      </section>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-red-500 rounded-3xl p-8 text-white shadow-xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center"
        >
           <motion.h2 variants={fadeIn} className="text-3xl font-bold mb-6">
             {t('readyToStartEarning')}
           </motion.h2>
           <motion.p variants={fadeIn} className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
             {t('ctaDescription')}
           </motion.p>
           <motion.div variants={fadeIn} className="flex flex-wrap justify-center gap-4">
             <motion.a
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               href="/register"
               className="px-8 py-3 rounded-lg bg-white text-blue-600 font-medium hover:bg-gray-100 transition-colors shadow-lg"
             >
               {t('signUpNow')}
             </motion.a>
             <motion.a
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               href="/tasks"
               className="px-8 py-3 rounded-lg bg-transparent border-2 border-white text-white font-medium hover:bg-white/10 transition-colors"
             >
               {t('exploreTasks')}
             </motion.a>
           </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;