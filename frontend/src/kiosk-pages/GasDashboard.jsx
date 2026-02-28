import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { FileText, PlusCircle, Flame, MessageSquare, MapPin, AlertOctagon } from 'lucide-react';

const GasDashboard = () => {
  const navigate = useNavigate();
  const { highContrast, t } = useOutletContext();

  const services = [
    {
      title: t('payBill'),
      icon: <FileText size={40} />,
      path: "/kiosk/gas/pay-bill",
    },
    {
      title: t('newConnection'),
      icon: <PlusCircle size={40} />,
      path: "/kiosk/gas/new-connection",
    },
    {
      title: t('bookRefill'),
      icon: <Flame size={40} />,
      path: "/kiosk/gas/book-refill",
    },
    {
      title: t('registerComplaint'),
      icon: <MessageSquare size={40} />,
      path: "/kiosk/gas/register-complaint",
    },
    {
      title: t('trackStatus'),
      icon: <MapPin size={40} />,
      path: "/kiosk/gas/track-status",
    }
  ];

  return (
    <div className="flex flex-col items-center h-full pt-8 animate-in fade-in duration-500">
      <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center tracking-tight">
        {t('gasServices')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mb-12">
        {services.map((service, index) => (
          <button
            key={index}
            onClick={() => navigate(service.path)}
            className={`group relative flex flex-col items-center justify-center p-10 rounded-2xl transition-all duration-300 active:scale-95 min-h-[220px] ${highContrast ? 'bg-gray-800 text-white border-2 border-white' : 'bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-500'}`}
          >
            <div className={`mb-6 p-5 rounded-2xl transition-colors duration-300 ${highContrast ? 'bg-black text-white' : 'bg-[#F9F7F1] text-[#1a1a1a] group-hover:bg-orange-500 group-hover:text-white'}`}>
              {service.icon}
            </div>
            <span className="text-2xl font-bold text-center tracking-wide">
              {service.title}
            </span>
          </button>
        ))}
      </div>

      <div className={`w-full max-w-6xl mt-4 p-2 rounded-3xl ${highContrast ? 'bg-gray-800 border-2 border-red-500' : 'bg-white shadow-sm border border-red-100'}`}>
        <button
          onClick={() => navigate('/kiosk/gas/emergency')}
          className="w-full flex items-center justify-center gap-6 p-8 rounded-2xl bg-red-600 text-white hover:bg-red-700 active:bg-red-800 transition-colors shadow-lg min-h-[120px]"
        >
          <AlertOctagon size={48} className="animate-pulse" />
          <div className="flex flex-col text-left">
            <span className="text-3xl font-bold tracking-tight">
              {t('emergency')}
            </span>
            <span className="text-lg font-medium opacity-90 tracking-wide uppercase mt-1">
              {t('emergencyDesc')}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default GasDashboard;
