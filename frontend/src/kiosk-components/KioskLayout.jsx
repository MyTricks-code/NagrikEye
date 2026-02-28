import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Home, RefreshCw, Type, Eye, Accessibility } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/logo.svg';

const KioskLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [highContrast, setHighContrast] = useState(false);
  const [largeFont, setLargeFont] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    let timeoutId;
    
    const resetTimer = () => {
      clearTimeout(timeoutId);
      if (location.pathname !== '/kiosk') {
        timeoutId = setTimeout(() => {
          navigate('/kiosk');
        }, 60000);
      }
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(e => document.addEventListener(e, resetTimer));
    
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach(e => document.removeEventListener(e, resetTimer));
    };
  }, [navigate, location]);

  const isHome = location.pathname === '/kiosk';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${highContrast ? 'bg-black text-white' : 'bg-[#F9F7F1] text-[#1a1a1a]'} ${largeFont ? 'text-xl' : 'text-base'}`}>
      <Toaster position="top-center" 
        toastOptions={{
          style: {
            background: highContrast ? '#fff' : '#1a1a1a',
            color: highContrast ? '#000' : '#fff',
            fontSize: largeFont ? '1.25rem' : '1rem',
          },
        }}
      />
      
      <header className={`px-8 py-5 flex justify-between items-center shadow-sm border-b transition-colors ${highContrast ? 'bg-gray-900 border-white' : 'bg-white border-orange-200'}`}>
        <div className="flex items-center gap-6">
          {!isHome && (
            <button 
              onClick={() => navigate('/kiosk')}
              className={`flex items-center justify-center w-14 h-14 rounded-full transition-colors ${highContrast ? 'bg-white text-black hover:bg-gray-200' : 'bg-orange-100 text-orange-900 hover:bg-orange-200'}`}
            >
              <Home size={28} />
            </button>
          )}
          <div className="flex items-center gap-3">
             <img src={logo} alt="NagrikEye" className="h-10 w-auto" />
             <div className="flex flex-col">
                <h1 className="text-2xl font-bold leading-none tracking-tight">{t('nagrikEye')}</h1>
                <span className="text-sm font-medium opacity-60 tracking-wider uppercase mt-1">{t('selfServiceKiosk')}</span>
             </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={toggleLanguage}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl min-h-[56px] font-medium transition-colors ${highContrast ? 'bg-white text-black hover:bg-gray-200' : 'bg-white border-2 border-orange-200 text-[#1a1a1a] hover:bg-orange-50'}`}
          >
            <Type size={20} className="opacity-70 text-orange-600" />
            <span>{language === 'en' ? 'EN' : 'HI'}</span>
          </button>
          
          <button 
             onClick={() => setLargeFont(!largeFont)}
             className={`flex items-center gap-2 px-6 py-3 rounded-xl min-h-[56px] font-medium transition-colors ${largeFont ? (highContrast ? 'bg-gray-700 text-white' : 'bg-orange-600 text-white') : (highContrast ? 'bg-white text-black hover:bg-gray-200' : 'bg-white border-2 border-orange-200 text-[#1a1a1a] hover:bg-orange-50')}`}
           >
             <Accessibility size={20} className={largeFont ? "opacity-100" : "opacity-70 text-orange-600"} />
             <span>Aa</span>
           </button>

          <button 
            onClick={() => setHighContrast(!highContrast)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl min-h-[56px] font-medium transition-colors ${highContrast ? 'bg-white text-black hover:bg-gray-200' : 'bg-white border-2 border-orange-200 text-[#1a1a1a] hover:bg-orange-50'}`}
          >
            <Eye size={20} className={highContrast ? "opacity-100" : "opacity-70 text-orange-600"} />
            <span>{t('contrast')}</span>
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1306px] mx-auto p-8 md:p-12 overflow-y-auto">
        <Outlet context={{ highContrast, largeFont, language, t }} />
      </main>

      {!isHome && (
        <div className={`p-6 flex justify-center mt-auto border-t transition-colors ${highContrast ? 'border-gray-800 bg-black' : 'border-orange-200 bg-white'}`}>
          <button 
            onClick={() => navigate('/kiosk')}
            className={`flex items-center gap-3 px-8 py-4 rounded-xl font-medium transition-colors shadow-sm ${highContrast ? 'bg-white text-black hover:bg-gray-200' : 'bg-orange-600 text-white hover:bg-orange-700 shadow-orange-200'}`}
          >
            <RefreshCw size={24} />
            {t('endSession')}
          </button>
        </div>
      )}
    </div>
  );
};

export default KioskLayout;
