import React, { useState } from 'react';
import {
  Activity,
  User,
  Stethoscope,
  LogOut,
  Menu,
  X,
  QrCode,
  MapPin
} from 'lucide-react';

export const Navbar = ({ 
  currentRole, 
  currentUser, 
  onNavigate, 
  activeSection, 
  onOpenAuthModal, 
  onLogout,
  onOpenQRModal,
  pendingSyncCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId) => {
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 900,
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border-light)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        
        {/* LOGO & BRANDING */}
        <div 
          onClick={() => handleNavClick('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
          id="nav-logo"
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0f4c81 0%, #0d9488 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 2px 10px rgba(15, 76, 129, 0.25)',
            flexShrink: 0
          }}>
            <Activity size={24} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-navy-dark)', letterSpacing: '-0.02em' }}>
                MediSetu
              </span>
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 800, 
                color: 'var(--medical-teal)', 
                background: 'var(--medical-teal-subtle)', 
                padding: '0.1rem 0.4rem', 
                borderRadius: '4px',
                border: '1px solid #99f6e4'
              }}>
                HEALTH
              </span>
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)', fontWeight: 500, lineHeight: 1 }}>
              Easy Healthcare & Hospital Finder
            </div>
          </div>
        </div>

        {/* DESKTOP NAVIGATION (Landing Page Mode) */}
        {currentRole === 'guest' && (
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button 
              onClick={() => handleNavClick('hero')} 
              className={`nav-link ${activeSection === 'hero' ? 'active' : ''}`}
              style={navLinkStyle}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('facilities')} 
              className={`nav-link ${activeSection === 'facilities' ? 'active' : ''}`}
              style={{
                ...navLinkStyle,
                color: activeSection === 'facilities' ? 'var(--medical-teal)' : 'var(--primary-navy)',
                fontWeight: 700
              }}
            >
              📍 Find Hospitals
            </button>
            <button 
              onClick={() => handleNavClick('how-it-works')} 
              className={`nav-link ${activeSection === 'how-it-works' ? 'active' : ''}`}
              style={navLinkStyle}
            >
              How It Works
            </button>
            <button 
              onClick={() => handleNavClick('for-patients')} 
              className={`nav-link ${activeSection === 'for-patients' ? 'active' : ''}`}
              style={navLinkStyle}
            >
              For Patients
            </button>
            <button 
              onClick={() => handleNavClick('for-doctors')} 
              className={`nav-link ${activeSection === 'for-doctors' ? 'active' : ''}`}
              style={navLinkStyle}
            >
              For Doctors
            </button>
            <button 
              onClick={() => handleNavClick('services')} 
              className={`nav-link ${activeSection === 'services' ? 'active' : ''}`}
              style={navLinkStyle}
            >
              Services
            </button>
            <button 
              onClick={() => handleNavClick('about')} 
              className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
              style={navLinkStyle}
            >
              About
            </button>
          </nav>
        )}

        {/* AUTH BUTTONS / USER PROFILE CONTROLS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {currentRole === 'guest' ? (
            <div className="auth-action-group" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <button 
                id="btn-login-patient"
                onClick={() => onOpenAuthModal('patient-login')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.825rem' }}
              >
                <User size={15} />
                <span>Patient Login</span>
              </button>
              
              <button 
                id="btn-login-doctor"
                onClick={() => onOpenAuthModal('doctor-login')}
                className="btn btn-outline-teal btn-sm"
                style={{ fontSize: '0.825rem' }}
              >
                <Stethoscope size={15} />
                <span>Specialist Login</span>
              </button>

              <button 
                id="btn-get-started"
                onClick={() => onOpenAuthModal('patient-register')}
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.825rem' }}
              >
                Get Started
              </button>
            </div>
          ) : (
            /* Logged-in State Controls */
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {currentRole === 'patient' && (
                <>
                  <button 
                    onClick={onOpenQRModal}
                    className="btn btn-secondary btn-sm"
                    title="View Your Digital Health Card QR"
                  >
                    <QrCode size={16} />
                    <span>Health Card</span>
                  </button>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'var(--medical-teal-subtle)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid #99f6e4'
                  }}>
                    <User size={15} color="var(--medical-teal-dark)" />
                    <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--medical-teal-dark)' }}>
                      {currentUser?.name || 'Patient'}
                    </span>
                  </div>
                </>
              )}

              {currentRole === 'doctor' && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'var(--accent-cyan-subtle)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--accent-cyan-border)'
                }}>
                  <Stethoscope size={15} color="var(--primary-navy)" />
                  <div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--primary-navy-dark)' }}>
                      {currentUser?.name || 'Doctor'}
                    </div>
                    <div style={{ fontSize: '0.675rem', color: 'var(--text-subtle)' }}>
                      {currentUser?.uid || 'ID: KMC-77419'}
                    </div>
                  </div>
                </div>
              )}

              <button 
                onClick={onLogout}
                className="btn btn-secondary btn-sm"
                title="Switch role or logout"
                style={{ padding: '0.35rem 0.65rem' }}
              >
                <LogOut size={16} color="var(--urgent-red)" />
                <span style={{ fontSize: '0.8125rem' }}>Logout</span>
              </button>
            </div>
          )}

          {/* MOBILE MENU TOGGLE */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--primary-navy)',
              padding: '0.35rem'
            }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--border-medium)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          boxShadow: 'var(--shadow-lg)',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <button onClick={() => handleNavClick('hero')} style={mobileNavLinkStyle}>Home</button>
          <button onClick={() => handleNavClick('facilities')} style={{ ...mobileNavLinkStyle, color: 'var(--medical-teal)', fontWeight: 700 }}>
            📍 Find Hospitals (60km Radius)
          </button>
          <button onClick={() => handleNavClick('how-it-works')} style={mobileNavLinkStyle}>How It Works</button>
          <button onClick={() => handleNavClick('for-patients')} style={mobileNavLinkStyle}>For Patients & Families</button>
          <button onClick={() => handleNavClick('for-doctors')} style={mobileNavLinkStyle}>For Doctors & Health Workers</button>
          <button onClick={() => handleNavClick('services')} style={mobileNavLinkStyle}>Services</button>
          <button onClick={() => handleNavClick('about')} style={mobileNavLinkStyle}>About</button>
          
          <hr style={{ borderColor: 'var(--border-light)', margin: '0.5rem 0' }} />

          {currentRole === 'guest' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button 
                onClick={() => { onOpenAuthModal('patient-login'); setMobileMenuOpen(false); }}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <User size={16} /> Patient Login
              </button>
              <button 
                onClick={() => { onOpenAuthModal('doctor-login'); setMobileMenuOpen(false); }}
                className="btn btn-outline-teal"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Stethoscope size={16} /> Doctor Login
              </button>
              <button 
                onClick={() => { onOpenAuthModal('patient-register'); setMobileMenuOpen(false); }}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Create Free Patient Account
              </button>
              <button
                onClick={() => { onOpenAuthModal('doctor-register'); setMobileMenuOpen(false); }}
                className="btn btn-teal"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Stethoscope size={16} /> Register as Doctor / Health Worker
              </button>
            </div>
          ) : (
            <button onClick={onLogout} className="btn btn-urgent" style={{ width: '100%', justifyContent: 'center' }}>
              <LogOut size={16} /> Logout / Switch User
            </button>
          )}
        </div>
      )}

      {/* Inline styles for responsive breakpoints */}
      <style>{`
        @media (max-width: 992px) {
          .desktop-nav {
            display: none !important;
          }
          .auth-action-group #btn-get-started {
            display: none;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
        @media (max-width: 640px) {
          .auth-action-group {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

const navLinkStyle = {
  background: 'none',
  border: 'none',
  fontFamily: 'inherit',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--text-muted)',
  cursor: 'pointer',
  padding: '0.35rem 0',
  transition: 'color var(--transition-fast)',
  position: 'relative'
};

const mobileNavLinkStyle = {
  background: 'none',
  border: 'none',
  fontFamily: 'inherit',
  fontSize: '0.95rem',
  fontWeight: 600,
  color: 'var(--primary-navy-dark)',
  textAlign: 'left',
  padding: '0.5rem 0',
  cursor: 'pointer'
};
