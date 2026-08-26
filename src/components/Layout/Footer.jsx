import React from 'react';
import { Activity, PhoneCall, ShieldCheck, Heart, MapPin, Globe, ExternalLink } from 'lucide-react';

export const Footer = ({ onNavigate }) => {
  return (
    <footer style={{
      backgroundColor: 'var(--primary-navy-dark)',
      color: '#ffffff',
      paddingTop: '3.5rem',
      paddingBottom: '2rem',
      marginTop: 'auto',
      borderTop: '4px solid var(--medical-teal)'
    }}>
      <div className="app-container">
        
        {/* TOP ROW: BRAND & EMERGENCY HELPLINES */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2.5rem',
          paddingBottom: '3rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
        }}>
          
          {/* BRAND SUMMARY */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--medical-teal)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Activity size={20} strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                MediSetu <span style={{ color: 'var(--medical-teal-light)' }}>AI</span>
              </span>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              «One connected healthcare record, from village to specialist.» Empowering rural frontline workers, primary health centres, and district hospitals with offline-first digital continuity and AI clinical intelligence.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#94a3b8' }}>
              <ShieldCheck size={16} color="var(--medical-teal-light)" />
              <span>Ayushman Bharat Digital Mission (ABDM) Aligned</span>
            </div>
          </div>

          {/* 24x7 RURAL EMERGENCY HELPLINES */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#f87171' }}>
              <PhoneCall size={18} />
              <h4 style={{ color: '#ffffff', fontSize: '0.95rem', margin: 0 }}>
                24x7 Rural Emergency & Helplines
              </h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '0.4rem' }}>
                <span style={{ color: '#cbd5e1' }}>National Ambulance Service:</span>
                <strong style={{ color: '#fca5a5' }}>108</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '0.4rem' }}>
                <span style={{ color: '#cbd5e1' }}>Health Advice & Tele-Triage:</span>
                <strong style={{ color: '#93c5fd' }}>104</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '0.4rem' }}>
                <span style={{ color: '#cbd5e1' }}>Maternal & Child Tracking:</span>
                <strong style={{ color: '#86efac' }}>1800-180-1104</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#cbd5e1' }}>Tele-MANAS Mental Health:</span>
                <strong style={{ color: '#fde047' }}>14416</strong>
              </div>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '1rem' }}>
              Connected Platform Tiers
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <li>
                <a href="#subcentres" style={{ color: '#cbd5e1' }}>Village Ayushman Arogya Mandirs (Sub-Centres)</a>
              </li>
              <li>
                <a href="#phc" style={{ color: '#cbd5e1' }}>Primary Health Centres (PHCs)</a>
              </li>
              <li>
                <a href="#chc" style={{ color: '#cbd5e1' }}>Community Health Centres (CHCs)</a>
              </li>
              <li>
                <a href="#district" style={{ color: '#cbd5e1' }}>District Hospitals & Trauma Units</a>
              </li>
              <li>
                <a href="#specialist" style={{ color: '#cbd5e1' }}>Tertiary Medical Colleges & Tele-Consultation</a>
              </li>
            </ul>
          </div>

          {/* STANDARDS & PUBLIC SERVICE */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '1rem' }}>
              Public Health Integrity
            </h4>
            <p style={{ fontSize: '0.8125rem', color: '#94a3b8', lineHeight: '1.6' }}>
              Built for high latency and offline connectivity in remote areas. Data stored on client devices using IndexedDB with cryptographic synchronization when cell networks reconnect.
            </p>
            <div style={{
              marginTop: '1rem',
              display: 'inline-block',
              padding: '0.4rem 0.75rem',
              background: 'rgba(13, 148, 136, 0.2)',
              border: '1px solid var(--medical-teal)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              color: '#5eead4'
            }}>
              ✓ Zero Data Loss Offline Engine
            </div>
          </div>

        </div>

        {/* BOTTOM ROW: COPYRIGHT */}
        <div style={{
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8125rem',
          color: '#94a3b8'
        }}>
          <div>
            © {new Date().getFullYear()} MediSetu AI Platform. Dedicated to Indian Rural Healthcare Continuity.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span>Privacy Policy</span>
            <span>ABHA Security Architecture</span>
            <span>Terms of Clinical Use</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
