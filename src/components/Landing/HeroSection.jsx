import React, { useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  WifiOff, 
  Scan, 
  ShieldCheck, 
  PhoneCall, 
  Building2, 
  Users, 
  Heart,
  CheckCircle2
} from 'lucide-react';
import gsap from 'gsap';

export const HeroSection = ({ onOpenAuthModal, onExploreMap }) => {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered entrance animation for hero elements
      gsap.from('.hero-anim-item', {
        y: 35,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out'
      });

      // Floating micro-animation for the badges
      gsap.to('.floating-badge-1', {
        y: -8,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      gsap.to('.floating-badge-2', {
        y: 8,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.5
      });

      // Pulse animation on the connection nodes
      gsap.to('.pulse-node', {
        scale: 1.08,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.25
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleFindHospitalsClick = () => {
    if (window.lenis) {
      const el = document.getElementById('facilities');
      if (el) window.lenis.scrollTo(el, { offset: -70, duration: 1.2 });
    } else if (onExploreMap) {
      onExploreMap();
    }
  };

  return (
    <section 
      ref={heroRef} 
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #f0fdfa 45%, #f8fafc 100%)',
        padding: '3.5rem 0 4.5rem 0',
        borderBottom: '1px solid var(--border-light)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Soft Background glow accents */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        right: '-10%',
        width: '550px',
        height: '550px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13,148,136,0.1) 0%, rgba(255,255,255,0) 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-10%',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(2,132,199,0.08) 0%, rgba(255,255,255,0) 70%)',
        pointerEvents: 'none'
      }} />

      <div className="app-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.15fr 0.85fr',
          gap: '3rem',
          alignItems: 'center'
        }} className="hero-main-grid">
          
          {/* LEFT: VALUE PROPOSITION IN PLAIN LANGUAGE */}
          <div className="hero-left-content">
            
            {/* Top Mission Pill */}
            <div className="hero-anim-item" style={{ marginBottom: '1.25rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--medical-teal-subtle)',
                border: '1px solid #99f6e4',
                padding: '0.35rem 0.95rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8125rem',
                color: 'var(--medical-teal-dark)',
                fontWeight: 700
              }}>
                <Sparkles size={14} color="var(--medical-teal)" />
                <span>Simple Health Records & 60km Hospital Finder</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="hero-anim-item hero-title" style={{
              fontSize: 'clamp(2.1rem, 4vw, 3.25rem)',
              fontWeight: 800,
              color: 'var(--primary-navy-dark)',
              letterSpacing: '-0.025em',
              lineHeight: 1.18,
              marginBottom: '1.25rem'
            }}>
              All your health records in one place, <br />
              <span style={{ 
                color: 'var(--medical-teal)', 
                background: 'linear-gradient(90deg, #0d9488, #0284c7)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent' 
              }}>
                from your village clinic to city doctors.
              </span>
            </h1>

            {/* Subtext in Daily Simple Words */}
            <p className="hero-anim-item hero-desc" style={{
              fontSize: '1.0625rem',
              color: 'var(--text-muted)',
              lineHeight: 1.65,
              marginBottom: '2rem',
              maxWidth: '560px'
            }}>
              MediSetu keeps all your handwritten doctor slips, medical tests, and pill schedules safe and organized. Find free government and private hospitals within 60km, share your history with doctors in 2 seconds, and get caring follow-up at your doorstep — <strong>even without internet.</strong>
            </p>

            {/* CTA Buttons */}
            <div className="hero-anim-item hero-cta-group" style={{
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
                <span>Create Free Patient Account</span>
                <ArrowRight size={18} />
              </button>

              <button 
                id="hero-btn-explore-60km-hospitals"
                onClick={handleFindHospitalsClick}
                className="btn btn-outline-teal btn-lg"
                style={{ padding: '0.85rem 1.4rem', fontSize: '0.95rem' }}
              >
                <MapPin size={18} />
                <span>Find Hospitals (60km Radius)</span>
              </button>
            </div>

            {/* Value Highlights */}
            <div className="hero-anim-item hero-value-props" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '1rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-light)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', flexShrink: 0 }}>
                  <WifiOff size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--primary-navy-dark)' }}>Works Offline</div>
                  <div style={{ fontSize: '0.71875rem', color: 'var(--text-subtle)' }}>No internet needed</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7', flexShrink: 0 }}>
                  <Scan size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--primary-navy-dark)' }}>Paper Slip Scanner</div>
                  <div style={{ fontSize: '0.71875rem', color: 'var(--text-subtle)' }}>Reads doctor handwriting</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', flexShrink: 0 }}>
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--primary-navy-dark)' }}>100% Private & Safe</div>
                  <div style={{ fontSize: '0.71875rem', color: 'var(--text-subtle)' }}>Government approved</div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: HEALTHCARE CONNECTION VISUALIZATION */}
          <div style={{ position: 'relative' }} className="hero-right-visual">
            
            {/* FLOATING STATUS PILL 1: 60km Hospital Finder */}
            <div className="floating-badge-1" style={{
              position: 'absolute',
              top: '-18px',
              left: '10px',
              zIndex: 20,
              background: '#ffffff',
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid #99f6e4',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--medical-teal-dark)'
            }}>
              <span style={{ width: '8px', height: '8px', background: '#14b8a6', borderRadius: '50%', display: 'inline-block' }}></span>
              <span>📍 16+ Hospitals within 60km</span>
            </div>

            {/* FLOATING STATUS PILL 2: Live Emergency */}
            <div className="floating-badge-2" style={{
              position: 'absolute',
              bottom: '15px',
              right: '-10px',
              zIndex: 20,
              background: '#ffffff',
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid #fecaca',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#dc2626'
            }}>
              <span style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', display: 'inline-block' }}></span>
              <span>🚨 Live ICU & Emergency Beds</span>
            </div>

            {/* MAIN VISUAL CARD */}
            <div className="med-card" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-lg)',
              position: 'relative'
            }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--primary-navy-dark)' }}>
                  Your Complete Health Journey
                </div>
                <span className="badge badge-teal" style={{ fontSize: '0.6875rem' }}>
                  Live Connected
                </span>
              </div>

              {/* Connected Health Nodes Step Visualizer */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', position: 'relative' }}>
                
                {/* 1. Village Clinic */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  background: '#ffffff',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div className="pulse-node" style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#f0fdf4',
                    color: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    flexShrink: 0
                  }}>
                    1
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--primary-navy-dark)' }}>
                      Village Clinic (Arogya Mandir)
                    </div>
                    <div style={{ fontSize: '0.71875rem', color: 'var(--text-muted)' }}>
                      Paper slips scanned • BP and sugar checked
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>Saved Offline</span>
                </div>

                {/* Connecting arrow/line */}
                <div style={{ height: '14px', width: '2px', background: '#cbd5e1', marginLeft: '26px' }}></div>

                {/* 2. Local Health Center */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  background: '#ffffff',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div className="pulse-node" style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#e0f2fe',
                    color: '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    flexShrink: 0
                  }}>
                    2
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--primary-navy-dark)' }}>
                      Community Hospital (Taluk)
                    </div>
                    <div style={{ fontSize: '0.71875rem', color: 'var(--text-muted)' }}>
                      Doctor sees full past history in 2 seconds
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 700 }}>QR Synced</span>
                </div>

                {/* Connecting line */}
                <div style={{ height: '14px', width: '2px', background: '#cbd5e1', marginLeft: '26px' }}></div>

                {/* 3. District Specialist Hospital */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  background: '#ffffff',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div className="pulse-node" style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#fef3c7',
                    color: '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    flexShrink: 0
                  }}>
                    3
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--primary-navy-dark)' }}>
                      District Hospital & Specialist
                    </div>
                    <div style={{ fontSize: '0.71875rem', color: 'var(--text-muted)' }}>
                      Direct referral with zero paperwork lost
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#d97706', fontWeight: 700 }}>24/7 ICU Ready</span>
                </div>

                {/* Connecting line */}
                <div style={{ height: '14px', width: '2px', background: '#cbd5e1', marginLeft: '26px' }}></div>

                {/* 4. Home Follow-up */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  background: '#ffffff',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #99f6e4',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div className="pulse-node" style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#f0fdfa',
                    color: '#0d9488',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    flexShrink: 0
                  }}>
                    4
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--primary-navy-dark)' }}>
                      Doorstep Health Worker (ASHA)
                    </div>
                    <div style={{ fontSize: '0.71875rem', color: 'var(--text-muted)' }}>
                      Medicine reminder timetable & home visits
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#0d9488', fontWeight: 700 }}>Care Completed</span>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .hero-main-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
            text-align: center;
          }
          .hero-desc {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-cta-group {
            justify-content: center !important;
          }
          .hero-value-props {
            justify-content: center;
            text-align: left;
          }
          .floating-badge-1, .floating-badge-2 {
            position: static !important;
            margin-bottom: 0.5rem;
            display: inline-flex !important;
          }
        }
      `}</style>
    </section>
  );
};
