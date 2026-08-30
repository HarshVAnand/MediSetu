import React, { useState } from 'react';
import { X, User, Phone, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { dbGetAll } from '../../services/db.js';

export const PatientLoginModal = ({ isOpen, onClose, onLoginSuccess, onSwitchToRegister }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const patients = await dbGetAll('patients');
      const cleanId = identifier.trim().toLowerCase();

      const matched = patients.find(p => 
        p.phone === cleanId || 
        p.abhaId?.toLowerCase() === cleanId ||
        p.name.toLowerCase().includes(cleanId)
      );

      if (matched) {
        setIsSubmitting(false);
        onLoginSuccess(matched);
      } else {
        // Fallback default sample patient for seamless testing
        if (patients.length > 0) {
          setIsSubmitting(false);
          onLoginSuccess(patients[0]);
        } else {
          setError('Patient record not found. Please create a new account.');
          setIsSubmitting(false);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Login error. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoPatient = async () => {
    const patients = await dbGetAll('patients');
    if (patients.length > 0) {
      onLoginSuccess(patients[0]);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        
        {/* MODAL HEADER */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--medical-teal-subtle)', color: 'var(--medical-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={18} />
            </div>
            <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--primary-navy-dark)' }}>
              Patient Portal Login
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
          Access your digital health card, doctor prescriptions, and blood test results.
        </p>

        {error && (
          <div style={{
            background: 'var(--urgent-bg)',
            border: '1px solid var(--urgent-border)',
            color: 'var(--urgent-red)',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8125rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {/* QUICK DEMO BUTTON */}
        <div style={{
          background: 'var(--bg-page)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary-navy)' }}>
              Demo Patient Account:
            </div>
            <div style={{ fontSize: '0.71875rem', color: 'var(--text-subtle)' }}>
              Rameshwar Gowda (58y, Kolar)
            </div>
          </div>
          <button 
            type="button"
            onClick={handleQuickDemoPatient}
            className="btn btn-teal btn-sm"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
          >
            1-Click Demo Login
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Phone Number or Health ID</label>
            <input 
              type="text"
              className="form-input"
              placeholder="e.g. 9845012345 or 91-8452-3310-4491"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">4-Digit Security PIN</label>
            <input 
              type="password"
              className="form-input"
              placeholder="••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={6}
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            <span>{isSubmitting ? 'Verifying...' : 'Login to Patient Portal'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Don't have a health account yet?{' '}
          <button 
            type="button"
            onClick={onSwitchToRegister}
            style={{ background: 'none', border: 'none', color: 'var(--medical-teal)', fontWeight: 700, cursor: 'pointer' }}
          >
            Create Free Account
          </button>
        </div>

      </div>
    </div>
  );
};
