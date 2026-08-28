import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, Award, HeartHandshake, EyeOff, Building2 } from 'lucide-react';

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
        }} className="trust-card-grid">
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <ShieldCheck size={20} color="var(--medical-teal)" />
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--medical-teal-dark)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                100% Private, Safe & Government Approved
              </span>
            </div>

            <h2 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 800, color: 'var(--primary-navy-dark)', marginBottom: '1rem', lineHeight: 1.25 }}>
              Your Family’s Health Data Stays Safe and in Your Hands
            </h2>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              MediSetu adheres strictly to national health safety standards (ABDM). Your medical records stay securely stored on your own device, and only the doctors you choose are allowed to view your file.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem' }}>
                <CheckCircle2 size={16} color="var(--success-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Bank-grade privacy protection</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem' }}>
                <CheckCircle2 size={16} color="var(--success-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Zero ads, zero data selling</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem' }}>
                <CheckCircle2 size={16} color="var(--success-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>You control who sees your records</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem' }}>
                <CheckCircle2 size={16} color="var(--success-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Works smoothly even without internet</span>
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

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-navy-dark)', marginBottom: '0.5rem' }}>
              Start Using MediSetu Today
            </h3>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Join thousands of families and local clinics connecting everyday healthcare.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => onOpenAuthModal('patient-register')}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Create Free Patient Account
              </button>
              <button 
                onClick={() => onOpenAuthModal('doctor-register')}
                className="btn btn-outline-teal"
                style={{ width: '100%' }}
              >
                Register as Doctor / Health Worker
              </button>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .trust-card-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
