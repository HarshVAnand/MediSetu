import React from 'react';
import { GitPullRequest, MapPin, Calendar, Clock, User, CheckCircle2, AlertCircle, Phone, ArrowRight } from 'lucide-react';

export const ReferralTracker = ({ referrals = [], followups = [], patient }) => {
  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'Emergency':
        return <span className="badge badge-urgent">EMERGENCY REFERRAL</span>;
      case 'Priority':
        return <span className="badge badge-warning">PRIORITY REFERRAL</span>;
      default:
        return <span className="badge badge-info">ROUTINE CHECKUP</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted':
        return <span className="badge badge-success">CONFIRMED BY SPECIALIST</span>;
      case 'Pending':
        return <span className="badge badge-warning">WAITING FOR HOSPITAL REVIEW</span>;
      case 'Completed':
        return <span className="badge badge-neutral">VISIT COMPLETED</span>;
      default:
        return <span className="badge badge-info">{status}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* ACTIVE REFERRALS SECTION */}
      <div className="med-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-light)' }}>
          <div>
            <span className="badge badge-teal" style={{ marginBottom: '0.25rem' }}>Doctor Referrals</span>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <GitPullRequest size={20} color="var(--medical-teal)" />
              <span>Hospital Transfer & Specialist Referrals ({referrals.length})</span>
            </h3>
          </div>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            No Papers to Carry
          </span>
        </div>

        {referrals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 0', color: 'var(--text-subtle)' }}>
            No active referrals recorded. All treatments currently managed at your primary village health centre.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {referrals.map(ref => (
              <div 
                key={ref.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* TOP BADGE ROW */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    {getUrgencyBadge(ref.urgency)}
                    {getStatusBadge(ref.status)}
                  </div>
                  <div style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    background: 'var(--bg-page)',
                    padding: '0.3rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--primary-navy)'
                  }}>
                    Token: {ref.tokenNumber || 'REF-DH-KLR-089'}
                  </div>
                </div>

                {/* FACILITY ROUTE (FROM -> TO) */}
                <div style={{
                  background: 'var(--bg-page)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginBottom: '1rem',
                  border: '1px solid var(--border-light)'
                }}>
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Referred From
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-navy-dark)' }}>
                      {ref.fromFacilityName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Referred by {ref.fromDoctorName}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--medical-teal)' }}>
                    <ArrowRight size={22} />
                  </div>

                  <div style={{ flex: 1, minWidth: '180px', textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Hospital to Visit
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-navy-dark)' }}>
                      {ref.toFacilityName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--medical-teal-dark)', fontWeight: 600 }}>
                      Department: {ref.toDepartment}
                    </div>
                  </div>
                </div>

                {/* CLINICAL REASON */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '0.25rem' }}>
                    Reason for Referral & Doctor Advice:
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.5', margin: 0 }}>
                    {ref.reasonForReferral}
                  </p>
                </div>

                {/* SCHEDULE & TOKEN INFO */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-light)',
                  fontSize: '0.8125rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                    <Calendar size={14} color="var(--primary-navy)" />
                    <span>Appointment Date: <strong>{ref.appointmentDate}</strong></span>
                  </div>
                  <div style={{ color: 'var(--success-green)', fontWeight: 700 }}>
                    ✓ Health Records Prepared for Specialist
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* ASHA HOME FOLLOW-UP SECTION */}
      {followups && followups.length > 0 && (
        <div className="med-card">
          <div style={{ marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-navy-dark)', margin: 0 }}>
              Village Health Worker (ASHA) Home Visits
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {followups.map(fu => (
              <div 
                key={fu.id}
                style={{
                  background: 'var(--bg-page)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-navy-dark)' }}>
                    {fu.taskType}
                  </div>
                  <div style={{ fontSize: '0.78125rem', color: 'var(--text-muted)' }}>
                    Assigned Worker: <strong>{fu.assignedWorker}</strong> • Frequency: {fu.frequency}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
                    Note: "{fu.instructions}"
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Due Date</div>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--primary-navy)' }}>{fu.dueDate}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
