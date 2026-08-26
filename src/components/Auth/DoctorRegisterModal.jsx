import React, { useState } from 'react';
import { X, Stethoscope, Award, Building2, ShieldCheck, AlertCircle } from 'lucide-react';
import { dbPut, enqueueSyncAction } from '../../services/db.js';

export const DoctorRegisterModal = ({ isOpen, onClose, onRegisterSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    email: '',
    password: '',
    uid: '',
    currentPlaceOfPractice: 'Kolar Sub-Divisional Primary Health Centre (PHC)',
    qualifications: '',
    specialization: 'General Medicine & Rural Health',
    phone: '',
    experienceYears: '10'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleQuickFillDoctor = () => {
    setFormData({
      name: 'Dr. Ramesh Kumar',
      age: '41',
      gender: 'Male',
      email: 'dr.ramesh@medisetu.org',
      password: 'doctor123',
      uid: 'HPR-KMC-77419',
      currentPlaceOfPractice: 'Kolar Sub-Divisional Primary Health Centre (PHC)',
      qualifications: 'MBBS, DNB (Family Medicine)',
      specialization: 'General Medicine & Rural Health',
      phone: '+91 94498 11200',
      experienceYears: '14'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name || !formData.age || !formData.uid || !formData.currentPlaceOfPractice || !formData.qualifications || !formData.email || !formData.password) {
      setErrorMsg('Please fill in all mandatory doctor registration fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const doctorId = 'doc-' + Date.now();
      const newDoctor = {
        id: doctorId,
        name: formData.name.startsWith('Dr.') ? formData.name : `Dr. ${formData.name}`,
        age: parseInt(formData.age, 10),
        gender: formData.gender,
        email: formData.email,
        password: formData.password,
        uid: formData.uid,
        currentPlaceOfPractice: formData.currentPlaceOfPractice,
        qualifications: formData.qualifications,
        specialization: formData.specialization,
        phone: formData.phone || '+91 94000 00000',
        experienceYears: parseInt(formData.experienceYears, 10) || 5,
        dutyFacilityId: 'fac-phc-01',
        consultationSlotsToday: 20,
        activeReferralsCount: 4
      };

      await dbPut('doctors', newDoctor);
      await enqueueSyncAction('DOCTOR_REGISTER', { doctorId, name: newDoctor.name, uid: newDoctor.uid });

      setIsSubmitting(false);
      onRegisterSuccess(newDoctor);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to save doctor to IndexedDB.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        
        {/* HEADER */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-teal">Healthcare Professional Onboarding</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', marginTop: '0.25rem', color: 'var(--primary-navy-dark)' }}>
              Register as Doctor / Medical Officer
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* QUICK AUTOFILL */}
        <div style={{
          backgroundColor: 'var(--medical-teal-subtle)',
          border: '1px solid #99f6e4',
          borderRadius: 'var(--radius-md)',
          padding: '0.65rem 0.95rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem'
        }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--medical-teal-dark)', fontWeight: 600 }}>
            Want to test quickly with sample doctor credentials?
          </span>
          <button 
            type="button" 
            onClick={handleQuickFillDoctor} 
            className="btn btn-sm btn-teal"
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
          >
            Auto-fill Doctor
          </button>
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

        {/* REGISTRATION FORM */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.85rem' }}>
            <div className="form-group">
              <label className="form-label">Doctor Name *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Dr. Ramesh Kumar" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Age *</label>
              <input 
                type="number" 
                className="form-input" 
                placeholder="41" 
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select 
                className="form-select"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.85rem' }}>
            <div className="form-group">
              <label className="form-label">UID (HPR / State Medical Council Reg No.) *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. HPR-KMC-77419" 
                value={formData.uid}
                onChange={(e) => setFormData({ ...formData, uid: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Qualifications *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. MBBS, MD, DNB" 
                value={formData.qualifications}
                onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Current Place of Practice (Facility / Clinic) *</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Kolar Sub-Divisional Primary Health Centre (PHC)" 
              value={formData.currentPlaceOfPractice}
              onChange={(e) => setFormData({ ...formData, currentPlaceOfPractice: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.85rem' }}>
            <div className="form-group">
              <label className="form-label">Specialization / Department</label>
              <select 
                className="form-select"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              >
                <option value="General Medicine & Rural Health">General Medicine & Rural Health</option>
                <option value="Cardiology & Critical Care">Cardiology & Critical Care</option>
                <option value="Obstetrics & Gynaecology">Obstetrics & Gynaecology</option>
                <option value="Paediatrics & Neonatology">Paediatrics & Neonatology</option>
                <option value="Emergency Surgery & Trauma">Emergency Surgery & Trauma</option>
                <option value="Pulmonology & Chest Medicine">Pulmonology & Chest Medicine</option>
                <option value="Community Health Officer">Community Health Officer (CHO)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Years of Experience</label>
              <input 
                type="number" 
                className="form-input" 
                placeholder="14" 
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.85rem' }}>
            <div className="form-group">
              <label className="form-label">Official Email (for Login) *</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="dr.ramesh@medisetu.org" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="btn btn-teal btn-lg" 
              style={{ width: '100%' }}
            >
              {isSubmitting ? 'Registering Practitioner Profile...' : 'Complete Doctor Registration'}
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Already registered?{' '}
              <button 
                type="button" 
                onClick={onSwitchToLogin} 
                style={{ background: 'none', border: 'none', color: 'var(--primary-navy)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Login as Doctor
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
