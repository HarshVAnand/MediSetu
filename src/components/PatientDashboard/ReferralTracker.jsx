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
        return <span className="badge badge-info">ROUTINE CONSULTATION</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted':
        return <span className="badge badge-success">ACCEPTED BY SPECIALIST</span>;
      case 'Pending':
        return <span className="badge badge-warning">WAITING FOR HOSPITAL REVIEW</span>;
      case 'Completed':
        return <span className="badge badge-neutral">COMPLETED</span>;
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
                      Originating Facility
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
                      Receiving Specialist Unit
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-navy-dark)' }}>
                      {ref.toFacilityName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--medical-teal-dark)', fontWeight: 600 }}>
                      Dept: {ref.toDepartment}
                    </div>
                  </div>
                </div>

                {/* CLINICAL REASON */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '0.25rem' }}>
                    Reason for Referral & Clinical Notes:
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
                  gap: '0.75rem',
                  fontSize: '0.8125rem',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid var(--border-light)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                    <Calendar size={15} color="var(--primary-navy)" />
                    <span>Appointment Date: <strong style={{ color: 'var(--primary-navy-dark)' }}>{ref.appointmentDate || 'August 30, 2026'}</strong></span>
                  </div>

                  <div style={{ color: 'var(--text-subtle)' }}>
                    Assigned Specialist: <strong>{ref.targetDoctorName || 'Consultant on Duty'}</strong>
                  </div>
                </div>

                {/* PROGRESS LOGS */}
                {ref.historyLogs && (
                  <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-medium)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '0.4rem' }}>
                      Referral Activity Trail:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {ref.historyLogs.map((log, lidx) => (
                        <div key={lidx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <CheckCircle2 size={13} color="var(--success-green)" />
                          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{log.stage}</span>
                          <span style={{ color: 'var(--text-subtle)' }}>• {log.date} ({log.actor})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>

      {/* FRONTLINE ASHA WORKER FOLLOW-UP VISITS */}
      <div className="med-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-light)' }}>
          <div>
            <span className="badge badge-warning" style={{ marginBottom: '0.25rem' }}>Community Care</span>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={20} color="var(--warning-amber)" />
              <span>Village ASHA Follow-up Visits ({followups.length})</span>
            </h3>
          </div>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Assigned: <strong>{patient?.assignedAsha || 'Smt. Kavitha M.'}</strong>
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {followups.map(fu => (
            <div 
              key={fu.id}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '1.15rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className={`badge ${fu.status === 'Completed' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                  {fu.status}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                  Due: <strong>{fu.dueDate}</strong>
                </span>
              </div>

              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-navy-dark)', marginBottom: '0.25rem' }}>
                {fu.taskType}
              </div>

              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                {fu.instructions}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-subtle)', paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)' }}>
                <span>Worker: {fu.assignedWorker}</span>
                <a href={`tel:${fu.workerContact || '108'}`} style={{ color: 'var(--medical-teal-dark)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Phone size={12} /> Call ASHA
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
