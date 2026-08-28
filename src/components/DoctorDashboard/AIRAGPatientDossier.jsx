import React, { useMemo } from 'react';
import { Sparkles, AlertTriangle, AlertCircle, CheckCircle2, Heart, Activity, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { generateDoctorRAGDossier } from '../../services/ragService.js';

export const AIRAGPatientDossier = ({ patient, prescriptions = [], records = [], referrals = [] }) => {
  const dossier = useMemo(() => {
    return generateDoctorRAGDossier(patient, prescriptions, records, referrals);
  }, [patient, prescriptions, records, referrals]);

  if (!dossier) return null;

  return (
    <div className="med-card" style={{
      background: 'linear-gradient(180deg, #ffffff 0%, #f0fdfa 100%)',
      border: '1px solid #99f6e4',
      marginBottom: '1.75rem'
    }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid #ccfbf1' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>Smart Health Summary</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Past History in 2 Seconds</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={18} color="var(--medical-teal)" />
            <span>Health Summary — {dossier.patientName}</span>
          </h3>
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
          Generated: <strong>{dossier.generatedAt}</strong>
        </div>
      </div>

      {/* ONE-LINE SUMMARY */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1.15rem',
        marginBottom: '1.25rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--medical-teal-dark)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
          Quick Patient Overview:
        </div>
        <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--primary-navy-dark)', lineHeight: '1.5' }}>
          {dossier.oneLineSummary}
        </div>
        <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          {dossier.clinicalTrajectory}
        </p>
      </div>

      {/* SAFETY & ALLERGY WARNINGS */}
      {dossier.safetyWarnings && dossier.safetyWarnings.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--urgent-red)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <AlertCircle size={14} />
            <span>Medicine Safety & Allergy Warnings ({dossier.safetyWarnings.length}):</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {dossier.safetyWarnings.map((warn, widx) => (
              <div 
                key={widx}
                style={{
                  background: warn.severity === 'CRITICAL' ? 'var(--urgent-bg)' : 'var(--warning-bg)',
                  border: `1px solid ${warn.severity === 'CRITICAL' ? 'var(--urgent-border)' : 'var(--warning-border)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem'
                }}
              >
                {warn.severity === 'CRITICAL' ? (
                  <AlertCircle size={18} color="var(--urgent-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
                ) : (
                  <AlertTriangle size={18} color="var(--warning-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
                )}
                <div>
                  <strong style={{ fontSize: '0.875rem', color: warn.severity === 'CRITICAL' ? 'var(--urgent-red)' : 'var(--warning-amber)' }}>
                    {warn.title}
                  </strong>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-main)', marginTop: '0.2rem', lineHeight: '1.4' }}>
                    {warn.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LATEST VITALS & ACTIVE MEDICATIONS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}>
        {/* Latest Readings */}
        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          border: '1px solid var(--border-light)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Activity size={14} color="var(--medical-teal)" />
            <span>Latest Health Readings:</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.8125rem' }}>
            <div>Blood Pressure: <strong>{dossier.latestVitals.bp}</strong></div>
            <div>Blood Sugar: <strong>{dossier.latestVitals.sugar}</strong></div>
            <div>HbA1c Sugar: <strong>{dossier.latestVitals.hba1c}</strong></div>
            <div>Blood Group: <strong>{dossier.latestVitals.bloodGroup}</strong></div>
          </div>
        </div>

        {/* Current Medicines */}
        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          border: '1px solid var(--border-light)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <FileText size={14} color="var(--medical-teal)" />
            <span>Current Active Medicines ({dossier.activeMedications.length}):</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {dossier.activeMedications.length > 0 ? (
              dossier.activeMedications.map((med, midx) => (
                <span key={midx} className="badge badge-info" style={{ fontSize: '0.75rem' }}>
                  {med}
                </span>
              ))
            ) : (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>No active medicines</span>
            )}
          </div>
        </div>
      </div>

      {/* RECOMMENDED NEXT STEPS */}
      <div style={{
        background: '#f8fafc',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1rem',
        border: '1px solid var(--border-light)'
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.4rem' }}>
          Recommended Next Steps:
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8125rem' }}>
          {dossier.recommendedNextActions.map((action, aidx) => (
            <div key={aidx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <CheckCircle2 size={14} color="var(--medical-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ color: 'var(--text-main)' }}>{action}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
