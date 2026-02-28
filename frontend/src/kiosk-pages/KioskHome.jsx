import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Zap, Building2 } from 'lucide-react';

const KioskHome = () => {
  const navigate = useNavigate();
  const { highContrast, t } = useOutletContext();

  return (
    <div className="flex flex-col items-center justify-center h-full py-12 animate-in fade-in duration-500">
      <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center tracking-tight">
        {t('selectService')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
        <button 
          className={`group relative overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${highContrast ? 'bg-black text-white border-2 border-white rounded-[30px] p-12' : 'bg-white border-2 border-stone-200 rounded-[30px] p-12'}`}
          disabled
        >
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <div className={`mb-6 flex justify-center text-gray-400 group-disabled:opacity-60`}>
              <Zap size={60} />
            </div>
            <h3 className={`text-[28px] font-medium mb-4 ${highContrast ? 'text-white' : 'text-[#2c2e2a]'}`}>{t('electricity')}</h3>
            <p className={`text-[16px] leading-relaxed uppercase font-medium ${highContrast ? 'text-gray-300' : 'text-gray-500'}`}>
              {t('comingSoon')}
            </p>
          </div>
        </button>

        <button 
          onClick={() => navigate('/kiosk/gas')}
          className={`group relative overflow-hidden transition-all duration-300 active:scale-95 cursor-pointer ${highContrast ? 'bg-black text-white border-2 border-white rounded-[30px] p-12' : 'bg-white border-2 border-stone-200 rounded-[30px] p-12 hover:border-[#8ED462] hover:shadow-xl'}`}
        >
          {!highContrast && <div className="absolute inset-0 bg-linear-to-br from-[#8ED462]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>}
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <div className={`mb-6 flex justify-center ${highContrast ? 'text-white' : 'text-[#2c2e2a]'}`}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2c0 0-6 6-6 12a6 6 0 0 0 12 0c0-6-6-12-6-12z"></path>
                  <path d="M12 12c0 0-3 3-3 5a3 3 0 0 0 6 0c0-2-3-5-3-5z"></path>
              </svg>
            </div>
            <h3 className={`text-[28px] font-medium mb-4 ${highContrast ? 'text-white' : 'text-[#2c2e2a]'}`}>{t('gasUtility')}</h3>
            <p className={`text-[16px] leading-relaxed uppercase font-medium ${highContrast ? 'text-gray-300' : 'text-gray-500'}`}>
              {t('clickToProceed')}
            </p>
          </div>
        </button>

        <button 
          className={`group relative overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${highContrast ? 'bg-black text-white border-2 border-white rounded-[30px] p-12' : 'bg-white border-2 border-stone-200 rounded-[30px] p-12'}`}
          disabled
        >
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <div className={`mb-6 flex justify-center text-gray-400 group-disabled:opacity-60`}>
              <Building2 size={60} />
            </div>
            <h3 className={`text-[28px] font-medium mb-4 ${highContrast ? 'text-white' : 'text-[#2c2e2a]'}`}>{t('municipal')}</h3>
            <p className={`text-[16px] leading-relaxed uppercase font-medium ${highContrast ? 'text-gray-300' : 'text-gray-500'}`}>
              {t('comingSoon')}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default KioskHome;
