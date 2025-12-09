import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div className="card" style={{ 
        width: '100%', maxWidth: '600px', maxHeight: '90vh', 
        overflowY: 'auto', padding: '0', position: 'relative',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Header */}
        <div className="flex-between" style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {children}
        </div>
        
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};