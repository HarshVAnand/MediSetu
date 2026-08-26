import React, { useEffect, useRef } from 'react';
import { 
  Activity, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  Stethoscope, 
  Building2, 
  Users, 
  Zap,
  WifiOff
} from 'lucide-react';
import gsap from 'gsap';

export const HeroSection = ({ onOpenAuthModal, onExploreMap }) => {
  const heroRef = useRef(null);
  const bridgeRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered entrance animation
      gsap.from('.hero-anim-item', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      });

      // Pulse animation on the bridge connection nodes
      gsap.to('.pulse-node', {
        scale: 1.08,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.2
      });

      // Flowing dotted line animation
      gsap.to('.flow-line', {
        strokeDashoffset: -40,
        duration: 2,
        repeat: -1,
        ease: 'linear'
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef} 
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #f0f9ff 50%, #f8fafc 100%)',
        padding: '3.5rem 0 4rem 0',
        borderBottom: '1px solid var(--border-light)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle background glow */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13,148,136,0.08) 0%, rgba(255,255,255,0) 70%)',
        pointerEvents: 'none'
      }} />

      <div className="app-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.15fr 0.85fr',
          gap: '3rem',
          alignItems: 'center'
        }}>
          
          {/* LEFT: VALUE PROPOSITION */}
          <div>
            
            {/* Top Mission Pill */}
            <div className="hero-anim-item" style={{ marginBottom: '1.25rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--medical-teal-subtle)',
                border: '1px solid #99f6e4',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8125rem',
                color: 'var(--medical-teal-dark)',
                fontWeight: 700
              }}>
                <Sparkles size={14} color="var(--medical-teal)" />
                <span>AI-Powered Rural Healthcare Continuity Platform</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="hero-anim-item" style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.25rem)',
              fontWeight: 800,
              color: 'var(--primary-navy-dark)',
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
              marginBottom: '1.25rem'
            }}>
              «One connected healthcare record, <br />
              <span style={{ color: 'var(--medical-teal)', background: 'linear-gradient(90deg, #0d9488, #0284c7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                from village to specialist.
              </span>»
            </h1>

            {/* Subtext */}
            <p className="hero-anim-item" style={{
              fontSize: '1.0625rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              marginBottom: '2rem',
              maxWidth: '560px'
            }}>
              MediSetu AI unifies fragmented handwritten slips, community screenings, and hospital consultations into an offline-first, longitudinal patient health graph. Empowering frontline ASHA workers and doctors with instant AI RAG clinical history retrieval.
            </p>

            {/* CTA Buttons */}
            <div className="hero-anim-item" style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2.5rem'
            }}>
              <button 
                id="hero-btn-patient-get-started"
                onClick={() => onOpenAuthModal('patient-register')}
                className="btn btn-primary btn-lg"
                style={{ padding: '0.85rem 1.6rem', fontSize: '1rem' }}
              >
                <span>Get Started as Patient</span>
                <ArrowRight size={18} />
              </button>

              <button 
                id="hero-btn-doctor-login"
                onClick={() => onOpenAuthModal('doctor-login')}
                className="btn btn-secondary btn-lg"
                style={{ padding: '0.85rem 1.4rem', fontSize: '1rem' }}
              >
                <Stethoscope size={18} color="var(--primary-navy)" />
                <span>Healthcare Professional Login</span>
              </button>
            </div>

            {/* Trust Checklist */}
            <div className="hero-anim-item" style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-light)',
              fontSize: '0.8125rem',
              color: 'var(--text-muted)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="var(--success-green)" />
                <span>Zero Data Loss Offline Mode</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="var(--success-green)" />
                <span>ABDM / ABHA Verified</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="var(--success-green)" />
                <span>Multi-Lingual AI RAG</span>
              </div>
            </div>

          </div>

          {/* RIGHT: INTERACTIVE CONNECTED HEALTHCARE MESH VISUALIZATION */}
          <div className="hero-anim-item" ref={bridgeRef}>
            <div style={{
              background: '#ffffff',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-lg)',
              padding: '1.75rem',
              position: 'relative'
            }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }} />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary-navy-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Live Healthcare Continuity Stream
                  </span>
                </div>
                <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
                  Auto-Sync Active
                </span>
              </div>

              {/* 4-NODE INTERACTIVE FLOW */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                
                {/* Node 1: Village Sub-Centre */}
                <div className="pulse-node" style={{
                  background: 'var(--medical-teal-subtle)',
                  border: '1px solid #99f6e4',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem'
                }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: 'var(--medical-teal)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.9rem'
                  }}>
                    1
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.875rem', color: 'var(--primary-navy-dark)' }}>
                        Village Sub-Centre / ASHA Post
                      </strong>
                      <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>Vokkaleri</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Handwritten prescription & BP screening digitized with AI OCR
                    </p>
                  </div>
                </div>

                {/* Connecting SVG Arrow */}
                <div style={{ display: 'flex', justifyContent: 'center', margin: '-0.5rem 0' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <line x1="12" y1="2" x2="12" y2="18" stroke="#0d9488" strokeWidth="2" strokeDasharray="3 3" className="flow-line" />
                    <polyline points="7,14 12,20 17,14" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Node 2: Primary Health Centre (PHC) */}
                <div className="pulse-node" style={{
                  background: 'var(--accent-cyan-subtle)',
                  border: '1px solid var(--accent-cyan-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem'
                }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: 'var(--accent-cyan)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.9rem'
                  }}>
                    2
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.875rem', color: 'var(--primary-navy-dark)' }}>
                        Primary Health Centre (PHC)
                      </strong>
                      <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>Medical Officer</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Doctor views longitudinal history & issues Priority referral
                    </p>
                  </div>
                </div>

                {/* Connecting SVG Arrow */}
                <div style={{ display: 'flex', justifyContent: 'center', margin: '-0.5rem 0' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <line x1="12" y1="2" x2="12" y2="18" stroke="#0284c7" strokeWidth="2" strokeDasharray="3 3" className="flow-line" />
                    <polyline points="7,14 12,20 17,14" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Node 3: District Hospital Specialist */}
                <div className="pulse-node" style={{
                  background: 'linear-gradient(135deg, #0f4c81 0%, #1e3a8a 100%)',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  boxShadow: 'var(--shadow-md)'
                }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.9rem'
                  }}>
                    3
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.875rem', color: '#ffffff' }}>
                        District Hospital & Specialist
                      </strong>
                      <span className="badge" style={{ background: 'rgba(255,255,255,0.25)', color: '#fff', fontSize: '0.65rem' }}>
                        Cardiology / ICU
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#cbd5e1' }}>
                      AI RAG instantly summarizes 3 years of rural tests in 2 seconds
                    </p>
                  </div>
                </div>

              </div>

              {/* Live Status Footer */}
              <div style={{
                marginTop: '1.25rem',
                paddingTop: '0.85rem',
                borderTop: '1px solid var(--border-light)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.75rem',
                color: 'var(--text-subtle)'
              }}>
                <span>Token # REF-DH-KLR-089</span>
                <span style={{ color: 'var(--success-green)', fontWeight: 700 }}>
                  ✓ 100% Record Continuity Verified
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          section {
            padding: 2.5rem 0 3rem 0 !important;
          }
          .hero-anim-item h1 {
            font-size: 2.2rem !important;
          }
          div[style*="gridTemplateColumns: 1.15fr 0.85fr"] {
            gridTemplateColumns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </section>
  );
};
