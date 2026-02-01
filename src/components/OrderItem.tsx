import { motion } from "framer-motion";
import { useContext } from "react";
import { LanguageContext } from "@/contexts/languageContext";

interface OrderItemProps {
  order: {
    id: string;
    taskId: string;
    taskTitle: string;
    price: number;
    commission: number;
    status: string;
    date: string;
    image: string;
  };
}

const OrderItem: React.FC<OrderItemProps> = ({ order }) => {
  const { t } = useContext(LanguageContext);
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="flex flex-col md:flex-row items-center p-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
    >
      <div className="w-20 h-20 rounded-lg overflow-hidden mb-4 md:mb-0 md:mr-4 flex-shrink-0">
        <img 
          src={order.image} 
          alt={order.taskTitle}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-grow mb-4 md:mb-0 md:mr-4">
        <h3 className="font-bold text-lg">{order.taskTitle}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{order.date}</p>
      </div>
      
      <div className="flex flex-col items-end">
                 <div className="flex items-center justify-between w-full md:w-auto mb-2">
                   <span className="text-gray-600 dark:text-gray-400">{t('orderAmount')}</span>
                   <span className="font-medium ml-2 md:ml-4">${order.price}</span>
                 </div>
                 
                 <div className="flex items-center justify-between w-full md:w-auto mb-2">
                   <span className="text-gray-600 dark:text-gray-400">{t('commission')}</span>
                   <span className="font-medium text-green-600 dark:text-green-400 ml-2 md:ml-4">${order.commission}</span>
                 </div>
        
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
          {order.status}
        </div>
      </div>
    </motion.div>
  );
};

export default OrderItem;