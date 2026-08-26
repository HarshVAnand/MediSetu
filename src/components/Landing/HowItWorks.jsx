import React, { useState } from 'react';
import { 
  Scan, 
  FileText, 
  Stethoscope, 
  GitBranch, 
  HeartHandshake, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Database,
  ShieldCheck
} from 'lucide-react';

export const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 'step-1',
      number: '01',
      title: 'Village Sub-Centre & ASHA Digitization',
      role: 'Frontline Worker / ANM',
      location: 'Ayushman Arogya Mandir (Village)',
      tagline: 'Paper slips turned into structured digital ABHA records',
      desc: 'ASHA workers and ANMs capture photos of handwritten doctor slips, lab slips, and immunization cards. The built-in AI OCR engine detects handwritten text, extracts drug names and dosages, and stores everything in IndexedDB even during full offline blackouts.',
      keyFeatures: [
        'Works 100% offline without cellular coverage',
        'AI OCR handwriting detection with confidence scoring',
        'Automatic ABHA ID linking & local sync queueing'
      ],
      badgeColor: 'badge-teal'
    },
    {
      id: 'step-2',
      number: '02',
      title: 'Primary Health Centre (PHC) Consultation',
      role: 'Medical Officer (MBBS)',
      location: 'Kolar Sub-Divisional PHC',
      tagline: 'Longitudinal timeline view with zero missing history',
      desc: 'When the patient visits the PHC, the Medical Officer scans the patient ABHA QR code and immediately views a complete, chronological timeline of previous screenings, blood pressures, and prescriptions across all village sub-centres.',
      keyFeatures: [
        'Instant chronological timeline with drug allergy alerts',
        'Structured digital e-prescription builder',
        'Automatic drug-drug interaction contraindication checks'
      ],
      badgeColor: 'badge-info'
    },
    {
      id: 'step-3',
      number: '03',
      title: 'Inter-Tier Referral & Specialist AI RAG',
      role: 'District Hospital Specialist',
      location: 'SNR District Hospital & Trauma Centre',
      tagline: '2-Second AI clinical dossier synthesis for specialists',
      desc: 'When complex cases require specialist cardiology or obstetrics care, an inter-tier referral is initiated with digital clinical notes. The specialist at the District Hospital receives an AI RAG summary synthesizing 3 years of fragmented tests in seconds.',
      keyFeatures: [
        'Triage priority tagging (Normal, Priority, Emergency)',
        'AI RAG synthesized clinical dossier & vital trajectory',
        'Eliminates duplicate expensive tests & saves patient travel time'
      ],
      badgeColor: 'badge-success'
    },
    {
      id: 'step-4',
      number: '04',
      title: 'Closed-Loop Community Follow-up',
      role: 'Village ASHA Worker & Patient',
      location: 'Patient Household (Village)',
      tagline: 'Continuous monitoring ensures no patient is lost to follow-up',
      desc: 'Post-consultation instructions, dosage schedules, and BP monitoring tasks are automatically delegated back to the patient assigned village ASHA worker. Patients receive medication reminders in their regional languages.',
      keyFeatures: [
        'Automated task delegation to village ASHA workers',
        'Medication reminder timetable (Morning/Afternoon/Night)',
        'Multi-lingual AI Health Assistant for patient queries'
      ],
      badgeColor: 'badge-warning'
    }
  ];

  return (
    <section 
      id="how-it-works"
      style={{
        padding: '5rem 0',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-light)'
      }}
    >
      <div className="app-container">
        
        {/* SECTION HEADER */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'var(--medical-teal-subtle)',
            border: '1px solid #99f6e4',
            padding: '0.3rem 0.8rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            color: 'var(--medical-teal-dark)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.75rem'
          }}>
            <GitBranch size={13} />
            <span>End-to-End Continuity Workflow</span>
          </div>

          <h2 style={{
            fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
            fontWeight: 800,
            color: 'var(--primary-navy-dark)',
            marginBottom: '1rem'
          }}>
            How MediSetu AI Connects the Continuum of Care
          </h2>
          
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            From remote rural households to district tertiary facilities — discover how our 4-stage connected architecture preserves patient history and streamlines referrals.
          </p>
        </div>

        {/* STEP PROGRESS NAVIGATION */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem'
        }}>
          {steps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              style={{
                background: activeStep === idx ? 'var(--primary-navy)' : 'var(--bg-page)',
                color: activeStep === idx ? '#ffffff' : 'var(--text-main)',
                border: `1px solid ${activeStep === idx ? 'var(--primary-navy)' : 'var(--border-light)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem 1rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all var(--transition-normal)',
                boxShadow: activeStep === idx ? 'var(--shadow-md)' : 'none',
                position: 'relative'
              }}
            >
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: activeStep === idx ? 'var(--medical-teal-light)' : 'var(--text-subtle)',
                marginBottom: '0.35rem'
              }}>
                STAGE {step.number}
              </div>
              <div style={{
                fontSize: '0.9375rem',
                fontWeight: 700,
                lineHeight: 1.3
              }}>
                {step.title}
              </div>
              
              {activeStep === idx && (
                <div style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '16px',
                  height: '8px',
                  backgroundColor: 'var(--primary-navy)',
                  clipPath: 'polygon(50% 100%, 0 0, 100% 0)'
                }} />
              )}
            </button>
          ))}
        </div>

        {/* ACTIVE STEP CARD */}
        <div className="med-card" style={{
          background: 'linear-gradient(180deg, #ffffff 0%, var(--bg-page) 100%)',
          padding: '2.5rem',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '2.5rem',
            alignItems: 'center'
          }}>
            
            {/* LEFT DETAILS */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span className={`badge ${steps[activeStep].badgeColor}`} style={{ fontSize: '0.75rem' }}>
                  {steps[activeStep].role}
                </span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)', fontWeight: 500 }}>
                  📍 {steps[activeStep].location}
                </span>
              </div>

              <h3 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary-navy-dark)', marginBottom: '0.5rem' }}>
                {steps[activeStep].title}
              </h3>

              <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--medical-teal)', marginBottom: '1.25rem' }}>
                «{steps[activeStep].tagline}»
              </div>

              <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                {steps[activeStep].desc}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {steps[activeStep].keyFeatures.map((feat, fidx) => (
                  <div key={fidx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.875rem' }}>
                    <CheckCircle2 size={18} color="var(--medical-teal)" style={{ flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT INTERACTIVE ILLUSTRATION */}
            <div style={{
              background: '#ffffff',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-md)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--medical-teal-subtle)',
                color: 'var(--medical-teal)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                {activeStep === 0 && <Scan size={32} />}
                {activeStep === 1 && <Stethoscope size={32} />}
                {activeStep === 2 && <Sparkles size={32} />}
                {activeStep === 3 && <HeartHandshake size={32} />}
              </div>

              <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-navy-dark)', marginBottom: '0.5rem' }}>
                Stage {steps[activeStep].number} In Action
              </h4>

              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                Real-time data synchronization directly via IndexedDB to ABDM national health registry standards.
              </p>

              <div style={{
                background: 'var(--bg-page)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                textAlign: 'left',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 700 }}>Network Status:</span>
                  <span style={{ color: 'var(--success-green)', fontWeight: 700 }}>Mesh Ready (Online/Offline)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700 }}>Encryption:</span>
                  <span>AES-256 Client-Side Protected</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: 1.2fr 0.8fr"] {
            gridTemplateColumns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </section>
  );
};
