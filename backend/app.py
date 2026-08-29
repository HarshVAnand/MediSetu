"""
Prescription Interaction Drift Tracker — Flask API
All routes that the frontend will call.
"""

from flask import Flask, request, jsonify # type: ignore
from flask_cors import CORS # type: ignore
from datetime import datetime, date
from bson.objectid import ObjectId
import json

from db import db
from seed_medicines import import_medicines_from_csv
from seed_data import seed_all
from interaction_checker import run_full_check

app = Flask(__name__)
CORS(app)  # Allow frontend to talk to backend


# =============================================
# HELPER: Convert MongoDB ObjectId to string
# (MongoDB uses special IDs that aren't JSON-serializable)
# =============================================

def serialize_doc(doc):
    """Convert a MongoDB document to a JSON-safe dictionary."""
    if doc is None:
        return None
    doc['_id'] = str(doc['_id'])
    # Convert datetime objects to strings
    for key, value in doc.items():
        if isinstance(value, datetime):
            doc[key] = value.isoformat()
        elif isinstance(value, date):
            doc[key] = value.isoformat()
        elif isinstance(value, ObjectId):
            doc[key] = str(value)
    return doc


def serialize_docs(docs):
    """Convert a list of MongoDB documents."""
    return [serialize_doc(d) for d in docs]


# =============================================
# MEDICINE ROUTES
# =============================================

@app.route('/api/medicines', methods=['GET'])
def get_medicines():
    """Search and list medicines from MongoDB."""
    search = request.args.get('search', '').strip()
    drug_class = request.args.get('drug_class', '').strip()

    query = {}
    if search:
        # Search across multiple fields using regex
        query['$or'] = [
            {'medicine_name': {'$regex': search, '$options': 'i'}},
            {'generic_name': {'$regex': search, '$options': 'i'}},
            {'drug_class': {'$regex': search, '$options': 'i'}}
        ]
    if drug_class:
        query['drug_class'] = {'$regex': drug_class, '$options': 'i'}

    medicines = list(db.medicines.find(query).sort('medicine_name', 1))
    return jsonify({
        'medicines': serialize_docs(medicines),
        'total': len(medicines)
    })


@app.route('/api/medicines/<medicine_id>', methods=['GET'])
def get_medicine(medicine_id):
    """Get one medicine by its MongoDB _id."""
    try:
        med = db.medicines.find_one({'_id': ObjectId(medicine_id)})
    except Exception:
        med = db.medicines.find_one({'rxcui': medicine_id})

    if not med:
        return jsonify({'error': 'Medicine not found'}), 404
    return jsonify(serialize_doc(med))


@app.route('/api/medicines/classes', methods=['GET'])
def get_classes():
    """Get all unique drug classes."""
    classes = db.medicines.distinct('drug_class')
    return jsonify({'classes': sorted(classes)})


# =============================================
# DOCTOR ROUTES
# =============================================

@app.route('/api/doctors', methods=['GET'])
def get_doctors():
    doctors = list(db.doctors.find().sort('name', 1))
    return jsonify({'doctors': serialize_docs(doctors), 'total': len(doctors)})


@app.route('/api/doctors', methods=['POST'])
def create_doctor():
    data = request.get_json()
    if not data.get('doctor_id') or not data.get('name'):
        return jsonify({'error': 'doctor_id and name required'}), 400

    if db.doctors.find_one({'doctor_id': data['doctor_id']}):
        return jsonify({'error': 'Doctor ID already exists'}), 409

    data['created_at'] = datetime.utcnow()
    result = db.doctors.insert_one(data)
    data['_id'] = str(result.inserted_id)
    return jsonify(serialize_doc(data)), 201


# =============================================
# PATIENT ROUTES
# =============================================

@app.route('/api/patients', methods=['GET'])
def get_patients():
    patients = list(db.patients.find().sort('name', 1))
    # Calculate age for each
    for p in patients:
        if 'date_of_birth' in p:
            try:
                dob = datetime.strptime(p['date_of_birth'], '%Y-%m-%d')
                today = datetime.now()
                p['age'] = today.year - dob.year - (
                    (today.month, today.day) < (dob.month, dob.day)
                )
            except Exception:
                p['age'] = None
    return jsonify({'patients': serialize_docs(patients), 'total': len(patients)})


@app.route('/api/patients', methods=['POST'])
def create_patient():
    data = request.get_json()
    required = ['patient_id', 'name', 'date_of_birth', 'gender']
    for f in required:
        if not data.get(f):
            return jsonify({'error': f'{f} is required'}), 400

    if db.patients.find_one({'patient_id': data['patient_id']}):
        return jsonify({'error': 'Patient ID already exists'}), 409

    # Ensure lists
    if isinstance(data.get('allergies'), str):
        data['allergies'] = [a.strip() for a in data['allergies'].split(',') if a.strip()]
    if isinstance(data.get('conditions'), str):
        data['conditions'] = [c.strip() for c in data['conditions'].split(',') if c.strip()]

    data['created_at'] = datetime.utcnow()
    result = db.patients.insert_one(data)
    data['_id'] = str(result.inserted_id)
    return jsonify(serialize_doc(data)), 201


@app.route('/api/patients/<patient_id>', methods=['GET'])
def get_patient(patient_id):
    """Get patient with all their prescriptions."""
    # Try MongoDB _id first, then patient_id string
    try:
        patient = db.patients.find_one({'_id': ObjectId(patient_id)})
    except Exception:
        patient = db.patients.find_one({'patient_id': patient_id})

    if not patient:
        return jsonify({'error': 'Patient not found'}), 404

    patient = serialize_doc(patient)

    # Fetch prescriptions
    prescriptions = list(db.prescriptions.find(
        {'patient_id': patient['patient_id']}
    ).sort('date_prescribed', -1))

    # Enrich prescriptions with medicine and doctor names
    for rx in prescriptions:
        med = db.medicines.find_one({'_id': ObjectId(rx['medicine_id'])}) if rx.get('medicine_id') else None
        doc = db.doctors.find_one({'_id': ObjectId(rx['doctor_id'])}) if rx.get('doctor_id') else None
        rx['medicine'] = serialize_doc(med) if med else None
        rx['doctor_name'] = doc['name'] if doc else 'Unknown'

    patient['prescriptions'] = serialize_docs(prescriptions)
    patient['active_prescriptions'] = [
        rx for rx in patient['prescriptions'] if rx.get('is_active')
    ]

    return jsonify(patient)


# =============================================
# PRESCRIPTION ROUTES (Core Feature!)
# =============================================

@app.route('/api/prescriptions', methods=['POST'])
def add_prescription():
    """
    Add a new prescription and AUTOMATICALLY re-check the entire drug stack.
    This is the heart of the drift tracker.
    """
    data = request.get_json()
    required = ['patient_id', 'doctor_id', 'medicine_id', 'date_prescribed', 'dosage', 'frequency']
    for f in required:
        if not data.get(f):
            return jsonify({'error': f'{f} is required'}), 400

    # Verify patient exists
    patient = db.patients.find_one({'patient_id': data['patient_id']})
    if not patient:
        try:
            patient = db.patients.find_one({'_id': ObjectId(data['patient_id'])})
        except Exception:
            pass
    if not patient:
        return jsonify({'error': 'Patient not found'}), 404

    # Verify medicine exists
    try:
        medicine = db.medicines.find_one({'_id': ObjectId(data['medicine_id'])})
    except Exception:
        medicine = None
    if not medicine:
        return jsonify({'error': 'Medicine not found'}), 404

    # Check for duplicate active prescription
    existing = db.prescriptions.find_one({
        'patient_id': patient['patient_id'],
        'medicine_id': data['medicine_id'],
        'is_active': True
    })
    if existing:
        return jsonify({'error': f'{medicine["medicine_name"]} is already active'}), 409

    # Create prescription document
    prescription = {
        'patient_id': patient['patient_id'],
        'doctor_id': data['doctor_id'],
        'medicine_id': data['medicine_id'],
        'medicine_name': medicine['medicine_name'],  # Denormalized for speed
        'date_prescribed': data['date_prescribed'],
        'dosage': data['dosage'],
        'frequency': data['frequency'],
        'is_active': True,
        'notes': data.get('notes', ''),
        'created_at': datetime.utcnow()
    }

    result = db.prescriptions.insert_one(prescription)
    prescription['_id'] = str(result.inserted_id)

    # ★ CORE FEATURE: Re-check ENTIRE drug stack ★
    interaction_result = check_patient_interactions_internal(patient['patient_id'])

    return jsonify({
        'prescription': serialize_doc(prescription),
        'interaction_check': interaction_result,
        'message': f'{medicine["medicine_name"]} added. Full stack re-evaluated.'
    }), 201


@app.route('/api/prescriptions/<prescription_id>/discontinue', methods=['PUT'])
def discontinue_prescription(prescription_id):
    """Stop a drug and re-check the stack."""
    try:
        rx = db.prescriptions.find_one({'_id': ObjectId(prescription_id)})
    except Exception:
        return jsonify({'error': 'Prescription not found'}), 404

    if not rx:
        return jsonify({'error': 'Prescription not found'}), 404

    data = request.get_json() or {}
    disc_date = data.get('date_discontinued', date.today().isoformat())

    db.prescriptions.update_one(
        {'_id': ObjectId(prescription_id)},
        {'$set': {'is_active': False, 'date_discontinued': disc_date}}
    )

    interaction_result = check_patient_interactions_internal(rx['patient_id'])

    return jsonify({
        'message': f'{rx.get("medicine_name", "Drug")} discontinued. Stack re-evaluated.',
        'interaction_check': interaction_result
    })


# =============================================
# INTERACTION CHECK ROUTES
# =============================================

@app.route('/api/patients/<patient_id>/check-interactions', methods=['GET'])
def check_interactions(patient_id):
    """Run full interaction check for a patient."""
    result = check_patient_interactions_internal(patient_id)
    return jsonify({
        'patient_id': patient_id,
        'check_date': date.today().isoformat(),
        'result': result
    })


@app.route('/api/patients/<patient_id>/risk-trend', methods=['GET'])
def get_risk_trend(patient_id):
    """Get historical risk scores."""
    logs = list(db.interaction_logs.find(
        {'patient_id': patient_id}
    ).sort('check_date', 1))
    return jsonify({
        'patient_id': patient_id,
        'trend': serialize_docs(logs)
    })


@app.route('/api/patients/<patient_id>/generate-trend', methods=['POST'])
def generate_trend(patient_id):
    """Simulate adding each drug chronologically and record risk at each step."""
    # Get all prescriptions sorted by date
    prescriptions = list(db.prescriptions.find(
        {'patient_id': patient_id}
    ).sort('date_prescribed', 1))

    if not prescriptions:
        return jsonify({'trend': [], 'message': 'No prescriptions found'})

    # Clear old logs
    db.interaction_logs.delete_many({'patient_id': patient_id})

    # Walk through timeline
    active_drugs = {}
    trend = []

    for rx in prescriptions:
        med = db.medicines.find_one({'_id': ObjectId(rx['medicine_id'])})
        if not med:
            continue

        if rx.get('is_active', True):
            active_drugs[rx['medicine_id']] = {
                'medicine_name': med['medicine_name'],
                'drug_class': med['drug_class'],
                'rxcui': med.get('rxcui', '')
            }
        else:
            active_drugs.pop(rx['medicine_id'], None)

        drug_list = list(active_drugs.values())
        result = run_full_check(drug_list)
        risk = result['risk_assessment']

        log_doc = {
            'patient_id': patient_id,
            'check_date': rx['date_prescribed'],
            'event': f"{'Added' if rx.get('is_active', True) else 'Removed'} {med['medicine_name']}",
            'total_active_drugs': len(drug_list),
            'active_drug_names': [d['medicine_name'] for d in drug_list],
            'total_interactions': result['total_interactions'],
            'risk_score': risk['overall_score'],
            'risk_level': risk['risk_level'],
            'risk_color': risk['risk_color'],
            'created_at': datetime.utcnow()
        }
        db.interaction_logs.insert_one(log_doc)
        trend.append(serialize_doc(log_doc))

    return jsonify({
        'patient_id': patient_id,
        'trend': trend,
        'message': f'Generated {len(trend)} data points'
    })


@app.route('/api/patients/<patient_id>/summary', methods=['GET'])
def get_summary(patient_id):
    """Generate plain-language doctor summary."""
    patient = db.patients.find_one({'patient_id': patient_id})
    if not patient:
        try:
            patient = db.patients.find_one({'_id': ObjectId(patient_id)})
        except Exception:
            pass
    if not patient:
        return jsonify({'error': 'Patient not found'}), 404

    # Get active prescriptions
    active_rx = list(db.prescriptions.find({
        'patient_id': patient['patient_id'], 'is_active': True
    }))

    active_drugs = []
    doctors = set()
    for rx in active_rx:
        med = db.medicines.find_one({'_id': ObjectId(rx['medicine_id'])})
        doc = db.doctors.find_one({'_id': ObjectId(rx['doctor_id'])})
        if med:
            active_drugs.append({
                'medicine_name': med['medicine_name'],
                'drug_class': med['drug_class'],
                'rxcui': med.get('rxcui', '')
            })
        if doc:
            doctors.add(doc['name'])

    result = run_full_check(active_drugs)
    risk = result['risk_assessment']

    # Build plain text summary
    lines = [
        "=== PATIENT MEDICATION SUMMARY ===",
        f"Patient: {patient['name']} ({patient.get('gender', 'N/A')})",
        f"Conditions: {', '.join(patient.get('conditions', []))}",
        f"Allergies: {', '.join(patient.get('allergies', [])) or 'None'}",
        "",
        f"=== ACTIVE MEDICATIONS ({len(active_drugs)}) ==="
    ]
    for rx in active_rx:
        med = db.medicines.find_one({'_id': ObjectId(rx['medicine_id'])})
        doc = db.doctors.find_one({'_id': ObjectId(rx['doctor_id'])})
        if med:
            lines.append(
                f"  • {med['medicine_name']} ({med['drug_class']}) - "
                f"{rx['dosage']} {rx['frequency']}, by {doc['name'] if doc else 'Unknown'}"
            )

    if len(doctors) > 1:
        lines.append(f"\n⚠️ Medications from {len(doctors)} doctors: {', '.join(doctors)}")

    lines.extend([
        "",
        "=== RISK ASSESSMENT ===",
        f"Score: {risk['overall_score']}/10 ({risk['risk_level'].upper()})",
        f"Interactions found: {result['total_interactions']}"
    ])

    for ix in result['pairwise_interactions']:
        icon = {'critical': '🔴', 'serious': '🟠', 'moderate': '🟡'}.get(ix['severity'], '⚪')
        lines.append(f"  {icon} {ix['drug1']} ↔ {ix['drug2']}: {ix['description']}")

    return jsonify({
        'patient_id': patient_id,
        'plain_language_summary': '\n'.join(lines),
        'interaction_check': result
    })


# =============================================
# DASHBOARD
# =============================================

@app.route('/api/dashboard', methods=['GET'])
def dashboard():
    stats = db.get_collection_stats()
    active_rx = db.prescriptions.count_documents({'is_active': True})

    return jsonify({
        'stats': {
            'total_patients': stats.get('patients', 0),
            'total_doctors': stats.get('doctors', 0),
            'total_medicines': stats.get('medicines', 0),
            'total_active_prescriptions': active_rx
        }
    })


# =============================================
# INTERNAL HELPER
# =============================================

def check_patient_interactions_internal(patient_id):
    """Run interaction check and log result to MongoDB."""
    active_rx = list(db.prescriptions.find({
        'patient_id': patient_id, 'is_active': True
    }))

    active_drugs = []
    for rx in active_rx:
        med = db.medicines.find_one({'_id': ObjectId(rx['medicine_id'])})
        if med:
            active_drugs.append({
                'medicine_name': med['medicine_name'],
                'drug_class': med['drug_class'],
                'rxcui': med.get('rxcui', '')
            })

    result = run_full_check(active_drugs)

    # Log to MongoDB
    risk = result['risk_assessment']
    db.interaction_logs.insert_one({
        'patient_id': patient_id,
        'check_date': date.today().isoformat(),
        'total_active_drugs': len(active_drugs),
        'total_interactions': result['total_interactions'],
        'risk_score': risk['overall_score'],
        'risk_level': risk['risk_level'],
        'interactions': result['pairwise_interactions'],
        'created_at': datetime.utcnow()
    })

    return result


# =============================================
# STARTUP
# =============================================

@app.route('/', methods=['GET'])
def home():
    """Simple homepage to confirm the API is running."""
    return jsonify({
        'message': '🏥 Prescription Interaction Drift Tracker API is running!',
        'available_endpoints': {
            'dashboard': '/api/dashboard',
            'medicines': '/api/medicines',
            'patients': '/api/patients',
            'doctors': '/api/doctors'
        }
    })

if __name__ == '__main__':
    print("\n" + "=" * 50)
    print("  PRESCRIPTION DRIFT TRACKER — Starting Up")
    print("=" * 50 + "\n")

    # Seed data on first run
    import_medicines_from_csv()
    seed_all()

    print("\n🚀 Starting Flask server on http://localhost:5000")
    print("   API docs: http://localhost:5000/api/dashboard\n")

    app.run(debug=True, port=5000, use_reloader=False)