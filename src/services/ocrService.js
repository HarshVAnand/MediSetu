// MediSetu AI - OCR & Smart Medical Document Digitization Engine
// Simulates neural visual layout analysis and structured medical entity extraction from rural slips & prescriptions

export const processDocumentOCR = async (fileOrUrl, documentType = 'prescription', onProgress = () => {}) => {
  const steps = [
    { progress: 15, stage: 'Preprocessing image: Deskewing, illumination correction & noise removal' },
    { progress: 40, stage: 'Applying Convolutional OCR: Detecting handwritten doctor script & stamped letterheads' },
    { progress: 70, stage: 'Biomedical Named Entity Recognition (NER): Extracting drug names, dosages & frequencies' },
    { progress: 90, stage: 'Cross-validating against National Essential Medicines List (NLEM) & ABHA schemas' },
    { progress: 100, stage: 'Digitization complete! Structured record ready for longitudinal timeline' }
  ];

  for (const step of steps) {
    onProgress(step);
    await new Promise(r => setTimeout(r, 450));
  }

  const isLab = documentType === 'lab' || (fileOrUrl.name && fileOrUrl.name.toLowerCase().includes('lab'));

  if (isLab) {
    return {
      success: true,
      documentType: 'Lab Pathology Report',
      facilityExtracted: 'Kolar Sub-Divisional Primary Health Centre',
      doctorExtracted: 'Dr. Ramesh Kumar, MBBS',
      dateExtracted: new Date().toISOString().split('T')[0],
      confidence: 97.8,
      rawText: `PRIMARY HEALTH CENTRE KOLAR RURAL\nPATIENT: RAMESHWAR GOWDA (58Y/M) | ABHA: 91-8452-3310-4491\nTEST: FASTING BLOOD GLUCOSE: 142 mg/dL (HIGH)\nHbA1c: 7.6% (UNCONTROLLED)\nSERUM CREATININE: 1.02 mg/dL (NORMAL)\nURINE MICROALBUMIN: 42 mg/g (MILD ELEVATION)`,
      extractedEntities: {
        tests: [
          { test: 'Fasting Blood Glucose', value: '142 mg/dL', status: 'High', refRange: '70-100 mg/dL' },
          { test: 'HbA1c', value: '7.6%', status: 'High', refRange: '< 5.7%' },
          { test: 'Serum Creatinine', value: '1.02 mg/dL', status: 'Normal', refRange: '0.7 - 1.2 mg/dL' },
          { test: 'Urine Microalbumin', value: '42 mg/g', status: 'Elevated', refRange: '< 30 mg/g' }
        ]
      },
      tags: ['Lab Report', 'Pathology', 'Diabetic Panel', 'AI Digitized']
    };
  }

  // Default Prescription
  return {
    success: true,
    documentType: 'Doctor Prescription Slip',
    facilityExtracted: 'Kolar Sub-Divisional PHC / Ayushman Arogya Mandir',
    doctorExtracted: 'Dr. Ramesh Kumar, MBBS (KMC-77419)',
    dateExtracted: new Date().toISOString().split('T')[0],
    confidence: 96.5,
    rawText: `Rx\n1. Tab. Metformin HCl 500mg - 1-0-1 (After Food) x 30 days\n2. Tab. Telmisartan 40mg - 1-0-0 (Before Food) x 30 days\n3. Tab. Atorvastatin 10mg - 0-0-1 (Night) x 30 days\nAdvice: Salt restriction, ASHA BP tracking, review in 4 weeks.`,
    extractedEntities: {
      diagnosis: 'Type-2 Diabetes Mellitus with Essential Hypertension',
      medications: [
        {
          name: 'Metformin Hydrochloride (SR)',
          dosage: '500 mg',
          schedule: { morning: true, afternoon: false, night: true },
          timing: 'After food',
          duration: '30 days',
          instructions: 'Take twice daily after meals'
        },
        {
          name: 'Telmisartan Tablets IP',
          dosage: '40 mg',
          schedule: { morning: true, afternoon: false, night: false },
          timing: 'Before breakfast',
          duration: '30 days',
          instructions: 'Take once daily in morning'
        },
        {
          name: 'Atorvastatin Tablets IP',
          dosage: '10 mg',
          schedule: { morning: false, afternoon: false, night: true },
          timing: 'Bedtime',
          duration: '30 days',
          instructions: 'Take at night'
        }
      ],
      clinicalAdvice: 'Strict low salt and low carbohydrate diet. Check blood pressure every 7 days with village ASHA worker.'
    },
    tags: ['Prescription', 'PHC Consultation', 'AI Digitized']
  };
};
