import React, { useState } from 'react';
import { Trash2, Plus, GripVertical, Save, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

const FormBuilder = () => {
  const navigate = useNavigate();
  const [formTitle, setFormTitle] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [fields, setFields] = useState([
    { id: Date.now(), label: '', type: 'text', required: false, options: '' }
  ]);
  
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const addField = () => {
    setFields([...fields, { id: Date.now() + Math.random(), label: '', type: 'text', required: false, options: '' }]);
  };

  const removeField = (id) => {
    if (fields.length === 1) return;
    setFields(fields.filter(f => f.id !== id));
  };

  const updateField = (id, key, value) => {
    setFields(fields.map(f => (f.id === id ? { ...f, [key]: value } : f)));
  };

  const handleSave = async () => {
    if (!formTitle.trim()) return alert("Please enter a form title");

    const formData = {
      title: formTitle,
      adminNote: adminNote,
      fields: fields.map(f => ({
        ...f,
        options: f.options 
      }))
    };
    try {
      await api.post('/forms', formData);
      alert("Form Created Successfully!");
      navigate('/admin');
    } catch (err) {
      console.error(err);
      alert("Error saving form");
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
      
      <div className="flex-between mb-8">
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Create New Form</h1>
          <p style={{ color: 'var(--text-muted)' }}>Design your form structure and settings.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="outline" onClick={() => setIsPreviewOpen(true)}>
            <Eye size={18} /> Preview
          </Button>
          <Button onClick={handleSave}><Save size={18} /> Publish Form</Button>
        </div>
      </div>

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


      <div className="card mb-8">
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>General Settings</h3>
        <Input 
          label="Form Title" 
          placeholder="e.g. Employee Satisfaction Survey" 
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
        />
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">Admin Note</label>
          <textarea 
            className="input" 
            rows="3" 
            placeholder="Enter instructions..."
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-between mb-4">
         <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Form Fields</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {fields.map((field, index) => (
          <div key={field.id} className="card" style={{ display: 'flex', gap: '16px', alignItems: 'start', padding: '20px', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ marginTop: '12px', color: '#D1D5DB' }}><GripVertical size={20} /></div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 2 }}>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Question</label>
                  <input className="input" value={field.label} onChange={(e) => updateField(field.id, 'label', e.target.value)} placeholder="Enter question..." />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Type</label>
                  <select className="input" value={field.type} onChange={(e) => updateField(field.id, 'type', e.target.value)}>
                    <option value="text">Short Text</option>
                    <option value="textarea">Paragraph</option>
                    <option value="number">Number</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="date">Date</option>
                  </select>
                </div>
              </div>
              
              {(field.type === 'dropdown' || field.type === 'multiselect') && (
                <div className="mb-4 bg-gray-50 p-3 rounded-md border border-gray-200">
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Options</label>
                   <input className="input" placeholder="Option 1, Option 2" value={field.options} onChange={(e) => updateField(field.id, 'options', e.target.value)} style={{ background: 'white', fontSize: '14px' }} />
                </div>
              )}

              <div className="flex items-center gap-2">
                <input type="checkbox" checked={field.required} onChange={(e) => updateField(field.id, 'required', e.target.checked)} />
                <label className="text-sm text-gray-600">Required</label>
              </div>
            </div>

            <button onClick={() => removeField(field.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={18} /></button>
          </div>
        ))}
        
        <button onClick={addField} style={{ width: '100%', padding: '16px', border: '2px dashed var(--border)', borderRadius: '12px', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <Plus size={20} /> Add New Question
        </button>
      </div>

    </div>
  );
};

export default FormBuilder;