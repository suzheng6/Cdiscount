import { motion } from "framer-motion";
import { useContext } from "react";
import { LanguageContext } from "@/contexts/languageContext";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    price: number;
    commission: number;
    image: string;
  };
  onGrabTask: (taskId: string) => void;
  isAvailable: boolean;
  balance: number;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onGrabTask, isAvailable, balance }) => {
  const { t } = useContext(LanguageContext);
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const isBalanceSufficient = balance >= task.price;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col h-full`}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={task.image} 
          alt={task.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs font-bold py-1 px-2 rounded">
          Commission: ${task.commission}
        </div>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-bold mb-2">{task.title}</h3>
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
            ${task.price}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round((task.commission / task.price) * 100)}% Return
          </div>
        </div>
        
        <div className="mt-auto">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onGrabTask(task.id)}
            disabled={!isAvailable || !isBalanceSufficient}
            className={`w-full py-2 rounded-lg font-medium transition-colors ${
              !isAvailable 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : !isBalanceSufficient
                  ? 'bg-orange-500 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
             {!isAvailable 
               ? t('taskCompleted') 
               : !isBalanceSufficient 
                 ? t('insufficientBalance')
                 : t('grabTask')}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;