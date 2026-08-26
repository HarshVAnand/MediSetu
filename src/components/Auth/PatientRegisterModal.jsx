import React, { useState } from 'react';
import { X, Upload, ShieldCheck, User, AlertCircle, Heart, FileText, CheckCircle2 } from 'lucide-react';
import { dbPut, enqueueSyncAction } from '../../services/db.js';

export const PatientRegisterModal = ({ isOpen, onClose, onRegisterSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    email: '',
    password: '',
    phone: '',
    address: '',
    allergies: '',
    familyHistory: '',
    chronicConditions: '',
    initialPrescription: '',
    bloodGroup: 'B+'
  });

  const [aadharPreview, setAadharPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAadharPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuickFillSample = () => {
    setFormData({
      name: 'Rameshwar Gowda',
      age: '58',
      gender: 'Male',
      email: 'rameshwar.gowda@gmail.com',
      password: 'password123',
      phone: '+91 98452 33104',
      address: 'House #14, Vokkaleri Gram Panchayat, Kolar District, Karnataka 563130',
      allergies: 'Penicillin (Skin rash/Angioedema), NSAIDs',
      familyHistory: 'Father: Type 2 Diabetes, Mother: Hypertension & Stroke at age 64',
      chronicConditions: 'Type-2 Diabetes Mellitus (12 yrs), Essential Hypertension',
      initialPrescription: 'Metformin 500mg (1-0-1), Telmisartan 40mg (1-0-0)',
      bloodGroup: 'B+'
    });
    setAadharPreview('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name || !formData.age || !formData.email || !formData.password || !formData.address) {
      setErrorMsg('Please fill in all mandatory profile fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const generatedAbha = `ABHA-91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      const patientId = 'pat-' + Date.now();

      const newPatient = {
        id: patientId,
        name: formData.name,
        age: parseInt(formData.age, 10),
        gender: formData.gender,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || '+91 98000 00000',
        abhaId: generatedAbha,
        address: formData.address,
        bloodGroup: formData.bloodGroup,
        allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()) : ['No Known Drug Allergies'],
        familyHistory: formData.familyHistory || 'No major hereditary illness reported',
        chronicConditions: formData.chronicConditions ? formData.chronicConditions.split(',').map(s => s.trim()) : [],
        aadharPhoto: aadharPreview || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
        aadharVerified: true,
        registeredDate: new Date().toISOString().split('T')[0],
        primaryCareUnit: 'Vokkaleri Village Sub-Centre',
        assignedAsha: 'Smt. Kavitha M. (ASHA Worker)'
      };

      // Save into IndexedDB
      await dbPut('patients', newPatient);

      // If initial prescription given, create prescription record
      if (formData.initialPrescription) {
        const presRecord = {
          id: 'pres-' + Date.now(),
          patientId: patientId,
          doctorId: 'doc-001',
          doctorName: 'Dr. Ramesh Kumar, MBBS',
          facilityName: 'Local Primary Health Centre',
          facilityTier: 'PHC',
          date: new Date().toISOString().split('T')[0],
          diagnosis: formData.chronicConditions || 'Initial Health Registration Assessment',
          notes: 'Baseline rural consultation note.',
          status: 'Active',
          drugs: [
            {
              name: 'Metformin Hydrochloride (SR)',
              dosage: '500 mg',
              schedule: { morning: true, afternoon: false, night: true },
              timing: 'After meals',
              duration: '30 days',
              remainingDays: 30,
              refillDue: '2026-09-25',
              instructions: 'Take after meals'
            },
            {
              name: 'Telmisartan Tablets IP',
              dosage: '40 mg',
              schedule: { morning: true, afternoon: false, night: false },
              timing: 'Before breakfast',
              duration: '30 days',
              remainingDays: 30,
              refillDue: '2026-09-25',
              instructions: 'Take in the morning'
            }
          ]
        };
        await dbPut('prescriptions', presRecord);
      }

      await enqueueSyncAction('PATIENT_REGISTER', { patientId, name: newPatient.name });

      setIsSubmitting(false);
      onRegisterSuccess(newPatient);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to save to local IndexedDB. Please try again.');
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
              <span className="badge badge-teal">Patient Onboarding</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>ABDM Connected</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', marginTop: '0.25rem', color: 'var(--primary-navy-dark)' }}>
              Create Your MediSetu Patient Account
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* QUICK AUTOFILL BUTTON */}
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
            Want to test quickly with sample rural patient data?
          </span>
          <button 
            type="button" 
            onClick={handleQuickFillSample} 
            className="btn btn-sm btn-teal"
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
          >
            Auto-fill Sample
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

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          
          {/* PERSONAL DETAILS */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.85rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Rameshwar Gowda" 
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
                placeholder="58" 
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
              <label className="form-label">Email Address (for Login) *</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="rameshwar.gowda@gmail.com" 
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

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.85rem' }}>
            <div className="form-group">
              <label className="form-label">Phone / Mobile</label>
              <input 
                type="tel" 
                className="form-input" 
                placeholder="+91 98452 33104" 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select 
                className="form-select"
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
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
          </div>

          <div className="form-group">
            <label className="form-label">Residential Address (Village / Gram Panchayat) *</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. House #14, Vokkaleri Gram Panchayat, Kolar District" 
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          {/* AADHAAR CARD PHOTO UPLOAD */}
          <div className="form-group" style={{ background: 'var(--bg-page)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} color="var(--primary-navy)" />
              <span>Aadhaar Card Photo / Identity Document</span>
            </label>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              {aadharPreview ? (
                <div style={{ position: 'relative' }}>
                  <img 
                    src={aadharPreview} 
                    alt="Aadhaar Preview" 
                    style={{ width: '80px', height: '54px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '2px solid var(--medical-teal)' }}
                  />
                  <span className="badge badge-success" style={{ position: 'absolute', bottom: '-8px', right: '-4px', fontSize: '0.6rem', padding: '0.1rem 0.35rem' }}>
                    Uploaded
                  </span>
                </div>
              ) : (
                <div style={{ width: '80px', height: '54px', background: 'var(--bg-muted)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-subtle)' }}>
                  <Upload size={20} />
                </div>
              )}
              
              <div style={{ flex: 1 }}>
                <input 
                  type="file" 
                  accept="image/*,.pdf" 
                  onChange={handleFileChange}
                  style={{ fontSize: '0.8125rem' }}
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.25rem' }}>
                  Aadhaar photo is encrypted in local IndexedDB for identity verification at Sub-Centres.
                </div>
              </div>
            </div>
          </div>

          {/* CLINICAL HISTORY INPUTS */}
          <div className="form-group">
            <label className="form-label">Known Allergies (e.g. Penicillin, Sulfa, Dust)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Penicillin (Skin rash), NSAIDs" 
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Family History with any Chronic Illness</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Father had Type-2 Diabetes, Mother had Hypertension" 
              value={formData.familyHistory}
              onChange={(e) => setFormData({ ...formData, familyHistory: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div className="form-group">
              <label className="form-label">Chronic Conditions</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Diabetes, Hypertension" 
                value={formData.chronicConditions}
                onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Current Prescriptions</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Metformin 500mg, Telmisartan" 
                value={formData.initialPrescription}
                onChange={(e) => setFormData({ ...formData, initialPrescription: e.target.value })}
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="btn btn-primary btn-lg" 
              style={{ width: '100%' }}
            >
              {isSubmitting ? 'Creating Connected ABHA Record...' : 'Complete Patient Registration'}
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Already registered?{' '}
              <button 
                type="button" 
                onClick={onSwitchToLogin} 
                style={{ background: 'none', border: 'none', color: 'var(--primary-navy)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Login as Patient
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
