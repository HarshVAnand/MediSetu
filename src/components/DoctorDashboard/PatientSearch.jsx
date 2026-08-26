import React, { useState } from 'react';
import { Search, User, QrCode, Phone, ShieldCheck, ArrowRight, Clock } from 'lucide-react';
import { logSearchHistory } from '../../services/db.js';

export const PatientSearch = ({ patients = [], onSelectPatient, onOpenQRScanner }) => {
  const [query, setQuery] = useState('');

  const filteredPatients = query.trim() === ''
    ? []
    : patients.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.abhaId.toLowerCase().includes(query.toLowerCase()) ||
        p.phone.includes(query) ||
        p.address.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = (patient) => {
    logSearchHistory(query, 'patient-search', filteredPatients.length);
    onSelectPatient(patient);
    setQuery('');
  };

  return (
    <div className="med-card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        
        {/* MAIN SEARCH INPUT */}
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={18} color="var(--text-subtle)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            className="form-input"
            placeholder="Search patient by ABHA ID, Aadhaar, Phone number, or Name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>

        {/* QR SCANNER BUTTON */}
        <button 
          onClick={onOpenQRScanner}
          className="btn btn-secondary"
          title="Scan Patient ABHA QR Card"
          style={{ whiteSpace: 'nowrap' }}
        >
          <QrCode size={16} color="var(--primary-navy)" />
          <span>Scan ABHA QR</span>
        </button>

      </div>

      {/* INSTANT SEARCH RESULTS DROPDOWN */}
      {query.trim() !== '' && (
        <div style={{
          marginTop: '0.75rem',
          background: 'var(--bg-page)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '0.5rem',
          maxHeight: '260px',
          overflowY: 'auto'
        }}>
          {filteredPatients.length === 0 ? (
            <div style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-subtle)' }}>
              No matching patient found in local IndexedDB registry for "{query}".
            </div>
          ) : (
            filteredPatients.map(p => (
              <div
                key={p.id}
                onClick={() => handleSelect(p)}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginBottom: '0.35rem',
                  transition: 'border-color 0.15s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--medical-teal)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-light)'}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <strong style={{ fontSize: '0.875rem', color: 'var(--primary-navy-dark)' }}>{p.name}</strong>
                    <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>{p.age}y / {p.gender}</span>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--primary-navy)' }}>{p.abhaId}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    📍 {p.address} • Conditions: {p.chronicConditions?.join(', ') || 'None'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--medical-teal-dark)', fontSize: '0.8125rem', fontWeight: 600 }}>
                  <span>Open Dossier</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
