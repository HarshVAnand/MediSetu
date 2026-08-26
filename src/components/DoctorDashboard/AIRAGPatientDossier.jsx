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
            <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>AI RAG Synthesis</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Retrieval-Augmented Clinical Dossier</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={18} color="var(--medical-teal)" />
            <span>Clinical Intelligence Snapshot — {dossier.patientName}</span>
          </h3>
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
          Generated: <strong>{dossier.generatedAt}</strong>
        </div>
      </div>

      {/* ONE-LINE EXECUTIVE SUMMARY */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1.15rem',
        marginBottom: '1.25rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--medical-teal-dark)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
          Executive Clinical Summary:
        </div>
        <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--primary-navy-dark)', lineHeight: '1.5' }}>
          {dossier.oneLineSummary}
        </div>
        <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          {dossier.clinicalTrajectory}
        </p>
      </div>

      {/* SAFETY ALERTS & CONTRAINDICATION FLAGS */}
      {dossier.safetyWarnings && dossier.safetyWarnings.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--urgent-red)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <AlertCircle size={14} />
            <span>Clinical Contraindication & Safety Alerts ({dossier.safetyWarnings.length}):</span>
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

      {/* LATEST VITALS & ACTIVE MEDICATIONS SUMMARY */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}>
        
        {/* VITALS PANEL */}
        <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
            Latest Vital Signs:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8125rem' }}>
            <div>BP: <strong style={{ color: 'var(--urgent-red)' }}>{dossier.latestVitals.bp}</strong></div>
            <div>Sugar: <strong style={{ color: '#d97706' }}>{dossier.latestVitals.sugar}</strong></div>
            <div>HbA1c: <strong>{dossier.latestVitals.hba1c}</strong></div>
            <div>Blood: <strong>{dossier.latestVitals.bloodGroup}</strong></div>
          </div>
        </div>

        {/* ACTIVE DRUGS PANEL */}
        <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
            Current Active Drugs ({dossier.activeMedications.length}):
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
            {dossier.activeMedications.length > 0 ? (
              dossier.activeMedications.join(' • ')
            ) : (
              <span style={{ color: 'var(--text-subtle)' }}>No active prescriptions on file</span>
            )}
          </div>
        </div>

      </div>

      {/* AI RECOMMENDED NEXT CLINICAL ACTIONS */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1rem'
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--medical-teal-dark)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          AI Recommended Clinical Actions:
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {dossier.recommendedNextActions.map((act, aidx) => (
            <div key={aidx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-main)' }}>
              <CheckCircle2 size={14} color="var(--medical-teal)" style={{ flexShrink: 0 }} />
              <span>{act}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
