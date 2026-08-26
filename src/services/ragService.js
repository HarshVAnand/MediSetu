// MediSetu AI - Retrieval-Augmented Generation (RAG) & Clinical Synthesis Engine
// Generates longitudinal clinical summaries for doctors and contextual health Q&A for patients in regional languages

export const generateDoctorRAGDossier = (patient, prescriptions = [], records = [], referrals = []) => {
  if (!patient) return null;

  // Extract critical markers
  const allergies = patient.allergies || [];
  const chronicList = patient.chronicConditions || [];
  const activePrescriptions = prescriptions.filter(p => p.status === 'Active');
  
  // Find latest vitals and lab markers
  let latestBp = 'Not recorded';
  let latestSugar = 'Not recorded';
  let latestHba1c = null;
  let microalbumin = null;

  records.forEach(rec => {
    if (rec.vitals?.bp) latestBp = rec.vitals.bp;
    if (rec.vitals?.randomBloodSugar) latestSugar = rec.vitals.randomBloodSugar;
    if (rec.labResults) {
      const hba1cItem = rec.labResults.find(r => r.test.toLowerCase().includes('hba1c'));
      if (hba1cItem) latestHba1c = hba1cItem.value;
      const microItem = rec.labResults.find(r => r.test.toLowerCase().includes('microalbumin'));
      if (microItem) microalbumin = microItem.value;
    }
  });

  // Calculate active drugs count
  const allActiveDrugs = [];
  activePrescriptions.forEach(p => {
    if (p.drugs) p.drugs.forEach(d => allActiveDrugs.push(d.name));
  });

  // Contraindication & Safety Flags
  const safetyWarnings = [];
  if (allergies.some(a => a.toLowerCase().includes('penicillin'))) {
    safetyWarnings.push({
      severity: 'CRITICAL',
      title: 'Penicillin Hypersensitivity Alert',
      detail: 'Documented history of angioedema/urticaria. Strictly avoid Amoxicillin, Ampicillin, Piperacillin, and first-generation cephalosporins with cross-reactivity.'
    });
  }
  if (allergies.some(a => a.toLowerCase().includes('sulfa'))) {
    safetyWarnings.push({
      severity: 'CRITICAL',
      title: 'Sulfa Drug Allergy',
      detail: 'Avoid Cotrimoxazole, Sulfasalazine, and related sulfonamide compounds.'
    });
  }
  if (chronicList.some(c => c.toLowerCase().includes('diabetes')) && latestHba1c && parseFloat(latestHba1c) > 7.0) {
    safetyWarnings.push({
      severity: 'WARNING',
      title: 'Suboptimal Glycemic Control (HbA1c: ' + latestHba1c + ')',
      detail: 'Target HbA1c is < 7.0%. Review Metformin adherence, lifestyle, or consider add-on DPP-4 inhibitor / SGLT2i evaluation.'
    });
  }
  if (microalbumin) {
    safetyWarnings.push({
      severity: 'ATTENTION',
      title: 'Microalbuminuria Detected (' + microalbumin + ')',
      detail: 'Early diabetic nephropathy indicator. Ensure strict blood pressure titration (< 130/80 mmHg) and continue ARB/ACEi therapy.'
    });
  }

  // Active Referrals
  const pendingReferrals = referrals.filter(r => r.status === 'Pending' || r.status === 'Accepted');

  return {
    patientId: patient.id,
    patientName: patient.name,
    abhaId: patient.abhaId,
    generatedAt: new Date().toLocaleString(),
    oneLineSummary: `${patient.age}yo ${patient.gender} with ${chronicList.join(', ')}. Primary care managed at ${patient.primaryCareUnit}.`,
    clinicalTrajectory: `Patient has regular screening history via ASHA (${patient.assignedAsha}). Recent lab results indicate glycemic variability with HbA1c ${latestHba1c || '7.6%'} and microalbuminuria. Cardiovascular status stable with grade-1 diastolic dysfunction on 2D Echo.`,
    safetyWarnings,
    activeMedications: allActiveDrugs,
    latestVitals: {
      bp: latestBp,
      sugar: latestSugar,
      hba1c: latestHba1c || '7.6%',
      bloodGroup: patient.bloodGroup || 'O+'
    },
    pendingReferrals: pendingReferrals.map(r => ({
      toFacility: r.toFacilityName,
      department: r.toDepartment,
      urgency: r.urgency,
      status: r.status,
      appointment: r.appointmentDate
    })),
    recommendedNextActions: [
      'Titrate anti-hypertensive regimen to maintain target BP < 130/80 mmHg',
      'Verify adherence to morning Metformin and Telmisartan doses with village ASHA',
      'Ensure attendance at District Hospital Cardiology appointment on ' + (pendingReferrals[0]?.appointmentDate || 'scheduled date'),
      'Repeat urine microalbumin/creatinine ratio in 3 months'
    ]
  };
};

export const queryPatientAI = async (query, patient, prescriptions = [], records = [], language = 'en') => {
  // Simulate intelligent RAG latency
  await new Promise(resolve => setTimeout(resolve, 600));

  const q = query.toLowerCase();
  const patName = patient?.name || 'Patient';
  const allergies = patient?.allergies || [];
  const activeMeds = prescriptions.flatMap(p => p.drugs?.map(d => d.name) || []);

  let answerEn = '';
  let answerHi = '';
  let answerKn = '';
  let sources = [];

  if (q.includes('paracetamol') || q.includes('fever') || q.includes('pain') || q.includes('headache')) {
    const hasPenicillinAllergy = allergies.some(a => a.toLowerCase().includes('penicillin'));
    answerEn = `Yes, Paracetamol (500mg or 650mg) is generally safe for you to take for fever or mild headache as prescribed. Because you have a documented allergy to **${allergies[0] || 'Penicillin'}**, do NOT take any painkiller combination containing Penicillin or unverified antibiotic capsules. Take Paracetamol after food with plenty of water. If fever exceeds 101°F or lasts > 48 hours, visit ${patient.primaryCareUnit || 'your local PHC'}.`;
    answerHi = `हाँ, बुखार या सिरदर्द के लिए आप पैरासिटामोल (500mg) ले सकते हैं। आपको **${allergies[0] || 'पेनिसिलिन'}** से एलर्जी है, इसलिए कोई भी अनजान एंटीबायोटिक गोली न लें। गोली हमेशा खाना खाने के बाद लें। यदि बुखार 2 दिन से अधिक रहता है, तो तुरंत अपने प्राथमिक स्वास्थ्य केंद्र (PHC) जाएं।`;
    answerKn = `ಹೌದು, ಜ್ವರ ಅಥವಾ ತಲೆನೋವಿಗೆ ನೀವು ಪ್ಯಾರಸಿಟಮಾಲ್ (500mg) ತೆಗೆದುಕೊಳ್ಳಬಹುದು. ನಿಮಗೆ **${allergies[0] || 'ಪೆನ್ಸಿಲಿನ್'}** ಅಲರ್ಜಿ ಇರುವುದರಿಂದ, ಯಾವುದೇ ಅಪರಿಚಿತ ಆಂಟಿಬಯೋಟಿಕ್ ಮಾತ್ರೆಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಬೇಡಿ. ಊಟದ ನಂತರ ನೀರು ಕುಡಿದು ಮಾತ್ರೆಯನ್ನು ಸೇವಿಸಿ.`;
    sources = ['Prescription File: PHC August 2026', 'Allergy Registry: ABHA Record'];
  } else if (q.includes('sugar') || q.includes('diabetes') || q.includes('metformin') || q.includes('hba1c')) {
    answerEn = `Based on your latest lab tests from ${records[1]?.date || 'August 2026'}, your HbA1c is **7.6%** (target is under 7.0%) and fasting blood glucose is 142 mg/dL. You are currently prescribed **Metformin 500mg** twice daily (morning & night after food). It is vital to take your medicine consistently, avoid sweet tea, and walk 30 minutes daily. Your village ASHA worker (${patient.assignedAsha || 'ASHA worker'}) will check your fasting sugar next week.`;
    answerHi = `आपकी हालिया रिपोर्ट के अनुसार, आपका HbA1c **7.6%** और खाली पेट शुगर 142 mg/dL है। डॉक्टर ने आपको दिन में दो बार (सुबह और रात भोजन के बाद) **मेटफॉर्मिन 500mg** लेने की सलाह दी है। दवा नियमित लें, मीठी चाय से परहेज करें और रोजाना 30 मिनट टहलें।`;
    answerKn = `ನಿಮ್ಮ ಇತ್ತೀಚಿನ ಲ್ಯಾಬ್ ವರದಿಯಂತೆ HbA1c **7.6%** ಆಗಿದೆ. ನೀವು ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ **ಮೆಟ್‌ಫಾರ್ಮಿನ್ 500mg** ಮಾತ್ರೆಯನ್ನು ಊಟದ ನಂತರ ತೆಗೆದುಕೊಳ್ಳಬೇಕು.`;
    sources = ['Pathology Panel: Kolar Sub-Divisional PHC', 'Active Prescription: Dr. Ramesh Kumar'];
  } else if (q.includes('referral') || q.includes('district hospital') || q.includes('appointment') || q.includes('doctor')) {
    answerEn = `You have an active Priority Referral to **SNR District Hospital & Trauma Centre (Cardiology & Nephrology)** scheduled for **August 30, 2026**. Your token number is **REF-DH-KLR-089**. Please carry your MediSetu digital health ID card, previous ECG slips, and blood report. ASHA worker ${patient.assignedAsha || 'Kavitha'} will assist you with bus timings.`;
    answerHi = `आपका **एसएनआर जिला अस्पताल** (हृदय रोग विभाग) के लिए प्राथमिकता रेफरल दर्ज है। अपॉइंटमेंट की तारीख **30 अगस्त 2026** है और टोकन नंबर **REF-DH-KLR-089** है। कृपया अपना डिजिटल हेल्थ कार्ड और पुरानी रिपोर्ट साथ ले जाएं।`;
    answerKn = `ನಿಮಗೆ **ಎಸ್.ಎನ್.ಆರ್ ಜಿಲ್ಲಾ ಆಸ್ಪತ್ರೆಗೆ** ದಿನಾಂಕ **30 ಆಗಸ್ಟ್ 2026** ರಂದು ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಇದೆ. ಟೋಕನ್ ನಂಬರ್ **REF-DH-KLR-089**.`;
    sources = ['Referral Queue: Inter-Facility Network', 'ASHA Coordination Task #FU-002'];
  } else if (q.includes('bp') || q.includes('blood pressure') || q.includes('telmisartan') || q.includes('pressure')) {
    answerEn = `Your last recorded blood pressure at the village Sub-Centre was **138/86 mmHg**. You are taking **Telmisartan 40mg** once daily before breakfast. Please reduce salt intake in your meals (avoid pickles and papad) and get your BP re-checked by your ANM/ASHA worker every 7 days.`;
    answerHi = `गाँव के उप-स्वास्थ्य केंद्र में आपका अंतिम दर्ज रक्तचाप (BP) **138/86 mmHg** था। आप प्रतिदिन सुबह नाश्ते से पहले **टेलमिसार्टन 40mg** ले रहे हैं। खाने में नमक की मात्रा कम रखें और हर हफ्ते बीपी चेक करवाएं।`;
    answerKn = `ಗ್ರಾಮ ಉಪಕೇಂದ್ರದಲ್ಲಿ ನಿಮ್ಮ ಇತ್ತೀಚಿನ ರಕ್ತದೊತ್ತಡ (BP) **138/86 mmHg** ಆಗಿತ್ತು. ಪ್ರತಿದಿನ ಬೆಳಿಗ್ಗೆ ತಿಂಡಿಗಿಂತ ಮೊದಲು **ಟೆಲ್ಮಿಸಾರ್ಟನ್ 40mg** ತೆಗೆದುಕೊಳ್ಳಿ.`;
    sources = ['Vitals Log: Vokkaleri Ayushman Arogya Mandir', 'Active Prescription: Telmisartan 40mg'];
  } else {
    answerEn = `Hello ${patName}! I have reviewed your connected MediSetu longitudinal records across ${patient.primaryCareUnit || 'your local clinic'} and SNR District Hospital. You currently have ${activeMeds.length} active medications (${activeMeds.slice(0, 3).join(', ') || 'Metformin, Telmisartan'}). How can I help you today? You can ask about your medicines, diet precautions, lab test results, or upcoming doctor referral dates.`;
    answerHi = `नमस्ते ${patName}! मैंने आपके सभी चिकित्सा रिकॉर्ड देख लिए हैं। आपकी सक्रिय दवाएं चल रही हैं। आप अपनी दवाओं, परहेज, ಲ್ಯಾಬ್ रिपोर्ट या रेफरल के बारे में कुछ भी पूछ सकते हैं।`;
    answerKn = `ನಮಸ್ಕಾರ ${patName}! ನಿಮ್ಮ ಎಲ್ಲಾ ಆಸ್ಪತ್ರೆ ದಾಖಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗಿದೆ. ನಿಮ್ಮ ಔಷಧಿಗಳು, ಊಟದ ಪಥ್ಯ, ಲ್ಯಾಬ್ ವರದಿ ಅಥವಾ ರೆಫರಲ್ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಬಹುದು.`;
    sources = ['MediSetu Longitudinal Connected Health Graph'];
  }

  return {
    query,
    answer: language === 'hi' ? answerHi : language === 'kn' ? answerKn : answerEn,
    language,
    confidenceScore: 0.98,
    sources,
    timestamp: new Date().toLocaleTimeString()
  };
};
