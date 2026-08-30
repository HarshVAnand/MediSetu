import React, { useState } from 'react';
import { X, QrCode, ShieldCheck, Check, Copy } from 'lucide-react';

export const QRModal = ({ isOpen, onClose, patient, mode = 'show' }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const abhaId = patient?.abhaId || 'ABHA-91-8452-3310-4491';

  const handleCopy = () => {
    navigator.clipboard.writeText(abhaId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', textAlign: 'center' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <QrCode size={20} color="var(--primary-navy)" />
            <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Digital Health Card</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1rem 0' }}>
          {/* Card Header Frame */}
          <div style={{
            background: 'linear-gradient(135deg, #0f4c81 0%, #0d9488 100%)',
            color: '#fff',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            textAlign: 'left',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.08em', fontWeight: 700, textTransform: 'uppercase' }}>
                Digital Health Card
              </span>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', fontSize: '0.65rem' }}>
                VERIFIED
              </span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              {patient?.name || 'Rameshwar Gowda'}
            </div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.5rem' }}>
              Age: {patient?.age || 58} Yrs • Gender: {patient?.gender || 'Male'} • Blood: {patient?.bloodGroup || 'B+'}
            </div>
            <div style={{
              fontFamily: 'monospace',
              background: 'rgba(0,0,0,0.25)',
              padding: '0.4rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>{abhaId}</span>
              <button 
                onClick={handleCopy}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                title="Copy Health Number"
              >
                {copied ? <Check size={14} color="#86efac" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          {/* QR Code Illustration */}
          <div style={{
            background: '#ffffff',
            border: '2px dashed var(--medical-teal)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            display: 'inline-block',
            marginBottom: '1.25rem'
          }}>
            <svg width="180" height="180" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Corner position markers */}
              <rect x="5" y="5" width="26" height="26" rx="4" fill="#0f4c81" />
              <rect x="9" y="9" width="18" height="18" rx="2" fill="#ffffff" />
              <rect x="13" y="13" width="10" height="10" rx="1" fill="#0d9488" />

              <rect x="69" y="5" width="26" height="26" rx="4" fill="#0f4c81" />
              <rect x="73" y="9" width="18" height="18" rx="2" fill="#ffffff" />
              <rect x="77" y="13" width="10" height="10" rx="1" fill="#0d9488" />

              <rect x="5" y="69" width="26" height="26" rx="4" fill="#0f4c81" />
              <rect x="9" y="73" width="18" height="18" rx="2" fill="#ffffff" />
              <rect x="13" y="77" width="10" height="10" rx="1" fill="#0d9488" />

              {/* Data blocks */}
              <rect x="36" y="8" width="6" height="6" fill="#0f4c81" />
              <rect x="46" y="8" width="6" height="6" fill="#0d9488" />
              <rect x="56" y="8" width="6" height="6" fill="#0f4c81" />
              
              <rect x="36" y="18" width="6" height="6" fill="#0d9488" />
              <rect x="46" y="18" width="6" height="6" fill="#0f4c81" />
              <rect x="56" y="18" width="6" height="6" fill="#0d9488" />

              <rect x="36" y="28" width="6" height="6" fill="#0f4c81" />
              <rect x="46" y="28" width="6" height="6" fill="#0d9488" />
              <rect x="56" y="28" width="6" height="6" fill="#0f4c81" />

              <rect x="8" y="36" width="6" height="6" fill="#0d9488" />
              <rect x="18" y="36" width="6" height="6" fill="#0f4c81" />
              <rect x="28" y="36" width="6" height="6" fill="#0d9488" />
              <rect x="38" y="36" width="6" height="6" fill="#0f4c81" />
              <rect x="48" y="36" width="6" height="6" fill="#0d9488" />
              <rect x="58" y="36" width="6" height="6" fill="#0f4c81" />
              <rect x="68" y="36" width="6" height="6" fill="#0d9488" />
              <rect x="78" y="36" width="6" height="6" fill="#0f4c81" />
              <rect x="88" y="36" width="6" height="6" fill="#0d9488" />

              <rect x="8" y="46" width="6" height="6" fill="#0f4c81" />
              <rect x="28" y="46" width="6" height="6" fill="#0f4c81" />
              <rect x="48" y="46" width="6" height="6" fill="#0f4c81" />
              <rect x="68" y="46" width="6" height="6" fill="#0f4c81" />
              <rect x="88" y="46" width="6" height="6" fill="#0f4c81" />

              <rect x="8" y="56" width="6" height="6" fill="#0d9488" />
              <rect x="18" y="56" width="6" height="6" fill="#0d9488" />
              <rect x="38" y="56" width="6" height="6" fill="#0d9488" />
              <rect x="58" y="56" width="6" height="6" fill="#0d9488" />
              <rect x="78" y="56" width="6" height="6" fill="#0d9488" />

              <rect x="36" y="68" width="6" height="6" fill="#0f4c81" />
              <rect x="46" y="68" width="6" height="6" fill="#0d9488" />
              <rect x="56" y="68" width="6" height="6" fill="#0f4c81" />
              <rect x="68" y="68" width="6" height="6" fill="#0d9488" />
              <rect x="88" y="68" width="6" height="6" fill="#0f4c81" />

              <rect x="36" y="78" width="6" height="6" fill="#0d9488" />
              <rect x="46" y="78" width="6" height="6" fill="#0f4c81" />
              <rect x="56" y="78" width="6" height="6" fill="#0d9488" />
              <rect x="78" y="78" width="6" height="6" fill="#0d9488" />

              <rect x="36" y="88" width="6" height="6" fill="#0f4c81" />
              <rect x="46" y="88" width="6" height="6" fill="#0d9488" />
              <rect x="56" y="88" width="6" height="6" fill="#0f4c81" />
              <rect x="68" y="88" width="6" height="6" fill="#0f4c81" />
              <rect x="88" y="88" width="6" height="6" fill="#0d9488" />
            </svg>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>
            Show this QR card to your doctor or clinic to share your medical history in 2 seconds.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--success-green)' }}>
            <ShieldCheck size={14} />
            <span>100% Private & Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
};
