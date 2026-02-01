import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "@/contexts/authContext";
import { LanguageContext } from "@/contexts/languageContext";

const Navigation = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  
  const navItems = [
    { label: t('home'), path: '/', icon: 'home' },
    { label: t('orders'), path: '/orders', icon: 'list-alt' },
    { label: t('tasks'), path: '/tasks', icon: 'clipboard-list' },
    { label: t('support'), path: '/support', icon: 'headset' },
    { label: t('profile'), path: '/profile', icon: 'user' },
  ];
  
  return (
    <nav className="hidden md:flex items-center space-x-1">
      {navItems.map((item) => (
        <Link
          key={item.label}
          to={item.path}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            item.path === window.location.pathname 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <i className={`fa-solid fa-${item.icon} mr-2`}></i>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;