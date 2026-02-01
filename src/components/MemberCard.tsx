import { motion } from "framer-motion";
import { useContext } from "react";
import { LanguageContext } from "@/contexts/languageContext";

// 添加默认翻译函数，以防上下文不可用
const defaultT = (key: string) => key;

interface MemberCardProps {
  level: string;
  title: string;
  benefits: string[];
  price: string;
  isCurrent?: boolean;
  gradientFrom: string;
  gradientTo: string;
  icon: string;
}

const MemberCard: React.FC<MemberCardProps> = ({
  level,
  title,
  benefits,
  price,
  isCurrent = false,
  gradientFrom,
  gradientTo,
  icon
}) => {
  // 获取语言上下文
  const { t: contextT, language } = useContext(LanguageContext);
  // 使用上下文的翻译函数或默认函数
  const t = contextT || defaultT;
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { delay: 0.3, duration: 0.3 }
    }
  };

    // 确保 benefits 是一个数组
  const safeBenefits = Array.isArray(benefits) ? benefits : [];
  
  // 如果 benefits 是空数组，根据当前语言提供默认的会员权益信息
  const displayBenefits = safeBenefits.length > 0 ? safeBenefits : [
    t('accessMemberTasks'),
    t('dailyTaskLimit'),
    t('dedicatedSupport'),
    t('commissionBasedOnLevel')
  ];

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`relative rounded-xl overflow-hidden shadow-lg border ${
        isCurrent ? 'border-blue-500 dark:border-blue-400' : 'border-gray-200 dark:border-gray-700'
      } h-full flex flex-col`}
    >
      <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} p-6 text-white`}>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <i className={`fa-solid fa-${icon} text-2xl mr-3`}></i>
              <h3 className="text-2xl font-bold">{level}</h3>
            </div>
            <p className="text-white/80">{title}</p>
          </div>
          <div className="text-3xl font-bold">{price}</div>
        </div>
      </div>
      
      {isCurrent && (
        <motion.div
          variants={badgeVariants}
          className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold py-1 px-3 rounded-full transform rotate-12"
        >
          CURRENT
        </motion.div>
      )}
      
      <div className="p-6 flex-grow bg-white dark:bg-gray-800 flex flex-col">
       <ul className="space-y-3 mb-8 flex-grow">
        {displayBenefits.map((benefit, index) => (
          <li key={index} className="flex items-start">
            <i className="fa-solid fa-check text-green-500 mt-1 mr-2"></i>
            <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
          </li>
        ))}
        </ul>
        
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            isCurrent 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {isCurrent ? 'Current Plan' : 'Upgrade Now'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MemberCard;