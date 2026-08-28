import React, { useState } from 'react';
import { 
  User, 
  Stethoscope, 
  Clock, 
  Pill, 
  Scan, 
  MapPin, 
  MessageSquare, 
  FileCheck, 
  Users, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  PhoneCall
} from 'lucide-react';

export const RoleShowcase = ({ onOpenAuthModal }) => {
  const [activeTab, setActiveTab] = useState('patient');

  return (
    <section 
      id="for-patients"
      style={{
        padding: '5rem 0',
        backgroundColor: 'var(--bg-page)',
        borderBottom: '1px solid var(--border-light)'
      }}
    >
      <div className="app-container">
        
        {/* SECTION HEADER */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem auto' }}>
          <span className="badge badge-info" style={{ marginBottom: '0.75rem' }}>
            Tailored For You
          </span>
          <h2 style={{
            fontSize: 'clamp(1.85rem, 3.2vw, 2.45rem)',
            fontWeight: 800,
            color: 'var(--primary-navy-dark)',
            marginBottom: '1rem',
            lineHeight: 1.2
          }}>
            Designed for Families, Doctors & Village Health Workers
          </h2>
          <p style={{ fontSize: '1.025rem', color: 'var(--text-muted)' }}>
            Clear, easy-to-read tools for patients at home, and fast clinical summaries for doctors and village health helpers.
          </p>

          {/* TOGGLE TABS */}
          <div style={{
            display: 'inline-flex',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-full)',
            padding: '0.35rem',
            marginTop: '1.75rem'
          }}>
            <button
              onClick={() => setActiveTab('patient')}
              style={{
                background: activeTab === 'patient' ? '#ffffff' : 'transparent',
                color: activeTab === 'patient' ? 'var(--primary-navy)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.875rem',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '0.6rem 1.5rem',
                cursor: 'pointer',
                boxShadow: activeTab === 'patient' ? 'var(--shadow-sm)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all var(--transition-fast)'
              }}
            >
              <User size={16} />
              <span>For Patients & Families</span>
            </button>

            <button
              onClick={() => setActiveTab('doctor')}
              style={{
                background: activeTab === 'doctor' ? '#ffffff' : 'transparent',
                color: activeTab === 'doctor' ? 'var(--medical-teal-dark)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.875rem',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '0.6rem 1.5rem',
                cursor: 'pointer',
                boxShadow: activeTab === 'doctor' ? 'var(--shadow-sm)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Stethoscope size={16} />
              <span>For Doctors & Village Health Workers</span>
            </button>
          </div>
        </div>

        {/* TAB CONTENT: PATIENT */}
        {activeTab === 'patient' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            
            <div className="med-card">
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'var(--medical-teal-subtle)',
                color: 'var(--medical-teal)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Clock size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-navy-dark)', marginBottom: '0.5rem' }}>
                Your Lifetime Health Story
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                See your full medical checkup history across village health posts, community clinics, and big hospitals on one clear screen with blood test results.
              </p>
            </div>

            <div className="med-card">
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'var(--accent-cyan-subtle)',
                color: 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Pill size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-navy-dark)', marginBottom: '0.5rem' }}>
                Daily Medicine Timetable
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Clear morning, afternoon, and night reminders with countdown timers so you never miss taking your blood pressure or sugar tablets.
              </p>
            </div>

            <div className="med-card">
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Scan size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-navy-dark)', marginBottom: '0.5rem' }}>
                Doctor Slip & Report Scanner
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Take a photo of any handwritten prescription or test report. The system automatically reads and types out your medicines and advice.
              </p>
            </div>

            <div className="med-card">
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: '#f0fdf4',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <MessageSquare size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-navy-dark)', marginBottom: '0.5rem' }}>
                Ask Health Questions in Your Language
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Ask any questions about your diet, medicines, and recovery in Hindi, Kannada, Telugu, Tamil, or English with instant safety checks.
              </p>
            </div>

          </div>
        )}

        {/* TAB CONTENT: DOCTOR / HEALTHCARE WORKER */}
        {activeTab === 'doctor' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            
            <div className="med-card">
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0f4c81 0%, #0d9488 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <FileCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-navy-dark)', marginBottom: '0.5rem' }}>
                2-Second Patient Summary
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Get an instant one-page summary of years of fragmented medical slips with automatic warnings for medicine allergies.
              </p>
            </div>

            <div className="med-card">
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'var(--accent-cyan-subtle)',
                color: 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-navy-dark)', marginBottom: '0.5rem' }}>
                Instant Health Card QR Scan
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Open patient files in seconds by scanning their digital health QR, typing their phone number, or searching their name.
              </p>
            </div>

            <div className="med-card">
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'var(--medical-teal-subtle)',
                color: 'var(--medical-teal)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Stethoscope size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-navy-dark)', marginBottom: '0.5rem' }}>
                Simple Digital Prescription Maker
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Quick medicine selector with dosage schedules, food timing instructions, and automatic sync to the patient's phone.
              </p>
            </div>

            <div className="med-card">
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Building2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-navy-dark)', marginBottom: '0.5rem' }}>
                Direct Hospital Referral & Bed Booking
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Refer cases from village clinics to district specialists with urgency levels (Normal Checkup, Quick Care, 24/7 Emergency).
              </p>
            </div>

          </div>
        )}

        {/* BOTTOM ACTION */}
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button 
            onClick={() => onOpenAuthModal(activeTab === 'patient' ? 'patient-login' : 'doctor-login')}
            className="btn btn-primary btn-lg"
          >
            <span>{activeTab === 'patient' ? 'Open Your Health Portal' : 'Open Doctor & Clinic Portal'}</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
};
