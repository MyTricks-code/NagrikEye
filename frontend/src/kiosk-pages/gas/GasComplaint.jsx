import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, MessageSquare, AlertTriangle, CheckCircle, Upload } from 'lucide-react';
import { db } from '../../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';

const GasComplaint = () => {
  const navigate = useNavigate();
  const { highContrast, t } = useOutletContext();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [complaintId, setComplaintId] = useState('');
  const [formData, setFormData] = useState({
    consumerId: '',
    category: '',
    description: ''
  });

  const categories = [
    { id: 'leakage', label: 'Gas Leakage (Urgent)', icon: <AlertTriangle size={32} className={highContrast ? 'text-white' : 'text-red-500'} /> },
    { id: 'delay', label: 'Supply Delay', icon: <MessageSquare size={32} /> },
    { id: 'connection', label: 'Connection Issue', icon: <MessageSquare size={32} /> },
    { id: 'billing', label: 'Billing Issue', icon: <MessageSquare size={32} /> },
  ];

  const validate = () => {
    if (!formData.consumerId) return false;
    if (!formData.category) return false;
    if (!formData.description) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please complete all form fields');
      return;
    }
    setLoading(true);
    
    try {
      const generatedId = "CMP-" + Math.floor(1000 + Math.random() * 9000);
      await addDoc(collection(db, 'gasComplaints'), {
        ...formData,
        complaintId: generatedId,
        status: 'Open',
        createdAt: new Date().toISOString()
      });
      setComplaintId(generatedId);
      setStep(2);
      toast.success('Complaint Registered');
    } catch (error) {
      console.error(error);
      toast.error('Failed to register complaint');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full p-6 text-2xl rounded-xl border-4 outline-none transition-all ${highContrast ? 'bg-black text-white border-white focus:border-orange-400' : 'bg-white text-gray-900 border-gray-300 focus:border-orange-500'}`;
  const btnPrimary = `flex items-center justify-center gap-4 w-full p-6 text-2xl font-bold rounded-xl transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${highContrast ? 'bg-white text-black' : 'bg-orange-600 text-white hover:bg-orange-700'}`;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-6 mb-12">
        <button 
          onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
          className={`p-4 rounded-full ${highContrast ? 'bg-white text-black' : 'bg-gray-200 text-gray-800'}`}
        >
          <ArrowLeft size={32} />
        </button>
        <h2 className="text-4xl font-bold">{t('registerComplaint')}</h2>
      </div>

      {step === 1 && (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-8">
          <div className="space-y-4">
            <label className="text-2xl font-bold">{t('consumerId')}</label>
            <input
              type="text"
              placeholder={t('consumerId')}
              value={formData.consumerId}
              onChange={(e) => setFormData({ ...formData, consumerId: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="space-y-4">
            <label className="text-2xl font-bold">{t('complaintCategory')}</label>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.id })}
                  className={`flex flex-col items-center justify-center gap-4 p-8 rounded-xl border-4 transition-all ${
                    formData.category === cat.id 
                      ? (highContrast ? 'border-white bg-white text-black' : 'border-orange-500 bg-orange-50 text-orange-900') 
                      : (highContrast ? 'border-gray-700' : 'border-gray-200')
                  } ${cat.id === 'leakage' && formData.category !== cat.id && !highContrast ? 'bg-red-50 text-red-900 border-red-200 hover:border-red-300' : ''}`}
                >
                  {cat.icon}
                  <span className="text-xl font-bold text-center">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-2xl font-bold">{t('describeIssue')}</label>
            <textarea
              rows="3"
              placeholder="Brief description of the problem..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={inputClass}
            ></textarea>
          </div>

          <div className={`flex justify-between items-center p-6 rounded-xl border-4 border-dashed ${highContrast ? 'border-gray-500' : 'bg-gray-100 border-gray-300'}`}>
            <span className="text-xl font-bold opacity-70">Attach Image / Video (Optional)</span>
            <button type="button" onClick={() => toast.success('Camera / Scanner Activated')} className={`p-4 rounded-full transition-colors ${highContrast ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}>
              <Upload size={32} />
            </button>
          </div>

          <button type="submit" disabled={loading} className={`mt-8 ${btnPrimary}`}>
            {loading ? <div className="animate-spin w-8 h-8 border-4 border-current border-t-transparent rounded-full" /> : <MessageSquare size={32} />}
            {loading ? 'Submitting Complaint...' : t('submitComplaint')}
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
          <div className={`p-12 text-center rounded-3xl border-4 ${highContrast ? 'border-white bg-black' : 'border-orange-500 bg-orange-50'}`}>
            <div className={`flex justify-center mb-6 ${highContrast ? 'text-white' : 'text-orange-600'}`}>
              <CheckCircle size={100} />
            </div>
            <h3 className={`text-4xl font-black mb-4 ${highContrast ? 'text-white' : 'text-orange-700'}`}>Complaint Registered!</h3>
            <p className="text-2xl mb-8">Our team will assist you shortly.</p>
            
            <div className={`p-8 inline-block rounded-xl border-4 ${highContrast ? 'border-2 border-white' : 'bg-white shadow text-neutral-900 border-orange-200'}`}>
              <span className="block text-2xl opacity-70 mb-4">{t('trackingId')}</span>
              <span className="block text-5xl font-mono font-black">{complaintId}</span>
            </div>

            <p className="mt-8 text-2xl font-bold opacity-80">
              Please note down the tracking ID or take a picture of this screen.
            </p>

            <button onClick={() => navigate('/kiosk/gas')} className={`mt-12 w-full max-w-md mx-auto ${btnPrimary}`}>
               {t('returnMenu') || 'Return to Main Menu'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GasComplaint;
