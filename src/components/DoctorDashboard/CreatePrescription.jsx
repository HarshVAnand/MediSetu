import React, { useState } from 'react';
import { Pill, Plus, Trash2, CheckCircle2, Save, Sparkles, Clock, AlertTriangle } from 'lucide-react';
import { dbPut, enqueueSyncAction } from '../../services/db.js';

export const CreatePrescription = ({ doctor, patient, onPrescriptionCreated }) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [drugs, setDrugs] = useState([
    {
      name: 'Metformin Hydrochloride (SR)',
      dosage: '500 mg',
      schedule: { morning: true, afternoon: false, night: true },
      timing: 'After meals',
      duration: '30 days',
      instructions: 'Take with warm water after food'
    }
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const quickDrugList = [
    { name: 'Metformin Hydrochloride', dosage: '500 mg', timing: 'After meals', defaultM: true, defaultN: true },
    { name: 'Telmisartan Tablets IP', dosage: '40 mg', timing: 'Before breakfast', defaultM: true, defaultN: false },
    { name: 'Amlodipine Besylate', dosage: '5 mg', timing: 'Morning', defaultM: true, defaultN: false },
    { name: 'Atorvastatin Tablets IP', dosage: '10 mg', timing: 'Bedtime', defaultM: false, defaultN: true },
    { name: 'Labetalol Tablets IP', dosage: '100 mg', timing: 'After meals', defaultM: true, defaultN: true },
    { name: 'Paracetamol IP', dosage: '650 mg', timing: 'SOS / Post food', defaultM: false, defaultN: false },
    { name: 'Ferrous Ascorbate + Folic Acid', dosage: '100mg/1.5mg', timing: 'Post lunch', defaultM: false, defaultN: false }
  ];

  const handleAddDrug = (preset = null) => {
    if (preset) {
      setDrugs(prev => [
        ...prev,
        {
          name: preset.name,
          dosage: preset.dosage,
          schedule: { morning: preset.defaultM, afternoon: false, night: preset.defaultN },
          timing: preset.timing,
          duration: '30 days',
          instructions: 'Take as directed'
        }
      ]);
    } else {
      setDrugs(prev => [
        ...prev,
        {
          name: '',
          dosage: '',
          schedule: { morning: true, afternoon: false, night: false },
          timing: 'After meals',
          duration: '15 days',
          instructions: ''
        }
      ]);
    }
  };

  const handleRemoveDrug = (index) => {
    setDrugs(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateDrug = (index, field, value) => {
    setDrugs(prev => prev.map((d, i) => i === index ? { ...d, [field]: value } : d));
  };

  const handleToggleSchedule = (index, slot) => {
    setDrugs(prev => prev.map((d, i) => {
      if (i === index) {
        return {
          ...d,
          schedule: { ...d.schedule, [slot]: !d.schedule[slot] }
        };
      }
      return d;
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!diagnosis || drugs.length === 0 || !patient) return;

    setIsSaving(true);
    setSuccessMsg('');

    try {
      const presId = 'pres-' + Date.now();
      const newPres = {
        id: presId,
        patientId: patient.id,
        doctorId: doctor?.id || 'doc-001',
        doctorName: doctor?.name || 'Dr. Ramesh Kumar, MBBS',
        facilityName: doctor?.currentPlaceOfPractice || 'Kolar Sub-Divisional PHC',
        facilityTier: doctor?.currentPlaceOfPractice?.includes('District') ? 'District Hospital' : 'PHC',
        date: new Date().toISOString().split('T')[0],
        diagnosis,
        notes,
        status: 'Active',
        drugs: drugs.map(d => ({
          ...d,
          remainingDays: parseInt(d.duration, 10) || 30,
          refillDue: new Date(Date.now() + (parseInt(d.duration, 10) || 30) * 86400000).toISOString().split('T')[0]
        }))
      };

      await dbPut('prescriptions', newPres);
      await enqueueSyncAction('CREATE_PRESCRIPTION', { presId, patientId: patient.id });

      setIsSaving(false);
      setSuccessMsg(`E-Prescription successfully saved to ${patient.name}'s longitudinal health timeline.`);
      onPrescriptionCreated && onPrescriptionCreated(newPres);
    } catch (err) {
      console.error(err);
      setIsSaving(false);
    }
  };

  return (
    <div className="med-card" style={{ padding: '1.75rem' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
          <span className="badge badge-teal">E-Prescription Builder</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Connected to Patient ABHA & Village ASHA</span>
        </div>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Pill size={20} color="var(--medical-teal)" />
          <span>Issue Digital Prescription — {patient?.name}</span>
        </h3>
      </div>

      {successMsg && (
        <div style={{
          background: 'var(--success-bg)',
          border: '1px solid var(--success-border)',
          color: 'var(--success-green)',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
          fontWeight: 600,
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* QUICK ESSENTIAL DRUG PICKER */}
      <div style={{
        background: 'var(--bg-page)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem 1rem',
        marginBottom: '1.25rem'
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
          + Fast Add Essential Medicine (NLEM Rural Formulations):
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {quickDrugList.map((q, qidx) => (
            <button
              key={qidx}
              type="button"
              onClick={() => handleAddDrug(q)}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.3rem 0.6rem',
                fontSize: '0.75rem',
                color: 'var(--text-main)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--medical-teal)'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-medium)'}
            >
              + {q.name} ({q.dosage})
            </button>
          ))}
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        
        {/* DIAGNOSIS */}
        <div className="form-group">
          <label className="form-label">Clinical Diagnosis / ICD-10 Impression *</label>
          <input 
            type="text"
            className="form-input"
            placeholder="e.g. Type-2 Diabetes Mellitus with Stage-II Essential Hypertension"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            required
          />
        </div>

        {/* PRESCRIBED DRUGS LIST */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label className="form-label" style={{ margin: 0 }}>Medications List ({drugs.length})</label>
            <button 
              type="button" 
              onClick={() => handleAddDrug()}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
            >
              <Plus size={14} /> Add Custom Drug
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {drugs.map((drug, idx) => (
              <div 
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem',
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1.2fr 1fr auto',
                  gap: '0.65rem',
                  alignItems: 'center'
                }}
              >
                <div>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Medicine Name (e.g. Metformin)"
                    value={drug.name}
                    onChange={(e) => handleUpdateDrug(idx, 'name', e.target.value)}
                    style={{ fontSize: '0.8125rem', padding: '0.45rem 0.65rem' }}
                    required
                  />
                </div>

                <div>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Dosage (500mg)"
                    value={drug.dosage}
                    onChange={(e) => handleUpdateDrug(idx, 'dosage', e.target.value)}
                    style={{ fontSize: '0.8125rem', padding: '0.45rem 0.65rem' }}
                    required
                  />
                </div>

                {/* SCHEDULE CHECKBOXES (M-A-N) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={drug.schedule?.morning} 
                      onChange={() => handleToggleSchedule(idx, 'morning')}
                    /> M
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={drug.schedule?.afternoon} 
                      onChange={() => handleToggleSchedule(idx, 'afternoon')}
                    /> A
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={drug.schedule?.night} 
                      onChange={() => handleToggleSchedule(idx, 'night')}
                    /> N
                  </label>
                </div>

                <div>
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="Duration (30 days)"
                    value={drug.duration}
                    onChange={(e) => handleUpdateDrug(idx, 'duration', e.target.value)}
                    style={{ fontSize: '0.8125rem', padding: '0.45rem 0.65rem' }}
                  />
                </div>

                <button 
                  type="button" 
                  onClick={() => handleRemoveDrug(idx)}
                  style={{ background: 'none', border: 'none', color: 'var(--urgent-red)', cursor: 'pointer', padding: '4px' }}
                  title="Remove medication"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CLINICAL ADVICE & NOTES */}
        <div className="form-group">
          <label className="form-label">Clinical Advice / Lifestyle & Diet Instructions</label>
          <textarea 
            className="form-textarea"
            placeholder="e.g. Low salt diet, avoid fried food. ASHA worker to check BP every 7 days. Review in 4 weeks."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button 
          type="submit"
          disabled={isSaving}
          className="btn btn-teal btn-lg"
          style={{ width: '100%' }}
        >
          <Save size={18} />
          <span>{isSaving ? 'Signing & Persisting E-Prescription...' : 'Sign & Issue E-Prescription'}</span>
        </button>

      </form>

      <style>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: 2fr 1fr 1.2fr 1fr auto"] {
            gridTemplateColumns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
