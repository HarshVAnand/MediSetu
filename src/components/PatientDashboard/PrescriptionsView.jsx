import React, { useState } from 'react';
import { Pill, Clock, Sun, Moon, CheckCircle2, AlertTriangle, Calendar, RefreshCw, Check } from 'lucide-react';

export const PrescriptionsView = ({ prescriptions = [], patient }) => {
  const [loggedDoses, setLoggedDoses] = useState({});

  const activePrescriptions = prescriptions.filter(p => p.status === 'Active');
  const archivedPrescriptions = prescriptions.filter(p => p.status !== 'Active');

  const toggleDose = (drugKey) => {
    setLoggedDoses(prev => ({
      ...prev,
      [drugKey]: !prev[drugKey]
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* TODAY'S DOSAGE TIMETABLE */}
      <div className="med-card" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f0fdfa 100%)', border: '1px solid #99f6e4' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <span className="badge badge-teal" style={{ marginBottom: '0.25rem' }}>Daily Regimen</span>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={20} color="var(--medical-teal)" />
              <span>Today's Medication Schedule</span>
            </h3>
          </div>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Date: <strong>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
          </span>
        </div>

        {/* SCHEDULE SLOTS GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          
          {/* MORNING SLOT */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem', color: '#d97706', fontWeight: 700, fontSize: '0.9375rem' }}>
              <Sun size={18} />
              <span>Morning (Before & After Breakfast)</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {activePrescriptions.flatMap(p => p.drugs || []).filter(d => d.schedule?.morning).map((drug, didx) => {
                const key = `morn-${didx}-${drug.name}`;
                const isTaken = !!loggedDoses[key];

                return (
                  <div 
                    key={key}
                    onClick={() => toggleDose(key)}
                    style={{
                      background: isTaken ? 'var(--success-bg)' : 'var(--bg-page)',
                      border: `1px solid ${isTaken ? 'var(--success-border)' : 'var(--border-medium)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '0.65rem 0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: isTaken ? 'var(--success-green)' : 'var(--primary-navy-dark)' }}>
                        {drug.name} ({drug.dosage})
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                        {drug.timing} • {drug.instructions || 'With water'}
                      </div>
                    </div>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: isTaken ? 'var(--success-green)' : 'var(--bg-surface)',
                      border: `2px solid ${isTaken ? 'var(--success-green)' : 'var(--border-medium)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff'
                    }}>
                      {isTaken && <Check size={14} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AFTERNOON / MID-DAY */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.9375rem' }}>
              <Sun size={18} />
              <span>Afternoon (Post Lunch)</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {activePrescriptions.flatMap(p => p.drugs || []).filter(d => d.schedule?.afternoon).length === 0 ? (
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)', fontStyle: 'italic', padding: '0.5rem 0' }}>
                  No afternoon medications scheduled today.
                </div>
              ) : (
                activePrescriptions.flatMap(p => p.drugs || []).filter(d => d.schedule?.afternoon).map((drug, didx) => {
                  const key = `afternoon-${didx}-${drug.name}`;
                  const isTaken = !!loggedDoses[key];

                  return (
                    <div 
                      key={key}
                      onClick={() => toggleDose(key)}
                      style={{
                        background: isTaken ? 'var(--success-bg)' : 'var(--bg-page)',
                        border: `1px solid ${isTaken ? 'var(--success-border)' : 'var(--border-medium)'}`,
                        borderRadius: 'var(--radius-md)',
                        padding: '0.65rem 0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--primary-navy-dark)' }}>
                          {drug.name} ({drug.dosage})
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                          {drug.timing}
                        </div>
                      </div>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: isTaken ? 'var(--success-green)' : 'var(--bg-surface)',
                        border: `2px solid ${isTaken ? 'var(--success-green)' : 'var(--border-medium)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff'
                      }}>
                        {isTaken && <Check size={14} />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* NIGHT / BEDTIME */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem', color: 'var(--primary-navy)', fontWeight: 700, fontSize: '0.9375rem' }}>
              <Moon size={18} />
              <span>Night (After Dinner / Bedtime)</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {activePrescriptions.flatMap(p => p.drugs || []).filter(d => d.schedule?.night).map((drug, didx) => {
                const key = `night-${didx}-${drug.name}`;
                const isTaken = !!loggedDoses[key];

                return (
                  <div 
                    key={key}
                    onClick={() => toggleDose(key)}
                    style={{
                      background: isTaken ? 'var(--success-bg)' : 'var(--bg-page)',
                      border: `1px solid ${isTaken ? 'var(--success-border)' : 'var(--border-medium)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '0.65rem 0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: isTaken ? 'var(--success-green)' : 'var(--primary-navy-dark)' }}>
                        {drug.name} ({drug.dosage})
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                        {drug.timing} • {drug.instructions || 'Before sleep'}
                      </div>
                    </div>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: isTaken ? 'var(--success-green)' : 'var(--bg-surface)',
                      border: `2px solid ${isTaken ? 'var(--success-green)' : 'var(--border-medium)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff'
                    }}>
                      {isTaken && <Check size={14} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* DETAILED ACTIVE PRESCRIPTION CARDS */}
      <div>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-navy-dark)', marginBottom: '1rem' }}>
          Active Prescription Details ({activePrescriptions.length})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {activePrescriptions.map(pres => (
            <div key={pres.id} className="med-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>ACTIVE</span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                    Prescribed on {pres.date} by <strong>{pres.doctorName}</strong> ({pres.facilityName})
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                  Refill Due: <strong style={{ color: 'var(--warning-amber)' }}>{pres.drugs?.[0]?.refillDue || 'In 14 days'}</strong>
                </span>
              </div>

              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--primary-navy-dark)', marginBottom: '0.5rem' }}>
                Diagnosis: {pres.diagnosis}
              </div>

              {pres.notes && (
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.75rem', background: 'var(--bg-page)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  <strong>Doctor Advice:</strong> {pres.notes}
                </p>
              )}

              {/* TABLE OF DRUGS */}
              <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', textAlign: 'left' }}>
                  <thead style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
                    <tr>
                      <th style={{ padding: '0.45rem 0.75rem' }}>Medicine Name</th>
                      <th style={{ padding: '0.45rem 0.75rem' }}>Strength</th>
                      <th style={{ padding: '0.45rem 0.75rem' }}>Schedule</th>
                      <th style={{ padding: '0.45rem 0.75rem' }}>Duration</th>
                      <th style={{ padding: '0.45rem 0.75rem' }}>Instructions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pres.drugs?.map((d, didx) => (
                      <tr key={didx} style={{ borderTop: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '0.45rem 0.75rem', fontWeight: 600, color: 'var(--primary-navy-dark)' }}>
                          {d.name}
                        </td>
                        <td style={{ padding: '0.45rem 0.75rem' }}>{d.dosage}</td>
                        <td style={{ padding: '0.45rem 0.75rem' }}>
                          <span style={{ fontWeight: 600, color: 'var(--medical-teal-dark)' }}>
                            {d.schedule?.morning ? '1' : '0'}-{d.schedule?.afternoon ? '1' : '0'}-{d.schedule?.night ? '1' : '0'}
                          </span>
                        </td>
                        <td style={{ padding: '0.45rem 0.75rem' }}>{d.duration}</td>
                        <td style={{ padding: '0.45rem 0.75rem', color: 'var(--text-muted)' }}>{d.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
