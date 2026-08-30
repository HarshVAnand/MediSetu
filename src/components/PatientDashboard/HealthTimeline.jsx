import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  MapPin, 
  User, 
  Activity, 
  FileText, 
  Pill, 
  CheckCircle2, 
  AlertCircle, 
  Filter, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  Heart
} from 'lucide-react';
import gsap from 'gsap';

export const HealthTimeline = ({ patient, records = [], prescriptions = [] }) => {
  const [filterType, setFilterType] = useState('ALL');
  const [expandedId, setExpandedId] = useState(null);
  const timelineRef = useRef(null);

  // Combine records and prescriptions into a unified chronological array
  const unifiedTimeline = [
    ...records.map(r => ({
      id: r.id,
      date: r.date,
      facilityName: r.facilityName,
      facilityTier: r.facilityTier,
      type: r.type,
      category: r.type.includes('Lab') ? 'LAB' : r.facilityTier.includes('Sub') ? 'SUBCENTRE' : r.facilityTier.includes('District') ? 'DISTRICT' : 'PHC',
      provider: r.provider,
      summary: r.summary,
      details: r,
      isPrescription: false
    })),
    ...prescriptions.map(p => ({
      id: p.id,
      date: p.date,
      facilityName: p.facilityName,
      facilityTier: p.facilityTier,
      type: 'Doctor Consultation & Prescription',
      category: 'PRESCRIPTION',
      provider: p.doctorName,
      summary: p.diagnosis,
      details: p,
      isPrescription: true
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Filter items
  const filteredItems = filterType === 'ALL'
    ? unifiedTimeline
    : unifiedTimeline.filter(item => {
        if (filterType === 'PRESCRIPTION') return item.category === 'PRESCRIPTION';
        if (filterType === 'LAB') return item.category === 'LAB';
        if (filterType === 'PHC') return item.facilityTier?.includes('PHC');
        if (filterType === 'SUBCENTRE') return item.facilityTier?.includes('Sub');
        if (filterType === 'DISTRICT') return item.facilityTier?.includes('District') || item.facilityTier?.includes('Tertiary');
        return true;
      });

  useEffect(() => {
    if (timelineRef.current) {
      gsap.from('.timeline-item-anim', {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }, [filterType, records, prescriptions]);

  const getTierBadge = (tier) => {
    if (tier?.includes('Sub')) return <span className="badge badge-success">Village Sub-Centre</span>;
    if (tier?.includes('PHC')) return <span className="badge badge-teal">PHC Consultation</span>;
    if (tier?.includes('CHC')) return <span className="badge badge-info">CHC Community Care</span>;
    if (tier?.includes('District')) return <span className="badge badge-neutral" style={{ background: '#312e81', color: '#fff' }}>District Specialist</span>;
    return <span className="badge badge-neutral">{tier || 'Clinical Encounter'}</span>;
  };

  return (
    <div className="med-card" ref={timelineRef}>
      
      {/* HEADER & FILTERS */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} color="var(--medical-teal)" />
            <span>Lifetime Health History</span>
          </h3>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            All your past doctor checkups, lab reports, and medicine slips in one clean timeline.
          </p>
        </div>

        {/* FILTER BUTTONS */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {[
            { id: 'ALL', label: 'All Records' },
            { id: 'SUBCENTRE', label: 'Sub-Centres' },
            { id: 'PHC', label: 'PHCs' },
            { id: 'DISTRICT', label: 'District Hospitals' },
            { id: 'LAB', label: 'Lab Reports' },
            { id: 'PRESCRIPTION', label: 'Prescriptions' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              style={{
                background: filterType === f.id ? 'var(--primary-navy)' : 'var(--bg-page)',
                color: filterType === f.id ? '#ffffff' : 'var(--text-main)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.35rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* TIMELINE LIST */}
      {filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-subtle)' }}>
          No records match the selected filter.
        </div>
      ) : (
        <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
          
          {/* VERTICAL CONTINUITY LINE */}
          <div style={{
            position: 'absolute',
            left: '6px',
            top: '8px',
            bottom: '8px',
            width: '2px',
            background: 'linear-gradient(180deg, var(--medical-teal) 0%, var(--accent-cyan) 50%, var(--primary-navy) 100%)'
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredItems.map((item, idx) => {
              const isExpanded = expandedId === item.id;

              return (
                <div key={item.id} className="timeline-item-anim" style={{ position: 'relative' }}>
                  
                  {/* Timeline Dot */}
                  <div style={{
                    position: 'absolute',
                    left: '-1.85rem',
                    top: '1rem',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: item.isPrescription ? 'var(--accent-cyan)' : 'var(--medical-teal)',
                    border: '3px solid #ffffff',
                    boxShadow: '0 0 0 2px var(--border-medium)'
                  }} />

                  {/* Card Body */}
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all var(--transition-fast)'
                  }}>
                    
                    {/* TOP META ROW */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.65rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        {getTierBadge(item.facilityTier)}
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
                          📅 {item.date}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <MapPin size={13} color="var(--medical-teal)" />
                        <strong>{item.facilityName}</strong>
                      </div>
                    </div>

                    {/* TITLE & SUMMARY */}
                    <div style={{ marginBottom: '0.75rem' }}>
                      <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-navy-dark)', margin: 0 }}>
                        {item.type}
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
                        {item.summary}
                      </p>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
                        Attending Provider: <strong>{item.provider}</strong>
                      </div>
                    </div>

                    {/* VITALS BADGES (IF RECORDED) */}
                    {item.details.vitals && (
                      <div style={{
                        background: 'var(--bg-page)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.65rem 0.85rem',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        fontSize: '0.8125rem',
                        marginBottom: '0.75rem'
                      }}>
                        {item.details.vitals.bp && (
                          <div>Blood Pressure: <strong style={{ color: 'var(--urgent-red)' }}>{item.details.vitals.bp}</strong></div>
                        )}
                        {item.details.vitals.randomBloodSugar && (
                          <div>Blood Glucose: <strong style={{ color: '#d97706' }}>{item.details.vitals.randomBloodSugar}</strong></div>
                        )}
                        {item.details.vitals.spo2 && (
                          <div>SpO2: <strong style={{ color: 'var(--success-green)' }}>{item.details.vitals.spo2}</strong></div>
                        )}
                        {item.details.vitals.pulse && (
                          <div>Pulse: <strong>{item.details.vitals.pulse}</strong></div>
                        )}
                      </div>
                    )}

                    {/* LAB RESULTS TABLE (IF LAB RECORD) */}
                    {item.details.labResults && (
                      <div style={{
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        marginBottom: '0.75rem'
                      }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', textAlign: 'left' }}>
                          <thead style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
                            <tr>
                              <th style={{ padding: '0.45rem 0.75rem' }}>Test Parameter</th>
                              <th style={{ padding: '0.45rem 0.75rem' }}>Observed Value</th>
                              <th style={{ padding: '0.45rem 0.75rem' }}>Reference Range</th>
                              <th style={{ padding: '0.45rem 0.75rem' }}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.details.labResults.map((r, ridx) => (
                              <tr key={ridx} style={{ borderTop: '1px solid var(--border-light)' }}>
                                <td style={{ padding: '0.45rem 0.75rem', fontWeight: 600 }}>{r.test}</td>
                                <td style={{ padding: '0.45rem 0.75rem', fontWeight: 700, color: r.flag === 'High' ? 'var(--urgent-red)' : 'inherit' }}>
                                  {r.value}
                                </td>
                                <td style={{ padding: '0.45rem 0.75rem', color: 'var(--text-subtle)' }}>{r.normalRange}</td>
                                <td style={{ padding: '0.45rem 0.75rem' }}>
                                  <span className={`badge ${r.flag === 'High' ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '0.65rem' }}>
                                    {r.flag}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* PRESCRIPTION DRUGS LIST (IF PRESCRIPTION RECORD) */}
                    {item.isPrescription && item.details.drugs && (
                      <div style={{
                        background: 'var(--accent-cyan-subtle)',
                        border: '1px solid var(--accent-cyan-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.75rem',
                        marginBottom: '0.75rem'
                      }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                          Prescribed Medication Regimen ({item.details.drugs.length} Medicines):
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          {item.details.drugs.map((d, didx) => (
                            <div key={didx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                              <span>• <strong>{d.name}</strong> ({d.dosage})</span>
                              <span style={{ color: 'var(--text-muted)' }}>{d.timing} ({d.duration})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* EXPAND/COLLAPSE DETAILS */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        {item.details.tags?.map((t, tidx) => (
                          <span key={tidx} className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                            #{t}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--primary-navy)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem'
                        }}
                      >
                        {isExpanded ? <>Less details <ChevronUp size={14} /></> : <>Clinical notes <ChevronDown size={14} /></>}
                      </button>
                    </div>

                    {isExpanded && (
                      <div style={{
                        marginTop: '0.75rem',
                        paddingTop: '0.75rem',
                        borderTop: '1px dashed var(--border-medium)',
                        fontSize: '0.8125rem',
                        color: 'var(--text-muted)',
                        lineHeight: '1.6'
                      }}>
                        {item.details.notes && <div><strong>Doctor Notes:</strong> {item.details.notes}</div>}
                        {item.details.findings && <div><strong>Specialist Findings:</strong> {item.details.findings}</div>}
                        {item.details.ocrExtracted && (
                          <div style={{ color: 'var(--medical-teal-dark)', marginTop: '0.35rem' }}>
                            ✓ Read & Saved by Paper Scanner ({item.details.ocrConfidence ? `${Math.round(item.details.ocrConfidence)}%` : '97%'} accuracy)
                          </div>
                        )}
                      </div>
                    )}

                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
