// Rural Healthcare Facility Data Network (OpenStreetMap / Leaflet compatible)
// Representative network spanning Village Sub-Centres -> PHCs -> CHCs -> District Hospitals -> Medical College

export const FACILITY_TIERS = {
  SUBCENTRE: 'Sub-Centre',
  PHC: 'Primary Health Centre (PHC)',
  CHC: 'Community Health Centre (CHC)',
  DISTRICT: 'District Hospital (DH)',
  TERTIARY: 'Tertiary Medical College'
};

export const INITIAL_FACILITIES = [
  {
    id: 'fac-phc-01',
    name: 'Kolar Sub-Divisional Primary Health Centre',
    tier: FACILITY_TIERS.PHC,
    type: 'PHC',
    lat: 13.1367,
    lng: 78.1291,
    address: 'Main Road, Kolar Rural, Karnataka 563101',
    contact: '+91 8152 222104',
    distanceKm: 2.4,
    emergency24x7: true,
    totalBeds: 12,
    availableBeds: 5,
    icuAvailable: false,
    doctorsOnDuty: [
      { name: 'Dr. Ramesh Kumar, MBBS', role: 'Medical Officer (General)' },
      { name: 'Dr. Ananya Rao, MBBS', role: 'Community Health Physician' }
    ],
    nursesOnDuty: 4,
    ambulanceAvailable: true,
    specialties: ['General Medicine', 'Maternal & Child Health', 'Immunization', 'Basic Pathology', 'NCD Screening'],
    operatingHours: '24 Hours Emergency / 8:00 AM - 4:00 PM OPD',
    teleconsultEnabled: true
  },
  {
    id: 'fac-sub-01',
    name: 'Vokkaleri Village Ayushman Arogya Mandir (Sub-Centre)',
    tier: FACILITY_TIERS.SUBCENTRE,
    type: 'Sub-Centre',
    lat: 13.0850,
    lng: 78.1620,
    address: 'Near Gram Panchayat, Vokkaleri Village, Kolar 563130',
    contact: '+91 8152 245012',
    distanceKm: 6.8,
    emergency24x7: false,
    totalBeds: 2,
    availableBeds: 2,
    icuAvailable: false,
    doctorsOnDuty: [
      { name: 'Smt. Lakshmi Devi', role: 'Community Health Officer (CHO)' },
      { name: 'Smt. Kavitha M.', role: 'Senior Auxiliary Nurse Midwife (ANM)' }
    ],
    nursesOnDuty: 2,
    ambulanceAvailable: false,
    specialties: ['Antenatal Care', 'BP & Blood Sugar Screening', 'Basic First Aid', 'Essential Drug Dispensing'],
    operatingHours: '9:00 AM - 4:30 PM (Mon-Sat)',
    teleconsultEnabled: true
  },
  {
    id: 'fac-chc-01',
    name: 'Bangarapet Community Health Centre (CHC)',
    tier: FACILITY_TIERS.CHC,
    type: 'CHC',
    lat: 12.9774,
    lng: 78.1966,
    address: 'Station Road, Bangarapet, Karnataka 563114',
    contact: '+91 8153 255220',
    distanceKm: 14.2,
    emergency24x7: true,
    totalBeds: 30,
    availableBeds: 11,
    icuAvailable: false,
    doctorsOnDuty: [
      { name: 'Dr. Suresh Babu, MD', role: 'Physician / Specialist' },
      { name: 'Dr. Deepa S., MS', role: 'Obstetrician & Gynaecologist' },
      { name: 'Dr. Harish N., DNB', role: 'Paediatrician' }
    ],
    nursesOnDuty: 8,
    ambulanceAvailable: true,
    specialties: ['General Surgery', 'Obstetrics & Gynaecology', 'Paediatrics', 'Emergency Trauma', 'Digital X-Ray', '24x7 Lab'],
    operatingHours: '24 Hours Emergency & Inpatient / 9:00 AM - 4:00 PM OPD',
    teleconsultEnabled: true
  },
  {
    id: 'fac-dh-01',
    name: 'SNR District Hospital & Trauma Centre',
    tier: FACILITY_TIERS.DISTRICT,
    type: 'District Hospital',
    lat: 13.1332,
    lng: 78.1388,
    address: 'Hospital Road, Gulpet, Kolar, Karnataka 563101',
    contact: '+91 8152 222340',
    distanceKm: 4.1,
    emergency24x7: true,
    totalBeds: 250,
    availableBeds: 42,
    icuAvailable: true,
    doctorsOnDuty: [
      { name: 'Dr. Preethi Hegde, MD, DM', role: 'Consultant Cardiologist' },
      { name: 'Dr. Vikramaditya, MS, MCh', role: 'Orthopaedic & Trauma Surgeon' },
      { name: 'Dr. Sunita Murthy, MD', role: 'Chief Pulmonologist & Critical Care' }
    ],
    nursesOnDuty: 35,
    ambulanceAvailable: true,
    specialties: ['Cardiology', 'Pulmonology', 'Orthopaedics', 'ICU & Critical Care', 'Blood Bank', 'CT Scan & MRI', 'Dialysis', 'NICU'],
    operatingHours: '24x7 Round the Clock Emergency, ICU & Trauma',
    teleconsultEnabled: true
  },
  {
    id: 'fac-phc-02',
    name: 'Mulbagal Rural Primary Health Centre',
    tier: FACILITY_TIERS.PHC,
    type: 'PHC',
    lat: 13.1648,
    lng: 78.3942,
    address: 'NH 75 Bypass, Mulbagal, Karnataka 563131',
    contact: '+91 8159 242011',
    distanceKm: 28.5,
    emergency24x7: true,
    totalBeds: 10,
    availableBeds: 4,
    icuAvailable: false,
    doctorsOnDuty: [
      { name: 'Dr. Farooq Ahmed, MBBS', role: 'Medical Officer' }
    ],
    nursesOnDuty: 3,
    ambulanceAvailable: true,
    specialties: ['General Medicine', 'Maternal Health', 'Tuberculosis & Leprosy Care', 'Child Immunization'],
    operatingHours: '24 Hours Emergency / 8:30 AM - 4:30 PM OPD',
    teleconsultEnabled: true
  },
  {
    id: 'fac-tertiary-01',
    name: 'Sri Devaraj Urs Medical College & Apex Research Hospital',
    tier: FACILITY_TIERS.TERTIARY,
    type: 'Tertiary Medical College',
    lat: 13.1554,
    lng: 78.1755,
    address: 'Tamaka, Kolar, Karnataka 563103',
    contact: '+91 8152 243003',
    distanceKm: 8.5,
    emergency24x7: true,
    totalBeds: 750,
    availableBeds: 118,
    icuAvailable: true,
    doctorsOnDuty: [
      { name: 'Prof. Dr. Rajeshwar Swamy, MD, DM', role: 'Head of Neurology' },
      { name: 'Dr. Meera Chandrasekhar, MD, DNB', role: 'Endocrinologist' },
      { name: 'Dr. Arvind Sastry, MCh', role: 'Cardiothoracic Surgeon' }
    ],
    nursesOnDuty: 95,
    ambulanceAvailable: true,
    specialties: ['Cardiology', 'Neurology', 'Nephrology', 'Oncology', 'Super-Specialty Surgery', 'Advanced Telemedicine Hub', 'Level-1 Trauma'],
    operatingHours: '24x7 Super-Specialty Medical Care',
    teleconsultEnabled: true
  }
];
