import React, { useState } from 'react';
import { X, User, Phone, MapPin, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { dbPut, enqueueSyncAction } from '../../services/db.js';

export const PatientRegisterModal = ({ isOpen, onClose, onRegisterSuccess, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [village, setVillage] = useState('Kolar Rural, Karnataka');
  const [allergies, setAllergies] = useState('No Known Drug Allergies (NKDA)');
  const [conditions, setConditions] = useState('General Health Checkup');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !phone) return;

    setIsSubmitting(true);

    try {
      const patientId = 'pat-' + Date.now();
      const generatedAbha = `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

      const newPatient = {
        id: patientId,
        name,
        age: parseInt(age, 10) || 45,
        gender,
        phone,
        bloodGroup,
        abhaId: generatedAbha,
        address: village,
        primaryCareUnit: 'Kolar Sub-Divisional Health Centre',
        assignedAsha: 'Smt. Kavitha M. (Village Health Worker)',
        allergies: allergies ? allergies.split(',').map(a => a.trim()) : ['No Known Drug Allergies (NKDA)'],
        chronicConditions: conditions ? conditions.split(',').map(c => c.trim()) : ['General Care'],
        aadharPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString()
      };

      await dbPut('patients', newPatient);
      await enqueueSyncAction('CREATE_PATIENT', { patientId, name });

      setIsSubmitting(false);
      onRegisterSuccess(newPatient);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        
        {/* MODAL HEADER */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--medical-teal-subtle)', color: 'var(--medical-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={18} />
            </div>
            <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--primary-navy-dark)' }}>
              Create Free Patient Account
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
          Connect your health records across clinics, pharmacies, and 60km nearby hospitals.
        </p>

        <form onSubmit={handleRegister}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
            <div>
              <label className="form-label">Full Name *</label>
              <input 
                type="text"
                className="form-input"
                placeholder="e.g. Rameshwar Gowda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">Age (Years) *</label>
              <input 
                type="number"
                className="form-input"
                placeholder="58"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
            <div>
              <label className="form-label">Gender</label>
              <select 
                className="form-select"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="form-label">Blood Group</label>
              <select 
                className="form-select"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div>
              <label className="form-label">Mobile Number *</label>
              <input 
                type="tel"
                className="form-input"
                placeholder="9845012345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Village / Town Address</label>
            <input 
              type="text"
              className="form-input"
              placeholder="e.g. Bangarapet Road, Kolar, Karnataka"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="form-label">Known Drug Allergies</label>
              <input 
                type="text"
                className="form-input"
                placeholder="e.g. Penicillin, Sulfa"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Existing Health Checkups</label>
              <input 
                type="text"
                className="form-input"
                placeholder="e.g. Diabetes, Blood Pressure"
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="btn btn-teal btn-lg"
            style={{ width: '100%' }}
          >
            <span>{isSubmitting ? 'Creating Profile...' : 'Generate Digital Health ID & Register'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <button 
            type="button"
            onClick={onSwitchToLogin}
            style={{ background: 'none', border: 'none', color: 'var(--medical-teal)', fontWeight: 700, cursor: 'pointer' }}
          >
            Login here
          </button>
        </div>

      </div>
    </div>
  );
};
