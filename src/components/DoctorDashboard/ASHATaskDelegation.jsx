import React, { useState } from 'react';
import { HeartHandshake, CheckCircle2, Calendar, User, Clock, Plus, Save } from 'lucide-react';
import { dbPut, enqueueSyncAction } from '../../services/db.js';

export const ASHATaskDelegation = ({ doctor, patient, followups = [], onTaskCreated }) => {
  const [taskType, setTaskType] = useState('Weekly Blood Pressure & Sugar Tracking');
  const [assignedWorker, setAssignedWorker] = useState(patient?.assignedAsha || 'Smt. Kavitha M. (ASHA Worker)');
  const [frequency, setFrequency] = useState('Every 7 days');
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [instructions, setInstructions] = useState('Check blood pressure with digital cuff. Verify patient is taking morning Metformin regularly.');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const commonTasks = [
    { title: 'Weekly Blood Pressure & Sugar Tracking', desc: 'Visit home, check BP & random sugar, log reading.' },
    { title: 'Pill Count & Medicine Refill Verification', desc: 'Confirm patient has sufficient morning and night tablets.' },
    { title: 'Diet & Salt Restriction Education', desc: 'Counsel family on low-salt and low-sugar diet.' },
    { title: 'Hospital Referral Escort & Reminders', desc: 'Remind patient of upcoming district hospital visit date.' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskType || !patient) return;

    setIsSaving(true);
    setSuccessMsg('');

    try {
      const fuId = 'fu-' + Date.now();
      const newFollowup = {
        id: fuId,
        patientId: patient.id,
        patientName: patient.name,
        assignedWorker,
        taskType,
        frequency,
        dueDate,
        instructions,
        status: 'Assigned',
        createdAt: new Date().toISOString()
      };

      await dbPut('followups', newFollowup);
      await enqueueSyncAction('CREATE_FOLLOWUP_TASK', { fuId, patientId: patient.id });

      setIsSaving(false);
      setSuccessMsg(`Task assigned to ${assignedWorker}. Scheduled for ${dueDate}.`);
      onTaskCreated && onTaskCreated(newFollowup);
    } catch (err) {
      console.error(err);
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* CREATE NEW TASK CARD */}
      <div className="med-card" style={{ padding: '1.75rem' }}>
        <div style={{ marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <span className="badge badge-warning">Village Health Worker Task</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Home Checkup & Medicine Support</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <HeartHandshake size={20} color="var(--warning-amber)" />
            <span>Assign Home Visit to ASHA Worker — {patient?.name}</span>
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

        {/* QUICK TASK TEMPLATES */}
        <div style={{
          background: 'var(--bg-page)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
            Select Common Task:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {commonTasks.map((ct, cidx) => (
              <button
                key={cidx}
                type="button"
                onClick={() => { setTaskType(ct.title); setInstructions(ct.desc); }}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--medical-teal)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-medium)'}
              >
                + {ct.title}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Task Type / Care Focus *</label>
              <input 
                type="text"
                className="form-input"
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Assigned Village Health Worker (ASHA) *</label>
              <input 
                type="text"
                className="form-input"
                value={assignedWorker}
                onChange={(e) => setAssignedWorker(e.target.value)}
                required
              />
            </div>

          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Visit Frequency *</label>
              <select 
                className="form-select"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              >
                <option value="Every 3 days">Every 3 days (High Alert)</option>
                <option value="Every 7 days">Every 7 days (Weekly Routine)</option>
                <option value="Every 14 days">Every 14 days (Fortnightly)</option>
                <option value="Once monthly">Once monthly (Maintenance)</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">First Home Visit Date *</label>
              <input 
                type="date"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

          </div>

          <div className="form-group">
            <label className="form-label">Instructions for Health Worker</label>
            <textarea 
              className="form-textarea"
              rows="2"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isSaving}
            className="btn btn-teal btn-lg"
            style={{ width: '100%' }}
          >
            <Save size={18} />
            <span>{isSaving ? 'Assigning...' : 'Assign Home Task to Health Worker'}</span>
          </button>

        </form>
      </div>

      {/* EXISTING FOLLOW-UPS LIST */}
      <div className="med-card">
        <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-navy-dark)', marginBottom: '1rem' }}>
          Active Home Tasks for {patient?.name} ({followups.length})
        </h4>

        {followups.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-subtle)', fontSize: '0.875rem' }}>
            No active follow-up tasks currently assigned for this patient.
          </div>
        ) : (
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
                    Assigned to: <strong>{fu.assignedWorker}</strong> • {fu.frequency}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
                    Notes: "{fu.instructions}"
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                    Due: {fu.dueDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
