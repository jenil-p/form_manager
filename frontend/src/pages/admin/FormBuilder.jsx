import React, { useState } from 'react';
import { Trash2, Plus, Save, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useNavigate } from 'react-router-dom';
import { IoSettingsOutline } from "react-icons/io5";
import api from '../../lib/api';

const FormBuilder = () => {
  const navigate = useNavigate();
  const [formTitle, setFormTitle] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [fields, setFields] = useState([
    { id: Date.now(), label: '', type: 'text', required: false, options: '' }
  ]);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const addField = () => setFields([...fields, { id: Date.now() + Math.random(), label: '', type: 'text', required: false, options: '' }]);
  const removeField = (id) => fields.length > 1 && setFields(fields.filter(f => f.id !== id));
  const updateField = (id, key, value) => setFields(fields.map(f => (f.id === id ? { ...f, [key]: value } : f)));
  const handleSave = async () => {
    if (!formTitle.trim()) return alert("Title required");
    try {
      const formData = {
        title: formTitle,
        adminNote: adminNote,
        expiresAt: expiresAt || null,
        fields: fields.map(f => ({ ...f, options: f.options }))
      };
      await api.post('/forms', formData);
      navigate('/admin');
    } catch (e) { alert('Error'); }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '60px' }}>

      {/* Header */}
      <div className="flex-between mb-8 sticky top-0 bg-white/80 backdrop-blur z-10 py-4 border-b border-gray-100 -mx-4 px-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Form Editor</h1>
          <p className="text-sm text-gray-500">Design your data collection form.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsPreviewOpen(true)}><Eye size={18} /> Preview</Button>
          <Button onClick={handleSave}><Save size={18} /> Publish</Button>
        </div>
      </div>

      {/* Meta Card */}
      <div className="card mb-8 border-l-4 border-l-indigo-500">
        <div className="flex items-center gap-2 mb-4 text-indigo-700">
          <IoSettingsOutline size={20} />
          <h3 className="font-semibold text-lg m-0">Configuration</h3>
        </div>
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Form Title" placeholder="e.g. Employee Feedback Q3" value={formTitle} onChange={e => setFormTitle(e.target.value)} />
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">Form Expiry (Optional)</label>
              <input
                type="datetime-local"
                className="input"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
              {/* <p className="text-xs text-gray-400 mt-1">Guests cannot submit after this time.</p> */}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Guest Instructions (Optional)</label>
            <textarea className="input" rows="3" placeholder="Notes shown to the user..." value={adminNote} onChange={e => setAdminNote(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Fields List */}
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="card relative group transition-all hover:border-indigo-300">
            <div className="flex gap-4 items-start">
              <div className="flex-1 grid gap-4">
                <div className="flex gap-4">
                  <div className="grow">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Question Label</label>
                    <input className="input border-transparent bg-gray-50 focus:bg-white focus:border-indigo-500 font-medium"
                      value={field.label} onChange={e => updateField(field.id, 'label', e.target.value)}
                      placeholder="Type your question here..." autoFocus={index === fields.length - 1} />
                  </div>
                  <div className="w-1/3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Input Type</label>
                    <select className="input" value={field.type} onChange={e => updateField(field.id, 'type', e.target.value)}>
                      <option value="text">Short Text</option>
                      <option value="textarea">Paragraph</option>
                      <option value="number">Number</option>
                      <option value="dropdown">Dropdown</option>
                      <option value="date">Date</option>
                    </select>
                  </div>
                </div>

                {(field.type === 'dropdown' || field.type === 'multiselect') && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <label className="text-xs font-bold text-yellow-700 uppercase mb-1 block">Dropdown Options</label>
                    <input className="input border-yellow-200" placeholder="Option 1, Option 2, Option 3"
                      value={field.options} onChange={e => updateField(field.id, 'options', e.target.value)} />
                  </div>
                )}

                <div className="flex items-center gap-4 pt-2 border-t border-gray-50">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" checked={field.required} onChange={e => updateField(field.id, 'required', e.target.checked)} />
                    <span className="text-sm font-medium text-gray-600">Required Field</span>
                  </label>
                </div>
              </div>

              <button onClick={() => removeField(field.id)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={addField} className="w-full mt-6 py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-semibold flex-center gap-2 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
        <Plus size={20} /> Add Next Question
      </button>

      
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Guest View Preview"
      >
        <div style={{ pointerEvents: 'none' }}>
          <div style={{ borderBottom: '4px solid var(--primary)', paddingBottom: '20px', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
              {formTitle || "Untitled Form"}
            </h1>
            {adminNote && (
              <div style={{ background: '#EFF6FF', borderLeft: '4px solid #3B82F6', padding: '12px', borderRadius: '4px', marginTop: '16px' }}>
                <h4 style={{ margin: '0 0 4px 0', color: '#1E40AF', fontSize: '12px', fontWeight: 'bold' }}>ADMIN NOTE</h4>
                <p style={{ margin: 0, color: '#1E3A8A', fontSize: '14px' }}>{adminNote}</p>
              </div>
            )}
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            {fields.map((field) => (
              <div key={field.id} className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  {field.label || "Untitled Question"}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {field.type === 'text' && <input className="input" placeholder="Short answer text" disabled />}

                {field.type === 'textarea' && <textarea className="input" rows="3" placeholder="Long answer text" disabled />}

                {field.type === 'number' && <input type="number" className="input" placeholder="0" disabled />}

                {field.type === 'date' && <input type="date" className="input" disabled />}

                {(field.type === 'dropdown' || field.type === 'multiselect') && (
                  <select className="input" disabled>
                    <option>Select an option...</option>
                    {field.options.split(',').map((opt, i) => (
                      opt.trim() && <option key={i}>{opt.trim()}</option>
                    ))}
                  </select>
                )}
              </div>
            ))}
            <Button className="w-full justify-center" disabled>Submit Response</Button>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default FormBuilder;