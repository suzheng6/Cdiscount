import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthContext } from '@/contexts/authContext';
import { UserContext } from '@/contexts/userContext';
import { TaskContext } from '@/contexts/taskContext';
import { LanguageProvider } from '@/contexts/languageContext';
import HomePage from "@/pages/HomePage";
import OrderHistory from "@/pages/OrderHistory";
import TasksPage from "@/pages/TasksPage";
import SupportPage from "@/pages/SupportPage";
import ProfilePage from "@/pages/ProfilePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminMemberLevels from "@/pages/AdminMemberLevels";
import AdminSupportSettings from "@/pages/AdminSupportSettings";
import AdminUserManagement from "@/pages/AdminUserManagement";
import AdminTaskManagement from "@/pages/AdminTaskManagement";
import AdminLuckyOrders from "@/pages/AdminLuckyOrders";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTheme } from "@/hooks/useTheme";

export default function App() {
  const { theme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);

  // 检查用户登录状态
  useEffect(() => {
    // 从localStorage获取token和用户信息
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    // 如果有token和用户信息，则自动登录
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setIsAuthenticated(true);
        setUser(parsedUser);
        setBalance(parsedUser.balance || 0);
        
        // 加载用户订单和任务
        loadUserOrders(parsedUser.id);
        loadAvailableTasks();
      } catch (error) {
        console.error('Error loading user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setBalance(0);
    localStorage.removeItem('user');
  };

  const loadUserOrders = (userId: string) => {
    // 模拟加载用户订单
    const savedOrders = localStorage.getItem(`orders_${userId}`);
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  };

  const loadAvailableTasks = () => {
    // 模拟加载可用任务
    const mockTasks = [
      { 
        id: '1', 
        title: 'Electronics Shopping', 
        price: 100, 
        commission: 0.5, 
        image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=Latest%20Smartphone%20with%20Modern%20Design&sign=cfd7510df98c6b7ca2f2cf27a4d73390',
        memberLevel: 'Silver'
      },
      { 
        id: '2', 
        title: 'Fashion Products', 
        price: 50, 
        commission: 0.3, 
        image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=Trendy%20Fashion%20Clothing%20Display&sign=58cbe7d42c843b7c0e72a648660f77fe',
        memberLevel: 'Gold'
      },
      { 
        id: '3', 
        title: 'Home Appliances', 
        price: 150, 
        commission: 1.05, 
        image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=Modern%20Home%20Appliances%20in%20Kitchen&sign=0dd40b7b71aec2eaf08c66e1c2388236',
        memberLevel: 'Platinum'
      },
      { 
        id: '4', 
        title: 'Books Collection', 
        price: 30, 
        commission: 0.24, 
        image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=Collection%20of%20Best%20Selling%20Books&sign=aa6a15682fe5b5e89e9eb614df6cd33f',
        memberLevel: 'Diamond'
      },
    ];
    setTasks(mockTasks);
  };

  const saveUserData = () => {
    if (user) {
      localStorage.setItem('user', JSON.stringify({ ...user, balance }));
    }
  };

  const saveOrdersData = () => {
    if (user) {
      localStorage.setItem(`orders_${user.id}`, JSON.stringify(orders));
    }
  };

  const authValue = { isAuthenticated, setIsAuthenticated, user, setUser, logout };
  const userValue = { balance, setBalance, saveUserData };
  const taskValue = { tasks, setTasks, orders, setOrders, saveOrdersData, loadAvailableTasks };

  return (
    <LanguageProvider>
      <AuthContext.Provider value={authValue}>
        <UserContext.Provider value={userValue}>
          <TaskContext.Provider value={taskValue}>
            <div className={`min-h-screen flex flex-col bg-gray-50 ${theme === 'dark' ? 'dark bg-gray-900 text-white' : 'text-gray-900'}`}>
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/member-levels" element={<AdminMemberLevels />} />
              <Route path="/admin/support-settings" element={<AdminSupportSettings />} />
              <Route path="/admin/users" element={<AdminUserManagement />} />
              <Route path="/admin/tasks" element={<AdminTaskManagement />} />
              <Route path="/admin/lucky-orders" element={<AdminLuckyOrders />} />
            </Routes>
              </main>
              <Footer />
            </div>
          </TaskContext.Provider>
        </UserContext.Provider>
      </AuthContext.Provider>
    </LanguageProvider>
  );
}