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
      setErrorMsg('Error querying IndexedDB.');
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
            <span className="badge badge-teal" style={{ marginBottom: '0.25rem' }}>Healthcare Professional</span>
            <h3 style={{ fontSize: '1.25rem', marginTop: '0.25rem', color: 'var(--primary-navy-dark)' }}>
              Login as Doctor
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
            <span>1-Click Demo Practitioner Quick Login:</span>
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
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                    {d.currentPlaceOfPractice} • UID: {d.uid}
                  </div>
                </div>
                <ArrowRight size={14} color="var(--medical-teal)" />
              </button>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div style={{
            backgroundColor: 'var(--urgent-bg)',
            border: '1px solid var(--urgent-border)',
            color: 'var(--urgent-red)',
            padding: '0.65rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Stethoscope size={15} />
              <span>Registered Email</span>
            </label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="e.g. dr.ramesh@medisetu.org" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Lock size={15} />
              <span>Password</span>
            </label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="btn btn-teal btn-lg" 
              style={{ width: '100%' }}
            >
              {isSubmitting ? 'Authenticating Practitioner...' : 'Sign In as Doctor'}
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              New practitioner?{' '}
              <button 
                type="button" 
                onClick={onSwitchToRegister} 
                style={{ background: 'none', border: 'none', color: 'var(--primary-navy)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Register as Doctor
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
