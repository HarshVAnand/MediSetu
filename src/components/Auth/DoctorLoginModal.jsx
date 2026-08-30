import React, { useState, useEffect } from 'react';
import { X, Stethoscope, Lock, ArrowRight, AlertCircle, Sparkles, Building2 } from 'lucide-react';
import { dbGetAll } from '../../services/db.js';

export const DoctorLoginModal = ({ isOpen, onClose, onLoginSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoDoctors, setDemoDoctors] = useState([]);

  useEffect(() => {
    if (isOpen) {
      dbGetAll('doctors').then(docs => {
        setDemoDoctors(docs || []);
      }).catch(err => console.error(err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const allDoctors = await dbGetAll('doctors');
      const found = allDoctors.find(d => d.email.toLowerCase() === email.toLowerCase().trim());

      if (found) {
        if (found.password && found.password !== password) {
          setErrorMsg('Invalid password. Please verify and try again.');
          setIsSubmitting(false);
          return;
        }
        setIsSubmitting(false);
        onLoginSuccess(found);
      } else {
        setErrorMsg('No doctor account found with this email. Please register or use sample login.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error checking login.');
      setIsSubmitting(false);
    }
  };

  const handleSelectDemo = (doctor) => {
    setEmail(doctor.email);
    setPassword(doctor.password || "");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        
        {/* HEADER */}
        <div className="modal-header">
          <div>
            <span className="badge badge-teal" style={{ marginBottom: '0.25rem' }}>Doctor & Health Worker Portal</span>
            <h3 style={{ fontSize: '1.25rem', marginTop: '0.25rem', color: 'var(--primary-navy-dark)' }}>
              Doctor Login
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* 1-CLICK QUICK DEMO DOCTOR SELECTOR */}
        <div style={{
          backgroundColor: 'var(--medical-teal-subtle)',
          border: '1px solid #99f6e4',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--medical-teal-dark)', fontWeight: 700, fontSize: '0.8125rem', marginBottom: '0.5rem' }}>
            <Sparkles size={14} />
            <span>1-Click Sample Doctor Login:</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {demoDoctors.slice(0, 3).map(d => (
              <button
                key={d.id}
                type="button"
                onClick={() => handleSelectDemo(d)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.45rem 0.65rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'border-color 0.15s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--medical-teal)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-light)'}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--primary-navy-dark)' }}>
                    {d.name} ({d.qualifications})
                  </div>
                  <div style={{ fontSize: '0.71875rem', color: 'var(--text-subtle)' }}>
                    {d.specialization} • {d.currentPlaceOfPractice}
                  </div>
                </div>
                <span className="badge badge-teal" style={{ fontSize: '0.65rem' }}>
                  Select
                </span>
              </button>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div style={{
            background: 'var(--urgent-bg)',
            border: '1px solid var(--urgent-border)',
            color: 'var(--urgent-red)',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8125rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <AlertCircle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Doctor Email / Login ID *</label>
            <input 
              type="email"
              className="form-input"
              placeholder="e.g. dr.ramesh.kumar@medisetu.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input 
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            <span>{isSubmitting ? 'Logging In...' : 'Open Doctor Portal'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Need to register your clinic or practice?{' '}
          <button 
            type="button"
            onClick={onSwitchToRegister}
            style={{ background: 'none', border: 'none', color: 'var(--medical-teal)', fontWeight: 700, cursor: 'pointer' }}
          >
            Register here
          </button>
        </div>

      </div>
    </div>
  );
};
