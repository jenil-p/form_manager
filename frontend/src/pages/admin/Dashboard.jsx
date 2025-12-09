import React, { useEffect, useState } from 'react';
import { FileText, Share2, Copy, BarChart3, Users } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="card flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <h2 className="text-3xl font-bold text-slate-800">{value}</h2>
    </div>
    <div className={`p-3 rounded-full ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
  </div>
);

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
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleGenerateLink = async () => {
    try {
      const res = await api.post(`/forms/${selectedFormId}/guests`, {
        guests: [{ name: guestName, email: guestEmail }]
      });
      const token = res.data.links[0].token;
      setGeneratedLink(`${window.location.origin}/form/${token}`);
    } catch (err) { alert('Error generating link'); }
  };

  const openShareModal = (formId) => {
    setSelectedFormId(formId);
    setGeneratedLink('');
    setGuestName('');
    setGuestEmail('');
    setShareModalOpen(true);
  };

  const getFormStatus = (expiryDate) => {
    if (!expiryDate) return { label: 'Active', color: 'bg-green-100 text-green-700' };
    const isExpired = new Date(expiryDate) < new Date();
    return isExpired
      ? { label: 'Expired', color: 'bg-red-100 text-red-700' }
      : { label: 'Active', color: 'bg-green-100 text-green-700' };
  };

  return (
    <div>
      <header className="flex-between mb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, here is what's happening.</p>
        </div>
        <Button onClick={() => navigate('/admin/create')}>+ Create New Form</Button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        <StatCard label="Total Forms" value={forms.length} icon={FileText} color="bg-indigo-500" />
        <StatCard label="Total Responses" value="-" icon={BarChart3} color="bg-emerald-500" />
        <StatCard label="Active Guests" value="-" icon={Users} color="bg-amber-500" />
      </div>

      {/* Table Section */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-semibold text-slate-800 m-0">Recent Forms</h3>
        </div>

        {loading ? <div className="p-8 text-center text-gray-500">Loading...</div> : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-semibold text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                <th className="p-4 pl-6">Form Title</th>
                <th className="p-4">Created</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {forms.map((form) => {
                const status = getFormStatus(form.expiresAt);
                return (
                <tr key={form._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 pl-6 font-medium text-slate-700">{form.title}</td>
                  <td className="p-4 text-gray-500 text-sm">
                    {new Date(form.createdAt).toLocaleDateString()}
                    {form.expiresAt && <div className="text-xs text-red-400">Exp: {new Date(form.expiresAt).toLocaleDateString()}</div>}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="p-4 text-right pr-6">
                    <Button variant="outline" onClick={() => openShareModal(form._id)} className="text-xs h-8">
                      <Share2 size={14} /> Invite
                    </Button>
                  </td>
                </tr>
              )})}
              {forms.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-gray-400">No forms found. Create one above!</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      {/* Share Modal */}
      <Modal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} title="Invite Guest">
        {!generatedLink ? (
          <div className="flex flex-col gap-4">
            <Input label="Guest Name" placeholder="e.g. John Doe" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
            <Input label="Guest Email" placeholder="john@example.com" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} />
            <div className="mt-4">
              <Button onClick={handleGenerateLink} className="w-full">Generate Secure Link</Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 mb-6">
              <p className="font-semibold mb-1">Link Generated!</p>
              <p className="text-sm opacity-90">This token is unique to {guestEmail}</p>
            </div>
            <div className="flex gap-2 mb-6">
              <input readOnly value={generatedLink} className="input bg-gray-50 text-sm font-mono text-gray-600" />
              <Button onClick={() => navigator.clipboard.writeText(generatedLink)} variant="outline">
                <Copy size={16} />
              </Button>
            </div>
            <Button variant="outline" onClick={() => setGeneratedLink('')} className="w-full">Create Another Invite</Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;