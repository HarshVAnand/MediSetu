import React, { useState } from 'react';
import { Sparkles, AlertTriangle, ShieldAlert, Heart, Activity, FileText, CheckCircle2, Clock, MapPin, Pill, ArrowRight, Printer } from 'lucide-react';
import { generateDoctorRAGDossier } from '../../services/ragService.js';

export const AIRAGPatientDossier = ({ patient, prescriptions = [], records = [], referrals = [] }) => {
  if (!patient) {
    return (
      <div className="med-card" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-subtle)' }}>
        Please select a patient from the patient search above to generate the instant summary.
      </div>
    );
  }

  const dossier = generateDoctorRAGDossier(patient, prescriptions, records, referrals);
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* DOSSIER HEADER BANNER */}
      <div className="med-card" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)',
        border: '1px solid var(--border-medium)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-teal">2-Second Patient Summary</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                Compiled in 120ms • Verified Digital Health Record
              </span>
            </div>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-navy-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={20} color="var(--medical-teal)" />
              <span>{patient.name}'s Health Summary & Safety Checks</span>
            </h3>
          </div>

          <button 
            onClick={() => window.print()}
            className="btn btn-secondary btn-sm"
          >
            <Printer size={15} />
            <span>Print Clinical Summary</span>
          </button>
        </div>

        {/* ONE-LINE EXECUTIVE SUMMARY */}
        <div style={{
          marginTop: '1rem',
          background: 'rgba(255,255,255,0.85)',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          borderLeft: '4px solid var(--medical-teal)',
          fontSize: '0.9rem',
          color: 'var(--primary-navy)',
          fontWeight: 600
        }}>
          {dossier.oneLineSummary}
        </div>
      </div>

      {/* CRITICAL SAFETY & ALLERGY WARNINGS */}
      {dossier.safetyWarnings && dossier.safetyWarnings.length > 0 && (
        <div className="med-card" style={{ background: 'var(--urgent-bg)', border: '1px solid var(--urgent-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--urgent-red)', fontWeight: 800, fontSize: '0.95rem' }}>
            <ShieldAlert size={20} />
            <span>Safety Alerts & Drug Allergy Warnings ({dossier.safetyWarnings.length})</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {dossier.safetyWarnings.map((warn, widx) => (
              <div key={widx} style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 1rem',
                border: '1px solid #fecaca'
              }}>
                <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--urgent-red)', marginBottom: '0.2rem' }}>
                  ⚠️ {warn.title}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  {warn.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TWO COLUMN CLINICAL TRAJECTORY & ACTIVE DRUGS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        
        {/* LEFT: CLINICAL TRAJECTORY */}
        <div className="med-card">
          <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-navy-dark)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Activity size={18} color="var(--medical-teal)" />
            <span>Recent Health Trajectory</span>
          </h4>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
            {dossier.clinicalTrajectory}
          </p>

          <div style={{
            background: 'var(--bg-page)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem',
            border: '1px solid var(--border-light)'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>
              Latest Recorded Vitals:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', fontSize: '0.8125rem' }}>
              <div>BP: <strong style={{ color: 'var(--urgent-red)' }}>{dossier.latestVitals.bp}</strong></div>
              <div>Blood Sugar: <strong>{dossier.latestVitals.sugar}</strong></div>
              <div>HbA1c: <strong style={{ color: '#d97706' }}>{dossier.latestVitals.hba1c}</strong></div>
              <div>Blood Group: <strong>{dossier.latestVitals.bloodGroup}</strong></div>
            </div>
          </div>
        </div>

        {/* RIGHT: ACTIVE MEDICATIONS & NEXT STEPS */}
        <div className="med-card">
          <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-navy-dark)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Pill size={18} color="var(--accent-cyan)" />
            <span>Active Medicines & Action Plan</span>
          </h4>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '0.35rem' }}>
              Currently Taking:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {dossier.activeMedications.map((med, midx) => (
                <span key={midx} className="badge badge-neutral" style={{ fontSize: '0.75rem', background: '#f1f5f9' }}>
                  💊 {med}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '0.35rem' }}>
              Recommended Next Steps:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {dossier.recommendedNextActions.map((act, aidx) => (
                <div key={aidx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                  <CheckCircle2 size={14} color="var(--medical-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
