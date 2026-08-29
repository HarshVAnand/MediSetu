"""
Seed sample doctors and patients into MongoDB.
"""
from datetime import datetime, date
from db import db


def seed_doctors():
    """Insert sample doctors."""
    if db.doctors.count_documents({}) > 0:
        print(f"   Doctors already exist ({db.doctors.count_documents({})}). Skipping.")
        return

    doctors = [
        {"doctor_id": "DOC001", "name": "Dr. Sarah Chen", "specialization": "Cardiology",
         "hospital": "Metro General Hospital", "email": "sarah.chen@metro.com", "phone": "555-0101"},
        {"doctor_id": "DOC002", "name": "Dr. James Wilson", "specialization": "Internal Medicine",
         "hospital": "Metro General Hospital", "email": "james.wilson@metro.com", "phone": "555-0102"},
        {"doctor_id": "DOC003", "name": "Dr. Maria Rodriguez", "specialization": "Endocrinology",
         "hospital": "University Medical Center", "email": "maria.r@umc.edu", "phone": "555-0103"},
        {"doctor_id": "DOC004", "name": "Dr. Robert Kim", "specialization": "Neurology",
         "hospital": "University Medical Center", "email": "robert.kim@umc.edu", "phone": "555-0104"},
        {"doctor_id": "DOC005", "name": "Dr. Emily Thompson", "specialization": "Rheumatology",
         "hospital": "City Health Clinic", "email": "emily.t@cityhc.com", "phone": "555-0105"},
        {"doctor_id": "DOC006", "name": "Dr. Ahmad Patel", "specialization": "Psychiatry",
         "hospital": "Mental Health Institute", "email": "ahmad.p@mhi.org", "phone": "555-0106"},
        {"doctor_id": "DOC007", "name": "Dr. Lisa Wang", "specialization": "Geriatrics",
         "hospital": "Senior Care Medical", "email": "lisa.w@seniorcare.com", "phone": "555-0107"},
        {"doctor_id": "DOC008", "name": "Dr. Michael Brown", "specialization": "Pulmonology",
         "hospital": "Metro General Hospital", "email": "michael.b@metro.com", "phone": "555-0108"},
    ]

    for doc in doctors:
        doc['created_at'] = datetime.utcnow()

    db.doctors.insert_many(doctors)
    print(f"✅ Seeded {len(doctors)} doctors!")


def seed_patients():
    """Insert sample patients with realistic chronic conditions."""
    if db.patients.count_documents({}) > 0:
        print(f"   Patients already exist ({db.patients.count_documents({})}). Skipping.")
        return

    patients = [
        {
            "patient_id": "PAT001", "name": "Eleanor Mitchell",
            "date_of_birth": "1945-03-15", "gender": "Female", "weight_kg": 68.0,
            "allergies": ["Penicillin", "Sulfa drugs"],
            "conditions": ["Hypertension", "Type 2 Diabetes", "Atrial Fibrillation", "Osteoarthritis"],
            "email": "eleanor.m@email.com", "phone": "555-1001"
        },
        {
            "patient_id": "PAT002", "name": "Harold Johnson",
            "date_of_birth": "1950-07-22", "gender": "Male", "weight_kg": 85.0,
            "allergies": ["Codeine"],
            "conditions": ["Heart Failure", "Chronic Kidney Disease", "Gout", "Depression"],
            "email": "harold.j@email.com", "phone": "555-1002"
        },
        {
            "patient_id": "PAT003", "name": "Margaret Chen",
            "date_of_birth": "1938-11-05", "gender": "Female", "weight_kg": 55.0,
            "allergies": [],
            "conditions": ["Hypothyroidism", "Atrial Fibrillation", "Osteoporosis", "GERD", "Anxiety"],
            "email": "margaret.c@email.com", "phone": "555-1003"
        },
        {
            "patient_id": "PAT004", "name": "Robert Williams",
            "date_of_birth": "1955-01-30", "gender": "Male", "weight_kg": 92.0,
            "allergies": ["Aspirin"],
            "conditions": ["Type 2 Diabetes", "Hypertension", "Hyperlipidemia", "Neuropathy"],
            "email": "robert.w@email.com", "phone": "555-1004"
        },
        {
            "patient_id": "PAT005", "name": "Dorothy Garcia",
            "date_of_birth": "1942-09-18", "gender": "Female", "weight_kg": 72.0,
            "allergies": ["Latex"],
            "conditions": ["Rheumatoid Arthritis", "Hypertension", "Depression", "Chronic Pain"],
            "email": "dorothy.g@email.com", "phone": "555-1005"
        }
    ]

    for pat in patients:
        pat['created_at'] = datetime.utcnow()

    db.patients.insert_many(patients)
    print(f"✅ Seeded {len(patients)} patients!")


def seed_all():
    """Run all seeding functions."""
    print("\n🌱 Seeding database...")
    seed_doctors()
    seed_patients()
    print("🌱 Seeding complete!\n")


if __name__ == '__main__':
    seed_all()