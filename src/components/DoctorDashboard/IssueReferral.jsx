import React, { useState } from 'react';
import { Building2, GitPullRequest, AlertCircle, CheckCircle2, Send, Calendar, Clock, MapPin } from 'lucide-react';
import { INITIAL_FACILITIES } from '../../services/facilityData.js';
import { dbPut, enqueueSyncAction } from '../../services/db.js';

export const IssueReferral = ({ doctor, patient, onReferralCreated }) => {
  const [toFacilityId, setToFacilityId] = useState('fac-gov-dh-01');
  const [department, setDepartment] = useState('Cardiology & Heart Care');
  const [urgency, setUrgency] = useState('Routine');
  const [appointmentDate, setAppointmentDate] = useState(
    new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]
  );
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const targetFacility = INITIAL_FACILITIES.find(f => f.id === toFacilityId) || INITIAL_FACILITIES[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason || !patient) return;

    setIsSubmitting(true);
    setSuccessMsg('');

    try {
      const referralId = 'ref-' + Date.now();
      const tokenNum = 'REF-' + Math.floor(1000 + Math.random() * 9000);
      const newReferral = {
        id: referralId,
        patientId: patient.id,
        patientName: patient.name,
        fromDoctorId: doctor?.id || 'doc-001',
        fromDoctorName: doctor?.name || 'Dr. Ramesh Kumar, MBBS',
        fromFacilityName: doctor?.currentPlaceOfPractice || 'Kolar Sub-Divisional Health Centre',
        toFacilityId: targetFacility.id,
        toFacilityName: targetFacility.name,
        toDepartment: department,
        urgency,
        status: 'Accepted',
        reasonForReferral: reason,
        appointmentDate,
        tokenNumber: tokenNum,
        createdAt: new Date().toISOString()
      };

      await dbPut('referrals', newReferral);
      await enqueueSyncAction('CREATE_REFERRAL', { referralId, patientId: patient.id });

      setIsSubmitting(false);
      setSuccessMsg(`Referral Token #${tokenNum} issued. Health summary sent to ${targetFacility.name}.`);
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
              required
            >
              {INITIAL_FACILITIES.map(f => (
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
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
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

        {/* FACILITY INFO BOX */}
        {targetFacility && (
          <div style={{
            background: 'var(--bg-page)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8125rem'
          }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--primary-navy-dark)' }}>
                {targetFacility.category === 'Government' ? '🏛️ Government Hospital' : '🏥 Private Hospital'} • {targetFacility.facilityType}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                📍 {targetFacility.address}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div>Free Beds: <strong style={{ color: 'var(--success-green)' }}>{targetFacility.availableBeds}</strong></div>
              <div>ICU Beds Free: <strong>{targetFacility.availableIcuBeds || 0}</strong></div>
            </div>
          </div>
        )}

        {/* URGENCY & APPOINTMENT DATE */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Urgency Level *</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[
                { id: 'Routine', label: 'Routine Checkup', color: 'var(--primary-navy)' },
                { id: 'Priority', label: 'Priority Care', color: '#d97706' },
                { id: 'Emergency', label: '24/7 Emergency', color: 'var(--urgent-red)' }
              ].map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setUrgency(u.id)}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.25rem',
                    fontSize: '0.78125rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-sm)',
                    border: urgency === u.id ? `2px solid ${u.color}` : '1px solid var(--border-medium)',
                    background: urgency === u.id ? (u.id === 'Emergency' ? 'var(--urgent-bg)' : '#ffffff') : 'var(--bg-page)',
                    color: u.color,
                    cursor: 'pointer'
                  }}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Appointment / Visit Date *</label>
            <input 
              type="date"
              className="form-input"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
            />
          </div>

        </div>

        {/* REASON FOR REFERRAL */}
        <div className="form-group">
          <label className="form-label">Reason for Referral & Notes for Specialist *</label>
          <textarea 
            className="form-textarea"
            rows="3"
            placeholder="e.g. Uncontrolled diabetes with early protein in urine. Requesting kidney evaluation and echocardiogram."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
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
          className="btn btn-teal btn-lg"
          style={{ width: '100%' }}
        >
          <Send size={18} />
          <span>{isSubmitting ? 'Sending Referral...' : 'Send Referral & Health Summary'}</span>
        </button>

      </form>

    </div>
  );
};
