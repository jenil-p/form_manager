import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button'; // Ensure this path is correct
import api from '../../lib/api';
import { Clock, AlertCircle } from 'lucide-react'; // Import icons

const GuestFormView = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState(null);
  const [guestName, setGuestName] = useState('');
  const [formGuestId, setFormGuestId] = useState(null);
  const [answers, setAnswers] = useState({});
  
  // States: 'loading' | 'active' | 'submitted_already' | 'expired' | 'error' | 'success'
  const [status, setStatus] = useState('loading'); 
  const [expiredFormTitle, setExpiredFormTitle] = useState(''); // Store title for the error screen

  useEffect(() => {
    const loadForm = async () => {
      try {
        const res = await api.get(`/forms/token/${token}`);
        
        // Backend now returns explicit 'status' field in some cases, or we derive it
        if (res.data.status === 'submitted') {
             setStatus('submitted_already');
        } else if (res.data.status === 'expired') {
             setExpiredFormTitle(res.data.formTitle);
             setStatus('expired');
        } else {
             setFormData(res.data.form);
             setGuestName(res.data.guestName);
             setFormGuestId(res.data.formGuestId);
             setStatus('active');
        }

      } catch (err) {
        // Handle 410 (Expired) or 403 (Submitted) if caught as errors
        const status = err.response?.status;
        const data = err.response?.data;

        if (status === 410) { // Gone / Expired
            setExpiredFormTitle(data?.formTitle || 'Form');
            setStatus('expired');
        } else if (status === 200 && data?.status === 'submitted') {
            // Sometimes axios might not throw for 200, handled in try block
            setStatus('submitted_already');
        } else {
            setStatus('error');
        }
      }
    };
    loadForm();
  }, [token]);

  const handleInputChange = (label, value) => {
    setAnswers(prev => ({ ...prev, [label]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/forms/${formData._id}/response`, { token, formGuestId, answers });
      setStatus('success');
    } catch (err) {
      alert("Submission failed. The form might have expired.");
    }
  };

  // --- RENDER STATES ---

  if (status === 'loading') return (
    <div className="h-screen w-full flex-center bg-gray-50 text-gray-400 animate-pulse">
        Checking form status...
    </div>
  );

  // 1. Success / Already Submitted View
  if (status === 'success' || status === 'submitted_already') return (
    <div className="h-screen w-full flex-center bg-gray-50">
      <div className="card text-center max-w-md w-full py-12 px-6">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex-center mx-auto mb-6 text-3xl">✓</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Response Recorded</h1>
        <p className="text-gray-500">
            {status === 'success' ? 'Thank you, your submission has been received.' : 'You have already responded to this form.'}
        </p>
      </div>
    </div>
  );

  // 2. Expired View (Beautifully styled)
  if (status === 'expired') return (
    <div className="h-screen w-full flex-center bg-gray-50 p-4">
      <div className="card text-center max-w-md w-full py-12 px-6 border-t-4 border-red-500 shadow-xl">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex-center mx-auto mb-6">
            <Clock size={40} strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Deadline Missed</h1>
        <p className="text-gray-500 mb-6">
            The form <strong>"{expiredFormTitle}"</strong> is no longer accepting responses.
        </p>
        <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-600">
            Please contact the administrator if you believe this is an error.
        </div>
      </div>
    </div>
  );

  // 3. Error View
  if (status === 'error') return (
    <div className="h-screen w-full flex-center bg-gray-50 flex-col">
       <AlertCircle size={48} className="text-red-400 mb-4" />
       <h2 className="text-xl font-bold text-gray-800">Invalid Link</h2>
       <p className="text-gray-500">This form URL is invalid or has been removed.</p>
    </div>
  );

  // 4. Active Form View (Standard)
  if (!formData) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-gray-200 text-sm text-gray-500 mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Secure Session for <strong>{guestName}</strong>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{formData.title}</h1>
          
          {/* Optional: Show Deadline to User if active */}
          {formData.expiresAt && (
             <div className="text-xs text-orange-600 font-medium mt-2 flex justify-center items-center gap-1">
                <Clock size={12} /> Deadline: {new Date(formData.expiresAt).toLocaleString()}
             </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Admin Note */}
          {formData.adminNote && (
            <div className="bg-indigo-50 p-6 border-b border-indigo-100">
              <h4 className="text-indigo-900 font-semibold mb-1">Instructions</h4>
              <p className="text-indigo-800 text-sm leading-relaxed">{formData.adminNote}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {formData.fields.map((field) => (
              <div key={field._id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <label className="block text-slate-700 font-semibold mb-3 text-lg">
                  {field.label} {field.required && <span className="text-red-400">*</span>}
                </label>

                {field.type === 'text' && <input required={field.required} className="input h-12 text-lg" onChange={e => handleInputChange(field.label, e.target.value)} placeholder="Type your answer..." />}
                {field.type === 'textarea' && <textarea required={field.required} className="input text-lg" rows="4" onChange={e => handleInputChange(field.label, e.target.value)} placeholder="Type here..." />}
                {field.type === 'number' && <input type="number" required={field.required} className="input h-12 text-lg" onChange={e => handleInputChange(field.label, e.target.value)} />}
                {field.type === 'dropdown' && (
                  <select required={field.required} className="input h-12 text-lg cursor-pointer" onChange={e => handleInputChange(field.label, e.target.value)}>
                    <option value="">Select an option...</option>
                    {field.options?.split(',').map(o => <option key={o} value={o.trim()}>{o.trim()}</option>)}
                  </select>
                )}
                {field.type === 'date' && <input type="date" required={field.required} className="input h-12 text-lg" onChange={e => handleInputChange(field.label, e.target.value)} />}
              </div>
            ))}

            <div className="pt-6">
              <Button type="submit" className="w-full h-14 text-lg shadow-lg shadow-indigo-200">Submit Response</Button>
            </div>
          </form>
        </div>
        <p className="text-center text-gray-400 text-sm mt-8">Powered by Form Banao &copy; 2024</p>
      </div>
    </div>
  );
};

export default GuestFormView;