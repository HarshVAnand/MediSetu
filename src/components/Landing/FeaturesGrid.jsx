import React, { useEffect, useRef } from 'react';
import { 
  WifiOff, 
  Scan, 
  Clock, 
  Sparkles, 
  Building2, 
  HeartHandshake, 
  ShieldCheck, 
  MapPin,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import gsap from 'gsap';

export const FeaturesGrid = () => {
  const gridRef = useRef(null);

  const features = [
    {
      icon: <WifiOff size={24} color="#0f4c81" />,
      title: 'Works 100% Without Internet',
      desc: 'Never worry about power cuts or weak mobile signal in rural villages. All your records and doctor notes save instantly on your device and never get lost.'
    },
    {
      icon: <Scan size={24} color="#0d9488" />,
      title: 'Smart Doctor Slip Scanner',
      desc: 'Take a quick smartphone photo of any doctor’s handwritten note or blood test slip. It reads the handwriting and types out the medicine names clearly.'
    },
    {
      icon: <Clock size={24} color="#0284c7" />,
      title: 'Lifetime Medical History in One Place',
      desc: 'One connected record linking your local village clinic, town hospital, and city specialists so no doctor ever has to guess your past health problems.'
    },
    {
      icon: <Sparkles size={24} color="#d97706" />,
      title: 'Instant 2-Second Doctor Summary',
      desc: 'Gives your doctor a clean, 1-page summary of your health conditions, past surgeries, and critical drug allergy warnings in just 2 seconds.'
    },
    {
      icon: <Building2 size={24} color="#16a34a" />,
      title: 'Direct Hospital Referrals & Bed Finder',
      desc: 'Need a specialist or hospital bed? Get referred smoothly to government or private hospitals within 60km with your case notes already prepared.'
    },
    {
      icon: <HeartHandshake size={24} color="#dc2626" />,
      title: 'Doorstep Care by Village Health Workers',
      desc: 'Empowers local ASHA workers with medicine timetables and visit reminders so every family member stays safe and healthy at home.'
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feature-card-anim', {
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%'
        },
        y: 35,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power3.out'
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="services"
      ref={gridRef}
      style={{
        padding: '5rem 0',
        backgroundColor: 'var(--bg-page)',
        borderBottom: '1px solid var(--border-light)'
      }}
    >
      <div className="app-container">
        
        {/* SECTION HEADER - CENTER ALIGNED */}
        <div className="section-center-header">
          <span className="badge badge-info" style={{ marginBottom: '0.75rem' }}>
            Built for Real Everyday Needs
          </span>
          <h2 style={{
            fontSize: 'clamp(1.85rem, 3.2vw, 2.45rem)',
            fontWeight: 800,
            color: 'var(--primary-navy-dark)',
            marginBottom: '1rem',
            lineHeight: 1.2
          }}>
            Everyday Features Built for You & Your Family
          </h2>
          <p style={{ fontSize: '1.025rem', color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto' }}>
            Simple, practical tools that make visiting clinics, finding hospitals within 60km, and managing family health stress-free.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {features.map((feat, idx) => (
            <div 
              key={idx} 
              className="med-card interactive feature-card-anim" 
              style={{ 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                border: '1px solid var(--border-medium)',
                backgroundColor: '#ffffff'
              }}
            >
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

              <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--primary-navy-dark)', marginBottom: '0.5rem' }}>
                {feat.title}
              </h3>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.65', margin: 0 }}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
