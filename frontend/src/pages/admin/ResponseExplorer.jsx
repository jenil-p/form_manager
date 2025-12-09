import React, { useState, useEffect } from 'react';
import { ChevronRight, FileText, User, MessageSquare } from 'lucide-react';
import api from '../../lib/api';

const ResponseExplorer = () => {
  const [forms, setForms] = useState([]);
  const [responses, setResponses] = useState([]);
  
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState(null);

  useEffect(() => {
    api.get('/forms').then(res => setForms(res.data));
  }, []);

  useEffect(() => {
    if (selectedForm) {
      setResponses([]);
      setSelectedResponse(null);
      api.get(`/forms/${selectedForm._id}/responses`)
         .then(res => setResponses(res.data))
         .catch(err => console.error(err));
    }
  }, [selectedForm]);

  return (
    <div style={{ height: 'calc(100vh - 100px)', display: 'flex', gap: '20px' }}>
      
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        <div className="bg-gray-50 p-4 border-b">
          <h3 className="font-semibold text-gray-700">1. Select Form</h3>
        </div>
        <div className="overflow-y-auto">
          {forms.map(form => (
            <div 
              key={form._id}
              onClick={() => setSelectedForm(form)}
              className={`p-4 cursor-pointer border-b flex justify-between items-center hover:bg-gray-50 ${selectedForm?._id === form._id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''}`}
            >
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-gray-400" />
                <span className="font-medium text-sm">{form.title}</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', opacity: selectedForm ? 1 : 0.5 }}>
        <div className="bg-gray-50 p-4 border-b">
          <h3 className="font-semibold text-gray-700">2. Select Guest</h3>
        </div>
        <div className="overflow-y-auto">
          {selectedForm && responses.map(res => (
              <div 
                key={res.id}
                onClick={() => setSelectedResponse(res)}
                className={`p-4 cursor-pointer border-b flex justify-between items-center hover:bg-gray-50 ${selectedResponse?.id === res.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <User size={18} className="text-gray-400" />
                  <div>
                    <div className="font-medium text-sm">{res.guest.name}</div>
                    <div className="text-xs text-gray-400">{new Date(res.submittedAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            ))
          }
          {selectedForm && responses.length === 0 && <div className="p-4 text-center text-gray-400">No responses yet.</div>}
        </div>
      </div>

      <div className="card" style={{ flex: 2, overflowY: 'auto', opacity: selectedResponse ? 1 : 0.5 }}>
        {selectedResponse ? (
          <div className="p-4">
             <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xl font-bold">
                  {selectedResponse.guest.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold">{selectedResponse.guest.name}</h2>
                  <p className="text-gray-500 text-sm">{selectedResponse.guest.email}</p>
                </div>
             </div>

             <div className="space-y-6">
                {Object.entries(selectedResponse.answers).map(([question, answer]) => (
                   <div key={question}>
                      <label className="block text-sm font-medium text-gray-500 mb-1">{question}</label>
                      <div className="p-3 bg-white border rounded-md text-gray-800">{answer}</div>
                   </div>
                ))}
             </div>
          </div>
        ) : (
          <div className="flex-center h-full flex-col text-gray-400">
            <MessageSquare size={48} strokeWidth={1} className="mb-4" />
            <p>Select a guest to view their response</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ResponseExplorer;