import React, { useState } from 'react';
import { HeartHandshake, User, Plus, Calendar, CheckCircle2, Phone, Clock, AlertCircle } from 'lucide-react';
import { dbPut, enqueueSyncAction } from '../../services/db.js';

export const ASHATaskDelegation = ({ doctor, patient, followups = [], onTaskCreated }) => {
  const [taskType, setTaskType] = useState('Blood Pressure & Blood Glucose Check');
  const [frequency, setFrequency] = useState('Every 7 Days');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [instructions, setInstructions] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const patientFollowups = followups.filter(f => f.patientId === patient?.id);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!instructions || !patient) return;

    setIsSaving(true);
    setSuccessMsg('');

    try {
      const fuId = 'fu-' + Date.now();
      const newTask = {
        id: fuId,
        patientId: patient.id,
        patientName: patient.name,
        patientAddress: patient.address,
        assignedWorker: patient.assignedAsha || 'Smt. Kavitha M. (ASHA Worker)',
        workerContact: '+91 98455 12099',
        taskType,
        frequency,
        dueDate,
        status: 'Pending',
        instructions,
        createdDate: new Date().toISOString().split('T')[0]
      };

      await dbPut('followups', newTask);
      await enqueueSyncAction('CREATE_ASHA_TASK', { fuId, patientId: patient.id });

      setIsSaving(false);
      setInstructions('');
      setSuccessMsg(`Follow-up task dispatched to ${patient.assignedAsha || 'ASHA worker'}.`);
      onTaskCreated && onTaskCreated(newTask);
    } catch (err) {
      console.error(err);
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* TASK DISPATCH FORM */}
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

        <form onSubmit={handleCreateTask}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Task Objective *</label>
              <select 
                className="form-select"
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
              >
                <option value="Blood Pressure & Blood Glucose Check">Blood Pressure & Blood Glucose Check</option>
                <option value="Antenatal High-Risk Home Visit">Antenatal High-Risk Home Visit</option>
                <option value="Medication Adherence & Pill Count">Medication Adherence & Pill Count</option>
                <option value="District Hospital Referral Briefing & Token Handover">District Hospital Referral Briefing & Token Handover</option>
                <option value="Post-Operative Wound / Suture Inspection">Post-Operative Wound / Suture Inspection</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Frequency</label>
              <select 
                className="form-select"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              >
                <option value="Every 7 Days">Every 7 Days</option>
                <option value="Bi-weekly">Bi-weekly (Every 14 Days)</option>
                <option value="Monthly">Monthly</option>
                <option value="One-time Visit">One-time Visit</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Due Date *</label>
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
            <label className="form-label">Specific Clinical Instructions for Village ASHA Worker *</label>
            <textarea 
              className="form-textarea"
              placeholder="e.g. Check sitting BP twice after 5 min rest. Verify if morning Metformin & Telmisartan are being taken regularly without missing doses."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={2}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-page)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', marginBottom: '1.25rem', fontSize: '0.8125rem' }}>
            <span>Assigned Worker: <strong>{patient?.assignedAsha || 'Smt. Kavitha M. (ASHA Worker)'}</strong></span>
            <span style={{ color: 'var(--medical-teal-dark)' }}>Village: <strong>{patient?.address || 'Vokkaleri'}</strong></span>
          </div>

          <button 
            type="submit"
            disabled={isSaving}
            className="btn btn-teal btn-lg"
            style={{ width: '100%' }}
          >
            <Plus size={18} />
            <span>{isSaving ? 'Dispatching Task...' : 'Dispatch Follow-up Task to ASHA'}</span>
          </button>
        </form>
      </div>

      {/* ACTIVE TASKS LIST */}
      <div className="med-card">
        <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-navy-dark)', marginBottom: '1rem' }}>
          Current Community Tasks for {patient?.name} ({patientFollowups.length})
        </h4>

        {patientFollowups.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-subtle)' }}>
            No community follow-up tasks currently assigned.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {patientFollowups.map(fu => (
              <div 
                key={fu.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.15rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span className={`badge ${fu.status === 'Completed' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                    {fu.status}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                    Due: <strong>{fu.dueDate}</strong>
                  </span>
                </div>

                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--primary-navy-dark)', marginBottom: '0.25rem' }}>
                  {fu.taskType}
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                  {fu.instructions}
                </p>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                  Assigned: {fu.assignedWorker} ({fu.frequency})
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
