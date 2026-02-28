import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, AlertOctagon, PhoneCall, ShieldAlert, MapPin, AlertTriangle, Navigation } from 'lucide-react';
import { db } from '../../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';

const Emergency = () => {
  const navigate = useNavigate();
  const { highContrast, t } = useOutletContext();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleReportLeak = async () => {
    setLoading(true);
    try {
      await addDoc(collection(db, 'gasEmergencies'), {
        type: 'Gas Leak',
        status: 'Critical Alert Dispatch',
        location: 'Kiosk - Central Plaza, Sector 4',
        timestamp: new Date().toISOString()
      });
      setStep(2);
      toast.error('EMERGENCY REPORTED', { duration: 5000 });
    } catch (error) {
      console.error(error);
      toast.error('Failed to transmit alert. CALL 1906 DIRECTLY.');
    } finally {
      setLoading(false);
    }
  };

  const btnDanger = `flex flex-col items-center justify-center p-8 md:p-10 text-2xl md:text-3xl font-black uppercase tracking-wider rounded-3xl transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl ${highContrast ? 'bg-black text-white border-4 border-red-500' : 'bg-red-600 text-white hover:bg-red-700 animate-pulse border-2 border-red-800'}`;

  return (
    <div className="max-w-3xl mx-auto py-4 md:py-8 h-full flex flex-col">
      <div className="flex items-center gap-6 mb-8 md:mb-12">
        <button 
          onClick={() => step === 2 ? navigate('/kiosk/gas') : navigate(-1)}
          className={`p-4 rounded-full transition-colors ${highContrast ? 'bg-white text-black hover:bg-gray-200' : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 shadow-sm'}`}
        >
          <ArrowLeft size={28} />
        </button>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-red-600 flex items-center gap-3">
          <AlertOctagon size={36} /> {t('emergencyReport')}
        </h2>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {step === 1 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full mb-8">
            <button onClick={handleReportLeak} disabled={loading} className={btnDanger}>
              {loading ? (
                <div className="animate-spin w-16 h-16 md:w-20 md:h-20 border-8 border-current border-t-transparent rounded-full mb-6" />
              ) : (
                <AlertOctagon size={80} className="mb-4 md:mb-6 md:w-24 md:h-24" />
              )}
              {loading ? 'Transmitting Alert...' : t('reportNow')}
            </button>
            <p className="text-center font-bold text-red-500 opacity-80 text-lg uppercase tracking-widest mt-2">
              Pressing this will instantly alert the nearest response team
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
               <div className={`p-6 md:p-8 rounded-3xl flex flex-col items-center justify-center text-center transition-all ${highContrast ? 'border-2 border-red-500 bg-black text-white' : 'bg-red-50 border border-red-100 text-red-900 shadow-sm'}`}>
                 <PhoneCall size={48} className="mb-4 opacity-80 text-red-600" />
                 <span className="text-sm md:text-base font-bold mb-2 opacity-90 uppercase tracking-widest">Toll-Free Helpline</span>
                 <span className="text-4xl md:text-5xl font-black tracking-widest text-red-600">1906</span>
               </div>
               <div className={`p-6 md:p-8 rounded-3xl flex flex-col items-center justify-center text-center transition-all ${highContrast ? 'border-2 border-orange-500 bg-black text-white' : 'bg-orange-50 border border-orange-100 text-orange-900 shadow-sm'}`}>
                 <MapPin size={48} className="mb-4 opacity-80 text-orange-600" />
                 <span className="text-sm md:text-base font-bold uppercase tracking-widest mb-2 opacity-90">Kiosk Location</span>
                 <span className="text-xl md:text-2xl font-bold text-orange-800">Auto-Sent to Responders</span>
                 <span className="text-sm md:text-base mt-2 opacity-70 font-medium">(Central Plaza, Sector 4)</span>
               </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500 w-full">
            <div className={`p-10 md:p-12 text-center rounded-3xl ${highContrast ? 'border-4 border-red-500 bg-black' : 'bg-red-50 border border-red-200 shadow-2xl relative overflow-hidden'}`}>
              <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>
              <div className="relative z-10">
                <div className="flex justify-center mb-6 text-red-600 animate-bounce">
                  <ShieldAlert size={100} />
                </div>
                <h3 className="text-3xl md:text-5xl font-black mb-4 text-red-700 uppercase tracking-tight">Emergency Alert Sent!</h3>
                <p className="text-xl md:text-2xl font-bold mb-10 text-red-600 max-w-md mx-auto">
                  A rapid response unit has been dispatched to your location.
                </p>
                
                <div className={`text-left p-8 rounded-2xl space-y-4 shadow-sm ${highContrast ? 'border border-gray-700 bg-gray-900' : 'bg-white border border-gray-100'}`}>
                  <h4 className="text-xl md:text-2xl font-bold mb-4 text-red-600 uppercase tracking-widest flex items-center gap-2"><AlertTriangle size={24}/> {t('safetyInstructions')}</h4>
                  <ul className="text-lg md:text-xl space-y-3 font-semibold list-none pl-2 text-gray-800">
                    <li className="flex items-center gap-3"><div className="w-2 h-2 bg-red-500 rounded-full"></div> {t('callFireDept')}</li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 bg-red-500 rounded-full"></div> {t('doNotUseSwitches')}</li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 bg-red-500 rounded-full"></div> {t('evacuateArea')}</li>
                  </ul>
                </div>
              </div>
            </div>

            <button onClick={() => navigate('/kiosk/gas')} className={`w-full p-6 md:p-8 text-xl md:text-2xl font-bold rounded-2xl transition-all shadow-md active:scale-95 ${highContrast ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#1a1a1a] text-white hover:bg-black uppercase tracking-widest'}`}>
               I Understand - Return to Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Emergency;
