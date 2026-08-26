import React from 'react';
import { 
  Database, 
  Scan, 
  Clock, 
  Sparkles, 
  GitPullRequest, 
  HeartHandshake, 
  ShieldCheck, 
  Radio,
  Zap,
  Globe2
} from 'lucide-react';

export const FeaturesGrid = () => {
  const features = [
    {
      icon: <Database size={24} color="#0f4c81" />,
      title: 'Offline-First IndexedDB Mesh',
      desc: 'Operate seamlessly during rural blackouts. All patient profiles, prescriptions, and referral queues persist locally on the device with zero data loss.'
    },
    {
      icon: <Scan size={24} color="#0d9488" />,
      title: 'AI Neural OCR Slip Digitization',
      desc: 'Instantly convert complex handwritten doctor prescriptions and lab test slips into structured JSON with automated drug entity extraction.'
    },
    {
      icon: <Clock size={24} color="#0284c7" />,
      title: 'Unified Longitudinal Health Graph',
      desc: 'One connected record spanning Sub-Centres, PHCs, CHCs, and District Hospitals so no doctor ever works blind to past medical history.'
    },
    {
      icon: <Sparkles size={24} color="#d97706" />,
      title: 'AI RAG Clinical Synthesis',
      desc: 'Retrieval-Augmented Generation summarizes years of fragmented medical encounters into high-priority clinical trajectories and allergy alerts.'
    },
    {
      icon: <GitPullRequest size={24} color="#16a34a" />,
      title: 'Zero-Loss Referral Routing',
      desc: 'Closed-loop inter-facility referrals with triage prioritization (Routine, Priority, Emergency) and automated patient token generation.'
    },
    {
      icon: <HeartHandshake size={24} color="#dc2626" />,
      title: 'Frontline ASHA Task Coordination',
      desc: 'Empower village community health officers and ASHA workers with automated follow-up tasks, vitals tracking, and medication reminders.'
    }
  ];

  return (
    <section 
      id="services"
      style={{
        padding: '5rem 0',
        backgroundColor: 'var(--bg-page)',
        borderBottom: '1px solid var(--border-light)'
      }}
    >
      <div className="app-container">
        
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem auto' }}>
          <span className="badge badge-info" style={{ marginBottom: '0.75rem' }}>
            Core Platform Capabilities
          </span>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
            fontWeight: 800,
            color: 'var(--primary-navy-dark)',
            marginBottom: '1rem'
          }}>
            Engineered for Rural Resilience & Clinical Precision
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
            Purpose-built technologies solving the unique challenges of rural connectivity, fragmented paper prescriptions, and multi-tier public hospital referrals.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {features.map((feat, idx) => (
            <div key={idx} className="med-card interactive" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                {feat.icon}
              </div>

              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-navy-dark)', marginBottom: '0.5rem' }}>
                {feat.title}
              </h3>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
