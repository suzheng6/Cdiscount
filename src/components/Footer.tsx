import { Link } from "react-router-dom";
import { useContext } from "react";
import { LanguageContext } from "@/contexts/languageContext";

const Footer = () => {
  const { t, language } = useContext(LanguageContext);
  
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                C
              </div>
               <span className="ml-2 text-xl font-bold">{t('cdiscountUSA')}</span>
             </div>
             <p className="text-gray-400 mb-6">
               {t('bringingToUS')}
             </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => window.open("https://www.facebook.com/Cdiscount", "_blank")} 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-colors"
                aria-label="facebook"
              >
                <i className="fa-brands fa-facebook"></i>
              </button>
              <button 
                onClick={() => window.open("https://x.com/Cdiscount", "_blank")} 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-colors"
                aria-label="twitter"
              >
                <i className="fa-brands fa-twitter"></i>
              </button>
              <button 
                onClick={() => window.open("https://www.instagram.com/cdiscount/", "_blank")} 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-colors"
                aria-label="instagram"
              >
                <i className="fa-brands fa-instagram"></i>
              </button>
              <button 
                onClick={() => window.open("https://www.youtube.com/cdiscount", "_blank")} 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-colors"
                aria-label="youtube"
              >
                <i className="fa-brands fa-youtube"></i>
              </button>
            </div>
          </div>
          
            <div>
              <h3 className="text-lg font-bold mb-4">{t('quickLinks')}</h3>
              <ul className="space-y-2">
                {[
                  { en: 'About Us', zh: '关于我们', href: 'https://www.cdiscount.com/' },
                  { en: 'Features', zh: '功能', href: '/tasks' },
                  { en: 'How It Works', zh: '如何运作', href: '/tasks' },
                  { en: 'Testimonials', zh: '用户评价', href: '#' },
                  { en: 'FAQ', zh: '常见问题', href: '/support' }
                ].map((link, index) => (
                  <li key={index}>
                     <a href={link.href} className="text-gray-400 hover:text-white transition-colors" target={link.href.startsWith('http') ? '_blank' : '_self'} rel={link.href.startsWith('http') ? 'noopener noreferrer' : ''}>
                       {link[language] || link.en}
                     </a>
                  </li>
                ))}
              </ul>
           </div>
          
           <div>
             <h3 className="text-lg font-bold mb-4">{t('legal')}</h3>
             <ul className="space-y-2">
               <li>
                 <a href="https://clients.cdiscount.com/Simple/Cgv.aspx" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                   {language === 'zh' ? '服务条款' : 'Terms of Service'}
                 </a>
               </li>
               <li>
                 <a href="https://www.cdiscount.com/vie-privee-et-cookies.html" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                   {language === 'zh' ? '隐私策略' : 'Privacy Policy'}
                 </a>
               </li>
               <li>
                 <a href="https://www.cdiscount.com/resources/RWD/other/mentions_legales.pdf" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                   {language === 'zh' ? '法律声明' : 'Legal Notice'}
                 </a>
               </li>
               <li>
                 <a href="https://www.cdiscount.com/n-429993/pagesaurlfixe-arbo/rapport-de-transparence-dsa.html" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                   {language === 'zh' ? 'DSA透明度报告' : 'DSA Transparency Report'}
                 </a>
               </li>
               <li>
                 <a href="https://www.cdiscount.com/n-363119/pagesaurlfixe/cgv-mkp.html" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                   {language === 'zh' ? '市场使用条款' : 'Marketplace Terms of Use'}
                 </a>
               </li>
             </ul>
          </div>
          
           <div>
             <h3 className="text-lg font-bold mb-4">{t('contactUs')}</h3>
             <ul className="space-y-3">
               {[
                 { label: t('emailFooter'), value: 'support@cdiscountusa.com', icon: 'envelope' },
                 { label: t('phoneFooter'), value: '+1 (800) 123-4567', icon: 'phone' },
                 { label: t('addressFooter'), value: '123 Commerce St, New York, NY 10001', icon: 'map-marker-alt' }
               ].map((item, index) => (
                 <li key={index} className="flex items-start">
                   <i className={`fa-solid fa-${item.icon} text-blue-500 mt-1 mr-3`}></i>
                   <div>
                     <span className="text-gray-400">{item.label}:</span>
                     <span className="text-gray-400 ml-1">{item.value}</span>
                   </div>
                 </li>
               ))}
             </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Cdiscount USA. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="https://clients.cdiscount.com/Simple/Cgv.aspx" className="text-gray-500 hover:text-gray-300 text-sm" target="_blank" rel="noopener noreferrer">Terms</a>
              <a href="https://www.cdiscount.com/vie-privee-et-cookies.html" className="text-gray-500 hover:text-gray-300 text-sm" target="_blank" rel="noopener noreferrer">Privacy</a>
              <a href="https://www.cdiscount.com/resources/RWD/other/mentions_legales.pdf" className="text-gray-500 hover:text-gray-300 text-sm" target="_blank" rel="noopener noreferrer">Legal</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;