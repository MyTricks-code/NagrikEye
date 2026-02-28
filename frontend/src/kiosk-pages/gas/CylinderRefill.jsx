import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Search, Flame, Calendar, CheckCircle } from 'lucide-react';
import { db } from '../../firebase/firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';

const CylinderRefill = () => {
  const navigate = useNavigate();
  const { highContrast, t } = useOutletContext();
  const [step, setStep] = useState(1);
  const [consumerId, setConsumerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [consumerDetails, setConsumerDetails] = useState(null);
  const [bookingId, setBookingId] = useState('');

  const handleFetch = async (e) => {
    e.preventDefault();
    if (!consumerId) return toast.error('Enter Consumer ID');
    setLoading(true);
    
    try {
      const docRef = doc(db, 'gasConsumers', consumerId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setConsumerDetails({
          name: data.name || "Consumer",
          lastBooking: "12 Sep 2025", // Mock historical data
          eligibleBooking: "10 Feb 2026",
          status: "Eligible for Booking"
        });
      } else {
        // Mock fallback if doesn't exist
        setConsumerDetails({
          name: "Jitesh Yadav",
          lastBooking: "12 Sep 2025",
          eligibleBooking: "10 Feb 2026",
          status: "Eligible for Booking"
        });
      }
      setStep(2);
      toast.success('Details Fetched');
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch details');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    setLoading(true);
    try {
      const generatedId = "BKG-" + Math.floor(100000 + Math.random() * 900000);
      await addDoc(collection(db, 'gasRefillBookings'), {
        consumerId,
        bookingId: generatedId,
        status: 'Confirmed',
        expectedDelivery: new Date(Date.now() + 3 * 86400000).toISOString(),
        createdAt: new Date().toISOString()
      });
      setBookingId(generatedId);
      setStep(3);
      toast.success('Cylinder Booked successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full p-4 md:p-6 text-xl md:text-2xl rounded-xl border outline-none transition-all ${highContrast ? 'bg-black text-white border-white focus:border-orange-400' : 'bg-white text-gray-900 border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 shadow-sm'}`;
  const btnSuccess = `flex items-center justify-center gap-3 w-full p-5 md:p-6 text-xl md:text-2xl font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${highContrast ? 'bg-white text-black hover:bg-gray-200' : 'bg-orange-600 text-white hover:bg-orange-700 shadow-md hover:shadow-lg'}`;

  return (
    <div className="max-w-3xl mx-auto py-4 md:py-8 h-full flex flex-col">
      <div className="flex items-center gap-6 mb-8 md:mb-12">
        <button 
          onClick={() => step > 1 && step < 3 ? setStep(step - 1) : navigate(-1)}
          className={`p-4 rounded-full transition-colors ${highContrast ? 'bg-white text-black hover:bg-gray-200' : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 shadow-sm'}`}
        >
          <ArrowLeft size={28} />
        </button>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t('bookRefill')}</h2>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {step === 1 && (
          <form onSubmit={handleFetch} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full mb-8">
            <div className={`space-y-6 ${highContrast ? '' : 'bg-white p-8 md:p-10 rounded-2xl border border-gray-100 shadow-sm'}`}>
              <div className="space-y-3">
                <label className="text-lg font-semibold opacity-90">{t('consumerId')}</label>
                <input
                  type="text"
                  placeholder={t('consumerId')}
                  value={consumerId}
                  onChange={(e) => setConsumerId(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className={btnSuccess}>
              {loading ? <div className="animate-spin w-6 h-6 border-4 border-current border-t-transparent rounded-full" /> : <Search size={28} />}
              {loading ? 'Fetching History...' : 'Fetch Booking History'}
            </button>
          </form>
        )}

        {step === 2 && consumerDetails && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 w-full">
            <div className={`p-8 md:p-10 rounded-3xl ${highContrast ? 'border-2 border-white bg-black' : 'bg-white shadow-lg border border-gray-100 relative overflow-hidden'}`}>
              {!highContrast && <div className="absolute top-0 left-0 w-full h-24 bg-orange-500/10 -z-10 rounded-t-3xl border-b border-orange-500/20"></div>}
              
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Flame size={28} className={highContrast ? 'text-white' : 'text-orange-500'} /> {t('consumerInfo')}
              </h3>
              
              <div className={`space-y-6 ${highContrast ? '' : 'bg-[#F9F7F1] p-6 rounded-2xl border border-gray-200'}`}>
                <div className="flex justify-between items-center text-lg md:text-xl">
                  <span className="opacity-70 font-semibold">{t('fullName')}</span>
                  <span className="font-bold">{consumerDetails.name}</span>
                </div>
                <div className={`flex justify-between items-center pt-4 border-t ${highContrast ? 'border-gray-700' : 'border-gray-300'} text-lg md:text-xl`}>
                  <span className="opacity-70 font-semibold flex items-center gap-2"><Calendar size={20}/> {t('lastRefill')}</span>
                  <span className="font-bold">{consumerDetails.lastBooking}</span>
                </div>
                <div className={`flex justify-between items-center pt-4 border-t ${highContrast ? 'border-gray-700' : 'border-gray-300'} text-lg md:text-xl`}>
                  <span className="opacity-70 font-semibold">Next Eligible Date</span>
                  <span className="font-bold">{consumerDetails.eligibleBooking}</span>
                </div>
              </div>

              <div className={`flex justify-between mt-8 p-6 rounded-2xl items-center font-bold ${highContrast ? 'border-2 border-white' : 'border-2 border-dashed border-orange-500 bg-orange-50'}`}>
                <span className="text-xl md:text-2xl opacity-90">{t('status')}</span>
                <span className={`flex items-center gap-2 text-xl md:text-2xl ${highContrast ? 'text-white' : 'text-orange-700'}`}><CheckCircle size={28} />{consumerDetails.status}</span>
              </div>
            </div>
            
            <button onClick={handleBook} disabled={loading} className={btnSuccess}>
              {loading ? <div className="animate-spin w-6 h-6 border-4 border-current border-t-transparent rounded-full" /> : <Flame size={28} />}
              {loading ? 'Processing Booking...' : 'Confirm Refill Booking'}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500 w-full">
            <div className={`p-10 md:p-12 text-center rounded-3xl ${highContrast ? 'border-2 border-white bg-black' : 'bg-white shadow-lg border border-gray-100 relative overflow-hidden'}`}>
              {!highContrast && <div className="absolute top-0 left-0 w-full h-32 bg-orange-500/10 -z-10 rounded-t-3xl border-b border-orange-500/20"></div>}
              
              <div className="flex justify-center mb-6 text-orange-500">
                <CheckCircle size={80} className={`${!highContrast && 'drop-shadow-sm'}`} />
              </div>
              <h3 className="text-3xl font-bold mb-3 tracking-tight">Booking Confirmed!</h3>
              <p className="text-lg opacity-70 mb-8">Your refill has been scheduled successfully.</p>
              
              <div className={`p-6 md:p-8 text-left rounded-2xl space-y-4 text-lg ${highContrast ? 'border border-gray-700' : 'bg-[#F9F7F1] border border-gray-200'}`}>
                <div className={`flex justify-between border-b pb-3 ${highContrast ? 'border-gray-700' : 'border-gray-200'}`}>
                  <span className="opacity-70">{t('trackingId')}</span>
                  <span className="font-mono font-medium text-xl">{bookingId}</span>
                </div>
                <div className="flex justify-between items-center pt-2 font-bold text-orange-600">
                  <span className={`opacity-70 ${highContrast ? 'text-white' : 'text-gray-900'}`}>Expected Delivery by</span>
                  <div className="flex items-center gap-2 text-xl"><Calendar size={24} /> {new Date(Date.now() + 3 * 86400000).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            <button onClick={() => navigate('/kiosk/gas')} className={`w-full max-w-md mx-auto ${btnSuccess}`}>
               {t('returnMenu') || 'Return to Main Menu'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CylinderRefill;
