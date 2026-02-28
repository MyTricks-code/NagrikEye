import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, CheckCircle, Upload } from 'lucide-react';
import { db } from '../../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';

const NewGasConnection = () => {
  const navigate = useNavigate();
  const { highContrast, t } = useOutletContext();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    pincode: '',
    kycType: 'aadhaar',
    connectionType: 'LPG',
  });
  const [fileUploaded, setFileUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trackingId, setTrackingId] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep = () => {
    if (step === 1 && (!formData.name || !formData.mobile)) return false;
    if (step === 2 && (!formData.address || !formData.pincode)) return false;
    if (step === 3 && !fileUploaded) return false;
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) {
      toast.error('Please fill all required fields');
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const generatedId = "APP-GAS-" + Math.floor(100000 + Math.random() * 900000);
      await addDoc(collection(db, 'gasNewConnections'), {
        ...formData,
        applicationId: generatedId,
        status: 'Pending Review',
        createdAt: new Date().toISOString()
      });
      setTrackingId(generatedId);
      setStep(6);
      toast.success('Application Submitted Successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full p-5 md:p-6 text-xl rounded-xl border outline-none transition-all ${highContrast ? 'bg-black text-white border-white focus:border-orange-400' : 'bg-white text-gray-900 border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 shadow-sm'}`;
  const btnSuccess = `flex items-center justify-center gap-3 px-8 py-5 text-xl font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${highContrast ? 'bg-white text-black hover:bg-gray-200' : 'bg-orange-600 text-white hover:bg-orange-700 shadow-md hover:shadow-lg'}`;

  return (
    <div className="max-w-3xl mx-auto py-4 md:py-8 h-full flex flex-col">
      {step < 6 && (
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
              className={`p-4 rounded-full transition-colors ${highContrast ? 'bg-white text-black hover:bg-gray-200' : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 shadow-sm'}`}
            >
              <ArrowLeft size={28} />
            </button>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t('newConnection')}</h2>
          </div>
          <div className={`px-5 py-2 rounded-full font-medium text-sm md:text-base border ${highContrast ? 'border-white text-white' : 'border-gray-200 bg-white text-gray-600 shadow-sm'}`}>
            Step {step} of 5
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto w-full px-1">
        <div className="animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col justify-center">
          
          {/* Step 1: Personal */}
          {step === 1 && (
            <div className={`space-y-6 ${highContrast ? '' : 'bg-white p-8 md:p-10 rounded-2xl border border-gray-100 shadow-sm'}`}>
              <h3 className="text-2xl font-bold mb-2">Personal Details</h3>
              <p className="text-gray-500 mb-6 text-lg">Please enter details exactly as per your official ID.</p>
              <div className="space-y-3 mt-6">
                <label className="text-lg font-semibold opacity-90">{t('fullName')}</label>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Rahul Sharma" className={inputClass} />
              </div>
              <div className="space-y-3 mt-6">
                <label className="text-lg font-semibold opacity-90">{t('mobileNumber')}</label>
                <input name="mobile" type="tel" value={formData.mobile} onChange={handleChange} placeholder="10-digit registered number" className={inputClass} />
              </div>
            </div>
          )}

          {/* Step 2: Address */}
          {step === 2 && (
            <div className={`space-y-6 ${highContrast ? '' : 'bg-white p-8 md:p-10 rounded-2xl border border-gray-100 shadow-sm'}`}>
              <h3 className="text-2xl font-bold mb-6">Installation Address</h3>
              <div className="space-y-3">
                <label className="text-lg font-semibold opacity-90">{t('address')}</label>
                <textarea name="address" rows="3" value={formData.address} onChange={handleChange} placeholder="House No, Street name, Locality, Landmark..." className={inputClass} />
              </div>
              <div className="space-y-3 mt-6">
                <label className="text-lg font-semibold opacity-90">{t('pinCode')}</label>
                <input name="pincode" type="text" value={formData.pincode} onChange={handleChange} placeholder="6-digit area pincode" className={inputClass} />
              </div>
            </div>
          )}

          {/* Step 3: KYC */}
          {step === 3 && (
            <div className={`space-y-6 ${highContrast ? '' : 'bg-white p-8 md:p-10 rounded-2xl border border-gray-100 shadow-sm'}`}>
              <h3 className="text-2xl font-bold mb-6">{t('uploadKyc')}</h3>
              <div className="space-y-3">
                <label className="text-lg font-semibold opacity-90">Select ID Proof Type</label>
                <select name="kycType" value={formData.kycType} onChange={handleChange} className={inputClass}>
                  <option value="aadhaar">Aadhaar Card (Recommended)</option>
                  <option value="voter">Voter ID</option>
                  <option value="passport">Passport</option>
                </select>
              </div>
              <div className={`mt-8 p-10 border-2 border-dashed rounded-2xl text-center transition-all ${fileUploaded ? (highContrast ? 'border-white text-white' : 'border-orange-500 bg-orange-50 text-orange-800') : 'border-gray-300 hover:border-gray-400 bg-gray-50'}`}>
                {fileUploaded ? (
                  <div className="flex flex-col items-center justify-center gap-4">
                    <CheckCircle size={48} className={highContrast ? 'text-white' : 'text-orange-600'} />
                    <span className="text-xl font-bold">Document Successfully Scanned</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      toast.success('Scanner processing ID...');
                      setTimeout(() => setFileUploaded(true), 1500);
                    }}
                    className="flex flex-col items-center justify-center w-full gap-4 text-xl font-medium text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Upload size={48} className="opacity-60 mb-2" />
                    {t('uploadPlaceholder')}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Connection Type */}
          {step === 4 && (
            <div className={`space-y-6 ${highContrast ? '' : 'bg-white p-8 md:p-10 rounded-2xl border border-gray-100 shadow-sm'}`}>
              <h3 className="text-2xl font-bold mb-6">Connection Preference</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <button
                  onClick={() => setFormData({ ...formData, connectionType: 'LPG' })}
                  className={`p-8 rounded-2xl border-2 text-xl font-bold transition-all relative overflow-hidden ${formData.connectionType === 'LPG' ? (highContrast ? 'border-white bg-white text-black' : 'border-orange-500 bg-white text-[#1a1a1a] shadow-md') : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                >
                  <span className="relative z-10 flex flex-col items-center gap-3">
                    <span className="text-2xl">LPG Cylinder</span>
                    <span className="text-sm font-normal opacity-70">Standard cylinder delivery</span>
                  </span>
                  {!highContrast && formData.connectionType === 'LPG' && <div className="absolute inset-0 bg-orange-500/5 z-0"></div>}
                </button>
                <button
                  onClick={() => setFormData({ ...formData, connectionType: 'PNG' })}
                  className={`p-8 rounded-2xl border-2 text-xl font-bold transition-all relative overflow-hidden ${formData.connectionType === 'PNG' ? (highContrast ? 'border-white bg-white text-black' : 'border-orange-500 bg-white text-[#1a1a1a] shadow-md') : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                >
                  <span className="relative z-10 flex flex-col items-center gap-3">
                    <span className="text-2xl">PNG (Piped Gas)</span>
                    <span className="text-sm font-normal opacity-70">Direct pipeline to kitchen</span>
                  </span>
                  {!highContrast && formData.connectionType === 'PNG' && <div className="absolute inset-0 bg-orange-500/5 z-0"></div>}
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className={`space-y-6 ${highContrast ? '' : 'bg-white p-8 md:p-10 rounded-2xl border border-gray-100 shadow-sm'}`}>
              <h3 className="text-2xl font-bold mb-6">Review Information</h3>
              <div className={`p-6 rounded-xl space-y-4 text-lg ${highContrast ? 'border border-white' : 'bg-[#F9F7F1] border border-gray-200'}`}>
                <div className={`flex flex-col border-b pb-3 ${highContrast ? 'border-gray-700' : 'border-gray-200'}`}><span className="text-sm opacity-60 uppercase tracking-widest font-medium mb-1">Full Name</span><span className="font-semibold text-xl">{formData.name}</span></div>
                <div className={`flex flex-col border-b pb-3 ${highContrast ? 'border-gray-700' : 'border-gray-200'}`}><span className="text-sm opacity-60 uppercase tracking-widest font-medium mb-1">Mobile</span><span className="font-semibold text-xl">{formData.mobile}</span></div>
                <div className={`flex flex-col border-b pb-3 ${highContrast ? 'border-gray-700' : 'border-gray-200'}`}><span className="text-sm opacity-60 uppercase tracking-widest font-medium mb-1">Installation Address</span><span className="font-semibold text-xl">{formData.address}, {formData.pincode}</span></div>
                <div className="flex flex-col"><span className="text-sm opacity-60 uppercase tracking-widest font-medium mb-1">Service Type</span><span className="font-semibold text-xl">{formData.connectionType}</span></div>
              </div>
            </div>
          )}

          {/* Step 6: Success */}
          {step === 6 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
               <div className={`p-12 w-full max-w-2xl rounded-3xl ${highContrast ? 'border border-white bg-black' : 'bg-white shadow-xl border border-gray-100 relative overflow-hidden'}`}>
                 {!highContrast && <div className="absolute top-0 left-0 w-full h-32 bg-orange-500/10 -z-10 rounded-t-3xl border-b border-orange-500/20"></div>}
                 
                 <div className="flex justify-center text-orange-500 mb-8"><CheckCircle size={80} /></div>
                 <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Application Submitted!</h2>
                 <p className="text-lg opacity-70 mb-10">Your request is now under review by our department.</p>
                 
                 <div className={`p-8 inline-block rounded-2xl w-full mb-8 ${highContrast ? 'border border-white bg-black' : 'bg-orange-50 border border-orange-200 text-[#1a1a1a]'}`}>
                   <span className="block text-sm uppercase font-bold tracking-widest opacity-60 mb-2 text-orange-800">{t('applicationId')}</span>
                   <span className="block text-3xl font-mono font-bold text-orange-900">{trackingId}</span>
                 </div>

                 <p className="text-sm font-medium opacity-80 mb-10 max-w-sm mx-auto">
                   Please note down this ID or take a picture of the screen to track your application status later.
                 </p>

                 <button onClick={() => navigate('/kiosk/gas')} className={`w-full max-w-md mx-auto ${btnSuccess}`}>
                   {t('returnMenu') || 'Return to Main Menu'}
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Footer (Steps 1-5) */}
      {step < 6 && (
        <div className="mt-8 pt-6">
          {step < 5 ? (
            <button onClick={handleNext} className={`ml-auto ${btnSuccess} w-auto px-10`}>
              Next Step <ArrowRight size={24} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className={`w-full md:w-auto md:ml-auto ${btnSuccess} px-10`}>
              {loading ? <div className="animate-spin w-6 h-6 border-4 border-current border-t-transparent rounded-full" /> : <CheckCircle size={24} />}
              {loading ? 'Submitting...' : 'Confirm & Submit Application'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NewGasConnection;
