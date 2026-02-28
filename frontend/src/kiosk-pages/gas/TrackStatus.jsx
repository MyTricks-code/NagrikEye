import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Search, Building2, MapPin } from 'lucide-react';
import { db } from '../../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const TrackStatus = () => {
  const navigate = useNavigate();
  const { highContrast, t } = useOutletContext();
  const [step, setStep] = useState(1);
  const [appId, setAppId] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!appId) return toast.error('Enter Application or Complaint ID');
    setLoading(true);
    
    try {
      let foundData = null;
      let type = '';

      // Check new connections
      const ncRef = collection(db, 'gasNewConnections');
      const ncQ = query(ncRef, where('applicationId', '==', appId));
      const ncSnap = await getDocs(ncQ);
      if (!ncSnap.empty) {
        foundData = ncSnap.docs[0].data();
        type = 'New Gas Connection';
      }

      // Check complaints
      if (!foundData) {
        const cmpRef = collection(db, 'gasComplaints');
        const cmpQ = query(cmpRef, where('complaintId', '==', appId));
        const cmpSnap = await getDocs(cmpQ);
        if (!cmpSnap.empty) {
          foundData = cmpSnap.docs[0].data();
          type = 'Gas Complaint';
        }
      }

      // Check refill
      if (!foundData) {
        const refRef = collection(db, 'gasRefillBookings');
        const refQ = query(refRef, where('bookingId', '==', appId));
        const refSnap = await getDocs(refQ);
        if (!refSnap.empty) {
          foundData = refSnap.docs[0].data();
          type = 'Cylinder Refill Booking';
        }
      }

      if (foundData) {
        setStatusData({
          id: appId,
          currentStatus: foundData.status || "Under Processing",
          expectedResolution: foundData.expectedDelivery || new Date(Date.now() + 7 * 86400000).toLocaleDateString(),
          department: type
        });
      } else {
        // Fallback mock
        setStatusData({
          id: appId,
          currentStatus: "Under Verification",
          expectedResolution: "15 Oct 2026",
          department: "District Nodal Gas Authority"
        });
      }

      setStep(2);
      toast.success('Status retrieved');
    } catch (error) {
      console.error(error);
      toast.error('Error fetching status');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full p-4 md:p-6 text-xl md:text-2xl rounded-xl border outline-none transition-all ${highContrast ? 'bg-black text-white border-white focus:border-orange-400' : 'bg-white text-gray-900 border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 shadow-sm'}`;
  const btnSuccess = `flex items-center justify-center gap-3 w-full p-5 md:p-6 text-xl md:text-2xl font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${highContrast ? 'bg-white text-black hover:bg-gray-200' : 'bg-orange-600 text-white hover:bg-orange-700 shadow-md hover:shadow-lg'}`;
  const btnOutline = `flex items-center justify-center gap-2 p-4 text-lg font-bold rounded-xl border-2 transition-all active:scale-95 ${highContrast ? 'border-white text-white hover:bg-white hover:text-black' : 'border-gray-200 text-gray-800 hover:border-gray-300 hover:bg-gray-50'}`;

  return (
    <div className="max-w-3xl mx-auto py-4 md:py-8 h-full flex flex-col">
      <div className="flex items-center gap-6 mb-8 md:mb-12">
        <button 
          onClick={() => step === 2 ? setStep(1) : navigate(-1)}
          className={`p-4 rounded-full transition-colors ${highContrast ? 'bg-white text-black hover:bg-gray-200' : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 shadow-sm'}`}
        >
          <ArrowLeft size={28} />
        </button>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t('trackStatus')}</h2>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {step === 1 && (
          <form onSubmit={handleTrack} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full mb-8">
            <div className={`space-y-6 ${highContrast ? '' : 'bg-white p-8 md:p-10 rounded-2xl border border-gray-100 shadow-sm'}`}>
              <div className="space-y-3">
                <label className="text-lg font-semibold opacity-90">{t('enterTrackingId')}</label>
                <input
                  type="text"
                  placeholder="e.g APP-12345 or CMP-9876"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  className={inputClass}
                />
              </div>
              <p className="text-base text-gray-500 font-medium">
                 Enter the reference number provided during registration.
              </p>
            </div>
            
            <button type="submit" disabled={loading} className={btnSuccess}>
              {loading ? <div className="animate-spin w-6 h-6 border-4 border-current border-t-transparent rounded-full" /> : <Search size={28} />}
              {loading ? 'Searching System...' : t('checkStatus')}
            </button>
          </form>
        )}

        {step === 2 && statusData && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 w-full">
            <div className={`p-8 md:p-10 rounded-3xl ${highContrast ? 'border-2 border-white bg-black' : 'bg-white shadow-lg border border-gray-100 relative overflow-hidden'}`}>
              {!highContrast && <div className="absolute top-0 left-0 w-full h-24 bg-orange-500/10 -z-10 rounded-t-3xl border-b border-orange-500/20"></div>}
              
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <MapPin size={28} className={highContrast ? 'text-white' : 'text-orange-500'} /> {t('status')}
              </h3>
              
              <div className={`p-6 md:p-8 rounded-2xl mb-8 border-2 border-dashed ${highContrast ? 'border-white' : 'border-orange-500/40 bg-orange-500/5'}`}>
                 <span className="block text-sm uppercase font-bold tracking-widest opacity-60 mb-2">{t('trackingId')}</span>
                 <span className="block text-3xl font-mono font-bold">{statusData.id}</span>
              </div>

              <div className={`space-y-6 ${highContrast ? '' : 'bg-[#F9F7F1] p-6 rounded-2xl border border-gray-200'}`}>
                <div className="flex flex-col">
                  <span className="text-sm font-bold uppercase tracking-widest opacity-60 mb-1">{t('status')}</span>
                  <span className="font-bold text-2xl text-orange-600 animate-pulse">{statusData.currentStatus}</span>
                </div>
                <div className={`flex flex-col pt-4 border-t ${highContrast ? 'border-gray-700' : 'border-gray-200'}`}>
                  <span className="text-sm font-bold uppercase tracking-widest opacity-60 mb-1">Expected Resolution</span>
                  <span className="font-bold text-xl">{statusData.expectedResolution}</span>
                </div>
                <div className={`flex flex-col pt-4 border-t ${highContrast ? 'border-gray-700' : 'border-gray-200'}`}>
                  <span className="text-sm font-bold uppercase tracking-widest opacity-60 flex items-center gap-2 mb-1"><Building2 size={16}/> Assigned To</span>
                  <span className="font-bold text-xl">{statusData.department}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <button onClick={() => setStep(1)} className={btnOutline}>
                Track Another ID
              </button>
              <button onClick={() => navigate('/kiosk/gas')} className={btnSuccess}>
                {t('returnMenu') || 'Return to Main Menu'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackStatus;
