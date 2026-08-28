import React, { useState, useEffect, useRef } from 'react';
import { 
  Scan, 
  FileText, 
  Stethoscope, 
  HeartHandshake, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Building2,
  PhoneCall
} from 'lucide-react';
import gsap from 'gsap';

export const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef(null);

  const steps = [
    {
      id: 'step-1',
      number: '01',
      title: 'Scan & Save Your Paper Slips',
      role: 'Village Clinic & Health Helpers',
      location: 'Village Health Centre (Arogya Mandir)',
      tagline: 'Turn crumpled paper prescriptions into clear digital records',
      desc: 'Take a quick photo of any doctor note, handwritten prescription slip, or vaccination card. The smart scanner reads doctor handwriting automatically and saves everything safely — even in areas with zero cell phone signal.',
      keyFeatures: [
        'Works 100% offline without internet or mobile network',
        'Smart scanner automatically types out medicine names & doses',
        'Links directly to your free Digital Health Card (ABHA)'
      ],
      badgeColor: 'badge-teal'
    },
    {
      id: 'step-2',
      number: '02',
      title: 'Doctor Sees Your Whole Story',
      role: 'Clinic Doctor & Medical Officer',
      location: 'Community Health Centre (Taluk)',
      tagline: 'Your past medicines and allergies appear in 2 seconds',
      desc: 'When you visit any local clinic, the doctor scans your health card QR code. They immediately see your previous blood pressure readings, past fever records, and allergy warnings without you having to carry heavy paper folders.',
      keyFeatures: [
        'Instant view of all past doctor visits and blood tests',
        'Clear digital prescription with daily pill schedule',
        'Automatic warnings if two medicines should not be taken together'
      ],
      badgeColor: 'badge-info'
    },
    {
      id: 'step-3',
      number: '03',
      title: 'Quick Hospital Transfer & Bed Finder',
      role: 'Hospital Specialist & Trauma Team',
      location: 'District Hospital & 60km Network',
      tagline: 'Smooth transfer to larger hospitals with zero lost papers',
      desc: 'If you need heart care, delivery support, or a hospital bed, your local doctor sends a direct digital referral. The specialist hospital gets your complete case history beforehand so they are prepared before you even arrive.',
      keyFeatures: [
        'Clear urgency badge (Normal Checkup, Quick Care, 24/7 Emergency)',
        'Instant 1-page health summary for hospital specialists',
        'Avoids repeating expensive blood tests and saves hours of waiting'
      ],
      badgeColor: 'badge-success'
    },
    {
      id: 'step-4',
      number: '04',
      title: 'Caring Doorstep Support at Home',
      role: 'Village Health Worker (ASHA) & Family',
      location: 'Your Home & Village',
      tagline: 'Friendly reminders ensure you recover fully',
      desc: 'After your hospital visit, your daily medicine schedule is automatically shared with your local village health helper (ASHA). They visit your home to check your blood pressure, ensure you are taking your tablets, and answer family questions.',
      keyFeatures: [
        'Helpful reminders for morning, afternoon, and night medicines',
        'Regular home checkups by your trusted local ASHA worker',
        'Ask health questions anytime in Hindi, Kannada, Telugu, Tamil, or English'
      ],
      badgeColor: 'badge-warning'
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.how-anim-title', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="how-it-works"
      ref={sectionRef}
      style={{
        padding: '5rem 0',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-light)'
      }}
    >
      <div className="app-container">
        
        {/* SECTION HEADER */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'var(--medical-teal-subtle)',
            border: '1px solid #99f6e4',
            padding: '0.3rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            color: 'var(--medical-teal-dark)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.75rem'
          }}>
            <Sparkles size={13} />
            <span>4-Step Simple Journey</span>
          </div>

          <h2 className="how-anim-title" style={{
            fontSize: 'clamp(1.85rem, 3.2vw, 2.45rem)',
            fontWeight: 800,
            color: 'var(--primary-navy-dark)',
            marginBottom: '1rem',
            lineHeight: 1.2
          }}>
            How MediSetu Connects Your Care from Home to Hospital
          </h2>
          
          <p style={{ fontSize: '1.025rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            From simple checkups in your village to specialist care in the city — see how your health records stay safe and connected every step of the way.
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
                STEP {step.number}
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
          }} className="how-card-grid">
            
            {/* LEFT DETAILS */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
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
                {activeStep === 2 && <Building2 size={32} />}
                {activeStep === 3 && <HeartHandshake size={32} />}
              </div>

              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-navy-dark)', marginBottom: '0.5rem' }}>
                Step {steps[activeStep].number} in Everyday Life
              </h4>

              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                Saves time, saves money on re-tests, and gives peace of mind to your entire family.
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
                  <span style={{ fontWeight: 700 }}>Internet Requirement:</span>
                  <span style={{ color: 'var(--success-green)', fontWeight: 700 }}>Zero (Works 100% Offline)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700 }}>Privacy & Safety:</span>
                  <span style={{ color: 'var(--primary-navy)', fontWeight: 700 }}>Government Approved</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .how-card-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </section>
  );
};
