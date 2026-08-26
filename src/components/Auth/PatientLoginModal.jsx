import React, { useState, useEffect } from 'react';
import { X, User, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { dbGetAll, dbGetByIndex } from '../../services/db.js';

export const PatientLoginModal = ({ isOpen, onClose, onLoginSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoPatients, setDemoPatients] = useState([]);

  useEffect(() => {
    if (isOpen) {
      dbGetAll('patients').then(patients => {
        setDemoPatients(patients || []);
      }).catch(err => console.error(err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const allPatients = await dbGetAll('patients');
      const found = allPatients.find(p => p.email.toLowerCase() === email.toLowerCase().trim());

      if (found) {
        if (found.password && found.password !== password) {
          setErrorMsg('Invalid password. Please check and try again.');
          setIsSubmitting(false);
          return;
        }
        setIsSubmitting(false);
        onLoginSuccess(found);
      } else {
        setErrorMsg('No patient account found with this email. Please register or use sample login.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error querying IndexedDB.');
      setIsSubmitting(false);
    }
  };

  const handleSelectDemo = (patient) => {
    setEmail(patient.email);
    setPassword(patient.password || 'password123');
    onLoginSuccess(patient);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        
        {/* HEADER */}
        <div className="modal-header">
          <div>
            <span className="badge badge-info" style={{ marginBottom: '0.25rem' }}>Patient Portal</span>
            <h3 style={{ fontSize: '1.25rem', marginTop: '0.25rem', color: 'var(--primary-navy-dark)' }}>
              Login as Patient
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* 1-CLICK QUICK DEMO PATIENTS */}
        <div style={{
          backgroundColor: 'var(--accent-cyan-subtle)',
          border: '1px solid var(--accent-cyan-border)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.8125rem', marginBottom: '0.5rem' }}>
            <Sparkles size={14} />
            <span>1-Click Demo Patient Quick Login:</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {demoPatients.slice(0, 3).map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectDemo(p)}
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
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary-navy)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-light)'}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--primary-navy-dark)' }}>
                    {p.name} ({p.age}y, {p.gender})
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                    {p.chronicConditions ? p.chronicConditions.slice(0, 2).join(', ') : 'Registered Patient'}
                  </div>
                </div>
                <ArrowRight size={14} color="var(--primary-navy)" />
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
              <User size={15} />
              <span>Email Address</span>
            </label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="e.g. rameshwar.gowda@gmail.com" 
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
              className="btn btn-primary btn-lg" 
              style={{ width: '100%' }}
            >
              {isSubmitting ? 'Verifying Credentials...' : 'Sign In to Patient Record'}
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              New patient?{' '}
              <button 
                type="button" 
                onClick={onSwitchToRegister} 
                style={{ background: 'none', border: 'none', color: 'var(--medical-teal-dark)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Register New Patient
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
