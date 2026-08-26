import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={20} color="#16a34a" />;
      case 'warning':
        return <AlertTriangle size={20} color="#d97706" />;
      case 'urgent':
        return <AlertCircle size={20} color="#dc2626" />;
      default:
        return <Info size={20} color="#0284c7" />;
    }
  };

  const getBadgeClass = () => {
    switch (toast.type) {
      case 'success':
        return 'badge-success';
      case 'warning':
        return 'badge-warning';
      case 'urgent':
        return 'badge-urgent';
      default:
        return 'badge-info';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      maxWidth: '420px',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-medium)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      padding: '1rem 1.25rem',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.85rem',
      animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div style={{ marginTop: '2px' }}>{getIcon()}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span className={`badge ${getBadgeClass()}`} style={{ fontSize: '0.7rem' }}>
            {toast.type || 'Notification'}
          </span>
          <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--primary-navy-dark)' }}>
            {toast.title}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          {toast.message}
        </p>
      </div>
      <button 
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-subtle)',
          padding: '2px',
          display: 'flex'
        }}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};
