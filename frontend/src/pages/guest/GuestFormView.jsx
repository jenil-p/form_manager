import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import api from '../../lib/api';

const GuestFormView = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState(null);
  const [guestName, setGuestName] = useState('');
  const [formGuestId, setFormGuestId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const loadForm = async () => {
      try {
        const res = await api.get(`/forms/token/${token}`);
        setFormData(res.data.form);
        setGuestName(res.data.guestName);
        setFormGuestId(res.data.formGuestId);
        setStatus('active');
      } catch (err) {
        const msg = err.response?.data?.message || 'Invalid Token';
        if (msg.includes('submitted')) setStatus('submitted_already');
        else setStatus('error');
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
      await api.post(`/forms/${formData._id}/response`, {
        token,
        formGuestId,
        answers
      });
      setStatus('success');
    } catch (err) {
      alert("Submission failed. Please try again.");
    }
  };

  if (status === 'loading') return <div className="flex-center h-screen">Loading secure form...</div>;
  
  if (status === 'error') return (
    <div className="flex-center h-screen flex-col">
      <h2 className="text-red-600 text-xl font-bold">Access Denied</h2>
      <p>This link is invalid or has expired.</p>
    </div>
  );

  if (status === 'submitted_already' || status === 'success') return (
    <div className="flex-center h-screen flex-col text-center p-4">
      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex-center mb-4 text-2xl">✓</div>
      <h2 className="text-2xl font-bold text-gray-800">Thank You!</h2>
      <p className="text-gray-500 mt-2">Your response has been securely recorded.</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F3F4F6', paddingTop: '60px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        
        <div className="text-center mb-8">
           <h2 style={{ fontSize: '16px', color: 'var(--text-muted)' }}>Hello, <strong>{guestName}</strong></h2>
        </div>

        <div className="card" style={{ borderTop: '8px solid var(--primary)' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>{formData.title}</h1>
          
          {formData.adminNote && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-8">
               <h4 className="text-blue-800 text-xs font-bold uppercase mb-1">Note</h4>
               <p className="text-blue-900 text-sm">{formData.adminNote}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {formData.fields.map((field) => (
              <div key={field._id} className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>

                {field.type === 'text' && (
                  <input required={field.required} className="input" onChange={e => handleInputChange(field.label, e.target.value)} />
                )}
                {field.type === 'textarea' && (
                  <textarea required={field.required} className="input" rows="3" onChange={e => handleInputChange(field.label, e.target.value)} />
                )}
                {field.type === 'number' && (
                  <input type="number" required={field.required} className="input" onChange={e => handleInputChange(field.label, e.target.value)} />
                )}
                {field.type === 'dropdown' && (
                  <select required={field.required} className="input" onChange={e => handleInputChange(field.label, e.target.value)}>
                    <option value="">Select option...</option>
                    {field.options && field.options.split(',').map(opt => (
                       <option key={opt} value={opt.trim()}>{opt.trim()}</option>
                    ))}
                  </select>
                )}
                {field.type === 'date' && (
                  <input type="date" required={field.required} className="input" onChange={e => handleInputChange(field.label, e.target.value)} />
                )}
              </div>
            ))}

            <Button type="submit" className="w-full justify-center text-lg h-12">Submit Response</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GuestFormView;