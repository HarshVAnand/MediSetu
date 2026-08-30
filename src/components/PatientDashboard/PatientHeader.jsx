import React from 'react';
import { User, QrCode, AlertTriangle, Heart, ShieldCheck, MapPin, Activity, Droplets } from 'lucide-react';

export const PatientHeader = ({ patient, onOpenQRModal, onOpenUploadModal }) => {
  if (!patient) return null;

  return (
    <div className="med-card" style={{
      background: 'linear-gradient(135deg, #ffffff 0%, var(--bg-page) 100%)',
      border: '1px solid var(--border-medium)',
      marginBottom: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        
        {/* LEFT: PATIENT IDENTITY */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            position: 'relative',
            width: '72px',
            height: '72px',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '2px solid var(--medical-teal)',
            boxShadow: 'var(--shadow-sm)',
            flexShrink: 0
          }}>
            <img 
              src={patient.aadharPhoto || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80'} 
              alt={patient.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary-navy-dark)', margin: 0 }}>
                {patient.name}
              </h2>
              <span className="badge badge-teal" style={{ fontSize: '0.6875rem' }}>
                Health ID Active
              </span>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
              <span><strong>Age:</strong> {patient.age} Yrs ({patient.gender})</span>
              <span>•</span>
              <span><strong>Blood Group:</strong> <span style={{ color: 'var(--urgent-red)', fontWeight: 700 }}>{patient.bloodGroup || 'B+'}</span></span>
              <span>•</span>
              <span style={{ fontFamily: 'monospace', color: 'var(--primary-navy)', fontWeight: 600 }}>{patient.abhaId}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
              <MapPin size={13} color="var(--medical-teal)" />
              <span>{patient.address}</span>
            </div>
          </div>
        </div>

        {/* RIGHT: QUICK ACTIONS & ALLERGY BADGE */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
          
          {/* ALLERGY ALERT */}
          {patient.allergies && patient.allergies.length > 0 && !patient.allergies.includes('No Known Drug Allergies (NKDA)') && (
            <div style={{
              background: 'var(--urgent-bg)',
              border: '1px solid var(--urgent-border)',
              borderRadius: 'var(--radius-full)',
              padding: '0.3rem 0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.78rem',
              color: 'var(--urgent-red)',
              fontWeight: 700
            }}>
              <AlertTriangle size={14} />
              <span>Allergies: {patient.allergies.join(', ')}</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button 
              onClick={onOpenQRModal}
              className="btn btn-secondary btn-sm"
            >
              <QrCode size={15} color="var(--primary-navy)" />
              <span>Digital Health Card</span>
            </button>

            <button 
              onClick={onOpenUploadModal}
              className="btn btn-teal btn-sm"
            >
              <span>+ Scan Doctor Slip</span>
            </button>
          </div>

        </div>

      </div>

      {/* BOTTOM SUMMARY ROW */}
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
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0d9488' }} />
          <span style={{ color: 'var(--text-muted)' }}>Local Clinic: <strong>{patient.primaryCareUnit || 'Village Health Centre'}</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7' }} />
          <span style={{ color: 'var(--text-muted)' }}>Assigned Health Worker: <strong>{patient.assignedAsha || 'Smt. Kavitha M.'}</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }} />
          <span style={{ color: 'var(--text-muted)' }}>Status: <strong style={{ color: 'var(--success-green)' }}>Saved & Connected</strong></span>
        </div>
      </div>
    </div>
  );
};
