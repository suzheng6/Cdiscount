import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "@/contexts/authContext";
import { LanguageContext } from "@/contexts/languageContext";
import { useTheme } from "@/hooks/useTheme";
import Navigation from "./Navigation";

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useContext(LanguageContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                C
              </div>
          <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-red-500 bg-clip-text text-transparent">
            {t('cdiscountUSA')}
          </span>
        </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Navigation />
            
            {isAuthenticated ? (
              <>
                <div className="relative">
                  <button className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <i className="fa-solid fa-wallet text-blue-600 dark:text-blue-400"></i>
                    <span className="font-medium">${user?.balance || 0}</span>
                  </button>
                </div>
                <div className="relative">
                  <button 
                    onClick={logout}
                    className="flex items-center space-x-1 px-3 py-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                  >
                    <i className="fa-solid fa-sign-out-alt"></i>
                    <span className="hidden lg:inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                 <Link to="/login" className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  {t('signIn')}
                </Link>
                <Link to="/register" className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  {t('signUp')}
                </Link>
                {/* 管理员登录入口 */}
                <Link to="/admin/login" className="px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors ml-2">
                  Admin Login
                </Link>
              </>
            )}

            {/* Language Toggle */}
            <button 
              onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={`Switch to ${language === 'en' ? 'Chinese' : 'English'}`}
            >
              <span className="font-medium">{language === 'en' ? '中文' : 'EN'}</span>
            </button>
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <i className="fa-solid fa-moon text-gray-700"></i>
              ) : (
                <i className="fa-solid fa-sun text-yellow-400"></i>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300"
              aria-label="Toggle menu"
            >
              <i className="fa-solid fa-bars text-xl"></i>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-1">
              {[
                { label: t('home'), path: '/', icon: 'home' },
                { label: t('orders'), path: '/orders', icon: 'list-alt' },
                { label: t('tasks'), path: '/tasks', icon: 'clipboard-list' },
                { label: t('support'), path: '/support', icon: 'headset' },
                { label: t('profile'), path: '/profile', icon: 'user' },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    item.path === window.location.pathname 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <i className={`fa-solid fa-${item.icon} mr-2`}></i>
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {isAuthenticated ? (
                <div className="px-4 py-2">
                  <div className="flex items-center justify-between p-2 mb-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Balance</span>
                    <span className="font-medium">${user?.balance || 0}</span>
                  </div>
                  <button 
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-1 px-3 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                  >
                    <i className="fa-solid fa-sign-out-alt"></i>
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="px-4 py-2 space-y-2">
                  <Link 
                    to="/login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    {t('signIn')}
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    {t('signUp')}
                  </Link>
                </div>
              )}
              
              {/* Mobile language and theme toggles */}
              <div className="px-4 py-2 flex justify-between">
                <button 
                  onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label={`Switch to ${language === 'en' ? 'Chinese' : 'English'}`}
                >
                  <span className="font-medium">{language === 'en' ? '中文' : 'EN'}</span>
                </button>
                
                <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                >
                  {theme === 'light' ? (
                    <i className="fa-solid fa-moon text-gray-700"></i>
                  ) : (
                    <i className="fa-solid fa-sun text-yellow-400"></i>
                  )}
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;