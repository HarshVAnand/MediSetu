import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
import { 
  dbGetAll, 
  dbGetById, 
  dbPut, 
  getPendingSyncQueue, 
  markQueueItemSynced, 
  clearSyncedQueue 
} from './services/db.js';

// Layout Components
import { Navbar } from './components/Layout/Navbar.jsx';
import { Footer } from './components/Layout/Footer.jsx';
import { SyncBanner } from './components/Layout/SyncBanner.jsx';

// Landing Page Components
import { HeroSection } from './components/Landing/HeroSection.jsx';
import { HospitalFinder60km } from './components/Landing/HospitalFinder60km.jsx';
import { HowItWorks } from './components/Landing/HowItWorks.jsx';
import { RoleShowcase } from './components/Landing/RoleShowcase.jsx';
import { FeaturesGrid } from './components/Landing/FeaturesGrid.jsx';
import { StatsImpact } from './components/Landing/StatsImpact.jsx';
import { TrustSecurity } from './components/Landing/TrustSecurity.jsx';

// Auth Modals
import { PatientRegisterModal } from './components/Auth/PatientRegisterModal.jsx';
import { PatientLoginModal } from './components/Auth/PatientLoginModal.jsx';
import { DoctorRegisterModal } from './components/Auth/DoctorRegisterModal.jsx';
import { DoctorLoginModal } from './components/Auth/DoctorLoginModal.jsx';

// Patient Dashboard Components
import { PatientHeader } from './components/PatientDashboard/PatientHeader.jsx';
import { HealthTimeline } from './components/PatientDashboard/HealthTimeline.jsx';
import { PrescriptionsView } from './components/PatientDashboard/PrescriptionsView.jsx';
import { DocumentUploadOCR } from './components/PatientDashboard/DocumentUploadOCR.jsx';
import { ReferralTracker } from './components/PatientDashboard/ReferralTracker.jsx';
import { FacilityMap } from './components/PatientDashboard/FacilityMap.jsx';
import { PatientAIAssistant } from './components/PatientDashboard/PatientAIAssistant.jsx';

// Doctor Dashboard Components
import { DoctorHeader } from './components/DoctorDashboard/DoctorHeader.jsx';
import { PatientSearch } from './components/DoctorDashboard/PatientSearch.jsx';
import { AIRAGPatientDossier } from './components/DoctorDashboard/AIRAGPatientDossier.jsx';
import { CreatePrescription } from './components/DoctorDashboard/CreatePrescription.jsx';
import { IssueReferral } from './components/DoctorDashboard/IssueReferral.jsx';
import { ASHATaskDelegation } from './components/DoctorDashboard/ASHATaskDelegation.jsx';
import { DoctorFacilityNetwork } from './components/DoctorDashboard/DoctorFacilityNetwork.jsx';

// Common Modals & Toasts
import { Toast } from './components/Common/Toast.jsx';
import { QRModal } from './components/Common/QRModal.jsx';

// Icons
import { 
  Activity, 
  Pill, 
  Upload, 
  GitPullRequest, 
  MapPin, 
  Sparkles, 
  HeartHandshake, 
  Building2 
} from 'lucide-react';

/* =========================================================================
   PATIENT DASHBOARD ROUTE WRAPPER COMPONENT
   ========================================================================= */
function PatientDashboardWrapper({
  currentUser,
  currentRole,
  onOpenAuthModal,
  setQrModalOpen,
  refreshAllData,
  showToast,
  prescriptions,
  records,
  referrals,
  followups
}) {
  const { tab } = useParams();
  const navigate = useNavigate();
  const activePatientTab = tab || 'timeline';

  // If user is not logged in as a patient, prompt login
  if (currentRole !== 'patient' || !currentUser) {
    return (
      <div className="app-container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="med-card" style={{ maxWidth: '520px', margin: '0 auto', padding: '2.5rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--medical-teal-subtle)',
            color: 'var(--medical-teal)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}>
            <Activity size={32} />
          </div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-navy-dark)', marginBottom: '0.5rem' }}>
            Patient Portal Login Required
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Please log in or register to view your digital health record, prescriptions, and test results.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button 
              onClick={() => onOpenAuthModal('patient-login')}
              className="btn btn-teal"
            >
              Login with Phone / Health ID
            </button>
            <button 
              onClick={() => onOpenAuthModal('patient-register')}
              className="btn btn-secondary"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const patientPrescriptions = prescriptions.filter(p => p.patientId === currentUser.id);
  const patientRecords = records.filter(r => r.patientId === currentUser.id);
  const patientReferrals = referrals.filter(r => r.patientId === currentUser.id);
  const patientFollowups = followups.filter(f => f.patientId === currentUser.id);

  return (
    <div className="app-container" style={{ padding: '2rem 1.5rem' }}>
      {/* PATIENT HEADER CARD */}
      <PatientHeader 
        patient={currentUser}
        onOpenQRModal={() => setQrModalOpen(true)}
        onOpenUploadModal={() => navigate('/patient/upload')}
      />

      {/* DASHBOARD TAB NAVIGATION */}
      <div className="tabs-container">
        <button 
          onClick={() => navigate('/patient/timeline')}
          className={`tab-btn ${activePatientTab === 'timeline' ? 'active' : ''}`}
        >
          <Activity size={16} />
          <span>Health History</span>
        </button>

        <button 
          onClick={() => navigate('/patient/prescriptions')}
          className={`tab-btn ${activePatientTab === 'prescriptions' ? 'active' : ''}`}
        >
          <Pill size={16} />
          <span>Medicine Schedule</span>
        </button>

        <button 
          onClick={() => navigate('/patient/upload')}
          className={`tab-btn ${activePatientTab === 'upload' ? 'active' : ''}`}
        >
          <Upload size={16} />
          <span>Scan Doctor Slip</span>
        </button>

        <button 
          onClick={() => navigate('/patient/referrals')}
          className={`tab-btn ${activePatientTab === 'referrals' ? 'active' : ''}`}
        >
          <GitPullRequest size={16} />
          <span>Hospital Referrals ({patientReferrals.length})</span>
        </button>

        <button 
          onClick={() => navigate('/patient/facilities')}
          className={`tab-btn ${activePatientTab === 'facilities' ? 'active' : ''}`}
        >
          <MapPin size={16} />
          <span>Find Hospitals (60km)</span>
        </button>

        <button 
          onClick={() => navigate('/patient/assistant')}
          className={`tab-btn ${activePatientTab === 'assistant' ? 'active' : ''}`}
        >
          <Sparkles size={16} />
          <span>Ask Health Questions</span>
        </button>
      </div>

      {/* TAB CONTENTS */}
      {activePatientTab === 'timeline' && (
        <HealthTimeline 
          patient={currentUser}
          records={patientRecords}
          prescriptions={patientPrescriptions}
        />
      )}

      {activePatientTab === 'prescriptions' && (
        <PrescriptionsView 
          prescriptions={patientPrescriptions}
          patient={currentUser}
        />
      )}

      {activePatientTab === 'upload' && (
        <DocumentUploadOCR 
          patient={currentUser}
          onUploadComplete={(newRec) => {
            refreshAllData();
            showToast('success', 'Document Saved', 'Your doctor slip was read and added to your health history.');
            navigate('/patient/timeline');
          }}
        />
      )}

      {activePatientTab === 'referrals' && (
        <ReferralTracker 
          referrals={patientReferrals}
          followups={patientFollowups}
          patient={currentUser}
        />
      )}

      {activePatientTab === 'facilities' && (
        <FacilityMap />
      )}

      {activePatientTab === 'assistant' && (
        <PatientAIAssistant 
          patient={currentUser}
          prescriptions={patientPrescriptions}
          records={patientRecords}
        />
      )}
    </div>
  );
}

/* =========================================================================
   DOCTOR DASHBOARD ROUTE WRAPPER COMPONENT
   ========================================================================= */
function DoctorDashboardWrapper({
  currentUser,
  currentRole,
  onOpenAuthModal,
  setQrModalOpen,
  patients,
  activePatientForDoctor,
  setActivePatientForDoctor,
  refreshAllData,
  showToast,
  prescriptions,
  records,
  referrals,
  followups
}) {
  const { tab } = useParams();
  const navigate = useNavigate();
  const activeDoctorTab = tab || 'dossier';

  // If user is not logged in as a doctor, prompt login
  if (currentRole !== 'doctor' || !currentUser) {
    return (
      <div className="app-container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="med-card" style={{ maxWidth: '520px', margin: '0 auto', padding: '2.5rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--accent-cyan-subtle)',
            color: 'var(--primary-navy)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}>
            <Building2 size={32} />
          </div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-navy-dark)', marginBottom: '0.5rem' }}>
            Doctor & Specialist Login Required
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Please log in with your healthcare credentials to access clinical summaries, e-prescribing, and referrals.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button 
              onClick={() => onOpenAuthModal('doctor-login')}
              className="btn btn-outline-teal"
            >
              Doctor / Specialist Login
            </button>
            <button 
              onClick={() => onOpenAuthModal('doctor-register')}
              className="btn btn-teal"
            >
              Register as Healthcare Provider
            </button>
          </div>
        </div>
      </div>
    );
  }

  const patientPrescriptions = prescriptions.filter(p => p.patientId === activePatientForDoctor?.id);
  const patientRecords = records.filter(r => r.patientId === activePatientForDoctor?.id);
  const patientReferrals = referrals.filter(r => r.patientId === activePatientForDoctor?.id);
  const patientFollowups = followups.filter(f => f.patientId === activePatientForDoctor?.id);

  return (
    <div className="app-container" style={{ padding: '2rem 1.5rem' }}>
      {/* DOCTOR HEADER & ACTIVE CASE SWITCHER */}
      <DoctorHeader 
        doctor={currentUser}
        patients={patients}
        activePatient={activePatientForDoctor}
        onSelectPatient={(p) => setActivePatientForDoctor(p)}
      />

      {/* FAST PATIENT LOOKUP BAR */}
      <PatientSearch 
        patients={patients}
        onSelectPatient={(p) => {
          setActivePatientForDoctor(p);
          showToast('info', 'Patient Selected', `Loaded records for ${p.name}.`);
        }}
        onOpenQRScanner={() => setQrModalOpen(true)}
      />

      {/* DOCTOR DASHBOARD TABS */}
      <div className="tabs-container">
        <button 
          onClick={() => navigate('/doctor/dossier')}
          className={`tab-btn ${activeDoctorTab === 'dossier' ? 'active' : ''}`}
        >
          <Sparkles size={16} />
          <span>2-Second Patient Summary</span>
        </button>

        <button 
          onClick={() => navigate('/doctor/prescribe')}
          className={`tab-btn ${activeDoctorTab === 'prescribe' ? 'active' : ''}`}
        >
          <Pill size={16} />
          <span>Write Prescription</span>
        </button>

        <button 
          onClick={() => navigate('/doctor/referral')}
          className={`tab-btn ${activeDoctorTab === 'referral' ? 'active' : ''}`}
        >
          <Building2 size={16} />
          <span>Send to Hospital / Specialist</span>
        </button>

        <button 
          onClick={() => navigate('/doctor/asha-tasks')}
          className={`tab-btn ${activeDoctorTab === 'asha-tasks' ? 'active' : ''}`}
        >
          <HeartHandshake size={16} />
          <span>Assign Home Checkup (ASHA)</span>
        </button>

        <button 
          onClick={() => navigate('/doctor/timeline')}
          className={`tab-btn ${activeDoctorTab === 'timeline' ? 'active' : ''}`}
        >
          <Activity size={16} />
          <span>Health History</span>
        </button>

        <button 
          onClick={() => navigate('/doctor/network')}
          className={`tab-btn ${activeDoctorTab === 'network' ? 'active' : ''}`}
        >
          <MapPin size={16} />
          <span>60km Hospital Network</span>
        </button>
      </div>

      {/* TAB CONTENTS */}
      {activeDoctorTab === 'dossier' && (
        <AIRAGPatientDossier 
          patient={activePatientForDoctor}
          prescriptions={patientPrescriptions}
          records={patientRecords}
          referrals={patientReferrals}
        />
      )}

      {activeDoctorTab === 'prescribe' && (
        <CreatePrescription 
          doctor={currentUser}
          patient={activePatientForDoctor}
          onPrescriptionCreated={() => {
            refreshAllData();
            showToast('success', 'Prescription Saved', `Prescription saved to ${activePatientForDoctor?.name}'s file.`);
          }}
        />
      )}

      {activeDoctorTab === 'referral' && (
        <IssueReferral 
          doctor={currentUser}
          patient={activePatientForDoctor}
          onReferralCreated={() => {
            refreshAllData();
            showToast('success', 'Referral Sent', `Hospital referral created for ${activePatientForDoctor?.name}.`);
          }}
        />
      )}

      {activeDoctorTab === 'asha-tasks' && (
        <ASHATaskDelegation 
          doctor={currentUser}
          patient={activePatientForDoctor}
          followups={patientFollowups}
          onTaskCreated={() => {
            refreshAllData();
            showToast('success', 'Home Task Assigned', `Follow-up sent to ${activePatientForDoctor?.assignedAsha || 'ASHA worker'}.`);
          }}
        />
      )}

      {activeDoctorTab === 'timeline' && (
        <HealthTimeline 
          patient={activePatientForDoctor}
          records={patientRecords}
          prescriptions={patientPrescriptions}
        />
      )}

      {activeDoctorTab === 'network' && (
        <DoctorFacilityNetwork />
      )}
    </div>
  );
}

/* =========================================================================
   MAIN APP COMPONENT WITH REACT ROUTER
   ========================================================================= */
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation & Role State
  const [currentRole, setCurrentRole] = useState('guest'); // 'guest' | 'patient' | 'doctor'
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState('hero');

  // Active Patient for Doctor View
  const [activePatientForDoctor, setActivePatientForDoctor] = useState(null);

  // Network & Sync State
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  // Modals & Notifications
  const [activeAuthModal, setActiveAuthModal] = useState(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // IndexedDB Loaded Data Collections
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [records, setRecords] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [followups, setFollowups] = useState([]);

  // Initial Data Fetch from IndexedDB
  const refreshAllData = async () => {
    try {
      const [pats, docs, pres, recs, refs, fus, pending] = await Promise.all([
        dbGetAll('patients'),
        dbGetAll('doctors'),
        dbGetAll('prescriptions'),
        dbGetAll('records'),
        dbGetAll('referrals'),
        dbGetAll('followups'),
        getPendingSyncQueue()
      ]);

      setPatients(pats || []);
      setDoctors(docs || []);
      setPrescriptions(pres || []);
      setRecords(recs || []);
      setReferrals(refs || []);
      setFollowups(fus || []);
      setPendingSyncCount(pending ? pending.length : 0);

      // Default active patient for doctor if none chosen
      if (pats && pats.length > 0 && !activePatientForDoctor) {
        setActivePatientForDoctor(pats[0]);
      }
    } catch (err) {
      console.error('Error loading data from IndexedDB:', err);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Show toast helper
  const showToast = (type, title, message) => {
    setToast({ type, title, message });
  };

  // Sync Queue Processor
  const handleSyncNow = async () => {
    if (!isOnline) {
      showToast('warning', 'Offline Mode', 'Cannot sync while offline mode is active.');
      return;
    }

    setIsSyncing(true);
    try {
      const pending = await getPendingSyncQueue();
      for (const item of pending) {
        await markQueueItemSynced(item.id);
        await new Promise(r => setTimeout(r, 120));
      }

      await refreshAllData();
      setIsSyncing(false);
      showToast('success', 'Records Saved', 'All offline records saved and synced.');
    } catch (err) {
      console.error('Sync error:', err);
      setIsSyncing(false);
      showToast('urgent', 'Sync Failed', 'Could not sync records.');
    }
  };

  // Handle Auth Success
  const handlePatientLoginSuccess = (patient) => {
    setCurrentUser(patient);
    setCurrentRole('patient');
    setActiveAuthModal(null);
    showToast('success', 'Welcome Back', `Logged in as ${patient.name}.`);
    navigate('/patient/timeline');
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 0.8 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePatientRegisterSuccess = (newPatient) => {
    setCurrentUser(newPatient);
    setCurrentRole('patient');
    setActiveAuthModal(null);
    refreshAllData();
    showToast('success', 'Health Profile Created', `Welcome ${newPatient.name}! Your free health record is ready.`);
    navigate('/patient/timeline');
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 0.8 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDoctorLoginSuccess = (doctor) => {
    setCurrentUser(doctor);
    setCurrentRole('doctor');
    setActiveAuthModal(null);
    showToast('success', 'Doctor Logged In', `Welcome ${doctor.name}.`);
    navigate('/doctor/dossier');
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 0.8 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDoctorRegisterSuccess = (newDoctor) => {
    setCurrentUser(newDoctor);
    setCurrentRole('doctor');
    setActiveAuthModal(null);
    refreshAllData();
    showToast('success', 'Doctor Account Created', `Welcome ${newDoctor.name}.`);
    navigate('/doctor/dossier');
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 0.8 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    setCurrentRole('guest');
    setCurrentUser(null);
    setActiveSection('hero');
    showToast('info', 'Logged Out', 'Switched to MediSetu public view.');
    navigate('/');
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 0.8 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Smooth Section Navigation via Lenis & React Router
  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);

    if (sectionId === 'landing' || sectionId === 'hero') {
      if (location.pathname !== '/') {
        navigate('/');
      }
      setTimeout(() => {
        if (window.lenis) {
          window.lenis.scrollTo(0, { duration: 1.0 });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
      return;
    }

    if (sectionId === 'facilities') {
      if (location.pathname !== '/' && location.pathname !== '/facilities') {
        navigate('/facilities');
        return;
      }
      const el = document.getElementById('facilities');
      if (el) {
        if (window.lenis) {
          window.lenis.scrollTo(el, { offset: -70, duration: 1.0 });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
      return;
    }

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          if (window.lenis) {
            window.lenis.scrollTo(el, { offset: -70, duration: 1.0 });
          } else {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 100);
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      if (window.lenis) {
        window.lenis.scrollTo(el, { offset: -70, duration: 1.0 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="page-wrapper">
      
      {/* REAL-TIME SYNC & NETWORK BANNER */}
      <SyncBanner 
        isOnline={isOnline}
        onToggleNetwork={() => {
          const next = !isOnline;
          setIsOnline(next);
          showToast(next ? 'success' : 'warning', next ? 'Online Mode' : 'Offline Mode', next ? 'Connected to online cloud.' : 'Saving locally on this device.');
        }}
        pendingSyncCount={pendingSyncCount}
        onSyncNow={handleSyncNow}
        isSyncing={isSyncing}
      />

      {/* HEADER NAVBAR */}
      <Navbar 
        currentRole={currentRole}
        currentUser={currentUser}
        onNavigate={handleNavigate}
        activeSection={activeSection}
        onOpenAuthModal={(modalType) => setActiveAuthModal(modalType)}
        onLogout={handleLogout}
        onOpenQRModal={() => setQrModalOpen(true)}
        pendingSyncCount={pendingSyncCount}
      />

      {/* TOAST ALERTS */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* DIGITAL HEALTH CARD QR MODAL */}
      <QRModal 
        isOpen={qrModalOpen} 
        onClose={() => setQrModalOpen(false)}
        patient={currentRole === 'patient' ? currentUser : activePatientForDoctor}
      />

      {/* AUTH MODALS */}
      <PatientLoginModal 
        isOpen={activeAuthModal === 'patient-login'}
        onClose={() => setActiveAuthModal(null)}
        onLoginSuccess={handlePatientLoginSuccess}
        onSwitchToRegister={() => setActiveAuthModal('patient-register')}
      />

      <PatientRegisterModal 
        isOpen={activeAuthModal === 'patient-register'}
        onClose={() => setActiveAuthModal(null)}
        onRegisterSuccess={handlePatientRegisterSuccess}
        onSwitchToLogin={() => setActiveAuthModal('patient-login')}
      />

      <DoctorLoginModal 
        isOpen={activeAuthModal === 'doctor-login'}
        onClose={() => setActiveAuthModal(null)}
        onLoginSuccess={handleDoctorLoginSuccess}
        onSwitchToRegister={() => setActiveAuthModal('doctor-register')}
      />

      <DoctorRegisterModal 
        isOpen={activeAuthModal === 'doctor-register'}
        onClose={() => setActiveAuthModal(null)}
        onRegisterSuccess={handleDoctorRegisterSuccess}
        onSwitchToLogin={() => setActiveAuthModal('doctor-login')}
      />

      {/* MAIN ROUTED CONTENT */}
      <main style={{ flex: 1 }}>
        <Routes>
          {/* LANDING PAGE ROUTE */}
          <Route 
            path="/" 
            element={
              <div>
                <HeroSection 
                  onOpenAuthModal={(type) => setActiveAuthModal(type)}
                  onExploreMap={() => handleNavigate('facilities')}
                />
                <HospitalFinder60km />
                <HowItWorks />
                <RoleShowcase onOpenAuthModal={(type) => setActiveAuthModal(type)} />
                <FeaturesGrid />
                <StatsImpact />
                <TrustSecurity onOpenAuthModal={(type) => setActiveAuthModal(type)} />
              </div>
            } 
          />

          {/* DEDICATED FACILITY / HOSPITAL FINDER ROUTE */}
          <Route 
            path="/facilities" 
            element={
              <div>
                <div style={{ background: 'var(--primary-navy-dark)', color: '#fff', padding: '3rem 1.5rem 1rem', textAlign: 'center' }}>
                  <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
                    60km Hospital & Healthcare Network
                  </h1>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
                    Find government PHCs, sub-centres, blood banks, and multi-specialty hospitals within 60km.
                  </p>
                </div>
                <HospitalFinder60km />
              </div>
            } 
          />

          {/* PATIENT PORTAL ROUTES */}
          <Route 
            path="/patient" 
            element={
              <PatientDashboardWrapper 
                currentUser={currentUser}
                currentRole={currentRole}
                onOpenAuthModal={(modalType) => setActiveAuthModal(modalType)}
                setQrModalOpen={setQrModalOpen}
                refreshAllData={refreshAllData}
                showToast={showToast}
                prescriptions={prescriptions}
                records={records}
                referrals={referrals}
                followups={followups}
              />
            } 
          />

          <Route 
            path="/patient/:tab" 
            element={
              <PatientDashboardWrapper 
                currentUser={currentUser}
                currentRole={currentRole}
                onOpenAuthModal={(modalType) => setActiveAuthModal(modalType)}
                setQrModalOpen={setQrModalOpen}
                refreshAllData={refreshAllData}
                showToast={showToast}
                prescriptions={prescriptions}
                records={records}
                referrals={referrals}
                followups={followups}
              />
            } 
          />

          {/* DOCTOR PORTAL ROUTES */}
          <Route 
            path="/doctor" 
            element={
              <DoctorDashboardWrapper 
                currentUser={currentUser}
                currentRole={currentRole}
                onOpenAuthModal={(modalType) => setActiveAuthModal(modalType)}
                setQrModalOpen={setQrModalOpen}
                patients={patients}
                activePatientForDoctor={activePatientForDoctor}
                setActivePatientForDoctor={setActivePatientForDoctor}
                refreshAllData={refreshAllData}
                showToast={showToast}
                prescriptions={prescriptions}
                records={records}
                referrals={referrals}
                followups={followups}
              />
            } 
          />

          <Route 
            path="/doctor/:tab" 
            element={
              <DoctorDashboardWrapper 
                currentUser={currentUser}
                currentRole={currentRole}
                onOpenAuthModal={(modalType) => setActiveAuthModal(modalType)}
                setQrModalOpen={setQrModalOpen}
                patients={patients}
                activePatientForDoctor={activePatientForDoctor}
                setActivePatientForDoctor={setActivePatientForDoctor}
                refreshAllData={refreshAllData}
                showToast={showToast}
                prescriptions={prescriptions}
                records={records}
                referrals={referrals}
                followups={followups}
              />
            } 
          />

          {/* CATCH-ALL REDIRECT */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* FOOTER */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}
