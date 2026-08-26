import React from 'react';
import { Building, Users, ShieldCheck, Zap, Activity } from 'lucide-react';

export const StatsImpact = () => {
  const stats = [
    { value: '500+', label: 'Connected PHCs & Sub-Centres', sub: 'Across 12 Rural Districts' },
    { value: '< 2.0s', label: 'AI RAG Clinical Synthesis', sub: 'Instant Dossier Generation' },
    { value: '99.4%', label: 'Offline Mesh Uptime', sub: 'Zero Lost Patient Records' },
    { value: '14,200+', label: 'Coordinated Referrals', sub: 'From Sub-Centres to Specialists' }
  ];

  return (
    <section 
      id="about"
      style={{
        padding: '4.5rem 0',
        backgroundColor: 'var(--primary-navy)',
        color: '#ffffff',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <div className="app-container">
        
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3rem auto' }}>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', marginBottom: '0.75rem' }}>
            National Rural Health Impact
          </span>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3vw, 2.3rem)',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: '0.75rem'
          }}>
            Closing the Healthcare Divide with Measurable Results
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#cbd5e1' }}>
            Ensuring every rural citizen receives unbroken, longitudinal medical care regardless of geography.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem'
        }}>
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem 1.25rem',
                textAlign: 'center'
              }}
            >
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                color: 'var(--medical-teal-light)',
                lineHeight: 1.1,
                marginBottom: '0.5rem'
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
