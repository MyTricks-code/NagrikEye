import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Search, CreditCard, Printer, CheckCircle, ArrowLeft } from 'lucide-react';
import { db } from '../../firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const GasBillPayment = () => {
  const navigate = useNavigate();
  const { highContrast, t } = useOutletContext();
  const [step, setStep] = useState(1);
  const [consumerId, setConsumerId] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [billData, setBillData] = useState(null);

  const handleFetchBill = async (e) => {
    e.preventDefault();
    if (!consumerId || !mobile) {
      toast.error('Please enter both Consumer ID and Mobile Number');
      return;
    }
    setLoading(true);

    try {
      const docRef = doc(db, 'gasConsumers', consumerId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setBillData(docSnap.data());
      } else {
        // Fallback: Create dummy record for testing
        const newRecord = {
          consumerId,
          name: "Test User",
          billAmount: "₹ " + (Math.floor(Math.random() * 2000) + 500) + ".00",
          dueDate: new Date(Date.now() + 15 * 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          mobile,
          transactionId: "TXN" + Math.floor(Math.random() * 1000000)
        };
        await setDoc(docRef, newRecord);
        setBillData(newRecord);
      }
      setStep(2);
      toast.success(t('fetchingDetails') ? 'Bill fetched successfully' : 'Bill fetched successfully');
    } catch (error) {
      console.error(error);
      toast.error('Error fetching details.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Simulate payment processing, update DB if needed
      const docRef = doc(db, 'gasConsumers', consumerId);
      await setDoc(docRef, { billAmount: '₹ 0.00' }, { merge: true });
      
      setStep(3);
      toast.success('Payment Successful!');
    } catch (error) {
      console.error(error);
      toast.error('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full p-4 md:p-6 text-xl md:text-2xl rounded-xl border outline-none transition-all ${highContrast ? 'bg-black text-white border-white focus:border-orange-400' : 'bg-white text-gray-900 border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20'}`;
  const btnClass = `flex items-center justify-center gap-3 w-full p-5 md:p-6 text-xl md:text-2xl font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${highContrast ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#1a1a1a] text-white hover:bg-black shadow-md hover:shadow-lg'}`;
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
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t('payBill')}</h2>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {/* Step 1: Search */}
        {step === 1 && (
          <form onSubmit={handleFetchBill} className="space-y-8 animate-in fade-in duration-500 w-full">
            <div className="space-y-3">
              <label className="text-lg md:text-xl font-semibold opacity-90">{t('consumerId')}</label>
              <input
                type="text"
                placeholder={t('consumerId')}
                value={consumerId}
                onChange={(e) => setConsumerId(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="space-y-3">
              <label className="text-lg md:text-xl font-semibold opacity-90">{t('mobileNumber')}</label>
              <input
                type="tel"
                placeholder={t('mobileNumber')}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className={inputClass}
              />
            </div>
            <button type="submit" disabled={loading} className={`mt-10 ${btnSuccess}`}>
              {loading ? <div className="animate-spin w-6 h-6 border-4 border-current border-t-transparent rounded-full" /> : <Search size={28} />}
              {loading ? t('fetchingDetails') : t('proceed')}
            </button>
          </form>
        )}

        {/* Step 2: Bill Summary */}
        {step === 2 && billData && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
            <div className={`p-8 rounded-2xl ${highContrast ? 'border-2 border-white' : 'bg-white shadow-sm border border-gray-100'}`}>
              <h3 className="text-2xl font-bold mb-8 border-b border-gray-200 pb-4">{t('billSummary')}</h3>
              <div className="space-y-5 text-xl">
                <div className="flex justify-between items-center">
                  <span className="opacity-70 text-lg">{t('consumerName')}</span>
                  <span className="font-semibold">{billData.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-70 text-lg">{t('consumerId')}</span>
                  <span className="font-mono bg-gray-50 px-3 py-1 rounded-md text-[#1a1a1a] border border-gray-200">{consumerId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-70 text-lg">{t('dueDate')}</span>
                  <span className="font-semibold text-red-600 bg-red-50 px-4 py-1 rounded-full">{billData.dueDate}</span>
                </div>
                <div className={`flex justify-between items-center pt-6 mt-6 border-t ${highContrast ? 'border-gray-700' : 'border-gray-100'}`}>
                  <span className="text-2xl opacity-90">{t('totalPayable')}</span>
                  <span className="text-4xl font-black text-[#1a1a1a]">{billData.billAmount}</span>
                </div>
              </div>
            </div>
            <button onClick={handlePayment} disabled={loading} className={btnSuccess}>
               {loading ? <div className="animate-spin w-6 h-6 border-4 border-current border-t-transparent rounded-full" /> : <CreditCard size={28} />}
              {loading ? t('fetchingDetails') : `${t('pay')} ${billData.billAmount}`}
            </button>
          </div>
        )}

        {/* Step 3: Receipt */}
        {step === 3 && billData && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500 w-full">
            <div className={`p-10 md:p-12 text-center rounded-3xl ${highContrast ? 'border-2 border-white bg-black' : 'bg-white shadow-lg border border-gray-100 relative overflow-hidden'}`}>
              {/* Decorative background element for light mode */}
              {!highContrast && <div className="absolute top-0 left-0 w-full h-32 bg-orange-500/10 -z-10 rounded-t-3xl border-b border-orange-500/20"></div>}
              
              <div className="flex justify-center mb-6 text-orange-500">
                <CheckCircle size={80} className={`${!highContrast && 'drop-shadow-sm'}`} />
              </div>
              <h3 className="text-3xl font-bold mb-3 tracking-tight">{t('paymentSuccess')}</h3>
              <p className="text-lg opacity-70 mb-8">Your account has been credited.</p>
              
              <div className={`p-6 md:p-8 text-left rounded-2xl space-y-4 text-lg ${highContrast ? 'border border-gray-700' : 'bg-[#F9F7F1] border border-gray-200'}`}>
                <div className={`flex justify-between border-b pb-3 ${highContrast ? 'border-gray-700' : 'border-gray-200'}`}>
                  <span className="opacity-70">{t('txnId')}</span>
                  <span className="font-mono font-medium">{billData.transactionId || "TXN" + Math.floor(Math.random() * 1000000)}</span>
                </div>
                <div className={`flex justify-between border-b pb-3 ${highContrast ? 'border-gray-700' : 'border-gray-200'}`}>
                  <span className="opacity-70">{t('dateTime')}</span>
                  <span className="font-medium">{new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="opacity-70">{t('amountPaid')}</span>
                  <span className="text-2xl font-bold text-orange-600">{billData.billAmount}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8">
              <button 
                onClick={() => {
                  toast.success('Printing receipt...');
                  setTimeout(() => navigate('/kiosk/gas'), 2500);
                }}
                className={`flex items-center justify-center gap-3 p-5 text-xl font-bold rounded-xl border-2 transition-colors ${highContrast ? 'border-white text-white hover:bg-white hover:text-black' : 'border-[#1a1a1a] text-[#1a1a1a] hover:bg-gray-50'}`}
              >
                <Printer size={24} />
                Print Receipt
              </button>
              <button 
                onClick={() => navigate('/kiosk/gas')}
                className={btnClass}
              >
                {t('returnMenu')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GasBillPayment;
