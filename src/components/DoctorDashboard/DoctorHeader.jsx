import React from 'react';
import { Stethoscope, Building2, Award, Users, GitPullRequest, HeartHandshake, Database } from 'lucide-react';

export const DoctorHeader = ({ doctor, patients = [], activePatient, onSelectPatient }) => {
  if (!doctor) return null;

  return (
    <div className="med-card" style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
      border: '1px solid var(--border-medium)',
      marginBottom: '1.75rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        
        {/* DOCTOR INFO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, #0f4c81 0%, #0d9488 100%)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
            flexShrink: 0
          }}>
            <Stethoscope size={30} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-navy-dark)', margin: 0 }}>
                {doctor.name}
              </h2>
              <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
                {doctor.qualifications}
              </span>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
              <span><strong>Specialization:</strong> {doctor.specialization}</span>
              <span>•</span>
              <span style={{ fontFamily: 'monospace', color: 'var(--primary-navy)', fontWeight: 600 }}>UID: {doctor.uid}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
              <Building2 size={14} color="var(--primary-navy)" />
              <span><strong>Duty Station:</strong> {doctor.currentPlaceOfPractice}</span>
            </div>
          </div>
        </div>

        {/* PATIENT SELECTOR FOR CLINICAL ENCOUNTER */}
        <div style={{
          background: '#ffffff',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          padding: '0.85rem 1.15rem',
          boxShadow: 'var(--shadow-sm)',
          minWidth: '280px'
        }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
            Current Active Patient Case:
          </label>

          <select 
            className="form-select"
            value={activePatient?.id || ''}
            onChange={(e) => {
              const selected = patients.find(p => p.id === e.target.value);
              if (selected) onSelectPatient(selected);
            }}
            style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-navy-dark)' }}
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.age}y/M) — {p.chronicConditions ? p.chronicConditions[0] : 'Active Case'}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* QUICK METRICS */}
      <div style={{
        marginTop: '1.25rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border-light)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        fontSize: '0.8125rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={16} color="var(--primary-navy)" />
          <span>Today's Clinic Queue: <strong>{doctor.consultationSlotsToday || 24} patients</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <GitPullRequest size={16} color="var(--medical-teal)" />
          <span>Hospital Referrals: <strong>{doctor.activeReferralsCount || 8} cases</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Database size={16} color="var(--success-green)" />
          <span>Device Storage: <strong style={{ color: 'var(--success-green)' }}>Saved Safely</strong></span>
        </div>
      </div>
    </div>
  );
};
