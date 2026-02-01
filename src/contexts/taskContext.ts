import { createContext } from "react";

// 定义任务接口
export interface Task {
  id: string;
  title: string;
  price: number;
  commission: number;
  image: string;
  memberLevel: string;
}

export const TaskContext = createContext({
  tasks: [] as Task[],
  setTasks: (tasks: Task[]) => {},
  orders: [] as any[],
  setOrders: (orders: any[]) => {},
  saveOrdersData: () => {},
  loadAvailableTasks: () => {},
});