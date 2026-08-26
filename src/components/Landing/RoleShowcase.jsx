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
  CheckCircle2
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
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem auto' }}>
          <span className="badge badge-info" style={{ marginBottom: '0.75rem' }}>
            Role-Based Solutions
          </span>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
            fontWeight: 800,
            color: 'var(--primary-navy-dark)',
            marginBottom: '1rem'
          }}>
            Designed Specifically for Patients & Rural Healthcare Workers
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
            MediSetu AI adapts to each role in the healthcare delivery chain — providing clear, simplified interfaces for rural families, and deep clinical intelligence for medical officers.
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
              <span>For Doctors & ASHA Workers</span>
            </button>
          </div>
        </div>

        {/* TAB CONTENT: PATIENT */}
        {activeTab === 'patient' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
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
                Longitudinal Health Timeline
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                View your complete consultation history across village sub-centres, PHCs, and district hospitals in one continuous timeline with lab results and vitals.
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
                Medication Schedule & Refills
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Clear morning, afternoon, and night dosage indicators with countdown timers and reminders to never miss your diabetes or BP pills.
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
                AI Prescription & Slip Scanner
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Take a photo of any doctor prescription slip or blood report. Our AI OCR engine extracts medicine names, dosages, and test markers automatically.
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
                Multi-Lingual AI Health Assistant
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Ask health questions based strictly on your personal records in Hindi, Kannada, Telugu, Tamil, or English with allergy safety checks.
              </p>
            </div>

          </div>
        )}

        {/* TAB CONTENT: DOCTOR / HEALTHCARE WORKER */}
        {activeTab === 'doctor' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
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
                AI RAG Clinical Synthesis
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Generates a 2-second synthesized clinical summary across multi-year fragmented records with instant drug-allergy and contraindication alerts.
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
                Fast Patient ABHA Lookup
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Retrieve patients in milliseconds by ABHA ID, Aadhaar number, phone, name, or digital QR scan with instant local cache fallback.
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
                Structured E-Prescription Builder
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Rapid medication selector with dosage schedules, diagnostic tagging, and automatic sync to the patient timeline and village ASHA dashboard.
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
                <MapPin size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-navy-dark)', marginBottom: '0.5rem' }}>
                Inter-Tier Referral Dispatch
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Refer patients seamlessly from Sub-Centre or PHC to District Hospital with triage urgency levels (Normal, Priority, Emergency) and digital case handover.
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
            <span>{activeTab === 'patient' ? 'Open Patient Health Record' : 'Access Practitioner Coordination Station'}</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
};
