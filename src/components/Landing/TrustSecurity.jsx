import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, Award, HeartHandshake, EyeOff } from 'lucide-react';

export const TrustSecurity = ({ onOpenAuthModal }) => {
  return (
    <section 
      style={{
        padding: '5rem 0',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-light)'
      }}
    >
      <div className="app-container">
        
        <div style={{
          background: 'linear-gradient(135deg, var(--bg-page) 0%, #f0fdfa 100%)',
          border: '1px solid var(--medical-teal-light)',
          borderRadius: 'var(--radius-xl)',
          padding: '3rem 2.5rem',
          boxShadow: 'var(--shadow-md)',
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '2.5rem',
          alignItems: 'center'
        }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <ShieldCheck size={20} color="var(--medical-teal)" />
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--medical-teal-dark)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ABDM Compliant & End-to-End Encrypted
              </span>
            </div>

            <h2 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 800, color: 'var(--primary-navy-dark)', marginBottom: '1rem' }}>
              Trust, Privacy & Ethical AI at Every Touchpoint
            </h2>

            <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              MediSetu AI adheres strictly to the Ayushman Bharat Digital Mission (ABDM) guidelines. Patient clinical data remains encrypted on client devices, with explicit patient consent required for specialist access.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem' }}>
                <CheckCircle2 size={16} color="var(--success-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>AES-256 Client-Side Storage in IndexedDB</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem' }}>
                <CheckCircle2 size={16} color="var(--success-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>No Third-Party Tracker or Advertising</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem' }}>
                <CheckCircle2 size={16} color="var(--success-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Role-Based Access Control (RBAC)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem' }}>
                <CheckCircle2 size={16} color="var(--success-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Zero-Latency Offline Synchronization</span>
              </div>
            </div>
          </div>

          {/* RIGHT CTA BOX */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'var(--medical-teal-subtle)',
              color: 'var(--medical-teal)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Award size={26} />
            </div>

            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy-dark)', marginBottom: '0.5rem' }}>
              Connect Your Facility Today
            </h3>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Join hundreds of PHCs and District Hospitals bridging the rural continuum of care.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => onOpenAuthModal('patient-register')}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Register as Patient
              </button>
              <button 
                onClick={() => onOpenAuthModal('doctor-register')}
                className="btn btn-outline-teal"
                style={{ width: '100%' }}
              >
                Register as Healthcare Officer
              </button>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: 1.2fr 0.8fr"] {
            gridTemplateColumns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
