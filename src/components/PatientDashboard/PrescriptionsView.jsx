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
            <span className="badge badge-teal" style={{ marginBottom: '0.25rem' }}>Daily Schedule</span>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={20} color="var(--medical-teal)" />
              <span>Today's Medicine Schedule</span>
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
              <span>Afternoon (After Lunch)</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {activePrescriptions.flatMap(p => p.drugs || []).filter(d => d.schedule?.afternoon).length === 0 ? (
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)', fontStyle: 'italic', padding: '0.5rem 0' }}>
                  No afternoon medicines scheduled today.
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
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: isTaken ? 'var(--success-green)' : 'var(--primary-navy-dark)' }}>
                          {drug.name} ({drug.dosage})
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                          {drug.timing} • {drug.instructions}
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
              <span>Night (After Dinner & Bedtime)</span>
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
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: isTaken ? 'var(--success-green)' : 'var(--primary-navy-dark)' }}>
                        {drug.name} ({drug.dosage})
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                        {drug.timing} • {drug.instructions || 'Before bed'}
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

      {/* ACTIVE PRESCRIPTIONS LIST */}
      <div className="med-card">
        <div style={{ marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-navy-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Pill size={20} color="var(--primary-navy)" />
            <span>Active Doctor Prescriptions ({activePrescriptions.length})</span>
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {activePrescriptions.map(pres => (
            <div 
              key={pres.id} 
              style={{
                background: 'var(--bg-page)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary-navy-dark)' }}>
                    {pres.diagnosis}
                  </div>
                  <div style={{ fontSize: '0.78125rem', color: 'var(--text-muted)' }}>
                    Prescribed by <strong>{pres.doctorName}</strong> at {pres.facilityName}
                  </div>
                </div>
                <span className="badge badge-success">Active Schedule</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {pres.drugs?.map((drug, didx) => (
                  <div 
                    key={didx}
                    style={{
                      background: '#ffffff',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.65rem 0.85rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.8125rem'
                    }}
                  >
                    <div>
                      <strong>{drug.name}</strong> — {drug.dosage}
                      <div style={{ fontSize: '0.71875rem', color: 'var(--text-subtle)' }}>
                        {drug.timing} • {drug.instructions}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span className="badge badge-info" style={{ fontSize: '0.6875rem' }}>
                        {drug.duration || '30 days'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {pres.notes && (
                <div style={{ fontSize: '0.78125rem', color: 'var(--text-muted)', fontStyle: 'italic', borderLeft: '3px solid var(--medical-teal)', paddingLeft: '0.65rem' }}>
                  Doctor Advice: "{pres.notes}"
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
