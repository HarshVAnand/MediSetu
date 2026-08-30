import React, { useState } from 'react';
import { GitPullRequest, ArrowRight, AlertTriangle, AlertCircle, CheckCircle2, Building2, Send } from 'lucide-react';
import { dbPut, enqueueSyncAction } from '../../services/db.js';
import { INITIAL_FACILITIES } from '../../services/facilityData.js';

export const IssueReferral = ({ doctor, patient, onReferralCreated }) => {
  const [toFacilityId, setToFacilityId] = useState('fac-dh-01');
  const [toDepartment, setToDepartment] = useState('Cardiology & Preventive Nephrology');
  const [urgency, setUrgency] = useState('Priority');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const targetFacilities = INITIAL_FACILITIES.filter(f => f.id !== doctor?.dutyFacilityId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason || !patient) return;

    setIsSubmitting(true);
    setSuccessMsg('');

    try {
      const refId = 'ref-' + Date.now();
      const targetFac = INITIAL_FACILITIES.find(f => f.id === toFacilityId) || INITIAL_FACILITIES[2];
      const tokenNum = `REF-${targetFac.type === 'District Hospital' ? 'DH' : 'CHC'}-KLR-${Math.floor(100 + Math.random() * 900)}`;

      const newReferral = {
        id: refId,
        patientId: patient.id,
        patientName: patient.name,
        patientAbha: patient.abhaId,
        patientAge: patient.age,
        patientGender: patient.gender,
        fromFacilityId: doctor?.dutyFacilityId || 'fac-phc-01',
        fromFacilityName: doctor?.currentPlaceOfPractice || 'Kolar Sub-Divisional PHC',
        fromDoctorId: doctor?.id || 'doc-001',
        fromDoctorName: doctor?.name || 'Dr. Ramesh Kumar',
        toFacilityId: targetFac.id,
        toFacilityName: targetFac.name,
        toDepartment,
        targetDoctorName: 'Consultant Specialist on Duty',
        urgency,
        createdDate: new Date().toISOString().split('T')[0],
        appointmentDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        reasonForReferral: reason,
        clinicalSummaryAttached: true,
        status: urgency === 'Emergency' ? 'Pending' : 'Accepted',
        transportAssistanceRequired: urgency === 'Emergency',
        tokenNumber: tokenNum,
        historyLogs: [
          { 
            stage: 'Initiated at Primary Facility', 
            date: new Date().toLocaleString(), 
            actor: doctor?.name || 'Medical Officer' 
          },
          { 
            stage: 'Inter-Tier Mesh Handover Confirmed', 
            date: new Date().toLocaleString(), 
            actor: 'MediSetu AI Routing' 
          }
        ]
      };

      await dbPut('referrals', newReferral);
      await enqueueSyncAction('CREATE_REFERRAL', { refId, patientId: patient.id, urgency });

      setIsSubmitting(false);
      setSuccessMsg(`Referral Token #${tokenNum} issued. Health summary sent to ${targetFac.name}.`);
      onReferralCreated && onReferralCreated(newReferral);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="med-card" style={{ padding: '1.75rem' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
          <span className="badge badge-info">Hospital Transfer & Referral</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>60km Hospital Network</span>
        </div>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <GitPullRequest size={20} color="var(--primary-navy)" />
          <span>Refer Patient to Specialist / Hospital — {patient?.name}</span>
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

      <form onSubmit={handleSubmit}>
        
        {/* ROW 1: DESTINATION FACILITY & SPECIALTY */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Destination Facility (60km Network) *</label>
            <select 
              className="form-select"
              value={toFacilityId}
              onChange={(e) => setToFacilityId(e.target.value)}
            >
              {targetFacilities.map(f => (
                <option key={f.id} value={f.id}>
                  {f.category === 'Government' ? '🏛️' : '🏥'} {f.name} ({f.facilityType})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Target Specialty Department *</label>
            <select 
              className="form-select"
              value={toDepartment}
              onChange={(e) => setToDepartment(e.target.value)}
            >
              <option value="Cardiology & Heart Care">Cardiology & Heart Care</option>
              <option value="Orthopaedics & Joint Trauma">Orthopaedics & Joint Trauma</option>
              <option value="Obstetrics & High-Risk Delivery">Obstetrics & High-Risk Delivery</option>
              <option value="General & Laparoscopic Surgery">General & Laparoscopic Surgery</option>
              <option value="Pulmonology & Chest Medicine">Pulmonology & Chest Medicine</option>
              <option value="Nephrology & Dialysis Unit">Nephrology & Dialysis Unit</option>
              <option value="Paediatrics & Neonatal Care">Paediatrics & Neonatal Care</option>
            </select>
          </div>
        </div>

        {/* TRIAGE URGENCY LEVEL */}
        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
          <label className="form-label">Referral Urgency Level *</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            
            <label style={{
              background: urgency === 'Normal' ? 'var(--accent-cyan-subtle)' : 'var(--bg-page)',
              border: `2px solid ${urgency === 'Normal' ? 'var(--accent-cyan)' : 'var(--border-medium)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <input 
                type="radio" 
                name="urgency" 
                value="Normal" 
                checked={urgency === 'Normal'}
                onChange={() => setUrgency('Normal')}
              />
              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--primary-navy-dark)' }}>Routine</strong>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Within 14 days</div>
              </div>
            </label>

            <label style={{
              background: urgency === 'Priority' ? 'var(--warning-bg)' : 'var(--bg-page)',
              border: `2px solid ${urgency === 'Priority' ? 'var(--warning-amber)' : 'var(--border-medium)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <input 
                type="radio" 
                name="urgency" 
                value="Priority" 
                checked={urgency === 'Priority'}
                onChange={() => setUrgency('Priority')}
              />
              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--warning-amber)' }}>Priority</strong>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Within 3-7 days</div>
              </div>
            </label>

            <label style={{
              background: urgency === 'Emergency' ? 'var(--urgent-bg)' : 'var(--bg-page)',
              border: `2px solid ${urgency === 'Emergency' ? 'var(--urgent-red)' : 'var(--border-medium)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <input 
                type="radio" 
                name="urgency" 
                value="Emergency" 
                checked={urgency === 'Emergency'}
                onChange={() => setUrgency('Emergency')}
              />
              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--urgent-red)' }}>Emergency</strong>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Immediate 108 Ambulance</div>
              </div>
            </label>

          </div>
        </div>

        {/* CLINICAL REASON & ATTACHMENTS */}
        <div className="form-group">
          <label className="form-label">Clinical Reason & Specialist Evaluation Request *</label>
          <textarea 
            className="form-textarea"
            placeholder="e.g. Uncontrolled stage-2 hypertension with persistent microalbuminuria (42 mg/g) and family history of stroke. Requesting 2D echo review and nephro-protective medication titration."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            required
          />
        </div>

        {/* AUTO ATTACHMENT SUMMARY BANNER */}
        <div style={{
          background: 'var(--medical-teal-subtle)',
          border: '1px solid #99f6e4',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          fontSize: '0.8125rem',
          color: 'var(--medical-teal-dark)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.25rem'
        }}>
          <CheckCircle2 size={16} />
          <span>Patient's complete health history, past reports, and medicine schedules will be automatically attached.</span>
        </div>

        {/* SUBMIT BUTTON */}
        <button 
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary btn-lg"
          style={{ width: '100%' }}
        >
          <Send size={18} />
          <span>{isSubmitting ? 'Sending Referral...' : 'Send Referral & Health Summary'}</span>
        </button>

      </form>
    </div>
  );
};
