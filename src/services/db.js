// MediSetu AI - Client-side IndexedDB Storage Service
// Handles offline-first persistence for Patients, Doctors, Prescriptions, Health Records, Referrals, Follow-ups, Sync Queue

const DB_NAME = 'medisetu_ai_db';
const DB_VERSION = 1;

let dbInstance = null;

export const openMediSetuDB = () => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Patients Store
      if (!db.objectStoreNames.contains('patients')) {
        const patientStore = db.createObjectStore('patients', { keyPath: 'id' });
        patientStore.createIndex('email', 'email', { unique: false });
        patientStore.createIndex('abhaId', 'abhaId', { unique: true });
        patientStore.createIndex('phone', 'phone', { unique: false });
      }

      // Doctors Store
      if (!db.objectStoreNames.contains('doctors')) {
        const doctorStore = db.createObjectStore('doctors', { keyPath: 'id' });
        doctorStore.createIndex('email', 'email', { unique: false });
        doctorStore.createIndex('uid', 'uid', { unique: true });
      }

      // Prescriptions Store
      if (!db.objectStoreNames.contains('prescriptions')) {
        const presStore = db.createObjectStore('prescriptions', { keyPath: 'id' });
        presStore.createIndex('patientId', 'patientId', { unique: false });
        presStore.createIndex('date', 'date', { unique: false });
      }

      // Health Records & OCR Scans Store
      if (!db.objectStoreNames.contains('records')) {
        const recordStore = db.createObjectStore('records', { keyPath: 'id' });
        recordStore.createIndex('patientId', 'patientId', { unique: false });
        recordStore.createIndex('type', 'type', { unique: false });
        recordStore.createIndex('date', 'date', { unique: false });
      }

      // Referrals Store
      if (!db.objectStoreNames.contains('referrals')) {
        const refStore = db.createObjectStore('referrals', { keyPath: 'id' });
        refStore.createIndex('patientId', 'patientId', { unique: false });
        refStore.createIndex('status', 'status', { unique: false });
        refStore.createIndex('urgency', 'urgency', { unique: false });
      }

      // Follow-ups & ASHA Tasks Store
      if (!db.objectStoreNames.contains('followups')) {
        const fuStore = db.createObjectStore('followups', { keyPath: 'id' });
        fuStore.createIndex('patientId', 'patientId', { unique: false });
        fuStore.createIndex('status', 'status', { unique: false });
        fuStore.createIndex('assignedWorker', 'assignedWorker', { unique: false });
      }

      // Synchronization Queue (for offline mutations)
      if (!db.objectStoreNames.contains('syncQueue')) {
        const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
        syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        syncStore.createIndex('synced', 'synced', { unique: false });
      }

      // Recent Search History
      if (!db.objectStoreNames.contains('searchHistory')) {
        const searchStore = db.createObjectStore('searchHistory', { keyPath: 'id' });
        searchStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.error('IndexedDB open error:', event.target.error);
      reject(event.target.error);
    };
  });
};

// Generic Helper CRUD Methods
export const dbGetAll = async (storeName) => {
  const db = await openMediSetuDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

export const dbGetById = async (storeName, id) => {
  const db = await openMediSetuDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
};

export const dbPut = async (storeName, item) => {
  const db = await openMediSetuDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.put(item);
    request.onsuccess = () => resolve(item);
    request.onerror = () => reject(request.error);
  });
};

export const dbDelete = async (storeName, id) => {
  const db = await openMediSetuDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.delete(id);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
};

export const dbGetByIndex = async (storeName, indexName, value) => {
  const db = await openMediSetuDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(value);
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

// Offline Sync Queue Operations
export const enqueueSyncAction = async (actionType, payload) => {
  const syncItem = {
    id: 'sync-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
    actionType,
    payload,
    timestamp: new Date().toISOString(),
    synced: false,
    attempts: 0
  };
  await dbPut('syncQueue', syncItem);
  return syncItem;
};

export const getPendingSyncQueue = async () => {
  const allQueue = await dbGetAll('syncQueue');
  return allQueue.filter(item => !item.synced);
};

export const clearSyncedQueue = async () => {
  const allQueue = await dbGetAll('syncQueue');
  for (const item of allQueue) {
    if (item.synced) {
      await dbDelete('syncQueue', item.id);
    }
  }
};

export const markQueueItemSynced = async (id) => {
  const item = await dbGetById('syncQueue', id);
  if (item) {
    item.synced = true;
    item.syncedAt = new Date().toISOString();
    await dbPut('syncQueue', item);
  }
};

// Recent Searches
export const logSearchHistory = async (query, category, resultCount = 0) => {
  const item = {
    id: 'search-' + Date.now(),
    query,
    category,
    resultCount,
    timestamp: new Date().toISOString()
  };
  await dbPut('searchHistory', item);
};

export const getRecentSearches = async (limit = 5) => {
  const searches = await dbGetAll('searchHistory');
  return searches.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit);
};

// INITIAL SEED DATA FOR RURAL HEALTHCARE PLATFORM
export const seedInitialDatabase = async () => {
  const existingPatients = await dbGetAll('patients');
  if (existingPatients && existingPatients.length > 0) {
    return; // Already seeded
  }

  console.log('🌱 Seeding initial MediSetu AI rural clinical database...');

  // 1. Seed Patients
  const patients = [
    {
      id: 'pat-001',
      name: 'Rameshwar Gowda',
      age: 58,
      gender: 'Male',
      email: 'rameshwar.gowda@gmail.com',
      password: 'password123',
      phone: '+91 98452 33104',
      abhaId: 'ABHA-91-8452-3310-4491',
      address: 'House #14, Vokkaleri Gram Panchayat, Kolar District, Karnataka 563130',
      bloodGroup: 'B+',
      allergies: ['Penicillin (Skin rash/Angioedema)', 'NSAIDs (Mild gastric distress)'],
      familyHistory: 'Father: Type 2 Diabetes, Mother: Hypertension & Stroke at age 64',
      chronicConditions: ['Type-2 Diabetes Mellitus (12 yrs)', 'Essential Hypertension (Stage II)', 'Mild Diabetic Retinopathy'],
      aadharPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
      aadharVerified: true,
      registeredDate: '2023-04-12',
      primaryCareUnit: 'Vokkaleri Village Sub-Centre',
      assignedAsha: 'Smt. Kavitha M. (ASHA Worker ID: ASHA-KLR-108)'
    },
    {
      id: 'pat-002',
      name: 'Sunita Bai',
      age: 32,
      gender: 'Female',
      email: 'sunita.bai@gmail.com',
      password: 'password123',
      phone: '+91 97312 88201',
      abhaId: 'ABHA-91-7312-8820-1102',
      address: 'Near Old Water Tank, Mulbagal Rural, Karnataka 563131',
      bloodGroup: 'O+',
      allergies: ['Sulfa Drugs (Severe urticaria)'],
      familyHistory: 'Maternal: Gestational Diabetes, Thalassemia Minor carrier',
      chronicConditions: ['Second Trimester Pregnancy (High Risk - Gestational Hypertension)', 'Moderate Iron Deficiency Anemia (Hb 9.1 g/dL)'],
      aadharPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      aadharVerified: true,
      registeredDate: '2024-01-18',
      primaryCareUnit: 'Mulbagal Rural Primary Health Centre',
      assignedAsha: 'Smt. Anusuyamma (ASHA Worker ID: ASHA-KLR-204)'
    },
    {
      id: 'pat-003',
      name: 'Manjunath K.',
      age: 45,
      gender: 'Male',
      email: 'manjunath.k@gmail.com',
      password: 'password123',
      phone: '+91 94481 77652',
      abhaId: 'ABHA-91-4481-7765-2033',
      address: 'Main Bazaar, Bangarapet Town, Karnataka 563114',
      bloodGroup: 'A+',
      allergies: ['No Known Drug Allergies (NKDA)'],
      familyHistory: 'Brother: Asthma; Father: COPD',
      chronicConditions: ['Chronic Obstructive Bronchitis', 'Post-Trauma Right Tibia Fracture (Healing)'],
      aadharPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      aadharVerified: true,
      registeredDate: '2023-11-05',
      primaryCareUnit: 'Bangarapet Community Health Centre',
      assignedAsha: 'Smt. Roopa Devi (ASHA Worker ID: ASHA-KLR-312)'
    }
  ];

  for (const pat of patients) {
    await dbPut('patients', pat);
  }

  // 2. Seed Doctors / Healthcare Workers
  const doctors = [
    {
      id: 'doc-001',
      name: 'Dr. Ramesh Kumar',
      age: 41,
      gender: 'Male',
      email: 'dr.ramesh@medisetu.org',
      password: 'doctor123',
      uid: 'HPR-KMC-77419',
      qualifications: 'MBBS, DNB (Family Medicine)',
      specialization: 'General Medicine & Rural Health',
      currentPlaceOfPractice: 'Kolar Sub-Divisional Primary Health Centre (PHC)',
      experienceYears: 14,
      phone: '+91 94498 11200',
      dutyFacilityId: 'fac-phc-01',
      consultationSlotsToday: 24,
      activeReferralsCount: 8
    },
    {
      id: 'doc-002',
      name: 'Dr. Preethi Hegde',
      age: 48,
      gender: 'Female',
      email: 'dr.preethi@medisetu.org',
      password: 'doctor123',
      uid: 'HPR-KMC-39120',
      qualifications: 'MBBS, MD (General Medicine), DM (Cardiology)',
      specialization: 'Cardiology & Interventional Critical Care',
      currentPlaceOfPractice: 'SNR District Hospital & Trauma Centre, Kolar',
      experienceYears: 20,
      phone: '+91 98450 66321',
      dutyFacilityId: 'fac-dh-01',
      consultationSlotsToday: 18,
      activeReferralsCount: 15
    },
    {
      id: 'doc-003',
      name: 'Dr. Suresh Babu',
      age: 52,
      gender: 'Male',
      email: 'dr.suresh@medisetu.org',
      password: 'doctor123',
      uid: 'HPR-KMC-21890',
      qualifications: 'MBBS, MS (General Surgery), FMAS',
      specialization: 'Emergency Surgery & Trauma Care',
      currentPlaceOfPractice: 'Bangarapet Community Health Centre (CHC)',
      experienceYears: 24,
      phone: '+91 94480 55190',
      dutyFacilityId: 'fac-chc-01',
      consultationSlotsToday: 16,
      activeReferralsCount: 6
    }
  ];

  for (const doc of doctors) {
    await dbPut('doctors', doc);
  }

  // 3. Seed Prescriptions (Longitudinal Timeline)
  const prescriptions = [
    {
      id: 'pres-001',
      patientId: 'pat-001',
      doctorId: 'doc-001',
      doctorName: 'Dr. Ramesh Kumar, MBBS',
      facilityName: 'Kolar Sub-Divisional PHC',
      facilityTier: 'PHC',
      date: '2026-08-10',
      diagnosis: 'Type-2 Diabetes with Uncontrolled Fasting Sugar & Stage-2 Hypertension',
      notes: 'Advised strict low-sodium, diabetic diet. Regular 30 min brisk walking.',
      status: 'Active',
      drugs: [
        {
          name: 'Metformin Hydrochloride (SR)',
          dosage: '500 mg',
          schedule: { morning: true, afternoon: false, night: true },
          timing: 'After meals',
          duration: '30 days',
          remainingDays: 14,
          refillDue: '2026-09-09',
          instructions: 'Take with warm water after breakfast and dinner'
        },
        {
          name: 'Telmisartan Tablets IP',
          dosage: '40 mg',
          schedule: { morning: true, afternoon: false, night: false },
          timing: 'Before breakfast',
          duration: '30 days',
          remainingDays: 14,
          refillDue: '2026-09-09',
          instructions: 'Check BP weekly at village sub-centre'
        },
        {
          name: 'Atorvastatin Tablets IP',
          dosage: '10 mg',
          schedule: { morning: false, afternoon: false, night: true },
          timing: 'Bedtime',
          duration: '30 days',
          remainingDays: 14,
          refillDue: '2026-09-09',
          instructions: 'Take at night before sleep'
        }
      ]
    },
    {
      id: 'pres-002',
      patientId: 'pat-001',
      doctorId: 'doc-002',
      doctorName: 'Dr. Preethi Hegde, MD, DM',
      facilityName: 'SNR District Hospital & Trauma Centre',
      facilityTier: 'District Hospital',
      date: '2026-06-15',
      diagnosis: 'Cardiovascular Risk Evaluation & Hypertensive Microalbuminuria Review',
      notes: '2D Echo shows normal LV systolic function, mild concentric LVH. Titrated anti-hypertensives.',
      status: 'Archived',
      drugs: [
        {
          name: 'Telmisartan + Amlodipine',
          dosage: '40/5 mg',
          schedule: { morning: true, afternoon: false, night: false },
          timing: 'Morning',
          duration: '60 days',
          remainingDays: 0,
          refillDue: '2026-08-15',
          instructions: 'Monitor for ankle edema'
        }
      ]
    },
    {
      id: 'pres-003',
      patientId: 'pat-002',
      doctorId: 'doc-001',
      doctorName: 'Dr. Ramesh Kumar, MBBS',
      facilityName: 'Mulbagal Rural PHC',
      facilityTier: 'PHC',
      date: '2026-08-18',
      diagnosis: 'Gestational Hypertension (Week 24) & Mild Nutritional Anemia',
      notes: 'ASHA to conduct bi-weekly blood pressure and fetal kick count check.',
      status: 'Active',
      drugs: [
        {
          name: 'Labetalol Tablets IP',
          dosage: '100 mg',
          schedule: { morning: true, afternoon: false, night: true },
          timing: 'After meals',
          duration: '15 days',
          remainingDays: 7,
          refillDue: '2026-09-02',
          instructions: 'Do not miss doses. Immediate reporting if dizziness occurs'
        },
        {
          name: 'Ferrous Ascorbate + Folic Acid',
          dosage: '100mg/1.5mg',
          schedule: { morning: false, afternoon: true, night: false },
          timing: 'Post lunch',
          duration: '30 days',
          remainingDays: 22,
          refillDue: '2026-09-17',
          instructions: 'Take with lemon water, avoid taking with tea/milk'
        },
        {
          name: 'Calcium Carbonate + Vitamin D3',
          dosage: '500mg/250IU',
          schedule: { morning: true, afternoon: false, night: false },
          timing: 'Morning after food',
          duration: '30 days',
          remainingDays: 22,
          refillDue: '2026-09-17',
          instructions: 'Maintain minimum 2 hour gap from iron tablet'
        }
      ]
    }
  ];

  for (const pres of prescriptions) {
    await dbPut('prescriptions', pres);
  }

  // 4. Seed Longitudinal Health Records / Lab Reports / OCR Slips
  const records = [
    {
      id: 'rec-001',
      patientId: 'pat-001',
      facilityName: 'Vokkaleri Village Sub-Centre',
      facilityTier: 'Sub-Centre',
      date: '2026-08-20',
      type: 'Vitals & NCD Screening',
      provider: 'Smt. Kavitha M. (ANM)',
      summary: 'Routine Home Blood Pressure & Blood Glucose Monitoring',
      vitals: {
        bp: '138/86 mmHg',
        pulse: '74 bpm',
        randomBloodSugar: '158 mg/dL',
        spo2: '98%',
        weight: '72.4 kg'
      },
      ocrExtracted: false,
      tags: ['Vitals', 'Community Screening', 'BP', 'Diabetes']
    },
    {
      id: 'rec-002',
      patientId: 'pat-001',
      facilityName: 'Kolar Sub-Divisional PHC',
      facilityTier: 'PHC',
      date: '2026-08-10',
      type: 'Laboratory Pathology Report',
      provider: 'Dr. Ramesh Kumar, MBBS',
      summary: 'Quarterly Diabetic Panel & Renal Function Assessment',
      labResults: [
        { test: 'HbA1c (Glycated Hemoglobin)', value: '7.6 %', normalRange: '< 5.7 %', flag: 'High' },
        { test: 'Fasting Plasma Glucose', value: '142 mg/dL', normalRange: '70-100 mg/dL', flag: 'High' },
        { test: 'Post Prandial Glucose (2h)', value: '188 mg/dL', normalRange: '< 140 mg/dL', flag: 'High' },
        { test: 'Serum Creatinine', value: '1.02 mg/dL', normalRange: '0.7 - 1.2 mg/dL', flag: 'Normal' },
        { test: 'eGFR', value: '82 mL/min/1.73m²', normalRange: '> 60 mL/min', flag: 'Normal' },
        { test: 'Urine Microalbumin/Creatinine', value: '42 mg/g', normalRange: '< 30 mg/g', flag: 'Mild Microalbuminuria' }
      ],
      ocrExtracted: true,
      ocrConfidence: 97.4,
      fileUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400&auto=format&fit=crop&q=80',
      fileName: 'PHC_Kolar_LabReport_Aug2026.pdf',
      tags: ['Lab', 'Pathology', 'HbA1c', 'Renal']
    },
    {
      id: 'rec-003',
      patientId: 'pat-001',
      facilityName: 'SNR District Hospital & Trauma Centre',
      facilityTier: 'District Hospital',
      date: '2026-06-15',
      type: 'Cardiology Diagnostic Report',
      provider: 'Dr. Preethi Hegde, MD, DM',
      summary: '12-Lead ECG & Transthoracic Echocardiogram (TTE)',
      findings: 'Sinus rhythm, HR 72/min. Voltage criteria for LVH positive. 2D Echo: LVEF 60%, grade-1 diastolic dysfunction, no regional wall motion abnormalities.',
      ocrExtracted: true,
      ocrConfidence: 96.2,
      fileUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=400&auto=format&fit=crop&q=80',
      fileName: 'District_Hospital_ECG_Echo_Jun2026.pdf',
      tags: ['Cardiology', 'ECG', 'Echocardiogram', 'Specialist']
    },
    {
      id: 'rec-004',
      patientId: 'pat-002',
      facilityName: 'Mulbagal Rural PHC',
      facilityTier: 'PHC',
      date: '2026-08-18',
      type: 'Antenatal Clinical Note & USG',
      provider: 'Dr. Ramesh Kumar, MBBS',
      summary: '2nd Trimester Obstetric Ultrasound & Doppler',
      findings: 'Single live intrauterine fetus at 24 weeks 2 days gestation. Normal amniotic fluid index (AFI 13.5 cm). Placenta anterior, grade I maturity. Fetal heart rate 146 bpm.',
      vitals: {
        bp: '144/92 mmHg',
        pulse: '82 bpm',
        fundalHeight: '24 cm',
        hemoglobin: '9.1 g/dL'
      },
      ocrExtracted: true,
      ocrConfidence: 98.1,
      fileName: 'ANC_Scan_Mulbagal_Aug2026.pdf',
      tags: ['Antenatal', 'Ultrasound', 'Obstetrics']
    }
  ];

  for (const rec of records) {
    await dbPut('records', rec);
  }

  // 5. Seed Referrals (Inter-tier referral tracking)
  const referrals = [
    {
      id: 'ref-001',
      patientId: 'pat-001',
      patientName: 'Rameshwar Gowda',
      patientAbha: 'ABHA-91-8452-3310-4491',
      patientAge: 58,
      patientGender: 'Male',
      fromFacilityId: 'fac-phc-01',
      fromFacilityName: 'Kolar Sub-Divisional PHC',
      fromDoctorId: 'doc-001',
      fromDoctorName: 'Dr. Ramesh Kumar',
      toFacilityId: 'fac-dh-01',
      toFacilityName: 'SNR District Hospital & Trauma Centre',
      toDepartment: 'Cardiology & Preventive Nephrology',
      targetDoctorName: 'Dr. Preethi Hegde, DM',
      urgency: 'Priority', // Normal, Priority, Emergency
      createdDate: '2026-08-12',
      appointmentDate: '2026-08-30',
      reasonForReferral: 'Persistent mild microalbuminuria (42 mg/g) and Stage-2 HTN. Specialist evaluation for nephro-protective ACEi/ARB titration and carotid intima-media thickness scan.',
      clinicalSummaryAttached: true,
      status: 'Accepted', // Pending, Accepted, In-Consultation, Completed, Cancelled
      transportAssistanceRequired: false,
      tokenNumber: 'REF-DH-KLR-089',
      historyLogs: [
        { stage: 'Initiated at PHC', date: '2026-08-12 10:30 AM', actor: 'Dr. Ramesh Kumar' },
        { stage: 'Triage & Accepted at District Hospital', date: '2026-08-12 02:15 PM', actor: 'Dr. Preethi Hegde' },
        { stage: 'ASHA Notification Sent for Transport Prep', date: '2026-08-13 09:00 AM', actor: 'MediSetu Tele-Routing' }
      ]
    },
    {
      id: 'ref-002',
      patientId: 'pat-002',
      patientName: 'Sunita Bai',
      patientAbha: 'ABHA-91-7312-8820-1102',
      patientAge: 32,
      patientGender: 'Female',
      fromFacilityId: 'fac-phc-02',
      fromFacilityName: 'Mulbagal Rural PHC',
      fromDoctorId: 'doc-001',
      fromDoctorName: 'Dr. Ramesh Kumar',
      toFacilityId: 'fac-dh-01',
      toFacilityName: 'SNR District Hospital & Trauma Centre',
      toDepartment: 'High-Risk Obstetrics & Maternal Fetal Medicine',
      targetDoctorName: 'Specialist on Duty (OBGYN)',
      urgency: 'Emergency',
      createdDate: '2026-08-22',
      appointmentDate: '2026-08-28',
      reasonForReferral: 'Gestational Hypertension (BP 144/92 mmHg) with moderate anemia in 24th week. Urgent specialist antenatal assessment and pre-eclampsia prophylaxis planning.',
      clinicalSummaryAttached: true,
      status: 'Pending',
      transportAssistanceRequired: true,
      tokenNumber: 'REF-DH-KLR-104',
      historyLogs: [
        { stage: 'Initiated at PHC', date: '2026-08-22 11:45 AM', actor: 'Dr. Ramesh Kumar' },
        { stage: 'Emergency Flagged in District Queue', date: '2026-08-22 11:46 AM', actor: 'MediSetu AI Triage Engine' }
      ]
    }
  ];

  for (const ref of referrals) {
    await dbPut('referrals', ref);
  }

  // 6. Seed Follow-ups & Frontline ASHA Tasks
  const followups = [
    {
      id: 'fu-001',
      patientId: 'pat-001',
      patientName: 'Rameshwar Gowda',
      patientAddress: 'House #14, Vokkaleri Village',
      assignedWorker: 'Smt. Kavitha M. (ASHA Worker)',
      workerContact: '+91 98455 12099',
      taskType: 'Blood Pressure & Fasting Sugar Check',
      frequency: 'Every 7 Days',
      dueDate: '2026-08-27',
      status: 'Pending', // Pending, Completed, Missed
      instructions: 'Measure BP in sitting position twice. Check if Telmisartan & Metformin are being taken on time without skip.',
      lastVitalsRecorded: { bp: '138/86', sugar: '158 mg/dL' }
    },
    {
      id: 'fu-002',
      patientId: 'pat-001',
      patientName: 'Rameshwar Gowda',
      patientAddress: 'House #14, Vokkaleri Village',
      assignedWorker: 'Smt. Kavitha M. (ASHA Worker)',
      workerContact: '+91 98455 12099',
      taskType: 'District Hospital Referral Briefing & Token Handover',
      frequency: 'One-time',
      dueDate: '2026-08-28',
      status: 'Completed',
      instructions: 'Handover printed referral slip with Token # REF-DH-KLR-089. Guide on bus timings from Vokkaleri to Kolar SNR Hospital.',
      completedDate: '2026-08-24'
    },
    {
      id: 'fu-003',
      patientId: 'pat-002',
      patientName: 'Sunita Bai',
      patientAddress: 'Near Old Water Tank, Mulbagal Rural',
      assignedWorker: 'Smt. Anusuyamma (ASHA Worker)',
      workerContact: '+91 97311 44550',
      taskType: 'Antenatal High-Risk Home Visit',
      frequency: 'Bi-weekly',
      dueDate: '2026-08-26',
      status: 'Pending',
      instructions: 'Check for swelling in feet/face, headache, epigastric pain. Verify daily Iron & Calcium adherence.',
      lastVitalsRecorded: { bp: '144/92', hb: '9.1 g/dL' }
    }
  ];

  for (const fu of followups) {
    await dbPut('followups', fu);
  }

  console.log('✅ MediSetu AI database initialized successfully with realistic rural clinical records.');
};
