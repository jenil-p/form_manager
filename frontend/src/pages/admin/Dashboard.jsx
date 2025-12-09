import React, { useEffect, useState } from 'react';
import { FileText, Share2, Copy } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal'; 
import { Input } from '../../components/ui/Input';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [guestName, setGuestName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const res = await api.get('/forms');
      setForms(res.data);
    } catch (err) {
      console.error("Failed to load forms", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    try {
      const res = await api.post(`/forms/${selectedFormId}/guests`, {
        guests: [{ name: guestName, email: guestEmail }]
      });
      
      const token = res.data.links[0].token;
      const link = `${window.location.origin}/form/${token}`;
      setGeneratedLink(link);
    } catch (err) {
      alert('Failed to generate link');
    }
  };

  const openShareModal = (formId) => {
    setSelectedFormId(formId);
    setGeneratedLink('');
    setGuestName('');
    setGuestEmail('');
    setShareModalOpen(true);
  };

  return (
    <div>
      <header className="flex-between mb-8">
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your forms and responses.</p>
        </div>
        <Button onClick={() => navigate('/admin/create')}>+ Create New Form</Button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div className="card flex-between">
            <div><p className="text-gray-500 text-sm">Total Forms</p><h2 className="text-2xl font-bold">{forms.length}</h2></div>
            <FileText className="text-indigo-600" />
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Your Forms</h3>
        {loading ? <p>Loading forms...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th className="p-3">Form Name</th>
                <th className="p-3">Created Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {forms.map((form) => (
                <tr key={form._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="p-3 font-medium">{form.title}</td>
                  <td className="p-3 text-gray-500">{new Date(form.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 flex gap-2">
                    <Button variant="outline" onClick={() => openShareModal(form._id)} title="Share Form">
                      <Share2 size={16} /> Share
                    </Button>
                  </td>
                </tr>
              ))}
              {forms.length === 0 && <tr><td colSpan="3" className="p-4 text-center text-gray-400">No forms created yet.</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} title="Invite Guest">
        {!generatedLink ? (
          <div className="space-y-4">
            <Input label="Guest Name" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
            <Input label="Guest Email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} />
            <Button onClick={handleGenerateLink} className="w-full justify-center">Generate Unique Link</Button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-green-50 text-green-700 p-3 rounded-lg border border-green-200">
              Link Generated Successfully!
            </div>
            <div className="flex gap-2">
              <input readOnly value={generatedLink} className="input bg-gray-50 text-sm" />
              <Button onClick={() => navigator.clipboard.writeText(generatedLink)}>
                 <Copy size={16} />
              </Button>
            </div>
            <p className="text-xs text-gray-500">Send this link to the guest. It can only be used once.</p>
            <Button variant="outline" onClick={() => setGeneratedLink('')}>Send Another</Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;