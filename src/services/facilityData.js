// Rural & Town Healthcare Facility Network (Government & Private Hospitals)
// Covers up to 60km - 80km radius with real-time geolocation distance calculations

// Haversine formula to compute distance between two coordinates in kilometers
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return 0;
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

// Preset User Regions for instant location switching
export const PRESET_REGIONS = [
  { id: 'kolar-central', name: 'Kolar City (Centre)', lat: 13.1367, lng: 78.1340 },
  { id: 'bangarapet', name: 'Bangarapet Town', lat: 12.9774, lng: 78.1966 },
  { id: 'hoskote', name: 'Hoskote / East Bengaluru', lat: 13.0700, lng: 77.7981 },
  { id: 'malur', name: 'Malur Town', lat: 13.0039, lng: 77.9405 },
  { id: 'mulbagal', name: 'Mulbagal Rural', lat: 13.1648, lng: 78.3942 },
  { id: 'chintamani', name: 'Chintamani Taluk', lat: 13.4000, lng: 78.0667 },
  { id: 'srinivaspur', name: 'Srinivaspur Town', lat: 13.3385, lng: 78.2144 }
];

export const INITIAL_FACILITIES = [
  // ================= GOVERNMENT HOSPITALS =================
  {
    id: 'fac-gov-dh-01',
    name: 'SNR Government District Hospital & Trauma Centre',
    category: 'Government',
    facilityType: 'District Hospital',
    lat: 13.1332,
    lng: 78.1388,
    address: 'Hospital Road, Gulpet, Kolar, Karnataka 563101',
    contact: '+91 8152 222340',
    emergency24x7: true,
    ayushmanBharatAccepted: true, // Free/Cashless Govt Scheme
    totalBeds: 250,
    availableBeds: 48,
    icuBeds: 18,
    availableIcuBeds: 6,
    oxygenBeds: 60,
    doctorsOnDuty: [
      { name: 'Dr. Preethi Hegde, MD', role: 'Heart Specialist (Cardiologist)' },
      { name: 'Dr. Vikramaditya, MS', role: 'Bone & Joint Specialist (Orthopaedic)' },
      { name: 'Dr. Sunita Murthy, MD', role: 'Chest & Breathing Specialist (Pulmonologist)' }
    ],
    nursesOnDuty: 35,
    ambulanceAvailable: true,
    servicesOffered: [
      '24/7 Emergency Care',
      'Free Medicines',
      'Heart Checkups',
      'X-Ray & Ultrasound',
      'Blood Bank',
      'Delivery & Maternity Care',
      'ICU & Oxygen Beds'
    ],
    operatingHours: 'Open 24 Hours (Emergency & Inpatient) / OPD: 9 AM - 4 PM'
  },
  {
    id: 'fac-gov-phc-01',
    name: 'Kolar Sub-Divisional Government Health Centre',
    category: 'Government',
    facilityType: 'Primary Health Centre',
    lat: 13.1367,
    lng: 78.1291,
    address: 'Main Road, Kolar Rural, Karnataka 563101',
    contact: '+91 8152 222104',
    emergency24x7: true,
    ayushmanBharatAccepted: true,
    totalBeds: 16,
    availableBeds: 7,
    icuBeds: 0,
    availableIcuBeds: 0,
    oxygenBeds: 4,
    doctorsOnDuty: [
      { name: 'Dr. Ramesh Kumar, MBBS', role: 'General Family Doctor' },
      { name: 'Dr. Ananya Rao, MBBS', role: 'Women & Child Health Doctor' }
    ],
    nursesOnDuty: 4,
    ambulanceAvailable: true,
    servicesOffered: [
      'General Checkup & Fever Care',
      'Mother & Baby Care',
      'Free Childhood Vaccines',
      'Blood Pressure & Sugar Testing',
      'Free Essential Medicines'
    ],
    operatingHours: '24 Hours Emergency / Regular OPD: 8:30 AM - 4:30 PM'
  },
  {
    id: 'fac-gov-chc-01',
    name: 'Bangarapet Community Government Hospital',
    category: 'Government',
    facilityType: 'Community Health Centre',
    lat: 12.9774,
    lng: 78.1966,
    address: 'Station Road, Bangarapet, Karnataka 563114',
    contact: '+91 8153 255220',
    emergency24x7: true,
    ayushmanBharatAccepted: true,
    totalBeds: 40,
    availableBeds: 14,
    icuBeds: 4,
    availableIcuBeds: 2,
    oxygenBeds: 12,
    doctorsOnDuty: [
      { name: 'Dr. Suresh Babu, MD', role: 'Senior Family Physician' },
      { name: 'Dr. Deepa S., MS', role: 'Women\'s Health & Delivery Specialist' },
      { name: 'Dr. Harish N., DNB', role: 'Children\'s Specialist (Paediatrician)' }
    ],
    nursesOnDuty: 10,
    ambulanceAvailable: true,
    servicesOffered: [
      '24/7 Emergency Room',
      'Delivery & Maternity Ward',
      'Children\'s Care',
      'Minor Surgery',
      'Digital X-Ray & Lab Tests'
    ],
    operatingHours: 'Open 24 Hours'
  },
  {
    id: 'fac-gov-malur-01',
    name: 'Malur Taluk Government General Hospital',
    category: 'Government',
    facilityType: 'Taluk Hospital',
    lat: 13.0039,
    lng: 77.9405,
    address: 'Main Road, Malur Town, Karnataka 563130',
    contact: '+91 8151 232115',
    emergency24x7: true,
    ayushmanBharatAccepted: true,
    totalBeds: 60,
    availableBeds: 21,
    icuBeds: 6,
    availableIcuBeds: 3,
    oxygenBeds: 16,
    doctorsOnDuty: [
      { name: 'Dr. Manjunath Reddy, MS', role: 'General Surgeon' },
      { name: 'Dr. Shobha K., MD', role: 'Women\'s Health & Delivery Doctor' }
    ],
    nursesOnDuty: 12,
    ambulanceAvailable: true,
    servicesOffered: [
      '24/7 Emergency Care',
      'Ayushman Bharat Cashless Care',
      'Maternity & Newborn Ward',
      'Ultrasound & Lab Tests'
    ],
    operatingHours: 'Open 24 Hours'
  },
  {
    id: 'fac-gov-mulbagal-01',
    name: 'Mulbagal Government Rural Hospital',
    category: 'Government',
    facilityType: 'Rural Hospital',
    lat: 13.1648,
    lng: 78.3942,
    address: 'NH 75 Bypass, Mulbagal, Karnataka 563131',
    contact: '+91 8159 242011',
    emergency24x7: true,
    ayushmanBharatAccepted: true,
    totalBeds: 30,
    availableBeds: 9,
    icuBeds: 2,
    availableIcuBeds: 1,
    oxygenBeds: 8,
    doctorsOnDuty: [
      { name: 'Dr. Farooq Ahmed, MBBS', role: 'General Doctor' },
      { name: 'Dr. Geetha Bai, DGO', role: 'Maternity Specialist' }
    ],
    nursesOnDuty: 6,
    ambulanceAvailable: true,
    servicesOffered: [
      '24/7 Accident & Emergency',
      'Free Normal Deliveries',
      'Childhood Vaccines',
      'Diabetes & BP Clinic'
    ],
    operatingHours: 'Open 24 Hours'
  },
  {
    id: 'fac-gov-sub-01',
    name: 'Vokkaleri Village Government Health Post (Arogya Mandir)',
    category: 'Government',
    facilityType: 'Village Clinic',
    lat: 13.0850,
    lng: 78.1620,
    address: 'Near Gram Panchayat, Vokkaleri Village, Kolar 563130',
    contact: '+91 8152 245012',
    emergency24x7: false,
    ayushmanBharatAccepted: true,
    totalBeds: 4,
    availableBeds: 3,
    icuBeds: 0,
    availableIcuBeds: 0,
    oxygenBeds: 1,
    doctorsOnDuty: [
      { name: 'Smt. Lakshmi Devi', role: 'Community Health Officer' },
      { name: 'Smt. Kavitha M.', role: 'Senior Village Health Nurse' }
    ],
    nursesOnDuty: 2,
    ambulanceAvailable: false,
    servicesOffered: [
      'Blood Pressure & Sugar Checkup',
      'Pregnancy Care & Testing',
      'First Aid & Dressing',
      'Free Monthly Tablets'
    ],
    operatingHours: '9:00 AM - 4:30 PM (Mon-Sat)'
  },
  {
    id: 'fac-gov-chintamani-01',
    name: 'Chintamani Government Taluk Hospital',
    category: 'Government',
    facilityType: 'Taluk Hospital',
    lat: 13.4000,
    lng: 78.0667,
    address: 'Court Road, Chintamani, Karnataka 563125',
    contact: '+91 8154 252100',
    emergency24x7: true,
    ayushmanBharatAccepted: true,
    totalBeds: 80,
    availableBeds: 28,
    icuBeds: 8,
    availableIcuBeds: 4,
    oxygenBeds: 20,
    doctorsOnDuty: [
      { name: 'Dr. Narayanaswamy, MD', role: 'General Medicine Doctor' },
      { name: 'Dr. Radhika P., MS', role: 'Gynecologist' }
    ],
    nursesOnDuty: 18,
    ambulanceAvailable: true,
    servicesOffered: [
      '24/7 Emergency & Casualty',
      'Operation Theatre',
      'Ayushman Bharat Scheme',
      'Digital X-Ray & Blood Bank'
    ],
    operatingHours: 'Open 24 Hours'
  },
  {
    id: 'fac-gov-srinivas-01',
    name: 'Srinivaspur Government General Hospital',
    category: 'Government',
    facilityType: 'Taluk Hospital',
    lat: 13.3385,
    lng: 78.2144,
    address: 'Kolar Road, Srinivaspur, Karnataka 563135',
    contact: '+91 8157 245230',
    emergency24x7: true,
    ayushmanBharatAccepted: true,
    totalBeds: 50,
    availableBeds: 16,
    icuBeds: 4,
    availableIcuBeds: 2,
    oxygenBeds: 12,
    doctorsOnDuty: [
      { name: 'Dr. Venkatachalapathy, MBBS', role: 'Chief Medical Officer' },
      { name: 'Dr. Latha R., MBBS', role: 'Family Health Doctor' }
    ],
    nursesOnDuty: 10,
    ambulanceAvailable: true,
    servicesOffered: [
      '24 Hours Emergency',
      'Maternity Ward',
      'Childhood Immunization',
      'Government Free Schemes'
    ],
    operatingHours: 'Open 24 Hours'
  },

  // ================= PRIVATE HOSPITALS =================
  {
    id: 'fac-pvt-urs-01',
    name: 'Sri Devaraj Urs Super Speciality Hospital & Medical College',
    category: 'Private',
    facilityType: 'Super-Specialty Hospital',
    lat: 13.1554,
    lng: 78.1755,
    address: 'Tamaka, Kolar-Bangalore Highway, Karnataka 563103',
    contact: '+91 8152 243003',
    emergency24x7: true,
    ayushmanBharatAccepted: true, // Accepts Ayushman Bharat & Private Insurance
    totalBeds: 750,
    availableBeds: 142,
    icuBeds: 60,
    availableIcuBeds: 18,
    oxygenBeds: 120,
    doctorsOnDuty: [
      { name: 'Prof. Dr. Rajeshwar Swamy, MD, DM', role: 'Brain & Nerve Specialist (Neurologist)' },
      { name: 'Dr. Meera Chandrasekhar, MD', role: 'Diabetes & Hormone Specialist' },
      { name: 'Dr. Arvind Sastry, MCh', role: 'Heart Surgeon (Cardiothoracic)' },
      { name: 'Dr. Shilpa Gowda, MS', role: 'Senior Women\'s Care Specialist' }
    ],
    nursesOnDuty: 95,
    ambulanceAvailable: true,
    servicesOffered: [
      '24/7 Level-1 Emergency & Trauma',
      'Heart Surgeries & Angioplasty',
      'Kidney Dialysis Centre',
      'MRI & Advanced CT Scan',
      'Cancer Treatment',
      'ICU, NICU & Ventilators',
      'Cashless Insurance & Ayushman Bharat'
    ],
    operatingHours: 'Open 24x7 Round the Clock'
  },
  {
    id: 'fac-pvt-manipal-01',
    name: 'Manipal Outreach Clinic & Multi-Specialty Hospital',
    category: 'Private',
    facilityType: 'Multi-Specialty Hospital',
    lat: 13.0720,
    lng: 77.7995,
    address: 'Old Madras Road, Hoskote, Karnataka 562114',
    contact: '+91 80 2845 6789',
    emergency24x7: true,
    ayushmanBharatAccepted: true,
    totalBeds: 120,
    availableBeds: 34,
    icuBeds: 20,
    availableIcuBeds: 7,
    oxygenBeds: 40,
    doctorsOnDuty: [
      { name: 'Dr. Sandeep Nair, MD', role: 'Heart & Blood Pressure Specialist' },
      { name: 'Dr. Priya Varma, MS', role: 'General & Laparoscopic Surgeon' },
      { name: 'Dr. Amit Joshi, MD', role: 'Senior Child Doctor' }
    ],
    nursesOnDuty: 30,
    ambulanceAvailable: true,
    servicesOffered: [
      '24/7 Emergency & Ambulance',
      'Intensive Care Unit (ICU)',
      'Digital X-Ray & MRI',
      'Laparoscopic Surgeries',
      'Cashless Health Insurance'
    ],
    operatingHours: 'Open 24 Hours'
  },
  {
    id: 'fac-pvt-apollo-01',
    name: 'Apollo Clinic & Emergency Medical Centre',
    category: 'Private',
    facilityType: 'Specialty Clinic & Daycare',
    lat: 13.1420,
    lng: 78.1310,
    address: 'Bangalore Road, Near Clock Tower, Kolar 563101',
    contact: '+91 8152 228900',
    emergency24x7: true,
    ayushmanBharatAccepted: false,
    totalBeds: 25,
    availableBeds: 8,
    icuBeds: 4,
    availableIcuBeds: 2,
    oxygenBeds: 8,
    doctorsOnDuty: [
      { name: 'Dr. Karthik Rao, MD', role: 'Family Health & Diabetes Specialist' },
      { name: 'Dr. Sowmya B., DNB', role: 'Skin & Allergy Specialist' }
    ],
    nursesOnDuty: 8,
    ambulanceAvailable: true,
    servicesOffered: [
      '24/7 Urgent Care',
      'Fast Blood Tests & ECG',
      'Diabetes & Heart Screening',
      'Specialist Video Consults'
    ],
    operatingHours: '24 Hours Emergency / 8 AM - 9 PM OPD'
  },
  {
    id: 'fac-pvt-narayana-01',
    name: 'Narayana Health Community Heart & Kidney Care',
    category: 'Private',
    facilityType: 'Super-Specialty Hospital',
    lat: 13.0650,
    lng: 77.8100,
    address: 'Near Toll Plaza, NH 75, Hoskote-Kolar Highway 562114',
    contact: '+91 80 7122 2222',
    emergency24x7: true,
    ayushmanBharatAccepted: true,
    totalBeds: 180,
    availableBeds: 52,
    icuBeds: 35,
    availableIcuBeds: 11,
    oxygenBeds: 50,
    doctorsOnDuty: [
      { name: 'Dr. Vivek Murthy, MS, MCh', role: 'Senior Heart Specialist' },
      { name: 'Dr. Ananya Sen, MD, DM', role: 'Kidney Specialist (Nephrologist)' }
    ],
    nursesOnDuty: 45,
    ambulanceAvailable: true,
    servicesOffered: [
      '24/7 Heart Attack Emergency Unit',
      'Kidney Dialysis (3 shifts)',
      'ICU & Cardiac Care',
      'Ayushman Bharat & Arogya Karnataka'
    ],
    operatingHours: 'Open 24 Hours'
  },
  {
    id: 'fac-pvt-sai-01',
    name: 'Sri Sathya Sai General Hospital (Free & Charitable)',
    category: 'Private',
    facilityType: 'Charitable Multi-Specialty',
    lat: 12.9860,
    lng: 77.7580,
    address: 'Whitefield Road, East Bangalore Rural Border 560066',
    contact: '+91 80 2841 1500',
    emergency24x7: true,
    ayushmanBharatAccepted: true,
    totalBeds: 320,
    availableBeds: 68,
    icuBeds: 24,
    availableIcuBeds: 8,
    oxygenBeds: 70,
    doctorsOnDuty: [
      { name: 'Dr. Govind Swaminathan, MS', role: 'Orthopaedic Surgeon' },
      { name: 'Dr. Jayashree Ram, MD', role: 'Head of Maternity & Child Health' }
    ],
    nursesOnDuty: 50,
    ambulanceAvailable: true,
    servicesOffered: [
      '100% Free Surgeries & Medicines',
      '24/7 Emergency & Maternity',
      'Eye Care & Cataract Surgeries',
      'Childhood Healthcare'
    ],
    operatingHours: 'Open 24 Hours'
  },
  {
    id: 'fac-pvt-santhiram-01',
    name: 'Santhiram Private Hospital & Maternity Home',
    category: 'Private',
    facilityType: 'Maternity & General Hospital',
    lat: 12.9810,
    lng: 78.1920,
    address: 'Vivekananda Nagar, Bangarapet, Karnataka 563114',
    contact: '+91 8153 256880',
    emergency24x7: true,
    ayushmanBharatAccepted: true,
    totalBeds: 35,
    availableBeds: 12,
    icuBeds: 4,
    availableIcuBeds: 2,
    oxygenBeds: 10,
    doctorsOnDuty: [
      { name: 'Dr. Santhosh Kumar, MD', role: 'Family Doctor & Physician' },
      { name: 'Dr. Ramya S., MS', role: 'Women\'s Health & Delivery Doctor' }
    ],
    nursesOnDuty: 9,
    ambulanceAvailable: true,
    servicesOffered: [
      '24/7 Maternity & Delivery',
      'Paediatric Care',
      'Inpatient Hospitalization',
      'Pharmacy & Lab'
    ],
    operatingHours: 'Open 24 Hours'
  },
  {
    id: 'fac-pvt-lifecare-01',
    name: 'Lifecare Multi-Specialty Hospital & Dialysis Center',
    category: 'Private',
    facilityType: 'Multi-Specialty Hospital',
    lat: 13.0080,
    lng: 77.9350,
    address: 'Near Bus Stand, Malur, Karnataka 563130',
    contact: '+91 8151 234500',
    emergency24x7: true,
    ayushmanBharatAccepted: true,
    totalBeds: 45,
    availableBeds: 15,
    icuBeds: 6,
    availableIcuBeds: 3,
    oxygenBeds: 14,
    doctorsOnDuty: [
      { name: 'Dr. Kiran Gowda, MD', role: 'Critical Care Specialist' },
      { name: 'Dr. Archana M., MBBS', role: 'General Medicine Physician' }
    ],
    nursesOnDuty: 11,
    ambulanceAvailable: true,
    servicesOffered: [
      '24/7 Casualty & ICU',
      'Dialysis Services',
      'Private Insurance & TPA Cashless',
      'Digital Lab & Pharmacy'
    ],
    operatingHours: 'Open 24 Hours'
  },
  {
    id: 'fac-gov-kgf-01',
    name: 'KGF General Government Hospital (Robertsonpet)',
    category: 'Government',
    facilityType: 'Taluk Hospital',
    lat: 12.9580,
    lng: 78.2710,
    address: 'Hospital Road, Robertsonpet, KGF, Karnataka 563122',
    contact: '+91 8153 260108',
    emergency24x7: true,
    ayushmanBharatAccepted: true,
    totalBeds: 120,
    availableBeds: 38,
    icuBeds: 10,
    availableIcuBeds: 4,
    oxygenBeds: 30,
    doctorsOnDuty: [
      { name: 'Dr. Mohan Kumar, MS', role: 'General Surgeon' },
      { name: 'Dr. Vimala Devi, MD', role: 'Maternity Specialist' }
    ],
    nursesOnDuty: 22,
    ambulanceAvailable: true,
    servicesOffered: [
      '24/7 Emergency & Casualty',
      'Free Deliveries & C-Section',
      'Childhood Vaccines',
      'Blood Bank & Lab'
    ],
    operatingHours: 'Open 24 Hours'
  },
  {
    id: 'fac-gov-chik-01',
    name: 'Chikkaballapur District Government Hospital',
    category: 'Government',
    facilityType: 'District Hospital',
    lat: 13.4350,
    lng: 77.7280,
    address: 'B.B. Road, Chikkaballapur, Karnataka 562101',
    contact: '+91 8156 272222',
    emergency24x7: true,
    ayushmanBharatAccepted: true,
    totalBeds: 200,
    availableBeds: 54,
    icuBeds: 16,
    availableIcuBeds: 5,
    oxygenBeds: 50,
    doctorsOnDuty: [
      { name: 'Dr. Chandrasekhar, MD', role: 'General Physician' },
      { name: 'Dr. Savitha Rani, MS', role: 'Orthopaedic Specialist' }
    ],
    nursesOnDuty: 32,
    ambulanceAvailable: true,
    servicesOffered: [
      '24/7 Trauma Care',
      'Free Surgeries',
      'ICU & Ventilators',
      'CT Scan & Digital X-Ray'
    ],
    operatingHours: 'Open 24 Hours'
  },
  {
    id: 'fac-pvt-mvj-01',
    name: 'MVJ Medical College and Research Hospital',
    category: 'Private',
    facilityType: 'Super-Specialty Hospital',
    lat: 13.0780,
    lng: 77.7910,
    address: 'Dandupalya, National Highway 75, Hoskote 562114',
    contact: '+91 80 2806 0200',
    emergency24x7: true,
    ayushmanBharatAccepted: true,
    totalBeds: 600,
    availableBeds: 110,
    icuBeds: 45,
    availableIcuBeds: 14,
    oxygenBeds: 100,
    doctorsOnDuty: [
      { name: 'Dr. Srinivas Prasad, MCh', role: 'Neurosurgeon' },
      { name: 'Dr. Kavitha Shetty, MD', role: 'Paediatrics & Neonatal Care' }
    ],
    nursesOnDuty: 80,
    ambulanceAvailable: true,
    servicesOffered: [
      '24/7 Level-1 Trauma & Emergency',
      'Cardiac & Neuro ICU',
      'Ayushman Bharat & Arogya Karnataka',
      'Advanced Dialysis & MRI'
    ],
    operatingHours: 'Open 24 Hours'
  }
];

// Helper to filter and sort facilities by user location and radius
export function getFacilitiesWithinRadius(userLat, userLng, radiusKm = 60, filters = {}) {
  const { category = 'ALL', emergencyOnly = false, icuOnly = false, searchQuery = '' } = filters;

  return INITIAL_FACILITIES.map(fac => {
    const dist = calculateDistance(userLat, userLng, fac.lat, fac.lng);
    return {
      ...fac,
      distanceKm: dist,
      isWithinRadius: dist <= radiusKm
    };
  })
    .filter(fac => {
      // Radius check (default 60km)
      if (radiusKm && fac.distanceKm > radiusKm) return false;

      // Category check: Government vs Private
      if (category !== 'ALL' && fac.category !== category) return false;

      // Emergency check
      if (emergencyOnly && !fac.emergency24x7) return false;

      // ICU check
      if (icuOnly && (!fac.icuBeds || fac.availableIcuBeds <= 0)) return false;

      // Search query check
      if (searchQuery && searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = fac.name.toLowerCase().includes(q);
        const matchesAddress = fac.address.toLowerCase().includes(q);
        const matchesType = fac.facilityType.toLowerCase().includes(q);
        const matchesService = fac.servicesOffered.some(s => s.toLowerCase().includes(q));
        const matchesDoctor = fac.doctorsOnDuty.some(d => d.name.toLowerCase().includes(q) || d.role.toLowerCase().includes(q));
        if (!matchesName && !matchesAddress && !matchesType && !matchesService && !matchesDoctor) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => a.distanceKm - b.distanceKm); // Closest first
}
