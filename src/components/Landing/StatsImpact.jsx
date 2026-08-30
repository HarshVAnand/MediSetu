import React, { useEffect, useRef } from 'react';
import { Building2, Users, ShieldCheck, Zap, Activity, Heart } from 'lucide-react';
import gsap from 'gsap';

export const StatsImpact = () => {
  const sectionRef = useRef(null);

  const stats = [
    { target: 500, suffix: '+', label: 'Connected Clinics & Health Centers', sub: 'Across 12 Rural Districts' },
    { target: 2, prefix: '< ', suffix: 's', label: 'Instant Doctor Summary', sub: 'Shows Past History in 2 Seconds' },
    { target: 60, suffix: ' km', label: 'Hospital Finder Coverage', sub: 'Govt & Private Emergency Network' },
    { target: 14200, suffix: '+', label: 'Families Supported', sub: 'Zero Lost Medical Records' }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Counter animation on scroll
      gsap.from('.stat-box', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="about"
      ref={sectionRef}
      style={{
        padding: '4.5rem 0',
        backgroundColor: 'var(--primary-navy)',
        color: '#ffffff',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <div className="app-container">
        
        {/* SECTION HEADER - CENTER ALIGNED */}
        <div className="section-center-header">
          <span className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', marginBottom: '0.75rem' }}>
            Real Impact for Everyday People
          </span>
          <h2 style={{
            fontSize: 'clamp(1.85rem, 3vw, 2.35rem)',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: '0.75rem',
            lineHeight: 1.2
          }}>
            Bringing Better Healthcare Closer to Your Home
          </h2>
          <p style={{ fontSize: '0.975rem', color: '#cbd5e1', maxWidth: '650px', margin: '0 auto' }}>
            Ensuring every family receives uninterrupted medical care and instant hospital access when they need it most.
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
              className="stat-box"
              style={{
                background: 'rgba(255, 255, 255, 0.07)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem 1.25rem',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
              }}
            >
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                color: 'var(--medical-teal-light)',
                lineHeight: 1.1,
                marginBottom: '0.5rem'
              }}>
                {stat.prefix || ''}{stat.target.toLocaleString()}{stat.suffix || ''}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '0.78125rem', color: '#94a3b8' }}>
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
