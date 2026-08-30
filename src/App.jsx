import React, { useState, useEffect } from 'react';
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
  FileText, 
  UserCheck, 
  HeartHandshake, 
  Stethoscope, 
  Building2 
} from 'lucide-react';

export default function App() {
  // Navigation & Role State
  const [currentRole, setCurrentRole] = useState('guest'); // 'guest' | 'patient' | 'doctor'
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState('hero');

  // Active Patient for Doctor View
  const [activePatientForDoctor, setActivePatientForDoctor] = useState(null);

  // Dashboard Tabs
  const [activePatientTab, setActivePatientTab] = useState('timeline');
  const [activeDoctorTab, setActiveDoctorTab] = useState('dossier');

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
    setActivePatientTab('timeline');
    showToast('success', 'Welcome Back', `Logged in as ${patient.name}.`);
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
    setActiveDoctorTab('dossier');
    showToast('success', 'Doctor Logged In', `Welcome ${doctor.name}.`);
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
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 0.8 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Smooth Section Navigation via Lenis
  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);
    if (sectionId === 'landing' || sectionId === 'hero') {
      if (currentRole !== 'guest') setCurrentRole('guest');
      if (window.lenis) {
        window.lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      if (window.lenis) {
        window.lenis.scrollTo(el, { offset: -70, duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      if (window.lenis) {
        window.lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Filtered collections for active patient
  const patientPrescriptions = prescriptions.filter(p => p.patientId === (currentRole === 'patient' ? currentUser?.id : activePatientForDoctor?.id));
  const patientRecords = records.filter(r => r.patientId === (currentRole === 'patient' ? currentUser?.id : activePatientForDoctor?.id));
  const patientReferrals = referrals.filter(r => r.patientId === (currentRole === 'patient' ? currentUser?.id : activePatientForDoctor?.id));
  const patientFollowups = followups.filter(f => f.patientId === (currentRole === 'patient' ? currentUser?.id : activePatientForDoctor?.id));

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

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1 }}>
        
        {/* VIEW 1: LANDING PAGE (GUEST ROLE) */}
        {currentRole === 'guest' && (
          <div>
            <HeroSection 
              onOpenAuthModal={(type) => setActiveAuthModal(type)}
              onExploreMap={() => handleNavigate('facilities')}
            />
            
            {/* 60KM RADIUS HOSPITAL FINDER (GOVERNMENT & PRIVATE) */}
            <HospitalFinder60km />

            <HowItWorks />
            <RoleShowcase onOpenAuthModal={(type) => setActiveAuthModal(type)} />
            <FeaturesGrid />
            <StatsImpact />
            <TrustSecurity onOpenAuthModal={(type) => setActiveAuthModal(type)} />
          </div>
        )}

        {/* VIEW 2: PATIENT DASHBOARD */}
        {currentRole === 'patient' && currentUser && (
          <div className="app-container" style={{ padding: '2rem 1.5rem' }}>
            
            {/* PATIENT HEADER CARD */}
            <PatientHeader 
              patient={currentUser}
              onOpenQRModal={() => setQrModalOpen(true)}
              onOpenUploadModal={() => setActivePatientTab('upload')}
            />

            {/* DASHBOARD TAB NAVIGATION IN PLAIN TERMS */}
            <div className="tabs-container">
              <button 
                onClick={() => setActivePatientTab('timeline')}
                className={`tab-btn ${activePatientTab === 'timeline' ? 'active' : ''}`}
              >
                <Activity size={16} />
                <span>Health History</span>
              </button>

              <button 
                onClick={() => setActivePatientTab('prescriptions')}
                className={`tab-btn ${activePatientTab === 'prescriptions' ? 'active' : ''}`}
              >
                <Pill size={16} />
                <span>Medicine Schedule</span>
              </button>

              <button 
                onClick={() => setActivePatientTab('upload')}
                className={`tab-btn ${activePatientTab === 'upload' ? 'active' : ''}`}
              >
                <Upload size={16} />
                <span>Scan Doctor Slip</span>
              </button>

              <button 
                onClick={() => setActivePatientTab('referrals')}
                className={`tab-btn ${activePatientTab === 'referrals' ? 'active' : ''}`}
              >
                <GitPullRequest size={16} />
                <span>Hospital Referrals ({patientReferrals.length})</span>
              </button>

              <button 
                onClick={() => setActivePatientTab('facilities')}
                className={`tab-btn ${activePatientTab === 'facilities' ? 'active' : ''}`}
              >
                <MapPin size={16} />
                <span>Find Hospitals (60km)</span>
              </button>

              <button 
                onClick={() => setActivePatientTab('assistant')}
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
                  setActivePatientTab('timeline');
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
        )}

        {/* VIEW 3: DOCTOR / HEALTHCARE WORKER DASHBOARD */}
        {currentRole === 'doctor' && currentUser && (
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

            {/* DOCTOR DASHBOARD TABS IN PLAIN TERMS */}
            <div className="tabs-container">
              <button 
                onClick={() => setActiveDoctorTab('dossier')}
                className={`tab-btn ${activeDoctorTab === 'dossier' ? 'active' : ''}`}
              >
                <Sparkles size={16} />
                <span>2-Second Patient Summary</span>
              </button>

              <button 
                onClick={() => setActiveDoctorTab('prescribe')}
                className={`tab-btn ${activeDoctorTab === 'prescribe' ? 'active' : ''}`}
              >
                <Pill size={16} />
                <span>Write Prescription</span>
              </button>

              <button 
                onClick={() => setActiveDoctorTab('referral')}
                className={`tab-btn ${activeDoctorTab === 'referral' ? 'active' : ''}`}
              >
                <Building2 size={16} />
                <span>Send to Hospital / Specialist</span>
              </button>

              <button 
                onClick={() => setActiveDoctorTab('asha-tasks')}
                className={`tab-btn ${activeDoctorTab === 'asha-tasks' ? 'active' : ''}`}
              >
                <HeartHandshake size={16} />
                <span>Assign Home Checkup (ASHA)</span>
              </button>

              <button 
                onClick={() => setActiveDoctorTab('timeline')}
                className={`tab-btn ${activeDoctorTab === 'timeline' ? 'active' : ''}`}
              >
                <Activity size={16} />
                <span>Health History</span>
              </button>

              <button 
                onClick={() => setActiveDoctorTab('network')}
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
        )}

      </main>

      {/* FOOTER */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}
