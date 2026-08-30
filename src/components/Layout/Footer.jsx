import React from 'react';
import { Activity, ShieldCheck, Heart, MapPin, Phone, Mail } from 'lucide-react';

export const Footer = ({ onNavigate }) => {
  const handleLinkClick = (e, sectionId) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(sectionId);
    }
  };

  return (
    <footer style={{
      backgroundColor: 'var(--primary-navy-dark)',
      color: '#ffffff',
      padding: '4rem 0 2rem 0',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div className="app-container">
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          
          {/* 1. BRAND INFO */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                flexShrink: 0
              }}>
                <Activity size={20} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                MediSetu
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '1rem' }}>
              Simple, unbroken healthcare for villages and towns. Helping families keep medical records safe and find hospitals within 60km.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#cbd5e1' }}>
              <ShieldCheck size={14} color="var(--medical-teal-light)" />
              <span>100% Private • Government Standard Approved</span>
            </div>
          </div>

          {/* 2. QUICK LINKS */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
              Quick Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <a href="#facilities" onClick={(e) => handleLinkClick(e, 'facilities')} style={{ color: '#cbd5e1' }}>📍 Find Nearby Hospitals (60km)</a>
              <a href="#how-it-works" onClick={(e) => handleLinkClick(e, 'how-it-works')} style={{ color: '#cbd5e1' }}>How It Works (4 Steps)</a>
              <a href="#for-patients" onClick={(e) => handleLinkClick(e, 'for-patients')} style={{ color: '#cbd5e1' }}>For Patients & Families</a>
              <a href="#for-doctors" onClick={(e) => handleLinkClick(e, 'for-doctors')} style={{ color: '#cbd5e1' }}>For Doctors & Health Workers</a>
              <a href="#services" onClick={(e) => handleLinkClick(e, 'services')} style={{ color: '#cbd5e1' }}>Everyday Features</a>
            </div>
          </div>

          {/* 3. LOCAL HOSPITAL REGIONS */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
              Covered Districts (60km)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
              <span>• Kolar District & Taluks</span>
              <span>• Bangarapet & Robertsonpet</span>
              <span>• Hoskote & East Bangalore Rural</span>
              <span>• Malur & Mulbagal Towns</span>
              <span>• Chintamani & Srinivaspur</span>
            </div>
          </div>

          {/* 4. EMERGENCY & HELPLINE */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
              Emergency Numbers
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.06)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>National Ambulance Helpline</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f87171' }}>📞 108</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>National Health Toll-Free</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--medical-teal-light)' }}>📞 104</div>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT */}
        <div style={{
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontSize: '0.75rem',
          color: '#94a3b8'
        }}>
          <div>
            © {new Date().getFullYear()} MediSetu Health. Dedicated to making healthcare accessible and simple.
          </div>
          <div>
            Works Offline • Privacy Protected • Built for Rural & Town Families
          </div>
        </div>

      </div>
    </footer>
  );
};
